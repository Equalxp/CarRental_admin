<template>
  <div>
    <!-- 表格数据 -->
    <TableData ref="table" :config="table_config">
      <!-- 禁启用 -->
      <template v-slot:status="slotData">
        <el-switch :disabled="slotData.data.id == switch_disabled" @change="switchChange(slotData.data)" v-model="slotData.data.status" active-color="#13ce66" inactive-color="#ff4949"> </el-switch>
      </template>
    </TableData>
  </div>
</template>

<script>
// 组件
import TableData from "../../components/tableData/index"
// API
import { OrderWait, OrderOvertime, OrderOver, OrderCancel, OrderReturn } from "@/api/order"
export default {
  name: "Order",
  data() {
    return {
      // 表格配置
      table_config: {
        // 表格的头部
        thead: [
          {
            label: "订单号",
            prop: "order_no"
          },
          {
            label: "状态",
            prop: "order_status",
            type: "function",
            // 返回值
            callback: row => {
              // 取json对象 
              const orderStatus = this.$store.state.config.order_status
              // 没有匹配到配置中json的key
              const status = orderStatus[row.order_status]
              return status ? status.zh : ""
            }
          },
          {
            label: "日期",
            prop: "create_date",
            type: "function",
            callback: row => {
              // 空数据时
              if (!row.create_date) {
                return ""
              }
              // 分割日期 折行
              const dateSplit = row.create_date.split(" ")
              return `${dateSplit[0]} <br/> ${dateSplit[1]}`
            }
          },
          {
            label: "金额",
            prop: "address"
          },
          // 把基本操作封装
          {
            label: "操作",
            type: "operation",
            width: 550,
            default: {
              deleteButton: true,
              editButton: true,
              // 路由跳转到哪
              editButtonLink: "CarsAdd"
            },
            buttonGroup: [
              {
                label: "待取车",
                type: "",
                event: "button",
                handler: data => this.orderWait(data)
              },
              { label: "超时", type: "", event: "button", handler: data => this.orderOvertime(data) },
              { label: "完成", type: "", event: "button", handler: data => this.orderOver(data) },
              { label: "取消", type: "", event: "button", handler: data => this.orderCancel(data) },
              { label: "待还车", type: "", event: "button", handler: data => this.ordrerReturn(data) }
            ]
          }
        ],
        // url列表文件
        url: "orderList",
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
  components: { TableData },
  methods: {
    callbackComponent(params) {
      if (params.function) {
        this[params.function](params.data)
      }
    },
    orderWait(data) {
      OrderWait({
        order_no: data.order_no,
        cars_id: data.cars_id
      }).then(response => {
        this.loadData()
      })
    },
    orderOvertime(data) {
      OrderOvertime({
        order_no: data.order_no,
        cars_id: data.cars_id
      }).then(response => {
        this.loadData()
      })
    },
    orderOver(data) {
      OrderOver({
        order_no: data.order_no,
        cars_id: data.cars_id
      }).then(response => {
        this.loadData()
      })
    },
    orderCancel(data) {
      OrderCancel({
        order_no: data.order_no,
        cars_id: data.cars_id
      }).then(response => {
        this.loadData()
      })
    },
    ordrerReturn(data) {
      OrderReturn({
        order_no: data.order_no,
        cars_id: data.cars_id
      }).then(response => {
        this.loadData()
      })
    },
    // 刷新表格
    loadData() {
      this.$refs.table.requestData()
    }
  },
  // DOM元素渲染之前（生命周期）
  beforeMount() {},
  // DOM元素渲染完成（生命周期）
  mounted() {}
}
</script>

<style lass="scss" scoped></style>
