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
          placeholder="查询条件"
        />
      </el-form-item>
      <el-form-item :size="getSize()">
        <el-button
          type="primary"
          icon="el-icon-search"
          plain
          @click="doSearch"
        >查询</el-button>
      </el-form-item>
    </el-form>
    <el-button-group>
      <el-button
        type="primary"
        icon="el-icon-circle-plus-outline"
        @click="showDialogAdd"
      >新增</el-button>
      <el-button
        :disabled="!btnStatus.doEdit"
        type="primary"
        icon="el-icon-edit-outline"
        @click="showDialogUpd"
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
      @row-click="doRowClick"
      @current-change="doSelectCurrentChange"
      @sort-change="doSortChange"
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
        label="用户账号"
        min-width="120"
      />
      <el-table-column
        sortable
        label="用户实名"
        min-width="120"
      />
      <el-table-column
        sortable
        label="所属组织"
        min-width="120"
      />
      <el-table-column
        sortable
        label="所属用户组"
        min-width="120"
      />
      <el-table-column
        sortable
        label="用户类型"
        min-width="120"
      />
      <el-table-column
        sortable
        label="账户生效日期"
        min-width="120"
      />
      <el-table-column
        sortable
        label="账户失效日期"
        min-width="120"
      />
      <el-table-column
        sortable
        label="密码生效日期"
        min-width="120"
      />
      <el-table-column
        sortable
        label="密码失效日期"
        min-width="120"
      />
      <el-table-column
        sortable
        label="手机号码"
        min-width="120"
      />
      <el-table-column
        sortable
        label="办公电话"
        min-width="120"
      />
      <el-table-column
        sortable
        label="家庭电话"
        min-width="120"
      />
      <el-table-column
        sortable
        label="电子邮件"
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
    <userAddPopUp
      :dialog-status="dialogStatus"
      :dialog-visible="dialogVisible"
      @setDialogVisible="setDialogVisible"
    />
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
import { getList } from '@/api/10_system/organize/organize'
// import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
import elDragDialog from '@/directive/el-drag-dialog' // base on element-ui

export default {
  name: 'UserList',
  components: {
    // Pagination,
    userAddPopUp: () => import('./userAddPopUp') // 弹出pop：新增
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
      // 以下为pop的内容
      selection: [],
      dialogStatus: '',
      dialogVisible: false,
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
  created () {
    // 初始化查询
    this.getDataList()
    this.btnStatus.doEdit = false
  },
  methods: {
    // 设置获取弹出窗口返回值
    setDialogVisible (val) {
      this.dialogVisible = val.dialogVisible
    },
    append (data) {
      const newChild = { id: 12345, label: 'testtest', children: [] }
      if (!data.children) {
        this.$set(data, 'children', [])
      }
      data.children.push(newChild)
    },
    doRowClick (row) {
      this.temp = Object.assign({}, row) // copy obj
    },
    doSearch () {
      // 查询
      this.searchForm.page = 1
      this.getDataList()
    },
    showDialogAdd () {
      // 新增
      this.dialogStatus = 'create'
      this.dialogVisible = true
    },
    showDialogUpd () {
      if (this.temp.id === undefined) {
        this.showErrorMsg('请选择一条数据')
        return
      }
      // 修改
      this.dialogStatus = this.PARAMETERS.STATUS_UPDATE
      this.dialogVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    doSelectCurrentChange (row) {
      this.temp = Object.assign({}, row) // copy obj
      if (this.temp.id !== undefined) {
        this.btnStatus.doEdit = true
      } else {
        this.btnStatus.doEdit = false
      }
    },
    doSortChange (column) {
      // 服务器端排序
      if (column.order === 'ascending') {
        this.searchForm.sort = column.prop
      } else if (column.order === 'descending') {
        this.searchForm.sort = '-' + column.prop
      }
      this.getDataList()
    },
    getDataList () {
      // 查询逻辑
      this.loading = true
      getList(this.searchForm).then(response => {
        this.listData = response.data.datas
        // this.searchForm.total = response.data.total
        this.loading = false
      })
    }

  }
}
</script>
