import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('--- Cleaning Sample Students & Sample Exams from Database ---');

  // 1. Delete dependent exam & student records
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

  // 2. Delete sample exams
  const deletedExams = await prisma.exam.deleteMany();
  console.log(`Deleted ${deletedExams.count} sample exams.`);

  // 3. Delete student profiles and student users
  await prisma.studentProfile.deleteMany();
  const deletedStudents = await prisma.user.deleteMany({
    where: { role: 'STUDENT' }
  });
  console.log(`Deleted ${deletedStudents.count} sample student users.`);

  // 4. Verify remaining database state
  const remainingUsers = await prisma.user.findMany({
    select: { id: true, email: true, role: true }
  });
  const remainingExams = await prisma.exam.findMany();

  console.log('Remaining Users in DB:', remainingUsers);
  console.log(`Remaining Exams in DB: ${remainingExams.length}`);
}

main()
  .catch((e) => {
    console.error('Cleanup error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
