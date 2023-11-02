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
  </div>
</template>

<script>
import { getCategoryTree } from '@/api/category'
export default {
  filters: {
  },
  data() {
      return {
        id: 1000,
        defaultProps: {
          children: 'child',
          label: 'category_name'
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
        console.log('aaa')
        // 获取当前选中的节点
        console.log(this.$refs.rootTree.getCurrentKey())
        console.log(this.$refs.rootTree.getCurrentNode())
        this.append(this.$refs.rootTree.getCurrentNode())
    },
    append(data) {
        const newChild = { id: this.id++, category_name: 'testtest', child: [] }
        if (!data.child) {
          this.$set(data, 'child', [])
        }
        data.child.push(newChild)
      },

      remove(node, data) {
        const parent = node.parent
        const children = parent.data.children || parent.data
        const index = children.findIndex(d => d.id === data.id)
        children.splice(index, 1)
      },
      edit(node, data) {
        console.log(node)
        console.log(data)
      },
      renderContent(h, { node, data, store }) {
        return (
          <span class='custom-tree-node'>
            <span>{node.label}</span>
            <span>
              <el-button size='mini' type='text' on-click={ () => this.append(data) }>新增</el-button>
              <el-button size='mini' type='text' on-click={ () => this.edit(node, data) }>编辑</el-button>
              <el-button size='mini' type='text' on-click={ () => this.remove(node, data) }>删除</el-button>
            </span>
          </span>)
      }

  }
}
</script>
