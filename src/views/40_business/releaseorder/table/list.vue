<template>
  <div class="app-container">
    <FloatMenu />
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
          placeholder="放货指令编号"
          @keyup.enter.native="handleSearch"
        />
      </el-form-item>
      <el-form-item label="">
        <el-input
          v-model.trim="dataJson.searchForm.type_name"
          clearable
          placeholder="放货指令类型"
          @keyup.enter.native="handleSearch"
        />
      </el-form-item>
      <el-form-item label="">
        <el-input
          v-model.trim="dataJson.searchForm.contract_code"
          clearable
          placeholder="合同编号"
          @keyup.enter.native="handleSearch"
        />
      </el-form-item>
      <el-form-item label="">
        <el-input
          v-model.trim="dataJson.searchForm.order_code"
          clearable
          placeholder="订单编号"
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
          icon="el-icon-search"
          :loading="settings.loading"
          @click="handleSearch"
        >查询</el-button>
      </el-form-item>
    </el-form>
    <el-button-group>
      <el-button
        v-if="!meDialogStatus"
        v-permission="'P_RELEASE_ORDER:INFO'"
        type="primary"
        icon="el-icon-circle-plus-outline"
        :disabled="!settings.btnStatus.showView"
        @click="handleView"
      >查看</el-button>
      <el-button
        v-if="!meDialogStatus"
        v-permission="'P_RELEASE_ORDER:ADD'"
        type="primary"
        icon="el-icon-circle-plus-outline"
        :disabled="!settings.btnStatus.showInsert"
        @click="handleInsert"
      >新增</el-button>
      <el-button
        v-if="!meDialogStatus"
        v-permission="'P_RELEASE_ORDER:ADD'"
        type="primary"
        icon="el-icon-circle-plus-outline"
        :disabled="!settings.btnStatus.showUpdate"
        @click="handleUpdate"
      >修改</el-button>
      <el-button
        v-if="!meDialogStatus"
        v-permission="'P_RELEASE_ORDER:SEND_WO'"
        type="primary"
        icon="el-icon-circle-plus-outline"
        :disabled="!settings.btnStatus.showProduct"
        @click="handleProduct"
      >下推生产订单(配方)</el-button>
      <el-button
        v-if="!meDialogStatus"
        v-permission="'P_RELEASE_ORDER:SEND_RT_WO'"
        type="primary"
        icon="el-icon-circle-plus-outline"
        :disabled="!settings.btnStatus.showProduct"
        @click="handleRtProduct"
      >下推生产订单(配比)</el-button>
    </el-button-group>

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
        label="No"
      />
      <el-table-column
        sortable="custom"
        :sort-orders="settings.sortOrders"
        :auto-fit="true"
        min-width="130"
        prop="code"
        label="放货指令编号"
      />
      <el-table-column
        sortable="custom"
        :sort-orders="settings.sortOrders"
        :auto-fit="true"
        min-width="80"
        prop="no"
        label="序号"
      />
      <el-table-column
        sortable="custom"
        :sort-orders="settings.sortOrders"
        :auto-fit="true"
        min-width="130"
        prop="type_name"
        label="放货指令类型"
      />
      <el-table-column
        sortable="custom"
        :sort-orders="settings.sortOrders"
        :auto-fit="true"
        min-width="130"
        prop="business_plate_name"
        label="业务板块"
      />
      <el-table-column
        sortable="custom"
        :sort-orders="settings.sortOrders"
        :auto-fit="true"
        min-width="130"
        prop="business_type_name"
        label="业务类型"
      />
      <el-table-column
        sortable="custom"
        :sort-orders="settings.sortOrders"
        :auto-fit="true"
        min-width="130"
        prop="contract_code"
        label="合同编号"
      />
      <el-table-column
        sortable="custom"
        :sort-orders="settings.sortOrders"
        :auto-fit="true"
        min-width="130"
        prop="order_code"
        label="订单编号"
      />
      <el-table-column
        sortable="custom"
        :sort-orders="settings.sortOrders"
        :auto-fit="true"
        min-width="150"
        prop="purchase_order_return_code"
        label="采购退货单编号"
      />
      <el-table-column
        sortable="custom"
        :sort-orders="settings.sortOrders"
        :auto-fit="true"
        min-width="130"
        prop="customer_name"
        label="客户"
      />
      <el-table-column
        sortable="custom"
        :sort-orders="settings.sortOrders"
        :auto-fit="true"
        min-width="130"
        prop="consignor_name"
        label="委托方"
      />

      <el-table-column
        sortable="custom"
        :sort-orders="settings.sortOrders"
        :auto-fit="true"
        min-width="130"
        prop="owner_name"
        label="货主"
      />
      <el-table-column
        sortable="custom"
        :sort-orders="settings.sortOrders"
        :auto-fit="true"
        min-width="130"
        prop="commodity_spec_code"
        label="商品编码"
      />
      <el-table-column
        sortable="custom"
        :sort-orders="settings.sortOrders"
        :auto-fit="true"
        min-width="130"
        prop="commodity_name"
        label="物料名称"
      />
      <el-table-column
        sortable="custom"
        :sort-orders="settings.sortOrders"
        :auto-fit="true"
        min-width="130"
        prop="pm"
        label="品名"
      />
      <el-table-column
        sortable="custom"
        :sort-orders="settings.sortOrders"
        :auto-fit="true"
        min-width="130"
        prop="commodity_spec"
        label="规格"
      />
      <el-table-column
        sortable="custom"
        :sort-orders="settings.sortOrders"
        :auto-fit="true"
        min-width="130"
        prop="type_guage"
        label="型规"
      />
      <el-table-column
        sortable="custom"
        :sort-orders="settings.sortOrders"
        :auto-fit="true"
        min-width="130"
        prop="qty"
        align="right"
        label="放货数量"
      >
        <template v-slot="scope">
          {{ scope.row.qty == null? 0 : isZhongLin ? formatNumber3(scope.row.qty) : formatNumber(scope.row.qty, 4) }}
        </template>
      </el-table-column>
      <el-table-column
        sortable="custom"
        :sort-orders="settings.sortOrders"
        :auto-fit="true"
        min-width="130"
        prop="price"
        align="right"
        label="单价"
      >
        <template v-slot="scope">
          {{ scope.row.price == null? 0 : formatCurrency(scope.row.price, true) }}
        </template>
      </el-table-column>
      <el-table-column
        sortable="custom"
        :sort-orders="settings.sortOrders"
        :auto-fit="true"
        min-width="130"
        align="right"
        prop="amount"
        label="金额"
      >
        <template v-slot="scope">
          {{ scope.row.amount == null? 0 : formatCurrency(scope.row.amount, true) }}
        </template>
      </el-table-column>
      <el-table-column
        sortable="custom"
        :sort-orders="settings.sortOrders"
        :auto-fit="true"
        min-width="130"
        prop="has_product_num"
        align="right"
        label="已生产数量"
      >
        <template v-slot="scope">
          {{ scope.row.has_product_num == null? 0 : isZhongLin ? formatNumber3(scope.row.has_product_num) : formatNumber(scope.row.has_product_num, 4) }}
        </template>
      </el-table-column>
      <el-table-column
        sortable="custom"
        :sort-orders="settings.sortOrders"
        :auto-fit="true"
        min-width="130"
        prop="warehouse_name"
        label="仓库"
      />
      <el-table-column
        sortable="custom"
        :sort-orders="settings.sortOrders"
        :auto-fit="true"
        min-width="130"
        prop="direct_info"
        label="放货指令信息"
      />
      <el-table-column
        sortable="custom"
        :sort-orders="settings.sortOrders"
        :auto-fit="true"
        value-format="yyyy-MM-dd"
        min-width="130"
        prop="out_time"
        label="放货指令日期"
      >
        <template v-slot="scope">
          {{ scope.row.out_time == null?'':formatDateTime(scope.row.out_time) }}
        </template>
      </el-table-column>
      <el-table-column
        sortable="custom"
        :sort-orders="settings.sortOrders"
        :auto-fit="true"
        value-format="yyyy-MM-dd"
        min-width="130"
        prop="plan_time"
        label="计划时间"
      >
        <template v-slot="scope">
          {{ scope.row.plan_time == null?'':formatDateTime(scope.row.plan_time) }}
        </template>
      </el-table-column>
      <el-table-column
        sortable="custom"
        :sort-orders="settings.sortOrders"
        :auto-fit="true"
        min-width="130"
        align="right"
        prop="float_up"
        label="上浮百分比"
      />
      <el-table-column
        sortable="custom"
        :sort-orders="settings.sortOrders"
        :auto-fit="true"
        min-width="130"
        prop="float_down"
        align="right"
        label="下浮百分比"
      />
      <el-table-column
        sortable="custom"
        :sort-orders="settings.sortOrders"
        :auto-fit="true"
        min-width="120"
        align="right"
        prop="total_amount"
        label="总金额"
      >
        <template v-slot="scope">
          {{ scope.row.total_amount == null?'':formatCurrency(scope.row.total_amount, true) }}
        </template>
      </el-table-column>
      <el-table-column
        sortable="custom"
        :sort-orders="settings.sortOrders"
        :auto-fit="true"
        min-width="175"
        align="right"
        prop="balance"
        label="账户余额"
      >
        <template v-slot="scope">
          {{ scope.row.balance == null?'':formatCurrency(scope.row.balance, true) }}
        </template>
      </el-table-column>
      <el-table-column
        sortable="custom"
        :sort-orders="settings.sortOrders"
        :auto-fit="true"
        min-width="150"
        prop="use_sealed"
        label="是否已用印上传"
      >
        <template v-slot="scope">
          {{ scope.row.use_sealed ? '是' : '否' }}
        </template>
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
        prop="remark"
        label="备注"
      />
      <el-table-column
        sortable="custom"
        :sort-orders="settings.sortOrders"
        :auto-fit="true"
        min-width="120"
        prop="c_name"
        label="创建人"
      />
      <el-table-column
        sortable="custom"
        :sort-orders="settings.sortOrders"
        :auto-fit="true"
        min-width="120"
        prop="u_name"
        label="更新人"
      />
      <el-table-column
        sortable="custom"
        min-width="180"
        :sort-orders="settings.sortOrders"
        :auto-fit="true"
        prop="c_time"
        label="创建时间"
      >
        <template v-slot="scope">
          {{ scope.row.c_time==null||scope.row.c_time==''?'-':formatDateTime(scope.row.c_time) }}
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

  </div>
