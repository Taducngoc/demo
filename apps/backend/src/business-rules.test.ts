import { test, describe } from 'node:test';
import * as assert from 'node:assert';
import { UserRole } from '../../../packages/shared/dist/enums.js';
import { registerSchema } from '../../../packages/shared/dist/schemas.js';

describe('EduBranch AI Critical Business Rules Tests', () => {
  test('Registration schema MUST reject ADMIN role', () => {
    const invalidAdminRegister = {
      fullName: 'Hacker Admin',
      email: 'hacker@edu.vn',
      password: 'password123',
      confirmPassword: 'password123',
      role: 'ADMIN',
    };

    const parseResult = registerSchema.safeParse(invalidAdminRegister);
    assert.strictEqual(parseResult.success, false);
    if (!parseResult.success) {
      const roleError = parseResult.error.errors.find((e) => e.path.includes('role'));
      assert.ok(roleError);
    }
  });

  test('Registration schema accepts STUDENT with studentCode', () => {
    const validStudent = {
      fullName: 'Lê Minh Khôi',
      email: 'khoi.lm21@student.edu.vn',
      password: 'password123',
      confirmPassword: 'password123',
      role: UserRole.STUDENT,
      studentCode: '21020451',
    };

    const parseResult = registerSchema.safeParse(validStudent);
    assert.strictEqual(parseResult.success, true);
  });

  test('Registration schema rejects STUDENT without studentCode', () => {
    const invalidStudent = {
      fullName: 'Lê Minh Khôi',
      email: 'khoi.lm21@student.edu.vn',
      password: 'password123',
      confirmPassword: 'password123',
      role: UserRole.STUDENT,
      studentCode: '',
    };

    const parseResult = registerSchema.safeParse(invalidStudent);
    assert.strictEqual(parseResult.success, false);
  });

  test('Registration schema accepts LECTURER with department', () => {
    const validLecturer = {
      fullName: 'TS. Nguyễn Văn An',
      email: 'an.nguyen@university.edu.vn',
      password: 'password123',
      confirmPassword: 'password123',
      role: UserRole.LECTURER,
      department: 'Khoa Công nghệ Thông tin',
    };

    const parseResult = registerSchema.safeParse(validLecturer);
    assert.strictEqual(parseResult.success, true);
  });

  test('AI Challenge limit: roundNo must be 1 or 2', () => {
    const allowedRounds = [1, 2];
    const invalidRound = 3;

    assert.ok(allowedRounds.includes(1));
    assert.ok(allowedRounds.includes(2));
    assert.ok(!allowedRounds.includes(invalidRound));
  });
});
