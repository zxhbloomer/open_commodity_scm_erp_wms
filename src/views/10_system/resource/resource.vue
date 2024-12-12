<template>
  <div class="app-container">
    <el-form
      ref="minusForm"
      :inline="true"
      :model="dataJson.searchForm"
      label-position="getLabelPosition()"
      class="search-form-floatRight"
    >
      <el-form-item label="">
        <el-select
          v-model="dataJson.searchForm.code"
          placeholder="请选择资源类型"
          multiple
          collapse-tags
          clearable
        >
          <el-option
            v-for="item in settings.codeOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>

      <el-form-item label="">
        <el-input
          v-model.trim="dataJson.searchForm.name"
          clearable
          placeholder="资源名称"
        />
      </el-form-item>
      <el-form-item label="">
        <el-select
          v-model="dataJson.searchForm.is_del"
          placeholder="请选择删除状态"
          clearable
        >
          <el-option
            v-for="item in settings.delOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          plain
          icon="el-icon-search"
          @click="handleSearch"
        >查询</el-button>
      </el-form-item>
      <el-form-item>
        <el-button
          v-popover:popover
          type="primary"
          plain
          icon="perfect-icon-reset"
          @click="doResetSearch"
        >重置</el-button>
      </el-form-item>
    </el-form>
    <el-button-group v-show="!resourceDialogSetting.dialogStatus">
      <el-button
        type="primary"
        icon="el-icon-circle-plus-outline"
        :loading="settings.loading"
        @click="handleInsert"
      >新增</el-button>
      <el-button
        :disabled="!settings.btnShowStatus.showUpdate"
        type="primary"
        icon="el-icon-edit-outline"
        :loading="settings.loading"
        @click="handleUpdate"
      >修改</el-button>
      <el-button
        :disabled="!settings.btnShowStatus.showExport"
        type="primary"
        icon="el-icon-s-management"
        :loading="settings.loading"
        @click="handleExport"
      >导出</el-button>
    </el-button-group>
    <el-table
      ref="multipleTable"
      v-loading="settings.loading"
      :data="dataJson.listData"
      :element-loading-text="'正在拼命加载中...'"
      element-loading-background="rgba(255, 255, 255, 0.5)"
      :height="settings.tableHeight"
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
        v-if="!resourceDialogSetting.dialogStatus"
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
        show-overflow-tooltip
        sortable="custom"
        min-width="80"
        :sort-orders="settings.sortOrders"
        prop="type"
        label="资源类型"
      />
      <el-table-column
        show-overflow-tooltip
        sortable="custom"
        min-width="150"
        :sort-orders="settings.sortOrders"
        prop="name"
        label="名称"
      />
      <el-table-column
        show-overflow-tooltip
        min-width="150"
        prop="descr"
        label="说明"
      />
      <el-table-column
        min-width="45"
        :sort-orders="settings.sortOrders"
        label="删除"
        :render-header="renderHeaderIsDel"
      >
        <template v-slot="scope">
          <el-tooltip
            :content="scope.row.is_del === 'false' ? '删除状态：已删除' : '删除状态：未删除' "
            placement="top"
            :open-delay="500"
          >
            <el-switch
              v-model="scope.row.is_del"
              active-color="#ff4949"
              inactive-color="#13ce66"
              :active-value="true"
              :inactive-value="false"
              :width="30"
              :disabled="resourceDialogSetting.dialogStatus"
              @change="handleDel(scope.row)"
            />
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column
        sortable="custom"
        min-width="180"
        :sort-orders="settings.sortOrders"
        show-overflow-tooltip
        prop="u_time"
        label="更新时间"
      >
        <template v-slot="scope">
          {{ formatDateTime(scope.row.u_time) }}
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
    <!-- pop窗口 数据编辑:新增、修改、步骤窗体-->
    <el-dialog
      v-el-drag-dialog
      :title="popSettingsData.textMap[popSettingsData.dialogStatus]"
      :visible="popSettingsData.dialogFormVisible"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :show-close="false"
      :append-to-body="true"
      :modal-append-to-body="false"
      width="800px"
    >
      <el-form
        ref="dataSubmitForm"
        :rules="popSettingsData.rules"
        :model="dataJson.tempJson"
        label-position="rigth"
        label-width="120px"
        status-icon
      >
        <el-steps
          :active="stepsSetting.active"
          finish-status="success"
          align-center
        >
          <el-step title="选择资源类型" />
          <el-step title="输入资源数据" />
        </el-steps>
        <br>
        <br>
        <div v-show="stepsSetting.active === 0">
          <el-form-item
            label="资源类型："
            prop="type"
          >
            <el-select
              ref="refType"
              v-model="dataJson.tempJson.type"
              placeholder="请选择资源类型"
              clearable
              @change="handleSelectChange"
            >
              <el-option
                v-for="item in settings.codeOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
        </div>
        <div v-show="stepsSetting.active === 1">
          <el-row>
            <el-col :span="12">
              <el-form-item
                label="资源类型："
                prop="type"
              >
                <el-input
                  v-model.trim="dataJson.tempJson.type"
                  disabled
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item
                label="资源名称："
                prop="name"
              >
                <el-input
                  ref="refName"
                  v-model.trim="dataJson.tempJson.name"
                  clearable
                  show-word-limit
                  :maxlength="dataJson.inputSettings.maxLength.name"
                />
              </el-form-item>
            </el-col>
          </el-row>
          <el-form-item
            label="说明："
            prop="descr"
          >
            <el-input
              v-model.trim="dataJson.tempJson.descr"
              clearable
              type="textarea"
              show-word-limit
              :maxlength="dataJson.inputSettings.maxLength.descr"
            />
          </el-form-item>
          <el-form-item
            label="JSON配置信息："
            prop="context"
          >
            <el-input
              v-model.trim="dataJson.tempJson.context"
              :autosize="{ minRows: 4, maxRows: 10 }"
              clearable
              type="textarea"
              show-word-limit
            />
          </el-form-item>
          <el-row>
            <el-col :span="12">
              <el-form-item
                label="更新人："
                prop="u_name"
              >
                <el-input
                  v-model.trim="dataJson.tempJson.u_id"
                  disabled
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item
                label="更新时间："
                prop="u_time"
              >
                <el-input
                  v-model.trim="dataJson.tempJson.u_time"
                  disabled
                />
              </el-form-item>
            </el-col>
          </el-row>
        </div>

      </el-form>
      <div
        slot="footer"
        class="dialog-footer"
      >
        <el-divider />
        <div class="floatLeft">
          <el-button
            v-show="stepsSetting.active === stepsSetting.stepNumber"
            type="danger"
            :disabled="settings.loading || popSettingsData.btnDisabledStatus.disabledReset "
            @click="doReset()"
          >重置</el-button>
        </div>
        <el-button
          plain
          :disabled="settings.loading"
          @click="popSettingsData.dialogFormVisible = false"
        >取 消</el-button>
        <el-button
          v-show="stepsSetting.active !== stepsSetting.stepNumber"
          :disabled="settings.loading || popSettingsData.btnDisabledStatus.disabledNext "
          @click="handleNext"
        >下一步</el-button>
        <el-button
          v-show="popSettingsData.btnShowStatus.showInsert && stepsSetting.active === stepsSetting.stepNumber"
          plain
          type="primary"
          :disabled="settings.loading || popSettingsData.btnDisabledStatus.disabledInsert "
          @click="doInsert()"
        >确定</el-button>
        <el-button
          v-show="popSettingsData.btnShowStatus.showUpdate && stepsSetting.active === stepsSetting.stepNumber"
          plain
          type="primary"
          :disabled="settings.loading || popSettingsData.btnDisabledStatus.disabledUpdate "
          @click="doUpdate()"
        >确定</el-button>
        <el-button
          v-show="popSettingsData.btnShowStatus.showCopyInsert && stepsSetting.active === stepsSetting.stepNumber"
          plain
          type="primary"
          :disabled="settings.loading || popSettingsData.btnDisabledStatus.disabledCopyInsert "
          @click="doCopyInsert()"
        >确定</el-button>
      </div>
    </el-dialog>
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
</style>