</template>

<style scoped>
.el-form-item .el-select {
  width: 100%;
}
.el-button-group {
  margin-bottom: 10px;
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
</style>

<script>
import { getListCommApi } from '@/api/40_business/releaseorder/releaseorder'
import resizeMixin from '@/views/40_business/releaseorder/mixin/listResizeHandlerMixin'
import Pagination from '@/components/Pagination'
import constants_para from '@/common/constants/constants_para'
import elDragDialog from '@/directive/el-drag-dialog'
import deepCopy from 'deep-copy'
import permission from '@/directive/permission/index.js' // 权限判断指令

export default {
  components: { Pagination },
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
    return {
      dataJson: {
        // 查询使用的json
        searchForm: {
          // 翻页条件
          pageCondition: deepCopy(this.PARAMETERS.PAGE_CONDITION),
          // 查询条件
          name: '',
          config_key: '',
          // 默认参数 0-放货指令 1-借货指令
          order_type: 0
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
        // 表格排序规则
        sortOrders: deepCopy(this.PARAMETERS.SORT_PARA),
        // 按钮状态
        btnStatus: {
          showView: false,
          showProduct: false,
          showExport: false,
          showInsert: true,
          showUpdate: false
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
      }
    }
  },
  computed: {
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
      handler (newVal, oldVal) {
        if (newVal.length > 0) {
          this.settings.btnStatus.showUpdate = true
          this.settings.btnStatus.showDisable = true
        } else {
          this.settings.btnStatus.showUpdate = false
          this.settings.btnStatus.showDisable = false
        }
      }
    },

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
    // 初始化查询
    this.getDataList()
    // 数据初始化
    this.dataJson.tempJson = Object.assign({}, this.dataJson.tempJsonOriginal)
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
      getListCommApi(this.dataJson.searchForm).then(response => {
        // 增加对象属性，columnTypeShowIcon，columnNameShowIcon
        this.dataJson.listData = response.data.records
        this.dataJson.paging = response.data
        this.dataJson.paging.records = {}
      }).finally(() => {
        this.settings.loading = false
        // 重新计算列宽！
        this.$refs.multipleTable.doLayout()
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
      if (this.dataJson.currentJson.id !== undefined) {
        this.settings.btnStatus.showView = true
        this.settings.btnStatus.showProduct = true
        // 只能更新 wms 新增的
        if (this.dataJson.currentJson.source_type === 'wms') {
          this.settings.btnStatus.showUpdate = true
        } else {
          this.settings.btnStatus.showUpdate = false
        }
      } else {
        this.settings.btnStatus.showUpdate = false
        this.settings.btnStatus.showView = false
        this.settings.btnStatus.showProduct = false
      }
      // 设置dialog的返回
      this.$store.dispatch('popUpSearchDialog/selectedDataJson', Object.assign({}, row))
    },
    // 查看
    handleView () {
      this.popSettings.one.props.data = Object.assign({}, this.dataJson.currentJson)
      if (this.popSettings.one.props.data.id === undefined) {
        this.showErrorMsg('请选择一条数据')
        return
      }
      const operate_tab_data = {
        operate_tab_info: { show: true, name: '查看放货指令' },
        canEdit: false,
        editStatus: constants_para.STATUS_VIEW,
        data: this.popSettings.one.props.data
      }
      this.$router.push({
        query: {}
      })
      this.$emit('emitView', operate_tab_data)
    },
    // 下推配方生产工单
    handleProduct () {
      this.$router.push({
        path: '/wo/index', query: { p1: this.dataJson.currentJson.detail_id, fullpath: true }
      })
    },
    // 下推配比生产工单
    handleRtProduct () {
      this.$router.push({
        path: '/rtwo/index', query: { p1: this.dataJson.currentJson.detail_id, fullpath: true }
      })
    },
    // 新增
    handleInsert () {
      // const operate_tab_data = {
      //   operate_tab_info: { show: true, name: '新增放货指令' },
      //   canEdit: false,
      //   editStatus: constants_para.STATUS_INSERT
      // }
      // this.$router.push({
      //   query: {}
      // })
      // this.$emit('emitInsert', operate_tab_data)
      const operate_tab_data = {
        operate_tab_info: { show: true, name: '新增放货指令' },
        canEdit: false,
        editStatus: constants_para.STATUS_INSERT
      }
      this.$router.push({
        query: {}
      })
      this.$emit('emitInsert', operate_tab_data)
    },
    // 更新
    handleUpdate () {
      const operate_tab_data = {
        operate_tab_info: { show: true, name: '更新放货指令' },
        canEdit: false,
        editStatus: constants_para.STATUS_UPDATE,
        data: this.dataJson.currentJson
      }
      this.$router.push({
        query: {}
      })
      this.$emit('emitInsert', operate_tab_data)
    }
  }
}
</script>
