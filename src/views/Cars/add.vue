<template>
  <div class="parking-add">
    <!-- form组件化 -->
    <VueForm ref="vuForm" :formData="form_data" :formItem="form_item" :formHandler="form_handler">
      <template v-slot:maintain>
        <el-row :gutter="30">
          <el-col :span="6">
            <el-input v-model="form_data.maintainDate"> </el-input>
            <el-date-picker v-model="form_data.maintainDate" value-format="yyyy-MM-dd" type="date" placeholder="选择日期" style="width: 100%;"></el-date-picker>
          </el-col>
          <el-col :span="6">下次保养日期：2020-12-12</el-col>
        </el-row>
      </template>
      <template v-slot:energy>
        <!-- radio框 -->
        <el-radio-group v-model="form_data.energyType" @change="changeEnergyType">
          <el-radio v-for="item in energyType" :key="item.value" :label="item.value">
            {{ item.label }}
          </el-radio>
        </el-radio-group>
        <!-- 电 -->
        <div class="progress-bar-wrap" v-if="form_data.energyType == 3 || form_data.energyType == 1">
          <span class="label-text">电量：</span>
          <el-row>
            <el-col :span="10">
              <el-slider v-model="form_data.electric" show-input></el-slider>
            </el-col>
          </el-row>
        </div>
        <!-- 油 -->
        <div class="progress-bar-wrap" v-if="form_data.energyType == 3 || form_data.energyType == 2">
          <span class="label-text">油量：</span>
          <el-row>
            <el-col :span="10">
              <el-slider v-model="form_data.oil" show-input></el-slider>
            </el-col>
          </el-row>
        </div>
      </template>
      <template v-slot:carsAttr>
        <CarsAttr :countKm.sync="form_data.countKm" :oil="form_data.oil" :initValue="form_data.carsAttr" ref="carsAttr" :value.sync="form_data.carsAttr" />
      </template>
    </VueForm>
  </div>
