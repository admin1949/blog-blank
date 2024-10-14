import { createWebHistory, createRouter, RouteRecordRaw } from "vue-router";

const routes: RouteRecordRaw[] = [
  {
    path: "/",
    redirect: "/blogs",
  },
  {
    path: "/dics",
    name: "dics",
    component: () => import("@/views/Dic/index.vue"),
  },
  {
    path: "/blogs",
    name: "blogs",
    component: () => import("@/views/BlogList/index.vue"),
  },
  {
    path: "/ma-files",
    name: "files",
    component: () => import("@/views/Files/index.vue"),
  },
];

export const router = createRouter({
  routes,
  history: createWebHistory("/blank"),
});
