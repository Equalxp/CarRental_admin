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
}
// 移除覆盖物
export function amapClearMarker(map) {
  if (marker) {
    map.remove(marker);
    marker = null;
  }
}