// 点击获取 lng lat
export function getLngLat(e) {
  return {
    log: e.lnglat.getLng(),
    lat: e.lnglat.getLat(),
    value: e.lnglat.getLat() + ',' + e.lnglat.getLng()
  }
}