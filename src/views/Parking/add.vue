<template>
  <div class="parking-add">
    <VueForm ref="vuForm" :formData="form_data" :formItem="form_item" :formHandler="form_handler">
      <template v-slot:city>
        <CityArea ref="cityArea" :mapLocation="true" :cityAreaValue.sync="form_data.area" @callback="callbackComponent" />
      </template>
      <template v-slot:amap>
        <div class="address-map">
          <AMap ref="amap" :options="option_map" @callback="callbackComponent" />
        </div>
      </template>
    </VueForm>
  </div>
</template>

<script>
// AMAP
import AMap from "../amap/index.vue"
// API
import { ParkingAdd, ParkingDetailed, ParkingEdit } from "@/api/parking"
// 组件
import CityArea from "@c/common/cityArea"
import VueForm from "@c/form/index"
export default {
  name: "ParkingAdd",
  data() {
    // 验证规则
    let validatePass = (rule, value, callback) => {
      if (!value) {
        callback(new Error("请输入停车场名称"))
      } else {
        callback()
      }
    }
    let validateNumber = (rule, value, callback) => {
      const regNumber = /^[0-9]*$/
      if (!value) {
        callback(new Error("请输入可停放车辆"))
      } else if (!regNumber.test(value)) {
        callback(new Error("请输入数字"))
      } else {
        callback()
      }
    }
    return {
      // 表单数据配置
      form_data: {
        parkingName: "",
        area: "",
        address: "",
        type: "",
        carsNumber: "",
        status: "",
        lnglat: ""
      },
      // 表单配置
      form_item: [
        {
          type: "Input",
          label: "停车场名称",
          placeholder: "请输入停车场名称",
          prop: "parkingName",
          width: "200px",
          // 自定义规则
          validator: [{ validator: validatePass, trigger: "change" }]
        },
        {
          type: "Slot",
          slotName: "city",
          prop: "area",
          label: "区域"
        },
        {
          type: "Input",
          label: "详细地址",
          placeholder: "请输入详细地址",
          prop: "address",
          required: true,
          requiredMsg: "请输入停车场名称"
        },
        {
          type: "Radio",
          label: "类型",
          prop: "type",
          options: this.$store.state.config.parking_type,
          required: true
        },
        {
          type: "Input",
          label: "可停放车辆",
          placeholder: "请输入数字类型",
          prop: "carsNumber",
          validator: [{ validator: validateNumber, trigger: "change" }]
        },
        {
          type: "Radio",
          label: "禁启用",
          prop: "status",
          options: this.$store.state.config.radio_disabled
        },
        {
          type: "Slot",
          slotName: "amap",
          label: "位置"
        },
        {
          type: "Input",
          label: "经纬度",
          placeholder: "请输入详细地址",
          prop: "lnglat",
          disabled: true
        }
      ],
      form_handler: [
        {
          label: "确定",
          key: "submit",
          type: "danger",
          handler: () => this.formValidate()
        },
        {
          label: "重置",
          key: "reset"
        }
      ],
      // id
      id: this.$route.query.id,
      // 地图配置
      option_map: {
        // true才回调
        mapLoad: true
      },
      status: this.$store.state.config.radio_disabled,
      type: this.$store.state.config.radio_disabled,
      // 表单验证规则
      rules: {
        parkingName: [{ required: true, message: "请输入停车场名称", trigger: "change" }],
        carsNumber: [
          { required: true, message: "数量不能为空", trigger: "change" },
          { type: "number", message: "请输入数字" }
        ],
        address: [{ required: true, message: "详情地址不能为空", trigger: "change" }],
        area: [{ required: true, message: "请选择省市区", trigger: "change" }],
        lnglat: [{ required: true, message: "经纬度不能为空", trigger: "change" }]
      },
      // 按钮加载
      button_loading: false
    }
  },
  methods: {
    // 表单验证
    formValidate() {
      // 调用
      this.$refs.vuForm.$refs.form.validate(valid => {
        if (valid) {
          this.id ? this.editParking() : this.addParking();
        } else {
          console.log('error submit!!');
          return false
        }
      })
    },
    aaaa(data) {
      console.log("data", data)
      this.form.lonlag = data.value
    },
    // 父子组件之间
    callbackComponent(params) {
      // 子组件传来的函数名  例如:{ function: "mapLoad" }
      console.log("callbackComponent", params)
      if (params.function) {
        // 给this上加一个函数
        this[params.function](params.data)
      }
    },
    // 拿到坐标塞给center
    setMapCenter(data) {
      // 获取到中文地址
      console.log("setMapCenter", data)
      // 通过地址去拿经纬度 调用地图的方法
      this.$refs.amap.setMapCenter(data)
    },
    // 地图加载完成
    mapLoad() {
      // 等待子组件加载地图完成之后再调用deatil方法
      this.getDetaile()
    },
    // 确定按钮的回调
    onSubmit(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.id ? this.editParking() : this.addParking()
        } else {
          console.log("error submit!!")
          return false
        }
      })
    },
    // 新增停车场API
    addParking() {
      this.button_loading = true
      ParkingAdd(this.form)
        .then(response => {
          this.$message({
            type: "primary",
            message: response.message
          })
          this.button_loading = false
          this.reset("form")
        })
        .catch(error => {
          this.button_loading = false
        })
    },
    // 修改停车场
    editParking() {
      let requestData = JSON.parse(JSON.stringify(this.form_data))
      this.button_loading = true
      requestData.id = this.id
      ParkingEdit(requestData)
        .then(res => {
          this.$message({
            type: "primary",
            message: res.message
          })
          this.button_loading = false
          this.$router.push({
            name: "ParkingIndex"
          })
        })
        .catch(error => {
          this.button_loading = false
        })
    },
    // 获取详情
    getDetaile() {
      // 没有id 就不去请求
      if (!this.id) {
        return false
      }
      // 地图和接口之间的异步加载 让一方先加载完成
      ParkingDetailed({ id: this.id }).then(res => {
        // console.log("ParkingDetailed",res)
        const data = res.data
        // 接口请求出来的
        for (const key in data) {
          if (Object.keys(this.form_data).includes(key)) {
            this.form_data[key] = data[key]
          }
        }
        // 设置覆物
        const splitLnglat = data.lnglat.split(",")
        const lnglat = {
          lng: splitLnglat[0],
          lat: splitLnglat[1]
        }
        this.$refs.amap.SetMarker(lnglat)
        // 初始化省市区
        this.$refs.cityArea.initDefault(data.region)
      })
    },
    // 重置表单
    reset(formName) {
      this.$refs[formName].resetFields()
      // 清除 cityAray 的值
      this.$refs.cityArea.clear()
      // 清除地图覆盖物
      this.$refs.amap.clearMarker()
    },
    // 获取经纬度
    getLnglat(data) {
      this.form.lnglat = data.lnglat.value
    }
  },
  beforeMount() {
    this.getDetaile()
  },
  components: {
    AMap,
    CityArea,
    VueForm
  }
}
</script>

<style lang="scss" scoped>
.address-map {
  width: 100%;
  height: 500px;
}
</style>
