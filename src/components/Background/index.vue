<template>
  <!-- <img src="/background/bg3.jpg" class="base-full-width background-img--full" /> -->
  <!-- <slot></slot> -->
  <div
    :style="{
      'background-image': 'url(/background/bg3.jpg)'
    }"
    class="base-full-width background-img--full"
  >
    <slot></slot>
  </div>
</template>
<script setup lang="ts">
defineOptions({
  name: 'Background'
});
</script>
<style lang="scss" scoped>
.background-img--full {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  backface-visibility: hidden;
  filter: blur(var(0));
  transition:
    filter 0.3s,
    transform 0.3s;
  animation: fade-blur-in 1s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  background-size: cover;
}
</style>
