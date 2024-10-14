const getExt = (filename: string) => {
  const ext = filename.slice(filename.lastIndexOf(".") + 1).toLowerCase();
  return ext;
};
const isWebp = (filename: string) => {
  const ext = getExt(filename);
  return ext === "webp";
};

export const coverImgToWebp = async (file: File) => {
  const name = file.name;
  if (isWebp(name)) {
    return file;
  }
  const blob = new Blob([file], {
    type: file.type,
  });
  const url = URL.createObjectURL(blob);
  const img = await loadImage(url);
  URL.revokeObjectURL(url);
  const webpBlob = await coverImage(img);

  const newName = name.slice(0, name.lastIndexOf(".") + 1) + "webp";
  const newFile = new File([webpBlob], newName);
  return newFile;
};

const loadImage = (url: string) => {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const img = document.createElement("img");
    img.onerror = reject;
    img.onload = () => {
      resolve(img);
    };
    img.src = url;
  });
};

const coverImage = (img: HTMLImageElement) => {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  return new Promise<Blob>((resolve, reject) => {
    if (!ctx) {
      reject();
      return;
    }
    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;
    ctx.drawImage(img, 0, 0);
    canvas.toBlob((blob) => {
      if (!blob) {
        reject();
        return;
      }
      resolve(blob);
    });
  });
};
