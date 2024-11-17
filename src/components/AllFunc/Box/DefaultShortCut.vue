<template>
  <ShortCutLayout
    :isShowAddShortcut="false"
    :isShowUpLoadBtn="false"
    @openAddShortcutModal="openAddShortcutModal"
  >
    <ShortCut
      ref="shortCut"
      :getSitedata="getSitedata"
      :isDefaultShort="true"
      @handleAddShortcut="handleAddShortcut"
    />
  </ShortCutLayout>
</template>
<script setup lang="ts">
import ShortCut from './ShortCut.vue';
import ShortCutLayout from './ShortCutLayout.vue';
import { siteDefaultData } from '@/stores';
import { siteCustomStore } from '@/stores';
import type { MessageInfo, WebsiteOrBatchData } from '@/types/type';
defineOptions({
  name: 'SiteDefaultShortCut'
});
const defaultSite = siteDefaultData();
const siteCustom = siteCustomStore();
function getSitedata() {
  return defaultSite;
}
let shortCut = ref();
function openAddShortcutModal() {
  shortCut.value.openAddShortcutModal();
}

function handleAddShortcut(val: WebsiteOrBatchData) {
  // 添加新导航
  const res = siteCustom.addCategoryDataOrWebsiteData(val);
  messageTip(res);
}
function messageTip(messageInfo: MessageInfo) {
  if (messageInfo.state === 'success') {
    window.$message.success(messageInfo.message);
  }
  if (messageInfo.state === 'error') {
    window.$message.error(messageInfo.message);
  }
  return messageInfo.state;
}
</script>
<style lang=""></style>
