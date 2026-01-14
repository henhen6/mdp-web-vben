import CryptoJS from 'crypto-js';

export function resetSize(vm: any) {
  // 图片的宽度、高度，移动条的宽度、高度

  const parentWidth = vm.$el.parentNode.offsetWidth || window.innerWidth;
  const parentHeight = vm.$el.parentNode.offsetHeight || window.innerHeight;
  const img_width = vm.imgSize.width.includes('%')
    ? `${(Number.parseInt(vm.imgSize.width, 10) / 100) * parentWidth}px`
    : vm.imgSize.width;

  const img_height = vm.imgSize.height.includes('%')
    ? `${(Number.parseInt(vm.imgSize.height, 10) / 100) * parentHeight}px`
    : vm.imgSize.height;

  const bar_width = vm.barSize.width.includes('%')
    ? `${(Number.parseInt(vm.barSize.width, 10) / 100) * parentWidth}px`
    : vm.barSize.width;

  const bar_height = vm.barSize.height.includes('%')
    ? `${(Number.parseInt(vm.barSize.height, 10) / 100) * parentHeight}px`
    : vm.barSize.height;

  return {
    imgWidth: img_width,
    imgHeight: img_height,
    barWidth: bar_width,
    barHeight: bar_height,
  };
}

const defaultKeyWork = 'XwKsGlMcdPMEhR1B';

export function encryptByAes(word: string, keyWord = defaultKeyWork) {
  const key = CryptoJS.enc.Utf8.parse(keyWord);
  const arcs = CryptoJS.enc.Utf8.parse(word);
  const encrypted = CryptoJS.AES.encrypt(arcs, key, {
    mode: CryptoJS.mode.ECB,
    padding: CryptoJS.pad.Pkcs7,
  });
  return encrypted.toString();
}
