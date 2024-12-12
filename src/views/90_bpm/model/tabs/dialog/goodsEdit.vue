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
      width="1350px"
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
        <el-alert
          title="商品信息"
          type="info"
          :closable="false"
        />
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
              物料编码
            </div>
            <el-form-item prop="spec_code">

              <input-search
                v-model.trim="dataJson.tempJson.spec_code"
                :disabled="isUpdateModel && isViewModel"
                @onInputSearch="handleSpecDialog"
              />
            </el-form-item>
          </el-descriptions-item>
          <el-descriptions-item label="物料名称">
            <el-form-item prop="goods_name">
              <el-input
                v-model.trim="dataJson.tempJson.goods_name"
                clearable
                disabled
                show-word-limit
              />
            </el-form-item>
          </el-descriptions-item>
          <el-descriptions-item label="品名">
            <el-form-item prop="pm">
              <el-input
                v-model.trim="dataJson.tempJson.pm"
                clearable
                show-word-limit
                disabled
              />
            </el-form-item>
          </el-descriptions-item>
          <el-descriptions-item label="规格">
            <el-form-item prop="spec">
              <el-input
                v-model.trim="dataJson.tempJson.spec"
                clearable
                show-word-limit
                disabled
              />
            </el-form-item>
          </el-descriptions-item>
        </el-descriptions>
        <br>
        <el-alert
          title="仓库信息"
          type="info"
          :closable="false"
        />
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
              仓库
            </div>
            <el-form-item prop="warehouse_name">
              <select-warehouse
                v-model.trim="dataJson.tempJson.warehouse_name"
                placement="left"
                :warehouse1="dataJson.tempJson.warehouse_id"
                @closeParentDialog="handleDialogClose"
                @onReturnData="handleWarehouseReturnData"
              />
            </el-form-item>
          </el-descriptions-item>
          <el-descriptions-item label="库存量">
            <el-form-item prop="qty">
              <numeric
                v-model="dataJson.tempJson.qty"
                :decimal-places="4"
                :currency-symbol="''"
                disabled
              />
            </el-form-item>
          </el-descriptions-item>
          <el-descriptions-item label="移动平均单价">
            <el-form-item prop="price">
              <numeric
                v-model="dataJson.tempJson.price"
                :decimal-places="2"
                :currency-symbol="''"
                disabled
              />
            </el-form-item>
          </el-descriptions-item>
          <el-descriptions-item label="货值">
            <el-form-item prop="amount">
              <numeric
                v-model="dataJson.tempJson.amount"
                :decimal-places="2"
                :currency-symbol="''"
                disabled
              />
            </el-form-item>
          </el-descriptions-item>
        </el-descriptions>
        <el-alert
          title="调整信息"
          type="info"
          :closable="false"
        />
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
              调整量
            </div>
            <el-form-item prop="qty_adjust">
              <numeric
                v-model="dataJson.tempJson.qty_adjust"
                :decimal-places="4"
                :currency-symbol="''"
              />
            </el-form-item>
          </el-descriptions-item>
          <el-descriptions-item>
            <div
              slot="label"
              class="required-mark"
            >
              调整规则
            </div>
            <el-form-item prop="adjusted_rule">
              <!-- <select-dict
                v-model="dataJson.tempJson.adjusted_rule"
                :value="dataJson.tempJson.type"
                :para="CONSTANTS.DICT_B_ADJUST_RULE"
                init-placeholder="请选择"
                :disabled="isViewModel"
                style="width:100%"
              /> -->
              <radio-dict
                v-model="dataJson.tempJson.adjusted_rule"
                :para="CONSTANTS.DICT_B_ADJUST_RULE"
                :disabled="isViewModel"
                @change="handleRuleDictChange"
              />
            </el-form-item>
          </el-descriptions-item>
          <el-descriptions-item>
            <div
              slot="label"
              class="required-mark"
            >
              调整后移动平均单价
            </div>
            <el-form-item prop="adjusted_price">
              <numeric
                v-model="dataJson.tempJson.adjusted_price"
                :decimal-places="2"
                :disabled="!settings.canEditPrice"
              />
            </el-form-item>
          </el-descriptions-item>
          <el-descriptions-item label="调整后货值">
            <el-form-item prop="adjusted_amount">
              <numeric
                v-model="dataJson.tempJson.adjusted_amount"
                :decimal-places="2"
                disabled
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
          v-show="settings.btnShowStatus.showUpdate"
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
.required-mark::before {
  content: '*';
  color: #ff4949;
  margin-right: 4px;
}
.el-form-item--mini.el-form-item {
  margin-bottom: 0px;
}
</style>

