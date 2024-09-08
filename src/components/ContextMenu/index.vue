<template>
  <div>
    <n-dropdown
      placement="bottom-start"
      trigger="manual"
      :size="props.size"
      :x="contextMenuX"
      :y="contextMenuY"
      :options="props.contextMenuOptions"
      :show="isContextMenuVisible"
      @clickoutside="closeContextMenu"
      @select="handleContextMenuSelect"
    />
  </div>
</template>
<script setup lang="ts">
defineOptions({
  name: 'ContextMenu'
});
import { NDropdown } from 'naive-ui';
const isContextMenuVisible = ref(false);
const contextMenuX = ref(0);
const contextMenuY = ref(0);
const props = defineProps<{
  contextMenuOptions: Array<any>;
  size?: 'large' | 'small' | 'medium' | 'huge' | undefined;
}>();
// 处理右键菜单的打开
function handleShowContextMenu(event: MouseEvent) {
  event.preventDefault();
  contextMenuX.value = event.clientX;
  contextMenuY.value = event.clientY;
  isContextMenuVisible.value = true;
}
const emit = defineEmits(['handleContextMenuSelect']);
// 处理右键菜单选择
function handleContextMenuSelect(action: string) {
  console.log('action', action);
  emit('handleContextMenuSelect', action);
  closeContextMenu();
}
// 关闭右键菜单
function closeContextMenu() {
  isContextMenuVisible.value = false;
}
defineExpose({ handleShowContextMenu });
</script>
<style lang=""></style>
