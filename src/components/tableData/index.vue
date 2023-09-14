<template>
  <div>
    <el-table :data="table_data" border style="width: 100%">
      <!-- selection框 -->
      <el-table-column v-if="table_config.checkbox" type="selection" width="35"></el-table-column>
      <template v-for="item in this.table_config.thead">
        <!-- 回调渲染 -->
        <el-table-column v-if="item.type === 'function'" :key="item.prop" :prop="item.prop" :label="item.label">
          <template slot-scope="scope">
            <span v-html="item.callback && item.callback(scope.row, item.prop)"></span>
          </template>
        </el-table-column>
        <!-- 插槽的渲染 -->
        <el-table-column v-else-if="item.type === 'slot'" :key="item.prop" :prop="item.prop" :label="item.label">
          <template slot-scope="scope">
            <!-- 具名插槽 slot等着template带v-slot名字填进来 -->
            <slot :name="item.slotName" :data="scope.row"></slot>
          </template>
        </el-table-column>
        <!-- 纯文本渲染 -->
        <el-table-column v-else :key="item.prop" :prop="item.prop" :label="item.label"></el-table-column>
      </template>
    </el-table>
  </div>
</template>
<script>
// API
import { GetTableData } from "@/api/common"
export default {
  name: "TableComponent",
  data() {
    return {
      // tableData
      table_data: [],
      // 父组件
      table_config: {
        thead: [],
        checkbox: true,
        url: "",
        pagination: true,
        data: {}
      },
      // 页码
      total: 0,
      // 当前页码
      pagination: 1
    }
  },
  beforeMount() {},
  methods: {
    initConfig() {
      for (let key in this.config) {
        // 只有传来的才添加进去
        if (Object.keys(this.table_config).includes(key)) {
          this.table_config[key] = this.config[key]
        }
      }
      // 配置完成后开始读取接口数据
      this.loadData()
    },
    loadData() {
      // 发请求的数据
      let requestData = {
        url: this.table_config.url,
        data: {
          pageSize: 10,
          pageNumber: 1
        }
      }
      // 去发请求
      GetTableData(requestData).then(response => {
        const data = response.data
        console.log("GetTableData", response.data)
        // 判断数据是否存在
        if (data) {
          this.table_data = data.data
        }
      })
    }
  },
  props: {
    config: {
      type: Object,
      default: () => {}
    }
  },
  // watch检查数据
  watch: {
    config: {
      handler(newValue) {
        this.initConfig()
      },
      immediate: true
    }
  }
}
</script>
<style lang="scss" scoped></style>
