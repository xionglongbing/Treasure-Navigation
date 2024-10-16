<template>
  <n-tabs class="all-box" size="large" justify-content="space-evenly" animated>
    <n-tab-pane class="no-padding height--full" name="link" tab="导航">
      <ShortCutLayout />
    </n-tab-pane>
    <n-tab-pane class="height--full" name="more" tab="所有"> 还能有啥呢 😢 </n-tab-pane>
    <n-tab-pane class="height--full" name="note" tab="便签"> 即将完善 </n-tab-pane>
  </n-tabs>
</template>

<script setup lang="ts">
import { NTabs, NTabPane } from 'naive-ui';
import ShortCutLayout from '@/components/AllFunc/Box/ShortCutLayout.vue';
</script>
<style lang="scss" scoped>
.height--full {
  height: 100%;
}
</style>
