import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  Req,
  ForbiddenException,
} from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { Request } from 'express';

@ApiTags('admin')
@Controller('admin')
export class AdminController {
  private checkLocalhost(req: Request) {
    if (process.env.ADMIN_LOCALHOST_ONLY === 'true') {
      const ip = req.ip || req.socket.remoteAddress;
      const isLocal = ip === '127.0.0.1' || ip === '::1' || ip === '::ffff:127.0.0.1';
      if (!isLocal) {
        throw new ForbiddenException(
          'ADMIN_LOCALHOST_ONLY: API quản trị chỉ chấp nhận kết nối từ 127.0.0.1 hoặc ::1.'
        );
      }
    }
  }

  @Post('approve-lecturer/:userId')
  @ApiOperation({ summary: 'Admin phê duyệt tài khoản Giảng viên' })
  approveLecturer(@Param('userId') userId: string, @Req() req: Request) {
    this.checkLocalhost(req);
    return { message: `Đã phê duyệt giảng viên ${userId}`, status: 'ACTIVE' };
  }

  @Post('reject-lecturer/:userId')
  @ApiOperation({ summary: 'Admin từ chối duyệt tài khoản Giảng viên' })
  rejectLecturer(
    @Param('userId') userId: string,
    @Body('reason') reason: string,
    @Req() req: Request
  ) {
    this.checkLocalhost(req);
    return { message: `Đã từ chối giảng viên ${userId}`, reason, status: 'REJECTED' };
  }
}
