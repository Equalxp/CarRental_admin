<template>
  <el-form ref="form" :model="formData" :label-width="labelWidth">
    <el-form-item v-for="item in formItem" :key="item.prop" :label="item.label" :prop="item.prop" :rules="item.rules">
      <!-- Input-->
      <el-input v-if="item.type === 'Input'" v-model.trim="formData[item.prop]" :placeholder="item.placeholder" :style="{ width: item.width }" :disabled="item.disabled"></el-input>
      <!-- 文本-->
      <!-- Input-->
      <el-input type="textarea" :rows="item.rows || 5" v-if="item.type === 'Textarea'" v-model.trim="formData[item.prop]" :placeholder="item.placeholder" :style="{ width: item.width }" :disabled="item.disabled"></el-input>
      <!-- Select -->
      <el-select filterable v-if="item.type === 'Select'" :aaaa="item.options" v-model.trim="formData[item.prop]" :placeholder="item.placeholder" :style="{ width: item.width }" :disabled="item.disabled">
        <el-option v-for="selectItem in item.options" :key="selectItem.value || selectItem[item.select_vlaue]" :value="selectItem.value || selectItem[item.select_vlaue]" :label="selectItem.label || selectItem[item.select_label]"> </el-option>
      </el-select>
      <!-- 禁启用 -->
      <el-radio-group v-if="item.type === 'Disabled'" v-model="formData[item.prop]">
        <el-radio v-for="radio in radio_disabled" :label="radio.value" :key="radio.value">{{ radio.label }}</el-radio>
      </el-radio-group>
      <!-- 插槽 -->
      <slot v-if="item.type === 'Slot'" :name="item.slotName" />
      <!-- Radio -->
      <el-radio-group v-if="item.type === 'Radio'" v-model="formData[item.prop]">
        <el-radio v-for="radio in item.options" :label="radio.value" :key="radio.value">{{ radio.label }}</el-radio>
      </el-radio-group>
      <!-- 富文本编辑器 -->
      <template v-if="item.type === 'Wangeditor'">
        <!--  -->
        <Wangeditor :content.sync="formData[item.prop]" :isClear="wangeditorClear" ref="wangeditor" :value="formData[item.prop]" />
      </template>
      <!-- Upload组件 -->
      <template v-if="item.type === 'Upload'">
        <!--  -->
        <Upload :imgUrl="formData[item.prop]" :value.sync="formData[item.prop]"></Upload>
      </template>
    </el-form-item>
    <!-- 按钮 -->
    <el-form-item>
      <el-button v-for="item in formHandler" :key="item.key" :type="item.type" @click="item.handler && item.handler()">
        {{ item.label }}
      </el-button>
    </el-form-item>
  </el-form>
</template>
<script>
// 省市区
import CityArea from "@c/common/cityArea"
// 富文本
import Wangeditor from "@c/common/wangeditor"
// upload
import Upload from "@c/upload/index"
export default {
  name: "Form",
  components: { CityArea, Wangeditor, Upload },
  // porps父组件传参数
  props: {
    labelWidth: {
      type: String,
      default: "120px"
    },
    formData: {
      type: Object,
      default: () => {}
    },
    formItem: {
      type: Array,
      default: () => []
    },
    // 按钮
    formHandler: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      // 禁启用数据
      radio_disabled: this.$store.state.config.radio_disabled,
      type_msg: {
        "Input": "请输入",
        "Radio": "请选择",
        "Select": "请选择",
        "Disabled": "请选择"
      },
      // 清除富文本 true/false
      wangeditorClear: false
    }
  },
  methods: {
    // 重置表单
    resetForm() {
      // 清除其他文本
      this.$refs.form.resetFields()
      // 清除富文本内容
      if (this.$refs.Wangeditor) {
        this.wangeditorClear = !this.wangeditorClear
      }
    },
    initFormData() {
      this.formItem.forEach(item => {
        if (item.required) {
          this.rules(item)
        }
        // 自定义检验规则
        if (item.validator) {
          item.rules = item.validator
          console.log("自定义检验规则", item.rules)
        }
      })
    },
    // 外面调用this.$refs.vueForm.$refs.form然后再调用rules 验证方法
    rules(item) {
      // 是否是必填项
      const requiredRules = [{ required: true, message: item.required_msg || `${this.type_msg[item.type]}${item.label}`, trigger: "change" }]
      // 其他规则
      if (item.rules && item.rules.length > 0) {
        // 拼接数组规则
        item.rules = requiredRules.concat(item.rules)
      } else {
        item.rules = requiredRules
      }
    }
  },
  watch: {
    formItem: {
      handler(newValue) {
        this.initFormData()
      },
      immediate: true
    }
  }
}
</script>
<style lang="scss" scoped></style>
