import Vue from "vue";
// 高德离线地图
import VueAMap from 'vue-amap';
Vue.use(VueAMap);
Vue.config.productionTip = false
// 开发环境
window._AMapSecurityConfig = {
  securityJsCode: 'e6d108dc58d3e8cdd41541fea4d5b24a',
}
VueAMap.initAMapApiLoader({
  // 高德key
  key: 'ace3fb54b84765e4619fe5d7fcfd8554',
  // 插件集合 （插件按需引入）
  plugin: ["AMap.Geocoder", "AMap.Geolocation", "AMap.Walking"],
  v: '1.4.15',
  uiVersion: '1.0.11'
})

// 生产环境 后台配置的安全密钥地址 详见官方配置文件
// window._AMapSecurityConfig = {
// serviceHost: `xxx/_AMapService`
//}