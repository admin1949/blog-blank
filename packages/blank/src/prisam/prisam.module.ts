import { Module } from '@nestjs/common';
import { PrismaService } from './prisam.service';

@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrisamModule {}
