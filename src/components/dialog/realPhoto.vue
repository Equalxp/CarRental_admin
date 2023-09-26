<template>
  <el-dialog :title="title" :visible.sync="dialogVisible" class="cars-dialog-center" @close="close" @opened="opened" :close-on-click-modal="false" width="20%">
    <template v-if="img.length > 0">
      <img v-for="item in img" :key="item" :src="item" alt="" class="img-list" />
    </template>
  </el-dialog>
</template>

<script>
export default {
  name: "",
  components: {},
  // 接收的props
  props: {
    title: {
      type: String,
      default: ""
    },
    flagVisible: {
      type: Boolean,
      default: false
    },
    // 子组件接收到父组件请求后发的数据
    data: {
      type: Object,
      defult: () => {}
    }
  },
  data() {
    return {
      dialogVisible: false,
      img: []
    }
  },
  methods: {
    opened() {},
    // 拿数据往里push
    getPhoto() {
      const imgArr = []
      for (let key in this.data) {
        if (this.data[key]) {
          imgArr.push(this.data[key])
        }
      }
      // img在upload中渲染
      this.img = imgArr
    },
    close() {
      // 关闭窗口
      this.dialogVisible = false
      this.$emit("update:flagVisible", false) // {}
    }
  },
  watch: {
    flagVisible: {
      handler(newValue, oldValue) {
        this.dialogVisible = newValue
      }
    },
    // 监听数据 触发函数
    data: {
      handler(newValue, oldValue) {
        this.getPhoto()
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.img-list {
  width: 100%;
  margin-bottom: 20px;
}
</style>
