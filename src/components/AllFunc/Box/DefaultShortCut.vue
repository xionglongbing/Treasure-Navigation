<template>
  <ShortCutLayout :isShowAddShortcut="false" @openAddShortcutModal="openAddShortcutModal">
    <ShortCut ref="shortCut" :isDefaultShort="true" @addShortcutToCustom="openAddShortcutModal" />
  </ShortCutLayout>
</template>
<script setup>
import ShortCut from './ShortCut.vue';
import ShortCutLayout from './ShortCutLayout.vue';
let shortCut = ref();
function openAddShortcutModal() {
  shortCut.value.openAddShortcutModal();
}
</script>
<style lang=""></style>
