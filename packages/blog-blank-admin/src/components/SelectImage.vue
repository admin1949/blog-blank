<template>
  <div>
    <UploadView
      v-model:file-list="images"
      :limit="limit"
      list-type="picture-card"
      :on-preview="handlePictureCardPreview"
      :before-upload="handleBeforeUpload"
      @success="handleUploadSuccess"
      @exceed="handleExceed"
      accept="image/*"
    >
      <template #trigger>
        <div class="flex flex-col items-center">
          <ElIcon :size="24">
            <Upload />
          </ElIcon>
          <div>手动上传</div>
        </div>
      </template>

      <div
        class="el-upload--picture-card inline-flex flex-col items-center ml-2 mb-2"
        @click="selectFromCloud"
      >
        <ElIcon :size="24">
          <UploadFilled />
        </ElIcon>
        <div>从图片库中选择</div>
      </div>
    </UploadView>
  </div>
</template>

<script setup lang="ts">
import { Upload, UploadFilled } from "@element-plus/icons-vue";
import { ElMessage, UploadProps, UploadUserFile } from "element-plus";
import { openImagePreview } from "@/hooks/useImagePreview";
import { openSelectCloudImageDialog } from "@/components/SelectCloudImage/help";
import { coverImgToWebp, fileIdToFakeFile } from "@/utils/fs";
import { Response } from "@/request";
import { FileInfo } from "@/api/file";
import { viewResMessage } from "@/utils";

const { limit = Infinity } = defineProps<{
  limit?: number;
}>();

const images = defineModel<UploadUserFile[]>({
  default: () => [],
});

const handlePictureCardPreview: UploadProps["onPreview"] = (file) => {
  if (!file.url) {
    ElMessage.warning("请等待文件上传完毕再查看");
    return;
  }
  openImagePreview({
    urlList: [file.url],
  });
};
const handleBeforeUpload: UploadProps["beforeUpload"] = (file) => {
  return coverImgToWebp(file);
};

const handleExceed: UploadProps["onExceed"] = () => {
  ElMessage.warning("文件数量超出限制啦！");
};

const handleUploadSuccess: UploadProps["onSuccess"] = (
  res: Response<FileInfo>,
  file
) => {
  if (!viewResMessage(res)) {
    ElMessage.warning(res.message || "上传失败！");
    images.value = images.value.filter((i) => i.uid === file.uid);
    return;
  }
  ElMessage.success("上传成功！");
};

const selectFromCloud = async () => {
  const size = limit - images.value.length;
  if (size <= 0) {
    ElMessage.warning("文件数量超出限制啦！");
    return;
  }
  const files = images.value.reduce(
    (arr, item) => {
      if (item.fileId && item.sortPath) {
        arr.push({
          id: item.fileId,
          sortPath: item.sortPath,
        });
      }
      return arr;
    },
    [] as { id: number; sortPath: string }[]
  );
  const fileIds = await openSelectCloudImageDialog({
    files,
    limit: limit,
  });
  if (!fileIds) {
    return;
  }
  const fakeFiles = fileIds.map<UploadUserFile>((i) => fileIdToFakeFile(i.id));
  images.value = [...images.value, ...fakeFiles];
};
</script>

<style lang="scss" scoped></style>
