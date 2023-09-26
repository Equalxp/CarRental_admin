<template>
  <el-upload class="avatar-uploader" action="http://up-z1.qiniup.com" :show-file-list="false" :on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload" :data="uploadData">
    <img v-if="imageUrl" :src="imageUrl" class="avatar" />
    <i v-else class="el-icon-plus avatar-uploader-icon"></i>
  </el-upload>
</template>

<script>
import { GetQiniuToken } from "@/api/common"

export default {
  name: "Upload",
  components: {},
  data() {
    return {
      imageUrl: "",
      uploadData: {
        token: ""
      }
    }
  },
  beforeMount() {
    this.requestFlag && this.getQiniuToken()
  },
  methods: {
    // 获取qiniu token
    getQiniuToken() {
      const requestData = {
        ak: "dCUuxdnKZQ3Vp8kLwgort9HlOuKEetgVcZPv22so",
        sk: "KAPTFxQkTxnI2dznxKU99s9EuXnbu5OVt4aDDZf3",
        buckety: "car-rental-0"
      }
      GetQiniuToken(requestData).then(res => {
        const data = res.data
        if (data.token) {
          this.$store.commit("common/SET_UPLOAD_TOKEN", data.token)
        }
        // console.log("GetQiniuToken", this.uploadData.token)
      })
    },
    // on-success 文件上传成功的钩子
    handleAvatarSuccess(res, file) {
      // console.log('handleAvatarSuccess',file);
      this.imageUrl = `http://s1ajfxhu4.hb-bkt.clouddn.com/${res.key}`
      this.$emit("update:value", this.imageUrl)
    },
    // before-upload 文件上传之前的钩子
    beforeAvatarUpload(file) {
      const isJPG = file.type === "image/jpeg"
      const isLt2M = file.size / 1024 / 1024 < 2
      if (!isJPG) {
        this.$message.error("上传头像图片只能是 JPG 格式!")
      }
      if (!isLt2M) {
        this.$message.error("上传头像图片大小不能超过 2MB!")
      }
      let fileName = file.name
      // 转码
      let key = encodeURI(fileName)
      this.uploadData.key = key
      this.uploadData.token = this.$store.state.common.upload_token
      // console.log(file);
      return isJPG && isLt2M
    }
  },
  // props接收的静态数据 不能反向修改
  props: {
    imgUrl: {
      type: String,
      default: ""
    },
    requestFlag: {
      type: Boolean,
      default: false
    }
  },
  watch: {
    imgUrl: {
      handler(newValue) {
        if (newValue) {
          this.imageUrl = newValue
        }
      }
    }
  }
}
</script>

<style lang="scss"></style>
