<template>
  <ShortCutLayout @openAddShortcutModal="openAddShortcutModal">
    <ShortCut ref="shortCut" :getSitedata="getSitedata" :site="siteCustom"/>
  </ShortCutLayout>
</template>
<script setup lang="ts">
import ShortCut from './ShortCut.vue';
import ShortCutLayout from './ShortCutLayout.vue';
import { siteCustomStore } from '@/stores';
defineOptions({
  name: "CustomShortCut"
})
const siteCustom = siteCustomStore();

function getSitedata() {
  console.log(1111,siteCustom);
  
  return siteCustom;
}
let shortCut = ref();
function openAddShortcutModal(){
  shortCut.value.openAddShortcutModal();
}
</script>
<style lang=""></style>
