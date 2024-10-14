<template>
  <BaseDialog v-model="visible" title="新增内容" width="750">
    <ElForm
      ref="formRef"
      :model="formData"
      :rules="rules"
      label-suffix="："
      label-width="120"
    >
      <ElFormItem prop="code" label="编码">
        <ElInput v-model="formData.code"></ElInput>
      </ElFormItem>

      <ElFormItem prop="name" label="名称">
        <ElInput v-model="formData.name"></ElInput>
      </ElFormItem>

      <ElFormItem prop="sort" label="排序">
        <ElInputNumber :min="0" v-model="formData.sort"></ElInputNumber>
      </ElFormItem>

      <ElFormItem prop="parentCode" label="父编码">
        <ElSelect v-model="formData.parentCode" clearable filterable>
          <ElOption
            v-for="i in rootDicts"
            :key="i.code"
            :label="i.name"
            :value="i.code"
          ></ElOption>
        </ElSelect>
      </ElFormItem>

      <ElFormItem label="是否启用">
        <ElSwitch v-model="formData.visible"></ElSwitch>
      </ElFormItem>

      <ElFormItem label="描述">
        <ElInput
          type="textarea"
          :autosize="{ minRows: 3, maxRows: 6 }"
          resize="none"
          v-model="formData.desc"
        ></ElInput>
      </ElFormItem>

      <ElFormItem>
        <ElButton @click="submit" type="primary" :loading="loading"
          >创建</ElButton
        >
        <ElButton @click="cancel">取消</ElButton>
      </ElFormItem>
    </ElForm>
  </BaseDialog>
</template>

<script setup lang="ts">
import { useAsync } from "@/hooks/useAsync";
import {
  ElMessage,
  ElMessageBox,
  ElOption,
  ElSelect,
  FormRules,
} from "element-plus";
import { queryDict, createDic } from "@/api/dic";
import { RES_CODE } from "@/const";
import { resolveMessageBoxData } from "@/utils";

const visible = defineModel<boolean>();

const formInstance = useTemplateRef("formRef");
const CREATE_FORM_DATA = () => {
  return {
    code: "",
    name: "",
    visible: true,
    sort: 0,
    parentCode: "",
    desc: "",
  };
};

const formData = ref(CREATE_FORM_DATA());
const rules: FormRules<typeof formData> = {
  code: { required: true, message: "请输入编码" },
  name: { required: true, message: "请输入名称" },
};

const cancel = () => {
  formInstance.value?.clearValidate();
  visible.value = false;
};

const emit = defineEmits<{
  done: [id: number];
}>();
const { load: submit, loading } = useAsync(async () => {
  const status = await formInstance.value?.validate().catch(() => false);
  if (!status) {
    return;
  }

  const res = await createDic({
    code: formData.value.code,
    name: formData.value.name,
    visible: formData.value.visible,
    sort: formData.value.sort,
    parentCode: formData.value.parentCode || null,
    desc: formData.value.desc,
  });
  if (res.code !== RES_CODE.SUCCESS) {
    ElMessage.warning(res.message);
    return;
  }
  ElMessage.success(res.message);
  const { action } = await resolveMessageBoxData(
    ElMessageBox.confirm("是否继续创建?")
  );
  if (action !== "confirm") {
    emit("done", res.data.id);
    visible.value = false;
    nextTick(() => {
      formData.value = CREATE_FORM_DATA();
      formInstance.value?.clearValidate();
    });
    return;
  }
  nextTick(() => {
    formData.value = CREATE_FORM_DATA();
    formInstance.value?.clearValidate();
  });
});

const { data: rootDicts, load: refreshRootDicts } = useAsync(async () => {
  const res = await queryDict({
    pageNum: 1,
    pageSize: 999,
  });
  return res.data.dataList;
});
refreshRootDicts();
</script>
