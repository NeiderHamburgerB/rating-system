import { Module } from '@nestjs/common';
import { MatterEnrollService } from './matter-enroll.service';
import { MatterEnrollController } from './matter-enroll.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MatterEnroll } from 'src/models/matter-enroll/matter-enroll.entity';

@Module({
  imports:[
    TypeOrmModule.forFeature([MatterEnroll]),
  ],
  controllers: [MatterEnrollController],
  providers: [MatterEnrollService]
})
export class MatterEnrollModule {}
