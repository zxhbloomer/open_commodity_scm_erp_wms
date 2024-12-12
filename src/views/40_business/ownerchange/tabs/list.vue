<template>
  <div class="app-container">
    <FloatMenu />
    <el-tabs
      ref="minusTabs"
      v-model="dataJson.tabs.active"
      type="card"
      class=""
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
        <template slot="label">我的已办

        </template>
      </el-tab-pane>
      <el-tab-pane>
        <template slot="label">全部
        </template>
      </el-tab-pane>
    </el-tabs>
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
          placeholder="货权转移单号"
          @keyup.enter.native="handleSearch"
        />
      </el-form-item>
      <el-form-item label="">
        <el-select
          v-model="dataJson.searchForm.out_owner_id"
          :placeholder="isPlaceholderShow('请选择原货主')"
          :disabled="isViewModel"
          filterable
          clearable
        >
          <el-option
            v-for="item in dataJson.ownerComboList"
            :key="item.id"
            :label="item.short_name"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="">
        <el-select
          v-model="dataJson.searchForm.in_owner_id"
          :placeholder="isPlaceholderShow('请选择新货主')"
          :disabled="isViewModel"
          filterable
          clearable
        >
          <el-option
            v-for="item in dataJson.ownerComboList"
            :key="item.id"
            :label="item.short_name"
            :value="item.id"
          />
        </el-select>
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
          :loading="settings.loading"
          @click="handleSearch"
        >查询</el-button>
      </el-form-item>
      <!-- <el-form-item>
        <el-badge
          :value="screenNum"
          class="item"
        >
          <el-button
            v-popover:popover
            type="primary"
            plain
            icon="el-icon-search"
          >高级查询</el-button>
        </el-badge>
      </el-form-item> -->
    </el-form>
    <!-- <el-popover
      ref="popover"
      placement="bottom"
      width="600"
      title="高级查询"
      popper-class="perfect_popper"
    >
      <el-form
        :inline="true"
        :model="dataJson.searchForm"
        label-position="top"
        class="search-form-senior"
      >
        <el-form-item label="请选择货主">
          <el-select
            v-model="dataJson.searchForm.owner_id"
            :placeholder="isPlaceholderShow('请选择货主')"
            :disabled="isViewModel"
          >
            <el-option
              v-for="item in dataJson.ownerComboList"
              :key="item.id"
              :label="item.short_name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="仓库">
          <el-select
            v-model.trim="dataJson.searchForm.warehouse_id"
            placeholder="仓库"
            :loading="settings.loading"
            loading-text="拼命加载..."
            clearable
          >
            <el-option
              v-for="item in dataJson.warehouseComboList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="入库类型">
          <select-dict
            v-model="dataJson.searchForm.type"
            :para="CONSTANTS.DICT_B_IN_PLAN_TYPE"
            init-placeholder="入库类型"
            :disabled="isViewModel"
          />
        </el-form-item>
        <el-form-item label="物料编码或名称">
          <el-input
            v-model.trim="dataJson.searchForm.goods_name"
            clearable
            placeholder="物料编码或名称"
          />
        </el-form-item>
        <el-form-item label="合同编号">
          <el-input
            v-model.trim="dataJson.searchForm.contract_no"
            clearable
            placeholder="合同编号"
          />
        </el-form-item>
        <el-form-item label="船名">
          <el-input
            v-model.trim="dataJson.searchForm.ship_name"
            clearable
            placeholder="船名"
          />
        </el-form-item>
        <el-form-item label="供应商">
          <select-supplier
            v-model.trim="dataJson.searchForm.supplier_name"
            :placeholder="isPlaceholderShow('请选择')"
            :type="CONSTANTS.DICT_SUPPLIER"
            :disabled="isViewModel"
            :reset="settings.reset3"
            placement="left"
            @closeParentDialog="handleDialogClose"
            @onReturnData="handleSupplierReturnData"
          />
        </el-form-item>
        <el-form-item label="单据类型">
          <select-dict
            v-model="dataJson.searchForm.bill_type"
            :para="CONSTANTS.DICT_B_IN_PLAN_BUSINESS_TYPE"
            init-placeholder="单据类型"
            :disabled="isViewModel"
          />
        </el-form-item>
        <el-form-item label="创建时间起">
          <el-date-picker
            v-model="dataJson.searchForm.start_time"
            value-format="yyyy-MM-dd HH:mm:ss"
            type="date"
            clearable
            :placeholder="isPlaceholderShow('创建时间起')"
          />
        </el-form-item>
        <el-form-item label="创建时间止">
          <el-date-picker
            v-model="dataJson.searchForm.over_time"
            value-format="yyyy-MM-dd HH:mm:ss"
            type="date"
            clearable
            :placeholder="isPlaceholderShow('创建时间止')"
          />
        </el-form-item>
        <el-form-item label="状态">
          <select-dict
            v-model="dataJson.searchForm.status"
            :para="CONSTANTS.DICT_B_IN_PLAN_STATUS"
            init-placeholder="状态"
            :disabled="isViewModel"
          />

        </el-form-item>

        <el-divider />
        <div style="text-align: right; margin: 0">
          <el-button
            type="text"
            @click="doResetSearch"
          >重置</el-button>
          <el-button
            type="primary"
            @click="handleSearch"
          >提交</el-button>
        </div>
      </el-form>
    </el-popover> -->

    <el-button-group>

      <el-button
        v-permission="'P_OWNER_CHANGE:ADD'"
        type="primary"
        icon="el-icon-circle-plus-outline"
        :loading="settings.loading"
        @click="handleInsert"
      >
        新增
      </el-button>
      <!-- <el-button
        v-permission="'P_OWNER_CHANGE:INFO'"
        :disabled="!settings.btnStatus.showView"
        type="primary"
        icon="el-icon-zoom-in"
        :loading="settings.loading"
        @click="handleEdit"
      >修改</el-button> -->
      <el-button
        v-permission="'P_OWNER_CHANGE:INFO'"
        :disabled="!settings.btnStatus.showView"
        type="primary"
        icon="el-icon-zoom-in"
        :loading="settings.loading"
        @click="handleView"
      >查看</el-button>
      <el-button
        v-permission="'P_OWNER_CHANGE:AUDIT'"
        :disabled="!settings.btnStatus.showEnable"
        type="primary"
        icon="el-icon-check"
        :loading="settings.loading"
        @click="handleAudit"
      >审核</el-button>
      <el-button
        v-permission="'P_OWNER_CHANGE:DELETE'"
        :disabled="!settings.btnStatus.showEnable"
        type="primary"
        icon="el-icon-close"
        :loading="settings.loading"
        @click="handleDelete"
      >删除</el-button>

    </el-button-group>

    <el-table
      ref="multipleTable"
      v-loading="settings.loading"
      :data="dataJson.listData"
      :element-loading-text="'正在拼命加载中...'"
      element-loading-background="rgba(255, 255, 255, 0.5)"
      :height="settings.tableHeight"
      :default-sort="{prop: 'u_time', order: 'descending'}"
      columns_index_key="true"
      stripe
      border
      fit
      highlight-current-row
      style="width: 100%"
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
        label="No"
      />
      <el-table-column
        label="货权转移单号"
        :sort-orders="settings.sortOrders"
        align="center"
      >
        <el-table-column
          sortable="custom"
          :sort-orders="settings.sortOrders"
          min-width="170"
          prop="code"
          label="单号"
        />
        <el-table-column
          :sort-orders="settings.sortOrders"
          :auto-fit="true"
          min-width="55"
          prop="idx"
          label="序号"
        />
      </el-table-column>
      <el-table-column
        sortable="custom"
        :sort-orders="settings.sortOrders"
        :auto-fit="true"
        min-width="120"
        prop="status_name"
        label="状态"
      />
      <el-table-column
        sortable="custom"
        :sort-orders="settings.sortOrders"
        :auto-fit="true"
        min-width="120"
        prop="out_owner_name"
        label="原货主"
      />
      <el-table-column
        sortable="custom"
        :sort-orders="settings.sortOrders"
        :auto-fit="true"
        min-width="120"
        prop="out_warehouse_name"
        label="原仓库"
      />
      <el-table-column
        sortable="custom"
        :sort-orders="settings.sortOrders"
        :auto-fit="true"
        min-width="120"
        prop="in_owner_name"
        label="新货主"
      />
      <el-table-column
        sortable="custom"
        :sort-orders="settings.sortOrders"
        :auto-fit="true"
        min-width="120"
        prop="in_warehouse_name"
        label="新仓库"
      />
      <el-table-column
        sortable="custom"
        :sort-orders="settings.sortOrders"
        :auto-fit="true"
        min-width="120"
        prop="goods_name"
        label="物料名称"
      />
      <el-table-column
        sortable="custom"
        :sort-orders="settings.sortOrders"
        :auto-fit="true"
        min-width="120"
        prop="pm"
        label="品名"
      />
      <el-table-column
        sortable="custom"
        :sort-orders="settings.sortOrders"
        :auto-fit="true"
        min-width="120"
        prop="spec"
        align="center"
        label="规格"
      />
      <el-table-column
        sortable="custom"
        :sort-orders="settings.sortOrders"
        :auto-fit="true"
        min-width="120"
        prop="sku_code"
        align="center"
        label="规格编号"
      />
      <el-table-column
        sortable="custom"
        :sort-orders="settings.sortOrders"
        min-width="150"
        prop="qty"
        label="转移量"
        align="right"
      >
        <template v-slot="scope">
          {{ isZhongLin ? formatNumber3(scope.row.qty) : formatNumber(scope.row.qty,true,4) }}
        </template>
      </el-table-column>
      <el-table-column
        :sort-orders="settings.sortOrders"
        :auto-fit="true"
        min-width="120"
        prop="c_name"
        label="创建人"
      />
      <el-table-column
        :auto-fit="true"
        sortable="custom"
        min-width="200"
        :sort-orders="settings.sortOrders"
        prop="c_time"
        label="创建时间"
      >
        <template v-slot="scope">
          {{ formatDateTime(scope.row.c_time) }}
        </template>
      </el-table-column>
      <el-table-column
        :sort-orders="settings.sortOrders"
        :auto-fit="true"
        min-width="120"
        prop="u_name"
        label="更新人"
      />
      <el-table-column
        :auto-fit="true"
        sortable="custom"
        min-width="200"
        :sort-orders="settings.sortOrders"
        prop="u_time"
        label="更新时间"
      >
        <template v-slot="scope">
          {{ formatDateTime(scope.row.u_time) }}
        </template>
      </el-table-column>
      <el-table-column
        :sort-orders="settings.sortOrders"
        :auto-fit="true"
        min-width="120"
        prop="u_name"
        label="审核人"
      />
      <el-table-column
        :auto-fit="true"
        sortable="custom"
        min-width="200"
        :sort-orders="settings.sortOrders"
        prop="u_time"
        label="审核时间"
      >
        <template v-slot="scope">
          {{ formatDateTime(scope.row.u_time) }}
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
  width: 180px;
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
.perfect_popper .el-form-item--mini.el-form-item {
  margin-bottom: 10px;
}
.el-form-item--mini.el-form-item {
  margin-bottom: 10px;
}
</style>

