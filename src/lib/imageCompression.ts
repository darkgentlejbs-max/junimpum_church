/**
 * 클라이언트 측 이미지 압축 유틸리티
 * 스마트폰(아이폰/갤럭시) 원본 고해상도 사진(5MB~20MB)을
 * 웹 및 노션/Vercel 업로드 한도(4.5MB/5MB) 이내의 고화질(약 300KB~800KB)로 자동 압축합니다.
 */

export async function compressImage(
  file: File,
  maxWidth = 1920,
  maxHeight = 1920,
  quality = 0.85
): Promise<File> {
  // 이미지가 아닌 경우(예: 주보 PDF 등) 그대로 반환
  if (!file.type.startsWith("image/") && !/\.(jpe?g|png|webp|heic|bmp)$/i.test(file.name)) {
    return file;
  }

  // 400KB 이하의 이미지는 이미 충분히 작으므로 그대로 사용
  if (file.size <= 400 * 1024) {
    return file;
  }

  return new Promise((resolve) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      const img = new Image();

      img.onload = () => {
        let width = img.naturalWidth || img.width;
        let height = img.naturalHeight || img.height;

        // 원본 비율을 유지하며 최대 너비/높이에 맞게 축소 계산
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

        // 흰색 배경 채우기 (투명 PNG 등 변환 시 검은 배경 방지)
        ctx.fillStyle = "#FFFFFF";
        ctx.fillRect(0, 0, width, height);

        // 부드러운 이미지 리샘플링
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = "high";
        ctx.drawImage(img, 0, 0, width, height);

        // JPEG 형식으로 고화질 압축 변환
        canvas.toBlob(
          (blob) => {
            if (!blob) {
              resolve(file);
              return;
            }

            // 파일 확장자를 .jpg로 통일
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
      };

      img.onerror = () => {
        // 이미지 로드 실패 시 원본 파일 그대로 반환
        resolve(file);
      };

      img.src = e.target?.result as string;
    };

    reader.onerror = () => {
      resolve(file);
    };

    reader.readAsDataURL(file);
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
