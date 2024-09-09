<template>
  <Transition name="fade" mode="out-in">
    <div v-if="categoryDataList.length" class="shortcut">
      <n-scrollbar class="box__padding--lr20">
        <!-- <template v-for="categoryData in categoryDataList" :key="categoryData.categoryName"> -->
        <VueDraggable :animation="150" v-model="categoryDataList">
          <n-collapse
            v-for="categoryData in categoryDataList"
            :key="categoryData.categoryName"
            :default-expanded-names="expandedCategoryNames"
            :on-update:expanded-names="handleCollapseUpdate"
            arrow-placement="right"
            class="collapse-content"
          >
            <template #header-extra>
              <!-- <SvgIcon
                :iconName="
                  expandedCategoryNames.includes(categoryData.categoryName)
                    ? 'icon-a-jingyajingqiwasetianlabiaoqingxiaolian'
                    : 'icon-a-gangaliuhanbiaoqingxiaolian'
                "
              /> -->
              <span
                class="icon_span--style icon--padding6"
                @click.stop="handleOpenEditCategoryName(categoryData.categoryName)"
              >
                <el-icon style="vertical-align: middle">
                  <Edit />
                </el-icon>
              </span>
            </template>
            <template #arrow>
              <SvgIcon
                iconName="icon-xianxingshuangzhixiangxiahuadong"
                :iconStyle="{ transform: 'rotate(90deg)' }"
              />
            </template>
            <n-collapse-item :name="categoryData.categoryName">
              <template #header
                ><div class="ccccc">{{ categoryData.categoryName }}</div></template
              >
              <VueDraggable
                target=".shortcut-list"
                :animation="150"
                v-model="categoryData.websiteDataList"
              >
                <n-grid
                  class="shortcut-list"
                  responsive="screen"
                  cols="3 s:4 m:5 l:6"
                  :x-gap="10"
                  :y-gap="10"
                >
                  <n-grid-item
                    v-for="websiteData in categoryData.websiteDataList"
                    :key="websiteData.url"
                    class="shortcut-item"
                    @contextmenu.stop="
                      handleShortcutContextMenu($event, categoryData.categoryName, websiteData)
                    "
                    @click="openWebsite(websiteData.url)"
                  >
                    <span class="name">{{ websiteData.name }}</span>
                    <span
                      class="icon_span--style icon--padding10"
                      @click.stop="confirmRemoveShortcut(categoryData.categoryName, websiteData)"
                    >
                      <el-icon style="vertical-align: middle">
                        <CircleClose />
                      </el-icon>
                    </span>
                  </n-grid-item>
                </n-grid>
              </VueDraggable>
            </n-collapse-item>
          </n-collapse>
          <!-- </template> -->
        </VueDraggable>
        <div class="shortcut__add" @contextmenu.prevent @click="openAddShortcutModal">
          <SvgIcon iconName="icon-add" />
          <span class="name">添加导航</span>
        </div>
      </n-scrollbar>
    </div>
    <div v-else class="not-shortcut">
      <span class="tip">暂无导航，去添加吧</span>
      <n-button strong secondary @click="openAddShortcutModal">
        <template #icon>
          <SvgIcon iconName="icon-add" />
        </template>
        添加导航
      </n-button>
    </div>
  </Transition>
  <AddShortcut
    v-model="isAddShortcutModalVisible"
    :editValue="selectWebsiteDataInfo"
    :isEditMode="isEditMode"
    @addOrEditShortcuts="handleAddOrEditShortcut"
    @clearSelectedShortcut="clearSelectedShortcut"
  />
  <!-- <n-dropdown
    placement="bottom-start"
    trigger="manual"
    size="large"
    :x="contextMenuX"
    :y="contextMenuY"
    :options="contextMenuOptions"
    :show="isContextMenuVisible"
    @clickoutside="closeContextMenu"
    @select="handleContextMenuSelect"
  /> -->
  <ContextMenu
    ref="contextMenu"
    size="large"
    :contextMenuOptions="contextMenuOptions"
    @handleContextMenuSelect="handleContextMenuSelect"
  />
  <n-modal
    preset="card"
    v-model:show="editCategoryNameVisible"
    title="编辑导航分类名称"
    :bordered="false"
    @mask-click="handleCloseEditCategoryName"
  >
    <n-form
      :rules="editCategoryNameFormRules"
      :model="editCategoryNameFormValues"
      :label-width="80"
    >
      <n-form-item label="导航分类名称" path="">
        <n-input
          clearable
          show-count
          maxlength="14"
          v-model:value="editCategoryNameFormValues.selectCategoryName"
          placeholder="请输入导航分类名称"
        />
      </n-form-item>
    </n-form>
    <template #footer>
      <n-space justify="end">
        <n-button strong secondary @click="handleCloseEditCategoryName">取消</n-button>
        <n-button
          strong
          secondary
          @click="handleSaveEditCategoryName(editCategoryNameFormValues.selectCategoryName)"
        >
          保存
        </n-button>
      </n-space>
    </template>
  </n-modal>
