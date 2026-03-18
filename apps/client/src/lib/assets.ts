/**
 *
 * 사용법:
 *   <Tutorial.ImageSlot fileName="book-stack.png" ... />
 *
 * 이미지 파일은 /src/assets/ 폴더에 넣으면 자동으로 인식됩니다.
 */
const assetModules = import.meta.glob("../assets/**/*", {
  eager: true,
  query: "?url",
  import: "default",
}) as Record<string, string>;

export function getAssetUrl(fileName: string): string | undefined {
  const key = `../assets/${fileName}`;
  return assetModules[key];
}
