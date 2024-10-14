import "element-plus";

declare module "element-plus" {
  interface UploadFile {
    fileId?: number;
    sortPath?: string;
  }
}
