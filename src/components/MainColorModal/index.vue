<template>
  <!-- 功能区 -->
  <div
    class="main-box big"
    @click.stop
    @contextmenu.stop="
      (e) => {
        e.preventDefault();
      }
    "
  >
    <slot></slot>
  </div>
</template>

<script setup lang="ts">
defineOptions({
  name: 'MainColorModal'
});
</script>

<style lang="scss" scoped>
.main-box {
  position: absolute;
  width: 100%;
  height: 100%;
  background-color: var(--main-background-light-color);
  backdrop-filter: blur(20px);
  color: var(--main-text-color);
  border-radius: 8px;
  transition:
    opacity 0.3s,
    transform 0.3s,
    margin-top 0.3s,
    height 0.3s;
  z-index: 2;
  .all-set {
    overflow: hidden;
    height: 100%;
    :deep(.scrollbar) {
      transition: max-height 0.3s;
    }
    :deep(.set-item) {
      width: 100%;
      border-radius: 8px;
      margin-bottom: 12px;
      border: none;
      box-shadow: var(--main-box-shadow);
      --n-color: var(--main-background-light-color);
      .n-card__content {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
        .desc {
          display: flex;
          flex-direction: row;
          align-items: center;
          justify-content: space-between;
          width: 100%;
          @media (max-width: 720px) {
            flex-direction: column;
            align-items: flex-start;
            .name {
              margin-bottom: 8px;
            }
          }
        }
        .name {
          display: flex;
          flex-direction: column;
          .title {
            font-size: 16px;
          }
          .tip {
            font-size: 13px;
            opacity: 0.8;
          }
        }
        .set {
          width: 200px;
          @media (max-width: 768px) {
            width: 140px;
            min-width: 140px;
          }
        }
      }
      &:last-child {
        margin-bottom: 0;
      }
    }
  }
  .all-box {
    overflow: hidden;
    height: 100%;
    :deep(.n-tab-pane) {
      .not-shortcut {
        min-height: calc(64vh - 84px);
      }
      &.no-padding {
        .scrollbar {
          max-height: calc(64vh - 44px);
        }
      }
    }
  }
  &.big {
    height: 80%;
    margin-top: 0 !important;
    :deep(.scrollbar) {
      max-height: calc(80vh - 84px);
    }
  }
  @media (max-width: 478px) {
    height: 60vh;
  }
}
</style>
