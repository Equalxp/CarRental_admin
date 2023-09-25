<template>
  <div>
    <!-- 弹出框 -->
    <el-dialog title="新增租车类型" width="30%" :visible.sync="dialogVisible" class="cars-dialog-center" @close="close" @opened="opened" :close-on-click-modal="false">
      <VueForm ref="vuForm" :formData="form_data" :formItem="form_item" :formHandler="form_handler"> </VueForm>
    </el-dialog>
  </div>
</template>

<script>
// 组件
import VueForm from "@c/form"
// API
import { LeaseAdd, LeaseEdit } from "@/api/lease"
export default {
  name: "",
  components: {
    VueForm
  },
  props: {
    flagVisible: {
      type: Boolean,
      default: false
    },
    data: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      // dialog
      dialogVisible: false,
      // 表单数据
      form_data: {
        carsLeaseTypeName: "",
        carsLeaseStatus: "",
        carsLeaseDesc: ""
      },
      // 表单项
      form_item: [
        { type: "Input", label: "租车类型", prop: "carsLeaseTypeName", required: true },
        { type: "Disabled", label: "禁/启状态", prop: "carsLeaseStatus", required: true },
        { type: "Textarea", label: "描述", prop: "carsLeaseDesc" }
      ],
      // 表单按钮
      form_handler: [
        {
          label: "确定",
          key: "submit",
          type: "danger",
          handler: () => this.submit()
        }
      ],
      // 状态
      radio_disabled: this.$store.state.config.radio_disabled,
      // 选中的LOGO
      logo_current: "",
      // logo
      logo: []
    }
  },
  methods: {
    opened() {},
    submit() {
      this.$refs.vuForm.$refs.form.validate(valid => {
        if (valid) {
          this.form_data.carsLeaseTypeId ? this.edit() : this.add()
        } else {
          console.log("error submit!!")
          return false
        }
      })
    },
    // 添加
    add() {
      // 带数据发请求
      LeaseAdd({ ...this.form_data }).then(response => {
        this.$message({
          message: response.message,
          type: "success"
        })
        // 取反 table_loadData_flag 发请求
        this.$store.commit("common/SET_TABL_DATA_FLAG")
        this.reset()
      })
    },
    // 编辑
    edit() {
      LeaseEdit({ ...this.form_data }).then(response => {
        // 扩展指定对象的所有 key
        this.$message({
          message: response.message,
          type: "success"
        })
        this.$store.commit("common/SET_TABL_DATA_FLAG")
        this.close()
      })
    },
    // 重置表单
    reset(formName) {
      this.$refs.vuForm.resetForm()
    },
    close() {
      this.reset("form")
      // 关闭窗口
      this.dialogVisible = false
      // 删除ID
      delete this.form_data.carsLeaseTypeId
      this.$emit("update:flagVisible", false) // {}
    }
  },
  watch: {
    // 监听
    flagVisible: {
      handler(newValue) {
        // 不能改到父组件传来的props
        this.dialogVisible = newValue
      }
    },
    data: {
      handler(newValue) {
        // this.form_data.typeValue = newValue.value
        // console.log(2222)
        this.form_data = newValue
        /** 两个 bug */
      }
    }
  }
}
</script>

<style></style>
