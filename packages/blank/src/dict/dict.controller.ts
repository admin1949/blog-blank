import { Body, Controller, Param, Post } from '@nestjs/common';
import { DictService } from './dict.service';
import { Pager, PagerService } from '@/pager/pager.service';
import { UtilService } from '@/util/util.service';
import { Prisma } from '@prisma/client';

interface ListParams extends Pager {
  parentCode?: string;
  agreeVisible?: boolean;
  name?: string;
}

@Controller('dict')
export class DictController {
  constructor(
    private readonly dictService: DictService,
    private readonly pagerService: PagerService,
    private readonly utilService: UtilService,
  ) {}

  @Post('list')
  async findAList(@Body() body: ListParams) {
    const pager = this.pagerService.resolvePager(body);
    const { data, total } = await this.dictService.findAll({
      ...pager,
      where: {
        parentCode: body.parentCode || null,
        visible: body.agreeVisible ? undefined : true,
        name: body.name
          ? {
              contains: body.name,
            }
          : undefined,
      },
      orderBy: {
        sort: 'desc',
      },
    });
    return this.utilService.LIST_SUCCESS(data, total);
  }

  @Post('list-all')
  async findListAll(
    @Body()
    body: {
      code: string;
      agreeVisible?: boolean;
      name?: string;
    },
  ) {
    if (!body.code) {
      this.utilService.SUCCESS([]);
    }

    const { data } = await this.dictService.findAll({
      where: {
        parentCode: body.code || null,
        visible: body.agreeVisible ? undefined : true,
        name: body.name
          ? {
              contains: body.name,
            }
          : undefined,
      },
      orderBy: {
        sort: 'desc',
      },
    });
    return this.utilService.SUCCESS(data);
  }

  @Post('create')
  async create(@Body() body: Prisma.DictCreateInput) {
    if (!body.code) {
      return this.utilService.ERROR(500, false, 'code 不能为空');
    }

    const dict = await this.dictService.findOneByCode(body.code);
    if (dict) {
      return this.utilService.ERROR(500, false, '操作失败，code 重复');
    }

    if (body.parentCode) {
      const parent = await this.dictService.findOneByCode(body.parentCode);
      if (!parent) {
        return this.utilService.ERROR(500, false, '操作失败 父节点不存在');
      }
    }

    const d = await this.dictService.create(
      this.utilService.pick(body, [
        'code',
        'name',
        'parentCode',
        'sort',
        'visible',
      ]),
    );

    return this.utilService.SUCCESS(d);
  }

  @Post('update/:id')
  async update(
    @Body()
    body: {
      parentCode: string | null;
      code?: string;
      name?: string;
      sort?: number;
      visible?: boolean;
      desc?: string;
    },
    @Param('id') id: string,
  ) {
    if (body.code) {
      const dict = await this.dictService.findOneByCode(body.code);
      if (dict && dict.id !== Number(id)) {
        return this.utilService.ERROR(500, false, '操作失败，code 重复');
      }
    }

    if (body.parentCode) {
      const parent = await this.dictService.findOneByCode(body.parentCode);
      if (!parent) {
        return this.utilService.ERROR(500, false, '操作失败 父节点不存在');
      }
    }

    const d = await this.dictService.update(
      Number(id),
      this.utilService.pick(body, [
        'code',
        'name',
        'parentCode',
        'sort',
        'visible',
        'desc',
      ]),
    );

    return this.utilService.SUCCESS(d);
  }

  @Post('delete/:id')
  async delete(@Param('id') id: string) {
    const status = await this.dictService.remove(Number(id));
    return this.utilService.SUCCESS(true);
  }

  @Post('detail/:id')
  async detail(@Param('id') id: string) {
    const dic = await this.dictService.findOne(Number(id));
    return this.utilService.SUCCESS(dic);
  }
}
