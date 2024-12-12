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
          v-model.trim="dataJson.searchForm.dictTypeCode"
          clearable
          placeholder="字典类型编码"
          @keyup.enter.native="handleSearch"
        />
      </el-form-item>
      <el-form-item label="">
        <el-input
          v-model.trim="dataJson.searchForm.dictTypeName"
          clearable
          placeholder="字典类型名称"
          @keyup.enter.native="handleSearch"
        />
      </el-form-item>
      <el-form-item label="">
        <el-input
          v-model.trim="dataJson.searchForm.label"
          clearable
          placeholder="字典标签"
          @keyup.enter.native="handleSearch"
        />
      </el-form-item>
      <el-form-item label="">
        <delete-type-normal v-model="dataJson.searchForm.is_del" />
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
          @click="handleSearch"
        >查询</el-button>
      </el-form-item>
    </el-form>
    <el-button-group>
      <el-button
        v-permission="'P_DICT_DATA:ADD'"
        type="primary"
        icon="el-icon-circle-plus-outline"
        :loading="settings.loading"
        @click="handleInsert"
      >新增</el-button>
      <el-button
        v-permission="'P_DICT_DATA:UPDATE'"
        :disabled="!settings.btnShowStatus.showUpdate"
        type="primary"
        icon="el-icon-edit-outline"
        :loading="settings.loading"
        @click="handleUpdate"
      >修改</el-button>
      <el-button
        v-permission="'P_DICT_DATA:COPY_INSERT'"
        :disabled="!settings.btnShowStatus.showCopyInsert"
        type="primary"
        icon="el-icon-camera-solid"
        :loading="settings.loading"
        @click="handleCopyInsert"
      >复制新增</el-button>
      <el-button
        v-permission="'P_DICT_DATA:EXPORT'"
        :disabled="!settings.btnShowStatus.showExport"
        type="primary"
        icon="el-icon-s-management"
        :loading="settings.loading"
        @click="handleExport"
      >导出</el-button>
    </el-button-group>

    <el-button-group>
      <el-button
        v-permission="'P_DICT_DATA:IMPORT'"
        type="primary"
        icon="el-icon-upload"
        @click="handleOpenImportDialog"
      >数据批量导入</el-button>
    </el-button-group>
    <el-table
      ref="multipleTable"
      v-loading="settings.loading"
      :data="dataJson.listData"
      :element-loading-text="'正在拼命加载中...'"
      element-loading-background="rgba(255, 255, 255, 0.5)"
      :height="settings.tableHeight"
      columns_index_key="true"
      :default-sort="{prop: 'u_time', order: 'descending'}"
      stripe
      border
      fit
      highlight-current-row
      style="width: 100%"
      @row-click="handleRowClick"
      @current-change="handleCurrentChange"
      @sort-change="handleSortChange"
      @selection-change="handleSelectionChange"
      @cell-mouse-enter="handleCellMouseEnter"
      @cell-mouse-leave="handleCellMouseLeave"
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
        prop="No"
      />
      <el-table-column
        show-overflow-tooltip
        min-width="130"
        prop="dictTypeCode"
        label="字典类型"
        :auto-fit="true"
      />
      <el-table-column
        show-overflow-tooltip
        min-width="130"
        prop="dictTypeName"
        label="字典类型名称"
        :auto-fit="true"
      />
      <el-table-column
        show-overflow-tooltip
        min-width="120"
        prop="label"
        label="字典标签"
        :auto-fit="true"
      />
      <el-table-column
        show-overflow-tooltip
        min-width="120"
        prop="dict_value"
        label="字典键值"
      />
      <el-table-column
        show-overflow-tooltip
        min-width="120"
        prop="extra1"
        label="额外配置1"
      />
      <el-table-column
        show-overflow-tooltip
        min-width="120"
        prop="extra2"
        label="额外配置2"
      />
      <el-table-column
        show-overflow-tooltip
        min-width="120"
        prop="extra3"
        label="额外配置3"
      />
      <el-table-column
        show-overflow-tooltip
        min-width="120"
        prop="extra4"
        label="额外配置4"
      />
      <el-table-column
        sortable="custom"
        show-overflow-tooltip
        min-width="120"
        prop="sort"
        label="字典排序"
      >
        <template v-slot="scope">
          <span>{{ scope.row.sort }}</span>
          <div class="floatRight">
            <el-button
              class="el-icon-top"
              type="text"
              style="font-size: 16px"
              :disabled="scope.row.sort===scope.row.min_sort"
              @click="handleSortUp(scope, scope.$index)"
            />
            <el-button
              class="el-icon-bottom"
              type="text"
              style="font-size: 16px"
              :disabled="scope.row.sort===scope.row.max_sort"
              @click="handleSortDown(scope, scope.$index)"
            />
          </div>
        </template>
      </el-table-column>
      <el-table-column
        show-overflow-tooltip
        min-width="180"
        prop="descr"
        label="字典说明"
      />
      <el-table-column
        min-width="70"
        label="删除"
        prop="is_del"
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
              @change="handleDel(scope.row)"
            />
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column
        min-width="180"
        sortable="custom"
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
    <dicttype-dialog
      :visible="popSettingsData.searchDialogData.dialogVisible"
      @closeMeOk="handleResourceCloseOk"
      @closeMeCancel="handleResourceCloseCancel"
    />
    <!-- pop窗口 数据批量导入：模版导出、excel导入-->
    <el-dialog
      v-el-drag-dialog
      title="数据批量导入"
      :visible="popSettingsImport.dialogFormVisible"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :show-close="false"
      :append-to-body="true"
      :modal-append-to-body="false"
      width="620px"
    >
      <el-form
        ref="dataForm"
        label-position="right"
        label-width="120px"
        status-icon
      >
        <el-form-item label="点击下载：">
          <el-link
            ref="refDownLoadOne"
            type="primary"
            :href="popSettingsImport.templateFilePath"
          > 模版文件下载</el-link>
        </el-form-item>
        <el-form-item label="选择导入文件：">
          <simple-upload
            :accept="'.xls,.xlsx'"
            @upload-success="handleUploadFileSuccess"
            @upload-error="handleUploadFileError"
          />
          <el-link
            v-show="!(popSettingsImport.errorFileUrl =='')"
            type="danger"
            :href="popSettingsImport.errorFileUrl"
          >
            <i class="el-icon-view el-icon--right" />错误信息
          </el-link>
        </el-form-item>
      </el-form>
      <p><strong>说明：</strong></p>
      <ul>
        <li>请先下载模版文件，在模版文件中进行修改后再上传</li>
        <li>支持上传的文件类型：xls、xlsx</li>
        <li>请避免excel文件格式错误</li>
        <li>文件中存在任何错误，整个文件上传都将失败</li>
        <li>如果上传失败，会自动下载错误信息，请修改完毕后再次上传</li>
      </ul>

      <div
        slot="footer"
        class="dialog-footer"
      >
        <el-divider />
        <el-button
          plain
          :disabled="settings.loading"
          @click="handlCloseDialog"
        >关 闭</el-button>
      </div>
    </el-dialog>

    <!-- pop窗口 数据编辑:新增、修改 -->
    <el-dialog
      v-el-drag-dialog
      :title="popSettingsData.textMap[popSettingsData.dialogStatus]"
      :visible="popSettingsData.dialogFormVisible"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :show-close="false"
      width="700px"
    >
      <el-form
        ref="dataSubmitForm"
        :rules="popSettingsData.rules"
        :model="dataJson.tempJson"
        label-position="right"
        label-width="120px"
        status-icon
      >
        <el-alert
          title="字典类型选择"
          type="info"
          :closable="false"
        />
        <br>
        <el-row>
          <el-col :span="12">
            <el-form-item
              label="字典类型："
              prop="dictTypeCode"
            >
              <el-input
                v-model="popSettingsData.searchDialogData.selectedDataJson.code"
                disabled
              >
                <el-button
                  slot="append"
                  ref="selectOne"
                  :icon="popSettingsData.searchDialogData.selectOrResetIcon"
                  @click="handleSelectOrReset"
                >
                  {{ popSettingsData.searchDialogData.selectOrResetName }}
                </el-button>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              label="字典类型名称："
              prop="dictTypeName"
            >
              <el-input
                v-model="popSettingsData.searchDialogData.selectedDataJson.name"
                disabled
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item
          label="字典类型说明："
          prop="dictTypeDescr"
        >
          <el-input
            v-model.trim="popSettingsData.searchDialogData.selectedDataJson.descr"
            type="textarea"
            disabled
          />
        </el-form-item>
        <el-alert
          title="字典数据设置"
          type="info"
          :closable="false"
        />
        <br>
        <el-row>
          <el-col :span="12">
            <el-form-item
              label="字典键值："
              prop="dict_value"
            >
              <el-input
                ref="refDictValue"
                v-model.trim="dataJson.tempJson.dict_value"
                clearable
                show-word-limit
                controls-position="right"
                :maxlength="dataJson.inputSettings.maxLength.dict_value"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              label="字典标签："
              prop="label"
            >
              <el-input
                v-model.trim="dataJson.tempJson.label"
                clearable
                show-word-limit
                :maxlength="dataJson.inputSettings.maxLength.label"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item
              label="额外配置1："
              prop="extra1"
            >
              <el-input
                v-model.trim="dataJson.tempJson.extra1"
                clearable
                show-word-limit
                :maxlength="dataJson.inputSettings.maxLength.extra1"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              label="额外配置2："
              prop="extra2"
            >
              <el-input
                v-model.trim="dataJson.tempJson.extra2"
                clearable
                show-word-limit
                :maxlength="dataJson.inputSettings.maxLength.extra2"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item
              label="额外配置3："
              prop="extra3"
            >
              <el-input
                v-model.trim="dataJson.tempJson.extra3"
                clearable
                show-word-limit
                :maxlength="dataJson.inputSettings.maxLength.extra3"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              label="额外配置4："
              prop="extra4"
            >
              <el-input
                v-model.trim="dataJson.tempJson.extra4"
                clearable
                show-word-limit
                :maxlength="dataJson.inputSettings.maxLength.extra4"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item
              label="字典排序："
              prop="sort"
            >
              <el-input
                v-model.trim="dataJson.tempJson.sort"
                disabled
                placeholder="系统自动指定"
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
        <el-row v-show="popSettingsData.dialogStatus === PARAMETERS.STATUS_UPDATE">
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
      </el-form>
      <div
        slot="footer"
        class="dialog-footer"
      >
        <el-divider />
        <div class="floatLeft">
          <el-button
            type="danger"
            :disabled="settings.loading || popSettingsData.btnDisabledStatus.disabledReset"
            @click="doReset()"
          >重置</el-button>
        </div>
        <el-button
          plain
          :disabled="settings.loading"
          @click="popSettingsData.dialogFormVisible = false"
        >取消</el-button>
        <el-button
          v-show="popSettingsData.btnShowStatus.showInsert"
          plain
          type="primary"
          :disabled="settings.loading || popSettingsData.btnDisabledStatus.disabledInsert "
          @click="doInsert()"
        >确定</el-button>
        <el-button
          v-show="popSettingsData.btnShowStatus.showUpdate"
          plain
          type="primary"
          :disabled="settings.loading || popSettingsData.btnDisabledStatus.disabledUpdate "
          @click="doUpdate()"
        >确定</el-button>
        <el-button
          v-show="popSettingsData.btnShowStatus.showCopyInsert"
          plain
          type="primary"
          :disabled="settings.loading || popSettingsData.btnDisabledStatus.disabledCopyInsert "
          @click="doCopyInsert()"
        >确定</el-button>
      </div>
    </el-dialog>
    <iframe
      id="refIframe"
      ref="refIframe"
      scrolling="no"
      frameborder="0"
      style="display:none"
      name="refIframe"
    >x</iframe>
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
import { getListApi, updateApi, insertApi, exportAllApi, exportSelectionApi, importExcelApi, deleteApi, saveListApi, sortUpApi, sortDownApi } from '@/api/10_system/dictdata/dictdata'
import resizeMixin from './dictdataResizeHandlerMixin'
import Pagination from '@/components/Pagination'
import elDragDialog from '@/directive/el-drag-dialog'
import SimpleUpload from '@/components/10_file/SimpleUpload'
import DeleteTypeNormal from '@/components/00_dict/select/SelectDeleteTypeNormal'
import dicttypeDialog from '@/views/10_system/dicttype/dialog/dialog'
import deepCopy from 'deep-copy'
import permission from '@/directive/permission/index.js' // 权限判断指令

