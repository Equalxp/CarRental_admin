<template>
  <!-- 级联选择器 动态加载 -->
  <el-cascader v-model="value" :options="cascader_options" :props="cascader_props" @change="changeValue"></el-cascader>
</template>

<script>
// API
import { GetCity } from "@/api/common"
export default {
  name: "",
  data() {
    return {
      value: "",
      cascader_options: [],
      cascader_props: {
        // 动态加载
        lazy: true,
        // node当前点击的节点 resolve为数据加载完成的回调
        lazyLoad(node, resolve) {
          console.log("node", node)
          // 初始的时候就是0 点击选择之后1
          const level = node.level
          // 请求参数
          const requestData = {}
          // 省份
          if (level === 0) {
            // 获取省请求参数只有用type
            requestData.type = "province"
          }
          // 城市
          if (level === 1) {
            requestData.type = "city"
            requestData.province_code = node.value
          }
          // 区/县
          if (level === 2) {
            requestData.type = "area"
            requestData.city_code = node.value
          }
          // 省市区的接口
          GetCity(requestData).then(resonse => {
            const data = resonse.data.data
            
            console.log("getCity", data)
            if (level === 0) {
              data.forEach(item => {
                item.value = item.PROVINCE_CODE
                item.label = item.PROVINCE_NAME
              })
            }
            if (level === 1) {
              data.forEach(item => {
                item.value = item.CITY_CODE
                item.label = item.CITY_NAME
              })
            }
            if (level === 2) {
              data.forEach(item => {
                item.value = item.AREA_CODE
                item.label = item.AREA_NAME
                item.leaf = level >= 2
              })
            }
            // 返回节点数据
            resolve(data)
          })
        }
      }
    }
  },
  methods: {
    changeValue(value) {
      this.$emit("update:cityAreaValue", value.join())
    }
  },
  components: {},
  props: {
    cityAreaValue: {
      type: String,
      default: ""
    }
  }
}
</script>
<style lang="scss" scoped></style>
<!--
1、组件传入的属性用 props 接收；
2、this.$emit("update")返向修改，结合组件属性的.sync。
-->
