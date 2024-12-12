<template>
  <div class="app-container">
    <div>
      <el-form
        ref="minusForm"
        :inline="true"
        :model="dataJson.searchForm"
        label-position="getLabelPosition()"
      >
        <el-form-item>
          <el-date-picker
            v-model="dataJson.searchForm.date"
            type="date"
            :clearable="false"
            :editable="false"
            style="width: 200px"
            placeholder="选择日期"
            :picker-options="pickerOptions"
            popper-class="picker-popper"
            @change="getDataList"
          />
        </el-form-item>
      </el-form>
    </div>
    <el-button-group>
      <el-button
        v-permission="'P_INVERTED_ORDER:EXPORT'"
        :disabled="!settings.btnStatus.showExport"
        type="primary"
        icon="el-icon-s-management"
        :loading="settings.loading"
        @click="handleExport"
      >导出
      </el-button>

    </el-button-group>

    <el-table
      ref="multipleTable"
      v-loading="settings.loading"
      :data="dataJson.listData"
      :element-loading-text="'正在拼命加载中...'"
      element-loading-background="rgba(255, 255, 255, 0.5)"
      :height="settings.tableHeight"
      columns_index_key="false"
      stripe
      border
      fit
      highlight-current-row
      :default-sort="{prop: 'opening_date', order: 'descending'}"
      style="width: 100%"
      @row-click="handleRowClick"
      @row-dblclick="handleRowDbClick"
      @current-change="handleCurrentChange"
      @sort-change="handleSortChange"
      @selection-change="handleSelectionChange"
    >
      <el-table-column
        type="selection"
        min-width="55"
        :auto-fit="true"
        prop="export_code"
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
        prop="auction_date"
        label="竞拍日期"
      />
      <el-table-column
        sortable="custom"
        :sort-orders="settings.sortOrders"
        :auto-fit="true"
        min-width="150"
        prop="opening_date"
        label="开库日期"
      />
      <el-table-column
        sortable="custom"
        :sort-orders="settings.sortOrders"
        :auto-fit="true"
        min-width="150"
        prop="contract_no"
        label="采购合同号"
      />
      <el-table-column
        sortable="custom"
        :sort-orders="settings.sortOrders"
        :auto-fit="true"
        min-width="150"
        prop="delivery_due_date"
        label="出库到期日"
      />
      <el-table-column
        sortable="custom"
        :sort-orders="settings.sortOrders"
        :auto-fit="true"
        min-width="150"
        prop="warehouse_name"
        label="实际存储库点"
      />
      <el-table-column
        sortable="custom"
        :sort-orders="settings.sortOrders"
        :auto-fit="true"
        min-width="150"
        prop="contract_quantity"
        label="合同量"
        align="right"
      >
        <template v-slot="scope">
          {{ scope.row.contract_quantity == null ? '0.0000' : formatNumber(scope.row.contract_quantity, true, 4) }}
        </template>
      </el-table-column>
      <el-table-column
        sortable="custom"
        :sort-orders="settings.sortOrders"
        :auto-fit="true"
        min-width="280"
        prop="actual_quantity"
        label="实际应出库数量（扣除升贴水数量）"
        align="right"
      >
        <template v-slot="scope">
          {{ scope.row.actual_quantity == null ? '0.0000' : formatNumber(scope.row.actual_quantity, true, 4) }}
        </template>
      </el-table-column>

      <el-table-column
        sortable="custom"
        :sort-orders="settings.sortOrders"
        :auto-fit="true"
        min-width="280"
        prop="remaining_quantity"
        label="当日剩余数量（已减除贴水）"
        align="right"
      >
        <template v-slot="scope">
          {{ scope.row.remaining_quantity == null ? '0.0000' : formatNumber(scope.row.remaining_quantity, true, 4) }}
        </template>
      </el-table-column>
      <el-table-column
        sortable="custom"
        min-width="200"
        :sort-orders="settings.sortOrders"
        :auto-fit="true"
        prop="actual_daily_quantity"
        label="实际日出库量"
        align="right"
      >
        <template v-slot="scope">
          {{
            scope.row.actual_daily_quantity == null ? '0.0000' : formatNumber(scope.row.actual_daily_quantity, true, 4)
          }}
        </template>
      </el-table-column>
      <el-table-column
        sortable="custom"
        :sort-orders="settings.sortOrders"
        :auto-fit="true"
        min-width="120"
        prop="accumulated_out_quantity"
        label="累计出库量"
        align="right"
      >
        <template v-slot="scope">
          <router-link :to="{name:constants_program.P_OUT,query:{contract_no:scope.row.contract_no,status:constants_dict.DICT_B_OUT_STATUS_TG,warehouse_type:constants_dict.DICT_M_WAREHOUSE_TYPE_ZX, fullpath:true}}"><a href="javascript:void(0)">{{ scope.row.accumulated_out_quantity == null ? '0.0000' : formatNumber(scope.row.accumulated_out_quantity, true, 4) }}</a></router-link>
        </template>
      </el-table-column>
      <el-table-column
        sortable="custom"
        min-width="200"
        :sort-orders="settings.sortOrders"
        :auto-fit="true"
        prop="plan_out_days"
        label="计划出库天数"
        align="right"
      />
      <el-table-column
        sortable="custom"
        min-width="200"
        :sort-orders="settings.sortOrders"
        :auto-fit="true"
        prop="actual_plan_out_days"
        label="实际出库耗用天数"
        align="right"
      />
      <el-table-column
        sortable="custom"
        min-width="200"
        :sort-orders="settings.sortOrders"
        :auto-fit="true"
        prop="plan_out_day"
        label="日出库计划"
        align="right"
      >
        <template v-slot="scope">
          {{ scope.row.plan_out_day == null ? '0' :scope.row.plan_out_day }}
        </template>
      </el-table-column>
      <el-table-column
        sortable="custom"
        min-width="200"
        :sort-orders="settings.sortOrders"
        :auto-fit="true"
        align="right"
        prop="plan_out_speed"
        label="出库进度"
      >
        <template v-slot="scope">
          {{ scope.row.plan_out_speed == null ? '0.00' : formatNumberTwo(scope.row.plan_out_speed, true, 2) }}%
        </template>
      </el-table-column>
    </el-table>

    <!--    <pagination-->
    <!--      ref="minusPaging"-->
    <!--      :total="dataJson.paging.total"-->
    <!--      :page.sync="dataJson.paging.current"-->
    <!--      :limit.sync="dataJson.paging.size"-->
    <!--      @pagination="getDataList"-->
    <!--    />-->
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
  background-color: #f5f7fa;
  color: #666;
  font-size: 16px;
  border-top: 1px solid #dfe6ec;
  border-left: 1px solid #dfe6ec;
  border-right: 1px solid #dfe6ec;
}

