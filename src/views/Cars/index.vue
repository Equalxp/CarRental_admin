<template>
  <div>
    <!-- 表格数据 -->
    <TableData ref="table" :config="table_config">
      <!-- 禁启用 -->
      <template v-slot:status="slotData">
        <el-switch :disabled="slotData.data.id == switch_disabled" @change="switchChange(slotData.data)" v-model="slotData.data.status" active-color="#13ce66" inactive-color="#ff4949"> </el-switch>
      </template>
    </TableData>
    <MapLocation :flagVisible.sync="map_show" :data="parking_data" />
  </div>
</template>

<script>
// 组件
import CityArea from "@c/common/cityArea"
import MapLocation from "../../components/dialog/showMapLocation"
import TableData from "../../components/tableData/index"
// API
import { CarsStatus, CarsDelete } from "../../api/car"
// common
import { address, yearCheckType, energyType } from "@/utils/common"
export default {
  name: "Cars",
  data() {
    return {
      // 表格配置
      table_config: {
        // 表格的头部
        thead: [
          { label: "车牌号", prop: "carsMode" },
          { label: "车辆品牌", prop: "nameCh" },
          {
            label: "车辆LOGO",
            prop: "imgUrl",
            type: "image"
          },
          {
            label: "车辆图片",
            prop: "carsImg",
            type: "image"
          },
          {
            label: "年检",
            prop: "yearCheck",
            type: "function",
            // 返回值
            callback: (row, prop) => yearCheckType(row[prop]),
            width: "100px"
          },
          {
            label: "能源类型",
            prop: "energyType",
            type: "function",
            callback: (row, prop) => energyType(row[prop]),
            width: "100px"
          },
          {
            label: "禁启用",
            prop: "status",
            type: "slot",
            slotName: "status",
            width: "100px"
          },
          { label: "停车场", prop: "parkingName" },
          {
            label: "区域",
            prop: "address",
            type: "function",
            callback: (row, prop) => address(row[prop])
          },
          // 把基本操作封装
          {
            label: "操作",
            type: "operation",
            default: {
              deleteButton: true,
              editButton: true,
              // 路由跳转到哪
              editButtonLink: "CarsAdd"
            },
            buttonGroup: [
              {
                label: "编辑",
                type: "primary",
                event: "link",
                name: "CarsAdd",
                key: "id",
                value: "id"
              }
            ]
          }
        ],
        // url列表文件
        url: "carsList",
        data: {
          pageSize: 10,
          pageNumber: 1
        },
        form_item: [
          { label: "城市", type: "City" },
          { label: "类型", prop: "parkingType", type: "Select", width: "120px", options: "parking_type" },
          { label: "禁启用", prop: "status", type: "Select", width: "120px", options: "radio_disabled" },
          { label: "关键字", type: "Keyword" }
        ],
        form_handler: [
          { label: "新增", prop: "add", type: "success", element: "link", router: "/carsAdd", color: "#fff" }
          // { label: "下载", prop: "down", type: "success", element: "button", handler: () => this.aaaa() }
        ],
        form_config: {
          resetButton: true
        }
      },
      switch_disabled: "",
      switch_flag: false,
      // 禁用启用
      parking_status: this.$store.state.config.radio_disabled,
      // 停车场类型
      parking_type: this.$store.state.config.parking_type,
      // 地图的显示
      map_show: false,
      parking_data: {},
      table_loading: false,
      rowId: ""
    }
  },
  components: { CityArea, MapLocation, TableData },
  methods: {
    callbackComponent(params) {
      if (params.function) {
        this[params.function](params.data)
      }
    },
    // 点击查看 显示地图
    showMap(data) {
      this.map_show = true
      // parking_data的值 是一行所有的数据
      this.parking_data = data
    },
    // 禁启用
    switchChange(data) {
      // console.log('switchChange',data);
      if (this.switch_flag) {
        return false
      }
      const requestData = {
        id: data.id,
        status: data.status
      }
      // console.log("switchChange", requestData)
      // this.switch_flag = true;
      this.switch_disabled = data.id // 第一种方式：组件本身的属性处理
      CarsStatus(requestData)
        .then(response => {
          this.$message({
            type: "success",
            message: response.message
          })
          this.switch_disabled = ""
          // this.switch_flag = false;
        })
        .catch(error => {
          this.switch_disabled = ""
          // this.switch_flag = false;
        })
    }
  },
  // DOM元素渲染之前（生命周期）
  beforeMount() {},
  // DOM元素渲染完成（生命周期）
  mounted() {}
}
</script>

<style lass="scss" scoped></style>
