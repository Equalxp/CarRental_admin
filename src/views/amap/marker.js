let marker = null;
// 覆盖物
export function amapSetMarker(lnglat, map) {
  if (marker) {
    map.remove(marker);
    marker = null;
  }
  marker = new AMap.Marker({
    position: [lnglat.lng, lnglat.lat]
  })
  map.add(marker);
  // 根据覆盖物进行定位
  map.setFitView()
}
// 移除覆盖物
export function amapClearMarker(map) {
  if (marker) {
    map.remove(marker);
    marker = null;
  }
}