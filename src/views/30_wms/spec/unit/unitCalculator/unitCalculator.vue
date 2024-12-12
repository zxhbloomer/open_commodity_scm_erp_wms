<template>
  <div>
    <!-- pop窗口 数据编辑:新增、修改 -->
    <el-dialog
      v-if="listenVisible"
      v-el-drag-dialog
      v-loading="settings.loading"
      element-loading-text="拼命加载中，请稍后..."
      element-loading-background="rgba(255, 255, 255, 0.7)"
      :title="PARAMETERS.STATUS_TEXT_MAP[dialogStatus]"
      :visible="visible"
      :close-on-click-modal="PARAMETERS.DIALOG_CLOSE_BY_CLICK"
      :close-on-press-escape="PARAMETERS.DIALOG_CLOSE_BY_ESC"
      :show-close="PARAMETERS.DIALOG_SHOW_CLOSE"
      :append-to-body="true"
      :modal-append-to-body="true"
      width="650px"
      destroy-on-close
    >
      <el-form
        ref="dataSubmitForm"
        :rules="settings.rules"
        :model="dataJson.tempJson"
        label-position="right"
        label-width="150px"
        status-icon
      >

        <el-button-group>
          <el-button
            type="primary"
            icon="el-icon-circle-plus-outline"
            :loading="settings.loading"
            @click="handleCalcInsert"
          >新增</el-button>
          <el-button
            type="primary"
            icon="el-icon-circle-plus-outline"
            :loading="settings.loading"
            :disabled="settings.btnDisabledStatus.disabledEdit"
            @click="handleCalcUpdate"
          >编辑</el-button>
          <el-button
            type="primary"
            icon="el-icon-close"
            :loading="settings.loading"
            :disabled="settings.btnDisabledStatus.disabledEdit"
            @click="handleDelete"
          >删除</el-button>
        </el-button-group>
        <div style="margin-bottom: 18px;" />
        <el-table
          ref="multipleTable"
          v-loading="settings.loading"
          :data="dataJson.unitListData"
          :element-loading-text="'正在拼命加载中...'"
          element-loading-background="rgba(255, 255, 255, 0.5)"
          :height="settings.tableHeight"
          stripe
          border
          fit
          highlight-current-row
          :default-sort="{prop: 'u_time', order: 'descending'}"
          style="width: 100%"
          @current-change="handleCurrentChange"
        >
          <el-table-column
            type="index"
            width="45"
            label="No"
          />
          <el-table-column
            min-width="250"
            prop="content"
            label="库存单位关系"
          />
        </el-table>

      </el-form>
      <div
        slot="footer"
        class="dialog-footer"
      >
        <el-divider />
        <el-button
          plain
          :disabled="settings.loading"
          @click="handleCancel()"
        >关闭</el-button>
      </div>
    </el-dialog>

    <calculator-edit-dialog
      v-if="popSettingsData.calculatorEditDialog.visible"
      :id="id"
      :visible="popSettingsData.calculatorEditDialog.visible"
      :dialog-status="popSettingsData.calculatorEditDialog.dialogStatus"
      :data="dataJson.currentJson"
      :app-code="appCode"
      @closeMeOk="handleCloseDialogCalcOk"
      @closeMeUpdateOk="handleCloseUpdateDialogConvertOk"
      @closeMeCancel="handleCloseDialogConvertCancel"
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
</style>
<style >
.el-input-group__append_select,
.el-input-group__append {
  color: #ffffff;
  background-color: #1890ff;
  border-color: #1890ff;
}
</style>

<script>
import constants_para from '@/common/constants/constants_para'
import elDragDialog from '@/directive/el-drag-dialog'
import deepCopy from 'deep-copy'
import calculatorEditDialog from '@/views/30_wms/spec/unit/unitCalculator/dialog/unitCalculatorEdit'
import { getListApi, deleteApi } from '@/api/30_wms/spec/unit/unitCalc'

