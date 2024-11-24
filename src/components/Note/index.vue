<template>
  <NoteLayout>
    <NoteList />
  </NoteLayout>
</template>
<script setup lang="ts">
import NoteList from './NoteList.vue';
import NoteLayout from './NoteLayout.vue';
defineOptions({
  name: 'CustomShortCut'
});

</script>
<style lang="scss"></style>
