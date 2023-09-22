<template>
  <div>
    <!-- 表格数据 -->
    <TableData ref="table" :config="table_config">
      <!-- 车辆公共属性 -->
      <template v-slot:content>
        <div>
          <el-button :type="cars_list_basis_type_id == item.id ? 'danger' : ''" size="small" :a="item.id" v-for="item in cars_list_basis_item" :key="item.id" @click="getTypeList(item)" class="margin-bottom-25">
            {{ item.value }}
          </el-button>
        </div>
      </template>
    </TableData>
    <AddCarsAttr :data="current_cars_type_data" :flagVisible.sync="dialog_show" />
  </div>
</template>

<script>
// 组件
import TableData from "../../components/tableData/index"
import AddCarsAttr from "@c/dialog/addCarsAttr"
// API
import { GetCarsTypeBasis, GetCarsTypeList } from "@/api/carsAttr"
// common
import { address, yearCheckType, energyType } from "@/utils/common"
export default {
  name: "CarsList",
  components: { TableData, AddCarsAttr },
  data() {
    return {
      // 表格配置
      table_config: {
        isRequest: false,
        checkbox: false,
        pagination: false,
        // 表格的头部
        thead: [
          { label: "文本", prop: "value" },
          { label: "字段", prop: "key" }
        ],
        // url列表文件
        url: "carsAttrList",
        data: {
          pageSize: 10,
          pageNumber: 1
        },
        form_item: [
          {
            label: "关键字",
            type: "Keyword",
            options: ["key", "value"]
          }
        ],
        form_handler: [
          {
            label: "新增",
            prop: "add",
            type: "success",
            element: "button",
            // 弹出框
            handler: () => this.carsTypeAddDialog()
          }
        ],
        form_config: {
          resetButton: true
        }
      },
      switch_disabled: "",
      switch_flag: false,
      // 车辆公用属性集合
      cars_list_basis_item: [],
      // 车辆公用属性ID
      cars_list_basis_type_id: "",
      // 弹窗标记
      dialog_show: false,
      // 当前公用属性数据
      current_cars_type_data: {}
    }
  },
  methods: {
    // 自定义属性列表
    getTypeList(data) {
      this.cars_list_basis_type_id = data.id
      // 存储当前数据
      this.current_cars_type_data = data
      this.getCarsTypeList()
    },
    // 获取车辆公共属性 - 1
    getCarsTypeBasis() {
      return GetCarsTypeBasis().then(response => {
        const data = response.data.data
        // mount里面请求下来 v-for
        this.cars_list_basis_item = data
        // 第一种做法 请求完列表之后 再请求列表参数
        this.current_cars_type_data.id = data[0].id
        this.getCarsTypeList()
      })
    },
    // 获取车辆自定义属性 - 2
    getCarsTypeList() {
      // GetCarsTypeList({ typeId: this.cars_list_basis_type_id }).then(response => {
      //   console.log("getCarsTypeList", response)
      // })
      this.$refs.table.requestData({ typeId: this.cars_list_basis_type_id })
    },
    // 新增 探出框
    carsTypeAddDialog() {
      if (!this.current_cars_type_data.id) {
        this.$message({
          message: "请选择车辆公共属性",
          type: "error"
        })
        return false
      }
      this.dialog_show = true
    }
  },
  // DOM元素渲染之前（生命周期）
  beforeMount() {
    this.getCarsTypeBasis()
  },
  // DOM元素渲染完成（生命周期）
  mounted() {}
}
</script>

<style lass="scss" scoped></style>