export default {
  name: 'UnitCalculator',
  components: { calculatorEditDialog },
  directives: { elDragDialog },
  mixins: [],
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    id: {
      type: Number,
      default: null
    },
    data: {
      type: Object,
      default: null
    },
    dialogStatus: {
      type: String,
      default: constants_para.STATUS_VIEW
    },
    // unitId: {
    //   type: Number,
    //   default: null
    // },
    appCode: {
      type: String,
      default: '00'
    }
  },
  data () {
    return {
      // 监听器
      watch: {
        unwatch_tempJson: null
      },
      disabledEdit: true,
      popSettingsData: {
        // 弹出窗口状态名称
        dialogStatus: '',
        dialogFormVisible: false,
        btnDisabledStatus: {
          disabledOK: false
        },
        // 弹出的商品查询框参数设置
        calculatorEditDialog: {
          // 弹出框显示参数
          visible: false,
          data: null,
          dialogStatus: this.PARAMETERS.STATUS_INSERT,
          // 点击确定以后返回的值
          selectedDataJson: {
            id: null
          }
        }
      },
      dataJson: {
        unitListData: [],
        listData: [],
        // 单条数据 json的，初始化原始数据
        tempJsonOriginal: {
          id: undefined
        },
        // 单条数据 json
        tempJson: {
          unitList: []
        }

      },
      // 页面设置json
      settings: {
        // loading 状态
        loading: true,
        // 按钮是否显示，默认不显示，false：不显示，true：显示
        btnShowStatus: {
          showInsert: false,
          showUpdate: false
        },
        // 按钮状态：是否可用，false:可用，true不可用
        btnDisabledStatus: {
          disabledInsert: true,
          disabledUpdate: true,
          disabledEdit: true
        },
        // 以下为pop的内容：数据弹出框
        selection: [],
        dialogStatus: this.dialogStatus

      }
    }
  },
  computed: {
    // 是否为更新模式
    isUpdateModel () {
      if (
        this.settings.dialogStatus === this.PARAMETERS.STATUS_INSERT ||
        this.settings.dialogStatus === this.PARAMETERS.STATUS_COPY_INSERT
      ) {
        return false
      } else {
        return true
      }
    },
    listenVisible () {
      return this.visible
    },
    isViewModel () {
      if (this.settings.dialogStatus === this.PARAMETERS.STATUS_VIEW) {
        return true
      } else {
        return false
      }
    }
  },
  // 监听器
  watch: {},
  created () {
    this.init()
  },
  mounted () {
    // 描绘完成
  },
  destroyed () {
    this.unWatch()
  },
  methods: {
    // 初始化处理
    init () {
      this.initButtonShowStatus()
      this.initButtonDisabledStatus()
      this.getUnitConvertComboData()
      switch (this.dialogStatus) {
        case this.PARAMETERS.STATUS_INSERT:
          this.initInsertModel()
          break
        case this.PARAMETERS.STATUS_UPDATE:
          this.initUpdateModel()
          break
        case this.PARAMETERS.STATUS_VIEW:
          this.initViewModel()
          break
      }
      // 初始化watch
      this.setWatch()
      this.settings.loading = false
    },
    initTempJsonOriginal () {
      // 单条数据 json的，初始化原始数据
      this.dataJson.tempJsonOriginal = this.$options.data.call(
        this
      ).dataJson.tempJsonOriginal
    },
    initButtonShowStatus () {
      // 初始化按钮状态：默认都隐藏
      this.settings.btnShowStatus = this.$options.data.call(
        this
      ).settings.btnShowStatus
    },
    initButtonDisabledStatus () {
      // 按钮状态初始化：默认不可用
      this.settings.btnDisabledStatus = this.$options.data.call(
        this
      ).settings.btnDisabledStatus
    },
    // 新增时的初始化
    initInsertModel () {
      // 数据初始化
      this.initTempJsonOriginal()
      this.dataJson.tempJson = deepCopy(this.dataJson.tempJsonOriginal)
      // 设置按钮
      this.settings.btnShowStatus.showInsert = true
    },
    // 修改时的初始化
    initUpdateModel () {
      // 数据初始化
      // 设置按钮
      this.settings.btnShowStatus.showUpdate = true
    },
    // 查看时的初始化
    initViewModel () {
      // 数据初始化
      this.dataJson.tempJson = deepCopy(this.data)
    },
    // 设置监听器
    setWatch () {
      this.unWatch()
      // 监听页面上面是否有修改，有修改按钮高亮
      this.watch.unwatch_tempJson = this.$watch(
        'dataJson.tempJson',
        (newVal, oldVal) => {
          this.settings.btnDisabledStatus.disabledInsert = false
          this.settings.btnDisabledStatus.disabledUpdate = false
        },
        { deep: true }
      )
    },
    unWatch () {
      if (this.watch.unwatch_tempJson) {
        this.watch.unwatch_tempJson()
      }
    },
    // 取消按钮
    handleCancel () {
      this.$emit('closeMeCancel')
    },
    // 点击新增单位换算
    handleCalcInsert () {
      // 新增
      this.popSettingsData.calculatorEditDialog.visible = true
      this.popSettingsData.calculatorEditDialog.dialogStatus = this.PARAMETERS.STATUS_INSERT
    },
    // 点击修改单位换算
    handleCalcUpdate () {
      // 新增
      this.popSettingsData.calculatorEditDialog.visible = true
      this.popSettingsData.calculatorEditDialog.dialogStatus = this.PARAMETERS.STATUS_UPDATE
    },
    // 点击清空单位换算
    handleDelete () {
      // 选择全部的时候
      this.$confirm('是否要删除选择的单位转换关系？', '确认信息', {
        distinguishCancelAndClose: true,
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(() => {
        this.doDelete()
      }).catch(action => {
        // 右上角X
        this.settings.loading = false
      })
    },
    // 删除数据
    doDelete () {
      // loading
      this.settings.loading = true
      deleteApi({ 'id': this.dataJson.currentJson.id }).then((_data) => {
        this.$notify({
          title: '更新处理成功',
          message: _data.message,
          type: 'success',
          duration: this.settings.duration
        })
        // 删除
        this.dataJson.unitListData.splice(this.dataJson.currentJson.index, 1)
        this.dataJson.tempJson.unitList = this.dataJson.unitListData
      }, (_error) => {
        this.$notify({
          title: '更新处理失败',
          message: _error.message,
          type: 'error',
          duration: this.settings.duration
        })
      }).finally(() => {
        this.settings.loading = false
      })
    },
    handleCloseDialogConvertCancel () {
      this.popSettingsData.calculatorEditDialog.visible = false
    },
    handleCloseDialogCalcOk (val) {
      switch (this.popSettingsData.calculatorEditDialog.dialogStatus) {
        case this.PARAMETERS.STATUS_INSERT:
          this.doInsertModelCallBack(val)
          break
        case this.PARAMETERS.STATUS_UPDATE:
          this.doUpdateModelCallBack(val)
          break
      }
    },
    // 处理插入回调
    doInsertModelCallBack (val) {
      if (val.return_flag) {
        this.dataJson.unitListData.push(val.data.data)
        this.dataJson.tempJson.unitList = this.dataJson.unitListData
        this.popSettingsData.calculatorEditDialog.visible = false

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
        this.popSettingsData.calculatorEditDialog.visible = false

        // 设置到table中绑定的json数据源
        this.dataJson.unitListData.splice(this.dataJson.rowIndex, 1, val.data.data)
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
    handleCloseUpdateDialogConvertOk (val) {
      this.dataJson.unitListData.splice(this.dataJson.index, 1, val.data)
      this.dataJson.tempJson.unitList = this.dataJson.unitListData
      this.popSettingsData.calculatorEditDialog.visible = false
    },
    getUnitConvertComboData () {
      getListApi({ 'sku_id': this.id }).then((_data) => {
        this.dataJson.unitListData = _data.data
        this.settings.loading = false
      }, (_error) => {
      })
    },
    handleCurrentChange (row) {
      this.dataJson.currentJson = Object.assign({}, row) // copy obj
      this.dataJson.currentJson.index = this.getRowIndex(row)
      this.settings.btnDisabledStatus.disabledEdit = false
    },
    // 获取行索引
    getRowIndex (row) {
      const _index = this.dataJson.unitListData.lastIndexOf(row)
      return _index
    }
  }
}
</script>
