import {
  AppContext,
  VNode,
  computed,
  getCurrentInstance,
  h,
  render,
} from "vue";
import { ElMessageBox, DialogProps } from "element-plus";
import { resolveMessageBoxData } from "@/utils";
import { getContainer, removeSelf } from "@/utils/teleport";
import BaseDialog from "@/components/Dialog/BaseDialog.vue";

type Keys<P, T> = {
  [key in keyof P]: P[key] extends T ? key : void;
}[keyof P];

export const useDialog = <P, K extends Keys<P, boolean> & string>(
  props: P,
  key: K,
  name: string = ""
) => {
  const ctx = getCurrentInstance();

  const showDialog = computed<boolean>({
    get: () => props[key as keyof P] as unknown as boolean,
    set: (val) => ctx?.emit("update:" + key, val),
  });

  const beforeClose = async (done: (cancle: boolean) => void) => {
    const res = await resolveMessageBoxData(
      ElMessageBox.confirm(`确认取消${name}？`)
    );

    done(res.action === "confirm");
  };

  const closeDialog = () => {
    showDialog.value = false;
  };

  const closeDialogWithConfirm = () => {
    beforeClose((cancle) => {
      if (!cancle) {
        showDialog.value = false;
      }
    });
  };

  return {
    beforeClose,
    showDialog,
    closeDialogWithConfirm,
    closeDialog,
  };
};

export const openBaseDialog = (
  child: () => VNode,
  opt: Partial<Omit<DialogProps, "modelValue">> & { onClosed?: () => void },
  context?: AppContext
) => {
  const container = getContainer();
  const onClosed = () => {
    render(null, container);
    removeSelf(container);
    opt.onClosed?.();
  };

  let hasDestory = false;
  const renderDialog = (showDialog: boolean) => {
    if (hasDestory) {
      return;
    }
    const vnode = h(
      BaseDialog,
      {
        ...opt,
        modelValue: showDialog,
        onClosed,
        "onUpdate:modelValue": (val: boolean) => {
          renderDialog(val);
          if (!val) {
            hasDestory = val;
          }
        },
      },
      {
        default: child,
      }
    );
    vnode.appContext = context || null;
    render(vnode, container);
  };

  renderDialog(true);
  return () => renderDialog(false);
};
