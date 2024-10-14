<template>
  <ElForm
    ref="fromRef"
    :model="formData"
    label-width="120px"
    label-suffix="："
    :rules="rules"
  >
    <ElFormItem label="用户名">
      <ElInput placeholder="请输入用户名" v-model="formData.username"></ElInput>
    </ElFormItem>
    <ElFormItem label="密码">
      <ElInput
        placeholder="请输入密码"
        type="password"
        show-password
        v-model="formData.password"
      ></ElInput>
    </ElFormItem>
    <ElFormItem>
      <ElButton @click="handleSubmit" :loading="loading" type="primary"
        >登录</ElButton
      >
      <ElButton @click="handleCancel">取消</ElButton>
    </ElFormItem>
  </ElForm>
</template>

<script setup lang="ts">
import { ElForm, ElFormItem, ElInput, FormItemRule } from "element-plus";
import { useAsync } from "@/hooks/useAsync";
import { login } from "@/api/system";
import { pick } from "@/utils";
import { Local } from "@/storage";
import { TOKEN_KEY } from "@/const";

const emit = defineEmits<{
  success: [access_token: string];
  faild: [];
}>();

const CREATE_FORMDATA = () => {
  return {
    username: "",
    password: "",
  };
};
const formData = ref(CREATE_FORMDATA());
const rules: Partial<
  Record<keyof ReturnType<typeof CREATE_FORMDATA>, FormItemRule>
> = {
  username: { required: true, message: "请输入用户名！" },
  password: { required: true, message: "请输入密码！" },
};

const formInstance = useTemplateRef("fromRef");
const { load: handleSubmit, loading } = useAsync(async () => {
  const status = await formInstance.value?.validate().catch(() => false);
  if (!status) {
    return;
  }

  const { data } = await login(pick(formData.value, ["password", "username"]));
  Local.set(TOKEN_KEY, data.access_token);
  emit("success", data.access_token);
});

const handleCancel = () => {
  emit("faild");
};
</script>
