import { Module } from '@nestjs/common';
import { BlogController } from './blog.controller';
import { BlogService } from './blog.service';
import { UtilModule } from '@/util/util.module';
import { PrisamModule } from '@/prisam/prisam.module';
import { PagerModule } from '@/pager/pager.module';

@Module({
  controllers: [BlogController],
  providers: [BlogService],
  imports: [UtilModule, PrisamModule, PagerModule],
})
export class BlogModule {}
