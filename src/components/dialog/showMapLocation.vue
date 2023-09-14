<template>
  <el-dialog :title="data.parkingName" :visible.sync="dialogVisible" class="cars-dialog-center" @close="close" @opened="opened" :close-on-click-modal="false">
    <div style="height: 500px;">
      <!-- 显示地图 -->
      <AMap ref="aMap" />
    </div>
  </el-dialog>
</template>

<script>
// AMAP
import AMap from "@/views/amap"
export default {
  name: "",
  components: { AMap },
  props: {
    flagVisible: {
      type: Boolean,
      default: false
    },
    data: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      // 弹窗显示/关闭标记
      dialogVisible: false
    }
  },
  methods: {
    // dailog
    opened() {
      // 关闭之后又创建地图
      this.$refs.aMap.mapCreate()
      // 调DOM元素的方法时，要确保DOM元素已被加载完成
      // 用nextTick 在dom元素渲染完成之后执行 再调用地图
      this.$nextTick(() => {
        // DOM元素渲染完成后执行 获取经纬度
        const splitLnglat = this.data.lnglat.split(",")
        const lnglat = {
          lng: splitLnglat[0],
          lat: splitLnglat[1]
        }
        // 渲染之后再打点
        this.$refs.aMap.SetMarker(lnglat)
      })
    },
    close() {
      // 销毁
      this.$refs.aMap.mapDestroy()
      this.$emit("update:flagVisible", false)
    }
  },
  watch: {
    flagVisible: {
      handler(newValue, oldValue) {
        this.dialogVisible = newValue
      }
    }
    //// 监听数据变化了
    // parking_data: {
    //     handler(newValue, oldValue) {
    //         console.log('newValuenewValuenewValuenewValue')
    //         console.log(newValue)
    //         this.data = newValue
    //     }
    // }
  }
}
</script>
<style lang="scss" scoped></style>
