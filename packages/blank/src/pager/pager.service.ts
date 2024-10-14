import { Injectable } from '@nestjs/common';

export interface Pager {
  pageNum?: number;
  pageSize?: number;
}

@Injectable()
export class PagerService {
  private readonly defaultPager: Pager = {
    pageNum: 1,
    pageSize: 10,
  };

  resolvePager = (opt?: Pager, base?: Pager) => {
    opt = opt || base || this.defaultPager;
    let pageNum = Math.floor(opt.pageNum);
    let pageSize = Math.floor(opt.pageSize);

    if (pageNum < 1) {
      pageNum = 1;
    }
    if (pageSize < 1) {
      pageSize = 10;
    }

    const skip = (pageNum - 1) * pageSize;

    return {
      skip,
      take: pageSize,
    };
  };
}
