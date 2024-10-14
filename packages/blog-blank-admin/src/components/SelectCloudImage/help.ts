import { openBaseDialog } from "@/hooks/useDialog";
import View from "./View.vue";
import type { SimpleFile } from "./View.vue";

export const openSelectCloudImageDialog = (opt: {
  files: SimpleFile[];
  limit?: number;
}) => {
  return new Promise<SimpleFile[] | null>((resolve) => {
    const close = openBaseDialog(
      () => {
        return h(View, {
          files: opt.files,
          limit: opt.limit,
          onSubmit(ids) {
            resolve(ids);
            close();
          },
          onCancel() {
            resolve(null);
            close();
          },
        });
      },
      {
        title: "选择图片",
        width: 826,
      }
    );
  });
};
