<template>
  <div class="parking-add">
    <VueForm ref="vuForm" :formData="form_data" :formItem="form_item" :formHandler="form_handler" labelWidth="150px"> </VueForm>
  </div>
</template>

<script>
// API
import { Detailed, Edit } from "@/api/member"
// utils
import { formatRequestData } from "@/utils/format"
// 组件
import VueForm from "@c/form/index"
export default {
  name: "ParkingAdd",
  data() {
    return {
      id: this.$route.query.id,
      // 表单数据配置
      form_data: {
        // 指定对象里面的所以 key
        username: "",
        truename: "",
        cardId: "",
        gender: "",
        illegalAmount: "",
        cardPhotoFace: "",
        cardPhotoBack: "",
        cardPhotoBareheaded: "",
        carsPhotoFace: "",
        carsPhotoBack: "",
        blacklist: ""
      },
      // 表单配置
      form_item: [
        {
          type: "Input",
          label: "用户名",
          placeholder: "请输入用户名",
          prop: "username",
          required: true,
          width: "200px"
        },
        {
          type: "Input",
          label: "真实姓名",
          placeholder: "请输入真实姓名",
          prop: "truename",
          required: true
        },
        {
          type: "Input",
          label: "身份证",
          placeholder: "请输入身份证",
          prop: "cardId",
          required: true
        },
        {
          type: "Radio",
          label: "性别",
          prop: "gender",
          options: this.$store.state.config.gender,
          required: true
        },
        {
          type: "InputNumber",
          label: "违章预存金",
          prop: "illegalAmount",
          required: true
        },
        {
          type: "Upload",
          label: "身份证（正面）",
          prop: "cardPhotoFace",
          required: true,
          requestFlag: true
        },
        {
          type: "Upload",
          label: "身份证（反面）",
          prop: "cardPhotoBack",
          required: true
        },
        {
          type: "Upload",
          label: "身份证（免冠）",
          prop: "cardPhotoBareheaded",
          required: true
        },
        {
          type: "Upload",
          label: "驾驶证（正面）",
          prop: "carsPhotoFace",
          required: true
        },
        {
          type: "Upload",
          label: "驾驶证（反面）",
          prop: "carsPhotoBack",
          required: true
        },
        {
          type: "Radio",
          label: "黑名单",
          prop: "blacklist",
          options: this.$store.state.config.blacklist,
          required: true
        }
      ],
      form_handler: [
        {
          label: "确定",
          key: "submit",
          type: "danger",
          handler: () => this.formValidate()
        },
        {
          label: "重置",
          key: "reset"
        }
      ],
      // 按钮加载
      button_loading: false
    }
  },
  methods: {
    // 表单验证
    formValidate() {
      this.$refs.vuForm.$refs.form.validate(valid => {
        if (valid) {
          this.id && this.editMember()
        } else {
          console.log("error submit!!")
          return false
        }
      })
    },
    // 父子组件之间
    callbackComponent(params) {
      // 子组件传来的函数名  例如:{ function: "mapLoad" } getLnglat
      console.log("callbackComponent", params.data)
      if (params.function) {
        // 给this上加一个函数
        this[params.function](params.data)
      }
    },
    // 获取详情
    detailed() {
      Detailed({ id: this.id }).then(response => {
        const data = formatRequestData(this.form_data, response.data)
        data && (this.form_data = data)
      })
    },
    // 编辑
    editMember() {
      Edit({ ...this.form_data, id: this.id })
        .then(res => {
          console.log("editMember", res)
          this.$message({
            type: "success",
            message: res.message
          })
          this.$router.push({
            name: "MemberList"
          })
          // this.$router.go(-1);
        })
        .catch(error => {
          this.$message({
            type: "error",
            message: res.message
          })
        })
    }
  },
  beforeMount() {
    this.id & this.detailed()
  },
  components: {
    VueForm
  }
}
</script>

<style lang="scss" scoped>
.address-map {
  width: 100%;
  height: 500px;
}
</style>
