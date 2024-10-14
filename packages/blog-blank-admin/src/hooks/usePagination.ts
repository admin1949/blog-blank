import type { Pager } from "@/request";
import { reactive, ref, Ref, watch } from "vue";

export const usePagination = (
  total: Ref<number>,
  cb?: (pageNum: number, pageSize: number) => void,
  initpageSizes = [10, 20, 50, 100]
) => {
  const pageNum = ref(1);
  const pageSizes = ref(initpageSizes);
  const pageSize = ref(pageSizes.value[0]);

  watch([pageNum, pageSize], ([pageNum, pageSize]) => {
    cb?.(pageNum, pageSize);
  });

  const refreshEffect = () => {
    if (pageNum.value !== 1) {
      pageNum.value = 1;
    } else {
      cb?.(pageNum.value, pageSize.value);
    }
  };

  return {
    pager: reactive({
      pageNum,
      pageSizes,
      pageSize,
      total,
    }),
    refreshEffect,
  };
};

export const useTableIndex = (pager: Pager) => {
  return (idx: number) => {
    return (pager.pageNum - 1) * pager.pageSize + idx + 1;
  };
};
