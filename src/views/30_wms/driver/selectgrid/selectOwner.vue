<template>
  <div class="el-select">
    <el-input
      ref="refSelectGrid"
      v-model.trim="dataJson.filterText"
      v-popover:popover
      :placeholder="placeholder"
      style="cursor:pointer"
      @input="handlerInput"
      @dblclick.native="handleDbClick"
    >
      <template slot="suffix">
        <i
          :class="['el-select__caret', 'el-input__icon', 'el-icon-' + iconClass]"
          @click="handlerArrow()"
        />
      </template>
    </el-input>
    <el-popover
      ref="popover"
      v-model="settings.visible"
      :title="title"
      width="660"
      trigger="manual"
      popper-class="normal_popper"
      :placement="placement"
    >
      <el-container>
        <!-- <el-header>请选择{{ showTitle }}</el-header> -->
        <el-main class="el-main-class">
          <div style="overflow-y:auto;overflow-x:auto;">
            <el-table
              ref="multipleTable"
              v-loading="settings.loading"
              :data="dataJson.dataList"
              :element-loading-text="'正在拼命加载中...'"
              element-loading-background="rgba(255, 255, 255, 0.5)"
              height="350px"
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
                type="index"
                width="45"
                label="No"
              />
              <el-table-column
                sortable="custom"
                :sort-orders="settings.sortOrders"
                show-overflow-tooltip
                min-width="130"
                prop="code"
                label="货主编码"
              />
              <el-table-column
                sortable="custom"
                :sort-orders="settings.sortOrders"
                show-overflow-tooltip
                min-width="130"
                prop="name"
                label="货主名称"
              />
              <el-table-column
                sortable="custom"
                :sort-orders="settings.sortOrders"
                show-overflow-tooltip
                min-width="120"
                prop="short_name"
                label="货主简称"
              />
            </el-table>
            <pagination
              ref="minusPaging"
              :total="dataJson.paging.total"
              :page.sync="dataJson.paging.current"
              :limit.sync="dataJson.paging.size"
              @pagination="getDataList"
            />
          </div>
        </el-main>
        <el-footer style="text-align:right">
          <el-divider />
          <!-- <div class="floatLeft">
            <el-button
              type="danger"
              @click="doReset()"
            >刷新</el-button>
          </div> -->
          <el-button
            plain
            :disabled="settings.loading"
            @click="settings.visible = false"
          >取消</el-button>
          <el-button
            plain
            :disabled="settings.loading || settings.btnDisabledStatus.disabledOk "
            type="primary"
            @click="handleOk()"
          >确定</el-button>
        </el-footer>
      </el-container>
    </el-popover>
  </div>
</template>

<style scoped>
.el-header {
  padding: 10px 10px 10px 10px;
  background: #115aa5;
  color: #fff;
  height: 100% !important;
}

.filterInput {
  margin-bottom: 10px;
}

.el-main-class {
  padding: 10px;
}
</style>

<script>
import deepCopy from 'deep-copy'
import { getListApi } from '@/api/30_wms/owner/owner'
import Pagination from '@/components/Pagination'

