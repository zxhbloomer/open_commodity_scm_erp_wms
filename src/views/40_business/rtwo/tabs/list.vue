<template>
  <div class="app-container">
    <!-- <FloatMenu /> -->
    <el-tabs
      ref="minusTabs"
      v-model="dataJson.tabs.active"
      type="card"
      @tab-click="handleTabsClick"
    >
      <el-tab-pane>
        <template slot="label">我的待办
          <el-badge
            :value="dataJson.tabsCount.todo"
            type="danger"
          />
        </template>
      </el-tab-pane>
      <el-tab-pane>
        <template slot="label">我的已办</template>
      </el-tab-pane>
      <el-tab-pane>
        <template slot="label">全部</template>
      </el-tab-pane>
    </el-tabs>
    <div>
      <el-form
        ref="minusForm"
        :inline="true"
        :model="dataJson.searchForm"
        label-position="getLabelPosition()"
      >
        <el-form-item label="">
          <el-input
            v-model.trim="dataJson.searchForm.code"
            clearable
            placeholder="工单编号"
            @keyup.enter.native="handleSearch"
          />
        </el-form-item>

        <el-form-item label="">
          <el-input
            v-model.trim="dataJson.searchForm.delivery_order_code"
            clearable
            placeholder="订单编号"
            @keyup.enter.native="handleSearch"
          />
        </el-form-item>

        <el-form-item label="">
          <select-dict
            v-model="dataJson.searchForm.status"
            :para="CONSTANTS.DICT_B_WO_STATUS"
            init-placeholder="状态"
            :disabled="isViewModel"
          />
        </el-form-item>

        <el-form-item>
          <select-warehouse
            v-model.trim="dataJson.searchForm.wc_warehouse_name"
            :reset="settings.reset3"
            placeholder="仓库"
            placement="left"
            @keyup.enter.native="handleSearch"
            @onReturnData="handleWarehouseReturnData"
          />
        </el-form-item>

        <el-form-item>
          <el-input
            v-model.trim="dataJson.searchForm.product_goods_name"
            clearable
            placeholder="产成品,副产品名称或编码"
            @keyup.enter.native="handleSearch"
          />
        </el-form-item>

        <el-form-item>
          <el-input
            v-model.trim="dataJson.searchForm.material_goods_name"
            clearable
            placeholder="原材料名称或编码"
            @keyup.enter.native="handleSearch"
          />
        </el-form-item>
        <el-form-item>
          <select-dict
            v-model="dataJson.searchForm.batch"
            :para="CONSTANTS.DICT_BUSINESS_START_TIME"
            init-placeholder="业务启动日期"
          />
        </el-form-item>
        <el-form-item>
          <el-date-picker
            v-model="dataJson.searchForm.daterange"
            value-format="yyyy-MM-dd"
            style="width: 250px"
            type="daterange"
            align="right"
            unlink-panels
            range-separator="至"
            start-placeholder="创建开始日期"
            end-placeholder="结束日期"
            :picker-options="pickerOptions"
            @keyup.enter.native="handleSearch"
          />
        </el-form-item>
        <el-form-item style="float:right">
          <el-button
            v-popover:popover
            type="primary"
            plain
            @click="doResetSearch"
          >重置</el-button>
        </el-form-item>

        <el-form-item style="float:right">
          <el-button
            type="primary"
            plain
            icon="el-icon-search"
            :loading="settings.loading"
            @click="handleSearch"
          >查询</el-button>
        </el-form-item>

      </el-form>
    </div>
    <el-button-group>
      <el-button
        v-permission="'P_RT_WO:ADD'"
        type="primary"
        icon="el-icon-circle-plus-outline"
        :loading="settings.loading"
        @click="handleInsert"
      >
        新增
      </el-button>
      <el-button
        v-permission="'P_RT_WO:UPDATE'"
        :disabled="!settings.btnStatus.showUpdate"
        type="primary"
        icon="el-icon-zoom-in"
        :loading="settings.loading"
        @click="handleEdit"
      >编辑</el-button>
      <el-button
        v-permission="'P_RT_WO:SUBMIT'"
        :disabled="!settings.btnStatus.showSubmit"
        type="primary"
        icon="el-icon-zoom-in"
        :loading="settings.loading"
        @click="handleSubmit"
      >提交</el-button>
      <el-button
        v-permission="'P_RT_WO:AUDIT'"
        :disabled="!settings.btnStatus.showAudit"
        type="primary"
        icon="el-icon-zoom-in"
        :loading="settings.loading"
        @click="handleAudit"
      >审核</el-button>
      <el-button
        v-permission="'P_RT_WO:REJECT'"
        :disabled="!settings.btnStatus.showReject"
        type="primary"
        icon="el-icon-zoom-in"
        :loading="settings.loading"
        @click="handleReject"
      >驳回</el-button>
      <el-button
        v-permission="'P_RT_WO:CANCEL'"
        :disabled="!settings.btnStatus.showCancel"
        type="primary"
        icon="el-icon-zoom-in"
        :loading="settings.loading"
        @click="handleCancel"
      >作废</el-button>
      <el-button
        v-permission="'P_RT_WO:INFO'"
        :disabled="!settings.btnStatus.showView"
        type="primary"
        icon="el-icon-zoom-in"
        :loading="settings.loading"
        @click="handleView"
      >查看</el-button>
      <el-button
        v-permission="'P_RT_WO:EXPORT'"
        :disabled="!settings.btnStatus.showExport"
        type="primary"
        icon="el-icon-zoom-in"
        :loading="settings.loading"
        @click="handleExport"
      >导出</el-button>
    </el-button-group>
    <el-table
      ref="multipleTable"
      v-loading="settings.loading"
      :data="dataJson.listData"
      :element-loading-text="'正在拼命加载中...'"
      element-loading-background="rgba(255, 255, 255, 0.5)"
      :height="settings.tableHeight"
      columns_index_key="false"
      :cell-class-name="getCellClass"
      stripe
      border
      fit
      highlight-current-row
      :default-sort="{prop: 'u_time', order: 'descending'}"
      style="width: 100%"
      @row-click="handleRowClick"
      @row-dblclick="handleRowDbClick"
      @current-change="handleCurrentChange"
      @sort-change="handleSortChange"
      @selection-change="handleSelectionChange"
    >
      <el-table-column
        type="selection"
        width="55"
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
        min-width="140"
        prop="code"
        label="工单编号"
      />
      <el-table-column
        sortable="custom"
        :sort-orders="settings.sortOrders"
        :auto-fit="true"
        min-width="120"
        prop="delivery_order_code"
        label="订单编号"
      />
      <el-table-column
        sortable="custom"
        :sort-orders="settings.sortOrders"
        :auto-fit="true"
        min-width="120"
        prop="wc_warehouse_name"
        label="仓库"
      />
      <el-table-column
        sortable="custom"
        :sort-orders="settings.sortOrders"
        :auto-fit="true"
        min-width="90"
        prop="status_name"
        label="状态"
      />
      <el-table-column
        label="产成品"
        align="center"
        :merge-group="true"
      >
        <el-table-column
          :merge-cells="true"
          min-width="100"
          label="物料名称"
        >
          <template slot-scope="scope">
            <div
              v-for="(item, index) in scope.row.product_list"
              :key="index"
              :class="getClass(index, scope.row.product_list.length)"
            > {{ item.goods_name }} </div>
          </template>
        </el-table-column>
        <el-table-column
          :merge-cells="true"
          min-width="80"
          label="规格"
        >
          <template slot-scope="scope">
            <div
              v-for="(item, index) in scope.row.product_list"
              :key="index"
              :class="getClass(index, scope.row.product_list.length)"
            > {{ item.spec }} </div>
          </template>
        </el-table-column>
        <el-table-column
          align="right"
          :merge-cells="true"
          min-width="100"
          label="生产入库数量"
        >
          <template slot-scope="scope">
            <div
              v-for="(item, index) in scope.row.product_list"
              :key="index"
              :class="getClass(index, scope.row.product_list.length)"
            > {{ formatNumber3(item.wo_qty) }} </div>
          </template>
        </el-table-column>
      </el-table-column>
      <el-table-column
        label="副产品"
        align="center"
        :merge-group="true"
      >
        <el-table-column
          :merge-cells="true"
          min-width="100"
          label="物料名称"
        >
          <template slot-scope="scope">
            <div
              v-for="(item, index) in scope.row.coproduct_list"
              :key="index"
              :class="getClass(index, scope.row.coproduct_list.length)"
            > {{ item.goods_name }} </div>
          </template>
        </el-table-column>
        <el-table-column
          :merge-cells="true"
          min-width="80"
          label="规格"
        >
          <template slot-scope="scope">
            <div
              v-for="(item, index) in scope.row.coproduct_list"
              :key="index"
              :class="getClass(index, scope.row.coproduct_list.length)"
            > {{ item.spec }} </div>
          </template>
        </el-table-column>
        <el-table-column
          align="right"
          :merge-cells="true"
          min-width="100"
          label="生产入库数量"
        >
          <template slot-scope="scope">
            <div
              v-for="(item, index) in scope.row.coproduct_list"
              :key="index"
              :class="getClass(index, scope.row.coproduct_list.length)"
            > {{ formatNumber3(item.wo_qty) }} </div>
          </template>
        </el-table-column>
      </el-table-column>

      <el-table-column
        label="原材料"
        align="center"
        :merge-group="true"
      >
        <el-table-column
          :merge-cells="true"
          min-width="80"
          label="物料名称"
        >
          <template slot-scope="scope">
            <div
              v-for="(item, index) in scope.row.material_list"
              :key="index"
              :class="getClass(index, scope.row.material_list.length)"
            > {{ item.goods_name }} </div>
          </template>
        </el-table-column>
        <el-table-column
          :merge-cells="true"
          min-width="80"
          label="规格"
        >
          <template slot-scope="scope">
            <div
              v-for="(item, index) in scope.row.material_list"
              :key="index"
              :class="getClass(index, scope.row.material_list.length)"
            > {{ item.spec }} </div>
          </template>
        </el-table-column>
        <el-table-column
          align="right"
          :merge-cells="true"
          min-width="100"
          label="领料出库数量"
        >
          <template slot-scope="scope">
            <div
              v-for="(item, index) in scope.row.material_list"
              :key="index"
              :class="getClass(index, scope.row.material_list.length)"
            > {{ formatNumber3(item.wo_qty) }} </div>
          </template>
        </el-table-column>
      </el-table-column>
      <el-table-column
        sortable="custom"
        :sort-orders="settings.sortOrders"
        :auto-fit="true"
        min-width="120"
        prop="remark"
        label="作废理由"
      />
      <el-table-column
        sortable="custom"
        :sort-orders="settings.sortOrders"
        :auto-fit="true"
        min-width="110"
        prop="c_name"
        label="创建人"
      />
      <el-table-column
        sortable="custom"
        :auto-fit="true"
        min-width="185"
        :sort-orders="settings.sortOrders"
        prop="c_time"
        label="创建时间"
      >
        <template v-slot="scope">
          {{ scope.row.c_time == null?'':formatDateTime(scope.row.c_time) }}
        </template>
      </el-table-column>
      <el-table-column
        sortable="custom"
        :sort-orders="settings.sortOrders"
        :auto-fit="true"
        min-width="110"
        prop="u_name"
        label="更新人"
      />
      <el-table-column
        sortable="custom"
        :auto-fit="true"
        min-width="185"
        :sort-orders="settings.sortOrders"
        prop="u_time"
        label="更新时间"
      >
        <template v-slot="scope">
          {{ scope.row.u_time == null?'':formatDateTime(scope.row.u_time) }}
        </template>
      </el-table-column>
      <el-table-column
        sortable="custom"
        :sort-orders="settings.sortOrders"
        :auto-fit="true"
        min-width="110"
        prop="e_name"
        label="审核人"
      />
      <el-table-column
        sortable="custom"
        :auto-fit="true"
        min-width="185"
        :sort-orders="settings.sortOrders"
        prop="e_time"
        label="审核时间"
      >
        <template v-slot="scope">
          {{ scope.row.e_time == null?'':formatDateTime(scope.row.e_time) }}
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
    <cancel-confirm-dialog
      v-if="popSettings.one.visible"
      :data="popSettings.one.props.data"
      :visible="popSettings.one.visible"
      :dialog-status="popSettings.one.props.dialogStatus"
      @closeMeOk="handleCloseDialogOneOk"
      @closeMeCancel="handleCloseDialogOneCancel"
    />
  </div>

