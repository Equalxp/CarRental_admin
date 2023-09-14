<template>
  <div>
    <div class="filter-form">
      <el-row>
        <el-col :span="21">
          <el-form :inline="true" :model="form" class="demo-form-inline">
            <el-form-item label="区域">
              <CityArea ref="cityArea" :cityAreaValue.sync="form.area" @callback="callbackComponent" />
            </el-form-item>
            <!--  -->
            <el-form-item label="类型">
              <el-select v-model="form.type" placeholder="停车场" class="width-120">
                <el-option v-for="item in parking_type" :label="item.label" :value="item.value" :key="item.value"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="禁启用">
              <el-select v-model="form.status" placeholder="请选择" class="width-120">
                <el-option v-for="item in parking_status" :label="item.label" :value="item.value" :key="item.value"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="关键字">
              <el-select v-model="search_key" placeholder="请选择" @change="searchKeySelect" class="width-120">
                <el-option label="停车场名称" value="parkingName"></el-option>
                <el-option label="详细区域" value="address"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-input v-model="keyword" placeholder="请输入关键字按Enter搜索"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="getParkingList">搜索</el-button>
            </el-form-item>
          </el-form>
        </el-col>
        <el-col :span="3">
          <div class="pull-right">
            <router-link to="/parkingAdd">
              <el-button type="danger">新增停车场</el-button>
            </router-link>
          </div>
        </el-col>
      </el-row>
    </div>
    <!-- 表格数据 -->
    <TableData :config="table_config">
      <!-- 禁启用 -->
      <template v-slot:status>
        
      </template>
      <!-- 查看地图 -->
      <template>

      </template>
      <!-- 操作 -->
      <template>
        
      </template>
    </TableData>
    <div>
      <el-table :data="tableData" border style="width: 100%">
        <el-table-column type="selection" width="35"></el-table-column>
        <el-table-column prop="parkingName" label="停车场名称"></el-table-column>
        <!-- 类型处理 -->
        <el-table-column prop="type" label="类型">
          <template slot-scope="scoped">
            <!-- 传的值 ｜ 函数 -->
            <span>{{ scoped.row.type | getType }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="address" label="区域"></el-table-column>
        <el-table-column prop="carsNumber" label="可停放车辆"></el-table-column>
        <el-table-column prop="disabled" label="禁启用">
          <template slot-scope="scope">
            <el-switch v-model="scope.row.status" active-value="2" inactive-value="1" active-color="#13ce66" inactive-color="#ff4949"> </el-switch>
          </template>
        </el-table-column>
        <el-table-column prop="lnglat" label="查看位置">
          <template slot-scope="scoped">
            <!-- {{ scoped.row }} -->
            <el-button type="success" size="mini" @click="showMap(scoped.row)">查看地图</el-button>
          </template>
        </el-table-column>

        <el-table-column label="操作">
          <template slot-scope="scoped">
            <el-button size="small" type="primary" @click="edit(scoped.row.id)">编辑</el-button>
            <el-button size="small" type="danger" @click="delConfirm(scoped.row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-row class="padding-top-30">
        <el-col :span="4">
          <div style="padding: 5px;"></div>
        </el-col>
        <el-col :span="20">
          <el-pagination class="pull-right" background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage" :page-sizes="[10, 20, 50, 100]" :page-size="10" layout="total, sizes, prev, pager, next, jumper" :total="total"> </el-pagination>
        </el-col>
      </el-row>
      <!-- 传递参数给对话框组件 -->
      <MapLocation :flagVisible.sync="map_show" :data="parking_data" />
    </div>
  </div>
</template>

<script>
// 组件
import CityArea from "@c/common/cityArea"
import MapLocation from "../../components/dialog/showMapLocation"
import TableData from "../../components/tableData/index"
// API
import { ParkingList, ParkingDelete } from "@/api/parking"
let _this
export default {
  name: "Parking",
  data() {
    _this = this
    return {
      // 表格配置
      table_config: {
        thead: [
          { label: "停车场名称", prop: "parkingName" },
          {
            label: "类型",
            prop: "type",
            type: "function",
            // 回调 处理交互的东西
            callback: (row, prop) => {
              // 直接用key拿值
              const data = this.parking_type_json[row[prop]]
              if (data) {
                // 回调的返回值
                return data.label
              }
            }
          },
          {
            label: "区域",
            prop: "address",
            type: "function",
            callback: (row, prop) => {
              let address = row[prop]
              let addressInfo = ""
              if (address) {
                let split = address.split(",")
                addressInfo += split[0]
                // 街道
                if (split[1]) {
                  // 子组件里面用v-html去解析
                  addressInfo += `<br/>${split[1]}`
                }
              }
              return addressInfo
            }
          },
          { label: "可停放车辆", prop: "carsNumber" },
          {
            label: "禁启用",
            prop: "status",
            type: "slot",
            // 具名插槽
            slotName: "status",
          },
          {
            label: "查看位置",
            prop: "lnglat",
          },
          {
            label: "操作",
          }
        ],
        url: "/parking/list/"
      },
      // 页码
      total: 0,
      // 当前页码
      currentPage: 1,
      // 请求API的页码
      pageSize: 10,
      pageNumber: 1,
      // 筛选
      form: {
        parking_name: "",
        area: "",
        type: "",
        status: ""
      },
      search_key: "",
      keyword: "",
      // 禁用启用
      parking_status: this.$store.state.config.parking_status,
      // 停车场类型
      parking_type: this.$store.state.config.parking_type,
      // 停车场json
      parking_type_json: this.$store.state.config.parking_type_json,
      // 数据列表
      tableData: [],
      // 地图的显示
      map_show: false,
      parking_data: {},
      table_loading: false
    }
  },
  // 过滤器写法
  filters: {
    // 返回文本的类型
    getType(value) {
      // console.log(_this.parking_type)
      const data = _this.parking_type.filter(item => item.value == value)
      if (data && data.lenth > 0) {
        // 数字0/1 -> 室内室外 ... 封装了
        return data[0].label
      }
    }
  },
  components: { CityArea, MapLocation, TableData },
  methods: {
    callbackComponent(params) {
      if (params.function) {
        this[params.function](params.data)
      }
    },
    // select下拉框的触发
    searchKeySelect(val) {},
    // 请求停车场的列表
    getParkingList() {
      const requestData = {
        pageSize: this.pageSize,
        pageNumber: this.pageNumber
      }
      // 过滤筛选 深拷贝
      const filterData = JSON.parse(JSON.stringify(this.form))
      for (let key in filterData) {
        if (filterData[key]) {
          requestData[key] = filterData[key]
        }
      }
      // 关键字
      if (this.keyword && this.search_key) {
        requestData[this.search_key] = this.keyword
      }
      // console.log("requestData", requestData)
      // const res = ParkingList(requestData)
      // console.log("ParkingList_index", res)
      ParkingList(requestData)
        .then(response => {
          const data = response.data
          // 判断数据是否存在
          if (data) {
            this.tableData = data.data
          }
          // 页码
          if (data.total) {
            this.total = data.total
          }
          this.table_loading = false
        })
        .catch(error => {
          this.table_loading = false
        })
    },
    // 编辑
    edit(id) {
      this.$router.push({
        name: "ParkingAdd",
        query: {
          id: id
        }
      })
    },
    // 点击查看 显示地图
    showMap(data) {
      this.map_show = true
      // parking_data的值 是一行所有的数据
      this.parking_data = data
    },
    // 删除
    delConfirm(id) {
      this.$confirm("确定删除这个信息嘛", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          ParkingDelete({ id }).then(res => {
            this.$message({
              type: "success",
              message: res.message
            })
            this.getParkingList()
          })
        })
        .catch(() => {})
    },
    // 页码
    handleSizeChange(val) {
      this.pageSize = val
      this.getParkingList()
    },
    handleCurrentChange(val) {
      this.pageNumber = val
      this.getParkingList()
    }
  },
  // DOM元素渲染之前（生命周期）
  beforeMount() {
    this.getParkingList()
  },
  // DOM元素渲染完成（生命周期）
  mounted() {}
}
</script>

<style></style>
