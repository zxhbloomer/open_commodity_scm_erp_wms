<template>
  <div>
    <el-tabs
      v-model="settings.tabs.activeName"
      @tab-click="handleTabsClick"
    >
      <el-tab-pane
        name="warehouse"
        :style="{height: height + 'px'}"
        style="overflow-y:auto;overflow-x:hidden;"
      >
        <template slot="label">当前节点向下的仓库
          <el-badge
            :value="dataJson.warehouse_count1"
            type="danger"
          />
        </template>
        <warehouse-template
          ref="relationRightRef"
          :height="height - 90"
        />
      </el-tab-pane>
      <!-- <el-tab-pane
        name="org"
        :style="{height: height + 'px'}"
        style="overflow-y:auto;overflow-x:hidden;"
      >
        <template slot="label">选择仓库组所包含的仓库
          <el-badge
            :value="dataJson.warehouse_count2"
            type="danger"
          />
        </template>
        <relation-warehouse-template :height="height - 90" />
      </el-tab-pane> -->
    </el-tabs>

  </div>
</template>

<style scoped>
.floatRight {
  float: right;
}
.floatLeft {
  float: left;
}
.el-form-item .el-cascader {
  width: 100%;
}
.grid-content {
  border-radius: 2px;
  min-height: 36px;
  margin-bottom: 10px;
}
.bg-purple-light {
  background: #e5e9f2;
}
.el-alert--info.is-light {
  background: #eee;
}
.corner {
  position: absolute;
  top: 0px;
  border: 0;
  right: 0;
}
</style>
<style >
.buttonSearch {
  color: #ffffff;
  background-color: #1890ff;
  border-color: #1890ff;
}
.buttonReset {
  color: #ffffff;
  background-color: #f56c6c;
  border-color: #f56c6c;
}
</style>
<script>
import elDragDialog from '@/directive/el-drag-dialog'
// import relationWarehouseTemplate from '@/views/20_master/relation/right/sub_template/relationWarehouse'
import warehouseTemplate from '@/views/20_master/relation/right/sub_template/warehouse'
import deepCopy from 'deep-copy'
import { getAllWarehouseListByPositionCountApi } from '@/api/20_master/relation/relation'
import { EventBus } from '@/common/eventbus/eventbus'

export default {
  components: { warehouseTemplate },
  directives: { elDragDialog },
  props: {
    height: {
      type: Number,
      default: undefined
    }
  },
  data () {
    return {
      dataJson: {
        // 左侧树元数据
        treeData: null,
        // 查询使用的json
        searchForm: {
          // 查询条件
          name: '',
          datetimerange: ''
        },
        // 级联选择器数据
        cascader: {
          data: null,
          value: ''
        },
        // table使用的json，数据源
        warehouse_count1: 0,
        warehouse_count2: 0,
        // 单条数据 json的，初始化原始数据
        tempJsonOriginal: {
          id: undefined,
          parent_name: '',
          parent_id: '',
          name: '',
          code: '',
          descr: '',
          dbversion: 0,
          template_id: undefined
        },
        // 单条数据 json
        currentJson: null,
        tempJson: null,
        tempJsons: [],
        inputSettings: {
          maxLength: {
            name: 20,
            code: 20,
            descr: 200,
            dbversion: 0
          }
        },
        // 当前表格中的索引，第几条
        rowIndex: 0,
        // 当前选中的行（checkbox）
        multipleSelection: []
      },
      // 页面设置json
      settings: {
        tabs: {
          activeName: 'warehouse'
        },
        // 错误数目
        badge: {
          countOne: 0,
          countTwo: 0
        },
        // 表格排序规则
        sortOrders: deepCopy(this.PARAMETERS.SORT_PARA),
        // loading 状态
        loading: true,
        duration: 4000
      },
      popSettingsData: {
        // 弹出窗口状态名称
        textMap: {
          update: '修改',
          insert: '新增',
          copyInsert: '复制新增'
        },
        // 弹出的查询框参数设置
        searchDialogDataOne: {
          // 弹出框显示参数
          dialogVisible: false,
          // 点击确定以后返回的值
          selectedDataJson: {}
        },
        // 按钮状态：是否可用
        btnDisabledStatus: {
          disabledReset: false,
          disabledInsert: false,
          disabledUpdate: false,
          disabledCopyInsert: false
        },
        // 重置按钮点击后
        btnResetStatus: false,
        // 以下为pop的内容：数据弹出框
        selection: [],
        dialogStatus: '',
        dialogFormVisible: false,
        // pop的check内容
        rules: {
        },
        // 弹出的查询框参数设置
        searchDialogData: {
          // 弹出框显示参数
          dialogVisible: false,
          // 当前设置状态:false->选择（select）;true->重置(reset)----选择后置为true，修改时有数据置为true
          selectOrReset: false,
          selectOrResetName: '选择',
          selectOrResetIcon: 'el-icon-search',
          // 点击确定以后返回的值
          selectedDataJson: {}
        }
      }
    }
  },
  // 监听器
  watch: {
    // 监听页面上面是否有修改，有修改按钮高亮
    'dataJson.tempJson': {
      handler (newVal, oldVal) {

      },
      immediate: true,
      deep: true
    }

  },
  mounted () {

  },
  created () {
    this.popSettingsData.searchDialogDataOne.dialogVisible = true
    // 数据初始化
    this.dataJson.tempJson = Object.assign({}, this.dataJson.tempJsonOriginal)

    // 当左侧选中数据有变化时
    EventBus.$on(this.EMITS.EMIT_RELATION_CHANGE, _data => {
      this.dataJson.tempJson = deepCopy(_data)
      this.getCountData1()
    })
    // 当左侧checkbox有变化时
    EventBus.$on(this.EMITS.EMIT_RELATION_LEFT_CHECKED, _data => {
      this.dataJson.tempJsons = deepCopy(_data)
      this.getCountData2()
    })
  },
  methods: {
    // 弹出框设置初始化
    initDialogStatus (val) {
    },
    // 获取行索引
    getRowIndex (row) {
      const _index = this.dataJson.listData.lastIndexOf(row)
      return _index
    },
    // 行点击
    handleRowClick (row) {
      this.dataJson.tempJson = Object.assign({}, row) // copy obj
      this.dataJson.rowIndex = this.getRowIndex(row)
    },
    handleSearch () {
      // 查询
      this.getDataList()
      // 清空选择
      this.dataJson.multipleSelection = []
      this.$refs.multipleTable.clearSelection()
    },
    getCountData1 () {
      // 查询逻辑
      this.settings.loading = true
      const codes = []

      if (this.dataJson.tempJson.code !== null) {
        codes.push(this.dataJson.tempJson.code)
      }
      getAllWarehouseListByPositionCountApi({ codes: codes }).then(response => {
        this.dataJson.warehouse_count1 = response.data
      }).finally(() => {
        this.settings.loading = false
      })
    },
    getCountData2 () {
      // 查询逻辑
      this.settings.loading = true
      const codes = []
      this.dataJson.tempJsons.forEach(function (value, index, array) {
        codes.push(value.code)
      })

      getAllWarehouseListByPositionCountApi({ codes: codes }).then(response => {
        this.dataJson.warehouse_count2 = response.data
      }).finally(() => {
        this.settings.loading = false
      })
    },
    handleTabsClick (tab, event) {
      // console.log(tab, event)
    }

  }
}
</script>