</template>

<style scoped>
.merge_cells0 {
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: normal;
  word-break: break-all;
  line-height: 23px;
  padding-left: 10px;
  padding-right: 10px;
  padding-bottom: 6px;
}
.merge_cells1 {
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: normal;
  word-break: break-all;
  line-height: 23px;
  padding-left: 10px;
  padding-right: 10px;
  padding-bottom: 6px;
  border-bottom: 1px solid #dfe6ec;
}
.merge_cells2 {
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: normal;
  word-break: break-all;
  line-height: 23px;
  padding-left: 10px;
  padding-right: 10px;
  padding-top: 6px;
  padding-bottom: 6px;
  border-bottom: 1px solid #dfe6ec;
}
.merge_cells3 {
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: normal;
  word-break: break-all;
  line-height: 23px;
  padding-left: 10px;
  padding-right: 10px;
  padding-top: 6px;
}
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
  margin: 1px;
  content: ' ';
}
.el-form-item--mini.el-form-item {
  margin-bottom: 10px;
}
</style>
<style>
</style>

<script>
import SelectDict from '@/components/00_dict/select/SelectDict'
import { getPageListApi, getTodoCountApi, submitApi, auditApi, rejectApi, cancelApi, exportApi } from '@/api/40_business/rtwo/rtwo'
import constants_para from '@/common/constants/constants_para'
import constants_type from '@/common/constants/constants_dict'
import resizeMixin from './mixin/listResizeHandlerMixin'
import Pagination from '@/components/Pagination'
import elDragDialog from '@/directive/el-drag-dialog'
import deepCopy from 'deep-copy'
import permission from '@/directive/permission/index.js'
import cancelConfirmDialog from '@/views/40_business/rtwo/tabs/dialog/cancelconfirm'
import SelectWarehouse from '@/views/30_wms/warehouse/selectgrid/selectWarehouseLocationBinForSearch'
import { mapState } from 'vuex'