</template>

<script setup lang="ts">
import { ref, h } from 'vue';
import { storeToRefs } from 'pinia';
import {
  NButton,
  NScrollbar,
  NGrid,
  NGridItem,
  NCollapse,
  NCollapseItem,
  NModal,
  NForm,
  NFormItem,
  NInput,
  NSpace
} from 'naive-ui';
import ContextMenu from '@/components/ContextMenu/index.vue';
import { CircleClose, Edit } from '@element-plus/icons-vue';
import { siteStore, setStore } from '@/stores';
import SvgIcon from '@/components/SvgIcon.vue';
import { VueDraggable } from 'vue-draggable-plus';
import AddShortcut from './AddShortcut.vue';
import type { WebsiteData, WebsiteDataInfo, MessageInfo } from '@/stores/types/type';
import { ChainOfResponsibility } from '@/utils/tool';

// 引入数据存储
const set = setStore();
const site = siteStore();
const { categoryDataList, expandedCategoryNames } = storeToRefs(site);

// 图标渲染函数
function renderIcon(iconName: string) {
  return () => h(SvgIcon, { iconName: `icon-${iconName}` });
}

// 更新折叠项状态
function handleCollapseUpdate(expandedNames: string[]) {
  site.$patch({ expandedCategoryNames: expandedNames });
}

//编辑CategoryName
const editCategoryNameFormRules = {
  selectCategoryName: {
    required: true,
    message: '请输入导航分类名称',
    trigger: ['input', 'blur']
  }
};
let selectCategoryName = ref('');
let editCategoryNameFormValues = ref({
  selectCategoryName: ''
});
let editCategoryNameVisible = ref(false);
function handleOpenEditCategoryName(categoryName: string) {
  console.log('categoryName', categoryName);
  selectCategoryName.value = categoryName;
  editCategoryNameFormValues.value.selectCategoryName = categoryName;
  editCategoryNameVisible.value = true;
}
function handleCloseEditCategoryName() {
  editCategoryNameVisible.value = false;
}
function handleSaveEditCategoryName(newCategoryName: string) {
  const categoryData = site.findCategoryData(selectCategoryName.value);
  categoryData && (categoryData.categoryName = newCategoryName);
  handleCloseEditCategoryName();
}

//编辑CategoryName End

function messageTip(messageInfo: MessageInfo) {
  if (messageInfo.state === 'success') {
    window.$message.success(messageInfo.message);
  }
  if (messageInfo.state === 'error') {
    window.$message.error(messageInfo.message);
  }
  return messageInfo.state;
}

// 添加导航弹窗相关数据
const isAddShortcutModalVisible = ref(false);
const isEditMode = ref(false);

// 打开添加导航弹窗
function openAddShortcutModal() {
  isEditMode.value = false;
  isAddShortcutModalVisible.value = true;
  clearSelectedShortcut();
}

// 关闭添加导航弹窗
function closeAddShortcutModal() {
  isAddShortcutModalVisible.value = false;
  clearSelectedShortcut();
}

// 清空选中的快捷方式数据
function clearSelectedShortcut() {
  selectWebsiteDataInfo.value = null;
}

// 处理添加或编辑导航
async function handleAddOrEditShortcut(categoryName: string, shortcutData: WebsiteData) {
  const chainEdit = new ChainOfResponsibility(handleEditShortcut);
  const chainAdd = new ChainOfResponsibility(handleAddShortcut);
  const chainClose = new ChainOfResponsibility(closeAddShortcutModal);
  chainEdit.setNext(chainAdd).setNext(chainClose);
  chainEdit.handle(categoryName, shortcutData);
}

// 处理编辑导航
function handleEditShortcut(categoryName: string, websiteData: WebsiteData) {
  if (isEditMode.value) {
    const categoryData = site.findCategoryData(categoryName);
    if (!categoryData) {
      window.$message.error('导航中不存在该分类，请重试');
      return;
    }
    // 编辑模式下更新现有导航
    const shortcut = categoryData.websiteDataList.find((sc) => sc.url === websiteData.url);
    if (!shortcut) {
      window.$message.error('导航分类中不存在该项，请重试');
      return;
    }
    if (selectWebsiteDataInfo.value) {
      selectWebsiteDataInfo.value.websiteData.name = websiteData.name;
      selectWebsiteDataInfo.value.websiteData.url = websiteData.url;
    }
    window.$message.success('导航编辑成功');
  }
  return 'next';
}

