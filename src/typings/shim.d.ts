declare module '@/utils/timeTools' {
  export function getGreeting(): string;
  export function getCurrentTime(ShowZero?: boolean, Use12Hour?: boolean): any;
}
declare module '@/utils/request' {
  import { AxiosStatic } from 'axios';
  const axios: AxiosStatic;
  export default axios;
}

declare module '@/utils/identifyInput' {
  const identifyInput: (input: string) => text;
  export default identifyInput;
}

// declare module '@/utils/tool' {
//   export const debounce: (
//     func: (...args: any[]) => void,
//     delay: number
//   ) => (...args: any[]) => void;

// }

declare module '@/utils/domTools' {
  export const findMaxZIndex: (min?: number) => number;
}
declare module '@/assets/defaultEngine.json' {
  interface defaultEngine {
    [str: string]: {
      name: string;
      url: string;
      translation: string;
      icon: string;
    };
  }
  export default defaultEngine;
}
declare module 'lunar-calendar' {
  // 定义 LunarData 接口
  interface LunarData {
    lunarYear: number;
    lunarMonth: number;
    lunarDay: number;
    GanZhiYear: string;
    GanZhiMonth: string;
    GanZhiDay: string;
    lunarMonthName: string;
    lunarDayName: string;
    isLeapMonth: boolean;
  }

  // 声明一个函数 solarToLunar，返回 LunarData 对象
  export function solarToLunar(year: number, month: number, day: number): LunarData;
}
declare module 'lunar-calendar' {
  type SearchEngines = {
    [key: string]: {
      name: string;
      url: string;
      translation: string;
      icon: string;
    };
  };
}
