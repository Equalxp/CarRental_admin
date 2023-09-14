<template>
  <div class="amap-wrap">
    <el-amap vid="amapContainer" :events="events" class="amap-demo"> </el-amap>
  </div>
</template>

<script>
import { AMapManager, lazyAMapApiLoaderInstance } from "vue-amap"
// 方法
import { getLngLat } from "./common"
import { addressSetMapCenter } from "./location"
import { amapSetMarker, amapClearMarker } from "./marker"
export default {
  name: "Amap",
  data() {
    return {
      map: null,
      zoom: 18,
      events: {},
      // 经纬度
      lnglat: {}
    }
  },
  mounted() {
    // lazyAMapApiLoaderInstance 加载高德地图的api
    lazyAMapApiLoaderInstance.load().then(() => {
      // 调用函数
      this.mapCreate();
      this.map.on("click", e => {
        const lnglat = getLngLat(e)
        // 更新经纬度
        this.lnglat = lnglat
        // console.log("lnglat", lnglat)
        // 子组件调用父组件方法 传参数出去
        this.$emit("callback", {
          function: "getLnglat",
          data: {
            lnglat
          }
        })
        // 设置点标记
        this.SetMarker()
      })
    })
  },
  methods: {
    // 创建地图
    mapCreate() {
      this.map = new AMap.Map("amapContainer", {
        center: [116.404765, 39.918052],
        //初始化地图层级
        zoom: this.zoom 
      })
      this.map.on("complete", () => {
        this.mapLoad()
      })
    },
    // 地图加载完成
    mapLoad() {
      if (this.options.mapLoad) {
        this.$emit("callback", {
          function: "mapLoad"
        })
      }
    },
    // 销毁地图
    mapDestroy() {
      this.map && this.map.destroy()
    },
    // 让父组件调用这个方法
    setMapCenter(value) {
      // console.log("value", value) // value也是中文地址
      addressSetMapCenter(value, this.map)
    },
    // 设置点覆盖物
    SetMarker(lnglat) {
      amapSetMarker(lnglat || this.lnglat, this.map)
    },
    // 清除点覆盖物
    clearMarker() {
      amapClearMarker
    }
  },
  props: {
    options: {
      type: Object,
      default: () => {}
    }
  }
}
</script>

<style lang="scss">
.amap-wrap {
  height: 100%;
}
</style>
