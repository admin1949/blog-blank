import { useAsync } from "@/hooks/useAsync";
import { arrayRuleValidator } from "@/utils";
import { buildFilePath, fileIdToFakeFile } from "@/utils/fs";
import { Awaitable } from "@vueuse/core";
import { BlogVO } from "blank-admin/src/blog/blog.type";
import { FormInstance, FormRules, UploadUserFile } from "element-plus";

export const isProgressFile = (file: UploadUserFile) =>
  file.status === "uploading" || file.status === "fail";

const CREATE_FORM_DATA = (blog?: BlogVO) => {
  if (!blog) {
    return {
      tags: new Array<string>(),
      skillTags: new Array<string>(),
      sort: 0,
      link: "",
      title: "",
      avatarFile: [] as UploadUserFile[],
      picsList: [] as UploadUserFile[],
      desc: "",
      visible: true,
    };
  }

  return {
    tags: blog.tags.split(",").filter(Boolean),
    skillTags: blog.skillTags.split(",").filter(Boolean),
    sort: blog.sort,
    link: blog.link,
    title: blog.title,
    avatarFile: [fileIdToFakeFile(blog.avatarFileId)],
    picsList: blog.pics.map((i) =>
      fileIdToFakeFile(i.id, buildFilePath(i.sortPath))
    ),
    desc: blog.desc,
    visible: blog.visible,
  };
};

export const rules: FormRules<ReturnType<typeof CREATE_FORM_DATA>> = {
  title: { required: true, message: "请输入标题" },
  tags: {
    required: true,
    message: "请选择标签",
    validator: arrayRuleValidator,
  },
  skillTags: {
    required: true,
    message: "请选择技能标签",
    validator: arrayRuleValidator,
  },
  avatarFile: {
    required: true,
    message: "请选择封面",
    validator: arrayRuleValidator,
  },
};

export const useEdit = <T>(opt: {
  visible: { value: boolean };
  origin?: ComputedRef<BlogVO>;
  onSubmit: () => Awaitable<T>;
}) => {
  const formInstance = useTemplateRef<FormInstance>("formRef");
  const formData = ref(CREATE_FORM_DATA(unref(opt.origin)));

  const { load: submit, loading } = useAsync(opt.onSubmit);

  const cancel = () => {
    formInstance.value?.clearValidate();
    opt.visible.value = false;
  };

  const resetFormData = () => {
    formData.value = CREATE_FORM_DATA(unref(opt.origin));
  };

  return {
    cancel,
    submit,
    loading,
    formData,
    formInstance,
    resetFormData,
  };
};
