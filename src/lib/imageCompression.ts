/**
 * 클라이언트 측 이미지 압축 유틸리티
 * 스마트폰(아이폰/갤럭시) 원본 고해상도 사진(5MB~20MB)을
 * 브라우저 메모리 부하 없이 초고속으로 웹 최적화(약 300KB~700KB 고화질 JPEG)하여 반환합니다.
 */

export async function compressImage(
  file: File,
  maxWidth = 1920,
  maxHeight = 1920,
  quality = 0.82
): Promise<File> {
  // 이미지가 아닌 경우(예: 주보 PDF 등) 원본 반환
  if (!file.type.startsWith("image/") && !/\.(jpe?g|png|webp|heic|bmp)$/i.test(file.name)) {
    return file;
  }

  // 350KB 이하의 이미지는 이미 충분히 작으므로 그대로 사용
  if (file.size <= 350 * 1024 && file.type === "image/jpeg") {
    return file;
  }

  return new Promise((resolve) => {
    let objectUrl = "";
    try {
      objectUrl = URL.createObjectURL(file);
    } catch {
      // ignore
    }

    const img = new Image();

    const cleanup = () => {
      if (objectUrl) {
        try {
          URL.revokeObjectURL(objectUrl);
        } catch {}
      }
    };

    img.onload = () => {
      try {
        let width = img.naturalWidth || img.width;
        let height = img.naturalHeight || img.height;

        if (width > maxWidth || height > maxHeight) {
          if (width / height > maxWidth / maxHeight) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          } else {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext("2d");
        if (!ctx) {
          cleanup();
          resolve(file);
          return;
        }

        ctx.fillStyle = "#FFFFFF";
        ctx.fillRect(0, 0, width, height);

        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = "high";
        ctx.drawImage(img, 0, 0, width, height);

        canvas.toBlob(
          (blob) => {
            cleanup();
            if (!blob) {
              resolve(file);
              return;
            }

            const baseName = file.name.replace(/\.[^/.]+$/, "");
            const newFileName = `${baseName}.jpg`;

            const compressedFile = new File([blob], newFileName, {
              type: "image/jpeg",
              lastModified: Date.now(),
            });

            resolve(compressedFile);
          },
          "image/jpeg",
          quality
        );
      } catch {
        cleanup();
        resolve(file);
      }
    };

    img.onerror = () => {
      cleanup();
      // FileReader fallback
      const reader = new FileReader();
      reader.onload = (e) => {
        const fallbackImg = new Image();
        fallbackImg.onload = () => {
          try {
            let width = fallbackImg.naturalWidth || fallbackImg.width;
            let height = fallbackImg.naturalHeight || fallbackImg.height;
            if (width > maxWidth || height > maxHeight) {
              if (width / height > maxWidth / maxHeight) {
                height = Math.round((height * maxWidth) / width);
                width = maxWidth;
              } else {
                width = Math.round((width * maxHeight) / height);
                height = maxHeight;
              }
            }
            const canvas = document.createElement("canvas");
            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext("2d");
            if (!ctx) {
              resolve(file);
              return;
            }
            ctx.fillStyle = "#FFFFFF";
            ctx.fillRect(0, 0, width, height);
            ctx.imageSmoothingEnabled = true;
            ctx.imageSmoothingQuality = "high";
            ctx.drawImage(fallbackImg, 0, 0, width, height);
            canvas.toBlob(
              (blob) => {
                if (!blob) {
                  resolve(file);
                  return;
                }
                const baseName = file.name.replace(/\.[^/.]+$/, "");
                resolve(
                  new File([blob], `${baseName}.jpg`, {
                    type: "image/jpeg",
                    lastModified: Date.now(),
                  })
                );
              },
              "image/jpeg",
              quality
            );
          } catch {
            resolve(file);
          }
        };
        fallbackImg.onerror = () => resolve(file);
        fallbackImg.src = e.target?.result as string;
      };
      reader.onerror = () => resolve(file);
      reader.readAsDataURL(file);
    };

    if (objectUrl) {
      img.src = objectUrl;
    } else {
      img.onerror(new Event("error"));
    }
  });
}

/**
 * 여러 장의 이미지 파일을 순차적으로 압축합니다.
 */
export async function compressImages(
  files: File[],
  onProgress?: (current: number, total: number) => void
): Promise<File[]> {
  const result: File[] = [];
  for (let i = 0; i < files.length; i++) {
    onProgress?.(i + 1, files.length);
    const compressed = await compressImage(files[i]);
    result.push(compressed);
  }
  return result;
}
