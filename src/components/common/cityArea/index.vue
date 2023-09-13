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
    // 保存this
    const _this = this
    return {
      address: [],
      addressData: {},
      value: "",
      cascader_options: [],
      cascader_props: {
        lazy: true,
        lazyLoad(node, resolve) {
          console.log("node", node)
          // 一开始就执行 node为0
          const level = node.level
          // 请求参数
          const requestData = {}
          // 声明自定义配置
          const jsonType = {
            0: { type: "province" },
            1: { type: "city", code: "province" },
            2: { type: "area", code: "city" }
          }
          // 有code的情况 拿到code
          if (jsonType[level].code) {
            requestData[`${jsonType[level].code}_code`] = node.value
          }
          // type 拿到对应的type
          requestData.type = jsonType[level].type
          // 省市区的接口
          GetCity(requestData).then(resonse => {
            const data = resonse.data.data
            // 类型 变大写(参数)
            const type = jsonType[level].type.toUpperCase()
            // 自定义value、label
            data.forEach(item => {
              // value/lable用于级联的显示
              item.value = item[`${type}_CODE`]
              item.label = item[`${type}_NAME`]
              // 最后一层选择
              if (level === 2) {
                item.leaf = level >= 2
              }
            })
            // 存储省市区数据 方便从地点 -> 经纬度
            _this.addressData[jsonType[level].type] = data
            // 返回节点数据
            resolve(data)
          })
          // 获取address
          if (node.level !== 0) {
            // level为1那就是获取了省
            _this.getAddress(node)
          }
        }
      }
    }
  },
  methods: {
    changeValue(value) {
      this.$emit("update:cityAreaValue", value.join())
      // 匹配最后一项 区县
      const lastCode = value[value.length - 1]
      const area = this.addressData.area.filter(item => item.value == lastCode)[0]
      this.address[2] = area.label
      this.getAddress()
    },
    // 获取中文地址
    getAddress(node) {
      if (node) {
        // 索引值
        const index = node.level - 1
        this.address[index] = node.label
        console.log("this.address", this.address)
      }
      // 为 true 时，执行地图交互
      if (this.mapLocation) {
        this.$emit("callback", {
          function: "setMapCenter",
          data: {
            // 将级联选择的地址join
            address: this.address.join("")
          }
        })
      }
    }
  },
  components: {},
  props: {
    cityAreaValue: {
      type: String,
      default: ""
    },
    mapLocation: {
      type: Boolean,
      default: false
    }
  }
}
</script>
<style lang="scss" scoped></style>
<!--
1、组件传入的属性用 props 接收；
2、this.$emit("update")返向修改，结合组件属性的.sync。
-->
