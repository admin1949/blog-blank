import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import { Local } from "@/storage";
import { NO_AUTH_CODE, TOKEN_KEY } from "@/const";
import { autoLogin, shouldRetry, clearRetryHistory } from "./dev";

const server = axios.create({
  baseURL: "/blank-api",
  method: "POST",
});

const notAuthUrls = ["/auth/login"];

server.interceptors.request.use((req) => {
  if (notAuthUrls.includes(req.url!)) {
    return req;
  }

  const token = Local.get(TOKEN_KEY);
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

server.interceptors.response.use(async (res) => {
  const data = res.data as Response;
  if (data && Number(data.code) === NO_AUTH_CODE) {
    if (!shouldRetry(res.config)) {
      clearRetryHistory(res.config);
      return res;
    }
    const status = await autoLogin();
    if (!status) {
      return res;
    }
    return server(res.config);
  }
  return res;
});

export const request = async <T, OT = unknown>(opt: AxiosRequestConfig<OT>) => {
  const res = await server.request<any, AxiosResponse<T>, OT>(opt);
  return res.data;
};

export interface Response<T = unknown> {
  data: T;
  message: string;
  code: number;
}

export interface ResponseList<T = unknown> {
  data: {
    dataList: T[];
    total: number;
  };
  code: number;
  message: number;
}

export interface Pager {
  pageNum: number;
  pageSize: number;
}
