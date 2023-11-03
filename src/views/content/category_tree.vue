<template>
  <div class="app-container">
    <div class="filter-container">
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" size="small" icon="el-icon-edit" @click="createNode">
        新增
      </el-button>
    </div>
    <br>
    <div class="block">
      <p>目录树</p>
      <el-tree
        ref="rootTree"
        :data="list"
        :props="defaultProps"
        node-key="id"
        default-expand-all
        :expand-on-click-node="false"
        :render-content="renderContent"
      />
    </div>

    <el-dialog title="内容编辑" :visible.sync="dialogFormVisible">
      <el-form :model="form">
        <el-form-item label="分类名称" label-width="120px">
          <el-input v-model="form.category_name" autocomplete="off" />
        </el-form-item>
        <el-form-item label="排序" label-width="120px">
          <el-input v-model="form.sort" autocomplete="off" />
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
import { getCategoryTree, categorySave, categoryDel } from '@/api/category'
export default {
  filters: {
  },
  data() {
      return {
        dialogFormVisible: false,
        id: 1000,
        defaultProps: {
          children: 'child',
          label: 'category_name'
        },
        form: {
            id: '',
            pid: 0,
            category_name: '',
            sort: ''
        },
        list: []
      }
  },
  created() {
    this.getData()
  },
  methods: {
    getData() {
        getCategoryTree({ }).then((response) => {
        this.list = response.data
        console.log(this.list)
      })
    },
    createNode() {
      this.form.id = 0
      this.form.pid = 0
      this.form.category_name = ''
      this.form.sort = 0
      this.dialogFormVisible = true
      var pid = this.$refs.rootTree.getCurrentKey()
      if (pid) {
        this.form.pid = pid
      }
        // 获取当前选中的节点
        // console.log(this.$refs.rootTree.getCurrentKey())
        // console.log(this.$refs.rootTree.getCurrentNode())
        // this.append(this.$refs.rootTree.getCurrentNode())
    },
    save() {
      console.log(this.form)
      this.form.sort = parseInt(this.form.sort)
      categorySave(this.form).then((response) => {
        this.dialogFormVisible = false
        this.getData()
      }).catch(() => {
        this.$message.error('保存失败')
      })
    },
      append(data) {
        const newChild = { id: this.id++, category_name: 'testtest', child: [] }
        if (!data.child) {
          this.$set(data, 'child', [])
        }
        data.child.push(newChild)
      },
      remove(node, data) {
        this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        categoryDel({ 'id': data.id }).then((response) => {
          this.getData()
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
        }).catch(() => {
          this.$message.error('删除失败')
        })
      })
      },
      edit(node, data) {
        console.log(node)
        console.log(data)
        this.form.id = data.id
        this.form.pid = data.pid
        this.form.sort = data.sort
        this.form.category_name = data.category_name
        this.dialogFormVisible = true
      },
      renderContent(h, { node, data, store }) {
        return (
          <span class='custom-tree-node'>
            <span>{node.label}</span>
            <span>
              <el-button size='mini' type='text' on-click={ () => this.edit(node, data) }>编辑</el-button>
              <el-button size='mini' type='text' on-click={ () => this.remove(node, data) }>删除</el-button>
            </span>
          </span>)
      }

  }
}
</script>
