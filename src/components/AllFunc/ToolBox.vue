<template>
  <n-tabs :default-value="status.toolBoxCheckedtabs" @update:value="handleUpdateTabsValue" class="all-box" size="large" justify-content="space-evenly" animated>
    <n-tab-pane class="no-padding height--full" name="customNav" tab="我的导航">
      <CustomShortCut/>
    </n-tab-pane>
    <n-tab-pane class="no-padding height--full" name="sitDefaultNav" tab="所有导航">
      <DefaultShortCut/>
    </n-tab-pane>
    <n-tab-pane class="no-padding height--full" name="note" tab="便签"> 即将完善 </n-tab-pane>
  </n-tabs>
</template>

<script setup lang="ts">
import { NTabs, NTabPane } from 'naive-ui';
import CustomShortCut from '@/components/AllFunc/Box/CustomShortCut.vue';
import DefaultShortCut from '@/components/AllFunc/Box/DefaultShortCut.vue';
import { statusStore } from '@/stores';
const status = statusStore();
function handleUpdateTabsValue(value: string) {
  status.setToolBoxCheckedtabs(value)
}
</script>
<style lang="scss" scoped>
.height--full {
  height: 100%;
}
</style>
