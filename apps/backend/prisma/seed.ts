import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import * as dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding EduBranch AI Microsoft SQL Server Database...');

  const adminUsername = process.env.ADMIN_USERNAME || 'admin';
  const adminPassword = process.env.ADMIN_PASSWORD;
  const seedUserPassword = process.env.SEED_USER_PASSWORD;
  if (!adminPassword || !seedUserPassword || adminPassword.startsWith('YOUR_') || seedUserPassword.startsWith('YOUR_')) {
    throw new Error('Set ADMIN_PASSWORD and SEED_USER_PASSWORD in .env before seeding');
  }
  const hashedAdminPassword = await bcrypt.hash(adminPassword, 10);
  const hashedUserPassword = await bcrypt.hash(seedUserPassword, 10);

  // 1. Seed Admin
  const admin = await prisma.user.upsert({
    where: { email: `${adminUsername}@university.edu.vn` },
    update: {},
    create: {
      email: `${adminUsername}@university.edu.vn`,
      passwordHash: hashedAdminPassword,
      fullName: 'Quản trị viên Hệ thống (Admin)',
      role: 'ADMIN',
      status: 'ACTIVE',
    },
  });

  // 2. Seed Lecturers
  const lecturer1 = await prisma.user.upsert({
    where: { email: 'an.nguyen@university.edu.vn' },
    update: {},
    create: {
      email: 'an.nguyen@university.edu.vn',
      passwordHash: hashedUserPassword,
      fullName: 'TS. Nguyễn Văn An',
      role: 'LECTURER',
      status: 'ACTIVE',
      department: 'Khoa Công nghệ Thông tin',
    },
  });

  const lecturer2 = await prisma.user.upsert({
    where: { email: 'mai.tran@university.edu.vn' },
    update: {},
    create: {
      email: 'mai.tran@university.edu.vn',
      passwordHash: hashedUserPassword,
      fullName: 'ThS. Trần Thị Mai',
      role: 'LECTURER',
      status: 'PENDING', // Pending Admin approval
      department: 'Khoa Quản trị Kinh doanh',
    },
  });

  // 3. Seed Students
  const student1 = await prisma.user.upsert({
    where: { email: 'khoi.lm21@student.edu.vn' },
    update: {},
    create: {
      email: 'khoi.lm21@student.edu.vn',
      passwordHash: hashedUserPassword,
      fullName: 'Lê Minh Khôi',
      role: 'STUDENT',
      status: 'ACTIVE',
      studentCode: '21020451',
    },
  });

  const student2 = await prisma.user.upsert({
    where: { email: 'trang.pt21@student.edu.vn' },
    update: {},
    create: {
      email: 'trang.pt21@student.edu.vn',
      passwordHash: hashedUserPassword,
      fullName: 'Phạm Thu Trang',
      role: 'STUDENT',
      status: 'ACTIVE',
      studentCode: '21020789',
    },
  });

  // 4. Seed Course
  const course1 = await prisma.course.upsert({
    where: { classCode: 'SE2024' },
    update: {},
    create: {
      name: 'CS301 - Kỹ thuật phần mềm & Kiến trúc hệ thống',
      code: 'CS301',
      term: 'Học kỳ I 2024-2025',
      description: 'Học phần về kiến trúc phân tán, khả năng chịu tải và xử lý sự cố quy mô lớn.',
      lecturerId: lecturer1.id,
      classCode: 'SE2024',
    },
  });

  console.log('Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
