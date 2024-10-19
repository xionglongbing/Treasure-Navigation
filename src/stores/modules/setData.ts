import { defineStore } from 'pinia';
import { ref, reactive, toRefs } from 'vue';
import type { SetDataState } from '@/types/type';

const useSetDataStore = defineStore(
  'setData',
  () => {
    const state = reactive<SetDataState>({
      themeType: 'light',
      backgroundType: 0,
      backgroundCustom: '',
      showBackgroundGray: true,
      backgroundBlur: 0,
      searchEngine: 'bing',
      lastSearchEngine: 'bing',
      customEngineUrl: '',
      smallInput: false,
      showCleanInput: true,
      autoFocus: false,
      autoInputBlur: true,
      timeStyle: 'one',
      showLunar: false,
      showSeconds: false,
      showZeroTime: true,
      use12HourFormat: false,
      showWeather: true,
      showSuggestions: true,
      urlJumpType: 'open'
    });

    const setSearchEngine = (value: string, custom = false) => {
      if (state.searchEngine !== 'custom') {
        state.lastSearchEngine = state.searchEngine;
      }
      if (custom) {
        state.customEngineUrl = value;
        state.searchEngine = 'custom';
      } else {
        state.searchEngine = value;
      }
    };

    const recoverSiteData = (data: SetDataState): boolean => {
      let isSuccess = false;
      try {
        let key: keyof SetDataState;
        // 类型保护，确保 key 的类型与 state[k] 的类型匹配
        for (key in data) {
          if (Object.prototype.hasOwnProperty.call(data, key)) {
            const item = data[key];
            state[key] = item;
          }
        }
        isSuccess = true;
      } catch (error) {
        console.error('站点数据恢复时处理失败：', error);
        isSuccess = false;
      }
      return isSuccess;
    };

    return {
      ...toRefs(state),
      setSearchEngine,
      recoverSiteData
    };
  },
  {
    persist: {
      key: 'setData',
      storage: window.localStorage
    }
  }
);

export default useSetDataStore;
