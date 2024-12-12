<template>
  <div class="app-container">
    <!--    <FloatMenu />-->
    <div>
      <el-form
        ref="minusForm"
        :inline="true"
        :model="dataJson.searchForm"
        label-position="getLabelPosition()"
      >
        <el-form-item>
          <el-input
            v-model.trim="dataJson.searchForm.user_name"
            clearable
            placeholder="用户名"
            @keyup.enter.native="handleSearch"
          />
        </el-form-item>
        <el-form-item label="">
          <el-input
            v-model.trim="dataJson.searchForm.staff_name"
            clearable
            placeholder="姓名"
            @keyup.enter.native="handleSearch"
          />
        </el-form-item>
        <!--        <el-form-item label="">-->
        <!--          <el-input-->
        <!--            v-model.trim="dataJson.searchForm.request_id"-->
        <!--            clearable-->
        <!--            placeholder="请求id"-->
        <!--            @keyup.enter.native="handleSearch"-->
        <!--          />-->
        <!--        </el-form-item>-->
        <el-form-item label="">
          <el-input
            v-model.trim="dataJson.searchForm.operation"
            clearable
            placeholder="操作说明"
            @keyup.enter.native="handleSearch"
          />
        </el-form-item>
        <!--        <el-form-item>-->
        <!--          <el-date-picker-->
        <!--            v-model="dataJson.searchForm.daterange"-->
        <!--            style="width: 292px"-->
        <!--            value-format="yyyy-MM-dd"-->
        <!--            type="daterange"-->
        <!--            align="right"-->
        <!--            unlink-panels-->
        <!--            range-separator="至"-->
        <!--            start-placeholder="开始日期"-->
        <!--            end-placeholder="结束日期"-->
        <!--            :picker-options="pickerOptions"-->
        <!--            @keyup.enter.native="handleSearch"-->
        <!--          />-->
        <!--        </el-form-item>-->
        <el-form-item style="float:right">
          <el-badge
            :value="screenNum"
            class="item"
          >
            <el-button
              v-popover:popover
              type="primary"
              plain
              icon="el-icon-search"
              :loading="settings.loading"
            >高级查询</el-button>
          </el-badge>
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

    <el-button-group v-if="!meDialogStatus">
      <el-button
        v-permission="'P_INPLAN:INFO'"
        :disabled="!settings.btnStatus.showView"
        type="primary"
        icon="el-icon-zoom-in"
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
        prop="No"
        label="No"
      />
      <el-table-column
        sortable="custom"
        :sort-orders="settings.sortOrders"
        :auto-fit="true"
        min-width="120"
        prop="user_name"
        label="操作用户"
      >
        <template v-slot="scope">
          {{ scope.row.user_name }} - {{ scope.row.staff_name }}
        </template>
      </el-table-column>
      <el-table-column
        sortable="custom"
        :sort-orders="settings.sortOrders"
        :auto-fit="true"
        min-width="120"
        prop="page_name"
        label="页面名称"
      />
      <el-table-column
        sortable="custom"
        :sort-orders="settings.sortOrders"
        :auto-fit="true"
        min-width="120"
        prop="operation"
        label="操作说明"
      />
      <el-table-column
        sortable="custom"
        :sort-orders="settings.sortOrders"
        :auto-fit="true"
        min-width="120"
        prop="operation"
        label="操作说明"
      />
    </el-table>
    <el-skeleton
      :rows="2"
      animated
      :loading="settings.skeletonLoading"
    >
      <pagination
        ref="minusPaging"
        :total="dataJson.paging.total"
        :page.sync="dataJson.paging.current"
        :limit.sync="dataJson.paging.size"
        @pagination="getDataList"
      />
    </el-skeleton>

  </div>
</template>

<style scoped>
/* br {
  display: block;
  margin: 10px;
  content: ' ';
} */
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
.perfect_popper .el-form-item--mini.el-form-item {
  margin-bottom: 10px;
}
.el-form-item--mini.el-form-item {
  margin-bottom: 10px;
}
/* sumData处的 el-link */
.el-link.el-link--default {
  font-size: 16px;
  vertical-align: top;
}
.el-tabs {
  margin-bottom: 5px;
}
</style>

<script>
import permission from '@/directive/permission/index.js' // 权限判断指令
import constants_program from '@/common/constants/constants_program'
import constants_para from '@/common/constants/constants_para'
import constants_type from '@/common/constants/constants_dict'
import { getListApi } from '@/api/30_wms/datachangelogoperation/datachangelogoperation'
import Pagination from '@/components/Pagination'
import elDragDialog from '@/directive/el-drag-dialog'
import deepCopy from 'deep-copy'
import mixin from './mixin/listResizeHandlerMixin'
// import urlUtil from '@/utils/urlUtil'