.right {
  position: absolute;
  right: 10px;
  margin-right: 10px;
}

.left {
  position: absolute;
  left: 10px;
  margin-left: 10px;
}

.count-data {
  color: #f00;
  font-size: 20px;
}

.count-title {
  margin-left: 10px;
}

br {
  display: block;
  margin: 10px;
  content: ' ';
}

/* sumData处的 el-link */
.el-link.el-link--default {
  font-size: 16px;
  vertical-align: top;
}

.el-form-item--mini.el-form-item {
  margin-bottom: 10px;
}

.el-tabs {
  margin-bottom: 5px;
}

.picker-popper .el-date-table .badge::after {
  position: absolute;
  content: "";
  right: 4px;
  top: 4px;
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background-color: red;
}
</style>
<style>
.picker-popper .el-date-table .badge::after {
  position: absolute;
  content: "";
  right: 4px;
  top: 4px;
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background-color: red;
}
</style>

<script>
import { exportAllApi, exportApi, getBadgeDateApi, getListApi } from '@/api/50_query/inverted_order/inverted_order'
import resizeMixin from './mixin/listResizeHandlerMixin'
import elDragDialog from '@/directive/el-drag-dialog'
import deepCopy from 'deep-copy'
import permission from '@/directive/permission/index.js' // 权限判断指令
import { mapState } from 'vuex'
import constants_program from '@/common/constants/constants_program'
import { parseTime } from '@/utils'
import constants_dict from '@/common/constants/constants_dict'

