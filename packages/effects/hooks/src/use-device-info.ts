import { ref } from 'vue';

import { randomNum } from '@vben/utils';

export function useDeviceInfo() {
  const DEVICE_ID_KEY = 'deviceId';
  // 设备信息响应式对象
  const deviceInfo = ref({
    browser: '未知', // 浏览器名称
    browserVersion: '未知', // 浏览器版本
    os: '未知', // 操作系统
    osVersion: '未知', // 系统版本
    deviceType: '未知', // 设备类型（PC/移动端/平板）
    deviceModel: '未知', // 设备型号（Web端能力有限）
    screenWidth: 0, // 屏幕宽度
    screenHeight: 0, // 屏幕高度
    pixelRatio: 1, // 设备像素比
    userAgent: '', // 完整User-Agent
    deviceId: '', // 设备ID（UUIDv4）
  });

  // 初始化设备信息
  const initDeviceInfo = () => {
    const ua = navigator.userAgent.toLowerCase(); // 获取User-Agent
    const screen = window.screen;
    const pixelRatio = window.devicePixelRatio || 1;

    // 1. 解析浏览器信息
    let browser = '未知';
    let browserVersion = '未知';
    if (ua.includes('edge')) {
      browser = 'Edge';
      browserVersion = ua.match(/edge\/([\d.]+)/)?.[1] || '未知';
    } else if (ua.includes('chrome')) {
      browser = 'Chrome';
      browserVersion = ua.match(/chrome\/([\d.]+)/)?.[1] || '未知';
    } else if (ua.includes('safari')) {
      browser = 'Safari';
      browserVersion = ua.match(/version\/([\d.]+)/)?.[1] || '未知';
    } else if (ua.includes('firefox')) {
      browser = 'Firefox';
      browserVersion = ua.match(/firefox\/([\d.]+)/)?.[1] || '未知';
    }

    // 2. 解析操作系统信息
    let os = '未知';
    let osVersion = '未知';
    if (ua.includes('windows')) {
      os = 'Windows';
      osVersion = ua.match(/windows nt ([\d.]+)/)?.[1] || '未知';
    } else if (ua.includes('mac os')) {
      os = 'Mac OS';
      osVersion =
        ua.match(/mac os x ([\d_]+)/)?.[1]?.replaceAll('_', '.') || '未知';
    } else if (
      ua.includes('ios') ||
      ua.includes('iphone') ||
      ua.includes('ipad')
    ) {
      os = 'iOS';
      osVersion = ua.match(/os ([\d_]+)/)?.[1]?.replaceAll('_', '.') || '未知';
    } else if (ua.includes('android')) {
      os = 'Android';
      osVersion = ua.match(/android ([\d.]+)/)?.[1] || '未知';
    }

    // 3. 解析设备类型
    let deviceType = 'PC';
    if (
      ua.includes('mobile') ||
      ua.includes('android') ||
      ua.includes('iphone')
    ) {
      deviceType = '移动端';
    } else if (
      ua.includes('ipad') ||
      (ua.includes('mac os') && navigator.maxTouchPoints > 1)
    ) {
      deviceType = '平板'; // 适配Mac触摸设备
    }

    // 4. 解析设备型号（Web端能力有限，仅部分设备支持）
    let deviceModel = '未知';
    if (ua.includes('iphone')) {
      deviceModel =
        ua.match(/iphone; cpu iphone os .*? like mac os x.*?\) (.*)$/)?.[1] ||
        'iPhone';
    } else if (ua.includes('ipad')) {
      deviceModel = 'iPad';
    } else if (ua.includes('android')) {
      deviceModel = ua.match(/android.*?; (.*?) build\//)?.[1] || 'Android设备';
    }

    let deviceId: null | string = localStorage.getItem(DEVICE_ID_KEY);
    if (!deviceId) {
      // 生成UUIDv4（通用唯一识别码，确保唯一性）
      deviceId = randomNum(20);
      // 存储到localStorage，永久保存（除非手动清除）
      localStorage.setItem(DEVICE_ID_KEY, deviceId);
    }

    // 更新设备信息
    deviceInfo.value = {
      browser,
      browserVersion,
      deviceId,
      os,
      osVersion,
      deviceType,
      deviceModel,
      screenWidth: screen.width,
      screenHeight: screen.height,
      pixelRatio,
      userAgent: navigator.userAgent,
    };
  };

  // 执行初始化（Web端可直接调用，无需等待生命周期）
  initDeviceInfo();

  return { deviceInfo };
}
