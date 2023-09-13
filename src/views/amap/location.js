// 根据中文找坐标
export function addressSetMapCenter(address, map) {
  var geocoder = new AMap.Geocoder()
  // address获取数据是异步的 要等address完整数据出来 address
  geocoder.getLocation(address, function (status, result) {
    console.log('address,address', address.address);
    // console.log('status', status);
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