export interface DefaultEngine {
  [engine: string]: engineInfo;
}
export interface engineInfo {
  name: string;
  url: string;
  translation?: string;
  icon: string;
}
