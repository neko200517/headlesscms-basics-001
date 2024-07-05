// URLの絶対パスを取得する
export function getImageUrl(url: string) {
  if (url.includes('http://') || url.includes('https://')) return url;

  return new URL(url, process.env.NEXT_PUBLIC_STORAGE_BASE_URL).toString();
}
