import { defineStore } from 'pinia';
import { reactive, toRefs } from 'vue';
import type { StatusDataState } from '@/types/type';

const useStatusDataStore = defineStore(
  'statusData',
  () => {
    // 定义状态
    const state = reactive<StatusDataState>({
      imgLoadStatus: false,
      menuStatus: 'menu',
      engineChangeStatus: false
    });

    // 定义actions
    const setImgLoadStatus = (value: boolean) => {
      console.log('value', value);
      state.imgLoadStatus = value;
    };

    const setMenuStatus = (value: StatusDataState['menuStatus'], alsoChange = true) => {
      state.menuStatus = value;
      if (alsoChange) {
        setEngineChangeStatus(false);
      }
    };

    const setEngineChangeStatus = (value: boolean) => {
      state.engineChangeStatus = value;
    };

    // 返回状态和方法
    return {
      ...toRefs(state),
      setImgLoadStatus,
      setMenuStatus,
      setEngineChangeStatus
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
