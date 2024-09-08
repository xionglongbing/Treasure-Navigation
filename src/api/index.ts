import axios from '@/utils/request';
import fetchJsonp from 'fetch-jsonp';

/**
 * 获取高德地理位置信息
 * @param key API key
 * @returns 返回包含地理位置信息的Promise
 */
export const getAdcode = async (key: string): Promise<any> => {
  return axios({
    method: 'GET',
    url: 'https://restapi.amap.com/v3/ip',
    params: { key }
  });
};

/**
 * 获取高德地理天气信息
 * @param key API key
 * @param city 城市代码
 * @returns 返回包含天气信息的Promise
 */
export const getWeather = async (key: string, city: string): Promise<any> => {
  return axios({
    method: 'GET',
    url: 'https://restapi.amap.com/v3/weather/weatherInfo',
    params: { key, city, extensions: 'base' }
  });
};

/**
 * 获取搜索建议
 * @param keyWord 搜索关键字
 * @returns 返回包含搜索建议的Promise
 */
export const getSearchSuggestions = async (keyWord: string): Promise<string[] | null> => {
  try {
    const encodedKeyword = encodeURIComponent(keyWord);
    const response = await fetchJsonp(
      `https://suggestion.baidu.com/su?wd=${encodedKeyword}&cb=json`,
      {
        // 回调参数
        jsonpCallback: 'cb'
      }
    );
    const data = await response.json();
    return data.s as string[];
  } catch (error) {
    console.error('处理搜索建议发生错误：', error);
    return null;
  }
};
