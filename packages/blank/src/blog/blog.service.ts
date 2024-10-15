import { PrismaService } from '@/prisam/prisam.service';
import { UtilService } from '@/util/util.service';
import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';

@Injectable()
export class BlogService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly utilService: UtilService,
  ) {}

  async findMany(opt: {
    where: Prisma.ProjectWhereInput;
    skip?: number;
    take?: number;
    cursor?: Prisma.ProjectWhereUniqueInput;
    orderBy?: Prisma.ProjectOrderByWithRelationInput;
  }) {
    const dataList = await this.prismaService.project.findMany({
      ...this.utilService.pick(opt, this.utilService.SEARCH_KEYS),
      include: {
        avatar: true,
        pics: {
          include: {
            file: true,
          },
        },
      },
    });

    return dataList.map((i) => {
      return {
        ...i,
        pics: i.pics.map((j) => j.file),
      };
    });
  }

  async findCount(opt: {
    where: Prisma.ProjectWhereInput;
    cursor?: Prisma.ProjectWhereUniqueInput;
  }) {
    const count = await this.prismaService.project.count(
      this.utilService.pick(opt, this.utilService.SEARCH_COUNT_KEY),
    );
    return count;
  }

  async create(data: Prisma.ProjectCreateInput) {
    return this.prismaService.project.create({
      data,
    });
  }

  async detail(where: Prisma.ProjectWhereUniqueInput) {
    const data = await this.prismaService.project.findUnique({
      where,
      include: {
        avatar: true,
        pics: {
          include: {
            file: true,
          },
        },
      },
    });
    if (!data) {
      return data;
    }
    return {
      ...data,
      pics: data.pics.map((i) => i.file),
    };
  }

  async update(
    where: Prisma.ProjectWhereUniqueInput,
    data: Prisma.ProjectUpdateInput,
    picIds?: number[],
  ) {
    if (picIds && where.id) {
      data.pics = {
        create: picIds.map((i, idx) => {
          return {
            fileId: i,
            sort: idx,
          };
        }),
      };
      await this.prismaService.projectPicFiles.deleteMany({
        where: {
          projectId: where.id,
        },
      });
    }
    return this.prismaService.project.update({
      where,
      data,
    });
  }

  async updateMany(
    where: Prisma.ProjectWhereUniqueInput,
    data: Prisma.ProjectUpdateInput,
  ) {
    return this.prismaService.project.updateMany({
      where,
      data,
    });
  }

  async delete(where: Prisma.ProjectWhereUniqueInput) {
    return this.prismaService.project.delete({
      where,
    });
  }

  async deleteMany(where: Prisma.ProjectWhereUniqueInput) {
    return this.prismaService.project.deleteMany({
      where,
    });
  }

  async fakeDelete(id: number) {
    return this.update(
      {
        id,
      },
      {
        visible: false,
      },
    );
  }
}
