import {
  Controller,
  Post,
  Body,
  Get,
  Req,
  Res,
  UseGuards,
  ForbiddenException,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { UserRole, UserStatus } from '@edubranch/shared';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  @ApiOperation({ summary: 'Đăng ký tài khoản Sinh viên hoặc Giảng viên (Từ chối Admin)' })
  @ApiResponse({ status: 201, description: 'Đăng ký thành công' })
  @ApiResponse({ status: 403, description: 'Bị từ chối nếu yêu cầu role ADMIN' })
  async register(@Body() body: any) {
    // 1. Enforce rejection of ADMIN registration
    await this.authService.validateAdminRegistration(body.role);

    // 2. Validate role
    if (body.role !== UserRole.STUDENT && body.role !== UserRole.LECTURER) {
      throw new BadRequestException('Vai trò chỉ được chọn STUDENT hoặc LECTURER');
    }

    // 3. Lecturer is always set to PENDING
    const initialStatus =
      body.role === UserRole.LECTURER ? UserStatus.PENDING : UserStatus.ACTIVE;

    return {
      message:
        body.role === UserRole.LECTURER
          ? 'Đăng ký Giảng viên thành công. Tài khoản đang chờ Admin phê duyệt.'
          : 'Đăng ký Sinh viên thành công.',
      role: body.role,
      status: initialStatus,
    };
  }

  @Post('login')
  @ApiOperation({ summary: 'Đăng nhập người dùng' })
  async login(@Body() body: any) {
    return {
      message: 'Đăng nhập thành công',
      accessToken: 'mock-jwt-access-token',
    };
  }

  @Get('me')
  @ApiOperation({ summary: 'Lấy thông tin tài khoản đang đăng nhập' })
  async me() {
    return {
      user: {
        id: 'lecturer-1',
        fullName: 'TS. Nguyễn Văn An',
        role: UserRole.LECTURER,
        status: UserStatus.ACTIVE,
      },
    };
  }
}
