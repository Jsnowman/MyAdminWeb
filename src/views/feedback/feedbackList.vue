<template>
  <div class="app-container">
    <div class="filter-container" />
    <br>
    <el-table
      v-loading="listLoading"
      :data="list"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row
      height="500"
    >
      <el-table-column align="center" label="ID" width="95">
        <template slot-scope="scope">
          {{ scope.row.id }}
        </template>
      </el-table-column>
      <el-table-column label="用户">
        <template slot-scope="scope">
          {{ scope.row.uid }}
        </template>
      </el-table-column>
      <el-table-column label="反馈内容">
        <template slot-scope="scope">
          {{ scope.row.feedback }}
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        prop="created_at"
        label="反馈时间"
        width="200"
      >
        <template slot-scope="scope">
          <i class="el-icon-time" />
          <span>{{ scope.row.created_at }}</span>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      :current-page="currentPage"
      :page-sizes="[10, 50, 100, 200]"
      :page-size="pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />

  </div>
</template>

  <script>
  import { getFeedbackList } from '@/api/feedback'

  export default {
    filters: {
      statusFilter(status) {
        const statusMap = {
          published: 'success',
          draft: 'gray',
          deleted: 'danger'
        }
        return statusMap[status]
      }
    },
    data() {
      return {
        list: null,
        listLoading: true,
        dialogFormVisible: false,
        formLabelWidth: '120px',
        currentPage: 1,
        pageSize: 10,
        pageIndex: 1,
        total: 0
      }
    },
    created() {
        this.fetchData()
        // this.fetchCategory()
    },
    methods: {
      fetchData() {
        this.listLoading = true
        getFeedbackList({ 'page': this.pageIndex, 'pageSize': this.pageSize }).then((response) => {
          this.list = response.data.data
          this.listLoading = false
          this.total = response.data.total
        })
      },
      handleSizeChange(val) {
        console.log(`每页 ${val} 条`)
        this.pageSize = val
        this.fetchData()
      },
      handleCurrentChange(val) {
        console.log(`当前页: `, this.currentPage4)
        console.log(`当前页: ${val}`)
        this.pageIndex = val
        this.fetchData()
      },
      serch() {
        this.fetchData()
      }
    }
  }
  </script>

