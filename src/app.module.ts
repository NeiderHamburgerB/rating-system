import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ApiModule } from './modules';
import { EnvModule } from './config/env/env.module';
import { DatabaseModule } from './config/database/database.module';
import { MatterEnrollModule } from './modules/matter-enroll/matter-enroll.module';

@Module({
  imports: [
    EnvModule,
    DatabaseModule,
    ApiModule,
    MatterEnrollModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
