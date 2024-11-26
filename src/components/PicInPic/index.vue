<template>
  <div class="pic-in-pic-content" ref="picInPicContainer">
    <slot />
  </div>
</template>

<script setup lang="ts">
import { ref, watch, defineEmits } from 'vue';
import { useNoteDataStore } from '@/stores';

// Store，用于管理便签数据
const noteStore = useNoteDataStore();

// 自定义事件，用于通知父组件关闭画中画
const emit = defineEmits(['closePicInPicEvent']);

// 检测是否支持 `documentPictureInPicture` API
const isPicInPicSupported = 'documentPictureInPicture' in window;

if (!isPicInPicSupported) {
  console.warn('当前浏览器不支持画中画功能');
}

// Props 定义
const props = defineProps({
  show: {
    type: Boolean, // 是否显示画中画
    default: true
  },
  picWidth: {
    type: Number, // 画中画宽度
    default: 300
  },
  picHeight: {
    type: Number, // 画中画高度
    default: 300
  },
  isClone: {
    type: Boolean, // 是否使用克隆节点
    default: true
  }
});

// 画中画容器引用
const picInPicContainer = ref<HTMLElement>();

// 监听 `show` 属性的变化
watch(
  () => props.show,
  async (val) => {
    if (!isPicInPicSupported) return;

    if (val) {
      await createPicInPic(); // 创建画中画
      updateStoreData(); // 更新 store 数据
    } else {
      closePicInPic(); // 关闭画中画
    }
  }
);

/**
 * 创建画中画窗口
 */
async function createPicInPic() {
  if (!isPicInPicSupported) return;

  // 更新 store 数据，通知画中画显示的便签内容
  noteStore.updateDisplayPicInPicNoteData(noteStore.displayNoteDetailData);

  // 请求创建画中画窗口
  const pipWindow = await window.documentPictureInPicture.requestWindow({
    width: props.picWidth,
    height: props.picHeight
  });

  // 插入 DOM 节点
  if (picInPicContainer.value) {
    const nodeToInsert = props.isClone
      ? picInPicContainer.value.cloneNode(true)
      : picInPicContainer.value;

    pipWindow.document.body.appendChild(nodeToInsert as Node);
  }

  // 同步样式表到画中画窗口
  syncStylesToPipWindow(pipWindow);
  addBodyStylesToPipWindow(pipWindow);

  // 监听窗口关闭事件
  pipWindow.addEventListener('pagehide', closePicInPicEvent);
}

/**
 * 同步样式表到画中画窗口
 * @param pipWindow 画中画窗口对象
 */
function syncStylesToPipWindow(pipWindow: Window) {
  [...document.styleSheets].forEach((styleSheet) => {
    try {
      const cssRules = [...styleSheet.cssRules].map((rule) => rule.cssText).join('');
      const style = document.createElement('style');
      style.textContent = cssRules;
      pipWindow.document.head.appendChild(style);
    } catch (e) {
      // 如果有跨域，访问styleSheet.cssRules时会报错。
      // 通过 link 引入样式。如<link rel="stylesheet" type="text/css" href="https://abc.css">
      const link = document.createElement('link');
      /**
       * rel = stylesheet 导入样式表
       * type: 对应的格式
       * media: 媒体查询（如 screen and (max-width: 600px)）
       *  href: 外部样式表的 URL
       */
      link.rel = 'stylesheet';
      link.type = styleSheet.type;
      link.media = styleSheet.media.mediaText;
      link.href = (styleSheet as CSSStyleSheet).href ?? '';
      pipWindow.document.head.appendChild(link);
    }
  });
}

/**
 * 设置随机背景样式到画中画窗口
 * @param pipWindow 画中画窗口对象
 */
function addBodyStylesToPipWindow(pipWindow: Window) {
  // 随机背景样式
  const bgRandom = 3 || Math.floor(Math.random() * 6 + 1);
  const style = document.createElement('style');
  style.textContent = `
    body {
      background-image: url("./background/bg${bgRandom}.jpg");
      background-size: contain;
    }
  `;
  pipWindow.document.head.appendChild(style);
}

/**
 * 关闭画中画事件，通知父组件
 */
function closePicInPicEvent(e: Event) {
  emit('closePicInPicEvent', e); // 触发自定义事件
}

/**
 * 关闭画中画
 */
function closePicInPic() {
  if (!isPicInPicSupported) return;
  const pipWindow = window.documentPictureInPicture.window;
  if (pipWindow) {
    pipWindow.close(); // 关闭画中画窗口
  }
}

/**
 * 更新便签 store 数据
 */
function updateStoreData() {
  noteStore.updateDisplayPicInPicNoteData(noteStore.displayNoteDetailData);
  noteStore.clearDisplayNoteDetail();
}
</script>

<style lang="scss" scoped>
.pic-in-pic-content {
  width: 100%;
  height: 100%;
}
</style>
