import { getContainer } from "@/utils/teleport";
import { ElImageViewer, ImageViewerProps, ImageEmits } from "element-plus";
import { render } from "vue";

type OnName<T> = `on${Capitalize<T & string>}`;
type ValueOf<T> = {
  [k in keyof T]: T[k];
}[keyof T];

type ExtractKey<T, R> = ValueOf<{
  [K in T & string]: OnName<K> extends R ? K : never;
}>;

type VnodeEvents<T extends Record<string, any>, K = keyof T> = {
  [P in OnName<K>]: T[ExtractKey<K, P>];
};

export const openImagePreview = (
  props: Partial<ImageViewerProps & VnodeEvents<ImageEmits>>
) => {
  const container = getContainer();
  let preview: InstanceType<typeof ElImageViewer> | null = null;
  const vnode = h(ElImageViewer, {
    ...props,
    ref(ref) {
      preview = ref as InstanceType<typeof ElImageViewer>;
    },
    onClose() {
      close();
      if (!props.onClose) {
        return true;
      }
      return props.onClose();
    },
  });

  render(vnode, container);

  const close = () => {
    if (vnode) {
      vnode.ref = null;
    }
    render(null, container);
  };
  const setActiveItem = (idx: number) => {
    preview && preview.setActiveItem(idx);
  };

  return {
    close,
    setActiveItem,
  };
};
