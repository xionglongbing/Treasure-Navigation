import { defineStore } from 'pinia';
import { ref, reactive, toRefs, computed } from 'vue';
import defaultCategoriesList from '@/assets/defaultShortCut.json';
import type {
  SiteDataState,
  WebsiteData,
  WebsiteDataInfo,
  WebsiteOrBatchData,
  CategoryData,
  MessageInfo
} from '../types/type';
import { ChainOfResponsibility } from '@/utils/tool';

const useSiteDataStore = defineStore(
  'siteData',
  () => {
    // 定义状态
    const state = reactive<SiteDataState>({
      // categoryDataList: defaultShortCut,
      categoryDataList: defaultCategoriesList,
      expandedCategoryNames: defaultCategoriesList.map((item) => item.categoryName)
    });
    const categoryNameList = computed(() =>
      state.categoryDataList.map((item) => item.categoryName)
    );
    function findCategoryData(categoryName: string) {
      const categoryData = state.categoryDataList.find((cat) => cat.categoryName === categoryName);
      return categoryData;
    }
    function findWebsiteData({
      categoryName,
      websiteData,
      categoryData
    }: WebsiteDataInfo & { categoryData?: CategoryData }) {
      const { websiteDataList } = categoryData || findCategoryData(categoryName) || {};
      if (websiteDataList) {
        const resWebsiteData = websiteDataList.find(
          (sc) => sc.url === websiteData.url && sc.name === websiteData.name
        );
        return resWebsiteData;
      }
      return undefined;
    }

    //  有该分类就添加新网站，没有就添加新分类且添加新网站
    const addCategoryDataOrWebsiteData = ({
      categoryName,
      websiteData
    }: WebsiteOrBatchData): MessageInfo => {
      console.log('categoryName', categoryName, websiteData);
      const categoryData = findCategoryData(categoryName);

      //  有该分类就添加新网站
      if (categoryData) {
        if (Array.isArray(websiteData)) {
          let resMessageInfo: MessageInfo = { state: 'success', message: '批量导航添加成功' };
          websiteData.forEach((websiteDataItem, index) => {
            if (websiteDataItem.name && websiteDataItem.url) {
              const res = addWebsiteData({
                categoryName,
                websiteData: websiteDataItem,
                categoryData
              });
              if (res.state === 'error') {
                resMessageInfo = res;
              }
            } else if (websiteDataItem.name || websiteDataItem.url) {
              let res = '';
              if (websiteDataItem.name) {
                res = '导航名称';
              } else {
                res = '导航链接';
              }
              window.$message.error(`第${index}个导航${res}没有输入`);
            }
          });
          return resMessageInfo;
        } else {
          return addWebsiteData({ categoryName, websiteData, categoryData });
        }
      } else {
        if (Array.isArray(websiteData)) {
          // 没有就添加新分类且添加新网站
          websiteData.forEach((websiteDataItem) => {
            if (websiteDataItem.name && websiteDataItem.url) {
              addCategoryData({ categoryName, websiteData: websiteDataItem });
            }
          });
        } else {
          addCategoryData({ categoryName, websiteData });
        }
        return { state: 'success', message: '新分类导航添加成功' };
      }
    };

    //添加新网站
    function addWebsiteData({
      categoryName,
      websiteData,
      categoryData
    }: WebsiteDataInfo & { categoryData?: CategoryData }): MessageInfo {
      if (!categoryNameList.value.includes(categoryName)) {
        return { state: 'error', message: '导航添加失败，没有该分类' };
      }
      const isDuplicate = findWebsiteData({ categoryName, websiteData });
      if (isDuplicate) {
        return { state: 'error', message: `${websiteData.name}:新增名称或链接与已有导航重复` };
      } else {
        categoryData || (categoryData = findCategoryData(categoryName));
        categoryData!.websiteDataList.push({ ...websiteData });
        return { state: 'success', message: '导航添加成功' };
      }
    }

    //添加新分类
    function addCategoryData({ categoryName, websiteData }: WebsiteDataInfo) {
      const categoryData = {
        categoryName,
        websiteDataList: [websiteData]
      };
      state.categoryDataList.push(categoryData);
      return categoryData;
    }

    // 删除导航条目
    const deleteShortcutItem = (categoryName: string, shortcutItem: WebsiteData): MessageInfo => {
      const categoryData = findCategoryData(categoryName);

      if (categoryData) {
        const index = categoryData.websiteDataList.findIndex(
          (item) => item.name === shortcutItem.name && item.url === shortcutItem.url
        );
        if (index !== -1) {
          categoryData.websiteDataList.splice(index, 1);
          return { state: 'success', message: '导航分类删除成功' };
        }
      }
      console.warn('未找到对应的导航分类');
      return { state: 'error', message: '未找到对应的导航分类' };
    };

    // 设置批量添加导航的数量
    const batchAddCount = ref<number>(10);
    function changebatchAddCount(count: number) {
      batchAddCount.value = count;
    }
    // 返回状态和方法
    return {
      ...toRefs(state),
      addCategoryDataOrWebsiteData,
      deleteShortcutItem,
      findCategoryData,
      findWebsiteData,
      categoryNameList,
      batchAddCount,
      changebatchAddCount
    };
  },
  {
    persist: {
      key: 'siteData',
      storage: window.localStorage
    }
  }
);

export default useSiteDataStore;