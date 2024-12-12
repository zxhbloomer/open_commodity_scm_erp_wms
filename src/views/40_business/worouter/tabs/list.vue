<template>
  <div class="app-container">
    <!-- <FloatMenu v-if="!meDialogStatus" /> -->
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
            placeholder="配方编号"
            @keyup.enter.native="handleSearch"
          />
        </el-form-item>

        <el-form-item label="">
          <el-input
            v-model.trim="dataJson.searchForm.name"
            clearable
            placeholder="配方名称"
            @keyup.enter.native="handleSearch"
          />
        </el-form-item>

        <el-form-item>
          <select-dict
            v-model="dataJson.searchForm.is_enable"
            :para="CONSTANTS.DICT_B_ROUTER_ENABLE"
            init-placeholder="状态"
            :disabled="isViewModel"
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
          <el-date-picker
            v-model="dataJson.searchForm.daterange"
            value-format="yyyy-MM-dd"
            type="daterange"
            align="right"
            unlink-panels
            range-separator="至"
            start-placeholder="创建开始日期"
            end-placeholder="创建结束日期"
            :picker-options="pickerOptions"
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
    </div>
    <el-popover
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

        <el-form-item label="产成品,副产品名称或编码">
          <el-input
            v-model.trim="dataJson.searchForm.product_goods_name"
            clearable
            placeholder="请输入"
            @keyup.enter.native="handleSearch"
          />
        </el-form-item>

        <el-form-item label="原材料名称或编码">
          <el-input
            v-model.trim="dataJson.searchForm.material_goods_name"
            clearable
            placeholder="请输入"
            @keyup.enter.native="handleSearch"
          />
        </el-form-item>

        <el-form-item label="创建时间起止">
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
            @keyup.enter.native="handleSearch"
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
            :loading="settings.loading"
            @click="handleSearch"
          >提交</el-button>
        </div>
      </el-form>
    </el-popover>
    <el-button-group v-if="!meDialogStatus">

      <el-button
        v-permission="'P_WO_ROUTER:ADD'"
        type="primary"
        icon="el-icon-circle-plus-outline"
        :loading="settings.loading"
        @click="handleInsert"
      >
        新增
      </el-button>
      <el-button
        v-permission="'P_WO_ROUTER:UPDATE'"
        :disabled="!settings.btnStatus.showUpdate"
        type="primary"
        icon="el-icon-zoom-in"
        :loading="settings.loading"
        @click="handleEdit"
      >编辑</el-button>
      <el-button
        v-permission="'P_WO_ROUTER:ENABLE'"
        :disabled="!settings.btnStatus.showEnable"
        type="primary"
        icon="el-icon-zoom-in"
        :loading="settings.loading"
        @click="handleEnable"
      >启用</el-button>
      <el-button
        v-permission="'P_WO_ROUTER:DISABLE'"
        :disabled="!settings.btnStatus.showDisable"
        type="primary"
        icon="el-icon-zoom-in"
        :loading="settings.loading"
        @click="handleDisabled"
      >禁用</el-button>
      <el-button
        v-permission="'P_WO_ROUTER:INFO'"
        :disabled="!settings.btnStatus.showUpdate"
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
      columns_index_key="false"
      stripe
      border
      fit
      highlight-current-row
      :default-sort="{prop: 'u_time', order: 'descending'}"
      style="width: 100%"
      :cell-class-name="getCellClass"
      @row-click="handleRowClick"
      @row-dblclick="handleRowDbClick"
      @current-change="handleCurrentChange"
      @selection-change="handleSelectionChange"
    >
      <!-- <el-table-column
        type="selection"
        width="55"
        prop="id"
      /> -->
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
        prop="code"
        label="配方编号"
      />
      <el-table-column
        sortable="custom"
        :sort-orders="settings.sortOrders"
        :auto-fit="true"
        min-width="120"
        prop="name"
        label="配方名称"
      >
        <template slot-scope="scope">
          <span style="font-weight: bold;"> {{ scope.row.name }} </span>
        </template>
      </el-table-column>
      <el-table-column
        :auto-fit="true"
        min-width="180"
        prop=""
        label="产成品,副产品产量公式"
      >
        <template>
          <el-popover
            placement="top-start"
            trigger="click"
          >
            <div>产成品、副产品产量=产成品产量 ÷ 产成品配比</div>
            <div>产成品产量=产成品、副产品产量 * 产成品配比</div>
            <div>副产品产量=产成品、副产品产量 * 副产品配比</div>
            <el-button
              slot="reference"
              type="text"
            >查看</el-button>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column
        :auto-fit="true"
        min-width="150"
        label="原材料消耗公式"
      >
        <template>
          <el-popover
            placement="top-start"
            trigger="click"
          >
            <div> 原材料消耗量=产成品、副产品总产量(消耗=产出)</div>
            <el-button
              slot="reference"
              type="text"
            >查看</el-button>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column
        label="产成品、副产品配比"
        align="center"
        :merge-group="true"
      >
        <el-table-column
          :merge-cells="true"
          min-width="80"
          label="产品类型"
        >
          <template v-slot="scope">
            <div
              v-for="(item, index) in scope.row.product_list"
              :key="index"
              :class="getClass(index, scope.row.product_list.length)"
            > {{ item.type_name }}
            </div>
          </template>
        </el-table-column>
        <el-table-column
          :merge-cells="true"
          min-width="80"
          label="商品属性"
        >
          <template v-slot="scope">
            <div
              v-for="(item, index) in scope.row.product_list"
              :key="index"
              :class="getClass(index, scope.row.product_list.length)"
            > {{ item.goods_prop }} </div>
          </template>
        </el-table-column>
        <el-table-column
          :merge-cells="true"
          min-width="80"
          label="物料名称"
        >
          <template v-slot="scope">
            <div
              v-for="(item, index) in scope.row.product_list"
              :key="index"
              :class="getClass(index, scope.row.product_list.length)"
            > {{ item.goods_name }} </div>
          </template>
        </el-table-column>
        <el-table-column
          :merge-cells="true"
          min-width="100"
          label="物料编码"
        >
          <template v-slot="scope">
            <div
              v-for="(item, index) in scope.row.product_list"
              :key="index"
              :class="getClass(index, scope.row.product_list.length)"
            > {{ item.sku_code }} </div>
          </template>
        </el-table-column>
        <el-table-column
          :merge-cells="true"
          min-width="80"
          label="规格"
        >
          <template v-slot="scope">
            <div
              v-for="(item, index) in scope.row.product_list"
              :key="index"
              :class="getClass(index, scope.row.product_list.length)"
            > {{ item.spec }} </div>
          </template>
        </el-table-column>
        <el-table-column
          :merge-cells="true"
          min-width="80"
          label="配比(%)"
          align="right"
        >
          <template v-slot="scope">
            <div
              v-for="(item, index) in scope.row.product_list"
              :key="index"
              :class="getClass(index, scope.row.product_list.length)"
            > {{ item.router }} </div>
          </template>
        </el-table-column>
      </el-table-column>

      <el-table-column
        label="原材料消耗配比"
        align="center"
        :merge-group="true"
      >
        <el-table-column
          :merge-cells="true"
          min-width="80"
          label="商品属性"
        >
          <template v-slot="scope">
            <div
              v-for="(item, index) in scope.row.material_list"
              :key="index"
              :class="getClass(index, scope.row.material_list.length)"
            > {{ item.goods_prop }} </div>
          </template>
        </el-table-column>
        <el-table-column
          :merge-cells="true"
          min-width="80"
          label="物料名称"
        >
          <template v-slot="scope">
            <div
              v-for="(item, index) in scope.row.material_list"
              :key="index"
              :class="getClass(index, scope.row.material_list.length)"
            > {{ item.goods_name }} </div>
          </template>
        </el-table-column>
        <el-table-column
          :merge-cells="true"
          min-width="100"
          label="物料编码"
        >
          <template v-slot="scope">
            <div
              v-for="(item, index) in scope.row.material_list"
              :key="index"
              :class="getClass(index, scope.row.material_list.length)"
            > {{ item.sku_code }} </div>
          </template>
        </el-table-column>
        <el-table-column
          :merge-cells="true"
          min-width="80"
          label="规格"
        >
          <template v-slot="scope">
            <div
              v-for="(item, index) in scope.row.material_list"
              :key="index"
              :class="getClass(index, scope.row.material_list.length)"
            > {{ item.spec }} </div>
          </template>
        </el-table-column>
        <el-table-column
          :merge-cells="true"
          min-width="80"
          label="配比(%)"
          align="right"
        >
          <template v-slot="scope">
            <div
              v-for="(item, index) in scope.row.material_list"
              :key="index"
              :class="getClass(index, scope.row.material_list.length)"
            > {{ item.router }} </div>
          </template>
        </el-table-column>
      </el-table-column>
      <el-table-column
        sortable="custom"
        :auto-fit="true"
        min-width="80"
        label="状态"
      >
        <template v-slot="scope">
          {{ scope.row.is_enable ? '启用':'未启用' }}
        </template>
      </el-table-column>
      <el-table-column
        sortable="custom"
        :auto-fit="true"
        min-width="120"
        prop="c_name"
        label="创建人"
      />
      <el-table-column
        sortable="custom"
        :auto-fit="true"
        min-width="150"
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
        min-width="120"
        prop="u_name"
        label="更新人"
      />
      <el-table-column
        sortable="custom"
        :auto-fit="true"
        min-width="150"
        :sort-orders="settings.sortOrders"
        prop="u_time"
        label="更新时间"
      >
        <template v-slot="scope">
          {{ scope.row.u_time == null?'':formatDateTime(scope.row.u_time) }}
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
br {
  display: block;
  margin: 1px;
  content: ' ';
}
.el-form-item--mini.el-form-item {
  margin-bottom: 10px;
}
.highlight {
  color: #ffc000;
  font-weight: bold;
}
</style>

