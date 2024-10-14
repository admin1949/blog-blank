import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
  UploadedFile,
  UseInterceptors,
  StreamableFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileService } from './file.service';
import { RES } from '@/res';
import { Public } from '@/public';
import { createReadStream } from 'fs';

interface Pager {
  pageNum?: number;
  pageSize?: number;
}

@Controller('file')
export class FileController {
  constructor(private readonly fileService: FileService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async upload(@UploadedFile() file: Express.Multer.File) {
    const sortPath = await this.fileService.saveFile(file);
    const res = await this.fileService.create({
      fileName: file.originalname,
      size: file.size,
      extension: sortPath.slice(sortPath.lastIndexOf('.') + 1),
      sortPath,
      createTime: new Date(),
    });
    return RES.SUCCESS(res);
  }

  @Post('list-all')
  async findAll(@Body() body: Pager) {
    const { pageNum = 1, pageSize = 10 } = body;
    const { total, data } = await this.fileService.findAll({
      skip: (pageNum - 1) * pageSize,
      take: pageSize,
      orderBy: {
        createTime: 'desc',
      },
    });
    return RES.LIST_SUCCESS(data, total);
  }

  @Get('delete/:id')
  async remove(@Param('id') id: string) {
    const status = await this.fileService.remove(+id);
    if (status) {
      return RES.SUCCESS(status, '操作成功');
    }
    return RES.ERROR(400, status);
  }

  @Public()
  @Get('preview/:id')
  async findOne(@Param('id') id: string) {
    const file = await this.fileService.findOne(+id);
    if (!file) {
      throw new NotFoundException();
    }
    const fullPath = this.fileService.getFullPath(file.sortPath);
    const readStream = createReadStream(fullPath);
    return new StreamableFile(readStream);
  }
}
