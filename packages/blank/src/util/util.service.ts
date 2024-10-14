import { Injectable } from '@nestjs/common';

@Injectable()
export class UtilService {
  readonly SEARCH_KEYS = [
    'where',
    'take',
    'skip',
    'cursor',
    'orderBy',
  ] as const;

  readonly SEARCH_COUNT_KEY = ['where', 'cursor'] as const;

  pick<O extends Record<string, any>, K extends keyof O>(
    data: O,
    keys: K[] | readonly K[],
  ): Pick<O, K> {
    const res = {} as Pick<O, K>;
    for (const k of keys) {
      if (Reflect.has(data, k)) {
        res[k] = data[k];
      }
    }
    return res;
  }

  omit<O extends Record<string, any>, K extends keyof O>(
    data: O,
    keys: K[],
  ): Omit<O, K> {
    const res = {} as Omit<O, K>;
    for (const k in data) {
      // @ts-ignore
      if (!keys.includes(k)) res[k] = data[k];
    }
    return res;
  }

  SUCCESS<T>(data: T, message = '操作成功') {
    return {
      code: 200,
      data,
      message,
    };
  }
  ERROR<T>(code = 500, data: T = null, message = '操作失败') {
    return {
      code,
      data,
      message,
    };
  }

  LIST_SUCCESS<T>(dataList: T[], total: number) {
    return this.SUCCESS({
      dataList,
      total,
    });
  }
}
