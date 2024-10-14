import LoginCom from "@/widget/Login.vue";
import { openBaseDialog } from "@/hooks/useDialog";
import { h } from "vue";
import { useAsync } from "@/hooks/useAsync";
import { InternalAxiosRequestConfig } from "axios";

const { load: autoLogin } = useAsync(
  () => {
    return new Promise<boolean>((resolve) => {
      const closeDialog = openBaseDialog(
        () => {
          return h(LoginCom, {
            onSuccess() {
              resolve(true);
              closeDialog();
            },
            onFaild() {
              resolve(false);
              closeDialog();
            },
          });
        },
        {
          title: "自动登陆",
          width: "600px",
        }
      );
    });
  },
  {
    waitloading: true,
  }
);

const retryMap = new Map<InternalAxiosRequestConfig, number>();
const MAX_RETRY = 1;
const shouldRetry = (config: InternalAxiosRequestConfig) => {
  const times = retryMap.get(config) || 0;
  retryMap.set(config, times + 1);
  return times < MAX_RETRY;
};

const clearRetryHistory = (config: InternalAxiosRequestConfig) => {
  retryMap.delete(config);
};

export { autoLogin, shouldRetry, clearRetryHistory };
