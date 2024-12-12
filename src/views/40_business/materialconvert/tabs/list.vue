<template>

  <div class="app-container">
    <FloatMenu />
    <el-form
      ref="minusForm"
      :inline="true"
      :model="dataJson.searchForm"
      label-position="getLabelPosition()"
      class="search-form-floatRight"
    >
      <el-form-item label="">
        <el-input
          v-model.trim="dataJson.searchForm.code"
          clearable
          placeholder="物料转换单号"
          @keyup.enter.native="handleSearch"
        />
      </el-form-item>
      <el-form-item label="">
        <el-select
          v-model="dataJson.searchForm.owner_id"
          :placeholder="isPlaceholderShow('请选择货主')"
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

      <el-form-item>
        <el-button
          type="primary"
          plain
          icon="el-icon-search"
          :loading="settings.loading"
          @click="handleSearch"
        >查询</el-button>
      </el-form-item>
      <el-form-item>
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
      </el-form-item>
    </el-form>
    <el-popover
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
        <el-form-item label="仓库">
          <el-select
            v-model.trim="dataJson.searchForm.warehouse_id"
            placeholder="仓库"
            :loading="settings.loading"
            loading-text="拼命加载..."
            clearable
            filterable
          >
            <el-option
              v-for="item in dataJson.warehouseComboList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="转换后物料名称/规格/编号">
          <el-input
            v-model.trim="dataJson.searchForm.target_goods_name"
            clearable
            placeholder="转换后物料名称/规格/编号"
            @keyup.enter.native="handleSearch"
          />
        </el-form-item>
        <el-form-item label="转换类型">
          <select-dict
            v-model="dataJson.searchForm.type"
            :para="CONSTANTS.DICT_B_MATERIAL_CONVERT_TYPE"
            init-placeholder="转换类型"
            :disabled="isViewModel"
          />
        </el-form-item>

        <!-- <el-form-item label="创建时间起">
          <el-date-picker
            v-model="dataJson.searchForm.c_time"
            value-format="yyyy-MM-dd"
            type="date"
            clearable
            :placeholder="isPlaceholderShow('创建时间起')"
          />
        </el-form-item>
        <el-form-item label="创建时间止">
          <el-date-picker
            v-model="dataJson.searchForm.over_time"
            value-format="yyyy-MM-dd"
            type="date"
            clearable
            :placeholder="isPlaceholderShow('创建时间止')"
          />
        </el-form-item> -->
        <el-row>
          <el-col :span="12">
            <el-form-item label="物料转换时间起止">
              <el-date-picker
                v-model="dataJson.searchForm.daterange"
                value-format="yyyy-MM-dd"
                type="daterange"
                align="right"
                unlink-panels
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                :picker-options="pickerOptions"
              />
            </el-form-item>
          </el-col>
        </el-row>

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
    </el-popover>

    <el-button-group>

      <!-- <el-button
        v-permission="'P_MATERIALCONVERT:ADD'"
        type="primary"
        icon="el-icon-circle-plus-outline"
        :loading="settings.loading"
        @click="handleInsert"
      >
        新增
      </el-button>
      <el-button
        v-permission="'P_MATERIALCONVERT:UPDATE'"
        :disabled="!settings.btnStatus.showUpdate"
        type="primary"
        icon="el-icon-zoom-in"
        :loading="settings.loading"
        @click="handleEdit"
      >修改</el-button>
      <el-button
        v-permission="'P_MATERIALCONVERT:SUBMIT'"
        :disabled="!settings.btnStatus.showSubmit"
        type="primary"
        icon="el-icon-circle-check"
        :loading="settings.loading"
        @click="handleSubmit"
      >提交</el-button>
      <el-button
        v-permission="'P_MATERIALCONVERT:AUDIT'"
        :disabled="!settings.btnStatus.showAudit"
        type="primary"
        icon="el-icon-check"
        :loading="settings.loading"
        @click="handleAudit"
      >审核</el-button> -->
      <el-button
        v-permission="'P_MATERIALCONVERT:INFO'"
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
        label="No"
      />
      <el-table-column
        label="物料转换单号"
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
        prop="name"
        label="名称"
      />
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
        prop="owner_name"
        label="货主"
      />
      <el-table-column
        sortable="custom"
        :sort-orders="settings.sortOrders"
        :auto-fit="true"
        min-width="120"
        prop="warehouse_name"
        label="仓库"
      />

      <el-table-column
        sortable="custom"
        :sort-orders="settings.sortOrders"
        :auto-fit="true"
        min-width="120"
        prop="type_name"
        label="转换类型"
      />

      <!-- <el-table-column
        sortable="custom"
        :sort-orders="settings.sortOrders"
        :auto-fit="true"
        min-width="120"
        prop="source_goods_name"
        label="原物料名称"
      />
      <el-table-column
        sortable="custom"
        :sort-orders="settings.sortOrders"
        :auto-fit="true"
        min-width="120"
        prop="source_pm"
        label="原品名"
      />
      <el-table-column
        sortable="custom"
        :sort-orders="settings.sortOrders"
        :auto-fit="true"
        min-width="120"
        prop="source_spec"
        align="center"
        label="原规格"
      />
      <el-table-column
        sortable="custom"
        :sort-orders="settings.sortOrders"
        :auto-fit="true"
        min-width="120"
        prop="source_sku_code"
        align="center"
        label="原规格编号"
      />
      -->
      <el-table-column
        sortable="custom"
        :sort-orders="settings.sortOrders"
        :auto-fit="true"
        min-width="150"
        prop="target_goods_name"
        label="转换后物料名称"
      />
      <el-table-column
        sortable="custom"
        :sort-orders="settings.sortOrders"
        :auto-fit="true"
        min-width="120"
        prop="target_pm"
        label="转换后品名"
      />
      <el-table-column
        sortable="custom"
        :sort-orders="settings.sortOrders"
        :auto-fit="true"
        min-width="120"
        prop="target_spec"
        align="center"
        label="转换后规格"
      />
      <el-table-column
        sortable="custom"
        :sort-orders="settings.sortOrders"
        :auto-fit="true"
        min-width="120"
        prop="target_sku_code"
        align="center"
        label="转换后规格编号"
      />
      <!--
      <el-table-column
        sortable="custom"
        :sort-orders="settings.sortOrders"
        min-width="150"
        prop="calc"
        label="转换比例"
        align="center"
      >
        <template v-slot="scope">
          1: {{ scope.row.calc }}
        </template>
      </el-table-column>
      -->
      <el-table-column
        sortable="custom"
        :sort-orders="settings.sortOrders"
        :auto-fit="true"
        min-width="120"
        prop="count"
        align="center"
        label="数量"
      />
      <!-- <el-table-column
        min-width="100"
        :sort-orders="settings.sortOrders"
        :auto-fit="true"
        label="启用状态"
        prop="is_effective"
        :render-header="renderHeaderIsEnabled"
      >
        <template v-slot="scope">
          <el-tooltip
            :content="scope.row.is_effective === 'false' ? '启用状态：未启用' : '启用状态：已启用' "
            placement="top"
            :open-delay="500"
          >
            <el-switch
              v-model="scope.row.is_effective"
              active-color="#13ce66"
              inactive-color="#ff4949"
              :active-value="true"
              :inactive-value="false"
              :width="30"
              @change="handledEnableOrDisAbleApi(scope.row)"
            />
          </el-tooltip>
        </template>
      </el-table-column> -->
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
      <!-- <el-table-column
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
      </el-table-column> -->
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
  width: 371px;
}
.el-button-group {
  margin-bottom: 10px;
  max-width: 50%;
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
.perfect_popper .el-form-item--mini.el-form-item {
  margin-bottom: 10px;
}
</style>

<script>
import { getOwnerComboListApi } from '@/api/30_wms/owner/owner'
import SelectDict from '@/components/00_dict/select/SelectDict'
import constants_para from '@/common/constants/constants_para'
import constants_type from '@/common/constants/constants_dict'
import { getWarehouseComboListApi } from '@/api/30_wms/warehouse/warehouse'
import { getListApi, enableApi, submitApi, auditApi } from '@/api/40_business/materialconvert/materialconvert'
import Pagination from '@/components/Pagination'
import elDragDialog from '@/directive/el-drag-dialog'
import deepCopy from 'deep-copy'
import mixin from './mixin/listResizeHandlerMixin'
import permission from '@/directive/permission/index.js' // 权限判断指令

export default {
  components: { Pagination, SelectDict },
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
        tabsCount: {
          all: 0,
          todo: 0
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

          todo_status: '0',
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
          showAudit: false
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
    'dataJson.searchForm': {
      deep: true,
      handler (newVal, oldVal) {
        const screenKeys = ['warehouse_id', 'target_goods_name', 'type', 'status', 'daterange']
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

        if (this.dataJson.searchForm.daterange === null) {
          this.dataJson.searchForm.start_time = null
          this.dataJson.searchForm.over_time = null
        }
      }
    }
  },
  created () {
    if (this.$route.query.code !== null && this.$route.query.code !== undefined) {
      this.dataJson.searchForm.code = this.$route.query.code
    }

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
          this.settings.btnStatus.showSubmit = true
          this.settings.btnStatus.showAudit = true
        } else {
          this.settings.btnStatus.showEnable = false
          this.settings.btnStatus.showDisable = false
          this.settings.btnStatus.showSubmit = false
          this.settings.btnStatus.showAudit = false
        }

        var _this = this
        this.dataJson.multipleSelection.forEach(function (value, index, array) {
          console.log(value.status)
          if (value.status !== constants_type.DICT_B_MATERIAL_CONVERT_STATUS_ZD) {
            // 非制单状态不可提交
            _this.settings.btnStatus.showSubmit = false
          }

          if (value.status !== constants_type.DICT_B_MATERIAL_CONVERT_STATUS_YTJ) {
            // 非已提交状态不可审核
            _this.settings.btnStatus.showAudit = false
          }
        })
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
        editStatus: constants_para.STATUS_UPDATE,
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
    renderHeaderIsEnabled: function (h, { column }) {
      return (
        <span>{column.label}
          <el-tooltip
            class='item'
            effect='dark'
            placement='bottom'
          >
            <div slot='content'>
              启用状态提示：<br />
              绿色：已启用  <br />
              红色：未启用
            </div>
            <svg-icon icon-class='perfect-icon-question1_btn' style='margin-left: 5px' />
          </el-tooltip>
        </span>
      )
    },
    // 启用/停用
    handledEnableOrDisAbleApi (row) {
      let _message = ''
      const _value = row.is_effective
      const selectionJson = [{ 'id': row.id, 'material_convert_id': row.material_convert_id }]
      if (_value === false) {
        _message = '是否要停用该条数据？'
      } else {
        _message = '是否要启用该条数据？'
      }
      // 选择全部的时候
      this.$confirm(_message, '确认信息', {
        distinguishCancelAndClose: true,
        confirmButtonText: '确认',
        cancelButtonText: '取消'
      }).then(() => {
        // loading
        this.settings.loading = true
        enableApi(selectionJson).then((_data) => {
          this.$notify({
            title: '更新处理成功',
            message: _data.message,
            type: 'success',
            duration: this.settings.duration
          })
        }, (_error) => {
          this.$notify({
            title: '更新处理失败',
            message: _error.message,
            type: 'error',
            duration: this.settings.duration
          })
          row.enable = !row.enable
        }).finally(() => {
          this.getDataList()
          this.popSettingsData.dialogFormVisible = false
          this.settings.loading = false
        })
      }).catch(action => {
        row.is_effective = !row.is_effective
      })
    },
    // 提交按钮
    handleSubmit () {
      // 没有选择任何数据的情况
      if (this.dataJson.multipleSelection.length <= 0) {
        this.$alert('请在表格中选择数据进行提交', '未选择数据错误', {
          confirmButtonText: '关闭',
          type: 'error'
        }).then(() => {
          this.settings.btnStatus.showDelete = false
        })
      } else {
        // 选中数据提交
        this.handleSubmitSelectionData()
      }
    },
    // 提交数据
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
