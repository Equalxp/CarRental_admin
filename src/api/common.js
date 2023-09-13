import service from "../utils/request";
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
