<template>
  <div>
    <!-- 表格数据 -->
    <TableData ref="table" :config="table_config">
      <!-- 操作 -->
      <template v-slot:realPhoto="slotData">
        <img :src="realPhoto" alt="" class="real-photo" @click="showPhoto(slotData)" />
      </template>
    </TableData>
    <RealPhoto :flagVisible.sync="dialog_show" :data="data_photo" :title="title" @callbackComponent="callbackComponent"></RealPhoto>
  </div>
</template>

<script>
// API
import { UpdateRealName, Blacklist, Photo, AmountClear } from "@/api/member"
// 组件
import TableData from "../../components/tableData/index"
import RealPhoto from "@c/dialog/realPhoto"
export default {
  name: "Member",
  components: {
    TableData,
    RealPhoto
  },
  data() {
    return {
      // 弹窗的标题
      title: "",
      realPhoto: require("@/assets/logo.png"),
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
          // {
          //   label: "押金",
          //   prop: "gilding"
          // },
          // {
          //   label: "余额",
          //   prop: "amount"
          // },
          {
            label: "实名认证",
            prop: "check_real_name",
            type: "switch",
            slotName: "realPhoto",
            handler: (status, data, type) => {
              this.updateReal(status, data, "identity")
            }
          },
          {
            label: "驾驶证",
            prop: "check_cars",
            type: "function",
            type: "switch",
            slotName: "realPhoto",
            handler: (status, data) => {
              this.updateReal(status, data, "drive")
            }
          },
          {
            label: "黑名单",
            prop: "blacklist",
            type: "switch",
            handler: (status, data) => {
              this.updateBlacklist(status, data)
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
      // 图片
      data_photo: {},
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
    },
    // 修改实名认证 | 驾驶证件
    updateReal(status, data, type) {
      // console.log("updateReal", status, data, type)
      const requestData = {
        status,
        id: data.memberId,
        type: type
      }
      UpdateRealName(requestData).then(response => {
        const data = response
        this.$message({
          message: response.message,
          type: "success"
        })
      })
    },
    // 黑名单
    updateBlacklist(status, data) {
      const requestData = {
        status,
        id: data.memberId
      }
      Blacklist(requestData).then(response => {
        const data = response
        this.$message({
          message: response.message,
          type: "success"
        })
      })
    },
    // 图片
    showPhoto(data) {
      const type = data.type
      // 更新弹窗标题
      this.title = type === "check_cars" ? "驾驶证" : "实名认证"
      // 接口
      const requestData = {
        id: data.data.memberId,
        type: type === "check_cars" ? "drive" : "identity"
      }
      // 点击之后发请求 传数据到子组件
      Photo(requestData).then(response => {
        console.log("Photo", response.data)
        const data = response.data
        if (data) {
          // data_photo是请求来的
          this.data_photo = data
          this.dialog_show = true
        }
      })
    }
  }
}
</script>

<style lass="scss" scoped>
.real-photo {
  display: inline;
  width: 30px;
  margin-left: 5px;
  vertical-align: middle;
  cursor: pointer;
}
</style>
