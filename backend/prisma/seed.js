import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';

const prisma = new PrismaClient();

function generateContentHash(text) {
  const norm = text.toLowerCase().replace(/[^\w\s]/gi, '').replace(/\s+/g, ' ').trim();
  return crypto.createHash('sha256').update(norm).digest('hex');
}

function normalizeText(text) {
  return text.toLowerCase().replace(/[^\w\s]/gi, '').replace(/\s+/g, ' ').trim();
}

async function main() {
  console.log('Seeding Quentrix AI MySQL Database...');

  // 1. Clear existing seed data safely
  console.log('Clearing existing records...');
  await prisma.notification.deleteMany();
  await prisma.chatMessage.deleteMany();
  await prisma.chatConversation.deleteMany();
  await prisma.leaderboardEntry.deleteMany();
  await prisma.codeSubmission.deleteMany();
  await prisma.mockTestAttempt.deleteMany();
  await prisma.mockTest.deleteMany();
  await prisma.result.deleteMany();
  await prisma.studentAnswer.deleteMany();
  await prisma.examAttempt.deleteMany();
  await prisma.examQuestion.deleteMany();
  await prisma.exam.deleteMany();
  await prisma.questionExposureHistory.deleteMany();
  await prisma.questionOption.deleteMany();
  await prisma.question.deleteMany();
  await prisma.topic.deleteMany();
  await prisma.unit.deleteMany();
  await prisma.subject.deleteMany();
  await prisma.studentProfile.deleteMany();
  await prisma.adminProfile.deleteMany();
  await prisma.stream.deleteMany();
  await prisma.user.deleteMany();

  // 2. Hash default password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash('Password@123', salt);

  // 3. Create Admin User
  console.log('Creating Admin User...');
  const adminUser = await prisma.user.create({
    data: {
      email: 'admin@quentrix.ai',
      password: hashedPassword,
      role: 'ADMIN',
      firstName: 'Dr. Aris',
      lastName: 'Thorne',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80',
      adminProfile: {
        create: {
          department: 'School of Computing & Mathematical Sciences',
          title: 'Head of Academic Examination & Assessment',
          institution: 'National Institute of Technology & AI'
        }
      }
    }
  });

  // 4. Create 9 Engineering Streams
  console.log('Creating Engineering Streams...');
  const streamData = [
    { name: 'Computer Science and Engineering', code: 'CSE', desc: 'Algorithms, systems, databases, networks and AI' },
    { name: 'Information Technology', code: 'IT', desc: 'Full-stack software engineering, web, cloud systems, and cyber security' },
    { name: 'Artificial Intelligence and Data Science', code: 'AIDS', desc: 'Machine learning, neural networks, computer vision and analytics' },
    { name: 'Electronics and Communication Engineering', code: 'ECE', desc: 'Digital signal processing, VLSI design, and microprocessors' },
    { name: 'Electrical and Electronics Engineering', code: 'EEE', desc: 'Power systems, electric machinery, and control theory' },
    { name: 'Mechanical Engineering', code: 'MECH', desc: 'Thermodynamics, fluid mechanics, and materials strength' },
    { name: 'Civil Engineering', code: 'CIVIL', desc: 'Structural engineering, hydraulics, and survey mechanics' },
    { name: 'Chemical Engineering', code: 'CHEM', desc: 'Transport phenomena, thermodynamics, and reaction kinetics' },
    { name: 'Biotechnology', code: 'BIOTECH', desc: 'Bioprocess engineering, bioinformatics, and genetic analysis' }
  ];

  const streamMap = {};
  for (const s of streamData) {
    const stream = await prisma.stream.create({
      data: {
        name: s.name,
        code: s.code,
        description: s.desc
      }
    });
    streamMap[s.code] = stream;
  }

  // 5. Create Subjects, Units & Topics for CSE
  console.log('Creating Academic Hierarchy for CSE...');
  const cseStream = streamMap['CSE'];

  const dsSubject = await prisma.subject.create({
    data: {
      name: 'Data Structures',
      code: 'CS201',
      streamId: cseStream.id,
      description: 'Fundamental non-linear structures, balanced search trees and hashing'
    }
  });

  const osSubject = await prisma.subject.create({
    data: {
      name: 'Operating Systems',
      code: 'CS301',
      streamId: cseStream.id,
      description: 'Processes, concurrency, synchronization, deadlocks, and virtual memory'
    }
  });

  const dbmsSubject = await prisma.subject.create({
    data: {
      name: 'Database Management Systems',
      code: 'CS302',
      streamId: cseStream.id,
      description: 'Relational algebra, normalization, transactions, and indexing'
    }
  });

  // Units & Topics for Data Structures
  const unitTrees = await prisma.unit.create({
    data: {
      unitNumber: 3,
      name: 'Non-Linear Hierarchical Structures',
      subjectId: dsSubject.id
    }
  });

  const topicBst = await prisma.topic.create({
    data: {
      name: 'Trees',
      unitId: unitTrees.id,
      description: 'Binary trees, BST properties, AVL rotations, and traversal algorithms'
    }
  });

  const topicArrays = await prisma.topic.create({
    data: {
      name: 'Arrays',
      unitId: unitTrees.id,
      description: 'Memory offset arithmetic, 2D buffers and sliding window algorithms'
    }
  });

  const topicLinkedLists = await prisma.topic.create({
    data: {
      name: 'Linked Lists',
      unitId: unitTrees.id,
      description: 'Singly, doubly, and cycle detection mechanisms'
    }
  });

  const topicGraphs = await prisma.topic.create({
    data: {
      name: 'Graphs',
      unitId: unitTrees.id,
      description: 'Adjacency matrices, BFS/DFS, and shortest paths'
    }
  });

  // 6. Create Student User
  console.log('Creating Student User...');
  const studentUser = await prisma.user.create({
    data: {
      email: 'student@quentrix.ai',
      password: hashedPassword,
      role: 'STUDENT',
      firstName: 'Aditya',
      lastName: 'Vardhan',
      avatarUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=250&q=80',
      studentProfile: {
        create: {
          rollNumber: '22CS8042',
          institution: 'Indian Institute of Engineering & Technology',
          yearOfStudy: '3rd Year (Semester 6)',
          streamId: cseStream.id
        }
      }
    }
  });

  // 7. Create Questions with Options
  console.log('Seeding Question Bank Repository...');
  const questionItems = [
    {
      text: 'What is the maximum number of nodes in a binary tree of height h (where height of a tree with single root node is 0)?',
      type: 'MCQ',
      difficulty: 'MEDIUM',
      defaultMarks: 2.0,
      negativeMarks: 0.5,
      topicId: topicBst.id,
      subjectId: dsSubject.id,
      streamId: cseStream.id,
      explanation: 'Sum of 2^0 + 2^1 + ... + 2^h = 2^(h+1) - 1 nodes.',
      options: [
        { optionKey: 'A', text: '2^(h) - 1', isCorrect: false },
        { optionKey: 'B', text: '2^(h+1) - 1', isCorrect: true },
        { optionKey: 'C', text: '2^(h-1) + 1', isCorrect: false },
        { optionKey: 'D', text: '2^(2h) - 1', isCorrect: false }
      ]
    },
    {
      text: 'In an AVL Tree, what is the maximum permissible difference between the heights of the left and right subtrees for any node?',
      type: 'MCQ',
      difficulty: 'HARD',
      defaultMarks: 3.0,
      negativeMarks: 1.0,
      topicId: topicBst.id,
      subjectId: dsSubject.id,
      streamId: cseStream.id,
      explanation: 'The balance factor BF = height(left) - height(right) must belong to {-1, 0, 1}. Maximum allowable absolute difference is 1.',
      options: [
        { optionKey: 'A', text: '0', isCorrect: false },
        { optionKey: 'B', text: '1', isCorrect: true },
        { optionKey: 'C', text: '2', isCorrect: false },
        { optionKey: 'D', text: 'Any positive integer', isCorrect: false }
      ]
    },
    {
      text: 'Which of the following self-balancing binary search trees guarantee worst-case O(log n) time complexity for search, insert, and delete operations? (Select all that apply)',
      type: 'MULTIPLE_SELECT',
      difficulty: 'MEDIUM',
      defaultMarks: 4.0,
      negativeMarks: 1.0,
      topicId: topicBst.id,
      subjectId: dsSubject.id,
      streamId: cseStream.id,
      explanation: 'Both Red-Black and AVL trees guarantee strict O(log n) worst-case time. Standard BST degrades to O(n), and Splay Tree guarantees amortized O(log n).',
      options: [
        { optionKey: 'A', text: 'Red-Black Tree', isCorrect: true },
        { optionKey: 'B', text: 'AVL Tree', isCorrect: true },
        { optionKey: 'C', text: 'Standard Unbalanced BST', isCorrect: false },
        { optionKey: 'D', text: 'Splay Tree', isCorrect: false }
      ]
    },
    {
      text: 'Inorder traversal of any valid Binary Search Tree (BST) produces keys in strictly ascending order.',
      type: 'TRUE_FALSE',
      difficulty: 'EASY',
      defaultMarks: 1.0,
      negativeMarks: 0.25,
      topicId: topicBst.id,
      subjectId: dsSubject.id,
      streamId: cseStream.id,
      explanation: 'In a BST, keys in the left subtree are smaller than the node, and keys in the right subtree are greater. Hence Inorder (L, Root, R) yields sorted order.',
      options: [
        { optionKey: 'A', text: 'True', isCorrect: true },
        { optionKey: 'B', text: 'False', isCorrect: false }
      ]
    },
    {
      text: 'What is the time complexity to access an element at index k in a contiguous array of size N?',
      type: 'MCQ',
      difficulty: 'EASY',
      defaultMarks: 2.0,
      negativeMarks: 0.5,
      topicId: topicArrays.id,
      subjectId: dsSubject.id,
      streamId: cseStream.id,
      explanation: 'Arrays offer constant-time O(1) random access via direct memory offset calculation: Address = Base + k * sizeof(element).',
      options: [
        { optionKey: 'A', text: 'O(1)', isCorrect: true },
        { optionKey: 'B', text: 'O(log N)', isCorrect: false },
        { optionKey: 'C', text: 'O(k)', isCorrect: false },
        { optionKey: 'D', text: 'O(N)', isCorrect: false }
      ]
    },
    {
      text: "Floyd's Cycle-Finding Algorithm (Tortoise and Hare) detects a loop in a linked list using two pointers. What is its auxiliary space complexity?",
      type: 'MCQ',
      difficulty: 'MEDIUM',
      defaultMarks: 2.0,
      negativeMarks: 0.5,
      topicId: topicLinkedLists.id,
      subjectId: dsSubject.id,
      streamId: cseStream.id,
      explanation: "Floyd's cycle detection only tracks two pointers, requiring O(1) constant auxiliary memory without requiring a hash set.",
      options: [
        { optionKey: 'A', text: 'O(N)', isCorrect: false },
        { optionKey: 'B', text: 'O(log N)', isCorrect: false },
        { optionKey: 'C', text: 'O(1)', isCorrect: true },
        { optionKey: 'D', text: 'O(N^2)', isCorrect: false }
      ]
    },
    {
      text: 'Write an algorithm to compute the maximum depth (height) of a binary tree given the root node.',
      type: 'PROGRAMMING',
      difficulty: 'MEDIUM',
      defaultMarks: 10.0,
      negativeMarks: 0.0,
      topicId: topicBst.id,
      subjectId: dsSubject.id,
      streamId: cseStream.id,
      explanation: 'Depth-first recursive traversal returning 1 + max(depth(left), depth(right)).',
      codeProblemDetails: {
        timeLimit: '1.0s',
        memoryLimit: '256 MB',
        inputFormat: 'Serialized level-order traversal of nodes.',
        outputFormat: 'Integer representing maximum depth.',
        constraints: ['0 <= Number of nodes <= 10^4', '-100 <= Node.val <= 100'],
        sampleCases: [{ input: 'root = [3,9,20,null,null,15,7]', output: '3' }],
        hiddenCases: [{ input: 'root = [1,null,2]', output: '2' }]
      },
      options: []
    }
  ];

  const createdQuestions = [];
  for (const q of questionItems) {
    const question = await prisma.question.create({
      data: {
        text: q.text,
        type: q.type,
        difficulty: q.difficulty,
        defaultMarks: q.defaultMarks,
        negativeMarks: q.negativeMarks,
        explanation: q.explanation,
        contentHash: generateContentHash(q.text),
        normalizedText: normalizeText(q.text),
        isApproved: true,
        timesUsed: 14,
        streamId: q.streamId,
        subjectId: q.subjectId,
        topicId: q.topicId,
        codeProblemDetails: q.codeProblemDetails || null,
        options: {
          create: q.options.map((opt, idx) => ({
            optionKey: opt.optionKey,
            text: opt.text,
            isCorrect: opt.isCorrect,
            sortOrder: idx
          }))
        }
      }
    });
    createdQuestions.push(question);
  }

  // 8. Create Active Mid-Term Exam
  console.log('Creating Official Examinations...');
  const activeExam = await prisma.exam.create({
    data: {
      title: 'Data Structures & Algorithms Comprehensive Mid-Term',
      description: 'Formal academic midterm covering non-linear data structures, binary search trees, and graph traversals.',
      streamId: cseStream.id,
      subjectId: dsSubject.id,
      topicName: 'Trees, Arrays & Linked Lists',
      durationMinutes: 45,
      totalMarks: 50.0,
      passMarks: 20.0,
      negativeMarking: true,
      negativeMarks: 0.5,
      difficulty: 'MEDIUM',
      questionType: 'MIXED',
      status: 'ACTIVE',
      startDate: new Date(Date.now() - 2 * 86400000),
      endDate: new Date(Date.now() + 10 * 86400000),
      maxAttempts: 1,
      shuffleQuestions: true,
      shuffleOptions: true,
      createdById: adminUser.id,
      examQuestions: {
        create: createdQuestions.map((q, idx) => ({
          questionId: q.id,
          orderNumber: idx + 1,
          marks: q.defaultMarks,
          negativeMarks: q.negativeMarks
        }))
      }
    }
  });

  // Upcoming Exam
  await prisma.exam.create({
    data: {
      title: 'Operating Systems Concurrency & Deadlocks Assessment',
      description: "Evaluates mastery over Banker's Algorithm, semaphores, mutex locks, and virtual memory paging.",
      streamId: cseStream.id,
      subjectId: osSubject.id,
      topicName: 'Deadlocks & Process Synchronization',
      durationMinutes: 60,
      totalMarks: 60.0,
      passMarks: 24.0,
      negativeMarking: true,
      negativeMarks: 0.5,
      difficulty: 'HARD',
      questionType: 'MCQ',
      status: 'SCHEDULED',
      startDate: new Date(Date.now() + 5 * 86400000),
      endDate: new Date(Date.now() + 8 * 86400000),
      maxAttempts: 1,
      createdById: adminUser.id
    }
  });

  // Completed Exam with student result
  const completedExam = await prisma.exam.create({
    data: {
      title: 'Database Systems & SQL Optimization Final Quiz',
      description: 'Core evaluation on 1NF through BCNF normalization, ACID properties, and B+ tree indexing.',
      streamId: cseStream.id,
      subjectId: dbmsSubject.id,
      topicName: 'Normalization & Transactions',
      durationMinutes: 40,
      totalMarks: 40.0,
      passMarks: 16.0,
      negativeMarking: false,
      negativeMarks: 0.0,
      difficulty: 'EASY',
      questionType: 'MCQ',
      status: 'COMPLETED',
      startDate: new Date(Date.now() - 20 * 86400000),
      endDate: new Date(Date.now() - 18 * 86400000),
      maxAttempts: 2,
      createdById: adminUser.id
    }
  });

  // Create Completed Attempt & Result
  const attempt = await prisma.examAttempt.create({
    data: {
      examId: completedExam.id,
      userId: studentUser.id,
      attemptNumber: 1,
      status: 'SUBMITTED',
      startedAt: new Date(Date.now() - 19 * 86400000),
      expiresAt: new Date(Date.now() - 19 * 86400000 + 40 * 60000),
      submittedAt: new Date(Date.now() - 19 * 86400000 + 28 * 60000)
    }
  });

  await prisma.result.create({
    data: {
      attemptId: attempt.id,
      examId: completedExam.id,
      userId: studentUser.id,
      totalQuestions: 20,
      correctAnswers: 18,
      incorrectAnswers: 2,
      unansweredCount: 0,
      totalMarks: 40.0,
      obtainedMarks: 36.0,
      percentage: 90.0,
      isPassed: true,
      timeTakenSeconds: 28 * 60,
      topicAccuracy: {
        'Normalization': 92,
        'Transactions': 88
      },
      aiAnalysis: {
        overallAccuracy: '90.0%',
        speedRating: 'Fast & Decisive',
        strongArea: 'Relational Decomposition & Normal Forms',
        focusArea: 'Review isolation anomalies under Repeatable Read.',
        percentile: 96
      }
    }
  });

  // 9. Create Leaderboard Entries
  console.log('Seeding Leaderboard Roster...');
  const peers = [
    { name: 'Siddharth Rao', email: 'siddharth.r@quentrix.ai', score: 890, avg: 96.4, rank: 1, tier: 'Diamond Master' },
    { name: 'Ananya Sharma', email: 'ananya.s@quentrix.ai', score: 865, avg: 94.8, rank: 2, tier: 'Diamond Master' },
    { name: 'Vikramaditya Bose', email: 'vikram.b@quentrix.ai', score: 840, avg: 92.5, rank: 3, tier: 'Platinum Pro' },
    { name: 'Aditya Vardhan', email: 'student@quentrix.ai', score: 785, avg: 88.6, rank: 4, tier: 'Code Grandmaster' }
  ];

  for (const p of peers) {
    let u = (p.email === studentUser.email) ? studentUser : await prisma.user.create({
      data: {
        email: p.email,
        password: hashedPassword,
        role: 'STUDENT',
        firstName: p.name.split(' ')[0],
        lastName: p.name.split(' ')[1] || 'Scholar',
        studentProfile: {
          create: {
            institution: 'Indian Institute of Engineering & Technology',
            yearOfStudy: '3rd Year',
            streamId: cseStream.id
          }
        }
      }
    });

    await prisma.leaderboardEntry.create({
      data: {
        userId: u.id,
        streamId: cseStream.id,
        rank: p.rank,
        totalScore: p.score,
        examsCount: 14,
        avgPercentage: p.avg,
        honorTier: p.tier
      }
    });
  }

  console.log('Quentrix AI Database successfully seeded with 9 streams, academic subjects, question bank, active exam, and peer roster!');
}

main()
  .catch((e) => {
    console.error('Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

