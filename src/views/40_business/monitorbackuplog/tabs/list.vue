<template>
  <div class="app-container">
    <FloatMenu />
    <div>
      <el-form
        ref="minusForm"
        :inline="true"
        :model="dataJson.searchForm"
        label-position="getLabelPosition()"
      >
        <el-form-item label="">
          <el-input
            v-model.trim="dataJson.searchForm.monitor_code"
            clearable
            placeholder="任务单号"
            @keyup.enter.native="handleSearch"
          />
        </el-form-item>
        <el-form-item label="">
          <select-dict
            v-model="dataJson.searchForm.type"
            :para="CONSTANTS.DICT_B_BK_MONITOR_TYPE"
            init-placeholder="类型"
          />
        </el-form-item>
        <el-form-item label="">
          <el-input
            v-model.trim="dataJson.searchForm.flag"
            clearable
            placeholder="结果"
            @keyup.enter.native="handleSearch"
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
            :loading="settings.loading"
            icon="el-icon-search"
            @click="handleSearch"
          >查询</el-button>
        </el-form-item>
      </el-form>
    </div>
    <el-button-group>

      <!-- <el-button
        v-permission="'P_MONITOR:INFO'"
        :disabled="!settings.btnShowStatus.showView"
        type="primary"
        icon="el-icon-zoom-in"
        :loading="settings.loading"
        @click="handleView"
      >查看</el-button> -->
      <el-button
        v-permission="'P_MONITOR:BACKUP'"
        :disabled="!settings.btnShowStatus.showRestoreData"
        type="primary"
        icon="el-icon-zoom-in"
        :loading="settings.loading"
        @click="handleBackupData"
      >重试</el-button>
      <!-- <el-button
        v-permission="'P_MONITOR:BACKUP'"
        type="primary"
        icon="el-icon-zoom-in"
        :loading="settings.loading"
        @click="handleRestore"
      >恢复</el-button> -->

    </el-button-group>
    <el-table
      ref="multipleTable"
      v-loading="settings.loading"
      columns_index_key="true"
      :data="dataJson.listData"
      :element-loading-text="'正在拼命加载中...'"
      element-loading-background="rgba(255, 255, 255, 0.5)"
      :height="settings.tableHeight"
      stripe
      border
      fit
      highlight-current-row
      :default-sort="{prop: 'u_time', order: 'descending'}"
      style="width: 100%"
      :cell-class-name="tableCellClassName"
      @row-click="handleRowClick"
      @row-dblclick="handleRowDbClick"
      @current-change="handleCurrentChange"
      @sort-change="handleSortChange"
      @selection-change="handleSelectionChange"
    >
      <el-table-column
        type="selection"
        width="45"
        prop="id"
      />
      <el-table-column
        type="index"
        width="45"
        prop="No"
        label="No"
      />
      <el-table-column
        sortable="custom"
        :sort-orders="settings.sortOrders"
        :auto-fit="true"
        min-width="150"
        prop="monitor_code"
        label="任务单号"
        align="center"
      />
      <el-table-column
        sortable="custom"
        :sort-orders="settings.sortOrders"
        :auto-fit="true"
        min-width="120"
        prop="type_name"
        label="类型"
        align="left"
      />
      <el-table-column
        sortable="custom"
        :sort-orders="settings.sortOrders"
        :auto-fit="true"
        min-width="120"
        prop="status_name"
        label="状态"
        align="left"
      />
      <el-table-column
        sortable="custom"
        :sort-orders="settings.sortOrders"
        :auto-fit="true"
        min-width="120"
        prop="flag"
        label="结果"
        align="left"
      />
      <el-table-column
        sortable="custom"
        :sort-orders="settings.sortOrders"
        :auto-fit="true"
        min-width="120"
        prop="last_backup_name"
        label="备份人"
      />
      <el-table-column
        sortable="custom"
        min-width="200"
        :sort-orders="settings.sortOrders"
        :auto-fit="true"
        prop="last_backup_time"
        label="备份时间"
        align="center"
      >
        <template v-slot="scope">
          {{ scope.row.last_backup_time == null?'':formatDateTime(scope.row.last_backup_time) }}
        </template>
      </el-table-column>
      <el-table-column
        sortable="custom"
        :sort-orders="settings.sortOrders"
        :auto-fit="true"
        min-width="120"
        prop="last_restore_name"
        label="恢复人"
      />
      <el-table-column
        sortable="custom"
        min-width="200"
        :sort-orders="settings.sortOrders"
        :auto-fit="true"
        prop="last_restore_time"
        label="恢复时间"
        align="center"
      >
        <template v-slot="scope">
          {{ scope.row.last_restore_time == null?'':formatDateTime(scope.row.last_restore_time) }}
        </template>
      </el-table-column>

    </el-table>
    <pagination
      ref="minusPaging"
      :total="dataJson.paging.total"
      :page.sync="dataJson.paging.current"
      :limit.sync="dataJson.paging.size"
      @pagination="getDataList"
    />
    <BackupConfirmDialog
      v-if="popSettings.two.visible"
      :visible="popSettings.two.visible"
      :dialog-status="popSettings.two.props.dialogStatus"
      @closeMeCancel="handleCloseDialogTwoCancel"
      @closeMeOk="handleCloseDialogTwoOk"
    />
    <!-- <RestoreConfirmDialog
      v-if="popSettings.one.visible"
      :visible="popSettings.one.visible"
      :dialog-status="popSettings.one.props.dialogStatus"
      @closeMeCancel="handleCloseDialogOneCancel"
      @closeMeOk="handleCloseDialogOneOk"
    /> -->

  </div>
