<template>
  <div>
    <FormSearch v-if="table_config.search_form" :formItme="table_config.form_item" :formHandler="table_config.form_handler" :formConfig="table_config.form_config" @callbackComponent="callbackComponent" />
    <slot name="content"></slot>
    <el-table v-loading="loading_table" element-loading-text="加载中" :data="table_data" border style="width: 100%">
      <!-- selection框 -->
      <el-table-column v-if="table_config.checkbox" type="selection" width="35"></el-table-column>
      <template v-for="item in this.table_config.thead">
        <!-- 回调渲染 -->
        <el-table-column v-if="item.type === 'function'" :key="item.prop" :prop="item.prop" :label="item.label" :width="item.width">
          <template slot-scope="scope">
            <!-- scope表示这一行所有的数据的键值 -->
            <!-- {{ scope.row }} -->
            <span v-html="item.callback && item.callback(scope.row, item.prop)"></span>
          </template>
        </el-table-column>
        <!-- 插槽的渲染  -->
        <el-table-column v-else-if="item.type === 'slot'" :key="item.prop" :prop="item.prop" :label="item.label" :width="item.width">
          <template slot-scope="scope">
            <!-- 具名插槽 slot等着template带v-slot名字填进来   -->
            <slot :name="item.slotName" :data="scope.row"></slot>
          </template>
        </el-table-column>
        <!-- switch -->
        <el-table-column v-else-if="item.type === 'switch'" :key="item.prop" :prop="item.prop" :label="item.label" :width="item.width">
          <template slot-scope="scope">
            <el-switch @change="item.handler && item.handler($event, scope.row)" v-model="scope.row[item.prop]" :active-value="item.on || true" :inactive-value="item.off || false" active-color="#13ce66" inactive-color="#ff4949"> </el-switch>
            <slot :name="item.slotName" :data="scope.row" :type="item.prop"></slot>
          </template>
        </el-table-column>
        <!-- 图片显示 -->
        <el-table-column v-else-if="item.type === 'image'" :key="item.prop" :prop="item.prop" :label="item.label" :width="item.width">
          <template slot-scope="scope">
            <img :src="scope.row[item.prop]" :width="item.imgWidth || 50" alt="" />
            <!-- <img src="./logo.png" :width="item.imgWidth || 50" height="50" alt="" /> -->
            <!-- <img src="scope.row.imgUrl" :width="scope.row.imgWidth || 50" alt="" /> -->
          </template>
        </el-table-column>
        <!-- 操作 -->
        <el-table-column v-else-if="item.type === 'operation'" :key="item.prop" :prop="item.prop" :label="item.label" :width="item.width">
          <template slot-scope="scope">
            <!-- 按钮组 -->
            <template v-if="item.buttonGroup && item.buttonGroup.length > 0">
              <!-- 循环出button按钮 -->
              <template v-for="button in item.buttonGroup">
                <!-- 事件 -->
                <el-button v-if="button.event === 'button'" :type="button.type" :key="button.id" @click="button.handler && button.handler(scope.row)" size="small">
                  {{ button.label }}
                </el-button>
                <!-- 路由跳转 -->
                <router-link v-if="button.event === 'link'" :key="button.id" :to="{ name: button.name, query: { [button.key]: scope.row[button.value || 'id'] } }" class="mr-10">
                  <el-button :type="button.type" size="small">{{ button.label }}</el-button>
                </router-link>
              </template>
            </template>
            <!--额外-->
            <slot v-if="item.slotName" :name="item.slotName" :data="scope.row"></slot>
            <!--删除-->
            <el-button type="danger" size="small" v-if="item.default && item.default.deleteButton" :loading="scope.row[item.default.deleteKey || 'id'] == rowId" @click="delConfirm(scope.row[item.default.deleteKey || 'id'])">
              删除
            </el-button>
            <!-- <el-button type="danger" size="small" v-if="item.default && item.default.deleteButton" :loading="scope.row.id == rowId" @click="delConfirm(scope.row.id)">删除</el-button> -->
          </template>
        </el-table-column>
        <!-- 纯文本渲染 -->
        <el-table-column v-else :key="item.prop" :prop="item.prop" :label="item.label" :width="item.width"></el-table-column>
      </template>
    </el-table>
    <el-row class="padding-top-30">
      <el-col :span="4"><div style="padding: 5px;"></div></el-col>
      <el-col :span="20">
        <el-pagination v-if="table_config.pagination" class="pull-right" background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage" :page-sizes="[10, 20, 50, 100]" :page-size="10" layout="total, sizes, prev, pager, next, jumper" :total="total">
        </el-pagination>
      </el-col>
    </el-row>
  </div>