function handleAddShortcut(categoryName: string, websiteData: WebsiteData) {
  if (isEditMode.value) {
    return 'next';
  }
  // 添加新导航
  const res = site.addCategoryDataOrWebsiteData({ categoryName, websiteData });
  messageTip(res);
  console.log('res', res);
  if (res.state === 'success') {
    return 'next';
  }
}

// 右键菜单相关数据
let contextMenuOptions = ref([
  { label: '编辑', key: 'edit', icon: renderIcon('edit') },
  { label: '删除', key: 'delete', icon: renderIcon('delete') }
]);

const selectWebsiteDataInfo = ref<WebsiteDataInfo | null>(null);

const contextMenu = ref();

// 处理右键菜单的打开
function handleShortcutContextMenu(
  event: MouseEvent,
  categoryName: string,
  websiteData: WebsiteData
) {
  event.preventDefault();
  selectWebsiteDataInfo.value = { categoryName, websiteData };
  contextMenu.value.handleShowContextMenu(event);
}

// 处理右键菜单选择
function handleContextMenuSelect(action: string) {
  if (!selectWebsiteDataInfo.value) return;
  switch (action) {
    case 'edit':
      isEditMode.value = true;
      isAddShortcutModalVisible.value = true;
      break;
    case 'delete':
      confirmRemoveShortcut(
        selectWebsiteDataInfo.value!.categoryName,
        selectWebsiteDataInfo.value!.websiteData
      );
      break;
  }
}

//提示是否删除导航
function confirmRemoveShortcut(categoryName: string, websiteData: WebsiteData) {
  const promise = new Promise((resolve, reject) => {
    window.$dialog.warning({
      title: '删除导航',
      content: `确认删除 ${websiteData.name} 导航？此操作将无法恢复！`,
      positiveText: '删除',
      negativeText: '取消',
      onPositiveClick: () => {
        removeShortcut(categoryName, websiteData);
        resolve('删除');
      },
      onNegativeClick: () => {
        reject('取消');
      }
    });
  });
  return promise;
}

// 删除导航
function removeShortcut(categoryName: string, shortcut: WebsiteData) {
  const categoryData = categoryDataList.value.find((cat) => cat.categoryName === categoryName);
  if (categoryData) {
    categoryData.websiteDataList = categoryData.websiteDataList.filter(
      (sc) => sc.url !== shortcut.url
    );
    window.$message.success('导航删除成功');
  }
}

// 导航跳转
function openWebsite(url: string) {
  const formattedUrl = url.startsWith('http') ? url : `//${url}`;
  if (set.urlJumpType === 'href') {
    window.location.href = formattedUrl;
  } else {
    window.open(formattedUrl, '_blank');
  }
}
</script>

<style lang="scss" scoped>
.shortcut {
  width: 100%;
  height: 100%;
  :deep(.n-collapse) .n-collapse-item__header > .n-collapse-item__header-main {
    padding: 10px;
    border-radius: 8px;
  }
  :deep(.n-collapse-item__header-main) {
    &:hover {
      background-color: rgba(0, 0, 0, 0.1);
    }
  }
  .shortcut-list {
    padding-left: 10px;
    box-sizing: border-box;
    .shortcut-item {
      cursor: pointer;
      height: 60px;
      padding: 0 10px;
      display: flex;
      align-items: center;
      justify-content: space-around;
      background-color: var(--main-background-light-color);
      border-radius: 8px;
      font-size: 16px;
      transition:
        background-color 0.3s,
        box-shadow 0.3s;
      .name {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      &:hover {
        background-color: var(--main-background-hover-color);
        box-shadow: 0 0 0px 2px var(--main-background-hover-color);
      }
      &:active {
        box-shadow: none;
      }
    }
  }
  .shortcut__add {
    width: 240px;
    height: 40px;
    margin: 15px auto;
    border-radius: 8px;
    background-color: var(--main-background-light-color);
    line-height: 40px;
    text-align: center;
    cursor: pointer;
  }
  .icon_span--style {
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 16px;
    &:hover {
      background-color: rgba(0, 0, 0, 0.1);
      border-radius: 10px;
    }
  }
  .icon--padding6 {
    padding: 6px;
    &:hover {
      border-radius: 6px;
    }
  }
  .icon--padding10 {
    padding: 10px;
    &:hover {
      border-radius: 10px;
    }
  }
}
.not-shortcut {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  .tip {
    font-size: 24px;
    margin-bottom: 20px;
  }
}
</style>
