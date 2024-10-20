// Pinia
import useSetDataStore from '@/stores/modules/setData';
import useSiteDataStore from '@/stores/modules/customSiteData';
import useStatusDataStore from '@/stores/modules/statusData';

export const setStore = () => useSetDataStore();
export const customSiteStore = () => useSiteDataStore();
export const statusStore = () => useStatusDataStore();