</template>
<script>
// 组件
import VueForm from "@c/form"
import CarsAttr from "./components/carsAttr.vue"
// API
import { CarsAdd, CarsDetailed, CarsEdit } from "../../api/car"
import { GetCarsBrand, GetParking } from "@/api/common"
export default {
  name: "CarsAdd",
  components: {
    VueForm,
    CarsAttr
  },
  data() {
    return {
      // id
      id: this.$route.query.id,
      // 能源类型
      energyType: this.$store.state.config.energyType,
      cars_attr: [],
      // 富文本对象
      editor: null,
      form_data: {
        parkingId: "",
        carsBrandId: "",
        carsMode: "",
        carsNumber: "",
        carsFrameNumber: "",
        engineNumber: "",
        carsImg: "",
        countKm: "",
        yearCheck: true,
        gear: 1,
        energyType: 2,
        electric: 100,
        oil: 100,
        carsAttr: "",
        content: "",
        maintainDate: "",
        status: true
      },
      form_item: [
        {
          type: "Select",
          label: "车辆品牌",
          placeholder: "请选择车辆品牌",
          prop: "carsBrandId",
          // 自有的私有属性 默认拿的是value/label
          select_vlaue: "id",
          select_label: "nameCh",
          options: [],
          required: true
        },
        {
          type: "Select",
          label: "停车场",
          placeholder: "请选择停车场",
          // 自有的私有属性
          select_vlaue: "id",
          select_label: "parkingName",
          prop: "parkingId",
          options: [],
          required: true
        },
        {
          type: "Input",
          label: "车辆型号",
          placeholder: "请输入车辆型号",
          prop: "carsMode",
          required: true
        },
        {
          type: "Input",
          label: "车牌号",
          placeholder: "请输入车牌号",
          prop: "carsNumber",
          required: true
        },
        {
          type: "Input",
          label: "车架号",
          placeholder: "请输入车架号",
          prop: "carsFrameNumber",
          required: true
        },
        {
          type: "Upload",
          label: "缩略图",
          placeholder: "请上传图片",
          prop: "carsImg",
          required: true
        },
        {
          type: "Input",
          label: "发动机号",
          placeholder: "请输入发动机号",
          prop: "engineNumber",
          required: true
        },
        {
          type: "Radio",
          label: "年检",
          placeholder: "请选择年检",
          prop: "yearCheck",
          options: this.$store.state.config.year_check
        },
        {
          type: "Slot",
          slotName: "maintain",
          prop: "maintainDate",
          label: "保养日期"
        },
        {
          type: "Radio",
          label: "档位",
          placeholder: "请选择档位",
          prop: "gear",
          options: this.$store.state.config.gear
        },
        {
          type: "Slot",
          slotName: "energy",
          prop: "energyType",
          label: "能源类型"
        },
        {
          type: "Input",
          label: "可行驶公里",
          prop: "countKm"
        },
        {
          type: "Slot",
          slotName: "carsAttr",
          prop: "carsAttr",
          label: "车辆属性"
        },
        {
          // 封装富文本了
          type: "Wangeditor",
          prop: "content",
          label: "车辆描述"
        },
        {
          type: "Disabled",
          label: "禁启用",
          placeholder: "请选择禁启用",
          prop: "status"
        }
      ],
      // 按钮&事件
      form_handler: [
        { label: "确定", key: "submit", type: "danger", handler: () => this.formValidate() },
        { label: "重置", key: "reset" }
      ],
      // 车辆品牌列表
      carsBrandList: [],
      // 上传文件配置
      uploadData: {
        token: ""
      }
    }
  },
  mounted() {},
  beforeMount() {
    // 掉接口请求数据
    this.GetCarsBrand()
    this.GetParking()
    this.getDetailed()
  },
  methods: {
    formValidate() {
      this.formatCarsAttr()
      // console.log("填写的所有数据", this.form_data)
      // 发请求 表单验证
      this.$refs.vuForm.$refs.form.validate(valid => {
        if (valid) {
          this.id ? this.edit() : this.add()
        } else {
          console.log("error submit!!")
          return false
        }
      })
    },
    // 编辑车辆
    edit() {
      const requestData = JSON.parse(JSON.stringify(this.form_data))
      requestData.id = this.id
      // 解构 / JSON
      // CarsEdit({ ...this.form_data, id: this.id }).then(response => {
      CarsEdit(requestData).then(response => {
        this.$message({
          message: response.message,
          type: "success"
        })
      })
    },
    // 新增车辆
    add() {
      CarsAdd(this.form_data).then(response => {
        this.$message({
          message: response.message,
          type: "success"
        })
        this.$refs.vuForm.resetForm()
        this.cars_attr = []
        this.form_data.content = ""
        this.$router.push({
          name: "CarsIndex"
        })
      })
    },
    // 获取详情
    async getDetailed() {
      if (!this.id) {
        return false
      }
      CarsDetailed({ id: this.id }).then(response => {
        // console.log("CarsDetailed", response.data)
        const data = response.data
        if (!data) {
          return false
        }
        for (let key in data) {
          // form_data有的key都data赋值过去
          if (Object.keys(this.form_data).includes(key)) {
            this.form_data[key] = data[key]
          }
        }
        // console.log("CarsDetailed", this.form_data)
      })
    },
    // 获取车辆品牌
    async GetCarsBrand() {
      const { data: res } = await GetCarsBrand()
      // console.log("GetCarsBrand", res)
      if (res.data) {
        // 数据
        const carsBrand = this.form_item.filter(item => {
          // 过滤拿到汽车品牌的对象
          return item.prop == "carsBrandId"
        })
        // console.log("filterCarBrand", carsBrand)
        // 然后赋值给option
        if (carsBrand.length > 0) {
          carsBrand[0].options = res.data
        }
      }
    },
    // 获取停车场
    async GetParking() {
      const { data: res } = await GetParking()
      // console.log("GetParking", res)
      if (res.data) {
        const parking = this.form_item.filter(item => item.prop == "parkingId")
        if (parking.length > 0) {
          parking[0].options = res.data
        }
      }
    },
    // 添加车辆属性
    addCarsAttr() {
      this.cars_attr.push({ attr_key: "", attr_value: "" })
    },
    // 删除车辆属性
    delCarsAttr(index) {
      // 第一个参数：指定数组索引位置， 第二参数：从指定位置开始删除多少个。删除数组的指定元素
      this.cars_attr.splice(index, 1)
    },
    // 单独处理添加的汽车属性
    formatCarsAttr() {
      this.$refs.carsAttr.callbackValue()
    },
    changeEnergyType(value) {
      this.form_data.oil = 0
      this.form_data.electric = 0
    }
  }
}
</script>
<style lang="scss">
.progress-bar-wrap {
  padding-left: 50px;
  margin-top: 10px;
  position: relative;
  .label-text {
    position: absolute;
    left: 0;
  }
}
.progress-bar {
  height: 10px;
  width: 100%;
  border-radius: 50px;
  background-color: #ccc;
  margin-top: 15px;
  span {
    position: relative;
    display: block;
    height: 100%;
    background-color: #409eff;
    border-radius: 50px;
  }
  label {
    position: absolute;
    right: 0;
    bottom: 10%;
  }
}
.cars-attr-list {
  margin-top: 15px;
  margin-bottom: 15px;
  overflow: hidden;
}
</style>
