import service from "../utils/request";
import requestUrl from './requestUrl'
/**
 * 获取城市的列表
 */

export function GetCity(data = {}) {
  return service.request({
    method: "post",
    url: "/cityPicker/",
    data
  })
}

// 获取table数据
export function GetTableData(params = {}) {
  // url地址
  console.log('requestUrl', requestUrl);
  // params参数
  console.log('params.url', params.url);
  return service.request({
    method: "post",
    url: requestUrl[params.url],
    data: params.data
  })
}
