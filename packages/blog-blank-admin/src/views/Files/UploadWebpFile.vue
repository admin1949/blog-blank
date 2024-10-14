<template>
  <BaseDialog v-model="showDialog" title="上传图片文件" width="650">
    <ElCheckbox v-model="covert">转换为webp格式</ElCheckbox>
    <UploadView
      ref="uploadInstance"
      accept="image/*"
      :before-upload="handleBeforeUpload"
    >
      <ElButton type="primary">选择文件</ElButton>
    </UploadView>
    <template #footer>
      <ElButton @click="handleSubmit" type="primary">确定</ElButton>
    </template>
  </BaseDialog>
</template>

<script setup lang="ts">
import { ElCheckbox, UploadProps } from "element-plus";
import { coverImgToWebp } from "./covert";

const showDialog = defineModel<boolean>();
const covert = ref(true);
const handleBeforeUpload: UploadProps["beforeUpload"] = (file) => {
  if (!covert.value) {
    return true;
  }
  return coverImgToWebp(file);
};
const emit = defineEmits<{
  submit: [];
}>();
const handleSubmit = () => {
  emit("submit");
  showDialog.value = false;
};
</script>

<style lang="scss" scoped></style>
