<template>
  <div class="all-controls">
    <div class="leftIconGroup">
      <div
        class="change-status"
        :title="status.siteStatus === 'menu' ? '收起' : '菜单'"
        @click.stop="status.setSiteStatus(status.siteStatus === 'menu' ? 'normal' : 'menu')"
      >
        <Transition name="fade" mode="out-in">
          <SvgIcon
            :iconName="`icon-${status.siteStatus === 'menu' ? 'guanbi' : 'caidan'}`"
            :key="status.siteStatus === 'menu' ? 'guanbi' : 'caidan'"
          />
        </Transition>
      </div>
      <div class="change-status" title="github">
        <a
          href="https://github.com/xionglongbing/Treasure-Navigation"
          style="margin-bottom: -7px"
          target="blank"
        >
          <Transition name="fade" mode="out-in">
            <SvgIcon iconName="icon-github1" />
          </Transition>
        </a>
      </div>
    </div>
    <div
      class="change-status"
      :title="status.siteStatus === 'set' ? '首页' : '设置'"
      @click.stop="status.setSiteStatus(status.siteStatus === 'set' ? 'normal' : 'set')"
    >
      <Transition name="fade" mode="out-in">
        <SvgIcon
          :iconName="`icon-${status.siteStatus === 'set' ? 'home' : 'setting'}`"
          :key="status.siteStatus === 'set' ? 'home' : 'setting'"
        />
      </Transition>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { reactive } from 'vue';
// import { ElIcon } from 'element-plus';
import { Edit } from '@element-plus/icons-vue';
import { statusStore } from '@/stores';
const status = statusStore();
console.log('status', status);

defineOptions({
  name: 'MenuList'
});
let isOpemMenu = reactive<Boolean>(false);
</script>
<style lang="scss">
.all-controls {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  box-sizing: border-box;
  width: 100%;
  .leftIconGroup {
    display: grid;
    grid-template-columns: 1fr 1fr;
    justify-content: space-between;
  }
  .change-status {
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 26px;
    padding: 8px;
    border-radius: 8px;
    color: var(--main-text-color);
    z-index: 1;
    transition:
      opacity 0.3s,
      background-color 0.3s,
      transform 0.3s;
    &:hover {
      backdrop-filter: blur(20px);
      background-color: var(--main-background-light-color);
    }
    &:active {
      transform: scale(0.95);
    }
  }
}
</style>
