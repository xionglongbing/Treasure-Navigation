// Pinia
import useSetDataStore from '@/stores/modules/setData';
import useSiteCustomDataStore from '@/stores/modules/siteCustomData';
import useSiteDefaultDataStore from '@/stores/modules/siteDefalutData';
import useStatusDataStore from '@/stores/modules/statusData';

export const setStore = () => useSetDataStore();
export const siteCustomStore = () => useSiteCustomDataStore();
export const siteDefaultData = () => useSiteDefaultDataStore();
export const statusStore = () => useStatusDataStore();
