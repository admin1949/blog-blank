import { UtilService } from '@/util/util.service';
import { Body, Controller, Param, Post } from '@nestjs/common';
import { BlogService } from './blog.service';
import { BlogBO } from './blog.type';
import { Pager, PagerService } from '@/pager/pager.service';
import { Prisma } from '@prisma/client';

@Controller('blog')
export class BlogController {
  constructor(
    private readonly blogService: BlogService,
    private readonly utilService: UtilService,
    private readonly pagerService: PagerService,
  ) {}

  @Post('create')
  async create(@Body() body: BlogBO) {
    const blog = await this.blogService.create({
      ...this.utilService.pick(body, [
        'title',
        'desc',
        'link',
        'skillTags',
        'sort',
        'tags',
        'visible',
      ]),
      avatar: {
        connect: {
          id: body.avatarFileId,
        },
      },
      pics: {
        createMany: {
          data: body.picIds.map((i, idx) => {
            return {
              fileId: i,
              sort: idx,
            };
          }),
        },
      },
    });
    return this.utilService.SUCCESS(blog);
  }

  @Post('list')
  async findList(
    @Body()
    body: Pager & {
      content?: string;
    },
  ) {
    const { content } = body;
    const where: Prisma.ProjectWhereInput = content
      ? {
          OR: [
            {
              title: {
                contains: content,
              },
            },
            {
              desc: {
                contains: content,
              },
            },
          ],
        }
      : undefined;

    const [dataList, total] = await Promise.all([
      this.blogService.findMany({
        ...this.pagerService.resolvePager(body),
        where,
        orderBy: {
          sort: 'desc',
        },
      }),
      this.blogService.findCount({ where }),
    ]);
    return this.utilService.LIST_SUCCESS(dataList, total);
  }

  @Post('update/:id')
  async update(@Body() body: Partial<BlogBO>, @Param('id') id: string) {
    const status = await this.blogService.update(
      {
        id: Number(id),
      },
      {
        ...this.utilService.pick(body, [
          'title',
          'desc',
          'link',
          'skillTags',
          'sort',
          'tags',
          'visible',
        ]),
        avatar: body.avatarFileId
          ? {
              connect: {
                id: body.avatarFileId,
              },
            }
          : undefined,
      },
      body.picIds,
    );
    if (!status) {
      return this.utilService.ERROR(500, false);
    }
    return this.utilService.SUCCESS(true);
  }

  @Post('delete/:id')
  async delete(@Param('id') id: string) {
    const status = await this.blogService.delete({
      id: Number(id),
    });
    if (!status) {
      return this.utilService.ERROR(500, false);
    }
    return this.utilService.SUCCESS(true);
  }
}
