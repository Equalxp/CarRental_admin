// 封装富文本
<template>
  <div ref="editorDom"></div>
</template>

<script>
// 富文本编辑器
import Editor from "wangeditor"
export default {
  name: "",
  components: {},
  mounted() {
    this.editor = new Editor(this.$refs.editorDom)
    this.editor.customConfig.onchange = html => {
      // 数据反向传输
      this.$emit("update:content", html)
    }
    this.editor.create() // 创建富文本实例
  },
  props: {
    isClear: {
      type: Boolean,
      default: false
    },
    value: {
      type: String,
      default: ""
    }
  },
  // 监听
  watch: {
    // isClear的值 发生变化就清除掉
    isClear: {
      handler() {
        this.editor.txt.clear()
      }
    },
    value: {
      handler(newValue) {
        this.editor.txt.html(newValue)
      }
    }
  }
}
</script>

<style></style>
