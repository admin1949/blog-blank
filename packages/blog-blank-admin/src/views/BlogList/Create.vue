<template>
  <BaseDialog v-model="visible" title="新增内容" width="750">
    <ElForm
      ref="formRef"
      label-suffix="："
      :model="formData"
      :rules="rules"
      label-width="120"
    >
      <ElFormItem prop="title" label="标题">
        <ElInput v-model="formData.title"></ElInput>
      </ElFormItem>
      <ElFormItem prop="avatarFile" label="封面">
        <SelectImage v-model="formData.avatarFile" :limit="1"></SelectImage>
      </ElFormItem>
      <ElFormItem prop="link" label="链接">
        <ElInput v-model="formData.link"></ElInput>
      </ElFormItem>
      <ElFormItem prop="tags" label="标签">
        <ElSelect
          v-model="formData.tags"
          filterable
          multiple
          clearable
          placeholder="请选择"
        >
          <ElOption
            v-for="i in typeList"
            :key="i.code"
            :label="i.name"
            :value="i.code"
          ></ElOption>
        </ElSelect>
      </ElFormItem>
      <ElFormItem prop="skillTags" label="技术标签">
        <ElSelect
          v-model="formData.skillTags"
          filterable
          multiple
          clearable
          placeholder="请选择"
        >
          <ElOption
            v-for="i in skillList"
            :key="i.code"
            :label="i.name"
            :value="i.code"
          ></ElOption>
        </ElSelect>
      </ElFormItem>
      <ElFormItem prop="desc" label="详细描述">
        <ElInput
          v-model="formData.desc"
          type="textarea"
          resize="none"
          :autosize="{ minRows: 3, maxRows: 6 }"
        ></ElInput>
      </ElFormItem>
      <ElFormItem prop="sort" label="排序">
        <ElInputNumber :min="0" v-model="formData.sort"></ElInputNumber>
      </ElFormItem>

      <ElFormItem prop="visible" label="是否可见">
        <ElSwitch v-model="formData.visible"></ElSwitch>
      </ElFormItem>

      <ElFormItem prop="picsList" label="截图列表">
        <SelectImage v-model="formData.picsList"></SelectImage>
      </ElFormItem>
      <ElFormItem>
        <ElButton @click="submit" :loading="loading" type="primary"
          >创建</ElButton
        >
        <ElButton @click="cancel">取消</ElButton>
      </ElFormItem>
    </ElForm>
  </BaseDialog>
</template>

<script setup lang="ts">
import { ElMessage } from "element-plus";
import { REMOTE_ENUMS, useListDic } from "@/enums/useRemoteEnum";
import { pick, viewResMessage } from "@/utils";
import { createBlog } from "@/api/blog";
import { isProgressFile, useEdit, rules } from "./useEdit";

const visible = defineModel<boolean>({
  default: false,
});
const emit = defineEmits<{
  done: [id: number];
}>();

const { data: skillList } = useListDic(REMOTE_ENUMS.SKILL_TAG);
const { data: typeList } = useListDic(REMOTE_ENUMS.TYPE_TAG);

const onSubmit = async () => {
  const status = await formInstance.value?.validate().catch(() => false);
  if (!status) {
    return;
  }

  if (formData.value.avatarFile.some(isProgressFile)) {
    ElMessage.warning("请等待封面上传完毕后重试");
    return;
  }

  if (formData.value.picsList.some(isProgressFile)) {
    ElMessage.warning("请等待详情图片上传完毕后重试");
    return;
  }

  const { skillTags, tags, picsList, avatarFile } = formData.value;
  const res = await createBlog({
    ...pick(formData.value, ["sort", "link", "title", "visible", "desc"]),
    skillTags: skillTags.join(","),
    tags: tags.join(","),
    picIds: picsList.map((i) => i.fileId!),
    avatarFileId: avatarFile[0].fileId!,
  });

  if (viewResMessage(res)) {
    return;
  }

  visible.value = false;
  resetFormData();
  emit("done", res.data.id);
  nextTick(() => {
    formInstance.value?.clearValidate();
  });
};

const { formData, cancel, submit, loading, formInstance, resetFormData } =
  useEdit({
    visible,
    onSubmit,
  });
</script>
