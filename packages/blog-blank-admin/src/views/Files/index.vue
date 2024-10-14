<template>
  <div class="h-full w-full flex flex-col gap-2 p-2">
    <div>
      <ElButton type="primary" @click="handleUploadFile">上传</ElButton>
    </div>
    <div class="h-0 flex-1 w-full">
      <ElTable height="100%" :data="data.dataList" row-key="id">
        <ElTableColumn width="100" prop="id" label="ID"></ElTableColumn>
        <ElTableColumn prop="fileName" label="文件名"></ElTableColumn>
        <ElTableColumn prop="extension" label="文件类型"></ElTableColumn>
        <ElTableColumn prop="sortPath" label="路径"></ElTableColumn>
        <ElTableColumn prop="createTime" label="创建时间"></ElTableColumn>
        <ElTableColumn label="操作">
          <template #="{ row }">
            <ElButton type="primary" @click="preview(row.id)">预览</ElButton>
            <ElPopconfirm
              :title="`是否删除文件 ”${row.fileName}“ ？`"
              @confirm="handleDeleteFile(row.id)"
              width="240"
            >
              <template #reference>
                <ElButton plain type="warning">删除</ElButton>
              </template>
            </ElPopconfirm>
          </template>
        </ElTableColumn>
      </ElTable>
    </div>
    <div class="flex justify-end">
      <ElPagination
        v-model:current-page="pager.pageNum"
        v-model:page-size="pager.pageSize"
        :page-sizes="pager.pageSizes"
        :total="pager.total"
        layout="total, sizes, prev, pager, next, jumper"
      />
    </div>
  </div>
  <UploadWebpFile v-model="showUpload" @submit="load"></UploadWebpFile>
</template>

<script setup lang="ts">
import { useLastAsync } from "@/hooks/useAsync";
import { queryFileList, deleteFile } from "@/api/file";
import { usePagination } from "@/hooks/usePagination";
import { pick } from "@/utils";
import { openImagePreview } from "@/hooks/useImagePreview";
import UploadWebpFile from "./UploadWebpFile.vue";
import { buildFilePath } from "@/utils/fs";

const { data, load } = useLastAsync(
  () => {
    return queryFileList(pick(pager, ["pageNum", "pageSize"]));
  },
  (res) => {
    return res
      ? res.data
      : {
          dataList: [],
          total: 0,
        };
  }
);

const handleDeleteFile = async (id: number) => {
  console.log("id is", id);
  await deleteFile(id);
  if (data.value.dataList.length > 1) {
    if (pager.pageNum === 1) {
      load();
      return;
    }
    pager.pageNum -= 1;
    return;
  }
  load();
};
const preview = (id: number) => {
  const idx = data.value.dataList.findIndex((i) => i.id === id);
  const imgs = data.value.dataList.map(buildFilePath);

  openImagePreview({
    urlList: imgs,
    initialIndex: idx,
  });
};
const showUpload = ref(false);
const handleUploadFile = () => {
  showUpload.value = true;
};

const { pager } = usePagination(
  computed(() => data.value.total),
  load
);
load();
</script>

<style lang="scss" scoped></style>
