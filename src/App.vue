<template>
  <Provider>
    <!-- 壁纸 -->
    <Cover @loadComplete="loadComplete" />
    <div class="page-main__layout" id="main-page">
      <header class="page-header">
        <div class="header--fix">
          <MenuList />
        </div>
      </header>
      <Transition name="fade" mode="out-in">
        <!-- 主界面 -->
        <main
          class="layout-main"
          v-if="status.imgLoadStatus"
          :style="{ pointerEvents: mainClickable ? 'auto' : 'none' }"
          @click="status.setMenuStatus('normal')"
          @contextmenu="mainContextmenu"
          @keydown="mainPressKeyboard"
        >
          <SearchInp @contextmenu.stop />
          <AllFunc @contextmenu.stop />
        </main>
        <div v-else id="loading">
          <img src="/icon/logo.png" alt="logo" class="logo" />
          <span class="tip">开发中</span>
        </div>
      </Transition>
    </div>
  </Provider>
</template>

<script setup lang="ts">
defineOptions({
  name: 'App'
});
import { onMounted, nextTick, watch, ref } from 'vue';
import { statusStore, setStore } from '@/stores';
import { getGreeting } from '@/utils/timeTools';
import Provider from '@/components/Provider.vue';
import Cover from '@/components/Cover.vue';
import SearchInp from '@/components/SearchInput/SearchInp.vue';
import MainColorModal from '@/components/MainColorModal/index.vue';
import ToolBox from '@/components/AllFunc/ToolBox.vue';
import AllSet from '@/components/AllFunc/AllSet.vue';
// import ShortCut from '@/components/AllFunc/Box/ShortCut.vue';
import MenuList from '@/components/Layout/Menu.vue';

const set = setStore();
const status = statusStore();
console.log('status', status);
const mainClickable = ref<boolean>(false);

// 获取配置
const welcomeText: string = import.meta.env.VITE_WELCOME_TEXT ?? '欢迎访问本站';

// 鼠标右键
const mainContextmenu = (event: MouseEvent) => {
  event.preventDefault();
  status.setMenuStatus('set');
};

// 加载完成事件
const loadComplete = () => {
  nextTick().then(() => {
    mainClickable.value = true;
    window.$message.info(getGreeting() + '，' + welcomeText, {
      showIcon: false,
      duration: 3000
    });
  });
};

// 全局键盘事件
const mainPressKeyboard = (event: KeyboardEvent) => {
  const keyCode = event.keyCode;
  // 回车
  if (keyCode === 13) {
    // focus 元素
    const mainInput = document.getElementById('main-input') as HTMLInputElement;
    // status.setMenuStatus('focus');
    mainInput?.focus();
  }
};

// 根据主题类别更改
const changeThemeType = (val: string) => {
  const htmlElement = document.querySelector('html') as HTMLElement;
  const themeType = val === 'light' ? 'light' : 'dark';
  htmlElement.setAttribute('theme', themeType);
};

// 监听颜色变化
watch(
  () => set.themeType,
  (val: string) => changeThemeType(val)
);

onMounted(() => {
  changeThemeType(set.themeType);
});
</script>

<style lang="scss" scoped>
#loading {
  width: 100%;
  height: 100%;
}
.page-main__layout {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  .page-header {
    width: 100%;
    height: 58px;
    padding: 10px;
    backdrop-filter: blur(80px); // 可以成为fixed的基准父元素
    .header--fix {
      position: fixed;
      top: 0;
      left: 0;
      display: flex;
      flex-direction: column;
      align-items: center;
      width: 100%;
      height: 100%;
    }
  }
  .layout-main {
    flex: 1;
    display: flex;
    justify-content: center;
    align-items: center;
  }
}
#loading {
  color: var(--main-text-color);
  .logo {
    width: 100px;
    height: 100px;
    margin-bottom: 24px;
    animation: logo-breathe 3s infinite alternate;
  }
  .tip {
    font-size: 20px;
  }
}
</style>
