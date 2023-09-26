<template>
  <div>
    <!-- 表格数据 -->
    <TableData ref="table" :config="table_config">
      <!-- 操作 -->
      <template v-slot:operation="slotData">
        <!-- 直接传递数据 -->
        <el-button size="small" type="primary" :disabled="!slotData.data.blacklist">黑名单</el-button>
      </template>
    </TableData>
  </div>
</template>

<script>
// API
import TableData from "../../components/tableData/index"
export default {
  name: "Member",
  components: {
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
            label: "用户名",
            prop: "username",
            width: 150
          },
          {
            label: "真实姓名",
            prop: "truename",
            width: 150
          },
          {
            label: "租车订单",
            prop: "order",
            width: 150
          },
          {
            label: "违章预存金",
            prop: "illegalAmount",
            width: 200
          },
          {
            label: "实名认证",
            prop: "check_real_name",
            type: "function",
            callback: row => {
              return row.check_real_name ? "已认证" : "-"
            }
          },
          {
            label: "驾驶证",
            prop: "check_cars",
            type: "function",
            callback: row => {
              return row.check_cars ? "已认证" : "-"
            }
          },
          {
            label: "黑名单",
            prop: "blacklist",
            type: "function",
            callback: row => {
              return row.blacklist ? "是" : "-"
            }
          },
          {
            label: "操作",
            type: "operation",
            width: 300,
            buttonGroup: [
              { event: "link", label: "详情", type: "primary", name: "MemberDetailed", key: "id", value: "memberId" },
              { event: "link", label: "编辑", type: "primary", name: "MemberInfo", key: "id", value: "memberId" }
            ],
            default: {
              deleteButton: true,
              deleteKey: "memberId"
            },
            slotName: "operation"
          }
        ],
        // url列表文件 loadData会半默认请求这个
        url: "memberList",
        data: {
          pageSize: 10,
          pageNumber: 1
        },
        form_item: [
          {
            label: "关键字",
            type: "Keyword",
            // 筛选项
            options: ["username", "truename", "card_id"]
          }
        ],

        form_config: {
          resetButton: true
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
    // 函数
    callbackComponent(params) {
      console.log(params)
      if (params.function) {
        this[params.function]()
      }
    },
    edit(data) {
      // this.data_brand = data
      this.data_brand = Object.assign({}, data)
      // console.log("dialog_show", this.dialog_show)
      this.dialog_show = true
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
    }
  }
}
</script>

<style></style>
