<template>
  <div class="note-detail__content" v-show="noteStore.displayNoteDetailData">
    <DraggableContainer
      :width="defaultWidth"
      :height="defaultHeight"
      :appendToBody="false"
      :zIndex="99"
    >
      <PicInPic
        :show="showPicInPic"
        @closePicInpicEvent="closePicInpicEvent"
      >
        <Note
          @enterPictureInPicture="enterPictureInPicture"
        />
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

// 画中画
let showPicInPic = ref(false);
function enterPictureInPicture() {
  console.log('showPicInPic.value', showPicInPic.value);
  showPicInPic.value = false;
  nextTick(() => {
    showPicInPic.value = true;
  });
}
function closePicInpicEvent(e: Event) {
  const target: any = e.target;
  const NoteHeader = target.querySelector('.Note__header');
  const NoteHeaderText = NoteHeader.textContent;

  const NoteBody = target.querySelector('.Note__body');
  const NoteBodyText = NoteBody.textContent;

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