<script>
import constants_program from '@/common/constants/constants_program'
import { getListApi, updateApi, insertApi, exportAllApi, exportSelectionApi, deleteApi } from '@/api/10_system/resource/resource'
import resizeMixin from '@/mixin/resizeHandlerMixin'
import Pagination from '@/components/Pagination'
import elDragDialog from '@/directive/el-drag-dialog'
import deepCopy from 'deep-copy'

export default {
  name: constants_program.P_RESOURCE, // 页面id，和router中的name需要一致，作为缓存
  components: { Pagination },
  directives: { elDragDialog },
  mixins: [resizeMixin],
  data () {
    return {
      dataJson: {
        // 查询使用的json
        searchForm: {
          // 翻页条件
          pageCondition: deepCopy(this.PARAMETERS.PAGE_CONDITION),
          // 查询条件
          name: '',
          is_del: 'null',
          isenable: '',
          // 下拉选项选择的内容
          code: []
        },
        // 分页控件的json
        paging: deepCopy(this.PARAMETERS.PAGE_JSON),
        // table使用的json
        listData: null,
        // 单条数据 json的，初始化原始数据
        tempJsonOriginal: {
          id: undefined,
          type: '',
          name: '',
          descr: '',
          context: '',
          dbversion: 0
        },
        // 单条数据 json
        currentJson: null,
        tempJson: null,
        inputSettings: {
          maxLength: {
            name: 20,
            uri: 50,
            base: 50,
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
        tableHeadTooltips: [
          { text: '订购触发次数', tooltip: '统计周期内，订购触发（任一订购）次数之和', code: 'iOActionTotal' }
        ],
        // 表格排序规则
        sortOrders: deepCopy(this.PARAMETERS.SORT_PARA),
        // 按钮状态
        btnShowStatus: {
          showUpdate: false,
          showCopyInsert: false,
          showExport: false
        },
        // loading 状态
        loading: true,
        tableHeight: this.setUIheight(),
        duration: 4000,
        // 资源类型下拉选项json
        codeOptions: [{
          value: '10',
          label: 'json配置'
        }, {
          value: '20',
          label: '配置文件'
        }],
        // 资源类型下拉选项json
        delOptions: [{
          value: '0',
          label: '未删除'
        }, {
          value: '1',
          label: '已删除'
        }, {
          value: 'null',
          label: '全部'
        }]
      },
      popSettingsData: {
        // 弹出窗口状态名称
        textMap: {
          update: '修改',
          insert: '新增',
          copyInsert: '复制新增'
        },
        // 按钮状态：是否显示
        btnShowStatus: {
          showInsert: false,
          showUpdate: false,
          showCopyInsert: false
        },
        // 按钮状态：是否可用
        btnDisabledStatus: {
          disabledNext: false,
          disabledReset: false,
          disabledInsert: false,
          disabledUpdate: false,
          disabledCopyInsert: false
        },
        // 以下为pop的内容：数据弹出框
        selection: [],
        dialogStatus: '',
        dialogFormVisible: false,
        // pop的check内容
        rules: []
      },
      // 步骤设置部分
      stepsSetting: {
        active: 0, // 控制步骤
        stepNumber: 1, // 总步数
        // 步骤1的check内容
        rulesFirst: {
          type: [
            { required: true, message: '请选择资源类型', trigger: 'change' },
            { validator: this.validateType, trigger: 'change' }
          ]
        },
        // 步骤2的check内容
        rulesSecond: {
          name: [{ required: true, message: '请输入资源名称', trigger: 'change' }],
          context: [{ required: true, message: '请输入json配置信息', trigger: 'change' }]
        }
      },
      resourceDialogSetting: {
        program: this.$store.getters.program,
        selectedDataJson: this.$store.getters.selectedDataJson,
        dialogStatus: false
      }
    }
  },
  // 监听器
  watch: {
    // 监听页面上面是否有修改，有修改按钮高亮
    'dataJson.tempJson': {
      handler (newVal, oldVal) {
        if (this.popSettingsData.dialogFormVisible) {
          switch (this.stepsSetting.active) {
            case 0:
              // 第一页
              this.popSettingsData.btnDisabledStatus.disabledNext = false
              this.popSettingsData.btnDisabledStatus.disabledReset = true
              this.popSettingsData.btnDisabledStatus.disabledInsert = true
              this.popSettingsData.btnDisabledStatus.disabledUpdate = true
              this.popSettingsData.btnDisabledStatus.disabledCopyInsert = true
              break
            default:
              // 第二页
              this.popSettingsData.btnDisabledStatus.disabledNext = true
              this.popSettingsData.btnDisabledStatus.disabledReset = false
              this.popSettingsData.btnDisabledStatus.disabledInsert = false
              this.popSettingsData.btnDisabledStatus.disabledUpdate = false
              this.popSettingsData.btnDisabledStatus.disabledCopyInsert = false
              break
          }
        }
      },
      deep: true
    },
    // 弹出窗口初始化，按钮不可用
    'popSettingsData.dialogFormVisible': {
      handler (newVal, oldVal) {
        if (this.popSettingsData.dialogFormVisible) {
          this.popSettingsData.btnDisabledStatus.disabledNext = true
          this.popSettingsData.btnDisabledStatus.disabledReset = true
          this.popSettingsData.btnDisabledStatus.disabledInsert = true
          this.popSettingsData.btnDisabledStatus.disabledUpdate = true
          this.popSettingsData.btnDisabledStatus.disabledCopyInsert = true
        }
      }
    },
    // 根据当前步骤，替换相应validate的rules
    'stepsSetting.active': {
      handler (newVal, oldVal) {
        this.$nextTick(() => {
          this.$refs['dataSubmitForm'].clearValidate()
        })
        switch (newVal) {
          case 0:
            this.popSettingsData.rules = this.stepsSetting.rulesFirst
            break
          case 1:
            this.popSettingsData.rules = this.stepsSetting.rulesSecond
            break
        }
      }
    }
  },
  created () {
    this.initShow()
  },
  methods: {
    initShow () {
      // 初始化查询
      this.getDataList()
      // 数据初始化
      this.dataJson.tempJson = Object.assign({}, this.dataJson.tempJsonOriginal)
      // 步骤初始化
      this.popSettingsData.rules = this.stepsSetting.rulesFirst
    },
    // 弹出框设置初始化
    initDialogStatus () {
      if (this.$store.getters.program !== undefined &&
        this.$store.getters.program !== null &&
        this.$store.getters.program.status === 'open') {
        this.resourceDialogSetting.dialogStatus = true
      } else {
        this.resourceDialogSetting.dialogStatus = false
      }
    },
    // 下拉选项控件事件
    handleSelectChange (val) {
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
    // 行双点击，仅在dialog中有效
    handleRowDbClick (row) {
      this.dataJson.tempJson = Object.assign({}, row) // copy obj
      this.dataJson.rowIndex = this.getRowIndex(row)
      if (this.resourceDialogSetting.dialogStatus) {
        this.$emit('rowDbClick', this.dataJson.tempJson)
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
    handleRowUpdate (row, _rowIndex) {
      // 修改
      this.dataJson.tempJson = Object.assign({}, row) // copy obj
      this.dataJson.rowIndex = _rowIndex
      this.popSettingsData.dialogStatus = this.PARAMETERS.STATUS_UPDATE
      this.popSettingsData.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataSubmitForm'].clearValidate()
      })
    },
    // 删除操作
    handleDel (row) {
      let _message = ''
      const _value = row.is_del
      const selectionJson = []
      selectionJson.push({ 'id': row.id })
      if (_value === true) {
        _message = '是否要删除选择的数据？'
      } else {
        _message = '是否要复原该条数据？'
      }
      // 选择全部的时候
      this.$confirm(_message, '确认信息', {
        distinguishCancelAndClose: true,
        confirmButtonText: '确认',
        cancelButtonText: '取消'
      }).then(() => {
        // loading
        this.settings.loading = true
        deleteApi(selectionJson).then((_data) => {
          this.$notify({
            title: '更新处理成功',
            message: _data.message,
            type: 'success',
            duration: this.settings.duration
          })
          this.popSettingsData.dialogFormVisible = false
          this.settings.loading = false
        }, (_error) => {
          this.$notify({
            title: '更新处理失败',
            message: _error.message,
            type: 'error',
            duration: this.settings.duration
          })
          row.is_del = !row.is_del
          this.popSettingsData.dialogFormVisible = false
          this.settings.loading = false
        })
      }).catch(action => {
        row.is_del = !row.is_del
      })
    },
    // 点击按钮 新增
    handleInsert () {
      // 新增
      this.popSettingsData.dialogStatus = 'insert'
      // 数据初始化
      this.dataJson.tempJson = Object.assign({}, this.dataJson.tempJsonOriginal)
      this.$nextTick(() => {
        this.$refs['dataSubmitForm'].clearValidate()
      })
      // 设置按钮
      this.popSettingsData.btnShowStatus.showInsert = true
      this.popSettingsData.btnShowStatus.showUpdate = false
      this.popSettingsData.btnShowStatus.showCopyInsert = false
      // 初始化弹出页面
      this.doReset()
      this.popSettingsData.dialogFormVisible = true
      // 修改时控件focus
      this.$nextTick(() => {
        this.$refs['refType'].focus()
      })
    },
    // 点击按钮 更新
    handleUpdate () {
      if (this.dataJson.tempJson.id === undefined) {
        this.showErrorMsg('请选择一条数据')
        return
      }
      // 修改
      this.popSettingsData.dialogStatus = this.PARAMETERS.STATUS_UPDATE
      this.popSettingsData.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataSubmitForm'].clearValidate()
      })
      // 设置按钮
      this.popSettingsData.btnShowStatus.showInsert = false
      this.popSettingsData.btnShowStatus.showUpdate = true
      this.popSettingsData.btnShowStatus.showCopyInsert = false
      // 设置步骤激活的步骤：2
      this.stepsSetting.active = 1
      // 设置控件焦点focus
      this.$nextTick(() => {
        this.$refs['refName'].focus()
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
          this.settings.btnShowStatus.showExport = false
        })
      } else if (this.dataJson.multipleSelection.length === this.dataJson.listData.length) {
        // 选择全部的时候
        this.$confirm('请选择：当前页数据导出，全数据导出？', '确认信息', {
          distinguishCancelAndClose: true,
          confirmButtonText: '全数据导出',
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
      // 开始导出
      exportAllApi(this.dataJson.searchForm).then(response => {
        this.settings.loading = false
      })
    },
    // 部分数据导出
    handleExportSelectionData () {
      // loading
      this.settings.loading = true
      const selectionJson = []
      this.dataJson.multipleSelection.forEach(function (value, index, array) {
        selectionJson.push({ 'id': value.id })
      })
      // 开始导出
      exportSelectionApi(selectionJson).then(response => {
        this.settings.loading = false
      })
    },
    handleCurrentChange (row) {
      this.dataJson.tempJson = Object.assign({}, row) // copy obj
      this.dataJson.tempJson.index = this.getRowIndex(row)
      if (this.dataJson.tempJson.id !== undefined) {
        // this.settings.btnShowStatus.showInsert = true
        this.settings.btnShowStatus.showUpdate = true
        this.settings.btnShowStatus.showCopyInsert = true
      } else {
        // this.settings.btnShowStatus.showInsert = false
        this.settings.btnShowStatus.showUpdate = false
        this.settings.btnShowStatus.showCopyInsert = false
      }
      // 设置dialog的返回
      this.$store.dispatch('popUpSearchDialog/selectedDataJson', Object.assign({}, row))
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
        this.dataJson.listData = response.data.records
        this.dataJson.paging = response.data
        this.dataJson.paging.records = {}
        this.settings.loading = false
      })
    },
    // 更新逻辑
    doUpdate () {
      this.$refs['dataSubmitForm'].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.dataJson.tempJson)
          this.settings.loading = true
          updateApi(tempData).then((_data) => {
            this.dataJson.tempJson = Object.assign({}, _data.data)
            this.dataJson.listData.splice(this.dataJson.rowIndex, 1, this.dataJson.tempJson)
            this.$notify({
              title: '更新处理成功',
              message: _data.message,
              type: 'success',
              duration: this.settings.duration
            })
            this.popSettingsData.dialogFormVisible = false
            this.settings.loading = false
          }, (_error) => {
            this.$notify({
              title: '更新处理失败',
              message: _error.message,
              type: 'error',
              duration: this.settings.duration
            })
            this.popSettingsData.dialogFormVisible = false
            this.settings.loading = false
          })
        }
      })
    },
    // 重置查询区域
    doResetSearch () {
      this.dataJson.searchForm = this.$options.data.call(this).dataJson.searchForm
    },
    // 重置按钮
    doReset () {
      // 步骤初始化
      switch (this.popSettingsData.dialogStatus) {
        case 'insert':
          // 数据初始化
          this.dataJson.tempJson.type = ''
          this.dataJson.tempJson.name = ''
          this.dataJson.tempJson.descr = ''
          this.dataJson.tempJson.context = ''
          this.stepsSetting.active = 0
          // 设置控件焦点focus
          this.$nextTick(() => {
            this.$refs['refType'].focus()
          })
          break
        case this.PARAMETERS.STATUS_UPDATE:
          // 数据初始化
          this.dataJson.tempJson.name = ''
          this.dataJson.tempJson.descr = ''
          this.dataJson.tempJson.context = ''
          this.stepsSetting.active = 1
          // 设置控件焦点focus
          this.$nextTick(() => {
            this.$refs['refName'].focus()
          })
          break
      }

      // 去除validate信息
      this.$nextTick(() => {
        this.$refs['dataSubmitForm'].clearValidate()
      })
    },
    // 插入逻辑
    doInsert () {
      this.$refs['dataSubmitForm'].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.dataJson.tempJson)
          this.settings.loading = true
          insertApi(tempData).then((_data) => {
            this.dataJson.listData.unshift(_data.data)
            this.$notify({
              title: '新增处理成功',
              message: _data.message,
              type: 'success',
              duration: this.settings.duration
            })
            this.popSettingsData.dialogFormVisible = false
            this.settings.loading = false
          }, (_error) => {
            this.$notify({
              title: '新增处理失败',
              message: _error.message,
              type: 'error',
              duration: this.settings.duration
            })
            this.popSettingsData.dialogFormVisible = false
            this.settings.loading = false
          })
        }
      })
    },
    // 关闭弹出窗口
    handlCloseDialog () {
      this.popSettingsData.dialogFormVisible = false
    },
    // 获取row-key
    getRowKeys (row) {
      return row.id
    },
    // table选择框
    handleSelectionChange (val) {
      this.dataJson.multipleSelection = val
    },
    handleNext () {
      this.$refs['dataSubmitForm'].validate((valid) => {
        if (valid) {
          // check没有错误
          if (this.stepsSetting.active === this.stepsSetting.stepNumber) {
            return
          }
          this.stepsSetting.active++
          this.$nextTick(() => {
            this.$refs['dataSubmitForm'].clearValidate()
          })
        } else {
          // check有错误
          return false
        }
      })
      // 设置控件焦点focus
      this.$nextTick(() => {
        this.$refs['refName'].focus()
      })
    },
    // 资源类型check
    validateType (rule, value, callback) {
      // 现阶段只支持json配置
      if (value === '10') {
        return callback()
      }
      return callback(new Error('现在只支持json配置，请选择“json配置”'))
    },
    renderHeaderIsDel: function (h, { column }) {
      return (
        <span>{column.label}
          <el-tooltip
            class='item'
            effect='dark'
            placement='bottom'
          >
            <div slot='content'>
              删除状态提示：<br />
              绿色：未删除  <br />
              红色：已删除
            </div>
            <svg-icon icon-class='perfect-icon-question1_btn' style='margin-left: 5px' />
          </el-tooltip>
        </span>
      )
    }
  }
}
</script>
