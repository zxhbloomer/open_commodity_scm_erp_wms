<template>
  <div class="app-container">
    <el-form
      ref="minusForm"
      :inline="true"
      :model="dataJson.searchForm"
      label-position="getLabelPosition()"
    >
      <el-form-item>
        <el-input
          v-model.trim="dataJson.searchForm.serial_type"
          clearable
          placeholder="业务类型"
          @keyup.enter.native="handleSearch"
        />
      </el-form-item>
      <el-form-item>
        <el-input
          v-model.trim="dataJson.searchForm.serial_code"
          clearable
          placeholder="业务单号"
          @keyup.enter.native="handleSearch"
        />
      </el-form-item>
      <el-form-item label="">
        <el-date-picker
          v-model="dataJson.searchForm.sync_time"
          value-format="yyyy-MM-dd"
          type="daterange"
          align="right"
          unlink-panels
          range-separator="至"
          start-placeholder="同步开始日期"
          end-placeholder="同步结束日期"
          :picker-options="pickerOptions"
        />
      </el-form-item>
      <el-form-item style="float:right">
        <el-button
          v-popover:popover
          type="primary"
          plain
          icon="perfect-icon-reset"
          @click="doResetSearch"
        >重置</el-button>
      </el-form-item>
      <el-form-item style="float:right">
        <el-button
          type="primary"
          plain
          icon="el-icon-search"
          @click="handleSearch"
        >查询</el-button>
      </el-form-item>
    </el-form>
    <el-button-group>
      <el-button
        v-permission="'P_SYSCODE:INFO'"
        :disabled="!settings.btnShowStatus.showUpdate"
        type="primary"
        icon="el-icon-info"
        :loading="settings.loading"
        @click="handleView"
      >查看</el-button>
    </el-button-group>
    <el-table
      ref="multipleTable"
      v-loading="settings.loading"
      :data="dataJson.listData"
      :element-loading-text="'正在拼命加载中...'"
      element-loading-background="rgba(255, 255, 255, 0.5)"
      :height="settings.tableHeight"
      stripe
      border
      highlight-current-row
      :default-sort="{prop: 'c_time', order: 'descending'}"
      style="width: 100%"
      @row-click="handleRowClick"
      @current-change="handleCurrentChange"
      @sort-change="handleSortChange"
      @selection-change="handleSelectionChange"
    >
      <el-table-column
        type="index"
        width="45"
        label="No"
      />
      <el-table-column
        sortable="custom"
        :auto-fit="true"
        min-width="120"
        :sort-orders="settings.sortOrders"
        prop="serial_type_name"
        label="业务类型"
      />
      <el-table-column
        sortable="custom"
        :auto-fit="true"
        min-width="120"
        :sort-orders="settings.sortOrders"
        prop="serial_code"
        label="业务单号"
      >
        <template v-slot="scope">
          <router-link
            v-if="scope.row.serial_type === 'b_in_plan'"
            :to="{name:dataJson.constants_program.P_IN_PLAN,query:{serial_code:scope.row.serial_code, fullpath:true}}"
          ><a href="javascript:void(0)">{{ scope.row.serial_code }}</a></router-link>
          <router-link
            v-if="scope.row.serial_type === 'b_out_plan'"
            :to="{name:dataJson.constants_program.P_OUT_PLAN,query:{serial_code:scope.row.serial_code, fullpath:true}}"
          ><a href="javascript:void(0)">{{ scope.row.serial_code }}</a></router-link>
          <router-link
            v-if="scope.row.serial_type === 'b_out'"
            :to="{name:dataJson.constants_program.P_OUT,query:{serial_code:scope.row.serial_code,fullpath:true}}"
          ><a href="javascript:void(0)">{{ scope.row.serial_code }}</a></router-link>
          <router-link
            v-if="scope.row.serial_type === 'b_in'"
            :to="{name:dataJson.constants_program.P_IN,query:{serial_code:scope.row.serial_code, fullpath:true}}"
          ><a href="javascript:void(0)">{{ scope.row.serial_code }}</a></router-link>
        </template>
      </el-table-column>
      <el-table-column
        :auto-fit="true"
        sortable="custom"
        min-width="150"
        :sort-orders="settings.sortOrders"
        prop="c_time"
        label="同步时间"
      >
        <template v-slot="scope">
          {{ formatDateTime(scope.row.c_time) }}
        </template>
      </el-table-column>
      <el-table-column
        :auto-fit="true"
        min-width="120"
        prop="status_name"
        label="同步状态"
      />
    </el-table>

    <pagination
      ref="minusPaging"
      :total="dataJson.paging.total"
      :page.sync="dataJson.paging.current"
      :limit.sync="dataJson.paging.size"
      :loading="settings.loading"
      @pagination="getDataList"
    />

    <edit-dialog
      v-if="settings.popSettings.one.visible"
      :id="settings.popSettings.one.props.id"
      :data="settings.popSettings.one.props.data"
      :visible="settings.popSettings.one.visible"
      :dialog-status="settings.popSettings.one.props.dialogStatus"
      @closeMeCancel="handleCancel"
    />

  </div>
