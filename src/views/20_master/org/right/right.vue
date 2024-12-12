<template>
  <div>
    <el-tabs
      v-model="settings.tabs.activeName"
      @tab-click="handleTabsClick"
    >
      <el-tab-pane
        name="org"
        :style="{height: height + 'px'}"
        style="overflow-y:auto;overflow-x:hidden;"
      >
        <template slot="label">组织机构
          <el-badge
            v-show="dataJson.listData.orgs_count>0"
            :value="dataJson.listData.orgs_count"
            type="danger"
          />
        </template>
        <org-template :height="height" />
      </el-tab-pane>
      <el-tab-pane
        name="group"
        :style="{height: height + 'px'}"
        style="overflow-y:auto;overflow-x:hidden;"
      >
        <template slot="label">集团信息
          <el-badge
            v-show="dataJson.listData.group_count>0"
            :value="dataJson.listData.group_count"
            type="danger"
          />
        </template>
        <group-template :height="height - 42" />
      </el-tab-pane>
      <el-tab-pane>
        <template slot="label">企业信息
          <el-badge
            v-show="dataJson.listData.company_count>0"
            :value="dataJson.listData.company_count"
            type="danger"
          />
        </template>
        <company-template :height="height - 42" />
      </el-tab-pane>
      <el-tab-pane>
        <template slot="label">部门信息
          <el-badge
            v-show="dataJson.listData.dept_count>0"
            :value="dataJson.listData.dept_count"
            type="danger"
          />
        </template>
        <dept-template :height="height - 42" />
      </el-tab-pane>
      <el-tab-pane>
        <template slot="label">岗位信息
          <el-badge
            v-show="dataJson.listData.position_count>0"
            :value="dataJson.listData.position_count"
            type="danger"
          />
        </template>
        <position-template :height="height - 42" />
      </el-tab-pane>
      <el-tab-pane>
        <template slot="label">员工信息
          <el-badge
            v-show="dataJson.listData.staff_count>0"
            :value="dataJson.listData.staff_count"
            type="danger"
          />
        </template>
        <staff-template :height="height - 57" />
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
import { getAllOrgDataCountApi } from '@/api/20_master/org/org'
import elDragDialog from '@/directive/el-drag-dialog'
import orgTemplate from '@/views/20_master/org/right/sub_template/org'
import groupTemplate from '@/views/20_master/org/right/sub_template/group'
import companyTemplate from '@/views/20_master/org/right/sub_template/company'
import deptTemplate from '@/views/20_master/org/right/sub_template/dept'
import positionTemplate from '@/views/20_master/org/right/sub_template/position'
import staffTemplate from '@/views/20_master/org/right/sub_template/staff'
import deepCopy from 'deep-copy'
import { EventBus } from '@/common/eventbus/eventbus'

