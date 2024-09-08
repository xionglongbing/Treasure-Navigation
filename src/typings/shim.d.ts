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
