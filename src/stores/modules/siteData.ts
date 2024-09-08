import { defineStore } from 'pinia';
import { ref, reactive, toRefs, computed } from 'vue';
import defaultCategoriesList from '@/assets/defaultShortCut.json';
import type {
  SiteDataState,
  WebsiteData,
  WebsiteDataInfo,
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
    }: WebsiteDataInfo): MessageInfo => {
      console.log('categoryName', categoryName, websiteData);
      const categoryData = findCategoryData(categoryName);

      if (categoryData) {
        return addWebsiteData({ categoryName, websiteData, categoryData });
      } else {
        addCategoryData({ categoryName, websiteData });
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
        return { state: 'error', message: '新增名称或链接与已有导航重复' };
      } else {
        categoryData || (categoryData = findCategoryData(categoryName));
        categoryData!.websiteDataList.push({ name: websiteData.name, url: websiteData.url });
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

    // 返回状态和方法
    return {
      ...toRefs(state),
      addCategoryDataOrWebsiteData,
      deleteShortcutItem,
      findCategoryData,
      findWebsiteData,
      categoryNameList
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
