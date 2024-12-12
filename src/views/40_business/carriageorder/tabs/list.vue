<template>
  <div class="app-container">
    <FloatMenu v-if="!meDialogStatus" />
    <div>
      <el-form
        ref="minusForm"
        :inline="true"
        :model="dataJson.searchForm"
        label-position="getLabelPosition()"
      >
        <el-form-item label="">
          <el-input
            v-model.trim="dataJson.searchForm.order_no"
            clearable
            placeholder="订单编号"
            @keyup.enter.native="handleSearch"
          />
        </el-form-item>
        <el-form-item label="">
          <el-input
            v-model.trim="dataJson.searchForm.carriage_contract_code"
            clearable
            placeholder="合同编号"
            @keyup.enter.native="handleSearch"
          />
        </el-form-item>
        <el-form-item label="">
          <select-dict
            v-model="dataJson.searchForm.status"
            :para="CONSTANTS.DICT_CARRIAGE_ORDER_STATUS"
            init-placeholder="状态"
            @change="(val, selectedData) => dataJson.searchForm.status = selectedData.name"
          />
        </el-form-item>
        <el-form-item label="">
          <select-dict
            v-model="dataJson.searchForm.transport_type_name"
            :para="CONSTANTS.DICT_CARRIAGE_ORDER_TRANSPORT"
            init-placeholder="运输方式"
            @change="(val, selectedData) => dataJson.searchForm.transport_type_name = selectedData.name"
          />
        </el-form-item>
        <el-form-item>
          <select-customer
            v-model.trim="dataJson.searchForm.company_name"
            :placeholder="isPlaceholderShow('请选择承运人')"
            :type="CONSTANTS.DICT_CONSIGNOR"
            :reset="settings.reset5"
            placement="left"
            @onReturnDataName="handleCustomerReturnDataName"
            @keyup.enter.native="handleSearch"
          />
        </el-form-item>
        <el-form-item>
          <el-input
            v-model.trim="dataJson.searchForm.origin_place"
            clearable
            placeholder="起运地"
            @keyup.enter.native="handleSearch"
          />
        </el-form-item>
        <el-form-item>
          <el-input
            v-model.trim="dataJson.searchForm.destination_place"
            clearable
            placeholder="目的地"
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
    <el-button-group v-if="searchsetting.visible">
      <el-button
        v-permission="'P_CARRIAGE_ORDER:ADD'"
        type="primary"
        icon="el-icon-circle-plus-outline"
        :loading="settings.loading"
        @click="handleInsert"
      >新增</el-button>
      <el-button
        v-permission="'P_CARRIAGE_ORDER:INFO'"
        type="primary"
        icon="el-icon-circle-plus-outline"
        :disabled="!settings.btnStatus.showView"
        :loading="settings.loading"
        @click="handleView"
      >查看</el-button>
      <el-button
        v-permission="'P_CARRIAGE_ORDER:UPDATE'"
        :disabled="!settings.btnStatus.showUpdate"
        type="primary"
        icon="el-icon-edit-outline"
        :loading="settings.loading"
        @click="handleUpdate"
      >修改</el-button>
      <el-button
        v-permission="'P_CARRIAGE_ORDER:EXPORT'"
        :disabled="!settings.btnStatus.showExport"
        type="primary"
        icon="el-icon-s-management"
        :loading="settings.loading"
        @click="handleExport"
      >导出</el-button>
      <!--      <el-button-->
      <!--        v-permission="'P_IN_ORDER:DELETE'"-->
      <!--        :disabled="!settings.btnStatus.showDelete"-->
      <!--        type="primary"-->
      <!--        icon="el-icon-s-management"-->
      <!--        :loading="settings.loading"-->
      <!--        @click="handleDelete"-->
      <!--      >删除</el-button>-->
    </el-button-group>

    <!--    <div-->
    <!--    v-if="!meDialogStatus"-->
    <!--    class="div-sum"-->
    <!--  >-->
    <!--    <div class="right">-->
    <!--      <span class="count-title">累计合同量：</span><span class="count-data">{{ dataJson.sumData.contract_num == null?'': isZhongLin ? formatNumber3(dataJson.sumData.contract_num) : formatNumber(dataJson.sumData.contract_num,true,4) }}</span>-->
    <!--    </div>-->
    <!--  </div>-->

    <el-table
      ref="multipleTable"
      v-loading="settings.loading"
      :data="dataJson.listData"
      :element-loading-text="'正在拼命加载中...'"
      element-loading-background="rgba(255, 255, 255, 0.5)"
      :height="settings.tableHeight"
      columns_index_key="true"
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
        min-width="130"
        prop="order_no"
        label="订单编号"
      />
      <el-table-column
        sortable="custom"
        :sort-orders="settings.sortOrders"
        :auto-fit="true"
        min-width="130"
        prop="carriage_contract_code"
        label="合同编号"
      />
      <el-table-column
        sortable="custom"
        :sort-orders="settings.sortOrders"
        min-width="180"
        :show-overflow-tooltip="true"
        prop="sales_contract_code"
        label="销售合同号"
      />
      <el-table-column
        sortable="custom"
        min-width="180"
        :sort-orders="settings.sortOrders"
        :auto-fit="true"
        prop="org_name"
        label="托运人"
      />
      <el-table-column
        sortable="custom"
        :sort-orders="settings.sortOrders"
        :auto-fit="true"
        min-width="130"
        prop="company_name"
        label="承运人"
      />
      <el-table-column
        sortable="custom"
        min-width="180"
        :sort-orders="settings.sortOrders"
        :auto-fit="true"
        prop="sign_dt"
        label="签订日期"
      >
        <template v-slot="scope">
          {{ scope.row.sign_dt==null||scope.row.sign_dt==''?'-':formatDate(scope.row.sign_dt) }}
        </template>
      </el-table-column>
      <el-table-column
        sortable="custom"
        min-width="180"
        :sort-orders="settings.sortOrders"
        :auto-fit="true"
        prop="deadline_dt"
        label="合同到期日期"
      >
        <template v-slot="scope">
          {{ scope.row.deadline_dt==null||scope.row.deadline_dt==''?'-':formatDate(scope.row.deadline_dt) }}
        </template>
      </el-table-column>
      <el-table-column
        sortable="custom"
        :sort-orders="settings.sortOrders"
        :auto-fit="true"
        min-width="130"
        prop="transport_type_name"
        label="运输方式"
      />
      <el-table-column
        sortable="custom"
        :sort-orders="settings.sortOrders"
        :auto-fit="true"
        min-width="130"
        prop="status"
        label="状态"
      />
      <el-table-column
        sortable="custom"
        :sort-orders="settings.sortOrders"
        :auto-fit="true"
        min-width="130"
        prop="origin_place"
        label="起运地"
      />
      <el-table-column
        sortable="custom"
        :sort-orders="settings.sortOrders"
        :auto-fit="true"
        min-width="130"
        prop="destination_place"
        label="目的地"
      />
      <el-table-column
        sortable="custom"
        :sort-orders="settings.sortOrders"
        align="right"
        min-width="120"
        prop="price"
        label="运费单价"
      >
        <template v-slot="scope">
          {{ scope.row.price == null?'': formatCurrency(scope.row.price) }}
        </template>
      </el-table-column>
      <el-table-column
        sortable="custom"
        min-width="150"
        :sort-orders="settings.sortOrders"
        :auto-fit="true"
        align="right"
        prop="num"
        label="运输总数量"
      >
        <template v-slot="scope">
          {{ scope.row.num == null?'0': isZhongLin ? formatNumber3(scope.row.num) : formatNumber(scope.row.num,true,4) }}
        </template>
      </el-table-column>
      <el-table-column
        sortable="custom"
        :sort-orders="settings.sortOrders"
        align="right"
        min-width="120"
        prop="transport_amount"
        label="运费总金额"
      >
        <template v-slot="scope">
          {{ scope.row.transport_amount == null?'': formatCurrency(scope.row.transport_amount) }}
        </template>
      </el-table-column>
      <el-table-column
        sortable="custom"
        :sort-orders="settings.sortOrders"
        align="right"
        min-width="120"
        prop="total_amount"
        label="总货值"
      >
        <template v-slot="scope">
          {{ scope.row.total_amount == null?'': formatCurrency(scope.row.total_amount) }}
        </template>
      </el-table-column>
      <el-table-column
        sortable="custom"
        min-width="180"
        :sort-orders="settings.sortOrders"
        :auto-fit="true"
        prop="u_time"
        label="更新时间"
      >
        <template v-slot="scope">
          {{ scope.row.u_time==null||scope.row.u_time==''?'-':formatDateTime(scope.row.u_time) }}
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

    <edit-dialog
      v-if="popSettings.one.visible"
      :id="popSettings.one.props.id"
      :data="popSettings.one.props.data"
      :visible="popSettings.one.visible"
      :dialog-status="popSettings.one.props.dialogStatus"
      @closeMeOk="handleCloseDialogOneOk"
      @closeMeCancel="handleCloseDialogOneCancel"
    />

    <delivery-dialog
      v-if="popSettings.two.visible"
      :id="popSettings.two.props.id"
      :data="popSettings.two.props.data"
      :visible="popSettings.two.visible"
      :dialog-status="popSettings.two.props.dialogStatus"
      @closeMeOk="handleCloseDialogTwoOk"
      @closeMeCancel="handleCloseDialogTwoCancel"
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
.el-button-group {
  margin-bottom: 10px;
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
.right {
  position: absolute;
  right: 10px;
  margin-right: 10px;
}
.count-data {
  color: #f00;
  font-size: 20px;
}
a {
  color: #52b5f2;
}
.el-form-item--mini.el-form-item {
  margin-bottom: 10px;
}
</style>
<style >
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
</style>

<script>
import { getListApi, exportApi } from '@/api/40_business/carriageorder'
import resizeMixin from '@/views/40_business/inorder/tabs/mixin/listResizeHandlerMixin'
import Pagination from '@/components/Pagination'
import elDragDialog from '@/directive/el-drag-dialog'
import editDialog from '@/views/40_business/inorder/dialog/edit'
import deliveryDialog from '@/views/40_business/inorder/dialog/delivery'
import deepCopy from 'deep-copy'
import permission from '@/directive/permission/index.js' // 权限判断指令
import constants_para from '@/common/constants/constants_para'
import constants_program from '@/common/constants/constants_program'
import urlUtil from '@/utils/urlUtil'
import { mapState } from 'vuex'
import SelectCustomer from '@/views/30_wms/customer/selectgrid/selectCustomer.vue'
import SelectDict from '@/components/00_dict/select/SelectDict.vue'

export default {
  components: { SelectDict, SelectCustomer, Pagination, editDialog, deliveryDialog },
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
      searchsetting: {
        visible: true
      },
      dataJson: {
        // 查询使用的json
        searchForm: {
          // 翻页条件
          pageCondition: deepCopy(this.PARAMETERS.PAGE_CONDITION),
          // 查询条件
          order_no: '',
          carriage_contract_code: '',
          status: '',
          company_name: '',
          origin_place: '',
          destination_place: '',
          transport_type_name: '',
          batch: ''
        },
        sumData: {
          contract_num: 0
        },
        constants_program: constants_program,
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
        statusList: [
          { value: '执行中' },
          { value: '已完成' },
          { value: '已作废' }
        ],
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
          showExport: false,
          showUpload: false
        },
        // loading 状态
        loading: true,
        tableHeight: this.setUIheight(),
        duration: 4000,
        reset5: false
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
    // 选中的数据，使得导出按钮可用，否则就不可使用
    'dataJson.multipleSelection': {
      deep: true,
      handler (newVal, oldVal) {
        if (newVal.length > 0) {
          this.settings.btnStatus.showExport = true
        } else {
          this.settings.btnStatus.showExport = false
        }
      }
    }
  },
  created () {
    location.href = urlUtil.delParam(window.location.href, 'fullpath')
    this.dataJson.searchForm.batch = this.dict_value
    // 初始化查询
    this.getDataList()
    // 数据初始化
    this.dataJson.tempJson = Object.assign({}, this.dataJson.tempJsonOriginal)
    if (this.meDialogStatus) {
      this.searchsetting.visible = false
      this.dataJson.searchForm.status = '执行中'
    }
  },
  mounted () {
    // 描绘完成

  },
  methods: {
    initShow () {
      // 初始化查询
      this.getDataList()
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
        // 增加对象属性，columnTypeShowIcon，columnNameShowIcon
        this.dataJson.listData = response.data.records
        this.dataJson.paging = response.data
        this.dataJson.paging.records = {}
      }).finally(() => {
        this.settings.loading = false
      })
      // 查询合计信息
      // getListSumApi(this.dataJson.searchForm).then(response => {
      //   if (response.data !== null) {
      //     this.dataJson.sumData = response.data
      //   } else {
      //     this.dataJson.sumData.contract_num = 0
      //   }
      // }).finally(() => {
      // })
    },
    // 重置查询区域
    doResetSearch () {
      this.dataJson.searchForm = this.$options.data.call(this).dataJson.searchForm
      this.settings.reset5 = !this.settings.reset5
    },
    // table选择框
    handleSelectionChange (val) {
      this.dataJson.multipleSelection = val
    },

    // 点击按钮 新增
    handleInsert () {
      const operate_tab_data = {
        operate_tab_info: { show: true, name: '新增入库订单' },
        canEdit: true,
        editStatus: constants_para.STATUS_INSERT
      }

      this.$emit('emitInsert', operate_tab_data)
    },
    // 点击按钮 更新
    handleUpdate () {
      this.popSettings.one.props.data = Object.assign({}, this.dataJson.currentJson)
      if (this.popSettings.one.props.data.id === undefined) {
        this.showErrorMsg('请选择一条数据')
        return
      }
      // 更新
      const operate_tab_data = {
        operate_tab_info: { show: true, name: '修改入库订单' },
        canEdit: true,
        data: { id: this.popSettings.one.props.data.id },
        editStatus: constants_para.STATUS_UPDATE
      }
      this.$emit('emitInsert', operate_tab_data)
    },

    // ------------------编辑弹出框 start--------------------
    handleCloseDialogOneOk (val) {
      switch (val.editStatus) {
        case this.PARAMETERS.STATUS_INSERT:
          this.doInsertModelCallBack(val)
          break
        case this.PARAMETERS.STATUS_UPDATE:
          this.doUpdateModelCallBack(val)
          break
      }
    },
    handleCloseDialogOneCancel () {
      this.popSettings.one.visible = false
    },
    // 处理插入回调
    doInsertModelCallBack (val) {
      if (val.return_flag) {
        // 设置到table中绑定的json数据源
        this.dataJson.listData.unshift(val.data)
      }
    },
    // 处理更新回调
    doUpdateModelCallBack (val) {
      if (val.return_flag) {
        // 设置到table中绑定的json数据源
        this.dataJson.listData.splice(this.dataJson.rowIndex, 1, val.data)
        // 设置到currentjson中
        this.dataJson.currentJson = Object.assign({}, val.data)
      }
    },
    handleCurrentChange (row) {
      this.dataJson.currentJson = Object.assign({}, row) // copy obj
      this.dataJson.currentJson.index = this.getRowIndex(row)

      if (this.dataJson.currentJson.id !== undefined) {
        // 业务中台推过来的, 不可修改
        this.settings.btnStatus.showUpdate = true
        this.settings.btnStatus.showUpload = true
        this.settings.btnStatus.showView = true
      } else {
        this.settings.btnStatus.showUpdate = false
        this.settings.btnStatus.showView = false
      }
      // 设置dialog的返回
      this.$store.dispatch('popUpSearchDialog/selectedDataJson', Object.assign({}, row))
    },
    // 上传收货确认函
    handleUploadFile () {
      this.popSettings.two.props.data = this.dataJson.currentJson
      this.popSettings.two.visible = true
    },
    handleCloseDialogTwoOk (val) {
      this.popSettings.two.visible = false
    },
    handleCloseDialogTwoCancel () {
      this.popSettings.two.visible = false
    },
    // Placeholder设置
    isPlaceholderShow (val) {
      return val
    },
    handleSupplierReturnDataName (val) {
      this.dataJson.searchForm.supplier_name = val
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
      // 清空选择
      this.dataJson.searchForm.ids = []
      // 开始导出
      exportApi(this.dataJson.searchForm).then(response => {
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
        selectionJson.push(value.id)
      })
      this.dataJson.searchForm.ids = selectionJson
      // 开始导出
      exportApi(this.dataJson.searchForm).then(response => {
        this.settings.loading = false
      }).finally(() => {
        this.settings.loading = false
      })
    },
    handleCustomerReturnDataName (val) {
      this.dataJson.searchForm.company_name = val
    },
    handleView () {
      const operate_tab_data = {
        operate_tab_info: { show: true, name: '查看承运订单' },
        canEdit: true,
        editStatus: constants_para.STATUS_VIEW,
        data: { id: this.dataJson.currentJson.id }
      }
      this.$emit('emitInsert', operate_tab_data)
    }
  }
}
</script>
