<script setup lang="ts">
import { ElMenu, ElMenuItem } from "element-plus";
import zhCn from "element-plus/es/locale/lang/zh-cn";
import { useRouter } from "vue-router";
const router = useRouter();

const menus = [
  { code: "blogs", name: "项目管理" },
  { code: "files", name: "图片管理" },
  { code: "dics", name: "字典管理" },
];
const handleSelectItem = (name: string) => {
  router.push({
    name,
  });
};
</script>

<template>
  <ElConfigProvider :locale="zhCn">
    <div class="w-screen h-screen flex">
      <div class="h-full w-[200px]">
        <ElMenu class="h-full" @select="handleSelectItem">
          <ElMenuItem v-for="i in menus" :index="i.code">
            {{ i.name }}
          </ElMenuItem>
        </ElMenu>
      </div>
      <div class="h-full w-0 flex-1">
        <RouterView></RouterView>
      </div>
    </div>
  </ElConfigProvider>
</template>
