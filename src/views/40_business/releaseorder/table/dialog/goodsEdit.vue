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
      width="850px"
      destroy-on-close
    >
      <el-form
        ref="dataSubmitForm"
        :rules="settings.rules"
        :model="dataJson.tempJson"
        label-position="right"
        label-width="0px"
        status-icon
      >
        <br>
        <el-descriptions
          title=""
          :column="2"
          :label-style="labelStyle"
          :content-style="contentStyle"
          direction="horizontal"
          border
        >
          <el-descriptions-item>
            <div
              slot="label"
              class="required-mark"
            >
              商品编号
            </div>
            <el-form-item prop="commodity_code">
              <input-search
                v-model.trim="dataJson.tempJson.commodity_code"
                @onInputSearch="handleSpecDialog"
              />
            </el-form-item>
          </el-descriptions-item>
          <el-descriptions-item label="商品名称">
            {{ dataJson.tempJson.commodity_name }}
          </el-descriptions-item>
          <el-descriptions-item label="商品规格">
            {{ dataJson.tempJson.commodity_spec }}
          </el-descriptions-item>
          <el-descriptions-item label="商品规格编号">
            {{ dataJson.tempJson.commodity_spec_code }}
          </el-descriptions-item>
          <el-descriptions-item label="商品别称">
            {{ dataJson.tempJson.commodity_nickname }}
          </el-descriptions-item>
          <el-descriptions-item label="型规">
            {{ dataJson.tempJson.type_gauge }}
          </el-descriptions-item>
          <el-descriptions-item>
            <div
              slot="label"
              class="required-mark"
            >
              放货数量
            </div>
            <el-form-item prop="qty">
              <numeric
                v-model="dataJson.tempJson.qty"
                :decimal-places="0"
                :currency-symbol="''"
              />
            </el-form-item>
          </el-descriptions-item>
          <el-descriptions-item>
            <div
              slot="label"
              class="required-mark"
            >
              单价
            </div>
            <el-form-item prop="price">
              <numeric
                v-model="dataJson.tempJson.price"
                :decimal-places="0"
                :currency-symbol="'¥'"
              />
            </el-form-item>
          </el-descriptions-item>
          <el-descriptions-item>
            <div
              slot="label"
              class="required-mark"
            >
              金额
            </div>
            <el-form-item prop="amount">
              <numeric
                v-model="dataJson.tempJson.amount"
                :decimal-places="0"
                :currency-symbol="'¥'"
              />
            </el-form-item>
          </el-descriptions-item>
          <el-descriptions-item>
            <div
              slot="label"
              class="required-mark"
            >
              单位
            </div>
            <select-unit
              ref="ref_select_unit"
              v-model.trim="dataJson.tempJson.unit_id"
              :sku-id="dataJson.tempJson.sku_id"
              @change="handleUnitChange"
            />
          </el-descriptions-item>
          <el-descriptions-item>
            <div
              slot="label"
              class="required-mark"
            >
              仓库
            </div>
            <el-form-item
              prop="warehouse_name"
              label-width="0"
            >
              <Select-Warehouse-Location-Bin
                v-model.trim="dataJson.tempJson.warehouse_name"
                :reset="dataJson.searchForm.reset"
                :warehouse1="dataJson.tempJson.warehouse_id"
                placement="left"
                @closeParentDialog="handleWLBDialogClose"
                @onReturnData="handleWLBReturnData"
              />
            </el-form-item>
          </el-descriptions-item>
          <el-descriptions-item label="备注">
            <el-form-item
              prop="remark"
            >
              <el-input
                v-model.trim="dataJson.tempJson.remark"
                clearable
                placeholder="备注"
              />
            </el-form-item>
          </el-descriptions-item>

        </el-descriptions>

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
        >取消</el-button>
        <el-button
          v-show="settings.btnShowStatus.showInsert"
          plain
          type="primary"
          :disabled="settings.loading || settings.btnDisabledStatus.disabledInsert "
          @click="doInsert()"
        >确定</el-button>
        <el-button
          v-show="settings.btnShowStatus.showUpdate && !isViewModel"
          plain
          type="primary"
          :disabled="settings.loading || settings.btnDisabledStatus.disabledUpdate "
          @click="doUpdate()"
        >确定</el-button>
      </div>
    </el-dialog>

    <spec-dialog
      v-if="popSettingsData.specDialog.visible"
      :visible="popSettingsData.specDialog.visible"
      @closeMeOk="handleSpecCloseOk"
      @closeMeCancel="handleSpecCloseCancel"
    />
  </div>