export default {
  components: { },
  directives: { elDragDialog, permission },
  mixins: [resizeMixin],
  props: {
    // 自己作为弹出框时的参数
    meDialogStatus: {
      type: Boolean,
      default: false
    },
    dataModel: {
      type: String,
      default: ''
    },
    data: {
      type: Object,
      default: null
    }
  },
  data () {
    const that = this
    return {
      // 红点日期
      badgeDate: [],
      // 今日日期
      date: null,
      pickerOptions: {
        // 禁用日期选择
        disabledDate: (time) => {
          // 日期是否禁止选择
          if (that.badgeDate.includes(parseTime(time, '{y}-{m}-{d}')) || (
            that.date != null && parseTime(that.date, '{y}-{m}-{d}') === parseTime(time, '{y}-{m}-{d}'))) {
            return false
          } else {
            return true
          }
        },
        // 日期的红点样式
        cellClassName: (time) => {
          if (that.badgeDate.includes(parseTime(time, '{y}-{m}-{d}'))) {
            return 'badge'
          }
        }
      },
      dataJson: {
        tabsCount: {
          all: 0,
          todo: 0
        },
        tabs: {
          active: '0'
        },
        // 查询使用的json
        searchForm: {
          // 翻页条件
          pageCondition: {
            current: 1,
            size: 20,
            sort: '-opening_date' // 排序
          },
          // 排序条件
          date: '',
          export_codes: []
        },
        todoSearchForm: {},
        // 分页控件的json
        paging: deepCopy(this.PARAMETERS.PAGE_JSON),
        // table使用的json
        listData: null,
        customerComboList: [],
        // 单条数据 json
        currentJson: null,
        tempJson: null,
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
        // 表格排序规则
        sortOrders: deepCopy(this.PARAMETERS.SORT_PARA),
        // 按钮状态
        btnStatus: {
          showView: false,
          showExport: false
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
        }
      },
      screenNum: 0,
      watch: {
        unwatch_tempJson: null
      }
    }
  },
  computed: {
    constants_dict () {
      return constants_dict
    },
    constants_program () {
      return constants_program
    },
    ...mapState('dictDefaultValue', ['dict_value']),
    // 是否为查看模式
    isViewModel () {
      if ((this.popSettingsData.dialogStatus === 'view') && (this.popSettingsData.dialogFormVisible === true)) {
        // 查看模式
        return true
      } else {
        // 非查看模式
        return false
      }
    }
  },
  // 监听器
  watch: {
    // 全屏loading
    'settings.loading': {
      handler (newVal, oldVal) {
        switch (newVal) {
          case true:
            this.showLoading('正在查询，请稍后...')
            break
          case false:
            this.closeLoading()
            break
        }
      }
    }
  },
  created () {
    this.init_List()
  },
  mounted () {
  },
  activated () {
    this.doResize()
  },
  destroyed () {
    this.unWatch()
  },
  methods: {
    init_List (para) {
      // 初始化watch
      this.setWatch()
      // 初始化查询
      this.createdDataList()
      // 数据初始化
      this.dataJson.tempJson = Object.assign({}, this.dataJson.tempJsonOriginal)
    },
    setWatch () {
      this.unWatch()
      // 监听页面上面是否有修改，有修改按钮高亮
      const _this = this
      _this.watch.unwatch_tempJson = _this.$watch('dataJson.multipleSelection', (newVal, oldVal) => {
        if (newVal.length > 0) {
          _this.settings.btnStatus.showExport = true
        } else {
          _this.settings.btnStatus.showExport = false
        }
      }, { deep: true }
      )
    },
    unWatch () {
      if (this.watch.unwatch_tempJson) {
        this.watch.unwatch_tempJson()
      }
    },
    // 弹出框设置初始化
    initDialogStatus () {
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
    handleSortChange (column) {
      // 服务器端排序
      if (column.order === 'ascending') {
        this.dataJson.searchForm.pageCondition.sort = column.prop
      } else if (column.order === 'descending') {
        this.dataJson.searchForm.pageCondition.sort = '-' + column.prop
      }
      this.getDataList()
    },
    createdDataList () {
      if (this.dataJson.searchForm.date === '' || this.dataJson.searchForm.date == null) {
        // 执行所有存在日数据的日期
        getBadgeDateApi().then(response => {
          this.badgeDate = response.data.badgeDate
          this.dataJson.searchForm.date = response.data.date
          this.date = response.data.date
        }).finally(() => {
          this.getDataList()
        })
      }
    },
    // 获取数据
    getDataList () {
      // 查询逻辑
      this.settings.loading = true
      // 第二版, 分页和条数查询分开
      getListApi(this.dataJson.searchForm).then(response => {
        this.dataJson.listData = response.data
        console.log(this.dataJson.listData)
        this.dataJson.paging = response.data
        // this.dataJson.paging.records = {}
      }).finally(() => {
        this.settings.loading = false
      })
    },
    // 重置查询区域
    doResetSearch () {
      this.dataJson.searchForm = this.$options.data.call(this).dataJson.searchForm
    },

    // 获取row-key
    getRowKeys (row) {
      return row.id
    },
    // table选择框
    handleSelectionChange (val) {
      this.dataJson.multipleSelection = val
    },
    handleCurrentChange (row) {
      this.dataJson.currentJson = Object.assign({}, row) // copy obj
      this.dataJson.currentJson.index = this.getRowIndex(row)

      this.settings.btnStatus.showView = false
      if (this.dataJson.currentJson.id !== undefined) {
        this.settings.btnStatus.showView = true
      }
    },
    // 导出按钮
    handleExport () {
      // 没有选择任何数据的情况
      if (this.dataJson.multipleSelection.length <= 0) {
        this.$alert('请在表格中选择数据进行导出', '未选择数据错误', {
          confirmButtonText: '关闭',
          type: 'error'
        }).then(() => {
          this.settings.btnStatus.showExport = false
        })
      } else if (this.dataJson.multipleSelection.length === this.dataJson.listData.length) {
        // 选择全部的时候
        this.$confirm('请选择：当前页数据导出，全数据导出？', '确认信息', {
          distinguishCancelAndClose: true,
          confirmButtonText: '全部导出',
          cancelButtonText: '当前页数据导出'
        }).then(() => {
          this.handleExportAllData()
        }).catch(action => {
          // 右上角X
          if (action !== 'close') {
            // 当前页所选择的数据导出
            this.handleExportSelectionData()
          }
        })
      } else {
        // 部分数据导出
        this.handleExportSelectionData()
      }
    },
    // 全部数据导出
    handleExportAllData () {
      // loading
      this.settings.loading = true
      // 开始导出
      exportAllApi(this.dataJson.searchForm).then(response => {
        this.settings.loading = false
      }).finally(() => {
        this.settings.loading = false
      })
    },
    // 部分数据导出
    handleExportSelectionData () {
      // loading
      this.settings.loading = true
      const selectionJson = []
      this.dataJson.multipleSelection.forEach(function (value, index, array) {
        selectionJson.push(value.export_code)
      })

      this.dataJson.searchForm.export_codes = selectionJson
      // 开始导出
      exportApi(this.dataJson.searchForm).then(response => {
        this.settings.loading = false
      })
    }
  }
}
</script>