export default {
  components: { Pagination, SelectDict, cancelConfirmDialog, SelectWarehouse },
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
    },
    editStatus: {
      type: String,
      default: ''
    }
  },
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
        tabsCount: {
          all: 0,
          todo: 0
        },
        tabs: {
          active: '2'
        },
        // 查询使用的json
        searchForm: {
          code: '',
          delivery_order_code: '',
          // 翻页条件
          pageCondition: deepCopy(this.PARAMETERS.PAGE_CONDITION),
          // 查询条件
          product_goods_name: null,
          material_goods_name: null,
          status: null,
          owner_name: null,
          batch: '',
          active_tabs_index: 0 // 当前被激活的页签
        },
        todoSearchForm: {},
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
          showUpdate: false,
          showView: false,
          showSubmit: false,
          showExport: false,
          showAudit: false,
          showReject: false,
          showCancel: false
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
      watch: {
        unwatch_tempJson: null
      }
    }
  },
  computed: {
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
    'data': {
      deep: true,
      handler (newVal) {
        if (this.editStatus === this.PARAMETERS.STATUS_UPDATE) {
          this.dataJson.listData.forEach((item, index) => {
            if (item.id === newVal.id) {
              this.dataJson.listData.splice(index, 1, newVal)
            }
          })
        }
        if (this.editStatus === this.PARAMETERS.STATUS_INSERT) {
          this.dataJson.listData.unshift(newVal)
        }
      }
    }
  },
  created () {
    this.dataJson.searchForm.batch = this.dict_value
    this.init_List()
  },

  mounted () {},
  activated () {
    this.doResize()
  },
  destroyed () {
    this.unWatch()
  },
  methods: {
    init_List () {
      // 初始化watch
      this.setWatch()
      // 初始化查询
      this.getDataList()
      // 数据初始化
      this.dataJson.tempJson = Object.assign({}, this.dataJson.tempJsonOriginal)
    },
    setWatch () {
      this.unWatch()
      // 监听页面上面是否有修改，有修改按钮高亮
      const _this = this
      _this.watch.unwatch_tempJson = _this.$watch('dataJson.multipleSelection', (newVal, oldVal) => {
        if (newVal.length > 0) {
          _this.settings.btnStatus.showSubmit = true
          _this.settings.btnStatus.showAudit = true
          _this.settings.btnStatus.showReject = true
          _this.settings.btnStatus.showExport = true
        } else {
          _this.settings.btnStatus.showSubmit = false
          _this.settings.btnStatus.showAudit = false
          _this.settings.btnStatus.showReject = false
          _this.settings.btnStatus.showExport = false
        }

        _this.dataJson.multipleSelection.forEach(function (value, index, array) {
          // 只有制单状态, 审核驳回状态可以提交
          if (value.status !== constants_type.DICT_B_WO_STATUS_1 && value.status !== constants_type.DICT_B_WO_STATUS_4) {
            _this.settings.btnStatus.showSubmit = false
          }
          // 只有已提交的可以审核
          if (value.status !== constants_type.DICT_B_WO_STATUS_2) {
            _this.settings.btnStatus.showAudit = false
            _this.settings.btnStatus.showReject = false
          }
        })
      }, { deep: true }
      )
      this.watch.unwatch_tempJson1 = this.$watch('dataJson.searchForm', (newVal, oldVal) => {
        if (this.dataJson.searchForm.daterange === null) {
          this.dataJson.searchForm.start_time = null
          this.dataJson.searchForm.over_time = null
        }

        if (this.dataJson.searchForm.ed_dt === null) {
          this.dataJson.searchForm.e_dt_start = null
          this.dataJson.searchForm.e_dt_end = null
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
    handleSearch () {
      if (this.dataJson.searchForm.daterange !== null && this.dataJson.searchForm.daterange !== undefined && this.dataJson.searchForm.daterange !== '') {
        this.dataJson.searchForm.start_time = this.dataJson.searchForm.daterange[0]
        this.dataJson.searchForm.over_time = this.dataJson.searchForm.daterange[1]
      }
      if (this.dataJson.searchForm.ed_dt !== null && this.dataJson.searchForm.ed_dt !== undefined && this.dataJson.searchForm.ed_dt !== '') {
        this.dataJson.searchForm.e_dt_start = this.dataJson.searchForm.ed_dt[0]
        this.dataJson.searchForm.e_dt_end = this.dataJson.searchForm.ed_dt[1]
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
      // 查询逻辑
      this.settings.loading = true
      getPageListApi(this.dataJson.searchForm).then(response => {
        this.dataJson.listData = response.data.records
        this.dataJson.paging = response.data
        this.dataJson.paging.records = {}
      }).finally(() => {
        this.settings.loading = false
      })

      // 查询逻辑
      getTodoCountApi(this.dataJson.searchForm).then(response => {
        if (response.data !== null) {
          this.dataJson.tabsCount.todo = response.data
        } else {
          this.dataJson.tabsCount.todo = 0
        }
      }).finally(() => {
      })
    },
    // 重置查询区域
    doResetSearch () {
      const todo_status = this.dataJson.searchForm.todo_status
      this.dataJson.searchForm = this.$options.data.call(this).dataJson.searchForm
      this.dataJson.searchForm.todo_status = todo_status
      this.dataJson.searchForm.warehouse_name = ''
      this.dataJson.searchForm.owner_name = ''
      this.dataJson.searchForm.consignor_name = ''
      this.dataJson.searchForm.customer_name = ''
      this.dataJson.searchForm.ed_dt = []
    },

    // 获取row-key
    getRowKeys (row) {
      return row.id
    },
    // table选择框
    handleSelectionChange (val) {
      this.dataJson.multipleSelection = val
    },
    // 点击按钮 新增
    handleInsert () {
      const operate_tab_data = {
        operate_tab_info: { show: true, name: '新增生产' },
        canEdit: true,
        editStatus: constants_para.STATUS_INSERT
      }
      this.$emit('emitInsert', operate_tab_data)
    },
    // 点击按钮 更新
    handleUpdate () {
      this.popSettings.one.props.data = Object.assign({}, this.dataJson.currentJson)
      if (this.popSettings.one.props.data.status === '1') {
        this.showErrorMsg('已提交的数据不允许操作')
        return
      }
      if (this.popSettings.one.props.data.status === '2') {
        this.showErrorMsg('已审核通过的数据不允许操作')
        return
      }
      if (this.popSettings.one.props.data.status === '4') {
        this.showErrorMsg('已作废的数据不允许操作')
        return
      }
      if (this.popSettings.one.props.data.id === undefined) {
        this.showErrorMsg('请选择一条数据')
        return
      }
      // 更新
      const operate_tab_data = {
        operate_tab_info: { show: true, name: '修改入库单' },
        canEdit: true,
        editStatus: constants_para.STATUS_UPDATE,
        data: this.popSettings.one.props.data
      }

      this.$emit('emitUpdate', operate_tab_data)
    },
    // 点击按钮 查看
    handleView () {
      this.popSettings.one.props.data = Object.assign({}, this.dataJson.currentJson)
      if (this.popSettings.one.props.data.id === undefined) {
        this.showErrorMsg('请选择一条数据')
        return
      }
      this.popSettings.one.props.data.warehouse_id = this.popSettings.one.props.data.product_list[0].warehouse_id
      const operate_tab_data = {
        operate_tab_info: { show: true, name: '查看生产配方' },
        canEdit: false,
        editStatus: constants_para.STATUS_VIEW,
        data: this.popSettings.one.props.data
      }

      this.$router.push({
        query: {}
      })

      this.$emit('emitView', operate_tab_data)
    },

    handleCurrentChange (row) {
      this.dataJson.currentJson = Object.assign({}, row) // copy obj
      this.dataJson.currentJson.index = this.getRowIndex(row)

      if (this.dataJson.currentJson.id !== undefined) {
        this.settings.btnStatus.showView = true
        this.settings.btnStatus.showCancel = true
        if (this.dataJson.currentJson.status === constants_type.DICT_B_WO_STATUS_5) {
          // 已作废的状态不可重复作废
          this.settings.btnStatus.showCancel = false
        }
        // 只有制单和审核驳回的可编辑
        if (this.dataJson.currentJson.status !== constants_type.DICT_B_WO_STATUS_1 && this.dataJson.currentJson.status !== constants_type.DICT_B_WO_STATUS_4) {
          this.settings.btnStatus.showUpdate = false
        } else {
          this.settings.btnStatus.showUpdate = true
        }
      } else {
        this.settings.btnStatus.showUpdate = false
        this.settings.btnStatus.showCancel = false
      }

      // 设置dialog的返回
      this.$store.dispatch('popUpSearchDialog/selectedDataJson', Object.assign({}, row))
    },
    // 点击按钮 查看
    handleEdit () {
      this.popSettings.one.props.data = Object.assign({}, this.dataJson.currentJson)
      if (this.popSettings.one.props.data.id === undefined) {
        this.showErrorMsg('请选择一条数据')
        return
      }
      // 获取产成品仓库信息
      this.popSettings.one.props.data.warehouse_id = this.popSettings.one.props.data.product_list[0].warehouse_id
      const operate_tab_data = {
        operate_tab_info: { show: true, name: '编辑生产配方' },
        canEdit: false,
        editStatus: constants_para.STATUS_UPDATE,
        data: this.popSettings.one.props.data
      }

      this.$router.push({
        query: {}
      })

      this.$emit('emitEdit', operate_tab_data)
    },
    // 提交
    handleSubmit () {
      // 没有选择任何数据的情况
      if (this.dataJson.multipleSelection.length <= 0) {
        this.$alert('请在表格中选择数据进行提交', '未选择数据错误', {
          confirmButtonText: '关闭',
          type: 'error'
        }).then(() => {
          // this.settings.btnStatus.showDelete = false
        })
      } else {
        // 选中数据提交
        this.handleSubmitSelectionData()
      }
    },

    handleSubmitSelectionData () {
      // loading
      this.settings.loading = true
      const selectionJson = []
      this.dataJson.multipleSelection.forEach(function (value, index, array) {
        selectionJson.push({ 'id': value.id })
      })
      // 开始提交
      submitApi(selectionJson).then((_data) => {
        this.$notify({
          title: '提交成功',
          message: _data.message,
          type: 'success',
          duration: this.settings.duration
        })
        this.getDataList()
        // loading
      }, (_error) => {
        this.$notify({
          title: '提交错误',
          message: _error.message,
          type: 'error',
          duration: this.settings.duration
        })
      }).finally(() => {
        this.settings.loading = false
      })
    },
    // 审核
    handleAudit () {
      // 没有选择任何数据的情况
      if (this.dataJson.multipleSelection.length <= 0) {
        this.$alert('请在表格中选择数据进行审核', '未选择数据错误', {
          confirmButtonText: '关闭',
          type: 'error'
        }).then(() => {
          // this.settings.btnStatus.showDelete = false
        })
      } else {
        // 选中数据审核
        this.handleAuditSelectionData()
      }
    },
    // 审核数据
    handleAuditSelectionData () {
      // loading
      this.settings.loading = true
      const selectionJson = []
      this.dataJson.multipleSelection.forEach(function (value, index, array) {
        selectionJson.push({ 'id': value.id })
      })
      // 开始审核
      auditApi(selectionJson).then((_data) => {
        this.$notify({
          title: '审核成功',
          message: _data.message,
          type: 'success',
          duration: this.settings.duration
        })
        this.getDataList()
        // loading
      }, (_error) => {
        this.$notify({
          title: '审核错误',
          message: _error.message,
          type: 'error',
          duration: this.settings.duration
        })
      }).finally(() => {
        this.settings.loading = false
      })
    },
    // 驳回
    handleReject () {
      // 没有选择任何数据的情况
      if (this.dataJson.multipleSelection.length <= 0) {
        this.$alert('请在表格中选择数据进行驳回', '未选择数据错误', {
          confirmButtonText: '关闭',
          type: 'error'
        }).then(() => {
          this.settings.btnStatus.showDelete = false
        })
      } else {
        // 选中数据驳回
        this.handleRejectSelectionData()
      }
    },
    // 驳回数据
    handleRejectSelectionData () {
      // loading
      this.settings.loading = true
      const selectionJson = []
      this.dataJson.multipleSelection.forEach(function (value, index, array) {
        selectionJson.push({ 'id': value.id })
      })
      // 开始驳回
      rejectApi(selectionJson).then((_data) => {
        this.$notify({
          title: '驳回成功',
          message: _data.message,
          type: 'success',
          duration: this.settings.duration
        })
        this.getDataList()
        // loading
      }, (_error) => {
        this.$notify({
          title: '驳回错误',
          message: _error.message,
          type: 'error',
          duration: this.settings.duration
        })
      }).finally(() => {
        this.settings.loading = false
      })
    },
    // 作废按钮
    handleCancel () {
      this.popSettings.one.visible = true
      this.popSettings.one.props.dialogStatus = this.PARAMETERS.STATUS_UPDATE
      this.popSettings.one.props.data = this.dataJson.currentJson
      this.popSettings.one.visible = true
    },
    // 作废确认
    handleCloseDialogOneOk (val) {
      this.settings.loading = true
      // 作废
      this.popSettings.one.props.data = Object.assign({}, this.dataJson.currentJson)
      const selectionJson = { 'id': this.popSettings.one.props.data.id, 'remark': val.remark }
      this.showLoading('正在保存，请稍后...')
      // 开始作废
      cancelApi(selectionJson).then((_data) => {
        this.$notify({
          title: '作废成功',
          message: _data.message,
          type: 'success',
          duration: this.settings.duration
        })
        this.popSettings.one.visible = false
        this.getDataList()
        // loading
      }, (_error) => {
        this.$notify({
          title: '作废错误',
          message: _error.message,
          type: 'error',
          duration: this.settings.duration
        })
      }).finally(() => {
        this.settings.loading = false
        this.closeLoading()
      })
    },
    getCellClass (row) {
      // row.columnIndex
      return 'td' + row.columnIndex// 给第2个td里面添加goodsInfo的类名
    },
    handleCloseDialogOneCancel () {
      this.popSettings.one.visible = false
    },
    // 仓库
    handleWarehouseReturnData (val) {
      if (val === null) {
        // 仓库
        this.dataJson.searchForm.wc_warehouse_id = null
        this.dataJson.searchForm.wc_warehouse_name = null
      } else {
        // 仓库
        this.dataJson.searchForm.wc_warehouse_id = val.warehouse_id
        this.dataJson.searchForm.wc_warehouse_name = val.warehouse_name
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
          this.settings.btnStatus.showExportData = false
        })
      } else if (this.dataJson.multipleSelection.length === this.dataJson.listData.length) {
        if (this.getOperaPerm('P_RT_WO:EXPORT')) {
          // 选择全部的时候
          this.$confirm('请选择：当前页数据导出，全数据导出？', '确认信息', {
            distinguishCancelAndClose: true,
            confirmButtonText: '全部导出',
            cancelButtonText: '当前页数据导出'
          }).then(() => {
            this.handleExportDataAll()
          }).catch(action => {
            // 右上角X
            if (action !== 'close') {
              // 当前页所选择的数据导出
              this.handleExportDataSelection()
            }
          })
        } else {
          // 选择全部的时候
          this.$confirm('请选择：当前页数据导出，全数据导出？', '确认信息', {
            distinguishCancelAndClose: true,
            confirmButtonText: '全部导出',
            cancelButtonText: '当前页数据导出'
          }).then(() => {
            this.handleExportDataAll()
          }).catch(action => {
            // 右上角X
            if (action !== 'close') {
              // 当前页所选择的数据导出
              this.handleExportDataSelection()
            }
          })
        }
      } else {
        // 部分数据导出
        this.handleExportDataSelection()
      }
    },
    // 全部数据导出
    handleExportDataAll () {
      // loading
      this.settings.loading = true
      // 开始导出
      exportApi(this.dataJson.searchForm).then(response => {
        this.settings.loading = false
      }).finally(() => {
        this.settings.loading = false
      })
    },
    // 部分数据导出
    handleExportDataSelection () {
      // loading
      this.settings.loading = true
      const selectionJson = []
      this.dataJson.multipleSelection.forEach(function (value, index, array) {
        selectionJson.push(value.id)
      })
      const data = { ids: selectionJson }
      // 开始导出
      exportApi(data).then(response => {
        this.settings.loading = false
      })
    },
    handleTabsClick (tab, event) {
      if (this.dataJson.searchForm.active_tabs_index === tab.index) {
        return
      }
      switch (tab.index) {
        case '0':
          // 待办
          this.dataJson.searchForm.todo_status = '0'
          break
        case '1':
          // 已办
          this.dataJson.searchForm.todo_status = '1'
          break
        case '2':
          // 所有数据
          this.dataJson.searchForm.todo_status = '2'
          break
      }
      this.getDataList()
      this.dataJson.searchForm.active_tabs_index = tab.index
    },
    getClass (index, length) {
      if (length === 1) {
        return 'merge_cells0 cell'
      } else if (index === 0) {
        return 'merge_cells1 cell'
      } else if (index === length - 1) {
        return 'merge_cells3 cell'
      } else {
        return 'merge_cells2 cell'
      }
    }
  }
}
</script>