</template>

<style scoped>
.slotColor
/deep/.el-input-group__append, .el-input-group__prepend {
  background-color: #f5f7fa;
  color: #909399;
  vertical-align: middle;
  display: table-cell;
  position: relative;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  padding: 0 20px;
  width: 1px;
  white-space: nowrap;
}
.edit-container {
  height: calc(100vh - 160px);
  overflow-x: auto;
}
.dialog-footer {
  text-align: center;
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
.el-input-group__append_select,
.el-input-group__append {
  color: #ffffff;
  background-color: #1890ff;
  border-color: #1890ff;
}
.el-form-item--mini.el-form-item {
  margin-bottom: 0px;
}
.required-mark::before {
  content: '*';
  color: #ff4949;
  margin-right: 4px;
}
</style>

<script>
import specDialog from '@/views/30_wms/spec/dialog/dialog'
import constants_para from '@/common/constants/constants_para'
import InputSearch from '@/components/40_input/inputSearch'
import elDragDialog from '@/directive/el-drag-dialog'
import deepCopy from 'deep-copy'
import selectUnit from '@/views/30_wms/spec/unit/selectUnit/selectUnit'
import numeric from '@/components/40_input/numeric'
import SelectWarehouseLocationBin from '@/views/30_wms/warehouse/selectgrid/selectWarehouseLocationBin.vue'
import { isNotEmpty } from '@/utils'

export default {
  components: { SelectWarehouseLocationBin, InputSearch, specDialog, selectUnit, numeric },
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
    }
  },
  data () {
    return {
      contentStyle: {
        width: '15%'
      },
      labelStyle: {
        width: '10%',
        'text-align': 'right'
      },
      // 监听器
      watch: {
        unwatch_tempJson: null
      },
      popSettingsData: {
        // 弹出窗口状态名称
        dialogStatus: '',
        textMap: {
          update: '请选择要修改结点的类型',
          insert: '请选择添加下级结点类型'
        },
        specDialog: {
          // 弹出框显示参数
          visible: false,
          data: null,
          // 点击确定以后返回的值
          selectedDataJson: {
            id: null
          }
        },
        dialogFormVisible: false,
        btnDisabledStatus: {
          disabledOK: false
        },
        // 弹出的查询框参数设置
        searchDialogDataOne: {
          // 弹出框显示参数
          visible: false,
          // 点击确定以后返回的值
          selectedDataJson: {
            id: null
          }
        }
      },
      dataJson: {
        searchForm: {
          pageCondition: {}
        },
        // 单条数据 json的，初始化原始数据
        tempJsonOriginal: {
          amount: 0,
          commodity_code: null
        },
        // 单条数据 json
        tempJson: {
          amount: 0,
          commodity_code: null
        },
        inputSettings: {
          maxLength: {
            name: 20,
            code: 20
          }
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
          disabledUpdate: true
        },
        // 以下为pop的内容：数据弹出框
        selection: [],
        dialogStatus: this.dialogStatus,
        // pop的check内容
        rules: {
          commodity_code: [
            { required: true, message: '请选择物料', trigger: 'change' }
          ],
          unit_id: [
            { required: true, message: '请选择单位', trigger: 'change' }
          ],
          num: [
            { required: true, message: '请输入合同数量', trigger: 'change' },
            { validator: this.contract_qty_validator, trigger: 'blur' }
          ],
          price: [
            { required: true, message: '请输入合同价格', trigger: 'change' },
            { validator: this.contract_price_validator, trigger: 'blur' }
          ],
          qty: [
            { required: true, message: '请输入放货数量', trigger: 'change' },
            { validator: this.qty_validator, trigger: 'change' }
          ],
          warehouse_name: [
            { required: true, message: '请选择仓库', trigger: 'change' }
          ]
        },
        // 错误数目
        badge: {
          countOne: 0,
          countTwo: 0
        }
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
      // 控件focus
      // this.$nextTick(() => {
      //   this.$refs['refFocusOne'].focus()
      // })
    },
    // Placeholder设置
    isPlaceholderShow (val) {
      if (this.isViewModel) {
        return ''
      } else {
        return val
      }
    },
    // 修改时的初始化
    initUpdateModel () {
      // 数据初始化
      this.dataJson.tempJson = deepCopy(this.data)
      this.dataJson.tempJsonOriginal = deepCopy(this.data)
      // 设置按钮
      this.settings.btnShowStatus.showUpdate = true
      // 控件focus
      // this.$nextTick(() => {
      //   this.$refs['refFocusOne'].focus()
      // })
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
          if (!isNaN(this.dataJson.tempJson.num * this.dataJson.tempJson.price)) {
            this.dataJson.tempJson.amount = this.dataJson.tempJson.num * this.dataJson.tempJson.price
          }
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
    // 插入逻辑
    doInsert () {
      this.$refs['dataSubmitForm'].validate(valid => {
        if (valid) {
          const tempData = deepCopy(this.dataJson.tempJson)
          this.settings.loading = true
          this.$emit('closeMeOk', { return_flag: true, data: tempData, edit_status: this.dialogStatus })
        }
      })
    },
    // 更新逻辑
    doUpdate () {
      this.$refs['dataSubmitForm'].validate(valid => {
        if (valid) {
          const tempData = deepCopy(this.dataJson.tempJson)
          this.settings.loading = true
          this.$emit('closeMeOk', { return_flag: true, data: tempData, edit_status: this.dialogStatus })
        }
      })
    },

    handleSpecDialog () {
      this.popSettingsData.specDialog.visible = true
    },
    // 规格：关闭对话框：确定
    handleSpecCloseOk (val) {
      this.popSettingsData.specDialog.selectedDataJson = val
      this.dataJson.tempJson.commodity_code = val.goods_code
      this.dataJson.tempJson.commodity_name = val.goods_name
      this.dataJson.tempJson.commodity_spec = val.spec
      this.dataJson.tempJson.commodity_spec_code = val.sku_code
      this.dataJson.tempJson.unit_id = val.unit_id
      this.dataJson.tempJson.sku_id = val.id
      this.popSettingsData.specDialog.visible = false
    },
    // 规格：关闭对话框：取消
    handleSpecCloseCancel () {
      this.popSettingsData.specDialog.visible = false
    },
    handleUnitChange (val) {
      if (val !== undefined) {
        this.dataJson.tempJson.unit_id = val.src_unit_id
        this.dataJson.tempJson.unit_name = val.src_unit
        this.dataJson.tempJson.unit_code = val.src_unit_code
        this.dataJson.tempJson.unitData = deepCopy(val)
      }
    },

    /**
     * 合同数量check
     */
    contract_qty_validator (rule, value, callback) {
      if (value <= 0) {
        callback(new Error('请输入合同数量'))
      } else {
        callback()
      }
    },
    /**
     * 合同价格check
     */
    contract_price_validator (rule, value, callback) {
      if (value <= 0) {
        callback(new Error('请输入合同价格'))
      } else {
        callback()
      }
    },
    /**
     * 税率check
     */
    rate_validator (rule, value, callback) {
      if (isNaN(value)) {
        callback(new Error('请输入数字'))
      } else {
        callback()
      }
      if (value <= 0) {
        callback(new Error('请输入税率'))
      } else {
        callback()
      }
    },
    handleWLBDialogClose () {
      this.settings.visible = false
    },
    handleWLBReturnData (val) {
      if (!isNotEmpty(val)) {
        this.dataJson.tempJson.warehouse_id = undefined
        this.dataJson.tempJson.warehouse_name = undefined
      } else {
        // 仓库
        this.dataJson.tempJson.warehouse_id = val.warehouse_id
        this.dataJson.tempJson.warehouse_name = val.warehouse_name
        this.dataJson.tempJson.warehouse_code = val.warehouse_code
      }
    },
    // 放货数量校验
    qty_validator (rule, value, callback) {
      if (this.dataJson.tempJson.qty === undefined || this.dataJson.tempJson.qty === null || this.dataJson.tempJson.qty <= 0) {
        callback(new Error('请输入放货数量'))
      } else {
        callback()
      }
    }
  }
}
</script>
