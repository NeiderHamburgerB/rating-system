import { Module } from '@nestjs/common';
import { StudentsModule } from './student/student.module';
import { AuthModule } from './auth/auth.module';
import { MatterModule } from './matter/matter.module';

@Module({
  imports: [AuthModule,StudentsModule, MatterModule],
  controllers: [],
})
export class ApiModule {}