export default {
  // name: 'P00000172', // 页面id，和router中的name需要一致，作为缓存
  components: { orgTemplate, groupTemplate, companyTemplate, deptTemplate, positionTemplate, staffTemplate },
  directives: { elDragDialog },
  props: {
    height: {
      type: Number,
      default: 200
    }
  },
  data () {
    return {
      dataJson: {
        // 查询使用的json
        searchForm: {
          // 查询条件
          name: '',
          datetimerange: ''
        },
        // 左侧树的数据
        leftTreeData: null,
        // 级联选择器数据
        cascader: {
          data: null,
          value: ''
        },
        // table使用的json，数据源
        listData: {
          orgs_count: 0,
          group_count: 0,
          company_count: 0,
          dept_count: 0,
          position_count: 0,
          staff_count: 0
        },
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
          activeName: 'org'
        },
        // 错误数目
        badge: {
          countOne: 0,
          countTwo: 0,
          countThree: 0,
          countFour: 0,
          countFive: 0,
          countSix: 0
        },
        // 表格排序规则
        sortOrders: deepCopy(this.PARAMETERS.SORT_PARA),
        // 按钮状态是否启用
        btnShowStatus: {
          showUpdate: false,
          showCopyInsert: false,
          showExport: false,
          showAdmin: false
        },
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
        // 按钮状态：是否显示
        btnShowStatus: {
          showReset: false,
          showInsert: false,
          showUpdate: false,
          showCopyInsert: false
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
          code: [{ required: true, message: '请选择租户编码', trigger: 'change' }],
          name: [{ required: true, message: '请输入租户名称', trigger: 'change' }],
          simple_name: [{ required: true, message: '请输入租户简称', trigger: 'change' }],
          enable_time_range: [{ required: true, message: '请输入生效失效日期范围', trigger: 'change' }]
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
    // // 日期范围
    // 'dataJson.tempJson.enable_time_range': {
    //   handler(newVal, oldVal) {
    //     if (newVal === undefined || newVal === null || newVal === []) {
    //       this.dataJson.tempJson.enable_time = ''
    //       this.dataJson.tempJson.disable_time = ''
    //       this.dataJson.tempJson.show_enable_time_range = ''
    //       return
    //     }
    //     const start = parseTime(newVal[0])
    //     const end = parseTime(newVal[1])
    //     this.dataJson.tempJson.enable_time = start
    //     this.dataJson.tempJson.disable_time = end
    //     this.dataJson.tempJson.show_enable_time_range = start + ' 至 ' + end + '时间段内开始启用'
    //   },
    //   deep: true,
    //   immediate: true
    // },
    'dataJson.tempJson.enable_time': {
      handler (newVal, oldVal) {
        if (newVal === undefined || newVal === null || newVal === []) {
          // this.dataJson.tempJson.enable_time = ''
          // this.dataJson.tempJson.disable_time = ''
          // this.dataJson.tempJson.enable_time_range = []
          return
        } else {
          const start = new Date(this.dataJson.tempJson.enable_time)
          const end = new Date(this.dataJson.tempJson.disable_time)
          this.dataJson.tempJson.enable_time_range = [start, end]
        }
      },
      immediate: true,
      deep: true
    },
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
    this.handleSearch()
    // 描绘完成
    EventBus.$on(this.EMITS.EMIT_ORG_CHANGE, _data => {
      this.dataJson.leftTreeData = _data
      this.getDataList(_data)
    })
    // 当岗位成员有发生变更，接收通知
    EventBus.$on(this.EMITS.EMIT_ORG_POSITION_UPDATED, _data => {
      this.getDataList(this.dataJson.leftTreeData)
    })
  },
  created () {
    this.popSettingsData.searchDialogDataOne.dialogVisible = true
    // 数据初始化
    this.dataJson.tempJson = Object.assign({}, this.dataJson.tempJsonOriginal)
  },
  methods: {
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
      // this.$refs.multipleTable.clearSelection()
    },
    getDataList (val) {
      // 通知兄弟组件
      // this.$off(this.EMITS.EMIT_ORG_LOADING)
      EventBus.$emit(this.EMITS.EMIT_ORG_LOADING)
      // 查询逻辑
      this.settings.loading = true
      this.dataJson.searchForm = Object.assign({}, val)
      getAllOrgDataCountApi(this.dataJson.searchForm).then(response => {
        const recorders = response.data
        this.dataJson.listData = recorders
        // 通知兄弟组件
        // this.$off(this.EMITS.EMIT_ORG_LOADING_OK)
        EventBus.$emit(this.EMITS.EMIT_ORG_LOADING_OK)
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
    dataPickChange (data) {
      this.dataJson.tempJson.enable_time_range = data
      if (data === null) {
        this.dataJson.tempJson.enable_time = null
        this.dataJson.tempJson.disable_time = null
      } else {
        this.dataJson.tempJson.enable_time = new Date(data[0])
        this.dataJson.tempJson.disable_time = new Date(data[1])
      }
    },
    // 管理员维护点击事件
    handleAdmin () {
      alert('TODO:xxx')
    },
    handleTabsClick (tab, event) {
      // console.log(tab, event)
    }
  }
}
</script>
