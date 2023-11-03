<template>
  <div class="app-container">
    <div class="filter-container">
      <el-select v-model="serchCategoryId" filterable clearable placeholder="类目">
        <el-option
          v-for="item in categoryList"
          :key="item.id"
          :label="item.path_name"
          :value="item.id"
        />
      </el-select>
      <el-input v-model="serchTitle" placeholder="标题" style="width: 200px;" class="filter-item" />
      <el-button class="filter-item" type="primary" size="small" icon="el-icon-search" @click="serch">
        查询
      </el-button>
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" size="small" icon="el-icon-edit" @click="handleCreate">
        新增
      </el-button>
    </div>
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
      <el-table-column label="类目">
        <template slot-scope="scope">
          {{ scope.row.path_name }}
        </template>
      </el-table-column>
      <el-table-column label="标题">
        <template slot-scope="scope">
          {{ scope.row.title }}
        </template>
      </el-table-column>
      <el-table-column label="英文标题">
        <template slot-scope="scope">
          {{ scope.row.english_title }}
        </template>
      </el-table-column>

      <el-table-column label="排序">
        <template slot-scope="scope">
          {{ scope.row.sort }}
        </template>
      </el-table-column>

      <el-table-column
        class-name="status-col"
        label="Status"
        width="110"
        align="center"
      >
        <template slot-scope="scope">
          <el-tag :type="scope.row.status | statusFilter">
            {{ scope.row.status }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        prop="created_at"
        label="Display_time"
        width="200"
      >
        <template slot-scope="scope">
          <i class="el-icon-time" />
          <span>{{ scope.row.created_at }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button
            size="mini"
            @click="handleEdit(scope.$index, scope.row)"
          >编辑</el-button>
          <el-button
            size="mini"
            type="danger"
            @click="del(scope.$index, scope.row)"
          >删除</el-button>
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

    <el-dialog title="内容编辑" :visible.sync="dialogFormVisible">
      <el-form :model="form">
        <el-form-item label="目录" :label-width="formLabelWidth">
          <el-select v-model="form.category_id" filterable placeholder="类别">
            <el-option
              v-for="item in categoryList"
              :key="item.id"
              :label="item.path_name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="标题" :label-width="formLabelWidth">
          <el-input v-model="form.title" autocomplete="off" />
        </el-form-item>
        <el-form-item label="英文标题" :label-width="formLabelWidth">
          <el-input v-model="form.english_title" autocomplete="off" />
        </el-form-item>
        <el-form-item label="排序" :label-width="formLabelWidth">
          <el-input v-model="form.sort" autocomplete="off" />
        </el-form-item>
        <el-form-item label="内容" :label-width="formLabelWidth">
          <el-input
            v-model="form.content"
            type="textarea"
            :rows="5"
            placeholder="请输入内容"
          />
        </el-form-item>
        <el-form-item label="中文翻译" :label-width="formLabelWidth">
          <el-input
            v-model="form.translation"
            type="textarea"
            :rows="5"
            placeholder="请输入内容"
          />
        </el-form-item>
        <el-form-item label="状态" :label-width="formLabelWidth">
          <el-select v-model="form.status" placeholder="请选择活动区域">
            <el-option label="启用" :value="1" />
            <el-option label="禁用" :value="2" />
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="save">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getContentList, saveContent, delContent } from '@/api/content'
import { getCategoryList } from '@/api/category'

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
      categoryList: null,
      categoryMap: null,
      listLoading: true,
      dialogFormVisible: false,
      form: {
        id: '',
        category_id: '',
        title: '',
        english_title: '',
        sort: 0,
        content: '',
        translation: '',
        status: ''
      },
      formLabelWidth: '120px',
      serchTitle: '',
      serchCategoryId: '',
      currentPage: 1,
      pageSize: 10,
      pageIndex: 1,
      total: 0
    }
  },
  created() {
      this.fetchCategory()
  },
  methods: {
    fetchData() {
      this.listLoading = true
      getContentList({ 'page': this.pageIndex, 'pageSize': this.pageSize, 'title': this.serchTitle }).then((response) => {
        this.list = response.data.data
        this.listLoading = false
        this.total = response.data.total
        this.list.forEach(element => {
          element.path_name = this.categoryMap.get(element.category_id)
        })
      })
    },
    fetchCategory() {
      const fruits = new Map()
      getCategoryList({ }).then((response) => {
        console.log(response.data)
        this.categoryList = response.data
        this.categoryList.forEach(element => {
          fruits.set(element.id, element.path_name)
        })
        this.categoryMap = fruits
        this.fetchData()
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
    handleEdit(index, rows) {
      console.log(index)
      console.log(rows)
      this.form.id = rows.id
      this.form.title = rows.title
      this.form.english_title = rows.english_title
      this.form.sort = rows.sort
      this.form.category_id = rows.category_id
      this.form.content = rows.content
      this.form.translation = rows.translation
      this.form.status = rows.status
      this.dialogFormVisible = true
    },
    handleCreate() {
      this.form.id = 0
      this.form.title = ''
      this.form.english_title = ''
      this.form.content = ''
      this.form.translation = ''
      this.form.status = 1
      this.form.sort = 0
      this.dialogFormVisible = true
    },
    save() {
      console.log(this.form)
      saveContent(this.form).then((response) => {
        this.dialogFormVisible = false
        this.fetchData()
      }).catch(() => {
        this.$message.error('保存失败')
      })
    },
    del(index, rows) {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        delContent({ 'id': rows.id }).then((response) => {
          this.fetchData()
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
        }).catch(() => {
          this.$message.error('删除失败')
        })
      })
    },
    serch() {
      this.fetchData()
    }
  }
}
</script>
