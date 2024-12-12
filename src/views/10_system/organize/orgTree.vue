<template>
  <div>
    <el-input
      ref="minusLeftFilterInput"
      v-model="filterText"
      class="filterInput"
      placeholder="输入关键字进行过滤"
    >
      <el-button
        slot="append"
        icon="el-icon-search"
      />
    </el-input>
    <div
      :style="{height: height + 'px'}"
      class="treeStyle generalDiv"
    >
      <el-tree
        ref="treeObject"
        :data="treeData"
        :props="defaultProps"
        :filter-node-method="filterNode"
        :expand-on-click-node="false"
        highlight-current
        node-key="id"
        default-expand-all
      >
        <template
          v-slot="{ node, data }"
          class="custom-tree-node"
        >
          <span>{{ node.label }}</span>
          <span>
            <el-dropdown
              :show-timeout="100"
              :szie="getSize()"
            >
              <span class="el-dropdown-link el-button--text">
                操作<i class="el-icon-arrow-down el-icon--right" />
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item>
                  <el-button
                    :szie="getSize()"
                    type="text"
                    @click="() => append(data)"
                  >
                    新增
                  </el-button>
                </el-dropdown-item>
                <el-dropdown-item>
                  <el-button
                    :szie="getSize()"
                    type="text"
                    @click="() => edit(data)"
                  >
                    编辑
                  </el-button>
                </el-dropdown-item>
                <el-dropdown-item>
                  <el-button
                    :szie="getSize()"
                    type="text"
                    @click="() => remove(data)"
                  >
                    删除
                  </el-button>
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </span>
        </template>
      </el-tree>
    </div>
  </div>
</template>

<style scoped>
.treeStyle {
  overflow: auto;
  border: 1px solid #ebeef5;
}
.filterInput {
  margin-bottom: 10px;
}

.leaf {
  width: 20px;
  background: #ddd;
}

.folder {
  width: 20px;
  background: #888;
}

.custom-tree-container {
  display: -ms-flexbox;
  display: flex;
  margin: -24px;
}

.block {
  -ms-flex: 1;
  flex: 1;
  padding: 8px 24px 24px;
}

.block > p {
  text-align: center;
  margin: 0;
  line-height: 4;
}

.block:first-child {
  border-right: 1px solid #eff2f6;
}

.custom-tree-node {
  -ms-flex: 1;
  flex: 1;
  display: -ms-flexbox;
  display: flex;
  -ms-flex-align: center;
  align-items: center;
  -ms-flex-pack: justify;
  justify-content: space-between;
  font-size: 12px;
  padding-right: 8px;
}
</style>

<script>
import resizeMixin from '@/mixin/resizeHandlerMixin'

export default {
  name: 'P00000010', // 页面id，和router中的name需要一致，作为缓存
  components: {
    // OrgList: () => import('./orgList.vue') // 右侧list
  },
  mixins: [resizeMixin],
  props: {
    height: {
      type: Number,
      default: 200
    }
  },
  data () {
    return {
      // 表格数据
      searchForm: {
        page: 1,
        limit: 20,
        total: 0,
        role_name: undefined
      },
      loading: true,
      listData: null,
      // 单条数据 json
      temp: {
        id: undefined,
        create_dt: '',
        role_name: ''
      },

      // 弹出窗口状态名称
      textMap: {
        update: '修改',
        create: '新增',
        copyInsert: '复制新增'
      },
      // 以下为pop的内容
      filterText: '',
      // 按钮状态
      btnStatus: {
        doEdit: false
      },
      treeData: [{
        id: 1,
        label: '一级 1',
        children: [{
          id: 4,
          label: '二级 1-1',
          children: [{
            id: 9,
            label: '三级 1-1-1'
          }, {
            id: 10,
            label: '三级 1-1-2'
          }]
        }]
      }, {
        id: 2,
        label: '一级 2',
        children: [{
          id: 5,
          label: '二级 2-1'
        }, {
          id: 6,
          label: '二级 2-2'
        }]
      }, {
        id: 3,
        label: '一级 3',
        children: [{
          id: 7,
          label: '二级 3-1'
        }, {
          id: 8,
          label: '二级 3-2'
        }]
      }],
      defaultProps: {
        children: 'children',
        label: 'label'
      }
    }
  },
  watch: {
    filterText (val) {
      this.$refs.treeObject.filter(val)
    }
  },
  created () {
    // 初始化查询
    this.btnStatus.doEdit = false
  },
  methods: {
    append (data) {
      const newChild = { id: 12345, label: 'testtest', children: [] }
      if (!data.children) {
        this.$set(data, 'children', [])
      }
      data.children.push(newChild)
    },
    remove (node, data) {
      const parent = node.parent
      const children = parent.data.children || parent.data
      const index = children.findIndex(d => d.id === data.id)
      children.splice(index, 1)
    },
    filterNode (value, data) {
      if (!value) return true
      return data.label.indexOf(value) !== -1
    }
  }
}
</script>