export default {
  components: { Pagination },
  directives: { elDragDialog, permission },
  mixins: [mixin],
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
    height: {
      type: Number,
      default: 200
    },
    searchData: {
      type: Object,
      default: null
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
      // 监听器
      watch: {
        unwatch_tempJson: null
      },
      constants_program: constants_program,
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
          // 翻页条件
          pageCondition: deepCopy(this.PARAMETERS.PAGE_CONDITION),
          contract_no: null,
          plan_code: '',
          // 查询条件
          name: '',
          config_key: '',
          consignor_id: '',
          owner_id: '',
          supplier_id: '',
          warehouse_id: '',
          consignor_name: '',
          sync_status: null,
          warehouse_type: null,
          todo_status: '2',
          daterange: [],
          status_list: ['3', '2', '1', '0', '5', '6', '7'],
          active_tabs_index: 2 // 当前被激活的页签

        },
        syncStatusList: [
          { 'status_name': '同步成功', 'sync_status': '1' },
          { 'status_name': '同步失败', 'sync_status': '0' }
        ],
        // 该计划单号下是否包含多条明细
        detail_count: 1,
        todoSearchForm: {},
        // 分页控件的json
        paging: deepCopy(this.PARAMETERS.PAGE_JSON),
        // table使用的json
        listData: null,
        sumData: {
          pending_count: 0,
          weight: 0,
          count: 0,
          sync_error_count: 0
        },
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
        reset3: false,
        reset4: false,
        // 表格排序规则
        sortOrders: deepCopy(this.PARAMETERS.SORT_PARA),
        // 按钮状态
        btnStatus: {
          showEnable: false,
          showDisable: false,
          showUpdate: false,
          showOperate: false,
          showView: false,
          showSubmit: false,
          showAudit: false,
          showReject: false,
          showCancel: false,
          showFinish: false,
          showSync: false,
          showExport: false
        },
        // 分页插件骨架 loading 状态
        skeletonLoading: true,
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
    },
    'dataJson.searchForm': {
      deep: true,
      handler (newVal, oldVal) {
        const screenKeys = ['consignor_name', 'goods_name', 'plan_code', 'ship_name', 'customer_name', 'sync_status', 'warehouse_type']
        if (this.isZhongLin) {
          screenKeys.push('owner_name')
        } else {
          screenKeys.push('warehouse_name')
        }
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
    // 默认查询近一个月内的数据
    this.setDateRange()
    // 接收url参数
    // 获取url参数
    // const p1 = urlUtil.getHashQueryVariable(window.location.href, 'p1')
    // this.init_List(p1)
    if (this.meDialogStatus) {
      if (this.searchData && this.searchData.type === 'b_schedule') {
        this.dataJson.searchForm.contract_no = this.searchData.contract_no
        this.dataJson.searchForm.status_list = ['2']
      }
    }
    if (this.$route.query.code !== null && this.$route.query.code !== undefined) {
      this.dataJson.searchForm.plan_code = this.$route.query.code
      this.dataJson.tabs.active = '2'
      this.dataJson.searchForm.daterange = []
    }
    if (this.$route.query.contract_no != null && this.$route.query.contract_no !== undefined) {
      this.dataJson.searchForm.contract_no = this.$route.query.contract_no
      this.dataJson.tabs.active = '2'
      this.dataJson.searchForm.daterange = []
    }
    // 业务单号
    if (this.$route.query.serial_code !== null && this.$route.query.serial_code !== undefined) {
      this.dataJson.searchForm.plan_code = this.$route.query.serial_code
      this.dataJson.tabs.active = '2'
      this.dataJson.searchForm.daterange = []
    }
    if (this.$route.query.sync_status !== null && this.$route.query.sync_status !== undefined) {
      this.dataJson.searchForm.sync_status = this.$route.query.sync_status + ''
      this.dataJson.tabs.active = '2'
      this.dataJson.searchForm.daterange = []
      this.dataJson.searchForm.start_time = null
      this.dataJson.searchForm.over_time = null
    }
    // 初始化watch
    this.setWatch()
    // 初始化查询
    this.getDataList()
    // 数据初始化
    this.dataJson.tempJson = Object.assign({}, this.dataJson.tempJsonOriginal)
  },
  mounted () {
    // 描绘完成
  },
  destroyed () {
    this.unWatch()
  },
  methods: {
    setWatch () {
      this.unWatch()
      // 监听页面上面是否有修改，有修改按钮高亮
      const _this = this
      _this.watch.unwatch_tempJson = _this.$watch('dataJson.multipleSelection', (newVal, oldVal) => {
        if (newVal.length > 0) {
          _this.settings.btnStatus.showEnable = true
          _this.settings.btnStatus.showDisable = true
          _this.settings.btnStatus.showSubmit = true
          _this.settings.btnStatus.showAudit = true
          _this.settings.btnStatus.showReject = true
          _this.settings.btnStatus.showFinish = true
          _this.settings.btnStatus.showSync = true
          _this.settings.btnStatus.showExport = true
        } else {
          _this.settings.btnStatus.showEnable = false
          _this.settings.btnStatus.showDisable = false
          _this.settings.btnStatus.showSubmit = false
          _this.settings.btnStatus.showAudit = false
          _this.settings.btnStatus.showReject = false
          _this.settings.btnStatus.showFinish = false
          _this.settings.btnStatus.showSync = false
          _this.settings.btnStatus.showExport = false
        }

        _this.dataJson.multipleSelection.forEach(function (value, index, array) {
          // console.log(constants_type.DICT_B_IN_PLAN_STATUS_ZD)
          // console.log(value.status)
          // console.log(value.status !== constants_type.DICT_B_IN_PLAN_STATUS_ZD)
          if (value.status !== constants_type.DICT_B_IN_PLAN_STATUS_ZD) {
            if (value.status === constants_type.DICT_B_IN_PLAN_STATUS_BH) {
              // 审核驳回状态可再次提交
              _this.settings.btnStatus.showSubmit = true
            } else {
              // 非制单状态不可提交
              _this.settings.btnStatus.showSubmit = false
            }
          }
          if (value.status !== constants_type.DICT_B_IN_PLAN_STATUS_YTJ && value.status !== constants_type.DICT_B_IN_PLAN_STATUS_CANCEL_BEING_AUDITED) {
            // 非已提交状态不可审核/驳回
            _this.settings.btnStatus.showAudit = false
            _this.settings.btnStatus.showReject = false
          }

          if (value.status !== constants_type.DICT_B_IN_PLAN_STATUS_TG) {
            // 非审核通过状态不可完成
            _this.settings.btnStatus.showFinish = false
          }
        })
      }, { deep: true }
      )

      this.watch.unwatch_tempJson1 = this.$watch('dataJson.searchForm.daterange', (newVal, oldVal) => {
        if (this.dataJson.searchForm.daterange === null) {
          this.dataJson.searchForm.start_time = null
          this.dataJson.searchForm.over_time = null
        }
      }, { deep: true }
      )
    },
    unWatch () {
      if (this.watch.unwatch_tempJson) {
        this.watch.unwatch_tempJson()
      }
      if (this.watch.unwatch_tempJson1) {
        this.watch.unwatch_tempJson1()
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
      // 查询数据变更日志列表
      getListApi(this.dataJson.searchForm).then(response => {
        if (this.dataJson.searchForm.todo_status === '0') {
          this.dataJson.tabsCount.todo = response.data.total
        }
        // this.dataJson.listData = response.data.records
        // alert(123)
        this.dataJson.listData = response.data.records
        this.dataJson.paging.total = response.data.page_count
        this.dataJson.paging = response.data
        this.dataJson.paging.records = {}
        this.settings.skeletonLoading = false
      }).finally(() => {
        this.settings.loading = false
      })
      // 查询总数量
      this.settings.skeletonLoading = true
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

      // 重置货主、客户、仓库等组件
      this.settings.reset1 = !this.settings.reset1
      this.settings.reset2 = !this.settings.reset2
      this.settings.reset3 = !this.settings.reset3
      this.settings.reset4 = !this.settings.reset4

      // 默认查询近一个月内的数据
      this.setDateRange()
    },

    // 获取row-key
    getRowKeys (row) {
      return row.id
    },
    // table选择框
    handleSelectionChange (val) {
      this.dataJson.multipleSelection = val
    },

    // 点击按钮 查看
    handleView () {
      this.popSettings.one.props.data = deepCopy(this.dataJson.currentJson)
      if (this.popSettings.one.props.data.id === undefined) {
        this.showErrorMsg('请选择一条数据')
        return
      }

      const operate_tab_data = {
        operate_tab_info: { show: true, name: '查看数据变更日志' },
        canEdit: true,
        editStatus: constants_para.STATUS_VIEW,
        data: this.popSettings.one.props.data
      }

      // window.history.pushState({ pushState: true }, '', `#${this.$route.path}?p2=${this.dataJson.currentJson.id}`)
      this.$router.push({
        query: {
          p2: this.dataJson.currentJson.id
        }
      })

      this.$emit('emitView', operate_tab_data)
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
        this.settings.btnStatus.showView = true
      }
      // 设置dialog的返回
      this.$store.dispatch('popUpSearchDialog/selectedDataJson', Object.assign({}, row))
    },

    // 设置创建时间的默认时间
    setDateRange () {
      const end = new Date()
      const start = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
      this.dataJson.searchForm.daterange.push(start)
      this.dataJson.searchForm.daterange.push(end)
      this.dataJson.searchForm.start_time = start
      this.dataJson.searchForm.over_time = end
    }
  }
}
</script>
