import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import isBetween from 'dayjs/plugin/isBetween';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';

dayjs.extend(duration);
dayjs.extend(isSameOrBefore);
dayjs.extend(isSameOrAfter);
dayjs.extend(isBetween);
dayjs.extend(utc);
dayjs.extend(timezone);

dayjs.tz.setDefault('Asia/Shanghai');

const DATE_TIME_FORMAT = 'YYYY-MM-DD HH:mm:ss';
const DATE_FORMAT = 'YYYY-MM-DD';
const TIME_FORMAT = 'HH:mm:ss';

type Format =
  | 'HH'
  | 'HH:mm'
  | 'YYYY'
  | 'YYYY-MM'
  | 'YYYY-MM-DD HH'
  | 'YYYY-MM-DD HH:mm'
  | (string & {})
  | typeof DATE_FORMAT
  | typeof DATE_TIME_FORMAT
  | typeof TIME_FORMAT;

/**
 * 格式化日期
 * @param time 日期
 * @param format 格式
 * @returns 格式化后的字符串
 */
export function formatDate(
  time?: dayjs.ConfigType,
  format: Format = DATE_FORMAT,
): string {
  try {
    const date = dayjs.isDayjs(time) ? time : dayjs(time);
    if (!date.isValid()) {
      throw new Error('Invalid date');
    }
    return date.tz().format(format);
  } catch (error) {
    console.error(`Error formatting date: ${error}`);
    return String(time ?? '');
  }
}

/**
 * 格式化日期+时间
 * @param date 日期时间
 * @param format 格式
 * @returns 格式化后的字符串
 */
export function formatDateTime(
  date?: dayjs.ConfigType,
  format: Format = DATE_TIME_FORMAT,
): string {
  return formatDate(date, format);
}

/**
 * 格式化时间
 * @param date 时间
 * @param format 格式
 * @returns 格式化后的字符串
 */
export function formatTime(
  date: dayjs.Dayjs | undefined = undefined,
  format: Format = TIME_FORMAT,
): string {
  return formatDate(date, format);
}

export function isDate(value: any): value is Date {
  return value instanceof Date;
}

export function isDayjsObject(value: any): value is dayjs.Dayjs {
  return dayjs.isDayjs(value);
}

/**
 * 转换日期
 * <p>
 * 0: 今天结束的日期
 * 1m: 1分钟后的日期
 * 1h: 1小时后的日期
 * 4d: 4天后的日期
 * 2w: 2周后的日期
 * 3M: 3个月后的日期
 * 5y: 5年后的日期
 *
 * @param dateTime 待转换日期，格式为 yyyy-MM-dd HH:mm:ss
 * @param time     转换格式 如：
 *                 0 当天23:59:59
 *                 1s 1秒后
 *                 3m 3分钟后
 *                 2w 2周后
 *                 1h 1小时后
 *                 2H 2小时后
 *                 4d 4天后
 *                 5M 5月后
 *                 6y 6年后
 * @return 日期
 */
export function conversionDateTime(
  dateTime: null | string | undefined,
  time: string,
): dayjs.Dayjs {
  if (!time || time.trim() === '') {
    // JavaScript中没有直接的MAX日期，但可以设置一个很大的日期
    return dayjs(8_640_000_000_000_000);
  }

  // 如果没有提供dateTime，使用当前时间；否则解析yyyy-MM-dd HH:mm:ss格式的字符串
  const targetDate = dateTime
    ? dayjs(dateTime, 'YYYY-MM-DD HH:mm:ss')
    : dayjs();

  // 处理 time 为 '0' 的情况：返回今天的 23:59:59（默认含毫秒，可按需去除）
  if (time === '0') {
    return dayjs().endOf('day').set('millisecond', 0); // 可选：移除毫秒，精确到秒
  }

  // 获取单位
  const unit =
    time.length > 1 ? time.charAt(time.length - 1).toLowerCase() : 'd';
  // 获取数值部分
  const value = Number.parseInt(
    time.slice(0, Math.max(0, time.length > 1 ? time.length - 1 : 0)) || '1',
    10,
  );

  switch (unit) {
    // 时
    case 'h': {
      return targetDate.add(value, 'hour');
    }
    // 分
    case 'm': {
      return targetDate.add(value, 'minute');
    }
    // 月
    case 'M': {
      return targetDate.add(value, 'month');
    }
    // 秒
    case 's': {
      return targetDate.add(value, 'second');
    }
    // 周
    case 'w': {
      return targetDate.add(value, 'week');
    }
    // 年
    case 'y': {
      return targetDate.add(value, 'year');
    }
    // 天（默认）
    default: {
      return targetDate.add(value, 'day');
    }
  }
}

const dateUtil = dayjs;

export { dateUtil };

/**
 * 获取当前时区
 * @returns 当前时区
 */
export const getSystemTimezone = () => {
  return dayjs.tz.guess();
};

/**
 * 自定义设置的时区
 */
let currentTimezone = getSystemTimezone();

/**
 * 设置默认时区
 * @param timezone
 */
export const setCurrentTimezone = (timezone?: string) => {
  currentTimezone = timezone || getSystemTimezone();
  dayjs.tz.setDefault(currentTimezone);
};

/**
 * 获取设置的时区
 * @returns 设置的时区
 */
export const getCurrentTimezone = () => {
  return currentTimezone;
};
