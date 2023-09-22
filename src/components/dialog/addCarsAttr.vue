<template>
  <div>
    <!-- 弹出框 -->
    <el-dialog title="车辆自定义属性添加" width="30%" :visible.sync="dialogVisible" class="cars-dialog-center" @close="close" @opened="opened" :close-on-click-modal="false">
      <VueForm ref="vuForm" :formData="form_data" :formItem="form_item" :formHandler="form_handler"> </VueForm>
    </el-dialog>
  </div>
</template>

<script>
// 组件
import VueForm from "@c/form"
// API
import { CarsTypeAdd } from "@/api/carsAttr"
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
        key: "",
        value: "",
        typeValue: ""
      },
      // 表单项
      form_item: [
        { type: "Input", label: "当前属性", prop: "typeValue", disabled: true },
        { type: "Input", label: "字段", prop: "key" },
        { type: "Input", label: "文本", prop: "value" }
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
      this.add()
    },
    // 添加
    add() {
      const requestData = {
        typeId: this.data.id,
        key: this.form_data.key,
        value: this.form_data.value
      }
      CarsTypeAdd(requestData).then(res => {
        this.$message({
          message: res.message,
          type: "success"
        })
        this.reset()
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
        this.form_data.typeValue = newValue.value
      }
    }
  }
}
</script>

<style></style>
