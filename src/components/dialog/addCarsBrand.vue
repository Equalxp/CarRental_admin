<template>
  <div>
    <el-dialog title="新增车辆品牌" :visible.sync="dialogVisible" class="cars-dialog-center" @close="close" @opened="opened" :close-on-click-modal="false">
      <VueForm ref="vuForm" :formData="form_data" :formItem="form_item" :formHandler="form_handler">
        <template v-slot:logo>
          <div class="upload-img-wrap">
            <div class="upload-img">
              <img v-show="logo_current" :src="logo_current" />
            </div>
            <ul class="img-list">
              <li v-for="item in logo" :key="item.id" @click="logo_current = item.img">
                <img :src="item.img" :alt="item.name" />
              </li>
            </ul>
          </div>
        </template>
        <template> </template>
      </VueForm>
    </el-dialog>
  </div>
</template>

<script>
// 组件
import VueForm from "@c/form"
import { BrandLogo, BrandAdd, BrandDetailed, BrandEdit } from "@/api/brand"
export default {
  name: "",
  components: {
    VueForm
  },
  data() {
    return {
      // dialog
      dialogVisible: false,
      // 表单数据
      form_data: {
        nameCh: "",
        nameEn: "",
        imgUrl: "",
        status: "",
        content: ""
      },
      // 表单项
      form_item: [
        {
          type: "Input",
          label: "品牌中文",
          placeholder: "输入品牌中文",
          prop: "nameCh"
        },
        {
          type: "Input",
          label: "品牌英文",
          placeholder: "输入品牌英文",
          prop: "nameEn"
        },
        {
          type: "Radio",
          label: "禁启用",
          prop: "status",
          options: this.$store.state.config.radio_disabled
        },
        {
          type: "Slot",
          slotName: "logo",
          label: "logo"
        }
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
  props: {
    flagVisible: {
      type: Boolean,
      default: false
    },
    data: {
      // type: String,
      // defult: ""
      type: Object,
      default: () => {}
    }
  },
  methods: {
    opened() {
      this.getBrandLogo()
      this.getDetailed()
    },
    // 获取LOGO
    getBrandLogo() {
      // 存在数据时，不再请求接口
      if (this.logo.length != 0) {
        return false
      }
      // 单独请求logo图片
      BrandLogo().then(response => {
        const data = response.data
        console.log("BrandLogo", data)
        if (data) {
          this.logo = data
          this.logo[0].img = "https://c-ssl.duitang.com/uploads/blog/201506/18/20150618142354_AVLNm.jpeg"
        }
      })
    },
    // // 获取详情 调用接口
    // getDetailed() {
    //   // 根据id请求
    //   BrandDetailed({ id: this.id }).then(res => {
    //     const data = res.data
    //     console.log("BrandDetailed", data)
    //     if (data) {
    //       this.form = data
    //       this.logo_current = data.imgUrl
    //     }
    //   })
    // },
    getDetailed() {
      // console.log("不用接口", this.data)
      // 请求到的数据 直接赋值
      this.form_data = this.data
      this.logo_current = this.data.imgUrl
      this.form_data.imgUrl = this.data.imgUrl
      // console.log("urlurlurlurlurl", this.data.imgUrl)
    },
    // 提交
    submit() {
      // 用id判断是修改还是添加
      this.data.id ? this.edit() : this.add()
    },
    // 添加
    add() {
      this.form_data.imgUrl = this.logo_current
      BrandAdd(this.form_data).then(response => {
        // console.log("BrandAdd", response)
        this.$message({
          type: "success",
          message: response.message
        })
        this.close()
        this.$emit("callbackComponent", {
          function: "search"
        })
      })
    },
    // 修改
    edit() {
      //  深拷贝form 修改表单
      this.form_data.imgUrl = this.logo_current
      const requestData = JSON.parse(JSON.stringify(this.form_data))
      // requestData.id = this.id
      // 发请求
      BrandEdit(requestData).then(res => {
        // console.log("BrandEdit", res)
        this.$message({
          type: "success",
          message: res.message
        })
        this.close()
        this.$emit("callbackComponent", {
          function: "search"
        })
      })
      // 请求成功之后都要刷新列表 再次请求列表数据
    },
    // 重置表单
    reset(formName) {
      for (let key in this.form_data) {
        this.form_data[key] = ""
      }
      // 清除选中的LOGO
      this.logo_current = ""
    },
    // 反向修改
    close() {
      this.reset("form")
      // 关闭窗口
      this.dialogVisible = false
      this.$emit("update:flagVisible", false)
    }
  },
  watch: {
    // 监听
    flagVisible: {
      handler(newValue, oldValue) {
        // 不能改到父组件传来的props
        this.dialogVisible = newValue
      }
    }
  }
}
</script>

<style></style>
