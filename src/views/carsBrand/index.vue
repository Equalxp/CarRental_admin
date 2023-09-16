<template>
  <div>
    <div class="filter-form">
      <el-row>
        <el-col :span="18">
          <el-form :inline="true" :model="form" class="demo-form-inline" label-width="100px">
            <el-form-item label="车辆品牌">
              <el-input v-model="form.brand" placeholder="请输入品牌"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="search">搜索</el-button>
            </el-form-item>
          </el-form>
        </el-col>
        <el-col :span="6">
          <div type="danger">
            <el-button @click="dialog_show = true">新增品牌车辆</el-button>
          </div>
        </el-col>
      </el-row>
    </div>
    <!-- 表格数据 -->
    <TableData ref="table" :config="table_config">
      <!-- 禁用启用 -->
      <template v-slot:status="slotData">
        <el-switch @change="switchChange(slotData.data)" v-model="slotData.data.status" active-color="#13ce66" inactive-color="#ff4949"></el-switch>
      </template>
      <!-- 操作 -->
      <template v-slot:operation="slotData">
        <!-- 传id过去 -->
        <!-- <el-button size="small" type="primary" @click="edit(slotData.data.id)">编辑</el-button> -->
        <!-- 直接传递数据 -->
        <el-button size="small" type="primary" @click="edit(slotData.data)">编辑</el-button>
        <el-button :loading="slotData.data.id == rowId" size="small" type="danger" @click="delConfirm(slotData.data.id)">删除</el-button>
      </template>
    </TableData>
    <!-- 探出框 -->
    <!-- 父->子 单项数据流 -->
    <!-- <addCarsBrand :id='data_id' :flagVisible.sync="dialog_show" /> -->
    <!-- props传递数据过去 -->
    <addCarsBrand :data="data_brand" :flagVisible.sync="dialog_show" @callbackComponent="callbackComponent" />
  </div>
</template>

<script>
// API
import { BrandDelete, BrandStatus } from "@/api/brand"
import TableData from "../../components/tableData/index"
import addCarsBrand from "../../components/dialog/addCarsBrand.vue"
export default {
  name: "Parking",
  components: {
    addCarsBrand,
    TableData
  },
  data() {
    return {
      // dialog
      dialog_show: false,
      form: {
        parking_name: "",
        area: "",
        type: "",
        brand: ""
      },
      table_config: {
        thead: [
          {
            label: "Logo",
            prop: "imgUrl",
            type: "image",
            imgWidth: 150
          },
          {
            label: "车辆品牌",
            prop: "nameCh",
            type: "function",
            callback: (row, prop) => {
              // console.log("车辆品牌", row)
              return `${row.nameCh}/${row.nameEn}`
            }
          },
          {
            label: "禁启用",
            prop: "status",
            type: "slot",
            // 具名插槽
            slotName: "status"
          },
          {
            label: "操作",
            type: "slot",
            slotName: "operation",
            width: 200
          }
        ],
        // url列表文件 loadData会半默认请求这个
        url: "brandList",
        data: {
          pageSize: 10,
          pageNumber: 1
        }
      },
      // rowId
      rowId: "",
      data_id: "",
      data_brand: {},
      // switch_disabled
      switch_disabled: ""
    }
  },
  methods: {
    callbackComponent(params) {
      console.log(params)
      if (params.function) {
        this[params.function]()
      }
    },
    // 删除
    delConfirm(id) {
      this.$confirm("确定删除这个信息嘛", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.rowId = id
          BrandDelete({ id })
            .then(res => {
              console.log("BrandDelete", res)
              this.$message({
                type: "success",
                message: res.message
              })
              this.rowId = ""
              // 调用子组件table里的方法
              this.$refs.table.requestData()
            })
            .cacth(error => {
              this.rowId = ""
            })
        })
        .catch(() => {})
    },
    // // 编辑 id
    // edit(id) {
    //   this.data_id = id
    //   this.dialog_show = true
    // },
    // 编辑 传递对象
    edit(data) {
      // this.data_brand = data
      this.data_brand = Object.assign({}, data)
      console.log("dialog_show", this.dialog_show)
      this.dialog_show = true
    },
    // 禁启用
    switchChange(data) {
      console.log("switchChange", data)
      if (this.switch_flag) {
        return false
      }
      const requestData = {
        id: data.id,
        status: data.status
      }
      // this.switch_flag = true;
      this.switch_disabled = data.id // 第一种方式：组件本身的属性处理
      BrandStatus(requestData)
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
    },
    // 搜索
    search() {
      const requestData = {
        pageSize: 10,
        pageNumber: 1
      }
      if (this.form.brand) {
        requestData.brand = this.form.brand
      }
      // 搜索
      this.$refs.table.requestData(requestData)
    },
    onSubmit() {
      console.log("submit!")
    }
  }
}
</script>

<style></style>