export default {
  components: { Pagination, SimpleUpload, dicttypeDialog, DeleteTypeNormal },
  directives: { elDragDialog, permission },
  mixins: [resizeMixin],
  data () {
    return {
      dataJson: {
        // 查询使用的json
        searchForm: {
          // 翻页条件
          pageCondition: deepCopy(this.PARAMETERS.PAGE_CONDITION),
          // 查询条件
          dictTypeName: '',
          dictTypeCode: '',
          is_del: 'null',
          isenable: ''
        },
        // 分页控件的json
        paging: deepCopy(this.PARAMETERS.PAGE_JSON),
        // table使用的json
        listData: null,
        // 单条数据 json的，初始化原始数据
        tempJsonOriginal: {
          id: undefined,
          name: '',
          code: '',
          descr: '',
          dbversion: 0,
          dict_type_id: undefined,
          dictTypeCode: '',
          dictTypeName: '',
          dictTypeDescr: ''
        },
        // 单条数据 json
        currentJson: null,
        tempJson: null,
        inputSettings: {
          maxLength: {
            dict_value: 20,
            lable: 20,
            descr: 200,
            dbversion: 0,
            extra1: 40,
            extra2: 40,
            extra3: 40,
            extra4: 40
          }
        },
        // 当前表格中的索引，第几条
        rowIndex: 0,
        // 当前选中的行（checkbox）
        multipleSelection: []
      },
      // 页面设置json
      settings: {
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
        // table的setting，表格的设置
        tableHover: {
          columnTypeShowIcon: false,
          columnNameShowIcon: false
        },
        // 资源类型下拉选项json
        delOptions: []
      },
      popSettingsData: {
        // 弹出窗口状态名称
        textMap: {
          update: '修改',
          insert: '新增',
          copyInsert: '复制新增'
        },
        // 按钮状态
        btnShowStatus: {
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
          dictTypeCode: [{ required: true, message: '请输入字典类型', trigger: 'change' }],
          dict_value: [{ required: true, message: '请输入字典键值', trigger: 'change' }],
          label: [{ required: true, message: '请输入字典标签', trigger: 'change' }]
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
      },
      // 导入窗口的状态
      popSettingsImport: {
        // 弹出窗口会否显示
        dialogFormVisible: false,
        // 模版文件地址
        templateFilePath: process.env.VUE_APP_BASE_API + '/api/v1/template.html?id=P00000050',
        // 错误数据文件
        errorFileUrl: ''
      }
    }
  },
  // 监听器
  watch: {
    // 监听弹出窗口是否有返回值
    'popSettingsData.searchDialogData.selectedDataJson': {
      handler (newVal, oldVal) {
        if (newVal.id !== undefined) {
          this.dataJson.tempJson.dict_type_id = newVal.id
        }
      },
      deep: true,
      immediate: true
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
          // 有修改按钮高亮
          this.popSettingsData.btnDisabledStatus.disabledReset = false
          this.popSettingsData.btnDisabledStatus.disabledInsert = false
          this.popSettingsData.btnDisabledStatus.disabledUpdate = false
          this.popSettingsData.btnDisabledStatus.disabledCopyInsert = false
        }
      },
      deep: true,
      immediate: true
    },
    // 弹出窗口初始化，按钮不可用
    'popSettingsData.dialogFormVisible': {
      handler (newVal, oldVal) {
        if (this.popSettingsData.dialogFormVisible) {
          this.initPopUpStatus()
          // 修改的情况下
          if (this.popSettingsData.dialogStatus === this.PARAMETERS.STATUS_UPDATE) {
            this.initSelectData()
          }
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
  created () {
    if (this.$route.query.dictTypeCode !== undefined) {
      this.dataJson.searchForm.dictTypeCode = this.$route.query.dictTypeCode
    } else {
      this.dataJson.searchForm.dictTypeCode = ''
    }
    if (this.$route.query.dictTypeName !== undefined) {
      this.dataJson.searchForm.dictTypeName = this.$route.query.dictTypeName
    } else {
      this.dataJson.searchForm.dictTypeName = ''
    }
    // 初始化查询
    this.getDataList()
    // 数据初始化
    this.dataJson.tempJson = Object.assign({}, this.dataJson.tempJsonOriginal)
  },
  mounted () {
    // 描绘完成
  },
  methods: {
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
        }, (_error) => {
          this.$notify({
            title: '更新处理失败',
            message: _error.message,
            type: 'error',
            duration: this.settings.duration
          })
          row.is_del = !row.is_del
        }).finally(() => {
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
      // 控件focus
      this.$nextTick(() => {
        // this.$refs['selectOne'].focus()
      })
    },
    // 点击按钮 更新
    handleUpdate () {
      this.dataJson.tempJson = Object.assign({}, this.dataJson.currentJson)
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
      // 控件focus
      this.$nextTick(() => {
        this.$refs['refDictValue'].focus()
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
        selectionJson.push({ 'id': value.id })
      })
      // 开始导出
      exportSelectionApi(selectionJson).then(response => {
      }).finally(() => {
        this.settings.loading = false
      })
    },
    // 点击按钮 复制新增
    handleCopyInsert () {
      this.dataJson.tempJson = Object.assign({}, this.dataJson.currentJson)
      this.dataJson.tempJson.id = undefined
      this.dataJson.tempJson.template_id = undefined
      this.dataJson.tempJson.u_id = ''
      this.dataJson.tempJson.u_time = ''
      this.dataJson.tempJson.sort = ''
      // 字典类型数据设置
      this.popSettingsData.searchDialogData.selectedDataJson.id = this.dataJson.tempJson.dict_type_id
      this.popSettingsData.searchDialogData.selectedDataJson.code = this.dataJson.tempJson.dictTypeCode
      this.popSettingsData.searchDialogData.selectedDataJson.name = this.dataJson.tempJson.dictTypeName
      this.popSettingsData.searchDialogData.selectedDataJson.descr = this.dataJson.tempJson.dictTypeDescr

      // 修改
      this.popSettingsData.dialogStatus = 'copyInsert'
      this.popSettingsData.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataSubmitForm'].clearValidate()
      })
      // 设置按钮
      this.popSettingsData.btnShowStatus.showInsert = false
      this.popSettingsData.btnShowStatus.showUpdate = false
      this.popSettingsData.btnShowStatus.showCopyInsert = true
      // 修改时控件focus
      this.$nextTick(() => {
        this.$refs['refDictValue'].focus()
      })
    },
    handleCurrentChange (row) {
      this.dataJson.currentJson = Object.assign({}, row) // copy obj
      this.dataJson.tempJsonOriginal = Object.assign({}, row) // copy obj
      this.dataJson.currentJson.index = this.getRowIndex(row)
      if (this.dataJson.currentJson.id !== undefined) {
        // this.settings.btnShowStatus.doInsert = true
        this.settings.btnShowStatus.showUpdate = true
        this.settings.btnShowStatus.showCopyInsert = true
      } else {
        // this.settings.btnShowStatus.doInsert = false
        this.settings.btnShowStatus.showUpdate = false
        this.settings.btnShowStatus.showCopyInsert = false
      }
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
      }).finally(() => {
        this.settings.loading = false
      })
    },
    // 更新逻辑
    doUpdate () {
      this.$refs['dataSubmitForm'].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.dataJson.tempJson)
          tempData.code = tempData.dictTypeCode
          this.settings.loading = true
          updateApi(tempData).then((_data) => {
            this.dataJson.tempJson = Object.assign({}, _data.data)
            // 设置到table中绑定的json数据源
            this.dataJson.listData.splice(this.dataJson.rowIndex, 1, this.dataJson.tempJson)
            // 设置到currentjson中
            this.dataJson.currentJson = Object.assign({}, this.dataJson.tempJson)
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
          }).finally(() => {
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
      this.popSettingsData.btnResetStatus = true
      switch (this.popSettingsData.dialogStatus) {
        case this.PARAMETERS.STATUS_UPDATE:
          // 复制数据
          this.dataJson.tempJson = Object.assign({}, this.dataJson.tempJsonOriginal)
          // 初始化数据
          this.initSelectData()
          // 设置控件焦点focus
          this.$nextTick(() => {
            this.$refs['refDictValue'].focus()
          })
          break
        case 'copyInsert':
          // 复制数据
          this.dataJson.tempJson = Object.assign({}, this.dataJson.tempJsonOriginal)
          this.dataJson.tempJson.dict_value = ''
          this.dataJson.tempJson.label = ''
          this.dataJson.tempJson.sort = ''

          // 初始化数据
          this.initSelectData()
          // 设置控件焦点focus
          this.$nextTick(() => {
            this.$refs['refDictValue'].focus()
          })
          break
        default:
          // 数据初始化
          this.dataJson.tempJson = Object.assign({}, this.dataJson.tempJsonOriginal)
          // 设置控件焦点focus
          this.$nextTick(() => {
            // this.$refs['selectOne'].focus()
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
          }, (_error) => {
            this.$notify({
              title: '新增处理失败',
              message: _error.message,
              type: 'error',
              duration: this.settings.duration
            })
          }).finally(() => {
            this.popSettingsData.dialogFormVisible = false
            this.settings.loading = false
          })
        }
      })
    },
    // 复制新增逻辑
    doCopyInsert () {
      this.$refs['dataSubmitForm'].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.dataJson.tempJson)
          this.settings.loading = true
          insertApi(tempData).then((_data) => {
            this.dataJson.listData.unshift(_data.data)
            this.$notify({
              title: '复制新增处理成功',
              message: _data.message,
              type: 'success',
              duration: this.settings.duration
            })
            this.popSettingsData.dialogFormVisible = false
          }, (_error) => {
            this.$notify({
              title: '复制新增处理失败',
              message: _error.message,
              type: 'error',
              duration: this.settings.duration
            })
            // this.popSettingsData.dialogFormVisible = false
          }).finally(() => {
            this.settings.loading = false
          })
        }
      })
    },
    // 文件上传成功
    handleUploadFileSuccess (res) {
      // 开始导出
      importExcelApi(res.response.data).then(response => {
        this.settings.loading = false
        this.popSettingsImport.errorFileUrl = ''
        if (response.code !== 0) {
          this.popSettingsImport.errorFileUrl = response.data.fsType2Url
          this.showErrorMsg('您上传的excel数据有错误，请点击错误信息进行查看！')
        } else if (response.code === 0) {
          const successList = '成功导入 ' + response.data.length + ' 条数据'
          this.$alert(successList, '导入成功', {
            confirmButtonText: '关闭',
            type: 'success'
          }).then(() => {
            this.popSettingsImport.dialogFormVisible = false
          })
        }
      }, (_error) => {
        // this.showErrorMsg('发生了异常，请联系管理员！', _error.data)
        console.log('发生了异常，请联系管理员！:' + JSON.stringify(_error))
      }).finally(() => {
        this.settings.loading = false
      })
    },
    // 文件上传失败
    handleUploadFileError () {
      console.debug('文件上传失败')
      this.$notify({
        title: '导入错误',
        message: '文件上传发生错误！',
        type: 'error',
        duration: 0
      })
    },
    // 数据批量导入按钮
    handleOpenImportDialog () {
      this.popSettingsImport.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['refDownLoadOne'].$el.target = 'refIframe'
      })
    },
    // 关闭弹出窗口
    handlCloseDialog () {
      this.popSettingsImport.dialogFormVisible = false
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
    /** 当单元格 hover 进入时会触发该事件 */
    handleCellMouseEnter (row, column, cell, event) {
      switch (column.columnKey) {
        case 'columnCode':
          // 字典编码列时
          this.settings.tableHover.columnTypeShowIcon = true
          break
        case 'columnName':
          // 字典编码列时
          this.settings.tableHover.columnNameShowIcon = true
          break
      }
    },
    /** 当单元格 hover 退出时会触发该事件 */
    handleCellMouseLeave (row, column, cell, event) {
      switch (column.columnKey) {
        case 'columnCode':
          // 字典编码列时
          this.settings.tableHover.columnTypeShowIcon = false
          break
        case 'columnName':
          // 字典编码列时
          this.settings.tableHover.columnNameShowIcon = false
          break
      }
    },
    // 弹出查询对话框
    handleSelectOrReset () {
      // this.$store.dispatch('popUpSearchDialog/show', true)
      if (this.popSettingsData.searchDialogData.selectOrReset === false) {
        // 选择按钮
        this.popSettingsData.searchDialogData.dialogVisible = true
      } else {
        // 重置按钮
        this.popSettingsData.searchDialogData.selectedDataJson = {}
        this.initSelectOrResectButton()
        this.dataJson.tempJson.dict_type_id = undefined
        this.dataJson.tempJson.dictTypeCode = ''
        this.dataJson.tempJson.dictTypeName = ''
        this.dataJson.tempJson.dictTypeDescr = ''
      }
    },
    // 关闭对话框：确定
    handleResourceCloseOk (val) {
      this.popSettingsData.searchDialogData.selectedDataJson = val
      this.popSettingsData.searchDialogData.dialogVisible = false
      this.initSelectOrResectButton()
      this.dataJson.tempJson.dict_type_id = this.popSettingsData.searchDialogData.selectedDataJson.id
      this.dataJson.tempJson.dictTypeCode = this.popSettingsData.searchDialogData.selectedDataJson.code
      this.dataJson.tempJson.code = this.popSettingsData.searchDialogData.selectedDataJson.code
      this.dataJson.tempJson.dictTypeName = this.popSettingsData.searchDialogData.selectedDataJson.name
      this.dataJson.tempJson.dictTypeDescr = this.popSettingsData.searchDialogData.selectedDataJson.descr
    },
    // 关闭对话框：取消
    handleResourceCloseCancel () {
      this.popSettingsData.searchDialogData.dialogVisible = false
    },
    initSelectData () {
      // 设置资源部分的数据，从表格上复制
      this.popSettingsData.searchDialogData.selectedDataJson = {
        id: this.dataJson.tempJson.dict_type_id,
        code: this.dataJson.tempJson.dictTypeCode,
        name: this.dataJson.tempJson.dictTypeName,
        descr: this.dataJson.tempJson.dictTypeDescr
      }
      this.initSelectOrResectButton()
    },
    // 弹出框设置初始化
    initPopUpStatus () {
      this.popSettingsData.btnDisabledStatus.disabledReset = true
      this.popSettingsData.btnDisabledStatus.disabledInsert = true
      this.popSettingsData.btnDisabledStatus.disabledUpdate = true
      this.popSettingsData.btnDisabledStatus.disabledCopyInsert = true
      this.initSelectOrResectButton()
    },
    // 选择资源窗口判断是否已经选择
    isDataSelected () {
      if (this.popSettingsData.searchDialogData.selectedDataJson.id === undefined) {
        // 未选择
        return false
      } else {
        // 已经选择
        return true
      }
    },
    // 选择or重置按钮的初始化
    initSelectOrResectButton () {
      if (this.isDataSelected() === false) {
        this.$nextTick(() => {
          this.$refs.selectOne.$el.parentElement.className = 'el-input-group__append el-input-group__append_select'
        })
        this.popSettingsData.searchDialogData.selectOrReset = false
        this.popSettingsData.searchDialogData.selectOrResetName = '选择'
        this.popSettingsData.searchDialogData.selectOrResetIcon = 'el-icon-search'
      } else {
        this.$nextTick(() => {
          this.$refs.selectOne.$el.parentElement.className = 'el-input-group__append el-input-group__append_reset'
        })
        this.popSettingsData.searchDialogData.selectOrReset = true
        this.popSettingsData.searchDialogData.selectOrResetName = '清空'
        this.popSettingsData.searchDialogData.selectOrResetIcon = 'el-icon-circle-close'
      }
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
              灰色：未删除  <br />
              红色：已删除
            </div>
            <svg-icon icon-class='perfect-icon-question1_btn' style='margin-left: 5px' />
          </el-tooltip>
        </span>
      )
    },
    // 排序上
    handleSortUp (scope, index) {
      // loading
      this.settings.loading = true
      const data = scope.row
      sortUpApi(data).then((_data) => {
        // this.dataJson.listData.unshift(_data.data)
        // this.$notify({
        //   title: '新增处理成功',
        //   message: _data.message,
        //   type: 'success',
        //   duration: this.settings.duration
        // })
        this.getDataList()
      }, (_error) => {
        this.$notify({
          title: '更新处理失败',
          message: _error.message,
          type: 'error',
          duration: this.settings.duration
        })
      }).finally(() => {
        // this.popSettingsData.dialogFormVisible = false
        this.settings.loading = false
      })
      // 1：位置互换，数组对象中
      // const index1 = index
      // const index2 = index - 1
      // this.dataJson.listData.splice(index2, 1, ...this.dataJson.listData.splice(index1, 1, this.dataJson.listData[index2]))
      // 2：计算sort
      // this.doReIndexSort(scope.row.dict_type_id)
      // 3：提交更新
      // this.doSortUpdate(this.getSortedDataList(scope.row.dict_type_id))
    },
    // 排序下
    handleSortDown (scope, index) {
      // loading
      this.settings.loading = true
      this.settings.loading = true
      const data = scope.row
      sortDownApi(data).then((_data) => {
        // this.dataJson.listData.unshift(_data.data)
        // this.$notify({
        //   title: '新增处理成功',
        //   message: _data.message,
        //   type: 'success',
        //   duration: this.settings.duration
        // })
        this.getDataList()
      }, (_error) => {
        this.$notify({
          title: '更新处理失败',
          message: _error.message,
          type: 'error',
          duration: this.settings.duration
        })
      }).finally(() => {
        // this.popSettingsData.dialogFormVisible = false
        this.settings.loading = false
      })

      // 1：位置互换，数组对象中
      // const index1 = index
      // const index2 = index + 1
      // this.dataJson.listData.splice(index2, 1, ...this.dataJson.listData.splice(index1, 1, this.dataJson.listData[index2]))
      // 2：计算sort
      // this.doReIndexSort(scope.row.dict_type_id)
      // 3：提交更新
      // this.doSortUpdate(this.getSortedDataList(scope.row.dict_type_id), scope.row.dict_type_id)
    },
    // sort重新计算
    doReIndexSort (dict_type_id) {
      this.dataJson.listData.forEach(function (item, index, arr) {
        if (item.dict_type_id === dict_type_id) {
          // 开始排序
          item.sort = index
        }
      })
    },
    // sort重新计算
    getSortedDataList (dict_type_id) {
      const rtnList = []
      this.dataJson.listData.forEach(function (item, index, arr) {
        if (item.dict_type_id === dict_type_id) {
          rtnList.push(item)
        }
      })
      return rtnList
    },
    // 更新逻辑
    doSortUpdate (listData, dict_type_id) {
      saveListApi(listData).then((_data) => {
        this.$notify({
          title: '更新处理成功',
          message: _data.message,
          type: 'success',
          duration: this.settings.duration
        })
        // 返回替换json
        this.doUpdateSortJson(_data.data, dict_type_id)
        // loading
      }, (_error) => {
        this.$notify({
          title: '更新处理失败',
          message: _error.message,
          type: 'error',
          duration: this.settings.duration
        })
        this.popSettingsData.dialogFormVisible = false
      }).finally(() => {
        this.settings.loading = false
      })
    },
    // 更新完毕后，把最新的数据更新回去
    doUpdateSortJson (updatedData, dict_type_id) {
      let startIndex = 0
      this.dataJson.listData.forEach(function (item, index, arr) {
        if (item.dict_type_id === dict_type_id) {
          // 位置互换，数组对象中
          const index1 = index
          const index2 = startIndex
          arr.splice(index1, 1, ...updatedData.splice(index1, 1, updatedData[index2]))
          startIndex++
        }
      })
    },
    closeEvent () {
    }
  }
}
</script>