</template>

<style scoped>
::v-deep .el-tabs__item {
  height: 30px;
  line-height: 30px;
}
::v-deep .el-tabs__header {
  margin: 0 0 5px;
}

.floatRight {
  float: right;
}
.floatLeft {
  float: left;
}
.el-form-item .el-select {
  width: 100%;
}
.el-date-editor.el-input,
.el-date-editor.el-input__inner {
  width: 371px;
}
.el-button-group {
  margin-bottom: 10px;
}
.el-input-group__append_select,
.el-input-group__append {
  color: #ffffff;
  background-color: #1890ff;
  border-color: #1890ff;
}
.el-input-group__append_reset {
  color: #ffffff;
  background-color: #f56c6c;
  border-color: #f56c6c;
}
a {
  color: #52b5f2;
}
.div-sum {
  width: 100%;
  height: 35px;
  padding: 5px 5px;
  margin: 0;
  box-sizing: border-box;
  border-radius: 4px;
  transition: opacity 0.2s;
  background-color: #fff;
  color: #666;
  font-size: 16px;
  border-top: 1px solid #dfe6ec;
  border-left: 1px solid #dfe6ec;
  border-right: 1px solid #dfe6ec;
}
.count-data {
  color: #f00;
  font-size: 20px;
}
.count-title {
  margin-left: 10px;
}
.right {
  position: absolute;
  right: 10px;
  margin-right: 10px;
}
.font-class-red {
  color: #f00;
}
.perfect_popper .el-form-item--mini.el-form-item {
  margin-bottom: 10px;
}
.el-form-item--mini.el-form-item {
  margin-bottom: 10px;
}
.el-tabs {
  margin-bottom: 5px;
}
</style>
<style>
.el-table .warning-cell {
  background-color: #ffa4a4 !important;
}
</style>

<script>
// import SelectDicts from '@/components/00_dict/select/SelectDicts'
import SelectDict from '@/components/00_dict/select/SelectDict'
import { getListApi } from '@/api/40_business/monitor/monitorbackuplog'
import { backupApi } from '@/api/40_business/monitor/monitor'
import constants_para from '@/common/constants/constants_para'
import resizeMixin from './mixin/listResizeHandlerMixin'
import Pagination from '@/components/Pagination'
import elDragDialog from '@/directive/el-drag-dialog'
import deepCopy from 'deep-copy'
import BackupConfirmDialog from '@/views/40_business/monitor/tabs/dialog/backupconfirm'
// import RestoreConfirmDialog from '@/views/40_business/monitorbackuplog/tabs/dialog/restoreconfirm'
import { restoreApi } from '@/api/40_business/monitor/monitorbackup'
import permission from '@/directive/permission/index.js' // 权限判断指令

