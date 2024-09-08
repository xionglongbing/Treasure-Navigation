/**
 * 防抖函数
 * @param {Function} func - 要进行防抖处理的函数
 * @param {number} delay - 延迟时间，单位毫秒
 * @returns {Function} - 返回一个新的函数，该函数在指定的时间间隔内最多只会执行一次
 */
export const debounce = (
  func: (...args: any[]) => void,
  delay: number
): ((...args: any[]) => void) => {
  let timerId: NodeJS.Timeout;

  // 返回一个新的函数
  return (...args: any[]) => {
    // 清除上一个定时器
    clearTimeout(timerId);

    // 设置新的定时器，在指定的延迟时间后执行函数
    timerId = setTimeout(() => {
      func.apply(this, args);
    }, delay);
  };
};

interface Handler {
  setNext(handler: Handler): Handler;
  handle(...arg: any[]): any;
}

export class ChainOfResponsibility implements Handler {
  public nextFn: Handler | null;
  constructor(public fn: Function) {
    this.nextFn = null;
  }
  setNext(nextFn: Handler) {
    return (this.nextFn = nextFn);
  }
  handle(...arg: any[]) {
    const res = this.fn(...arg);
    if (res === 'next') {
      return this.nextFn && this.nextFn.handle(...arg);
    }
    return null;
  }
}
