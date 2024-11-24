<template>
  <div class="cover">
    <img
      v-show="status.imgLoadStatus"
      class="background"
      alt="background"
      :src="bgUrl"
      :style="{ '--blur': set.backgroundBlur + 'px' }"
      @load="imgLoadComplete"
      @error.once="imgLoadError"
      @animationend="imgAnimationEnd"
    />
    <Transition name="fade">
      <div v-if="set.showBackgroundGray" class="gray" />
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue';
import { statusStore, setStore } from '@/stores';

const set = setStore();
const status = statusStore();
const bgUrl = ref<string | undefined>(undefined);
const imgTimeout = ref<number | null>(null);
const emit = defineEmits<{
  (e: 'loadComplete'): void;
}>();

// 壁纸随机数
// 请依据文件夹内的图片个数修改 Math.random() 后面的第一个数字
const bgRandom = Math.floor(Math.random() * 6 + 1);

// 赋值壁纸函数
const setBgUrl = () => {
  const { backgroundType, backgroundCustom } = set;
  switch (backgroundType) {
    case 0:
      bgUrl.value = `./background/bg${bgRandom}.jpg`;
      break;
    case 1: {
      const isMobile = window.innerWidth < 768;
      bgUrl.value = `https://api.dujin.org/bing/${isMobile ? 'm' : '1920'}.php`;
      break;
    }
    case 2:
      bgUrl.value = set.backgroundCustom;
      break;
    default:
      bgUrl.value = `/background/bg${bgRandom}.jpg`;
      break;
  }
};

// 图片加载完成事件处理
const imgLoadComplete = () => {
  status.setImgLoadStatus(true);
};

// 图片动画完成事件处理
const imgAnimationEnd = () => {
  console.log('壁纸加载且动画完成');
  emit('loadComplete');
};

// 图片加载失败事件处理
const imgLoadError = () => {
  console.error('壁纸加载失败：', bgUrl.value);
  window.$message.error('壁纸加载失败，已临时切换回默认');
  bgUrl.value = `./background/bg${bgRandom}.jpg`;
};

// 组件挂载时执行
onMounted(() => {
  setBgUrl();
});
</script>

<style lang="scss" scoped>
.cover {
  width: 100%;
  height: 100%;
  position: absolute;
  background-color: var(--body-background-color);
  &.focus {
    .background {
      filter: blur(calc(var(--blur) + 10px)) brightness(0.8);
      transform: scale(1.3);
    }
  }
  .background {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    backface-visibility: hidden;
    transform: scale(1.2);
    filter: blur(var(--blur));
    transition:
      filter 0.3s,
      transform 0.3s;
    animation: fade-blur-in 1s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  }
  .gray {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background-image: radial-gradient(rgba(0, 0, 0, 0) 0, rgba(0, 0, 0, 0.5) 100%),
      radial-gradient(rgba(0, 0, 0, 0) 33%, rgba(0, 0, 0, 0.3) 166%);
  }
}
</style>
