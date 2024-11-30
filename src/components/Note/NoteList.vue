<template>
  <VueDraggable
    class="note-list"
    :disabled="disabledDrag"
    :animation="150"
    v-model="noteStore.noteDataList"
  >
    <div
      class="note-item__content"
      v-for="noteDataItem in noteStore.noteDataList"
      :key="noteDataItem.id"
      @click="openNote(noteDataItem)"
    >
      <div
        class="note-Info__picinpic--mask"
        v-if="noteDataItem.id === noteStore.displayPicInPicNoteData?.id"
      >
        画中画模式正在打开中
      </div>
      <div v-else class="note-info__content">
        <!-- 标题区域 -->
        <div class="note-item__title">
          <div class="title">{{ noteDataItem.title }}</div>
          <el-icon class="icon-delete" @click.stop="handleDeleteNote(noteDataItem)">
            <CircleClose />
          </el-icon>
        </div>
        <!-- 分割线 -->
        <div class="divider"></div>
        <!-- 内容区域 -->
        <div class="note-item__content-body">
          {{ noteDataItem.content }}
        </div>
      </div>
    </div>
  </VueDraggable>
</template>

<script setup lang="ts">
import { useNoteDataStore } from '@/stores';
import { CircleClose } from '@element-plus/icons-vue';
import type { NoteData } from '@/types/note.ts';
import { VueDraggable } from 'vue-draggable-plus';

const noteStore = useNoteDataStore();

// 事件定义：处理打开便签
const openNote = (noteData: NoteData) => {
  if (noteData.id === noteStore.displayPicInPicNoteData?.id) {
    return;
  }
  noteStore.updateDisplayNoteDetailData(noteData);
};

// 事件定义：处理删除便签
const handleDeleteNote = (noteData: NoteData) => {
  noteStore.deleteNote(noteData.id);
};
// 移动端禁止拖拽
let disabledDrag = ref(false);
if (
  navigator.userAgent.match(/Mobi/i) ||
  navigator.userAgent.match(/Android/i) ||
  navigator.userAgent.match(/iPhone/i)
) {
  // 当前设备是移动设备
  disabledDrag.value = true;
}
</script>

<style lang="scss" scoped>
.note-list {
  /* 布局样式 */
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); /* 自适应列 */
  gap: 20px; /* 卡片之间的间距 */

  .note-item__content {
    position: relative;
    background-color: var(--main-background-light-color); /* 卡片背景色 */
    // background-color: #fff;
    border: 1px solid rgba(0, 0, 0, 0.2); /* 卡片边框 */
    border-radius: 8px; /* 圆角效果 */
    padding: 16px; /* 内边距 */
    box-shadow: var(--main-box-shadow); /* 卡片阴影效果 */
    cursor: pointer; /* 鼠标悬停指针效果 */
    // transition: transform 0.2s ease, box-shadow 0.2s ease;
    .note-Info__picinpic--mask {
      position: absolute;
      top: 0;
      left: 0;
      display: flex;
      justify-content: center;
      align-items: center;
      width: 100%;
      height: 100%;
      background-color: var(--main-background-light-color); /* 卡片背景色 */
    }
    &:hover {
      transform: scale(1.05) translate(4px, 4px); /* 悬停卡片提升效果 */
    }

    .note-item__title {
      display: flex;
      justify-content: space-between;
      align-items: center; /* 垂直居中 */
      font-size: 16px;
      font-weight: 600; /* 标题字体加粗 */
      color: #333;
      .title {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis; /* 内容超出部分显示省略号 */
      }
      .icon-delete {
        color: #000; /* 删除图标颜色 */
        cursor: pointer;
      }
    }

    .divider {
      height: 1px;
      background-color: #666; /* 分割线颜色 */
      margin: 8px 0; /* 上下边距 */
    }

    .note-item__content-body {
      font-size: 14px;
      color: #666; /* 内容文字颜色 */
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis; /* 内容超出部分显示省略号 */
    }
  }
}
</style>
