import { TinyColor } from '@ctrl/tinycolor';

export function isDarkColor(color: string) {
  return new TinyColor(color).isDark();
}

export function isLightColor(color: string) {
  return new TinyColor(color).isLight();
}

/**
 * Badge 的status
 */
export const BADGE_STATUS = [
  'default',
  'error',
  'processing',
  'success',
  'warning',
];
