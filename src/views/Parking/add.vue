<template>
  <div class="parking-add">
    <el-form ref="form" :model="form" label-width="120px">
      <el-form-item label="停车场名称">
        <el-input v-model="form.name"></el-input>
      </el-form-item>

      <el-form-item label="区域">
        <!-- 单向数据流 -->
        <CityArea :cityAreaValue.sync="form.area" />
      </el-form-item>

      <el-form-item label="类型">
        <el-radio-group v-model="form.resource">
          <el-radio label="室内"></el-radio>
          <el-radio label="室外"></el-radio>
        </el-radio-group>
      </el-form-item>

      <el-form-item label="可停放车辆">
        <el-input v-model="form.name"></el-input>
      </el-form-item>

      <el-form-item label="禁用启用">
        <el-radio-group v-model="form.resource">
          <el-radio label="禁用"></el-radio>
          <el-radio label="启用"></el-radio>
        </el-radio-group>
      </el-form-item>

      <el-form-item label="位置">
        <div class="address-map">
          <AMap @lonlag="aaa" ref="amap" />
        </div>
      </el-form-item>

      <el-form-item label="经纬度坐标">
        <el-input v-model="form.lonlag"></el-input>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
// AMAP
import AMap from "../amap/index.vue"
// 组件
import CityArea from "@c/common/cityArea"
export default {
  name: "ParkingAdd",
  data() {
    return {
      form: {
        name: "",
        area: "",
        region: "",
        date1: "",
        date2: "",
        delivery: false,
        type: [],
        resource: "",
        lonlag: ""
      }
    }
  },
  methods: {
    aaa(data) {
      console.log("data", data)
      this.form.lonlag = data.value
    },
    callbackComponent(params) {
      if (params.function) {
        this[params.function](params.data)
      }
    },
    setMapCenter(data) {
      this.$refs.amap.setMapCenter(data.address)
    },
    onSubmit() {
      console.log("submit!")
    }
  },
  components: { AMap, CityArea }
}
</script>

<style lang="scss" scoped>
.address-map {
  width: 100%;
  height: 500px;
}
</style>
