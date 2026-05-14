export function getSafeRedirectPath(value: string | null) {
  if (!value) {
    return "/";
  }

  if (!value.startsWith("/") || value.startsWith("//") || /[\r\n]/.test(value)) {
    return "/";
  }

  return value;
}
