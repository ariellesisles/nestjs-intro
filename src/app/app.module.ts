import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [], // import all the module in your nestJS
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
