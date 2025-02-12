<template>
  <!-- 使用 Teleport 组件决定是否将元素插入到 body 中 -->
  <!-- `appendToBody` 为 `true` 时，插入到 body，默认是插入到父元素 -->
  <Teleport to="body" :disabled="!appendToBody">
    <!-- 创建一个容器，支持拖拽，使用 ref 引用该容器 -->
    <div
      v-show="show"
      ref="draggableContainer"
      class="draggable-container"
      v-bind="$attrs"
      @mousedown="startDrag"
      :style="containerStyle"
    >
      <!-- 插槽，用户可以将其他内容插入到这个容器中 -->
      <slot></slot>

      <!-- 创建缩放控制点，每个控制点代表一个边角，使用 `v-for` 循环渲染 -->
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

// 定义可缩放的边和角的类型
const resizeTypes = Object.freeze(['lt', 't', 'rt', 'r', 'rb', 'b', 'lb', 'l']);

// 定义组件的 props（外部传入的属性）
const props = defineProps({
  show: {type: Boolean,default: false}, // 是否显示画中画
  appendToBody: { type: Boolean, default: true }, // 是否将容器插入到 body
  zIndex: { type: Number, default: 1 }, // 层级，控制显示顺序
  left: { type: Number, default: 200 }, // 容器的初始 X 位置
  top: { type: Number, default: 200 }, // 容器的初始 Y 位置
  width: { type: Number, default: 300 }, // 容器的初始宽度
  height: { type: Number, default: 300 }, // 容器的初始高度
  minWidth: { type: Number, default: 100 }, // 容器的最小宽度
  minHeight: { type: Number, default: 100 } // 容器的最小高度
});

// 定义容器位置和大小的响应式数据
const position = ref({ x: props.left, y: props.top }); // 容器的位置
const size = ref({ width: props.width, height: props.height }); // 容器的尺寸
const draggableContainer = ref<HTMLDivElement | null>(null); // 容器的 DOM 引用

// 计算容器的样式
const containerStyle = computed(() => ({
  top: `${position.value.y}px`, // 设置容器的 top 样式
  left: `${position.value.x}px`, // 设置容器的 left 样式
  width: `${size.value.width}px`, // 设置容器的宽度
  height: `${size.value.height}px`, // 设置容器的高度
  zIndex: props.zIndex // 设置容器的层级
}));

/**
 * 拖拽逻辑
 */
// 鼠标初始位置和容器位置的变量
let originMouseX = 0; // 鼠标初始 X 坐标
let originMouseY = 0; // 鼠标初始 Y 坐标
let originContainX = 0; // 容器初始 X 坐标
let originContainY = 0; // 容器初始 Y 坐标

// 开始拖拽
const startDrag = (event: MouseEvent) => {
  // 记录鼠标初始位置
  originMouseX = event.clientX;
  originMouseY = event.clientY;

  // 记录容器初始位置
  originContainX = position.value.x;
  originContainY = position.value.y;

  // 添加鼠标移动和鼠标松开事件监听
  document.addEventListener('mousemove', handleDrag);
  document.addEventListener('mouseup', stopDrag);
};

// 拖拽过程中更新容器的位置
const handleDrag = (event: MouseEvent) => {
  position.value.x = originContainX + event.clientX - originMouseX;
  position.value.y = originContainY + event.clientY - originMouseY;
};

/**
 * 缩放逻辑
 */
// 容器初始宽度、高度和当前缩放类型
let originWidth = 0;
let originHeight = 0;
let resizeType = '';

// 开始缩放
const startResize = (event: MouseEvent) => {
  const target = event.target as HTMLSpanElement; // 获取触发事件的元素
  resizeType = target.getAttribute('resize-type') || ''; // 获取缩放类型

  // 记录鼠标初始位置
  originMouseX = event.clientX;
  originMouseY = event.clientY;

  // 记录容器初始位置和大小
  originContainX = position.value.x;
  originContainY = position.value.y;
  originWidth = size.value.width;
  originHeight = size.value.height;

  event.stopPropagation(); // 阻止事件传播，防止触发拖拽

  // 添加鼠标移动和鼠标松开事件监听
  document.addEventListener('mousemove', handleResize);
  document.addEventListener('mouseup', stopDrag);
};

// 缩放过程中更新容器的大小和位置
const handleResize = (event: MouseEvent) => {
  const deltaX = event.clientX - originMouseX; // 计算鼠标的横向位移
  const deltaY = event.clientY - originMouseY; // 计算鼠标的纵向位移

  let newWidth = originWidth;
  let newHeight = originHeight;

  // 根据缩放类型计算新的容器尺寸
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
 * 停止拖拽或缩放
 * 清除事件监听器
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
