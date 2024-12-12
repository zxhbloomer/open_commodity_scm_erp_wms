<template>
  <div class="app-container">
    <FloatMenu />
    <div>
      <el-form
        v-if="searchsetting.visible"
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
            v-model.trim="dataJson.searchForm.contract_no"
            clearable
            placeholder="合同编号"
            @keyup.enter.native="handleSearch"
          />
        </el-form-item>
        <el-form-item>
          <select-dicts
            v-model="dataJson.searchForm.status_list"
            :para="CONSTANTS.DICT_B_IN_ORDER_STATUS"
            :filter-para="[-1]"
            init-placeholder="状态"
          />
        </el-form-item>
        <el-form-item>
          <el-input
            v-model.trim="dataJson.searchForm.goods_name"
            clearable
            placeholder="物料名称"
            @keyup.enter.native="handleSearch"
          />
        </el-form-item>
        <el-form-item>
          <el-input
            v-model.trim="dataJson.searchForm.goods_code"
            clearable
            placeholder="物料编码"
            @keyup.enter.native="handleSearch"
          />
        </el-form-item>
        <el-form-item>
          <select-supplier
            v-model.trim="dataJson.searchForm.supplier_name"
            :placeholder="isPlaceholderShow('请选择供应商')"
            :type="CONSTANTS.DICT_SUPPLIER"
            :reset="settings.reset1"
            @onReturnDataName="handleSupplierReturnDataName"
            @keyup.enter.native="handleSearch"
          />
        </el-form-item>
        <el-form-item>
          <el-select
            v-model="dataJson.searchForm.owner_name"
            placeholder="请选择货主"
            :disabled="isViewModel"
            filterable
            clearable
          >
            <el-option
              v-for="item in dataJson.ownerComboList"
              :key="item.id"
              :label="item.short_name"
              :value="item.short_name"
            />
          </el-select>
        </el-form-item>
        <el-form-item>
          <select-dict
            v-model="dataJson.searchForm.batch"
            :para="CONSTANTS.DICT_BUSINESS_START_TIME"
            init-placeholder="业务启动日期"
          />
        </el-form-item>
        <!-- <el-form-item style="float: right">
          <el-badge
            :value="screenNum"
            class="item"
          >
            <el-button
              v-popover:popover
              type="primary"
              plain
              :loading="settings.loading"
              icon="el-icon-search"
            >高级查询</el-button>
          </el-badge>
        </el-form-item> -->
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
    <!-- <el-popover
      ref="popover"
      placement="top"
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

        <el-divider />
        <div style="text-align: right; margin: 0">
          <el-button
            type="text"
            @click="doResetSearch"
          >重置</el-button>
          <el-button
            type="primary"
            :loading="settings.loading"
            @click="handleSearch"
          >提交</el-button>
        </div>
      </el-form>
    </el-popover> -->

    <el-button-group v-if="searchsetting.visible">
      <el-button
        v-permission="'P_IN_ORDER:ADD'"
        type="primary"
        icon="el-icon-circle-plus-outline"
        :loading="settings.loading"
        @click="handleInsert"
      >新增</el-button>
      <el-button
        v-permission="'P_IN_ORDER:UPDATE'"
        :disabled="!settings.btnStatus.showUpdate"
        type="primary"
        icon="el-icon-edit-outline"
        :loading="settings.loading"
        @click="handleUpdate"
      >修改</el-button>
      <el-button
        v-permission="'P_IN_ORDER:UPLOAD_IN_ORDER'"
        :disabled="!settings.btnStatus.showUpload"
        type="primary"
        icon="el-icon-edit-outline"
        :loading="settings.loading"
        @click="handleUploadFile"
      >上传收货确认函</el-button>
      <el-button
        v-permission="'P_IN_ORDER:EXPORT'"
        :disabled="!settings.btnStatus.showExport"
        type="primary"
        icon="el-icon-s-management"
        :loading="settings.loading"
        @click="handleExport"
      >导出</el-button>
      <el-button
        v-permission="'P_IN_ORDER:DELETE'"
        :disabled="!settings.btnStatus.showDelete"
        type="primary"
        icon="el-icon-s-management"
        :loading="settings.loading"
        @click="handleDelete"
      >删除</el-button>
      <el-button
        v-permission="'P_IN_ORDER:SEND_IN_PLAN'"
        :disabled="!settings.btnStatus.showSendInPlan"
        type="primary"
        icon="el-icon-s-management"
        :loading="settings.loading"
        @click="handleSendInPlan"
      >下推入库计划</el-button>
      <el-button
        v-permission="'P_IN_ORDER:INFO'"
        :disabled="!settings.btnStatus.showView"
        type="primary"
        icon="el-icon-s-management"
        :loading="settings.loading"
        @click="handleView"
      >查看</el-button>
    </el-button-group>

    <div
      v-if="!meDialogStatus"
      class="div-sum"
    >
      <div class="right">
        <span class="count-title">累计合同量：</span><span class="count-data">{{ dataJson.sumData.contract_num == null?'': isZhongLin ? formatNumber3(dataJson.sumData.contract_num) : formatNumber(dataJson.sumData.contract_num,true,4) }}</span>
        <span class="count-title">累计已入库数量：</span><span class="count-data">{{ dataJson.sumData.in_actual_count == null?'': isZhongLin ? formatNumber3(dataJson.sumData.in_actual_count) : formatNumber(dataJson.sumData.in_actual_count,true,4) }}</span>
      </div>
    </div>

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
        prop="contract_no"
        label="合同编号"
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
        align="right"
        prop="schedule_count"
        label="物流订单数量"
      >
        <template v-slot="scope">
          <router-link :to="{name:dataJson.constants_program.P_LOGISTICS,query:{contract_no:scope.row.contract_no, fullpath:true}}"><a href="javascript:void(0)">{{ scope.row.schedule_count == null?0:scope.row.schedule_count }}</a></router-link>
        </template>
      </el-table-column>
      <el-table-column
        sortable="custom"
        :sort-orders="settings.sortOrders"
        :auto-fit="true"
        min-width="130"
        prop="status_name"
        label="状态"
      />
      <el-table-column
        :sort-orders="settings.sortOrders"
        :auto-fit="true"
        min-width="55"
        prop="idx"
        label="序号"
      />

      <el-table-column
        sortable="custom"
        :sort-orders="settings.sortOrders"
        :auto-fit="true"
        min-width="130"
        prop="bill_type_name"
        label="单据类型"
      />
      <el-table-column
        sortable="custom"
        min-width="150"
        :sort-orders="settings.sortOrders"
        :auto-fit="true"
        prop="contract_dtf"
        label="合同日期"
      />
      <el-table-column
        sortable="custom"
        min-width="150"
        :sort-orders="settings.sortOrders"
        :auto-fit="true"
        prop="contract_expire_dt"
        label="到期日期"
      >
        <template v-slot="scope">
          {{ scope.row.contract_expire_dt == null?'':formatDate(scope.row.contract_expire_dt) }}
        </template>
      </el-table-column>
      <el-table-column
        sortable="custom"
        min-width="150"
        :sort-orders="settings.sortOrders"
        :auto-fit="true"
        prop="supplier_name"
        label="供应商名称"
      />
      <el-table-column
        sortable="custom"
        min-width="150"
        :sort-orders="settings.sortOrders"
        :auto-fit="true"
        prop="owner_name"
        label="货主名称"
      />
      <el-table-column
        sortable="custom"
        min-width="150"
        :sort-orders="settings.sortOrders"
        :auto-fit="true"
        prop="goods_name"
        label="商品名称"
      />
      <el-table-column
        sortable="custom"
        min-width="150"
        :sort-orders="settings.sortOrders"
        :auto-fit="true"
        prop="pm"
        label="品名"
      />
      <el-table-column
        sortable="custom"
        min-width="150"
        :sort-orders="settings.sortOrders"
        :auto-fit="true"
        prop="spec"
        label="规格"
      />
      <el-table-column
        sortable="custom"
        :sort-orders="settings.sortOrders"
        align="right"
        min-width="120"
        prop="num"
        label="合同量"
      >
        <template v-slot="scope">
          {{ scope.row.contract_num == null?'': isZhongLin ? formatNumber3(scope.row.contract_num) : formatNumber(scope.row.contract_num,true,4) }}
        </template>
      </el-table-column>
      <el-table-column
        sortable="custom"
        :sort-orders="settings.sortOrders"
        align="right"
        min-width="120"
        prop="num"
        label="合同金额"
      >
        <template v-slot="scope">
          {{ scope.row.amount == null?'': formatCurrency(scope.row.amount) }}
        </template>
      </el-table-column>
      <el-table-column
        sortable="custom"
        :sort-orders="settings.sortOrders"
        align="right"
        min-width="120"
        prop="in_actual_count"
        label="已入库数量"
      >
        <template v-slot="scope">
          {{ scope.row.in_actual_count == null?'0': isZhongLin ? formatNumber3(scope.row.in_actual_count) : formatNumber(scope.row.in_actual_count,true,4) }}
        </template>
      </el-table-column>
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
import { getListApi, getListSumApi, exportApi, deleteApi } from '@/api/40_business/inorder/inorder'
import resizeMixin from '@/views/40_business/inorder/tabs/mixin/listResizeHandlerMixin'
import Pagination from '@/components/Pagination'
import elDragDialog from '@/directive/el-drag-dialog'
import editDialog from '@/views/40_business/inorder/dialog/edit'
import deliveryDialog from '@/views/40_business/inorder/dialog/delivery'
import deepCopy from 'deep-copy'
import permission from '@/directive/permission/index.js' // 权限判断指令
import constants_para from '@/common/constants/constants_para'
import SelectSupplier from '@/views/30_wms/customer/selectgrid/selectCustomer'
import { getOwnerComboListApi } from '@/api/30_wms/owner/owner'
import SelectDicts from '@/components/00_dict/select/SelectDicts'
import constants_program from '@/common/constants/constants_program'
import urlUtil from '@/utils/urlUtil'
import SelectDict from '@/components/00_dict/select/SelectDict.vue'
import { mapState } from 'vuex'

