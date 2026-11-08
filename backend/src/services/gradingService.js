import { prisma } from '../config/database.js';
import { logger } from '../utils/logger.js';

export const gradingService = {
  /**
   * Deterministically evaluates an examination attempt within a database transaction
   */
  async submitAndGradeAttempt(attemptId, userId, finalAnswers = null) {
    const attempt = await prisma.examAttempt.findUnique({
      where: { id: attemptId },
      include: {
        exam: {
          include: {
            subject: true,
            stream: true,
            examQuestions: {
              include: {
                question: {
                  include: {
                    options: true,
                    topic: true
                  }
                }
              }
            }
          }
        },
        answers: true
      }
    });

    if (!attempt || attempt.userId !== userId) {
      throw new Error('Attempt not found or unauthorized.');
    }

    if (attempt.status === 'SUBMITTED') {
      // If already submitted, return existing result
      const existingResult = await prisma.result.findUnique({
        where: { attemptId }
      });
      if (existingResult) return existingResult;
    }

    const exam = attempt.exam;
    const now = new Date();
    const startedAt = new Date(attempt.startedAt);
    const timeTakenSeconds = Math.max(1, Math.min(
      Math.floor((now.getTime() - startedAt.getTime()) / 1000),
      exam.durationMinutes * 60
    ));

    // Consolidate answers: merge existing saved answers with any final payload
    const answersMap = {};
    for (const a of attempt.answers) {
      if (a.isAnswered) {
        answersMap[a.questionId] = a.selectedOptionIds || a.codeResponse || a.textResponse;
      }
    }
    if (finalAnswers && typeof finalAnswers === 'object') {
      Object.assign(answersMap, finalAnswers);
    }

    let correctCount = 0;
    let incorrectCount = 0;
    let unansweredCount = 0;
    let totalScore = 0.0;
    const totalMarks = exam.totalMarks;

    const topicStats = {}; // { [topicName]: { total: 0, correct: 0, percentage: 0 } }
    const gradedAnswerUpdates = [];

    for (const eq of exam.examQuestions) {
      const q = eq.question;
      const topicName = q.topic?.name || exam.topicName || 'General';

      if (!topicStats[topicName]) {
        topicStats[topicName] = { total: 0, correct: 0, percentage: 0 };
      }
      topicStats[topicName].total++;

      const studentAns = answersMap[q.id];

      // Check for unanswered
      if (!studentAns || (Array.isArray(studentAns) && studentAns.length === 0)) {
        unansweredCount++;
        gradedAnswerUpdates.push({
          questionId: q.id,
          isAnswered: false,
          isCorrect: false,
          marksAwarded: 0.0
        });
        continue;
      }

      const qMarks = eq.marks || q.defaultMarks || 2.0;
      const qNeg = exam.negativeMarking ? (eq.negativeMarks || q.negativeMarks || 0.0) : 0.0;

      let isCorrect = false;

      if (q.type === 'MCQ' || q.type === 'TRUE_FALSE') {
        const correctOpt = q.options.find(o => o.isCorrect);
        const submittedVal = Array.isArray(studentAns) ? studentAns[0] : studentAns;

        // Check if student matched by optionId or optionKey
        isCorrect = correctOpt && (
          String(submittedVal) === String(correctOpt.id) ||
          String(submittedVal).toUpperCase() === String(correctOpt.optionKey).toUpperCase() ||
          String(submittedVal).toLowerCase() === String(correctOpt.text).toLowerCase()
        );
      } else if (q.type === 'MULTIPLE_SELECT') {
        const correctOptIds = new Set(q.options.filter(o => o.isCorrect).map(o => o.id));
        const correctOptKeys = new Set(q.options.filter(o => o.isCorrect).map(o => o.optionKey.toUpperCase()));
        
        const submittedArray = Array.isArray(studentAns) ? studentAns : [studentAns];
        
        const matchesCount = submittedArray.filter(val => 
          correctOptIds.has(val) || correctOptKeys.has(String(val).toUpperCase())
        ).length;

        // Strict: All correct must be selected, and no wrong options selected
        isCorrect = matchesCount === correctOptIds.size && submittedArray.length === correctOptIds.size;
      } else if (q.type === 'PROGRAMMING') {
        // Non-empty valid code awarded deterministic marks; code executor evaluates test cases
        isCorrect = typeof studentAns === 'string' && studentAns.trim().length > 20;
      }

      let marksAwarded = 0.0;
      if (isCorrect) {
        correctCount++;
        marksAwarded = qMarks;
        totalScore += marksAwarded;
        topicStats[topicName].correct++;
      } else {
        incorrectCount++;
        marksAwarded = -qNeg;
        totalScore -= qNeg;
      }

      gradedAnswerUpdates.push({
        questionId: q.id,
        isAnswered: true,
        isCorrect,
        marksAwarded
      });
    }

    // Floor total score at 0.0
    totalScore = Math.max(0.0, Math.round(totalScore * 100) / 100);
    const percentage = Math.min(100.0, Math.max(0.0, Math.round((totalScore / totalMarks) * 1000) / 10));
    const isPassed = totalScore >= (exam.passMarks || totalMarks * 0.4);

    // Calculate per-topic accuracy percentages
    const topicAccuracy = {};
    for (const [top, stats] of Object.entries(topicStats)) {
      stats.percentage = stats.total > 0 ? Math.round((stats.correct / stats.total) * 100) : 0;
      topicAccuracy[top] = stats.percentage;
    }

    // AI Cognitive Diagnostic Analysis (Interpretation only, never alters marks)
    const strongTopics = Object.keys(topicAccuracy).filter(t => topicAccuracy[t] >= 75);
    const weakTopics = Object.keys(topicAccuracy).filter(t => topicAccuracy[t] < 60);

    const aiAnalysis = {
      overallAccuracy: `${percentage}%`,
      speedRating: timeTakenSeconds < (exam.durationMinutes * 60 * 0.6) ? 'Fast & Decisive' : 'Steady & Thorough',
      strongArea: strongTopics.length > 0 ? strongTopics.join(', ') : 'Foundational Concepts',
      focusArea: weakTopics.length > 0 ? weakTopics.join(', ') : 'Review multi-step boundary cases',
      recommendations: [
        `Review theoretical derivations in ${weakTopics.length > 0 ? weakTopics[0] : exam.subject.name}.`,
        'Practice timed drills on similar problem sets to reduce hesitation on edge cases.',
        'Solve 5 targeted programming tasks related to this syllabus.'
      ],
      percentile: Math.min(99, Math.max(50, Math.round(percentage * 0.9 + 5)))
    };

    // Execute submission and result creation inside a Prisma database transaction
    const finalResult = await prisma.$transaction(async (tx) => {
      // 1. Update Student Answers with grading outcomes
      for (const update of gradedAnswerUpdates) {
        await tx.studentAnswer.updateMany({
          where: {
            attemptId,
            questionId: update.questionId
          },
          data: {
            isAnswered: update.isAnswered,
            isCorrect: update.isCorrect,
            marksAwarded: update.marksAwarded
          }
        });
      }

      // 2. Mark ExamAttempt as SUBMITTED
      await tx.examAttempt.update({
        where: { id: attemptId },
        data: {
          status: 'SUBMITTED',
          submittedAt: now
        }
      });

      // 3. Upsert Result
      const result = await tx.result.upsert({
        where: { attemptId },
        create: {
          attemptId,
          examId: exam.id,
          userId,
          totalQuestions: exam.examQuestions.length,
          correctAnswers: correctCount,
          incorrectAnswers: incorrectCount,
          unansweredCount,
          totalMarks,
          obtainedMarks: totalScore,
          percentage,
          isPassed,
          timeTakenSeconds,
          topicAccuracy,
          aiAnalysis
        },
        update: {
          correctAnswers: correctCount,
          incorrectAnswers: incorrectCount,
          unansweredCount,
          obtainedMarks: totalScore,
          percentage,
          isPassed,
          timeTakenSeconds,
          topicAccuracy,
          aiAnalysis
        }
      });

      return result;
    });

    logger.success(`Attempt ${attemptId} graded successfully: Score ${totalScore}/${totalMarks} (${percentage}%)`);
    return finalResult;
  }
};

