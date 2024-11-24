<template>
    <!-- Teleport 是 Vue 的一个功能，可以选择把这个组件渲染到 body，而不是始终嵌套在当前的 DOM 结构中 -->
    <Teleport to="body" :disabled="!appendToBody">
      <!-- 可拖拽的容器 -->
      <div
        ref="draggableContainer"                        
        class="draggable-container"                    
        @mousedown="startDrag"                       
        :style="{ top: position.y + 'px', left: position.x + 'px', zIndex }"
        >
        <!-- 默认插槽，插入内容 -->
        <slot></slot> 
      </div>
    </Teleport>
  </template>
  
  <script setup lang="ts">
  /* 导入 Vue 的核心功能 */
  import { ref, onUnmounted } from 'vue';
  /**
   * 定义组件的传入参数 (Props)。
   * 
   * - `appendToBody`：是否将拖拽容器插入到 `body` 中，防止被其他元素样式影响。89888888888888888888888888889
   * - `zIndex`：设置拖拽容器的层级，避免与其他元素冲突。
   * - `left` 和 `top`：设置拖拽容器相对父元素的初始位置。
   */
  const props = defineProps({
    appendToBody: { type: Boolean, default: true },
    zIndex: { type: Number, default: 1 },
    left: { type: Number, default: 0 },
    top: { type: Number, default: 0 },
  });
  
  /**
   * 定义可拖拽容器的引用，用于直接操作 DOM 元素。
   */
  const draggableContainer = ref<HTMLDivElement | null>(null);
  
  /**
   * 定义容器的位置和鼠标拖拽的状态。
   */
  const position = ref({ x: props.left, y: props.top }); // 记录当前容器的位置
  const disX = ref(0); // 记录鼠标按下时相对draggableContainer左上角的 X 偏移量
  const disY = ref(0); // 记录鼠标按下时相对draggableContainer左上角的 Y 偏移量
  
  /**
   * 当鼠标按下时，触发拖拽的逻辑。
   */
  const startDrag = (event: MouseEvent) => {
    if (!draggableContainer.value) return; // 如果 DOM 未加载，直接退出
  
    // 记录鼠标按下时的偏移量
    disX.value = event.clientX - position.value.x;
    disY.value = event.clientY - position.value.y;
  
    // 添加全局事件监听器，处理鼠标移动和抬起的逻辑
    document.addEventListener('mousemove', onDrag); // 节流的拖拽事件
    document.addEventListener('mouseup', stopDrag);       // 停止拖拽事件
  };
  
  /**
   * 拖拽过程中更新容器的位置。
   */
  const onDrag = (event: MouseEvent) => {
    // 根据鼠标移动的距离更新容器位置
    position.value.x = event.clientX - disX.value;
    position.value.y = event.clientY - disY.value;
  };
  
  /**
   * 当鼠标抬起时，停止拖拽。
   */
  const stopDrag = () => {
    // 移除全局事件监听器
    document.removeEventListener('mousemove', onDrag);
    document.removeEventListener('mouseup', stopDrag);
  };
       
  
  /**
   * 清理逻辑：当组件被销毁时，移除所有全局事件监听器。
   */
  onUnmounted(() => {
    document.removeEventListener('mousemove', onDrag);
    document.removeEventListener('mouseup', stopDrag);
  });
  </script>
  