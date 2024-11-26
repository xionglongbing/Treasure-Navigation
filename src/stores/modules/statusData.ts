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
      engineChangeStatus: false,
      toolBoxCheckedtabs: "sitDefaultNav"
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

    function setToolBoxCheckedtabs(val: StatusDataState["toolBoxCheckedtabs"]) {
      state.toolBoxCheckedtabs = val;
    }
    

    // 返回状态和方法
    return {
      ...toRefs(state),
      setImgLoadStatus,
      setMenuStatus,
      setEngineChangeStatus,
      setToolBoxCheckedtabs
    };
  },
  {
    persist: {
      key: 'statusData',
      storage: window.localStorage,
      pick: ['menuStatus','toolBoxCheckedtabs']
    }
  }
);

export default useStatusDataStore;