<script>
import SelectDict from '@/components/00_dict/select/SelectDict'
import { getPageListApi, enableApi, disabledApi } from '@/api/40_business/worouter/worouter'
import constants_para from '@/common/constants/constants_para'
import resizeMixin from './mixin/listResizeHandlerMixin'
import Pagination from '@/components/Pagination'
import elDragDialog from '@/directive/el-drag-dialog'
import deepCopy from 'deep-copy'
import permission from '@/directive/permission/index.js' // 权限判断指令

export default {
  components: { Pagination, SelectDict },
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
        // 查询使用的json
        searchForm: {
          code: '',
          name: null,
          // 翻页条件
          pageCondition: deepCopy(this.PARAMETERS.PAGE_CONDITION)
          // 审核时间
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
        reset3: false,
        reset4: false,
        // 表格排序规则
        sortOrders: deepCopy(this.PARAMETERS.SORT_PARA),
        // 按钮状态
        btnStatus: {
          showEnable: false,
          showDisable: false,
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
      },
      screenNum: 0,
      watch: {
        unwatch_tempJson: null
      }
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
    init_List () {
      if (this.meDialogStatus) {
        this.dataJson.searchForm.is_enable = this.data.is_enable
        this.dataJson.searchForm.product_sku_code = this.data.product_sku_code
      }
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
      this.watch.unwatch_tempJson1 = this.$watch('dataJson.searchForm', (newVal, oldVal) => {
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
      getPageListApi(this.dataJson.searchForm).then(response => {
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
      if (this.meDialogStatus) {
        this.dataJson.searchForm.is_enable = this.data.is_enable
      }

      // 重置货主、客户、仓库等组件
      this.settings.reset1 = !this.settings.reset1
      this.settings.reset2 = !this.settings.reset2
      this.settings.reset3 = !this.settings.reset3
      this.settings.reset4 = !this.settings.reset4
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
        operate_tab_info: { show: true, name: '新增入库单' },
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
        this.settings.btnStatus.showUpdate = true
        if (row.is_enable) {
          this.settings.btnStatus.showDisable = true
          this.settings.btnStatus.showEnable = false
        }
        if (!row.is_enable) {
          this.settings.btnStatus.showEnable = true
          this.settings.btnStatus.showDisable = false
        }
      } else {
        this.settings.btnStatus.showUpdate = false
        this.settings.btnStatus.showDisable = false
        this.settings.btnStatus.showEnable = false
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
    handleEnable () {
      // 没有选择任何数据的情况
      if (this.dataJson.currentJson.id === undefined) {
        this.showErrorMsg('请选择一条数据')
        return
      }
      // 选中数据启用
      this.handleEnabledSelectionData(this.dataJson.currentJson.id)
    },
    // 选中数据启用
    handleEnabledSelectionData (id) {
      // loading
      this.settings.loading = true
      const selectionJson = []
      selectionJson.push({ 'id': id })

      // 开始启用
      enableApi(selectionJson).then((_data) => {
        this.$notify({
          title: '启用成功',
          message: _data.message,
          type: 'success',
          duration: this.settings.duration
        })
        this.getDataList()
      }, (_error) => {
        this.$notify({
          title: '启用错误',
          message: _error.message,
          type: 'error',
          duration: this.settings.duration
        })
      }).finally(() => {
        this.settings.loading = false
      })
    },
    // 停用按钮
    handleDisabled () {
      // 没有选择任何数据的情况
      if (this.dataJson.currentJson.id === undefined) {
        this.showErrorMsg('请选择一条数据')
        return
      }
      // 选中数据停用
      this.handleDisAbledSelectionData(this.dataJson.currentJson.id)
    },
    // 停用数据删除
    handleDisAbledSelectionData (id) {
      // loading
      this.settings.loading = true
      const selectionJson = []
      selectionJson.push({ 'id': id })
      // 开始停用
      disabledApi(selectionJson).then((_data) => {
        this.$notify({
          title: '停用成功',
          message: _data.message,
          type: 'success',
          duration: this.settings.duration
        })
        this.getDataList()
        // loading
      }, (_error) => {
        this.$notify({
          title: '停用错误',
          message: _error.message,
          type: 'error',
          duration: this.settings.duration
        })
      }).finally(() => {
        this.settings.loading = false
      })
    },
    getCellClass (row) {
      // row.columnIndex
      return 'td' + row.columnIndex// 给第2个td里面添加goodsInfo的类名
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
