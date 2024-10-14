import { Injectable } from '@nestjs/common';
import { ensureDir, writeFile, unlink } from 'fs-extra';
import * as dayjs from 'dayjs';
import { Prisma } from '@prisma/client';
import { PrismaService } from '@/prisam/prisam.service';
import { join } from 'path';

@Injectable()
export class FileService {
  constructor(private readonly PrismaService: PrismaService) {}

  getFullPath(sortPath: string) {
    return join(process.env['FILE-PATH'], sortPath);
  }
  private buildSavePath(fileName: string) {
    const ext = fileName.slice(fileName.lastIndexOf('.') + 1);
    const prefix = process.env['FILE-PATH'];
    let dir = dayjs().format('YYYY_MM');
    const now = Date.now();
    const name = ext ? `${now}.${ext}` : `${now}`;
    const sortPath = `${dir}/${name}`;

    dir = join(prefix, dir);
    return [dir, name, sortPath];
  }

  async saveFile(file: Express.Multer.File) {
    const [dir, name, sortPath] = this.buildSavePath(file.originalname);
    await ensureDir(dir);
    await writeFile(`${dir}/${name}`, file.buffer);
    return sortPath;
  }

  async create(createFileDto: Prisma.FileCreateInput) {
    return this.PrismaService.file.create({
      data: createFileDto,
    });
  }

  async findAll(
    params: {
      skip?: number;
      take?: number;
      cursor?: Prisma.FileWhereUniqueInput;
      where?: Prisma.FileWhereInput;
      orderBy?: Prisma.FileOrderByWithRelationInput;
    } = {},
  ) {
    const { skip, take, cursor, where, orderBy } = params;

    const data = await this.PrismaService.file.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
    });

    const total = await this.PrismaService.file.count({
      where: where,
    });
    return {
      total,
      data,
    };
  }

  async findOne(id: number) {
    return this.PrismaService.file.findUnique({
      where: {
        id,
      },
    });
  }

  async remove(id: number) {
    const file = await this.PrismaService.file.delete({
      where: { id },
    });

    if (!file) {
      return false;
    }

    const fullPath = this.getFullPath(file.sortPath);
    await unlink(fullPath);
    return true;
  }
}
