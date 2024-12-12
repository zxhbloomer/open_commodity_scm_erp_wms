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
        </template>
        <warehouse-template
          ref="relationRightRef"
          :height="height - 90"
        />
      </el-tab-pane>
      <el-tab-pane
        name="org"
        :style="{height: height + 'px'}"
        style="overflow-y:auto;overflow-x:hidden;"
      >
        <template slot="label">选择仓库组所包含的仓库
          <el-badge
            :value="dataJson.warehouse_count"
            type="danger"
          />
        </template>
        <relation-warehouse-template :height="height - 90" />
      </el-tab-pane>
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
import relationWarehouseTemplate from '@/views/20_master/relation/right/sub_template/relationWarehouse'
import warehouseTemplate from '@/views/20_master/relation/right/sub_template/warehouse'
import deepCopy from 'deep-copy'
import { getAllWarehouseListByPositionCountApi } from '@/api/20_master/relation/relation'
import { isNotEmpty } from '@/utils'

export default {
  components: { warehouseTemplate, relationWarehouseTemplate },
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
        warehouse_count: 0,
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
        if (this.popSettingsData.btnResetStatus === true) {
          // 点击了重置按钮
          this.popSettingsData.btnDisabledStatus.disabledReset = true
          this.popSettingsData.btnDisabledStatus.disabledInsert = true
          this.popSettingsData.btnDisabledStatus.disabledUpdate = true
          this.popSettingsData.btnDisabledStatus.disabledCopyInsert = true
          this.popSettingsData.btnResetStatus = false
        } else if (this.popSettingsData.dialogFormVisible) {
          // 弹出窗口
          // 有修改按钮高亮
          this.popSettingsData.btnDisabledStatus.disabledReset = false
          this.popSettingsData.btnDisabledStatus.disabledInsert = false
          this.popSettingsData.btnDisabledStatus.disabledUpdate = false
          this.popSettingsData.btnDisabledStatus.disabledCopyInsert = false
        }
      },
      immediate: true,
      deep: true
    },
    // 弹出窗口初始化，按钮不可用
    'popSettingsData.dialogFormVisible': {
      handler (newVal, oldVal) {
        if (this.popSettingsData.dialogFormVisible) {
          this.initPopUpStatus()
        }
      }
    },
    // 选中的数据，使得导出按钮可用，否则就不可使用
    'dataJson.multipleSelection': {
      handler (newVal, oldVal) {
        if (newVal.length > 0) {
          this.settings.btnShowStatus.showExport = true
        } else {
          this.settings.btnShowStatus.showExport = false
        }
      }
    }
  },
  mounted () {
    // 当左侧树checkbox有变化时
    this.$on(this.EMITS.EMIT_RELATION_LEFT_CHECKED, _data => {
      this.dataJson.treeData = deepCopy(_data)
      this.getDataList()
    })
  },
  created () {
    this.popSettingsData.searchDialogDataOne.dialogVisible = true
    // 数据初始化
    this.dataJson.tempJson = Object.assign({}, this.dataJson.tempJsonOriginal)
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
    getDataList () {
      // 通知兄弟组件
      this.$off(this.EMITS.EMIT_RELATION_LOADING)
      this.$emit(this.EMITS.EMIT_RELATION_LOADING)
      // 查询逻辑
      this.settings.loading = true
      let relation_codes = []
      const _data = deepCopy(this.dataJson.treeData)
      if (!isNotEmpty(_data)) {
        relation_codes.push({ code: '' })
      } else {
        this.getAllCheckCode(_data[0])
        relation_codes = deepCopy(this.dataJson.datas)
      }
      if (relation_codes.length === 0) {
        relation_codes.push({ code: '' })
      }
      getAllWarehouseListByPositionCountApi({ relation_codes: relation_codes }).then(response => {
        this.dataJson.warehouse_count = response.data
        // 通知兄弟组件
        this.$off(this.EMITS.EMIT_RELATION_LOADING_OK)
        this.$emit(this.EMITS.EMIT_RELATION_LOADING_OK)
      }).finally(() => {
        this.settings.loading = false
      })
    },
    // 重置按钮
    doReset () {
      this.popSettingsData.btnResetStatus = true
      switch (this.popSettingsData.dialogStatus) {
        case this.PARAMETERS.STATUS_UPDATE:
          // 数据初始化
          this.initPopUpStatus()
          // 复制数据
          this.dataJson.tempJson = Object.assign({}, this.dataJson.tempJsonOriginal)
          // 初始化数据
          // 设置控件焦点focus
          this.$nextTick(() => {
            this.$refs['refUpdateFocus'].focus()
          })
          break
        case 'copyInsert':
          // 数据初始化
          this.initPopUpStatus()
          // 复制数据
          this.dataJson.tempJson = Object.assign({}, this.dataJson.tempJsonOriginal)
          this.dataJson.tempJson.template_id = undefined
          this.dataJson.tempJson.templateType = ''
          this.dataJson.tempJson.templateName = ''
          this.dataJson.tempJson.templateDescr = ''
          this.dataJson.tempJson.templateContext = ''
          // 初始化数据
          // 设置控件焦点focus
          this.$nextTick(() => {
            this.$refs['refInsertFocus'].$el.focus()
          })
          break
        case 'insert':
          // 数据初始化
          this.initPopUpStatus()
          // 复制数据
          this.dataJson.tempJson = {}
          // 初始化数据
          // 设置控件焦点focus
          this.$nextTick(() => {
            this.$refs['refInsertFocus'].$el.focus()
          })
          break
      }

      // 去除validate信息
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    // 关闭弹出窗口
    handlCloseDialog () {
      this.popSettingsData.dialogFormVisible = false
    },
    // 获取row-key
    // getRowKeys(row) {
    //   return row.id
    // },
    // table选择框
    handleSelectionChange (val) {
      this.dataJson.multipleSelection = val
    },
    // 弹出框设置初始化
    initPopUpStatus () {
      this.popSettingsData.btnDisabledStatus.disabledReset = true
      this.popSettingsData.btnDisabledStatus.disabledInsert = true
      this.popSettingsData.btnDisabledStatus.disabledUpdate = true
      this.popSettingsData.btnDisabledStatus.disabledCopyInsert = true
    },
    handleCascaderChange (value) {
      const parent_id = value[value.length - 1]
      this.dataJson.tempJson.parent_id = parent_id
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
              删除状态提示：<br />
              绿色：未启用  <br />
              红色：已启用
            </div>
            <svg-icon icon-class='perfect-icon-question1_btn' style='margin-left: 5px' />
          </el-tooltip>
        </span>
      )
    },
    renderHeaderIsFreeze: function (h, { column }) {
      return (
        <span>{column.label}
          <el-tooltip
            class='item'
            effect='dark'
            placement='bottom'
          >
            <div slot='content'>
              删除状态提示：<br />
              绿色：未启用  <br />
              红色：已启用
            </div>
            <svg-icon icon-class='perfect-icon-question1_btn' style='margin-left: 5px' />
          </el-tooltip>
        </span>
      )
    },
    handleTabsClick (tab, event) {
      // console.log(tab, event)
    },
    getAllCheckCode (_data) {
      this.dataJson.datas = []
      if (_data.is_enable) {
        this.dataJson.datas.push({ code: _data.code })
      }
      if (_data.children) {
        this.getChecktwo(_data.children)
      }
    },
    getChecktwo (children) {
      for (const _child of children) {
        if (_child.is_enable) {
          this.dataJson.datas.push({ code: _child.code })
        }
        if (_child.children) {
          this.getCheckthree(_child.children)
        }
      }
    },
    getCheckthree (children) {
      for (const _child of children) {
        if (_child.is_enable) {
          this.dataJson.datas.push({ code: _child.code })
        }
        if (_child.children) {
          this.getCheckfour(_child.children)
        }
      }
    },
    getCheckfour (children) {
      for (const _child of children) {
        if (_child.is_enable) {
          this.dataJson.datas.push({ code: _child.code })
        }
      }
    }
  }
}
</script>
