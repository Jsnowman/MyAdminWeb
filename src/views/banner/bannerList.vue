<template>
  <div class="app-container">
    <div class="filter-container">
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
      <el-table-column label="位置">
        <template slot-scope="scope">
          {{ scope.row.district }}
        </template>
      </el-table-column>
      <el-table-column label="标题">
        <template slot-scope="scope">
          {{ scope.row.title }}
        </template>
      </el-table-column>
      <el-table-column label="跳转地址">
        <template slot-scope="scope">
          {{ scope.row.href }}
        </template>
      </el-table-column>
      <el-table-column label="图片">
        <template slot-scope="scope">
          <el-image fit="fill" :src="imgUrl(scope.row.img)" />
        <!-- {{ scope.row.img }} -->
        </template>
      </el-table-column>
      <el-table-column label="排序">
        <template slot-scope="scope">
          {{ scope.row.sort }}
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        prop="created_at"
        label="创建时间"
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
        <el-form-item label="展示区域" :label-width="formLabelWidth">
          <el-select v-model="form.district" placeholder="区域">
            <el-option label="首页banner" value="1" />
          </el-select>
        </el-form-item>
        <el-form-item label="标题" :label-width="formLabelWidth">
          <el-input v-model="form.title" autocomplete="off" />
        </el-form-item>
        <el-form-item label="跳转地址" :label-width="formLabelWidth">
          <el-input v-model="form.href" autocomplete="off" />
        </el-form-item>

        <el-form-item label="图片" :label-width="formLabelWidth">
          <el-input v-model="form.img" autocomplete="off" />
          <el-upload
            class="upload-demo"
            :action="upload_url"
            :headers="header"
            :on-preview="handlePreview"
            :on-remove="handleRemove"
            :before-remove="beforeRemove"
            multiple
            :limit="1"
            :on-exceed="handleExceed"
            :file-list="fileList"
            :on-success="uploadSuccess"
          >
            <el-button size="small" type="primary">点击上传</el-button>
            <div slot="tip" class="el-upload__tip">只能上传jpg/png文件</div>
          </el-upload>
        </el-form-item>
        <el-form-item label="排序" :label-width="formLabelWidth">
          <el-input v-model.number="form.sort" type="number" autocomplete="off" />
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
    import { getDisplayConfigList } from '@/api/displayConfig'
    import { saveDisplayConfig } from '@/api/displayConfig'
    import { getToken } from '@/utils/auth'
    export default {
      filters: {
      },
      data() {
        return {
          upload_url: process.env.VUE_APP_BASE_API + '/admin/displayConfig/upload',
          header: {
            Token: getToken()
          },
          list: null,
          fileList: [],
          listLoading: true,
          dialogFormVisible: false,
          formLabelWidth: '120px',
          currentPage: 1,
          pageSize: 10,
          pageIndex: 1,
          total: 0,
          form: {
            id: 0,
            district: 0,
            title: '',
            href: '',
            img: '',
            sort: 0
          }
        }
      },
      created() {
          this.fetchData()
        //   this.fetchCategory()
      },
      methods: {
        fetchData() {
          console.log(process.env.VUE_APP_BASE_API)
          this.listLoading = true
          getDisplayConfigList({ 'page': this.pageIndex, 'pageSize': this.pageSize }).then((response) => {
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
        },
        handleCreate() {
            this.form.id = 0
            this.form.district = 0
            this.form.title = ''
            this.form.href = ''
            this.form.img = ''
            this.form.sort = 0
            this.dialogFormVisible = true
        },
        handleEdit(index, rows) {
            this.form.id = rows.id
            this.form.district = rows.district
            this.form.title = rows.title
            this.form.href = rows.href
            this.form.img = rows.img
            this.form.sort = rows.sort
            this.dialogFormVisible = true
        },
        save() {
            saveDisplayConfig(this.form).then((response) => {
                this.dialogFormVisible = false
                this.fetchData()
            }).catch(() => {
                this.$message.error('保存失败')
            })
        },
        handleRemove(file, fileList) {
            console.log(file, fileList)
        },
        handlePreview(file) {
            console.log(file)
        },
        handleExceed(files, fileList) {
            this.$message.warning(`当前限制选择 1 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`)
        },
        beforeRemove(file, fileList) {
            return this.$confirm(`确定移除 ${file.name}？`)
        },
        uploadSuccess(response, file, fileList) {
            // console.log(response)
            this.form.img = response.data
        },
        imgUrl(url) {
            return process.env.VUE_APP_BASE_API + url
        }
      }
    }
    </script>

