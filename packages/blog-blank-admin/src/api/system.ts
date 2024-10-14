import { request, Response } from "@/request";

export const login = (data: { username: string; password: string }) => {
  return request<Response<{ access_token: string }>>({
    url: "/auth/login",
    method: "POST",
    data,
  });
};