<script>
// import SelectSupplier from '@/views/30_wms/customer/selectgrid/selectCustomer'
import { getOwnerComboListApi } from '@/api/30_wms/owner/owner'
// import SelectDict from '@/components/00_dict/select/SelectDict'
import constants_para from '@/common/constants/constants_para'
import constants_type from '@/common/constants/constants_dict'
import { getWarehouseComboListApi } from '@/api/30_wms/warehouse/warehouse'
import { getListApi, auditApi, deleteApi } from '@/api/40_business/ownerchange/ownerchange'
import Pagination from '@/components/Pagination'
import elDragDialog from '@/directive/el-drag-dialog'
import deepCopy from 'deep-copy'
import mixin from './mixin/listResizeHandlerMixin'
import permission from '@/directive/permission/index.js' // 权限判断指令

export default {
  components: { Pagination },
  directives: { elDragDialog, permission },
  mixins: [mixin],
  props: {
    height: {
      type: Number,
      default: 200
    }
  },
  data () {
    return {
      // 监听器
      watch: {
        unwatch_tempJson: null
      },
      dataJson: {
        tabsCount: {
          all: 0,
          todo: 0
        },
        // 默认选择标签
        tabs: {
          active: '2'
        },
        // 查询使用的json
        searchForm: {
          // 翻页条件
          pageCondition: deepCopy(this.PARAMETERS.PAGE_CONDITION),
          // 查询条件
          name: '',
          config_key: '',
          consignor_id: '',
          owner_id: '',
          supplier_id: '',
          warehouse_id: '',
          consignor_name: '',
          todo_status: '2',
          active_tabs_index: 2 // 当前被激活的页签

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
        reset1: false,
        reset2: false,
        reset3: false,
        // 表格排序规则
        sortOrders: deepCopy(this.PARAMETERS.SORT_PARA),
        // 按钮状态
        btnStatus: {
          showEnable: false,
          showDisable: false,
          showUpdate: false,
          showOperate: false,
          showView: false
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
    // 是否为查看模式
    isViewModel () {
      if ((this.popSettingsData.dialogStatus === 'view') && (this.popSettingsData.dialogFormVisible === true)) {
        // 查看模式
        return true
      } else {
        // 非查看模式
        return false
      }
    },
    // 判断是否是中林环境
    isZhongLin () {
      const href = window.location.href
      if (href.indexOf('shyiyuanth') !== -1 || href.indexOf('172.21.1.249') !== -1 || href.indexOf('localhost') !== -1) {
        return true
      } else {
        return false
      }
    }
  },
  // 监听器
  watch: {
    // // 选中的数据，使得导出按钮可用，否则就不可使用
    // 'dataJson.multipleSelection': {
    //   handler (newVal, oldVal) {
    //     if (newVal.length > 0) {
    //       this.settings.btnStatus.showEnable = true
    //       this.settings.btnStatus.showDisable = true
    //     } else {
    //       this.settings.btnStatus.showEnable = false
    //       this.settings.btnStatus.showDisable = false
    //     }
    //   }
    // }
    'dataJson.multipleSelection': {
      deep: true,
      handler (newVal, oldVal) {
        const screenKeys = ['warehouse_id', 'type', 'goods_name', 'contract_no', 'ship_name', 'supplier_id', 'bill_type', 'start_time', 'over_time', 'status', 'owner_id']
        const { searchForm } = this.dataJson
        const data = Object.keys(searchForm).map(item => {
          if (screenKeys.includes(item)) {
            if (searchForm[item] || searchForm[item] === 0) {
              return searchForm[item]
            }
          }
        })
        const len = data.filter(x => x).length || 0
        this.screenNum = len
      }
    }
  },
  created () {
    // 初始化watch
    this.setWatch()
    // 初始化货主下拉框
    this.getOwnerData()
    // 初始化查询
    this.getDataList()
    // 数据初始化
    this.dataJson.tempJson = Object.assign({}, this.dataJson.tempJsonOriginal)
    // 初始化仓库下拉框
    this.getWarehouseData()
  },
  mounted () {
    // 描绘完成

    // 接收兄弟消息
    this.$on(this.EMITS.EMIT_INPLAN_CHANGE, _data => {
      this.$off(this.EMITS.EMIT_INPLAN_LOADING_OK)
      this.$emit(this.EMITS.EMIT_INPLAN_LOADING_OK)
      this.getDataList()
    })
  },
  destroyed () {
    this.unWatch()
  },
  methods: {
    setWatch () {
      this.unWatch()
      // 监听页面上面是否有修改，有修改按钮高亮
      this.watch.unwatch_tempJson = this.$watch('dataJson.multipleSelection', (newVal, oldVal) => {
        if (newVal.length > 0) {
          this.settings.btnStatus.showEnable = true
          this.settings.btnStatus.showDisable = true
        } else {
          this.settings.btnStatus.showEnable = false
          this.settings.btnStatus.showDisable = false
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
      getListApi(this.dataJson.searchForm).then(response => {
        if (this.dataJson.searchForm.todo_status === '0') {
          this.dataJson.tabsCount.todo = response.data.total
        }
        this.dataJson.listData = response.data.records
        this.dataJson.paging = response.data
        this.dataJson.paging.records = {}
      }).finally(() => {
        this.settings.loading = false
      })
    },
    // 重置查询区域
    doResetSearch () {
      this.dataJson.searchForm = this.$options.data.call(this).dataJson.searchForm
      this.dataJson.searchForm.owner_name = ''
      this.dataJson.searchForm.consignor_name = ''
      this.dataJson.searchForm.supplier_name = ''
      this.settings.reset1 = !this.settings.reset1
      this.settings.reset2 = !this.settings.reset2
      this.settings.reset3 = !this.settings.reset3
      this.dataJson.tabs.active = '2'
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
      // 新增
      // 打开新增页面
      const operate_tab_data = {
        operate_tab_info: { show: true, name: '正在新增货权转移' },
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
      if (this.popSettings.one.props.data.status === '3') {
        this.showErrorMsg('已作废的数据不允许操作')
        return
      }
      if (this.popSettings.one.props.data.id === undefined) {
        this.showErrorMsg('请选择一条数据')
        return
      }
      // 更新
      // this.popSettings.one.props.dialogStatus = this.PARAMETERS.STATUS_UPDATE
      // this.popSettings.one.visible = true
      // this.$router.push({
      //   name: 'P00000112', params: { routeParams: this.popSettings.one.props.data, canEdit: true, editStatus: constants_para.STATUS_UPDATE }
      // })
      // 打开编辑页面
      const operate_tab_data = {
        operate_tab_info: { show: true, name: '正在编辑货权转移' },
        canEdit: true,
        editStatus: constants_para.STATUS_UPDATE,
        data: this.popSettings.one.props.data
      }

      this.$emit('emitUpdate', operate_tab_data)
    },
    handleIn () {
      this.popSettings.two.props.data = Object.assign({}, this.dataJson.currentJson)

      if (this.popSettings.two.props.data.id === undefined) {
        this.showErrorMsg('请选择一条数据')
        return
      }
      // this.popSettings.two.props.dialogStatus = this.PARAMETERS.STATUS_UPDATE
      // this.popSettings.two.visible = true
      const operate_tab_data = {
        operate_tab_info: { show: true, name: '正在入库操作' },
        canEdit: true,
        editStatus: constants_para.STATUS_UPDATE,
        data: this.popSettings.two.props.data
      }
      this.$emit('emitOperate', operate_tab_data)
    },
    // 点击按钮 编辑
    handleEdit () {
      this.popSettings.one.props.data = Object.assign({}, this.dataJson.currentJson)
      if (this.popSettings.one.props.data.id === undefined) {
        this.showErrorMsg('请选择一条数据')
        return
      }
      const operate_tab_data = {
        operate_tab_info: { show: true, name: '编辑货权转移' },
        canEdit: true,
        editStatus: constants_para.STATUS_EDIT,
        data: this.popSettings.one.props.data
      }

      this.$emit('emitView', operate_tab_data)
    },
    // 点击按钮 查看
    handleView () {
      this.popSettings.one.props.data = Object.assign({}, this.dataJson.currentJson)
      if (this.popSettings.one.props.data.id === undefined) {
        this.showErrorMsg('请选择一条数据')
        return
      }
      const operate_tab_data = {
        operate_tab_info: { show: true, name: '查看货权转移' },
        canEdit: true,
        editStatus: constants_para.STATUS_VIEW,
        data: this.popSettings.one.props.data
      }

      this.$emit('emitView', operate_tab_data)
    },
    // ------------------编辑弹出框 start--------------------
    handleCloseDialogOneOk (val) {
      switch (this.popSettings.one.props.dialogStatus) {
        case this.PARAMETERS.STATUS_INSERT:
          this.doInsertModelCallBack(val)
          break
        case this.PARAMETERS.STATUS_UPDATE:
          this.doUpdateModelCallBack(val)
          break
        case this.PARAMETERS.STATUS_VIEW:
          break
      }
    },
    handleCloseDialogOneCancel () {
      this.popSettings.one.visible = false
    },
    // 处理插入回调
    doInsertModelCallBack (val) {
      if (val.return_flag) {
        this.popSettings.one.visible = false

        // 设置到table中绑定的json数据源
        this.dataJson.listData.unshift(val.data.data)
        this.$notify({
          title: '新增处理成功',
          message: val.data.message,
          type: 'success',
          duration: this.settings.duration
        })
      } else {
        this.$notify({
          title: '新增处理失败',
          message: val.error.message,
          type: 'error',
          duration: this.settings.duration
        })
      }
    },
    // 处理更新回调
    doUpdateModelCallBack (val) {
      if (val.return_flag) {
        this.popSettings.one.visible = false

        // 设置到table中绑定的json数据源
        this.dataJson.listData.splice(this.dataJson.rowIndex, 1, val.data.data)
        // 设置到currentjson中
        this.dataJson.currentJson = Object.assign({}, val.data.data)
        this.$notify({
          title: '更新处理成功',
          message: val.data.message,
          type: 'success',
          duration: this.settings.duration
        })
      } else {
        this.$notify({
          title: '更新处理失败',
          message: val.error.message,
          type: 'error',
          duration: this.settings.duration
        })
      }
    },
    // ------------------编辑弹出框 end--------------------
    renderHeaderIsEnabled: function (h, { column }) {
      return (
        <span>{column.label}
          <el-tooltip
            class='item'
            effect='dark'
            placement='bottom'
          >
            <div slot='content'>
              删除状态提示：<br />
              绿色：已启用  <br />
              红色：未启用
            </div>
            <svg-icon icon-class='perfect-icon-question1_btn' style='margin-left: 5px' />
          </el-tooltip>
        </span>
      )
    },

    handleCurrentChange (row) {
      this.dataJson.currentJson = Object.assign({}, row) // copy obj
      this.dataJson.currentJson.index = this.getRowIndex(row)

      if (this.dataJson.currentJson.id !== undefined) {
        // this.settings.btnStatus.doInsert = true
        this.settings.btnStatus.showView = true
      } else {
        // this.settings.btnStatus.doInsert = false
        this.settings.btnStatus.showView = false
      }

      // 制单，驳回可修改
      if ((this.dataJson.currentJson.status === constants_type.DICT_B_IN_PLAN_STATUS_ZD || this.dataJson.currentJson.status === constants_type.DICT_B_IN_PLAN_STATUS_BH)) {
        this.settings.btnStatus.showUpdate = true
      } else {
        this.settings.btnStatus.showUpdate = false
      }

      // 审核通过可入库操作
      if (this.dataJson.currentJson.status === constants_type.DICT_B_IN_PLAN_STATUS_TG) {
        this.settings.btnStatus.showOperate = true
      } else {
        this.settings.btnStatus.showOperate = false
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
    // ------------------出库操作弹出框 start--------------------
    handleCloseDialogTwoOk (val) {
      this.popSettings.two.visible = false
    },
    handleCloseDialogTwoCancel () {
      this.popSettings.two.visible = false
    },
    // 审核按钮
    handleAudit () {
      // 没有选择任何数据的情况
      if (this.dataJson.multipleSelection.length <= 0) {
        this.$alert('请在表格中选择数据进行审核', '未选择数据错误', {
          confirmButtonText: '关闭',
          type: 'error'
        }).then(() => {
          this.settings.btnStatus.showDelete = false
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
    handleDelete () {
      if (this.dataJson.multipleSelection && this.dataJson.multipleSelection.length) {
        for (const item of this.dataJson.multipleSelection) {
          if (item.status === constants_type.DICT_B_ALLOCATION_STATUS_ZONE2) {
            this.showErrorMsg('审核已通过的数据无法删除')
            return
          }
        }
      }
      this.$confirm('是否确认删除该条数据', '确认信息', {
        distinguishCancelAndClose: true,
        confirmButtonText: '确定删除',
        cancelButtonText: '取消'
      }).then(() => {
        // 删除
        const selectionJson = []
        this.dataJson.multipleSelection.forEach(function (value, index, array) {
          selectionJson.push({ 'id': value.id })
        })
        deleteApi(selectionJson).then((_data) => {
          this.$notify({
            title: '删除处理成功',
            message: _data.message,
            type: 'success',
            duration: this.settings.duration
          })
          // 查询
          this.dataJson.currentJson = null
          this.getDataList()
          this.settings.loading = false
        }, (_error) => {
          this.$notify({
            title: '删除处理失败',
            message: _error.message,
            type: 'error',
            duration: this.settings.duration
          })
        }).finally(() => {
          this.settings.loading = false
        })
      }).catch(action => {
      })
    },
    handleConsignorReturnData (val) {
      this.dataJson.searchForm.consignor_id = val.id
    },
    handleSupplierReturnData (val) {
      this.dataJson.searchForm.supplier_id = val.id
    },
    // 弹出框关闭
    handleDialogClose () {
      this.settings.visible = false
      // 关闭页面
      this.handleCancel()
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
    getWarehouseData () {
      getWarehouseComboListApi().then((_data) => {
        this.dataJson.warehouseComboList = _data.data
        this.settings.loading = false
      }, (_error) => {
      })
    },
    // 货主下拉框
    getOwnerData () {
      getOwnerComboListApi().then((_data) => {
        this.dataJson.ownerComboList = _data.data
      }, (_error) => {
      })
    }
  }
}
</script>
