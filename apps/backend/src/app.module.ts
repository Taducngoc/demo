import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { CasesModule } from './cases/cases.module';
import { AttemptsModule } from './attempts/attempts.module';
import { AdminModule } from './admin/admin.module';
import { AiModule } from './ai/ai.module';

@Module({
  imports: [
    AuthModule,
    CasesModule,
    AttemptsModule,
    AdminModule,
    AiModule,
  ],
})
export class AppModule {}
