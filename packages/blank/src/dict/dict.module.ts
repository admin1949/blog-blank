import { Module } from '@nestjs/common';
import { DictController } from './dict.controller';
import { DictService } from './dict.service';
import { PrisamModule } from '@/prisam/prisam.module';
import { PagerModule } from '@/pager/pager.module';
import { UtilModule } from '@/util/util.module';

@Module({
  controllers: [DictController],
  providers: [DictService],
  imports: [PrisamModule, PagerModule, UtilModule],
})
export class DictModule {}
