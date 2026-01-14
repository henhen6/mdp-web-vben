export function isUrl(path: string): boolean {
  // const reg = /^http(s)?:\/\/([\w-]+\.)+[\w-]+(\/[\w- ./?%&=]*)?/;
  const reg = /^https?:\/\/[\w.-]+(?::\d+)?(?:\/\S*)?$/;
  return reg.test(path);
}
