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
export default {
  name: "Amap",
  data() {
    return {
      map: null,
      zoom: 18,
      events: {}
    }
  },
  mounted() {
    lazyAMapApiLoaderInstance.load().then(() => {
      this.map = new AMap.Map("amapContainer", {
        center: [114.246754, 22.721943],
        // 初始化地图层级
        zoom: this.zoom
      })
      this.map.on("click", e => {
        const lonlag = getLngLat(e)
        // console.log("lonlag", lonlag)
        // 子组件调用父组件方法 传参数出去
        this.$emit("lonlag", lonlag)
      })
    })
  },
  methods: {
    setMapCenter(value) {
      addressSetMapCenter(value, this.map)
    }
  }
}
</script>

<style lang="scss">
.amap-wrap {
  height: 100%;
}
</style>
