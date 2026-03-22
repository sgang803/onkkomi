export type ImageMeta = {
  w: number;
  h: number;
};

export async function loadImageMeta(url: string): Promise<ImageMeta> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve({ w: img.naturalWidth, h: img.naturalHeight });
    img.onerror = () => reject(new Error(`Failed to load image: ${url}`));
    img.src = url;
  });
}