export default {
  components: { Pagination, BackupConfirmDialog, SelectDict },
  directives: { elDragDialog, permission },
  mixins: [resizeMixin],
  props: {
    data: {
      type: Object,
      default: undefined
    }
  },
  data () {
    return {
      meDialogStatus: false,
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
      // 监听器
      watch: {
        unwatch_tempJson: null
      },
      dataJson: {
        tabs: {
          active: '0'
        },
        // 查询使用的json
        searchForm: {
          // 翻页条件
          pageCondition: deepCopy(this.PARAMETERS.PAGE_CONDITION),
          // 查询条件
          schedule_code: '',
          // settlement_status: null,
          waybill_contract_no: null,
          daterange1: [],
          daterange2: [],
          daterange3: [],
          daterange4: [],
          daterange: [],
          status_list: [],
          audit_ids: []
        },
        // 分页控件的json
        paging: deepCopy(this.PARAMETERS.PAGE_JSON),
        // table使用的json
        listData: null,
        // 单条数据 json的，初始化原始数据
        tempJsonOriginal: {
          id: undefined,
          name: '',
          config_key: '',
          value: '',
          descr: ''
        },
        // 单条数据 json
        currentJson: null,
        tempJson: null,
        inputSettings: {
          maxLength: {
            name: 20,
            config_key: 20,
            value: 50,
            descr: 200
          }
        },
        // 当前表格中的索引，第几条
        rowIndex: 0,
        // 当前选中的行（checkbox）
        multipleSelection: []
      },
      popSettingsData: {
        dialogFormVisible: false
      },
      // 页面设置json
      settings: {
        // 重置
        reset1: false,
        reset2: false,
        // 表格排序规则
        sortOrders: deepCopy(this.PARAMETERS.SORT_PARA),
        // 按钮状态
        btnShowStatus: {
          showUpdate: false,
          showView: false,
          showRestoreData: false
        },
        // loading 状态
        loading: true,
        tableHeight: this.setUIheight(),
        duration: 4000
      },
      popSettings: {
        // 弹出编辑页面
        one: {
          visible: false,
          props: {
            id: undefined,
            data: {},
            dialogStatus: ''
          }
        },
        // 弹出编辑页面
        two: {
          visible: false,
          props: {
            id: undefined,
            data: {},
            dialogStatus: ''
          }
        }
      },
      screenNum: 0
    }
  },
  computed: {
  },
  // 监听器
  watch: {
  },
  created () {
    // 初始化watch
    this.setWatch()
    this.getDataList()
  },
  mounted () {
    // 描绘完成
  },
  beforeUpdate () {
    // 重新布局表格
    this.$nextTick(() => {
      this.$refs.multipleTable.doLayout()
    })
  },
  destroyed () {
  },
  methods: {
    // 初始化查询页面
    setWatch () {
      this.unWatch()
      // 监听页面上面是否有修改，有修改按钮高亮
      this.watch.unwatch_tempJson = this.$watch('dataJson.multipleSelection', (newVal, oldVal) => {
        if (newVal.length > 0) {
          this.settings.btnShowStatus.showRestoreData = true
        } else {
          this.settings.btnShowStatus.showRestoreData = false
        }

        const _this = this
        _this.dataJson.multipleSelection.forEach(function (value, index, array) {
          if (value.flag === 'OK') {
            _this.settings.btnShowStatus.showRestoreData = false
          }
        })
      }, { deep: true }
      )

      this.watch.unwatch_tempJson1 = this.$watch('dataJson.searchForm', (newVal, oldVal) => {
        if (this.dataJson.searchForm.daterange === null) {
          this.dataJson.searchForm.start_time = null
          this.dataJson.searchForm.over_time = null
        }

        if (this.dataJson.searchForm.daterange1 === null) {
          this.dataJson.searchForm.in_time_start = null
          this.dataJson.searchForm.in_time_end = null
        }
        if (this.dataJson.searchForm.daterange2 === null) {
          this.dataJson.searchForm.out_audit_start = null
          this.dataJson.searchForm.out_audit_end = null
        }
      }, { deep: true }
      )
    },
    unWatch () {
      if (this.watch.unwatch_tempJson) {
        this.watch.unwatch_tempJson()
      }
    },
    // 获取行索引
    getRowIndex (row) {
      const _index = this.dataJson.listData.lastIndexOf(row)
      return _index
    },
    // 行点击
    handleRowClick (row) {
      this.dataJson.rowIndex = this.getRowIndex(row)
    },
    // 行双点击，仅在dialog中有效
    handleRowDbClick (row) {
      this.dataJson.rowIndex = this.getRowIndex(row)
      var _data = deepCopy(row)
      if (this.meDialogStatus) {
        this.$emit('rowDbClick', _data)
      }
    },
    handleSearch () {
      if (this.dataJson.searchForm.daterange !== null && this.dataJson.searchForm.daterange !== undefined && this.dataJson.searchForm.daterange !== '') {
        this.dataJson.searchForm.start_time = this.dataJson.searchForm.daterange[0]
        this.dataJson.searchForm.over_time = this.dataJson.searchForm.daterange[1]
      }
      // 完成时间
      if (this.dataJson.searchForm.daterange1 !== null && this.dataJson.searchForm.daterange1 !== undefined && this.dataJson.searchForm.daterange1 !== '') {
        this.dataJson.searchForm.in_time_start = this.dataJson.searchForm.daterange1[0]
        this.dataJson.searchForm.in_time_end = this.dataJson.searchForm.daterange1[1]
      }
      // 出库审核时间
      if (this.dataJson.searchForm.daterange2 !== null && this.dataJson.searchForm.daterange2 !== undefined && this.dataJson.searchForm.daterange2 !== '') {
        this.dataJson.searchForm.out_audit_start = this.dataJson.searchForm.daterange2[0]
        this.dataJson.searchForm.out_audit_end = this.dataJson.searchForm.daterange2[1]
      }
      // 入库审核时间
      if (this.dataJson.searchForm.daterange3 !== null && this.dataJson.searchForm.daterange3 !== undefined && this.dataJson.searchForm.daterange3 !== '') {
        this.dataJson.searchForm.in_audit_start = this.dataJson.searchForm.daterange3[0]
        this.dataJson.searchForm.in_audit_end = this.dataJson.searchForm.daterange3[1]
      }
      // 创建时间
      if (this.dataJson.searchForm.daterange4 !== null && this.dataJson.searchForm.daterange4 !== undefined && this.dataJson.searchForm.daterange4 !== '') {
        this.dataJson.searchForm.c_time_start = this.dataJson.searchForm.daterange4[0]
        this.dataJson.searchForm.c_time_end = this.dataJson.searchForm.daterange4[1]
      }

      // 查询
      this.dataJson.searchForm.pageCondition.current = 1
      this.dataJson.paging.current = 1
      this.getDataList()
      // 清空选择
      this.dataJson.multipleSelection = []
      this.$refs.multipleTable.clearSelection()
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
      this.dataJson.searchForm.id = null
      this.dataJson.searchForm.version = '1'
      // 查询逻辑
      this.settings.loading = true
      getListApi(this.dataJson.searchForm).then(response => {
        this.dataJson.listData = response.data.records
        this.dataJson.paging = response.data
        this.dataJson.paging.records = {}
      }).finally(() => {
        this.settings.loading = false
      })
    },
    // 重置查询区域
    doResetSearch () {
      const settlement_status = this.dataJson.searchForm.settlement_status

      this.dataJson.searchForm = this.$options.data.call(this).dataJson.searchForm
      this.dataJson.searchForm.settlement_status = settlement_status

      // 重置货主、客户、仓库等组件
      this.settings.reset1 = !this.settings.reset1
      this.settings.reset2 = !this.settings.reset2
    },

    // table选择框
    handleSelectionChange (val) {
      this.dataJson.multipleSelection = val
    },

    // 点击按钮 查看
    handleView () {
      this.popSettings.one.props.data = Object.assign({}, this.dataJson.currentJson)
      if (this.popSettings.one.props.data.id === undefined) {
        this.showErrorMsg('请选择一条数据')
        return
      }

      this.popSettings.one.props.data.searchForm = this.dataJson.searchForm
      this.dataJson.searchForm.id = this.popSettings.one.props.data.id
      const operate_tab_data = {
        operate_tab_info: { showEdit: true, name: '查看监管任务' },
        canEdit: false,
        editStatus: constants_para.STATUS_VIEW,
        data: this.dataJson.searchForm
      }
      this.$router.push({
        query: {
          p2: this.dataJson.currentJson.id
        }
      })

      this.$emit('emitView', operate_tab_data)
    },
    handleCurrentChange (row) {
      this.dataJson.currentJson = Object.assign({}, row) // copy obj
      this.dataJson.currentJson.index = this.getRowIndex(row)

      if (this.dataJson.currentJson.id !== undefined) {
        this.settings.btnShowStatus.showView = true
        this.settings.btnShowStatus.showUpdate = true
        this.settings.btnShowStatus.showCancel = true
      } else {
        this.settings.btnShowStatus.showView = false
        this.settings.btnShowStatus.showUpdate = false
        this.settings.btnShowStatus.showCancel = false
      }

      if (this.dataJson.currentJson.status === '0' || this.dataJson.currentJson.status === '8') {
        this.settings.btnShowStatus.showUpdate = false
      }

      if (this.dataJson.currentJson.status === '8') {
        this.settings.btnShowStatus.showCancel = false
      }

      // 装货完成才能审核
      if (this.dataJson.currentJson.status === '3' || this.dataJson.currentJson.status === '4' || this.dataJson.currentJson.status === '5' || this.dataJson.currentJson.status === '6' || this.dataJson.currentJson.status === '7') {
        this.settings.btnShowStatus.showAudit = true
      } else {
        this.settings.btnShowStatus.showAudit = false
      }

      // 设置dialog的返回
      this.$store.dispatch('popUpSearchDialog/selectedDataJson', Object.assign({}, row))
    },
    // Placeholder设置
    isPlaceholderShow (val) {
      if (this.isViewModel) {
        return ''
      } else {
        return val
      }
    },
    tableCellClassName ({ row, column, rowIndex, columnIndex }) {
      if (column.property === 'validate_vehicle' && row.validate_vehicle !== '1') {
        return 'warning-cell'
      }
      return ''
    },
    // 打开备份弹窗
    // handleBackup () {
    //   this.popSettings.two.visible = true
    //   this.popSettings.two.props.dialogStatus = this.PARAMETERS.STATUS_INSERT
    // },
    // 关闭备份弹窗
    // handleCloseDialogTwoCancel () {
    //   this.popSettings.two.visible = false
    // },
    // 备份弹窗确定
    // handleCloseDialogTwoOk (val) {
    //   this.settings.loading = true
    //   this.popSettings.two.visible = false
    //   // 开始作废
    //   backupApi(val).then((_data) => {
    //     this.$notify({
    //       title: '数据备份中',
    //       message: _data.message,
    //       type: 'success',
    //       duration: this.settings.duration
    //     })
    //     this.getDataList()
    //     // loading
    //   }, (_error) => {
    //     this.$notify({
    //       title: '数据备份失败',
    //       message: _error.message,
    //       type: 'error',
    //       duration: this.settings.duration
    //     })
    //   }).finally(() => {
    //     this.settings.loading = false
    //   })
    // }
    // 打开恢复弹窗
    // handleRestore () {
    //   this.popSettings.one.visible = true
    //   this.popSettings.one.props.dialogStatus = this.PARAMETERS.STATUS_INSERT
    // }
    // 关闭恢复弹窗
    // handleCloseDialogOneCancel () {
    //   this.popSettings.one.visible = false
    // },
    // // 恢复弹窗确定
    // handleCloseDialogOneOk (val) {
    //   this.settings.loading = true
    //   this.popSettings.one.visible = false
    //   // 开始作废
    //   restoreApi(val).then((_data) => {
    //     this.$notify({
    //       title: '数据恢复中',
    //       message: _data.message,
    //       type: 'success',
    //       duration: this.settings.duration
    //     })
    //     this.getDataList()
    //     // loading
    //   }, (_error) => {
    //     this.$notify({
    //       title: '数据恢复失败',
    //       message: _error.message,
    //       type: 'error',
    //       duration: this.settings.duration
    //     })
    //   }).finally(() => {
    //     this.settings.loading = false
    //   })
    // }
    handleBackupData () {
      // 没有选择任何数据的情况
      if (this.dataJson.multipleSelection.length <= 0) {
        this.$alert('请在表格中选择数据进行备份', '未选择数据错误', {
          confirmButtonText: '关闭',
          type: 'error'
        }).then(() => {
          this.settings.btnStatus.showRestoreData = false
        })
      } else {
        if (this.getOperaPerm('P_MONITOR:EXPORT_ALL')) {
          // 选择全部的时候
          this.$confirm('确认重新备份选中的监管任务吗？', '确认信息', {
            distinguishCancelAndClose: true,
            confirmButtonText: '取消',
            cancelButtonText: '确认'
          }).then(() => {
            // this.handleExportDataAll()
          }).catch(action => {
            // 右上角X
            if (action !== 'close') {
              // 当前页所选择的数据导出
              this.handleBackupDataSelection()
            }
          })
        } else {
          // 选择全部的时候
          this.$confirm('确认重新备份/恢复选中的监管任务吗？', '确认信息', {
            distinguishCancelAndClose: true,
            confirmButtonText: '取消',
            cancelButtonText: '重试'
          }).then(() => {
            // this.handleExportDataAll()
          }).catch(action => {
            // 右上角X
            if (action !== 'close') {
              // 当前页所选择的数据导出
              this.handleBackupDataSelection()
            }
          })
        }
      }
    },
    handleBackupDataSelection () {
      // loading
      this.settings.loading = true
      const selectionJsonBackup = []
      const selectionJsonRestore = []
      this.dataJson.multipleSelection.forEach(function (value, index, array) {
        if (value.type === '1') {
          selectionJsonBackup.push(value.monitor_id)
        } else if (value.type === '2') {
          selectionJsonRestore.push(value.monitor_id)
        }
      })
      // 开始备份
      if (selectionJsonBackup.length) {
        const param = {}
        param.ids = selectionJsonBackup
        backupApi(param).then(response => {
          this.settings.loading = false
        })
      } else if (selectionJsonRestore.length) {
        const param = {}
        param.ids = selectionJsonRestore
        // 开始导出
        restoreApi(param).then(response => {
          this.settings.loading = false
        })
      }
    }
  }
}
</script>
