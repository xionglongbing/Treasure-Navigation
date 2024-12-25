<template>
  <div class="note-detail__content">
    <DraggableContainer
      :width="defaultWidth"
      :height="defaultHeight"
      :min-height="300"
      :min-width="300"
      :appendToBody="true"
      v-model:show="showDragContain"
      :zIndex="99"
    >
      <PicInPic :show="showPicInPic" @closePicInPicEvent="closePicInPicEvent">
        <Note @enterPictureInPicture="enterPictureInPicture" />
      </PicInPic>
    </DraggableContainer>
  </div>
</template>
<script setup lang="ts">
import DraggableContainer from '@/components/DraggableContainer/index.vue';
import Note from './Note.vue';
import { useNoteDataStore } from '@/stores';
import PicInPic from '@/components/PicInPic/index.vue';
import { nextTick } from 'vue';

defineOptions({
  name: 'NoteDetail'
});
const noteStore = useNoteDataStore();

const defaultWidth = ref(400);
const defaultHeight = ref(400);

// 显示拖拽组件
const showDragContain = computed(() => !!noteStore.displayNoteDetailData);
// 画中画
let showPicInPic = ref(false);
function enterPictureInPicture() {
  console.log('showPicInPic.value', showPicInPic.value);
  showPicInPic.value = false;
  nextTick(() => {
    showPicInPic.value = true;
  });
}
function closePicInPicEvent(e: Event) {
  const target: any = e.target;
  const NoteHeader = target.querySelector('.Note__header');
  const NoteHeaderText = NoteHeader.innerText;

  const NoteBody = target.querySelector('.Note__body');
  const NoteBodyText = NoteBody.innerText;

  if (noteStore.displayPicInPicNoteData) {
    const newDisplayPicInPicNoteData = {
      ...noteStore.displayPicInPicNoteData,
      title: NoteHeaderText,
      content: NoteBodyText
    };
    noteStore.updateOrAddNote(newDisplayPicInPicNoteData);
    noteStore.updateDisplayPicInPicNoteData(null);
  }
  console.log('NoteHeaderText', NoteHeaderText);
  console.log('NoteBodyText', NoteBodyText);
}
</script>
<style lang="scss">
.Note-detail__content {
  position: absolute;
  width: 400px;
  height: 400px;
}
</style>
