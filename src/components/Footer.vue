<template>
  <footer id="footer" @click.stop>
    <div class="copyright">
      <span class="site-name">宝藏导航</span>
      <span class="year">{{ fullYear }}</span>
      <span v-if="icp" class="icp" @click="jumpTo('https://beian.miit.gov.cn')">
        {{ icp }}
      </span>
      <span class="github"   @click="jumpTo('https://github.com/xionglongbing/Treasure-Navigation')">Github</span>
    </div>
    <!-- 关于 -->
    <!-- <n-modal
      preset="card"
      :bordered="false"
      v-model:show="aboutSiteModal"
      transform-origin="center"
    >
      <div class="github-modal">
        <div class="github">
          <span class="name">{{ siteName }}</span>
          <span class="version">v {{ packageJson.version }}</span>
        </div>
        <div class="desc">
          <n-space class="link" justify="center">
            <n-button strong secondary @click="jumpTo('https://github.com/imsyy/Snavigation')">
              Github
            </n-button>
          </n-space>
        </div>
      </div>
    </n-modal> -->
  </footer>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { setStore } from '@/stores';
import { NModal, NButton, NSpace } from 'naive-ui';
import packageJson from '@/../package.json';

// 获取状态管理实例
const set = setStore();

// 站点数据
const icp: string = import.meta.env.VITE_ICP;
const siteName: string = import.meta.env.VITE_SITE_TITLE;
const siteAuthor: string = import.meta.env.VITE_SITE_AUTHOR;
const copyrightLink: string = import.meta.env.VITE_SITE_COPYRIGHTLINK;
const fullYear: number = new Date().getFullYear();

// 关于弹窗数据
const aboutSiteModal = ref<boolean>(false);

// 跳转函数
const jumpTo = (url: string) => {
  if (set.urlJumpType === 'href') {
    window.location.href = url;
  } else if (set.urlJumpType === 'open') {
    window.open(url, '_blank');
  }
};
</script>

<style lang="scss" scoped>
#footer {
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  bottom: 0;
  height: 50px;
  width: 100%;
  color: var(--main-text-color);
  z-index: 1;
  .copyright {
    display: flex;
    align-items: center;
    font-size: 13px;
    span {
      margin: 0 2px;
      opacity: 0.6;
      transition: opacity 0.3s;
      &::before {
        opacity: 0.6;
        transition: none;
      }
    }
    .year {
      &::before {
        content: '@';
        opacity: 1;
        margin-right: 4px;
      }
    }
    .icp {
      &::before {
        content: '|';
        margin-right: 4px;
      }
    }
    .github {
      &::before {
        content: '|';
        margin-right: 4px;
      }
    }
    .anthor,
    .icp,
    .github {
      cursor: pointer;
      &:hover {
        opacity: 1;
      }
    }
  }
}
.github-modal {
  margin-bottom: 10px;
  .github {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    .name {
      font-size: 26px;
      font-weight: bold;
      margin-bottom: 4px;
    }
    .version {
      opacity: 0.6;
      font-size: 16px;
    }
  }
  .desc {
    margin-top: 20px;
  }
}
</style>
