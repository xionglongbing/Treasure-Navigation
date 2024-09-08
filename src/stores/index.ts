// Pinia
import useSetDataStore from '@/stores/modules/setData';
import useSiteDataStore from '@/stores/modules/siteData';
import useStatusDataStore from '@/stores/modules/statusData';

export const setStore = () => useSetDataStore();
export const siteStore = () => useSiteDataStore();
export const statusStore = () => useStatusDataStore();
