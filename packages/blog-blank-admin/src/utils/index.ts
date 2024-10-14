import { RES_CODE } from "@/const";
import { Response } from "@/request";
import { MessageBoxData, FormItemRule, ElMessage } from "element-plus";

export const pick = <O extends Record<string, any>, K extends keyof O>(
  data: O,
  keys: K[]
): Pick<O, K> => {
  const res = {} as Pick<O, K>;
  for (const k of keys) {
    res[k] = data[k];
  }
  return res;
};

export const resolveMessageBoxData = async (
  response: Promise<MessageBoxData>
) => {
  try {
    const res = await response;
    const action = res.action || res;
    const value = res.value || "";
    return { action, value };
  } catch {
    return {
      action: "cancel" as const,
      value: "",
    };
  }
};

const resolveMessage = (
  message: FormItemRule["message"],
  defaultValue = "请输入必填字段"
) => {
  if (!message) {
    return defaultValue;
  }
  if (typeof message === "string") {
    return message;
  }
  return message() || defaultValue;
};

export const arrayRuleValidator: FormItemRule["validator"] = (
  rule,
  val,
  cb
) => {
  if (!val) {
    cb(resolveMessage(rule.message));
    return;
  }
  if (Array.isArray(val) && !val.length) {
    return cb(resolveMessage(rule.message));
  }
  cb();
};

export const viewResMessage = (res: Response, showMessage = true) => {
  if (res.code !== RES_CODE.SUCCESS) {
    showMessage && ElMessage.warning(res.message || "操作失败!");
    return false;
  }
  showMessage && ElMessage.success(res.message || "操作成功!");
  return true;
};
