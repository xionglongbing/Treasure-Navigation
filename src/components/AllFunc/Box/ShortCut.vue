<template>
  <n-scrollbar v-if="categoryDataList.length">
    <VueDraggable :disabled="disabledDrag" :animation="150" v-model="categoryDataList">
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
          <span
            class="icon_span--style icon--padding6"
            @click.stop="handleDeleteEditCategoryName(categoryData.categoryName)"
          >
            <el-icon style="vertical-align: middle">
              <CircleClose />
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
            ><div>{{ categoryData.categoryName }}</div></template
          >
          <VueDraggable
            :disabled="disabledDrag"
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
                <div class="shortcut__icon-text">
                  <img
                    :src="formatUrlIndex(websiteData.url) + '/favicon.ico'"
                    onerror="this.src='/icon/treasureBag.jpg';this.onerror=null;"
                    class="websiteData__favicon"
                  />
                  <span class="name">{{ websiteData.name }}</span>
                </div>
                <span
                  v-if="isShowClose"
                  class="icon_span--style icon--padding10"
                  @click.stop="confirmRemoveShortcut(categoryData.categoryName, websiteData)"
                >
                  <el-icon style="vertical-align: middle">
                    <CircleClose />
                  </el-icon>
                </span>
                <span
                  v-if="isShowAddToCustom"
                  class="icon_span--style icon--padding10"
                  @click.stop="confirmRemoveShortcut(categoryData.categoryName, websiteData)"
                >
                  <el-icon style="vertical-align: middle">
                    <CirclePlus />
                  </el-icon>
                </span>
              </n-grid-item>
            </n-grid>
          </VueDraggable>
        </n-collapse-item>
      </n-collapse>
      <!-- </template> -->
    </VueDraggable>
  </n-scrollbar>
  <div v-else class="not-shortcut">
    <span class="tip">暂无导航，去添加吧</span>
  </div>
  <ContextMenu
    ref="contextMenu"
    v-if="isShowContextMenu"
    size="large"
    :contextMenuOptions="contextMenuOptions"
    @handleContextMenuSelect="handleContextMenuSelect"
  />
  <ShorcutEditCategoryName
    v-model:show="editCategoryNameVisible"
  />
  <AddShortcut
    v-model="isAddShortcutModalVisible"
    :editValue="selectWebsiteDataInfo"
    :isEditMode="isEditMode"
    @handleAddOrEditShortcut="handleAddOrEditShortcut"
    @handleBatchAddShortcut="handleBatchAddShortcut"
    @clearSelectedShortcut="clearSelectedShortcut"
  />
</template>
<script setup lang="ts">
import { siteStore } from '@/stores';
import ContextMenu from '@/components/ContextMenu/index.vue';
import ShorcutEditCategoryName from './ShorcutEditCategoryName.vue';
import { ref, h } from 'vue';
import { storeToRefs } from 'pinia';
import { NScrollbar, NGrid, NGridItem, NCollapse, NCollapseItem } from 'naive-ui';
import { CircleClose, CirclePlus, Edit } from '@element-plus/icons-vue';
import SvgIcon from '@/components/SvgIcon.vue';
import { VueDraggable } from 'vue-draggable-plus';
import AddShortcut from './AddShortcut.vue';
import type { WebsiteData, WebsiteDataInfo, MessageInfo } from '@/stores/types/type';
import { ChainOfResponsibility } from '@/utils/tool';
import { setStore } from '@/stores';

// 接收props
const { isDefaultShort = false } = defineProps<{
  isDefaultShort?: Boolean;
}>();
let isShowClose = true;
let isShowAddToCustom = false;
let isShowContextMenu = true;
if (isDefaultShort) {
  isShowClose = false;
  isShowAddToCustom = true;
  isShowContextMenu = false;
}
let disabledDrag = ref(false);
if (
  navigator.userAgent.match(/Mobi/i) ||
  navigator.userAgent.match(/Android/i) ||
  navigator.userAgent.match(/iPhone/i)
) {
  // 当前设备是移动设备
  disabledDrag.value = true;
}
const set = setStore();

const site = siteStore();
const { categoryDataList, expandedCategoryNames } = storeToRefs(site);
// 更新折叠项状态
function handleCollapseUpdate(expandedNames: string[]) {
  site.$patch({ expandedCategoryNames: expandedNames });
}
//编辑CategoryName

let preSelectCategoryName = ref('');
let editCategoryNameVisible = ref(false);
function handleOpenEditCategoryName(categoryName: string) {
  preSelectCategoryName.value = categoryName;
  editCategoryNameVisible.value = true;
}
//删除CategoryName
function handleDeleteEditCategoryName(categoryName: string) {
  preSelectCategoryName.value = categoryName;
  window.$dialog.warning({
    title: '删除导航',
    content: `真的真的确认删除 ${categoryName} 分类吗？此操作将删除${categoryName}中所有的导航！`,
    positiveText: '删除',
    negativeText: '取消',
    onPositiveClick: () => {
      site.deleteCategoryData(categoryName);
    },
    onNegativeClick: () => {}
  });
}

// 菜单相关start

// 图标渲染函数
function renderIcon(iconName: string) {
  return () => h(SvgIcon, { iconName: `icon-${iconName}` });
}
// 右键菜单相关数据
let contextMenuOptions = ref([
  { label: '编辑', key: 'edit', icon: renderIcon('edit') },
  { label: '删除', key: 'delete', icon: renderIcon('delete') }
]);

const selectWebsiteDataInfo = ref<WebsiteDataInfo | null>(null);

// 菜单是否显示
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
// 菜单相关end

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
// 格式化url，得到域名
function formatUrlIndex(url: string) {
  const urlReg = /(http[s]?:\/\/.*?)\//;
  const urlIndex = url.match(urlReg)?.[1];
  console.log('urlIndex', urlIndex);
  return urlIndex;
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
defineExpose({ openAddShortcutModal });
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
  // 使用职责链的设计模式
  const chainEdit = new ChainOfResponsibility(handleEditShortcut); //判断编辑模式
  const chainAdd = new ChainOfResponsibility(handleAddShortcut); //判断是否添加模式
  const chainClose = new ChainOfResponsibility(closeAddShortcutModal); //关闭模态框
  chainEdit.setNext(chainAdd).setNext(chainClose);
  chainEdit.handle(categoryName, shortcutData);
}

async function handleBatchAddShortcut(
  categoryName: string,
  shortcutData: WebsiteData,
  batchAddFormValues: WebsiteData[]
) {
  // 使用职责链的设计模式
  const chainAdd = new ChainOfResponsibility(handleAddShortcut);
  const chainClose = new ChainOfResponsibility(closeAddShortcutModal);
  chainAdd.setNext(chainClose);
  const newShortcutData = [shortcutData, ...batchAddFormValues];
  chainAdd.handle(categoryName, newShortcutData);
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

function handleAddShortcut(categoryName: string, websiteData: WebsiteData | WebsiteData[]) {
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
<style lang="scss" scoped>
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
    .shortcut__icon-text {
      display: flex;
      align-items: center;
      gap: 5px;
    }
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
.websiteData__favicon {
  width: 20px;
  border-radius: 50%;
  margin-right: 4px;
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
