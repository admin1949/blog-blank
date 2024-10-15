import { Pager, request, Response, ResponseList } from "@/request";
import type { BlogVO, BlogBO } from "blank-admin/src/blog/blog.type";

export const createBlog = (data: BlogBO) => {
  return request<Response<BlogVO>>({
    url: "/blog/create",
    method: "POST",
    data,
  });
};

export const queryBlogList = (
  data: Pager & {
    content?: string;
  }
) => {
  return request<ResponseList<BlogVO>>({
    url: "/blog/list",
    method: "POST",
    data,
  });
};

export const updateBlog = (id: number, data: Partial<BlogBO>) => {
  return request<Response<boolean>>({
    url: `/blog/update/${id}`,
    method: "POST",
    data,
  });
};

export const deleteBlog = (id: number) => {
  return request<Response<boolean>>({
    url: `/blog/delete/${id}`,
    method: "POST",
  });
};

export const queryBlogDetail = (id: number) => {
  return request<Response<boolean>>({
    url: `/blog/detail/${id}`,
    method: "POST",
  });
};
