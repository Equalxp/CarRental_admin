// 根据中文地址找坐标 切换地图框的中心点
export function addressSetMapCenter(address, map) {
  const geocoder = new AMap.Geocoder()
  console.log('address.address', address.address);
  geocoder.getLocation(address.address, function (status, result) {
    // console.log(status,result);
    if (status === 'complete' && result.info === 'OK') {
      let lat = result.geocodes[0].location.lat;
      let lng = result.geocodes[0].location.lng;
      // 获取地图的中心点
      map.setCenter([lng, lat]);
    } else {
      console.error('根据地址查询位置失败');
    }
  });
}