<script lang="ts">
import { dialogProps, dialogEmits, ElDialog } from "element-plus";
import { computed, defineComponent, h } from "vue";

export default defineComponent({
  props: dialogProps,
  emits: dialogEmits,

  setup(props, { slots, emit }) {
    const BASE_DIALOG_CLASS = "base-dialog";
    const customClass = computed(() => {
      const customClass = "";
      if (!customClass) {
        return BASE_DIALOG_CLASS;
      }
      return customClass + " " + BASE_DIALOG_CLASS;
    });

    const CUSTOM_EVENT = {
      "onUpdate:modelValue"(val: boolean) {
        emit("update:modelValue", val);
      },
      onClose() {
        emit("close");
      },
      onClosed() {
        emit("closed");
      },
      onCloseAutoFocus() {
        emit("closeAutoFocus");
      },
      onOpen() {
        emit("open");
      },
      onOpened() {
        emit("opened");
      },
      onOpenAutoFocus() {
        emit("openAutoFocus");
      },
    };

    return () => {
      const modalClass =
        props.modal === false ? "no-modal-dialog-overlay" : undefined;

      return h(
        ElDialog,
        {
          ...props,
          ...CUSTOM_EVENT,
          appendToBody: props.appendToBody ?? true,
          class: customClass.value,
          modalClass,
        },
        slots
      );
    };
  },
});
</script>

<style lang="scss">
.base-dialog {
  --el-dialog-padding-primary: 10px;
  pointer-events: initial;
  font-size: 14px;
  color: #2a2e3f;

  background: #ffffff;
  border: 1px solid rgba(220, 223, 230, 1);
  box-shadow: 0px 0px 20px 0px rgba(6, 10, 28, 0.15);
  border-radius: 3px;

  .el-dialog__header {
    --el-dialog-title-font-size: 14px;
    border-bottom: 1px solid rgba(220, 223, 230, 1);
    margin-right: 0;
    padding-right: 16px;

    .el-dialog__headerbtn {
      width: 45px;
      height: 45px;
    }
  }

  .el-dialog__body {
    padding: 12px 10px;
  }
}

.no-modal-dialog-overlay {
  pointer-events: none;
}
</style>
