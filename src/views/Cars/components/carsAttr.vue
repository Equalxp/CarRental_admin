<template>
  <div>
    <CarsBasisAttr @getAttrList="getAttrList" />
    {{ countKm }}
    <el-row :gutter="15">
      <el-col :span="4" v-for="item in attr_data" :key="item.key">
        <span>{{ item.value }}</span>
        <el-input v-model="attr_item[attr_basis_data.key][item.key]" :placeholder="item.value" />
      </el-col>
    </el-row>
  </div>
</template>
<script>
import CarsBasisAttr from "./carsBasisAttr"
export default {
  name: "CarsAttr",
  data() {
    return {
      // 自定义属性数据
      attr_data: [],
      attr_basis_data: {},
      // 数据集合
      attr_item: {}
    }
  },
  components: { CarsBasisAttr },
  beforeMount() {},
  methods: {
    getAttrList(data) {
      this.attr_basis_data = data.attr_basis_data
      this.attr_data = data.attr_data
      this.attrFormat()
    },
    // 数据格式化
    attrFormat() {
      // 自定义属性为空时，不执行
      if (this.attr_data.length == 0) {
        return false
      }
      // 公用属性的 key
      const attrBasisKey = this.attr_basis_data.key
      // 判断属性集合是否存在 公用属性的key，存在则不处理
      if (this.attr_item[attrBasisKey]) {
        return false
      }
      // 处理自定义属性
      const attrJson = {}
      this.attr_data.forEach(item => {
        attrJson[item.key] = ""
      })
      // 更新属性集合
      this.$set(this.attr_item, attrBasisKey, attrJson)
      // 典型的问题
      // 动态绑定数据后，视图不渲染
      // this.$set(test，'bb', 11111)  // 更新指定对象中，某个 key 的数据。
    },
    callbackValue() {
      this.$emit("update:value", JSON.stringify(this.attr_item)) // JSON.parse()
    }
  },
  props: {
    initValue: {
      type: String,
      default: ""
    },
    oil: {
      type: Number,
      default: 0
    }
  },
  computed: {
    // 计算公里数
    countKm() {
      // 油量(xx%) * 油箱容积 / 100 = xx L
      // xx L油 / 耗油( L/100Km 百公里耗油 ) = xx 百km
      if (!this.attr_item.basis || !this.attr_item.basis.fuel_consume || !this.attr_item.car_body || !this.attr_item.car_body.tank_volume) {
        return ""
      }
      // 剩余油量
      const surplusOil = (this.oil * this.attr_item.car_body.tank_volume) / 100
      // 计算公里
      const km = (surplusOil / this.attr_item.basis.fuel_consume) * 100
      // 返回值
      this.$emit("update:countKm", km.toFixed(2))
    }
  },
  watch: {
    initValue: {
      handler(newValue) {
        newValue && (this.attr_item = JSON.parse(newValue))
        // console.log("initValue", newValue)
      }
    },
    immediate: true
  }
}
</script>
<style lang="scss" scoped></style>
<!-- 算油 -->
