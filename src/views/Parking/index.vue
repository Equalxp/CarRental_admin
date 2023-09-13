<template>
  <div>
    <div class="filter-form">
      <el-row>
        <el-col :span="18">
          <el-form :inline="true" :model="form" class="demo-form-inline">
            <el-form-item label="停车厂名称">
              <el-input v-model="form.parking_name" placeholder="审批人"></el-input>
            </el-form-item>
            <el-form-item label="区域">
              <el-cascader v-model="form.area" :options="options" :props="{ expandTrigger: 'hover' }" @change="handleChange"> </el-cascader>
            </el-form-item>
            <el-form-item label="类型">
              <el-select v-model="form.type" placeholder="活动区域">
                <el-option label="区域一" value="shanghai"></el-option>
                <el-option label="区域二" value="beijing"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="onSubmit">搜索</el-button>
            </el-form-item>
          </el-form>
        </el-col>
        <el-col :span="6">
          <div type="danger">
            <router-link to="/parkingAdd">
              <el-button>新增停车场</el-button>
            </router-link>
          </div>
        </el-col>
      </el-row>
    </div>
    <!-- 表格数据 -->
    <div>
      <el-table :data="tableData" border style="width: 100%">
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column prop="name" label="停车场名称" width="180"> </el-table-column>
        <el-table-column prop="type" label="类型" width="180"> </el-table-column>
        <el-table-column prop="area" label="区域"> </el-table-column>
        <el-table-column prop="carsNumber" label="课停放车辆"> </el-table-column>
        <el-table-column prop="disabled" label="禁用启用">
          <template slot-scope="scope">
            <el-switch v-model="scope.row.disabled" active-color="#13ce66" inactive-color="#ff4949"></el-switch>
          </template>
        </el-table-column>
        <el-table-column prop="location" label="查看位置"> </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button size="small" type="primary">编辑</el-button>
            <el-button size="small" type="danger">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
export default {
  name: "Parking",
  data() {
    return {
      form: {
        parking_name: "",
        area: "",
        type: ""
      },
      options: [
        {
          value: "zhinan",
          label: "指南",
          children: [
            {
              value: "shejiyuanze",
              label: "设计原则",
              children: [
                {
                  value: "yizhi",
                  label: "一致"
                },
                {
                  value: "fankui",
                  label: "反馈"
                },
                {
                  value: "xiaolv",
                  label: "效率"
                },
                {
                  value: "kekong",
                  label: "可控"
                }
              ]
            }
          ]
        }
      ],
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
  methods: {
    onSubmit() {
      console.log("submit!")
    },
    methods: {
      handleChange(value) {
        console.log(value)
      }
    }
  }
}
</script>

<style></style>
