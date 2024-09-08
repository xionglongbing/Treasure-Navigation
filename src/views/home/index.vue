<template>
  <!-- 主界面 -->
  <Transition name="fade" mode="out-in">
    <Background>
      <main v-show="!store.imgLoadStatus" id="main">
        <div class="main-content">
          <SearchInput @contextmenu.stop />
        </div>
      </main>
      <div class="gray" />
    </Background>
  </Transition>
  <!-- 加载 -->
  <Loading :isLoad="store.imgLoadStatus" />
</template>
<script setup lang="ts">
defineOptions({
  name: 'Index'
});
import Loading from '@/components/Loading/index.vue';
import Background from '@/components/Background/index.vue';
import SearchInput from '@/components/SearchInput.vue';

import { useStore } from '@/stores/userStore';
const store = useStore();
const imgLoadStatus = store.imgLoadStatus;
const loadComplete = () => {
  store.setMainLoad(false);
};
setTimeout(() => {
  loadComplete();
  console.log('store.imgLoadStatus', store.imgLoadStatus);
}, 1000);
</script>
<style lang="scss">
.main-content {
  width: 100%;
  height: 100%;
}
.gray {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background-image: radial-gradient(rgba(0, 0, 0, 0) 0, rgba(0, 0, 0, 0.5) 100%),
    radial-gradient(rgba(0, 0, 0, 0) 33%, rgba(0, 0, 0, 0.3) 166%);
  pointer-events: none;
}
</style>
