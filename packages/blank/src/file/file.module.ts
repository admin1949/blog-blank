import { Module } from '@nestjs/common';
import { FileController } from './file.controller';
import { FileService } from './file.service';
import { PrismaService } from '@/prisam/prisam.service';

@Module({
  controllers: [FileController],
  providers: [FileService, PrismaService],
  exports: [FileService],
})
export class FileModule {}
