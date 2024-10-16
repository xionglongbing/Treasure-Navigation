import { defineStore } from 'pinia';
import { reactive, toRefs } from 'vue';
import { storeToRefs } from 'pinia';
import type { StatusDataState } from '../types/type';

const useStatusDataStore = defineStore(
  'statusData',
  () => {
    // 定义状态
    const state = reactive<StatusDataState>({
      imgLoadStatus: false,
      menuStatus: 'menu',
      engineChangeStatus: false,
      searchInputValue: ''
    });

    // 定义actions
    const setImgLoadStatus = (value: boolean) => {
      console.log('value', value);
      state.imgLoadStatus = value;
    };

    const setMenuStatus = (value: StatusDataState['menuStatus'], alsoChange = true) => {
      state.menuStatus = value;
      if (value !== 'focus') state.searchInputValue = '';
      if (alsoChange) state.engineChangeStatus = false;
    };

    const setEngineChangeStatus = (value: boolean) => {
      state.engineChangeStatus = value;
    };

    const setSearchInputValue = (value: string) => {
      state.searchInputValue = value;
    };

    // 返回状态和方法
    return {
      ...toRefs(state),
      setImgLoadStatus,
      setMenuStatus,
      setEngineChangeStatus,
      setSearchInputValue
    };
  },
  {
    persist: {
      key: 'statusData',
      storage: window.localStorage,
      paths: ['menuStatus']
    }
  }
);

export default useStatusDataStore;
