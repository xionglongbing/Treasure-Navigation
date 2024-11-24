<template>
  <div class="picInPicContent" ref="picInPic">
    <slot />
  </div>
</template>
<script setup lang="ts">
import { ref, watch, defineEmits } from 'vue';
import { useNoteDataStore } from '@/stores';
const noteStore = useNoteDataStore();
const emit = defineEmits(['closePicInpicEvent']);

let disabledPicInPic: Boolean = false;
if (!('documentPictureInPicture' in window)) {
  disabledPicInPic = true;
  console.warn('不支持画中画');
}
const props = defineProps({
  show: {
    type: Boolean,
    default: true
  },
  picWidth: {
    type: Number,
    defalut: 100
  },
  picHeight: {
    type: Number,
    defalut: 100
  },
  isClone: {
    type: Boolean,
    default: true
  }
});
const watchVal = watch(
  () => props.show,
  async (val) => {
    console.log('startPic', val);
    if (disabledPicInPic) {
      watchVal();
      return;
    }
    if (val) {
      await createPicInPic();
      updateStoreDate();
    } else {
      closePicInpic();
    }
  }
);
const picInPic = ref<HTMLElement>();
async function createPicInPic() {
  if (disabledPicInPic) return;
  noteStore.updateDisplayPicInPicNoteData(noteStore.displayNoteDetailData);

  // 打开画中画窗口。
  const pipWindow = await window.documentPictureInPicture.requestWindow({
    width: props.picWidth,
    height: props.picHeight
  });

  if (picInPic.value) {
    // 将播放器移至画中画窗口。
    const picInPicDom = props.isClone ? picInPic.value.cloneNode(true) : picInPic.value;
    pipWindow.document.body.append(picInPicDom);
  }
  // 从初始文档复制样式表，以便和原始元素看起来相同。
  [...document.styleSheets].forEach((styleSheet) => {
    try {
      const cssRules = [...styleSheet.cssRules].map((rule) => rule.cssText).join('');
      const style = document.createElement('style');

      style.textContent = cssRules;
      pipWindow.document.head.appendChild(style);
    } catch (e) {
      const link = document.createElement('link');

      link.rel = 'stylesheet';
      link.type = styleSheet.type;
      link.media = styleSheet.media;
      link.href = styleSheet.href;
      pipWindow.document.head.appendChild(link);
    }
  });
  const style = document.createElement('style');
  const bgRandom = Math.floor(Math.random() * 6 + 1);
  style.textContent = `
    body {
      background-image: url("./background/bg${bgRandom}.jpg");
    }
  `;
  pipWindow.document.head.appendChild(style);

  pipWindow.addEventListener('pagehide', (e: Event) => {
    closePicInpicEvent(e);
  });
}
function closePicInpicEvent(e: Event) {
  console.log('closePicInpicEvent');
  emit('closePicInpicEvent', e);
}
function closePicInpic() {
  // inPipMessage.style.display = "none";
  if (window.documentPictureInPicture?.window) {
    window.documentPictureInPicture.window.close();
  }
}

function updateStoreDate() {
  noteStore.updateDisplayPicInPicNoteData(noteStore.displayNoteDetailData);
  noteStore.clearDisplayNoteDetail();
  console.log('????updateStoreDate', noteStore.displayNoteDetailData);
}

defineOptions({
  name: 'PicInPic'
});
</script>
<style lang="scss">
.picInPicContent {
  width: 100%;
  height: 100%;
}
</style>
