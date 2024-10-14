import { PrismaService } from '@/prisam/prisam.service';
import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';

@Injectable()
export class DictService {
  constructor(private readonly PrismaService: PrismaService) {}

  async create(createFileDto: Prisma.DictCreateInput) {
    return this.PrismaService.dict.create({
      data: createFileDto,
    });
  }

  async findAll(
    params: {
      skip?: number;
      take?: number;
      cursor?: Prisma.DictWhereUniqueInput;
      where?: Prisma.DictWhereInput;
      orderBy?: Prisma.DictOrderByWithRelationInput;
    } = {},
  ) {
    const { skip, take, cursor, where, orderBy } = params;

    const data = await this.PrismaService.dict.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
    });

    const total = await this.PrismaService.dict.count({
      where: where,
    });
    return {
      total,
      data,
    };
  }

  async findOne(id: number) {
    return this.PrismaService.dict.findUnique({
      where: {
        id,
      },
    });
  }

  async findOneByCode(code: string) {
    return this.PrismaService.dict.findUnique({
      where: {
        code,
      },
    });
  }

  async remove(id: number) {
    const file = await this.PrismaService.dict.delete({
      where: { id },
    });
  }

  async update(id: number, data: Prisma.DictUpdateInput) {
    await this.PrismaService.dict.update({
      where: { id },
      data,
    });
  }
}
