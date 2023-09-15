<template>
  <div>
    <el-dialog title="新增车辆品牌" :visible.sync="dialogVisible" class="cars-dialog-center" @close="close" @opened="opened" :close-on-click-modal="false">
      <el-form ref="form" :inline="true" :model="form" class="demo-form-inline">
        <el-form-item label="品牌中文" prop="nameCh">
          <el-input v-model="form.nameCh"></el-input>
        </el-form-item>
        <el-form-item label="品牌英文" prop="nameEn">
          <el-input v-model="form.nameEn"></el-input>
        </el-form-item>
        <el-form-item label="LOGO" prop="imgUrl">
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
        </el-form-item>
        <el-form-item label="禁启用" prop="status">
          <el-radio-group v-model="form.status">
            <el-radio v-for="item in radio_disabled" :key="item.id" :label="item.value">
              {{ item.label }}
            </el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item>
          <el-button type="danger" @click="submit">确定</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import { BrandLogo, BrandAdd, BrandDetailed, BrandEdit } from "@/api/brand"
export default {
  name: "",
  components: {},
  data() {
    return {
      // dialog
      dialogVisible: false,
      form: {
        nameCh: "",
        nameEn: "",
        imgUrl: "",
        status: "",
        content: ""
      },
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
      // 没有数据时
      BrandLogo().then(response => {
        const data = response.data
        if (data) {
          this.logo = data
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
      this.form = this.data
      this.logo_current = this.data.imgUrl
      this.form.imgUrl = this.data.imgUrl
    },
    // 提交
    submit() {
      // 用id判断是修改还是添加
      this.data.id ? this.edit() : this.add()
    },
    // 添加
    add() {
      this.form.imgUrl = this.logo_current
      BrandAdd(this.form).then(response => {
        // console.log("BrandAdd", response)
        this.$message({
          type: "success",
          message: response.message
        })
        // 清空数据回显
        this.reset("form")
      })
    },
    // 修改
    edit() {
      //  深拷贝form 修改表单
      this.form.imgUrl = this.logo_current
      const requestData = JSON.parse(JSON.stringify(this.form))
      // requestData.id = this.id
      // 发请求
      BrandEdit(requestData).then(res => {
        console.log("BrandEdit", res)
        this.$message({
          type: "success",
          message: response.message
        })
        this.reset("form")
      })
    },
    // 重置表单
    reset(formName) {
      this.$refs[formName].resetFields()
      // 清除选中的LOGO
      this.logo_current = ""
    },
    // 反向修改
    close() {
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