</template>

<style scoped>
.floatRight {
  float: right;
}
.floatLeft {
  float: left;
}
.el-form-item .el-select {
  width: 100%;
}
a {
  color: #52b5f2;
}
.el-form-item--mini.el-form-item {
  margin-bottom: 10px;
}
.el-button-group {
  margin-bottom: 10px;
}
</style>

<script>
import constants_program from '@/common/constants/constants_program'
import { getListApi } from '@/api/10_system/log/logsync'
import resizeMixin from './mixin/resizeHandlerMixin'
import elDragDialog from '@/directive/el-drag-dialog'
import deepCopy from 'deep-copy'
import permission from '@/directive/permission/index.js' // 权限判断指令
// import Pagination from '@/components/Pagination_no_count'
import Pagination from '@/components/Pagination'
import editDialog from '@/views/10_system/synclog/dialog/edit'

export default {
  components: { Pagination, editDialog },
  directives: { elDragDialog, permission },
  mixins: [resizeMixin],
  data () {
    return {
      pickerOptions: {
        shortcuts: [
          {
            text: '最近一周',
            onClick (picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
              picker.$emit('pick', [start, end])
            }
          },
          {
            text: '最近一个月',
            onClick (picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
              picker.$emit('pick', [start, end])
            }
          }, {
            text: '最近三个月',
            onClick (picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
              picker.$emit('pick', [start, end])
            }
          }]
      },
      dataJson: {
        // 查询使用的json
        searchForm: {
          // 翻页条件
          pageCondition: deepCopy(this.PARAMETERS.PAGE_CONDITION_ID),
          // 查询条件
          name: '',
          code: '',
          status: null
        },
        // 分页控件的json
        paging: deepCopy(this.PARAMETERS.PAGE_JSON),
        // table使用的json
        listData: null,
        // 单条数据 json的，初始化原始数据
        tempJsonOriginal: {
          id: undefined,
          name: '',
          code: '',
          descr: '',
          dbversion: 0
        },
        // 单条数据 json
        currentJson: null,
        tempJson: null,
        constants_program: constants_program,
        inputSettings: {
          maxLength: {
            name: 20,
            simple_name: 20,
            prefex: 5
          }
        },
        // 当前表格中的索引，第几条
        rowIndex: 0,
        // 当前选中的行（checkbox）
        multipleSelection: []
      },
      // 页面设置json
      settings: {
        popSettings: {
          // 弹出编辑页面
          one: {
            visible: false,
            props: {
              id: undefined,
              data: {},
              dialogStatus: ''
            }
          }
        },
        // 表格排序规则
        sortOrders: deepCopy(this.PARAMETERS.SORT_PARA),
        // 按钮状态
        btnShowStatus: {
          showUpdate: false
        },
        // loading 状态
        loading: true,
        tableHeight: this.setUIheight(),
        duration: 4000
      },
      popSettingsData: {
        // 弹出窗口状态名称
      }
    }
  },
  computed: {
  },
  // 监听器
  watch: {
    'dataJson.searchForm': {
      deep: true,
      handler () {
        if (this.dataJson.searchForm.sync_time === null) {
          this.dataJson.searchForm.c_time_start = null
          this.dataJson.searchForm.c_time_end = null
        }
      }
    }

  },
  created () {
    this.initShow()
  },
  mounted () {
    // 描绘完成
  },
  methods: {
    initTempJsonOriginal () {

    },
    initShow () {
      // 初始化查询
      this.getDataList()
    },
    // 获取行索引
    getRowIndex (row) {
      const _index = this.dataJson.listData.lastIndexOf(row)
      return _index
    },
    // 行点击
    handleRowClick (row) {
      this.dataJson.tempJson = Object.assign({}, row) // copy obj
      this.dataJson.rowIndex = this.getRowIndex(row)
    },
    handleSearch () {
      if (this.dataJson.searchForm.sync_time !== null && this.dataJson.searchForm.sync_time !== undefined && this.dataJson.searchForm.sync_time !== '') {
        this.dataJson.searchForm.c_time_start = this.dataJson.searchForm.sync_time[0]
        this.dataJson.searchForm.c_time_end = this.dataJson.searchForm.sync_time[1]
      }
      // 查询
      this.dataJson.searchForm.pageCondition.current = 1
      this.dataJson.paging.current = 1
      this.getDataList()
      // 清空选择
      this.dataJson.multipleSelection = []
      this.$refs.multipleTable.clearSelection()
    },
    handleView () {
      this.settings.popSettings.one.props.data = Object.assign({}, this.dataJson.currentJson)
      if (this.settings.popSettings.one.props.data.id === undefined) {
        this.showErrorMsg('请选择一条数据')
        return
      }
      // 查看
      this.settings.popSettings.one.props.dialogStatus = this.PARAMETERS.STATUS_VIEW
      this.settings.popSettings.one.visible = true
    },
    handleCancel () {
      this.settings.popSettings.one.visible = false
    },
    handleCurrentChange (row) {
      this.dataJson.currentJson = Object.assign({}, row) // copy obj
      this.dataJson.currentJson.index = this.getRowIndex(row)
      this.dataJson.tempJsonOriginal = Object.assign({}, row) // copy obj

      if (this.dataJson.currentJson.id !== undefined) {
        this.settings.btnShowStatus.showUpdate = true
      } else {
        this.settings.btnShowStatus.showUpdate = false
      }
      // 设置dialog的返回
      this.$store.dispatch('popUpSearchDialog/selectedDataJson', Object.assign({}, row))
    },
    handleSortChange (column) {
      // 服务器端排序
      if (column.order === 'ascending') {
        this.dataJson.searchForm.pageCondition.sort = column.prop
      } else if (column.order === 'descending') {
        this.dataJson.searchForm.pageCondition.sort = '-' + column.prop
      }
      this.getDataList()
    },
    getDataList () {
      this.dataJson.searchForm.pageCondition.current = this.dataJson.paging.current
      this.dataJson.searchForm.pageCondition.size = this.dataJson.paging.size
      // 查询逻辑
      this.settings.loading = true
      getListApi(this.dataJson.searchForm).then(response => {
        // 增加对象属性，columnTypeShowIcon，columnNameShowIcon
        const recorders = response.data.records
        const newRecorders = recorders.map(v => {
          return { ...v, columnTypeShowIcon: false, columnNameShowIcon: false }
        })
        this.dataJson.listData = newRecorders
        this.dataJson.paging = response.data
        this.dataJson.paging.records = {}
      }).finally(() => {
        this.settings.loading = false
      })
    },
    // 获取row-key
    getRowKeys (row) {
      return row.id
    },
    // table选择框
    handleSelectionChange (val) {
      this.dataJson.multipleSelection = val
    },
    // 重置查询区域
    doResetSearch () {
      this.dataJson.searchForm = this.$options.data.call(this).dataJson.searchForm
    }

  }
}
</script>
