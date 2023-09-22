import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { LocalService } from 'src/config/passport/services/local.service';
import { StudentsModule } from '../student/student.module';
import { PassportModule } from 'src/config/passport/passport.module';
import { JwtService } from 'src/config/passport/services/jwt.service';

@Module({
  imports: [StudentsModule, PassportModule],
  controllers: [AuthController],
  providers: [AuthService, LocalService, JwtService],
})
export class AuthModule {}
