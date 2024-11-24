<template>
  <!-- 可选是否将元素插入到 body -->
  <Teleport to="body" :disabled="!appendToBody">
    <div
      ref="draggableContainer"
      class="draggable-container"
      v-bind="$attrs"
      @mousedown="startDrag"
      :style="containerStyle"
    >
      <!-- 插槽内容 -->
      <slot></slot>

      <!-- 缩放控制点 -->
      <span
        v-for="type in resizeTypes"
        :key="type"
        :resize-type="type"
        :class="`${type}-resize`"
        @mousedown="startResize"
      ></span>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, computed, onUnmounted } from 'vue';

// 可缩放的边和角
const resizeTypes = Object.freeze(['lt', 't', 'rt', 'r', 'rb', 'b', 'lb', 'l']);

// 定义 props
const props = defineProps({
  appendToBody: { type: Boolean, default: true }, // 是否插入 body
  zIndex: { type: Number, default: 1 },          // 层级
  left: { type: Number, default: 0 },            // 初始 X 位置
  top: { type: Number, default: 0 },             // 初始 Y 位置
  width: { type: Number, default: 300 },         // 初始宽度
  height: { type: Number, default:300 },         // 初始高度
  minWidth: { type: Number, default: 100 },      // 最小宽度
  minHeight: { type: Number, default: 100 }      // 最小高度
});

// 容器相关数据
const position = ref({ x: props.left, y: props.top }); // 容器位置
const size = ref({ width: props.width, height: props.height }); // 容器大小
const draggableContainer = ref<HTMLDivElement | null>(null); // 容器引用

// 计算容器样式
const containerStyle = computed(() => ({
  top: `${position.value.y}px`,
  left: `${position.value.x}px`,
  width: `${size.value.width}px`,
  height: `${size.value.height}px`,
  zIndex: props.zIndex
}));

/**
 * 拖拽逻辑
 */
let originMouseX = 0; // 鼠标初始 X 坐标
let originMouseY = 0; // 鼠标初始 Y 坐标
let originContainX = 0; // 容器初始 X 坐标
let originContainY = 0; // 容器初始 Y 坐标

const startDrag = (event: MouseEvent) => {
  originMouseX = event.clientX;
  originMouseY = event.clientY;
  originContainX = position.value.x;
  originContainY = position.value.y;

  document.addEventListener('mousemove', handleDrag);
  document.addEventListener('mouseup', stopDrag);
};

const handleDrag = (event: MouseEvent) => {
  position.value.x = originContainX + event.clientX - originMouseX;
  position.value.y = originContainY + event.clientY - originMouseY;
};

/**
 * 缩放逻辑
 */
let originWidth = 0; // 容器初始宽度
let originHeight = 0; // 容器初始高度
let resizeType = ''; // 当前缩放类型

const startResize = (event: MouseEvent) => {
  const target = event.target as HTMLSpanElement;
  resizeType = target.getAttribute('resize-type') || '';

  originMouseX = event.clientX;
  originMouseY = event.clientY;
  originContainX = position.value.x;
  originContainY = position.value.y;
  originWidth = size.value.width;
  originHeight = size.value.height;

  event.stopPropagation();

  document.addEventListener('mousemove', handleResize);
  document.addEventListener('mouseup', stopDrag);
};

const handleResize = (event: MouseEvent) => {
  const deltaX = event.clientX - originMouseX;
  const deltaY = event.clientY - originMouseY;

  let newWidth = originWidth;
  let newHeight = originHeight;

  switch (resizeType) {
    case 'lt': // 左上角
      newWidth = originWidth - deltaX;
      newHeight = originHeight - deltaY;
      if (newWidth >= props.minWidth) {
        position.value.x = originContainX + deltaX;
        size.value.width = newWidth;
      }
      if (newHeight >= props.minHeight) {
        position.value.y = originContainY + deltaY;
        size.value.height = newHeight;
      }
      break;

    case 't': // 上边
      newHeight = originHeight - deltaY;
      if (newHeight >= props.minHeight) {
        position.value.y = originContainY + deltaY;
        size.value.height = newHeight;
      }
      break;

    case 'rt': // 右上角
      newWidth = originWidth + deltaX;
      newHeight = originHeight - deltaY;
      if (newWidth >= props.minWidth) {
        size.value.width = newWidth;
      }
      if (newHeight >= props.minHeight) {
        position.value.y = originContainY + deltaY;
        size.value.height = newHeight;
      }
      break;

    case 'r': // 右边
      newWidth = originWidth + deltaX;
      if (newWidth >= props.minWidth) {
        size.value.width = newWidth;
      }
      break;

    case 'rb': // 右下角
      newWidth = originWidth + deltaX;
      newHeight = originHeight + deltaY;
      if (newWidth >= props.minWidth) {
        size.value.width = newWidth;
      }
      if (newHeight >= props.minHeight) {
        size.value.height = newHeight;
      }
      break;

    case 'b': // 下边
      newHeight = originHeight + deltaY;
      if (newHeight >= props.minHeight) {
        size.value.height = newHeight;
      }
      break;

    case 'lb': // 左下角
      newWidth = originWidth - deltaX;
      newHeight = originHeight + deltaY;
      if (newWidth >= props.minWidth) {
        position.value.x = originContainX + deltaX;
        size.value.width = newWidth;
      }
      if (newHeight >= props.minHeight) {
        size.value.height = newHeight;
      }
      break;

    case 'l': // 左边
      newWidth = originWidth - deltaX;
      if (newWidth >= props.minWidth) {
        position.value.x = originContainX + deltaX;
        size.value.width = newWidth;
      }
      break;
  }
};

/**
 * 停止交互逻辑（拖拽或缩放）
 */
const stopDrag = () => {
  document.removeEventListener('mousemove', handleDrag);
  document.removeEventListener('mousemove', handleResize);
  document.removeEventListener('mouseup', stopDrag);
};

// 组件销毁时移除事件监听
onUnmounted(stopDrag);
</script>

<style lang="scss" scoped>
$lineOffset: -6px;
$cornerOffset: -8px;
/* 拖拽容器的样式 */
.draggable-container {
  position: fixed; /* 绝对定位 */
  cursor: move; /* 鼠标移动时显示抓手指针 */
  user-select: none; /* 禁止选中文本 */
  span {
    position: absolute;
    display: block;
  }
  /* 左边和右边 */
  .l-resize,
  .r-resize {
    width: 8px;
    height: 100%;
    top: 0;
    cursor: w-resize;
  }
  .l-resize {
    left: $lineOffset;
  }
  .r-resize {
    right: $lineOffset;
  }

  /* 上边和下边 */
  .t-resize,
  .b-resize {
    width: 100%;
    height: 8px;
    left: 0;
    cursor: s-resize;
  }
  .t-resize {
    top: $lineOffset;
  }
  .b-resize {
    bottom: $lineOffset;
  }
  /* 四个角 */
  .lt-resize,
  .rt-resize,
  .rb-resize,
  .lb-resize {
    width: 15px;
    height: 15px;
    z-index: 10;
  }
  .lt-resize,
  .lb-resize {
    left: $cornerOffset;
  }
  .lt-resize,
  .rt-resize {
    top: $cornerOffset;
  }
  .rt-resize,
  .rb-resize {
    right: $cornerOffset;
  }
  .rb-resize,
  .lb-resize {
    bottom: $cornerOffset;
  }

  .lt-resize,
  .rb-resize {
    cursor: se-resize;
  }
  .rt-resize,
  .lb-resize {
    cursor: sw-resize;
  }
}
</style>