export default {
  components: { SelectDict, Pagination, editDialog, deliveryDialog, SelectSupplier, SelectDicts },
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
          name: '',
          owner_name: null,
          goods_name: null,
          goods_code: null,
          status_list: [],
          supplier_name: '',
          // 启动日期
          batch: ''
        },
        sumData: {
          contract_num: 0,
          in_actual_count: 0
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
          showUpdate: false,
          showSendInPlan: false,
          showCopyInsert: false,
          showExport: false,
          showUpload: false,
          showView: false
        },
        // loading 状态
        loading: true,
        tableHeight: this.setUIheight(),
        duration: 4000,
        reset1: false,
        reset2: false
      },
      // 高级查询监视
      screenNum: 0,
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
    /*     'data': {
      deep: true,
      handler (newVal) {
        debugger
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
    }, */
    // 选中的数据，使得导出按钮可用，否则就不可使用
    'dataJson.multipleSelection': {
      deep: true,
      handler (newVal, oldVal) {
        if (newVal.length > 0) {
          this.settings.btnStatus.showDelete = true
          this.settings.btnStatus.showEnable = true
          this.settings.btnStatus.showDisable = true
          this.settings.btnStatus.showExport = true
        } else {
          this.settings.btnStatus.showDelete = false
          this.settings.btnStatus.showEnable = false
          this.settings.btnStatus.showDisable = false
          this.settings.btnStatus.showExport = false
        }

        // 高级查询监视
        // const screenKeys = ['owner_name', 'goods_code', 'goods_name', 'supplier_name', 'status_list']
        // const { searchForm } = this.dataJson
        // const data = Object.keys(searchForm).map(item => {
        //   if (screenKeys.includes(item)) {
        //     if (Array.isArray(searchForm[item])) {
        //       return searchForm[item].length > 0 ? searchForm[item] : undefined
        //     } else {
        //       return searchForm[item]
        //     }
        //   }
        // })
        // const len = data.filter(x => x).length || 0
        // this.screenNum = len
      }
    }
  },
  created () {
    if (this.$route.query.supplier_name !== null && this.$route.query.supplier_name !== undefined) {
      this.dataJson.searchForm.supplier_name = this.$route.query.supplier_name
      this.dataJson.searchForm.status_list.push('0')
      this.dataJson.searchForm.status_list.push('1')
    }

    if (this.$route.query.goods_name !== null && this.$route.query.goods_name !== undefined) {
      this.dataJson.searchForm.goods_name = this.$route.query.goods_name
    }
    if (this.$route.query.goods_code !== null && this.$route.query.goods_code !== undefined) {
      this.dataJson.searchForm.goods_code = this.$route.query.goods_code
    }
    if (this.$route.query.owner_name !== null && this.$route.query.owner_name !== undefined) {
      this.dataJson.searchForm.owner_name = this.$route.query.owner_name
    }
    if (this.$route.query.batch !== null && this.$route.query.batch !== undefined) {
      this.dataJson.searchForm.batch = this.$route.query.batch
    } else {
      this.dataJson.searchForm.batch = this.dict_value
    }
    location.href = urlUtil.delParam(window.location.href, 'fullpath')
    // 初始化货主下拉框
    this.getOwnerData()
    // 初始化查询
    this.getDataList()
    // 数据初始化
    this.dataJson.tempJson = Object.assign({}, this.dataJson.tempJsonOriginal)
    if (this.meDialogStatus) {
      // this.searchsetting.visible = false
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
      getListSumApi(this.dataJson.searchForm).then(response => {
        if (response.data !== null) {
          this.dataJson.sumData = response.data
        } else {
          this.dataJson.sumData.contract_num = 0
          this.dataJson.sumData.in_actual_count = 0
        }
      }).finally(() => {
      })
    },
    // 重置查询区域
    doResetSearch () {
      this.dataJson.searchForm = this.$options.data.call(this).dataJson.searchForm
      this.settings.reset2 = !this.settings.reset2
      this.settings.reset1 = !this.settings.reset1
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
        operate_tab_info: { show: true, name: '新增入库定单' },
        canEdit: true,
        editStatus: constants_para.STATUS_INSERT
      }

      this.$emit('emitInsert', operate_tab_data)
    },

    // 点击按钮 复制新增
    handleCopyInsert () {
      this.popSettings.one.props.data = Object.assign({}, this.dataJson.currentJson)
      // 复制新增
      this.popSettings.one.props.dialogStatus = this.PARAMETERS.STATUS_COPY_INSERT
      this.popSettings.one.visible = true
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
        operate_tab_info: { show: true, name: '新增入库定单' },
        canEdit: true,
        data: this.popSettings.one.props.data,
        editStatus: constants_para.STATUS_UPDATE
      }

      this.$emit('emitInsert', operate_tab_data)
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
        case this.PARAMETERS.STATUS_COPY_INSERT:
          this.doCopyInsertModelCallBack(val)
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
    // 处理复制新增回调
    doCopyInsertModelCallBack (val) {
      if (val.return_flag) {
        this.popSettings.one.visible = false
        // 设置到table中绑定的json数据源
        this.dataJson.listData.unshift(val.data.data)
        // 设置到currentjson中
        this.dataJson.currentJson = Object.assign({}, val.data.data)
        this.$notify({
          title: '复制新增处理成功',
          message: val.data.message,
          type: 'success',
          duration: this.settings.duration
        })
      } else {
        this.$notify({
          title: '复制新增处理失败',
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
        // 业务中台推过来的, 不可修改
        if (this.dataJson.currentJson.source_type !== '1') {
          this.settings.btnStatus.showUpdate = false
          this.settings.btnStatus.showSendInPlan = false
        } else {
          this.settings.btnStatus.showUpdate = true
          this.settings.btnStatus.showSendInPlan = true
        }
        this.settings.btnStatus.showUpload = true
        this.settings.btnStatus.showView = true
      } else {
        this.settings.btnStatus.showUpdate = false
        this.settings.btnStatus.showUpload = false
        this.settings.btnStatus.showSendInPlan = false
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
    // 货主下拉框
    getOwnerData () {
      getOwnerComboListApi().then((_data) => {
        this.dataJson.ownerComboList = _data.data
      }, (_error) => {
      })
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
        selectionJson.push(value.id + '_' + value.sku_id)
      })
      this.dataJson.searchForm.ids = selectionJson
      // 开始导出
      exportApi(this.dataJson.searchForm).then(response => {
        this.settings.loading = false
      }).finally(() => {
        this.settings.loading = false
      })
    },
    handleDelete () {
      if (this.dataJson.multipleSelection.length <= 0) {
        this.$alert('请在表格中选择数据进行删除', '未选择数据错误', {
          confirmButtonText: '关闭',
          type: 'error'
        }).then(() => {
          this.settings.btnStatus.showDelete = false
        })
      } else {
        // loading
        this.settings.loading = true
        const selectionJson = []
        this.dataJson.multipleSelection.forEach(function (value, index, array) {
          selectionJson.push({ 'id': value.id })
        })
        // 开始删除
        deleteApi(selectionJson).then(_data => {
          this.$notify({
            title: '删除成功',
            message: _data.message,
            type: 'success',
            duration: this.settings.duration
          })
          this.getDataList()
        }, (_error) => {
          this.$notify({
            title: '删除错误',
            message: _error.message,
            type: 'error',
            duration: this.settings.duration
          })
        }).finally(() => {
          this.settings.loading = false
        })
      }
    },
    // 下推入库计划
    handleSendInPlan () {
      this.$router.push({
        path: '/in/plan', query: { p4: this.dataJson.currentJson.id, sku_code: this.dataJson.currentJson.sku_code, fullpath: true }
      })
    },
    // 查看
    handleView () {
      this.popSettings.one.props.data = Object.assign({}, this.dataJson.currentJson)
      if (this.popSettings.one.props.data.id === undefined) {
        this.showErrorMsg('请选择一条数据')
        return
      }
      // 更新
      const operate_tab_data = {
        operate_tab_info: { show: true, name: '查看入库订单' },
        canEdit: true,
        data: this.popSettings.one.props.data,
        editStatus: constants_para.STATUS_VIEW
      }
      this.$emit('emitInsert', operate_tab_data)
    }
  }
}
</script>
