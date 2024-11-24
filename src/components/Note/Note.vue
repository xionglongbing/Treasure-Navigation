<template>
  <div
    class="Note__content nav__scrollbar__style"
    v-if="noteData"
  >
    <!-- 顶部按钮区 -->
    <div class="Note__actions">
      <SvgIcon iconName="icon-huazhonghua" @click="enterPictureInPicture" />
      <el-icon style="vertical-align: middle" @click="closeNote">
        <CircleClose />
      </el-icon>
    </div>

    <!-- 标题区 -->
    <div class="Note__header">
      <div class="title" @input="handleTitleInput(noteData.id, $event)" contenteditable="true">
        {{ noteData.title }}
      </div>
    </div>

    <!-- 分割线 -->
    <div class="Note__divider"></div>

    <!-- 内容区 -->
    <div class="Note__body">
      <div
        ref="noteContent"
        @input="handleContentInput(noteData.id, $event)"
        class="content"
        contenteditable="true"
      >
        {{ noteData.content }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useNoteDataStore } from '@/stores';
import { CircleClose } from '@element-plus/icons-vue';
import SvgIcon from '@/components/SvgIcon.vue';
import type { NoteData } from '@/types/note';

const emit = defineEmits(['enterPictureInPicture']);


const noteStore = useNoteDataStore();

let noteData = computed(() => noteStore.displayNoteDetailData);

function handleTitleInput(id: number, event: Event) {
  if (event.target && noteData.value) {
    const titleTextContent = (event.target as HTMLDivElement).innerText || '';
    updateNoteDetailData({
      id,
      title: titleTextContent,
      content: noteData.value.content
    });
  }
}

function handleContentInput(id: number, event: Event) {
  if (event.target && noteData.value) {
    const bodyTextContent = (event.target as HTMLDivElement).innerText || '';
    updateNoteDetailData({
      id,
      title: noteData.value.title,
      content: bodyTextContent
    });
  }
}

function updateNoteDetailData(newNoteDetailData: NoteData) {
  noteStore.updateDisplayNoteDetailData(newNoteDetailData);
  noteStore.updateOrAddNote(newNoteDetailData);
}

// 进入画中画模式（示例功能）
const enterPictureInPicture = () => {
  emit('enterPictureInPicture');
};

// 关闭便签（示例功能）
const closeNote = () => {
  noteStore.clearDisplayNoteDetail();
};
</script>

<style scoped>
/* 容器样式 */
.Note__content {
  background-color: #fffcdb; /* 模拟便签纸的浅黄色背景 */
  background-color: var(--main-background-light-color);
  backdrop-filter: blur(20px);
  color: #000;
  padding: 10px;
  width: 100%;
  height: 100%;
  border-radius: 5px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
  font-family: Arial, sans-serif;
  position: relative; /* 便于定位按钮 */
  overflow-y: auto;
}

/* 按钮区 */
.Note__actions {
  position: absolute;
  top: 5px;
  right: 5px;
  display: flex;
  gap: 5px;
}

.Note__button {
  background: none;
  border: none;
  color: #555;
  font-size: 12px;
  cursor: pointer;
  padding: 5px;
  border-radius: 3px;
  transition: background-color 0.2s ease;
}

.Note__button:hover {
  background-color: #ddd;
}

.Note__button.Note__close {
  color: red;
}

/* 标题样式 */
.Note__header {
  margin-bottom: 10px;
  cursor: text;
  .title {
    font-size: 1.2em;
    font-weight: bold;
    outline: none;
    padding: 5px;
    border: none;
    background: transparent;
  }
}

/* 分割线 */
.Note__divider {
  height: 1px;
  background-color: #666;
  margin: 5px 0;
}

/* 内容样式 */
.Note__body {
  margin-top: 10px;
}

.content {
  font-size: 1em;
  white-space: pre-wrap;
  outline: none;
  padding: 5px;
  border: none;
  background: transparent;
  cursor: text;
}
</style>
