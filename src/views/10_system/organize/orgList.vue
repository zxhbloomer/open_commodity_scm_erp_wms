<template>
  <div>
    <el-form
      ref="minusRightForm"
      :inline="true"
      :model="searchForm"
      :size="getSize()"
      label-position="getLabelPosition()"
      class="floatRight"
    >
      <el-form-item>
        <el-input
          v-model="searchForm.role_name"
          placeholder="权限组名称"
        />
      </el-form-item>
      <el-form-item :size="getSize()">
        <el-button
          type="primary"
          icon="el-icon-search"
          plain
          @click="handleSearch"
        >查询</el-button>
      </el-form-item>
    </el-form>
    <el-button-group>
      <el-button
        type="primary"
        icon="el-icon-circle-plus-outline"
        @click="handleCreate"
      >新增</el-button>
      <el-button
        :disabled="!btnStatus.doEdit"
        type="primary"
        icon="el-icon-edit-outline"
        @click="handleUpdate"
      >修改</el-button>
    </el-button-group>
    <el-table
      v-loading="loading"
      :data="listData"
      :element-loading-text="'正在拼命加载中...'"
      :size="getSize()"
      :height="height"
      stripe
      border
      fit
      highlight-current-row
      show-overflow-tooltip
      @row-click="handleRowClick"
      @current-change="handleCurrentChange"
      @sort-change="handleSortChange"
    >
      <el-table-column
        type="selection"
        width="40"
      />
      <el-table-column
        type="index"
        label="No"
      />
      <el-table-column
        sortable
        label="层级ID"
        min-width="120"
      />
      <el-table-column
        sortable
        label="组织名称"
        min-width="120"
      />
      <el-table-column
        sortable
        label="简称"
        min-width="120"
      />
      <el-table-column
        sortable
        label="上级组织"
        min-width="120"
      />
      <el-table-column
        sortable
        label="状态"
        min-width="120"
      />
      <el-table-column
        sortable
        label="启用时间"
        min-width="120"
      />
      <el-table-column
        sortable
        label="禁用时间"
        min-width="120"
      />
      <el-table-column
        sortable
        label="创建者"
        min-width="120"
      />
      <el-table-column
        sortable
        label="创建时间"
        min-width="120"
      />
      <el-table-column
        sortable
        label="更新人"
        min-width="120"
      />
      <el-table-column
        sortable
        label="更新时间"
        min-width="120"
      />
    </el-table>
  </div>
</template>
<style scoped>
.el-form-item {
  margin-bottom: 0px !important;
}
.floatRight {
  float: right;
}
</style>

<script>
import { getList, updateData } from '@/api/10_system/organize/organize'
// import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
import elDragDialog from '@/directive/el-drag-dialog' // base on element-ui

export default {
  name: 'OrgList',
  components: {
    // Pagination
  },
  directives: { elDragDialog },
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
      selection: [],
      dialogStatus: '',
      dialogFormVisible: false,
      rules: {
        create_dt: [{ type: 'date', required: true, message: 'timestamp is required', trigger: 'blur' }],
        role_name: [{ required: true, message: 'title is required', trigger: 'blur' }]
      },
      // 按钮状态
      btnStatus: {
        doEdit: false
      },
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
    this.getDataList()
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
    },
    handleRowClick (row) {
      this.temp = Object.assign({}, row) // copy obj
    },
    handleSearch () {
      // 查询
      this.searchForm.page = 1
      this.getDataList()
    },
    handleCreate () {
      // 新增
      this.searchForm.page = 1
      this.getDataList()
    },
    handleRowUpdate (row) {
      // 修改
      this.temp = Object.assign({}, row) // copy obj
      this.dialogStatus = this.PARAMETERS.STATUS_UPDATE
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    handleUpdate () {
      if (this.temp.id === undefined) {
        this.showErrorMsg('请选择一条数据')
        return
      }

      // 修改
      this.dialogStatus = this.PARAMETERS.STATUS_UPDATE
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    handleCurrentChange (row) {
      this.temp = Object.assign({}, row) // copy obj
      if (this.temp.id !== undefined) {
        this.btnStatus.doEdit = true
      } else {
        this.btnStatus.doEdit = false
      }
    },
    handleSortChange (column) {
      // 服务器端排序
      if (column.order === 'ascending') {
        this.searchForm.sort = column.prop
      } else if (column.order === 'descending') {
        this.searchForm.sort = '-' + column.prop
      }
      this.getDataList()
    },
    resetTemp () {
      this.temp = {
        id: undefined,
        create_dt: '',
        role_name: ''
      }
    },
    getDataList () {
      // 查询逻辑
      this.loading = true
      getList(this.searchForm).then(response => {
        this.listData = response.data.datas
        // this.searchForm.total = response.data.total
        this.loading = false
      })
    },
    updateData () {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.temp)
          tempData.timestamp = +new Date(tempData.timestamp) // change Thu Nov 30 2017 16:41:05 GMT+0800 (CST) to 1512031311464
          updateData(tempData).then(() => {
            for (const v of this.list) {
              if (v.id === this.temp.id) {
                const index = this.list.indexOf(v)
                this.list.splice(index, 1, this.temp)
                break
              }
            }
            this.dialogFormVisible = false
            this.$notify({
              title: '成功',
              message: '更新处理成功',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    }
  }
}
</script>