<script>
import constants_para from '@/common/constants/constants_para'
import elDragDialog from '@/directive/el-drag-dialog'
import deepCopy from 'deep-copy'
import numeric from '@/components/40_input/numeric'
import specDialog from '@/views/30_wms/spec/dialog/dialog'
import InputSearch from '@/components/40_input/inputSearch'
import { getInventoryApi } from '@/api/40_business/inventory/inventory'
import SelectWarehouse from '@/views/30_wms/warehouse/selectgrid/selectWarehouseLocationBin'
import RadioDict from '@/components/00_dict/redio'

export default {
  components: { InputSearch, specDialog, numeric, SelectWarehouse, RadioDict },
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
      default: constants_para.STATUS_INSERT
    }
  },
  data () {
    return {
      contentStyle: {
        width: '15%'
      },
      labelStyle: {
        width: '5%',
        'text-align': 'right'
      },
      // 监听器
      watch: {
        unwatch_tempJson: null
      },

      popSettingsData: {
        // 规格弹出框
        specDialog: {
          // 弹出框显示参数
          visible: false,
          data: null,
          // 点击确定以后返回的值
          selectedDataJson: {
            id: null
          }
        },
        // 弹出的仓库查询框参数设置
        searchDialogDataOne: {
          // 弹出框显示参数
          visible: false,
          data: null,
          // 点击确定以后返回的值
          selectedDataJson: {
            id: null
          }
        },
        // 弹出窗口状态名称
        dialogStatus: '',
        textMap: {
          update: '请选择要修改结点的类型',
          insert: '请选择添加下级结点类型'
        },
        dialogFormVisible: false,
        btnDisabledStatus: {
          disabledOK: false
        },
        // 弹出的库区查询框参数设置
        searchDialogDataTwo: {
          // 弹出框显示参数
          visible: false,
          data: null,
          // 点击确定以后返回的值
          selectedDataJson: {
            id: null
          }
        },
        // 弹出的库位查询框参数设置
        searchDialogDataThree: {
          // 弹出框显示参数
          visible: false,
          data: null,
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
          warehouse_name: '',
          spec_code: '',
          adjusted_rule: '2',
          adjusted_price: 0,
          adjusted_amount: 0,
          qty_adjust: 0
        },
        // 单条数据 json
        tempJson: {
          warehouse_name: '',
          spec_code: '',
          adjusted_rule: '2',
          adjusted_price: 0,
          adjusted_amount: 0,
          qty_adjust: 0
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
        // 是否可编辑单价
        canEditPrice: true,
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
          spec_code: [
            { required: true, message: '请选择物料', trigger: 'change' }
          ],
          count: [
            { required: true, message: '请输入入库数量', trigger: 'change' },
            { validator: this.checkCount, trigger: 'blur' }
          ],
          qty_adjust: [
            { required: true, message: '请选择调整量', trigger: 'change' }
          ],
          adjusted_rule: [
            { required: true, message: '请选择调整规则', trigger: 'change' }
          ],
          adjusted_price: [
            { required: true, message: '请输入调整平均单价', trigger: 'change' }
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
      this.dataJson.tempJson.unit = '吨'
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
      this.dataJson.searchForm.sku_id = this.dataJson.tempJson.sku_id
      this.dataJson.tempJsonOriginal = deepCopy(this.data)
      this.popSettingsData.searchDialogDataOne.selectedDataJson.id = this.data.business_id
      this.popSettingsData.searchDialogDataTwo.selectedDataJson.id = this.data.industry_id
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
      var _this = this
      // 监听页面上面是否有修改，有修改按钮高亮
      _this.watch.unwatch_tempJson = _this.$watch(
        'dataJson.tempJson',
        (newVal, oldVal) => {
          _this.settings.btnDisabledStatus.disabledInsert = false
          _this.settings.btnDisabledStatus.disabledUpdate = false
        },
        { deep: true }
      )

      // 监听库存调整规则
      _this.watch.unwatch_tempJson_rule = _this.$watch(
        'dataJson.tempJson.adjusted_rule',
        (newVal, oldVal) => {
          if (newVal === '1') {
            // 货值不变 重新计算单价 单价不可输入
            _this.settings.canEditPrice = false
            _this.dataJson.tempJson.adjusted_amount = _this.dataJson.tempJson.amount
            _this.dataJson.tempJson.adjusted_price = _this.dataJson.tempJson.adjusted_amount / _this.dataJson.tempJson.qty_adjust
          } else if (newVal === '2') {
            // 调整货值 可输入单价
            _this.settings.canEditPrice = true
            _this.dataJson.tempJson.adjusted_amount = _this.dataJson.tempJson.adjusted_price * _this.dataJson.tempJson.qty_adjust
          } else if (newVal === '3') {
            // 调整货值 不可输入单价
            _this.settings.canEditPrice = false
            _this.dataJson.tempJson.adjusted_amount = _this.dataJson.tempJson.adjusted_price * _this.dataJson.tempJson.qty_adjust
          }
        },
        { deep: true }
      )

      // 监听库存调整量
      _this.watch.unwatch_tempJson_qty = _this.$watch(
        'dataJson.tempJson.qty_adjust',
        (newVal, oldVal) => {
          if (_this.dataJson.tempJson.adjusted_rule === '1') {
            // 货值不变 重新计算单价 单价不可输入
            _this.dataJson.tempJson.adjusted_amount = _this.dataJson.tempJson.amount
            _this.dataJson.tempJson.adjusted_price = _this.dataJson.tempJson.adjusted_amount / _this.dataJson.tempJson.qty_adjust
            _this.dataJson.tempJson.adjusted_price = _this.dataJson.tempJson.adjusted_amount / _this.dataJson.tempJson.qty_adjust
          } else if (_this.dataJson.tempJson.adjusted_rule === '2') {
            // 调整货值 可输入单价
            _this.dataJson.tempJson.adjusted_amount = _this.dataJson.tempJson.adjusted_price * _this.dataJson.tempJson.qty_adjust
          } else if (_this.dataJson.tempJson.adjusted_rule === '3') {
            // 调整货值 可输入单价
            _this.dataJson.tempJson.adjusted_amount = _this.dataJson.tempJson.adjusted_price * _this.dataJson.tempJson.qty_adjust
          }
        },
        { deep: true }
      )

      // 监听库存调价格
      _this.watch.unwatch_tempJson_price = _this.$watch(
        'dataJson.tempJson.adjusted_price',
        (newVal, oldVal) => {
          if (_this.dataJson.tempJson.adjusted_rule === '1') {
            // 货值不变 重新计算单价 单价不可输入
            _this.dataJson.tempJson.adjusted_amount = _this.dataJson.tempJson.amount
            _this.dataJson.tempJson.adjusted_price = _this.dataJson.tempJson.adjusted_amount / _this.dataJson.tempJson.qty_adjust
          } else if (_this.dataJson.tempJson.adjusted_rule === '2') {
            // 调整货值 可输入单价
            _this.dataJson.tempJson.adjusted_amount = _this.dataJson.tempJson.adjusted_price * _this.dataJson.tempJson.qty_adjust
          } else if (_this.dataJson.tempJson.adjusted_rule === '3') {
            // 调整货值 可输入单价
            _this.dataJson.tempJson.adjusted_amount = _this.dataJson.tempJson.adjusted_price * _this.dataJson.tempJson.qty_adjust
          }
        },
        { deep: true }
      )
    },
    unWatch () {
      if (this.watch.unwatch_tempJson) {
        this.watch.unwatch_tempJson()
      }

      if (this.watch.unwatch_tempJson_rule) {
        this.watch.unwatch_tempJson_rule()
      }

      if (this.watch.unwatch_tempJson_qty) {
        this.watch.unwatch_tempJson_qty()
      }

      if (this.watch.unwatch_tempJson_price) {
        this.watch.unwatch_tempJson_price()
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
          // tempData.desc =
          this.settings.loading = true
          this.$emit('closeMeOk', { return_flag: true, data: tempData })
        }
      })
    },
    // 更新逻辑
    doUpdate () {
      this.$refs['dataSubmitForm'].validate(valid => {
        if (valid) {
          const tempData = deepCopy(this.dataJson.tempJson)
          // tempData.desc =
          this.settings.loading = true
          this.$emit('closeMeOk', { return_flag: true, data: tempData })
        }
      })
    },
    handleTabsClick (tab, event) { },
    // 规格数据选择
    handleSpecDialog () {
      this.popSettingsData.specDialog.visible = true
    },
    // 规格：关闭对话框：确定
    handleSpecCloseOk (val) {
      this.popSettingsData.specDialog.selectedDataJson = val
      this.dataJson.tempJson.spec_code = val.sku_code
      this.dataJson.tempJson.sku_id = val.id
      this.dataJson.tempJson.spec = val.spec
      this.dataJson.tempJson.pm = val.pm
      // this.dataJson.tempJson.qty = val.qty_avaible
      // this.dataJson.tempJson.warehouse_id = val.warehouse_id
      // this.dataJson.tempJson.bin_id = val.bin_id
      // this.dataJson.tempJson.location_id = val.location_id
      this.dataJson.tempJson.goods_name = val.goods_name
      // this.dataJson.tempJson.warehouse_name = val.warehouse_name
      // this.dataJson.tempJson.stock_id = val.id
      this.popSettingsData.specDialog.visible = false

      this.getInventory()
    },
    // 规格：关闭对话框：取消
    handleSpecCloseCancel () {
      this.popSettingsData.specDialog.visible = false
    },
    getInventory () {
      // 查询逻辑
      this.dataJson.tempJson.owner_id = this.data.owner_id
      if (this.dataJson.tempJson.sku_id != null && this.dataJson.tempJson.warehouse_id != null) {
        getInventoryApi(this.dataJson.tempJson).then(response => {
          if (response.data === null) {
            this.dataJson.tempJson.count_avaible = 0
            this.dataJson.tempJson.price = 0
            this.dataJson.tempJson.amount = 0
            this.dataJson.tempJson.qty = 0
          } else {
            this.dataJson.tempJson.qty = response.data.qty_avaible
            this.dataJson.tempJson.price = response.data.price
            this.dataJson.tempJson.amount = response.data.amount
            this.dataJson.tempJson.adjusted_price = response.data.price
            this.dataJson.tempJson.adjusted_amount = response.data.amount
          }
          this.$forceUpdate()
        }).finally(() => {
        })
      }
    },
    handleWarehouseReturnData (val) {
      if (val === null) {
        // 仓库
        this.dataJson.tempJson.warehouse_id = null
        this.dataJson.tempJson.warehouse_name = null

        // 库区
        this.dataJson.tempJson.location_id = null
        this.dataJson.tempJson.location_name = null

        // 库位
        this.dataJson.tempJson.bin_id = null
        this.dataJson.tempJson.bin_name = null
      } else {
        // 仓库
        this.dataJson.tempJson.warehouse_id = val.warehouse_id
        this.dataJson.tempJson.warehouse_name = val.warehouse_name

        // 库区
        this.dataJson.tempJson.location_id = val.location_id
        this.dataJson.tempJson.location_name = val.location_name

        // 库位
        this.dataJson.tempJson.bin_id = val.id
        this.dataJson.tempJson.bin_name = val.code

        this.getInventory()
      }
    },
    // 弹出框关闭
    handleDialogClose () {
      this.settings.visible = false
    },
    handleRuleDictChange (val) {
      this.dataJson.tempJson.adjusted_rule = val
    }
  }
}
</script>
