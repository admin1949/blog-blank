<template>
  <div class="flex gap-1 h-[500px] w-full">
    <div
      v-infinite-scroll="load"
      :infinite-scroll-disabled="loading || done"
      :infinite-scroll-distance="2"
      class="w-0 flex-1 h-full overflow-y-auto border-r border-r-[#dcdfe6]"
    >
      <div class="w-full flex flex-wrap gap-2 items-start content-start">
        <ImageItem
          v-for="i in data"
          :key="i.id"
          :src="buildFilePath(i.sortPath)"
          class="image-box cursor-pointer"
          @click="chooseItem(i)"
          :selected="hasSelectFile(i.id)"
        >
        </ImageItem>
      </div>
      <div class="info-tips" v-if="loading">加载中...</div>
      <div class="info-tips" v-if="done">加载完毕</div>
    </div>
    <div class="flex flex-col w-[158px] h-full gap-2 overflow-y-auto">
      <ImageItem
        v-for="i in selected"
        :key="i.id"
        :src="buildFilePath(i.sortPath)"
        selected
        @click="chooseItem(i)"
        class="shrink-0 cursor-pointer"
      />
    </div>
  </div>
  <div class="px-2 flex justify-center -mb-2 pt-4">
    <ElButton @click="cancel">取消</ElButton>
    <ElButton @click="submit" type="primary">确定</ElButton>
  </div>
</template>

<script setup lang="ts">
import { queryFileList } from "@/api/file";
import { useWithPageRequest } from "@/hooks/useAsync";
import { buildFilePath } from "@/utils/fs";
import { ElMessage, ElInfiniteScroll as vInfiniteScroll } from "element-plus";

export interface SimpleFile {
  id: number;
  sortPath: string;
}

const { files = [], limit = Infinity } = defineProps<{
  files?: SimpleFile[];
  limit?: number;
}>();

const { load, loading, done, data } = useWithPageRequest(async (pager) => {
  const res = await queryFileList(pager);
  return res.data;
});

const selected = ref<SimpleFile[]>([]);
watch(
  () => [files, limit] as const,
  ([files, limit]) => {
    if (files.length > limit) {
      files = files.slice(0, limit);
    }
    selected.value = [...files];
  },
  {
    immediate: true,
  }
);
const hasSelectFile = (id: number) => {
  return selected.value.some((j) => j.id === id);
};

const chooseItem = (file: SimpleFile) => {
  if (hasSelectFile(file.id)) {
    selected.value = selected.value.filter((i) => i.id !== file.id);
    return;
  }
  if (selected.value.length < limit) {
    selected.value.push(file);
    return;
  }

  if (limit !== 1) {
    ElMessage.warning(`最多选择${limit}项`);
    return;
  }
  selected.value = [file];
};

const emit = defineEmits<{
  cancel: [];
  submit: [ids: SimpleFile[]];
}>();
const cancel = () => {
  emit("cancel");
};
const submit = () => {
  emit("submit", [...selected.value]);
};
</script>

<style lang="scss" scoped>
.info-tips {
  @apply text-center text-gray-700 text-base py-2;
}
</style>