export default {
  name: 'SelectGrid', // 页面id，和router中的name需要一致，作为缓存
  components: { Pagination },
  mixins: [],
  props: {
    disabled: {
      type: Boolean,
      default: false
    },
    placeholder: {
      type: String,
      default: ''
    },
    title: {
      type: String,
      default: ''
    },
    type: {
      type: String,
      default: ''
    },
    // 重置
    reset: {
      type: Boolean,
      default: false
    },
    placement: {
      type: String,
      default: 'bottom'
    },
    value: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      dataJson: {
        // 查询使用的json
        searchForm: {
          pageCondition: deepCopy(this.PARAMETERS.PAGE_CONDITION),
          type: this.type,
          serial_id: null,
          serial_type: null
        },
        // 分页控件的json
        paging: deepCopy(this.PARAMETERS.PAGE_JSON),
        // 下拉树的对象
        element: null,
        node: null,
        // 下拉选项json
        selectOptions: [],
        filterText: '',
        dataList: [],
        // 单条数据 json
        currentJson: null,
        tempJson: {
        },
        tempJsonOriginal: null
      },
      settings: {
        isUpIcon: true,
        visible: false,
        para: this.CONSTANTS.DICT_ORG_SETTING_TYPE,
        filterPara: [],
        loading: true,
        // 按钮状态：是否可用
        btnDisabledStatus: {
          disabledOk: true
        },
        defaultProps: {
          children: 'children',
          label: 'label'
        }
      }
    }
  },
  computed: {
    showClose () {
      const hasValue = false
      return hasValue
    },
    iconClass () {
      return (this.settings.visible ? 'arrow-up is-reverse' : 'arrow-up')
    },
    showTitle () {
      switch (this.type) {
        case this.CONSTANTS.DICT_CONSIGNOR:
          return '委托方'
        case this.CONSTANTS.DICT_OWNER:
          return '货主'
        case this.CONSTANTS.DICT_SUPPLIER:
          return '供应商'
        default:
          return ''
      }
    }
  },
  // 监听器
  watch: {
    // 'settings.visible': {
    //   handler (newVal, oldVal) {
    //     if (newVal) {
    //       // 显示popover
    //       this.settings.isUpIcon = true
    //       this.initCreated()
    //     } else {
    //       // 隐藏popover
    //       this.settings.isUpIcon = false
    //     }
    //   },
    //   immediate: true
    // },
    // 'settings.loading': {
    //   handler (newVal, oldVal) {
    //     switch (newVal) {
    //       case true:
    //         this.showLoading('正在查询，请稍后...')
    //         break
    //       case false:
    //         this.closeLoading()
    //         break
    //     }
    //   }
    // },
    'dataJson.filterText': {
      handler () {
        this.dataJson.searchForm.name = this.dataJson.filterText
        if (this.dataJson.filterText === '') {
          this.$emit('onReturnData', { id: null })
        }
        this.getDataList()
        this.$emit('onReturnDataName', this.dataJson.filterText)
      }
    },
    'reset': {
      handler () {
        this.dataJson.filterText = ''
      }
    }
  },

  created () {
    // 页面初始化
    this.initCreated()
    // 点击其他不在的区域触发事件
    document.addEventListener('click', (e) => {
      if (this.settings.visible !== false) {
        if (!this.$el.contains(e.target)) {
          this.settings.visible = false
        }
      }
    })
  },
  mounted () {
    // 描绘完成
    const originalClass = this.$refs['refSelectGrid'].$el.children[0].className
    const newClass = originalClass + ' , pointer_cursor '
    this.$refs['refSelectGrid'].$el.children[0].className = newClass
  },
  methods: {
    // 页面初始化
    initCreated () {
      // Object.assign(this.$data.dataJson, this.$options.data.call(this).dataJson)
      this.$data.dataJson = deepCopy(this.$options.data.call(this).dataJson)
      this.settings.btnDisabledStatus.disabledOk = true
      // 展开时，调用查询
      this.getDataList()
      // 控件focus
      // this.$nextTick(() => {
      //   this.$refs['refFocus'].focus()
      // })
    },
    // 单击事件
    handleClick () {
      if (this.disabled) {
        return
      }
      // this.settings.visible = !this.settings.visible
    },
    doDestroy () {
      this.$refs.popper && this.$refs.popper.doDestroy()
    },
    handleClearClick (event) {
    },
    handleButtonSearch () {
      // 查询
      this.getDataList()
    },
    getDataList () {
      if (!this.settings.visible) {
        // return
      }
      this.dataJson.searchForm.pageCondition.current = this.dataJson.paging.current
      this.dataJson.searchForm.pageCondition.size = this.dataJson.paging.size
      // 查询逻辑
      this.settings.loading = true

      getListApi(this.dataJson.searchForm).then(response => {
        this.dataJson.dataList = response.data.records
        this.dataJson.paging = response.data
        this.settings.loading = false
      })
    },
    // 点击确定按钮
    handleOk () {
      // 关闭父窗体（弹出框）
      this.dataJson.filterText = this.dataJson.currentJson.name
      this.$emit('onReturnData', this.dataJson.currentJson)
      this.settings.visible = false
    },
    // table选择框
    handleSelectionChange (val) {
      this.dataJson.multipleSelection = val
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
    handleCurrentChange (row) {
      this.dataJson.currentJson = Object.assign({}, row) // copy obj
      this.dataJson.currentJson.index = this.getRowIndex(row)
    },
    // 行双点击，仅在dialog中有效
    handleRowDbClick (row) {
      this.dataJson.rowIndex = this.getRowIndex(row)
      var _data = deepCopy(row)
      this.dataJson.currentJson = _data
      this.handleOk()
    },
    // 行点击
    handleRowClick (row) {
      this.dataJson.rowIndex = this.getRowIndex(row)
      this.settings.btnDisabledStatus.disabledOk = false
    },
    // 获取行索引
    getRowIndex (row) {
      const _index = this.dataJson.dataList.lastIndexOf(row)
      return _index
    },
    // change事件
    handlerInput (v) {
      this.settings.visible = true
    },
    // 双击事件
    handleDbClick () {
      this.settings.visible = true
    },
    // 点击箭头
    handlerArrow () {
      this.settings.visible = !this.settings.visible
    }
  }
}
</script>
