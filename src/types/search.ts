export interface defaultEngine {
  [engine: string]: engineInfo
}
export interface engineInfo {
  name: string
  url: string
  translation?: string
  icon: string
}
