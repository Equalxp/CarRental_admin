<template>
  <div class="amap-wrap">
    <el-amap vid="amapContainer" :events='events' class="amap-demo">
      
    </el-amap>
  </div>
</template>

<script>
import { AMapManager, lazyAMapApiLoaderInstance } from 'vue-amap';
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
      this.map = new AMap.Map('amapContainer',{
        center: [114.246754, 22.721943],
        // 初始化地图层级
        zoom: this.zoom
      })
    })
  }
}
</script>

<style lang="scss">
.amap-wrap {
  height: 100%;
}
</style>
