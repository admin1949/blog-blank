export const RES = {
  SUCCESS<T>(data: T, message = '操作成功') {
    return {
      code: 200,
      data,
      message,
    };
  },
  ERROR<T>(code = 400, data: T = null, message = '操作失败') {
    return {
      code: 200,
      data,
      message,
    };
  },
  LIST_SUCCESS<T>(data: T[], total: number) {
    return RES.SUCCESS({
      dataList: data,
      total,
    });
  },
};
