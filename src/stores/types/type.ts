// 声明setData状态类型
export interface SetDataState {
  themeType: string;
  backgroundType: number;
  backgroundCustom: string;
  showBackgroundGray: boolean;
  backgroundBlur: number;
  searchEngine: string;
  lastSearchEngine: string;
  customEngineUrl: string;
  smallInput: boolean;
  showCleanInput: boolean;
  autoFocus: boolean;
  autoInputBlur: boolean;
  timeStyle: string;
  showLunar: boolean;
  showSeconds: boolean;
  showZeroTime: boolean;
  use12HourFormat: boolean;
  showWeather: boolean;
  showSuggestions: boolean;
  urlJumpType: string;
  [key: string]: string | number | boolean;
}

//site

export interface SiteDataState {
  categoryDataList: CategoryData[];
  expandedCategoryNames: string[];
}

// 定义statusData状态类型
export interface StatusDataState {
  imgLoadStatus: boolean;
  siteStatus: 'normal' | 'focus' | 'menu' | 'set';
  engineChangeStatus: boolean;
  searchInputValue: string;
}

// 定义导航数据类型
export interface WebsiteData {
  name: string;
  url: string;
}

// 定义siteData状态类型
export interface CategoryData {
  categoryName: string;
  websiteDataList: WebsiteData[];
}

// 定义选中导航的数据
export interface WebsiteDataInfo {
  categoryName: string;
  websiteData: WebsiteData;
}

// 定义选中导航的数据
export interface WebsiteOrBatchData {
  categoryName: string;
  websiteData: WebsiteData | WebsiteData[];
}

//返回的提示信息
export interface MessageInfo {
  state: 'success' | 'error';
  message: string;
}
