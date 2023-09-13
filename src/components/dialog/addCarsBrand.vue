<template>
  <div>
    <el-dialog title="新增车辆品牌" :visible.sync="dialogVisible" class="cars-dialog-center" @close="close" :close-on-click-modal="false">
      <el-form :inline="true" :model="form" class="demo-form-inline">
        <el-form-item label="车辆品牌">
          <el-input v-model="form.parking_name" placeholder="审批人"></el-input>
        </el-form-item>
        <el-form-item label="品牌型号">
          <el-input v-model="form.parking_name" placeholder="审批人"></el-input>
        </el-form-item>
        <el-form-item label="LOGO">
          <div class="upload-img-wrap">
            <div class="upload-img">
              <img src="https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1593447137003&di=8e2c8ba51d3018e302c66a0bd851c7e8&imgtype=0&src=http%3A%2F%2Fimg.bqatj.com%2Fimg%2F4e384e839d6b6e96.jpg" alt />
            </div>
            <ul class="img-list">
              <li>
                <img src="https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1593447137003&di=8e2c8ba51d3018e302c66a0bd851c7e8&imgtype=0&src=http%3A%2F%2Fimg.bqatj.com%2Fimg%2F4e384e839d6b6e96.jpg" alt />
              </li>
            </ul>
          </div>
        </el-form-item>
        <el-form-item label="禁用启用">
          <el-radio-group v-model="form.resource">
            <el-radio label="禁用"></el-radio>
            <el-radio label="启用"></el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "",
  components: {},
  data() {
    return {
      // dialog
      dialogVisible: false,
      form: {
        parking_name: "",
        area: "",
        type: ""
      },
      tableData: [
        {
          name: "xxx",
          type: "xxx",
          area: "xxx",
          carsNumber: "xxx",
          disabled: "xxx",
          location: "xxx"
        }
      ]
    }
  },
  props: {
    flagVisible: {
      type: Boolean,
      default: false
    }
  },
  methods: {
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