</template>
<script>
// 组件
import FormSearch from "../formSearch/index.vue"
// API
import { GetTableData, Delete } from "@/api/common"
// API
// import { CarsDelete } from "@/api/cars"
export default {
  name: "TableComponent",
  components: {
    FormSearch
  },
  data() {
    return {
      // 表格加载提示 请求完之后就不用加载了
      loading_table: false,
      // tableData
      table_data: [],
      // 父组件
      table_config: {
        // 初始化是否请求接口
        isRequest: true,
        thead: [],
        checkbox: true,
        url: "",
        pagination: true,
        data: {},
        // 搜索区域的显示
        search_form: true,
        // form
        form_item: [],
        form_handler: [],
        form_config: {
          resetButton: false
        }
      },
      // 页码
      total: 0,
      // 当前页码
      currentPage: 1,
      // rowId
      rowId: "",
      form_data: {}
    }
  },
  beforeMount() {},
  methods: {
    callbackComponent(params) {
      this[params.function](params.data)
    },
    search(data) {
      const searchData = data
      searchData.pageNumber = 1
      searchData.pageSize = 10
      this.requestData(searchData)
    },
    initConfig() {
      // this.conifg是父组件props传的
      for (let key in this.config) {
        // 只有传来的才添加进去
        if (Object.keys(this.table_config).includes(key)) {
          this.table_config[key] = this.config[key]
        }
      }
      // 配置完成后开始读取接口数据
      this.table_config.isRequest && this.loadData()
    },
    // 发请求的数据
    loadData() {
      let requestData = {
        url: this.table_config.url,
        data: this.table_config.data
      }
      // 请求之前跑
      this.loading_table = true
      // 去发请求 封装好的
      GetTableData(requestData)
        .then(response => {
          const data = response.data
          // console.log("GetTableData", response.data)
          // 判断数据是否存在
          if (data) {
            this.table_data = data.data
          }
          // 页码
          this.$nextTick(() => {
            // 考虑到DOM元素渲染完成时候
          })
          // 页面
          this.total = data.total
          // 请求完成之后
          this.loading_table = false
        })
        .catch(error => {
          this.loading_table = false
        })
    },
    // 给父组件调用的方法
    requestData(params = "") {
      if (params) {
        // 处理业务逻辑 传来的id...
        this.table_config.data = params
      }
      this.loadData()
    },
    // 页码
    handleSizeChange(val) {
      this.table_config.data.pageSize = val
      this.loadData()
    },
    handleCurrentChange(val) {
      this.table_config.data.pageNumber = val
      this.loadData()
    },
    // 删除
    delConfirm(id) {
      this.$confirm("确定删除此信息", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.rowId = id
          let requestData = {
            url: this.table_config.url + "Delete",
            data: { id }
          }
          Delete(requestData)
            .then(response => {
              this.$message({
                type: "success",
                message: response.message
              })
              this.rowId = ""
              // 调用子组件的方法
              this.loadData()
            })
            .cacth(error => {
              this.rowId = ""
            })
        })
        .catch(() => {})
    },
    // 编辑
    edit(id, routerNmae) {
      this.$router.push({
        name: routerNmae,
        query: {
          id
        }
      })
    }
  },
  props: {
    // props接收 thead url pageData
    config: {
      type: Object,
      default: () => {}
    },
    searchFormConfig: {
      type: Object,
      default: function() {
        return {}
      }
    },
    id: {
      type: String,
      default: null
    }
  },
  // watch检查数据
  watch: {
    config: {
      handler(newValue) {
        this.initConfig()
      },
      immediate: true
    },
    "$store.state.common.table_loadData_flag": {
      handler(newValue) {
        this.loadData()
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.mr-10 {
  margin-right: 10px;
}
</style>
