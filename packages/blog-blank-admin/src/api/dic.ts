import { request, Pager, ResponseList, Response } from "@/request";

export interface Dic {
  parentCode: string | null;
  id: number;
  code: string;
  name: string;
  sort: number;
  visible: boolean;
  desc?: string;
}

export const queryDict = (
  data: Pager & {
    parentCode?: string;
    agreeVisible?: boolean;
    name?: string;
  }
) => {
  return request<ResponseList<Dic>>({
    url: "/dict/list",
    method: "POST",
    data,
  });
};

export const queryDictAll = (data: {
  code: string;
  agreeVisible?: boolean;
  name?: string;
}) => {
  return request<Response<Dic>>({
    url: "/dict/list-all",
    method: "POST",
    data,
  });
};

export const updateDic = (id: number, data: Partial<Omit<Dic, "id">>) => {
  return request<Response<Dic>>({
    url: `/dict/update/${id}`,
    method: "POST",
    data,
  });
};

export const deleteDic = (id: number) => {
  return request<Response>({
    url: `/dict/delete/${id}`,
    method: "POST",
  });
};

export const createDic = (data: Omit<Dic, "id">) => {
  return request<Response<Dic>>({
    url: "/dict/create",
    method: "POST",
    data,
  });
};
