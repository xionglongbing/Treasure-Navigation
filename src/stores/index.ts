// Pinia
import useSetDataStore from '@/stores/modules/setData';
import useSiteDataStore from '@/stores/modules/customSiteData';
import useSiteDefaultData from '@/stores/modules/siteDefalutData';
import useStatusDataStore from '@/stores/modules/statusData';

export const setStore = () => useSetDataStore();
export const customSiteStore = () => useSiteDataStore();
export const siteDefaultData = () => useSiteDefaultData();
export const statusStore = () => useStatusDataStore();
