<template>
  <ShortCutLayout @openAddShortcutModal="openAddShortcutModal">
    <ShortCut ref="shortCut"/>
  </ShortCutLayout>
</template>
<script setup>
import ShortCut from './ShortCut.vue';
import ShortCutLayout from './ShortCutLayout.vue';
defineOptions({
  name: "CustomShortCut"
})
let shortCut = ref();
function openAddShortcutModal(){
  shortCut.value.openAddShortcutModal();
}
</script>
<style lang=""></style>
