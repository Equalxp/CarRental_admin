<el-table :data="tableData" border style="width: 100%">
        <el-table-column type="selection" width="35"></el-table-column>
        <el-table-column prop="parkingName" label="停车场名称"></el-table-column>
        <!-- 类型处理 -->
        <el-table-column prop="type" label="类型">
          <template slot-scope="scoped">
            <!-- 传的值 ｜ 函数 -->
            <span>{{ scoped.row.type | getType }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="address" label="区域"></el-table-column>
        <el-table-column prop="carsNumber" label="可停放车辆"></el-table-column>
        <el-table-column prop="disabled" label="禁启用">
          <template slot-scope="scope">
            <el-switch v-model="scope.row.status" active-value="2" inactive-value="1" active-color="#13ce66" inactive-color="#ff4949"> </el-switch>
          </template>
        </el-table-column>
        <el-table-column prop="lnglat" label="查看位置">
          <template slot-scope="scoped">
            <!-- {{ scoped.row }} -->
            <el-button type="success" size="mini" @click="showMap(scoped.row)">查看地图</el-button>
          </template>
        </el-table-column>

        <el-table-column label="操作">
          <template slot-scope="scoped">
            <el-button size="small" type="primary" @click="edit(scoped.row.id)">编辑</el-button>
            <el-button size="small" type="danger" @click="delConfirm(scoped.row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>


    // 请求停车场的列表
    getParkingList() {
      const requestData = {
        pageSize: this.pageSize,
        pageNumber: this.pageNumber
      }
      // 过滤筛选 深拷贝
      const filterData = JSON.parse(JSON.stringify(this.form))
      for (let key in filterData) {
        if (filterData[key]) {
          requestData[key] = filterData[key]
        }
      }
      // 关键字
      if (this.keyword && this.search_key) {
        requestData[this.search_key] = this.keyword
      }
      // console.log("requestData", requestData)
      // const res = ParkingList(requestData)
      // console.log("ParkingList_index", res)
      ParkingList(requestData)
        .then(response => {
          const data = response.data
          // 判断数据是否存在
          if (data) {
            this.tableData = data.data
          }
          // 页码
          if (data.total) {
            this.total = data.total
          }
          this.table_loading = false
        })
        .catch(error => {
          this.table_loading = false
        })
    },