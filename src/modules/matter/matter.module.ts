import { Module } from '@nestjs/common';
import { MatterService } from './matter.service';
import { MatterController } from './matter.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Matter } from 'src/models/matter/matter.entity';

@Module({
  imports:[
    TypeOrmModule.forFeature([Matter]),
  ],
  controllers: [MatterController],
  providers: [MatterService]
})
export class MatterModule {}
