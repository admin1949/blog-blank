import { Pager, request, ResponseList } from "@/request";

export interface FileInfo {
  id: number;
  size: number;
  fileName: string;
  extension: string;
  sortPath: string;
  createTime: string;
}

export const queryFileList = (data: Pager) => {
  return request<ResponseList<FileInfo>>({
    url: "/file/list-all",
    data,
  });
};

export const deleteFile = (id: number) => {
  return request({
    url: `/file/delete/${id}`,
    method: "GET",
  });
};
