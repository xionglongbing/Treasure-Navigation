<template>
  <div class="shortcut__content box__padding--lr20">
    <div class="body__content">
      <slot />
    </div>
    <div class="footer__btn-group">
      <div>
        <!-- 预留左边button- -->
      </div>
      <div class="shortcut__add" @click="openNewNote">
        <SvgIcon iconName="icon-add" />
        <span class="btnName">添加便签</span>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { useNoteDataStore } from '@/stores';
const noteStore = useNoteDataStore();

function openNewNote() {
  noteStore.openNewNoteDetail();
}

</script>
<style lang="scss" scoped>
.shortcut__content {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  .body__content {
    flex: 1;
    width: 100%;
  }
  .footer__btn-group {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    padding: 15px 0;
    .footer__btn-group--left {
      grid-column: 1 / 2;
      display: flex;

      #shortCutUploadInput {
        display: none;
      }
      div + div {
        margin-left: 10px;
      }
    }
    .shortcut__add {
      min-width: 90px;
      width: 100%;
      height: 40px;
      justify-self: center;
      border-radius: 8px;
      background-color: var(--main-background-light-color);
      line-height: 40px;
      text-align: center;
      cursor: pointer;
    }
  }
  .btnName {
    margin-left: 5px;
  }
}
</style>
