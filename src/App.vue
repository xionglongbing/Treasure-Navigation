<template>
  <Provider>
    <!-- 壁纸 -->
    <Cover @loadComplete="loadComplete" />
    <div class="page-main__layout" id="main-page">
      <header class="page-header">
        <div class="header--fix">
          <MenuList />
          <SearchInp @contextmenu.stop />
        </div>
      </header>
      <Transition name="fade" mode="out-in">
        <!-- 主界面 -->
        <main
          class="layout-main"
          v-if="status.imgLoadStatus"
          :class="`main-${status.siteStatus}`"
          :style="{ pointerEvents: mainClickable ? 'auto' : 'none' }"
          @click="status.setSiteStatus('normal')"
          @contextmenu="mainContextmenu"
          @keydown="mainPressKeyboard"
        >
          <!-- <ShortCut /> -->
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
import AllFunc from '@/components/AllFunc/index.vue';
import ShortCut from '@/components/AllFunc/Box/ShortCut.vue';
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
  status.setSiteStatus('set');
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
    status.setSiteStatus('focus');
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
  width: 100%;
  height: 100%;
  .page-header {
    width: 100%;
    height: 110px;
    padding: 10px;
    backdrop-filter: blur(80px); // 可以成为fixed的基准父元素
    .header--fix {
      position: fixed;
      top: 0;
      display: flex;
      flex-direction: column;
      align-items: center;
      width: 100%;
      height: 100%;
    }
  }
  .main-normal,
  .main-focus {
    .main-box {
      opacity: 0;
      margin-top: 0;
      transform: scale(0.35);
      pointer-events: none;
    }
  }
  .main-box,
  .main-set {
    .main-box {
      opacity: 1;
      margin-top: 20vh;
      transform: scale(1);
      visibility: visible;
      @media (max-width: 478px) {
        margin-top: 22vh;
      }
    }
    .search-input {
      :deep(.all) {
        opacity: 0;
        width: 0;
        visibility: hidden;
      }
    }
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
