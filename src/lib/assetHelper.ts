const BASE_PATH = import.meta.env.BASE_URL || '/';

export function getAssetPath(assetPath: string): string {
  const cleanPath = assetPath.startsWith('/') ? assetPath.slice(1) : assetPath;
  const separator = BASE_PATH.endsWith('/') ? '' : '/';
  return `${BASE_PATH}${separator}${cleanPath}`;
}