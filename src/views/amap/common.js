// 点击获取 lng lat
export function getLngLat(e) {
  // 返回 一个经纬度对象
  return {
    lng: e.lnglat.getLng(),
    lat: e.lnglat.getLat(),
    value: e.lnglat.getLat() + ',' + e.lnglat.getLng()
  }
}