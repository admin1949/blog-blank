<script lang="ts">
import {
  ElUpload,
  uploadProps,
  UploadUserFile,
  UploadInstance,
  UploadFile,
  UploadRawFile,
} from "element-plus";
import { defineComponent, h } from "vue";
import { buildProps, definePropType } from "element-plus/es/utils/index";
import { TOKEN_KEY, BASE_URL } from "@/const";
import { Local } from "@/storage";
import { FileInfo } from "@/api/file";
import { Response } from "@/request";
import { viewResMessage } from "@/utils";

const baseUpLoadProps = buildProps({
  ...uploadProps,
  action: {
    type: definePropType<string>(String),
    default: BASE_URL + "/file/upload",
  },
  headers: {
    type: definePropType<Record<string, any>>(Object),
    default: () => ({
      Authorization: `Bearer ${Local.get(TOKEN_KEY)}`,
    }),
  },
});

export default defineComponent({
  props: baseUpLoadProps,
  emits: ["update:fileList"],
  setup(props, { slots, expose, emit }) {
    let instance: UploadInstance | null = null;
    expose({
      abort(file: UploadFile) {
        instance && instance.abort(file);
      },
      submit() {
        instance && instance.submit();
      },
      clearFiles() {
        instance && instance.clearFiles();
      },
      handleStart(file: UploadRawFile) {
        instance && instance.handleStart(file);
      },
      handleRemove(
        file: UploadRawFile | UploadFile,
        rawFile?: UploadRawFile | undefined
      ) {
        instance && instance.handleRemove(file, rawFile);
      },
    });
    return () => {
      return h(
        ElUpload,
        {
          ...props,
          onSuccess(res: Response<FileInfo>, file, uploadFiles) {
            if (!viewResMessage(res, false)) {
              return;
            }
            file.fileId = res.data.id;
            file.sortPath = res.data.sortPath;
            props.onSuccess && props.onSuccess(res, file, uploadFiles);
          },
          ref(ref) {
            instance = ref as UploadInstance;
          },
          "onUpdate:fileList"(fileList: UploadUserFile[]) {
            emit("update:fileList", fileList);
          },
        },
        slots
      );
    };
  },
});
</script>
