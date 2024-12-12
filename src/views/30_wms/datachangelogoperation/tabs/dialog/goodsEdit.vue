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
      width="1000px"
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
            {{ dataJson.tempJson.goods_name }}
          </el-descriptions-item>
          <el-descriptions-item label="品名">
            {{ dataJson.tempJson.pm }}
          </el-descriptions-item>
          <el-descriptions-item label="规格">
            {{ dataJson.tempJson.spec }}
          </el-descriptions-item>
          <el-descriptions-item>
            <div
              slot="label"
              class="required-mark"
            >
              入货仓库
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
          <el-descriptions-item>
            <div
              slot="label"
              class="required-mark"
            >
              入库单价
            </div>
            <el-form-item prop="price">
              <numeric
                v-model="dataJson.tempJson.price"
                :decimal-places="2"
              />
            </el-form-item>
          </el-descriptions-item>
          <el-descriptions-item>
            <div
              slot="label"
              class="required-mark"
            >
              入库单位
            </div>
            <el-form-item prop="unit_id">
              <select-unit
                ref="ref_select_unit"
                v-model.trim="dataJson.tempJson.unit_id"
                :sku-id="dataJson.searchForm.sku_id"
                @change="handleUnitChange"
              />
            </el-form-item>
          </el-descriptions-item>
          <el-descriptions-item>
            <div
              slot="label"
              class="required-mark"
            >
              入库数量
            </div>
            <el-form-item prop="count">
              <numeric
                v-model="dataJson.tempJson.count"
                :decimal-places="4"
                :currency-symbol="''"
              />
            </el-form-item>
          </el-descriptions-item>
          <el-descriptions-item label="库存计量单位">
            <span>吨</span>
            <!-- 若入库单位不等于吨 -->
            <span
              v-if="settings.btnUnitStatus.showUnit "
              class="floatRight"
              style="padding-left: 5px;"
            >注：单位转换，{{ dataJson.tempJson.unitData.content }}
              <el-button
                type="primary"
                @click="handleUnitCalculator"
              >
                修改
              </el-button>
            </span>
            <span
              v-if="settings.btnUnitStatus.showInsert"
              class="floatRight"
              style="padding-left: 5px;"
            >注：点击单位按钮维护单位数据
              <el-button
                type="primary"
                @click="handleUnitInsert"
              >
                单位
              </el-button>
            </span>
          </el-descriptions-item>
          <el-descriptions-item label="入库数量换算">
            <el-form-item prop="weight">
              <numeric
                :value="dataJson.tempJson.weight"
                :decimal-places="4"
                :currency-symbol="''"
                :disabled="true"
              />

            </el-form-item>
          </el-descriptions-item>
          <el-descriptions-item label="备注">
            <el-form-item
              prop="remark"
              label-width="0"
            >
              <el-input
                v-model.trim="dataJson.tempJson.remark"
                show-word-limit
                :maxlength="dataJson.inputSettings.maxLength.remark"
                :placeholder="isPlaceholderShow('请输入')"
                :disabled="isViewModel"
              />
            </el-form-item>
          </el-descriptions-item>
          <el-descriptions-item />
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
      :data="popSettingsData.specDialog.data "
      @closeMeOk="handleSpecCloseOk"
      @closeMeCancel="handleSpecCloseCancel"
    />
    <unit-calculator-dialog
      v-if="popSettingsData.unitCalculatorDialog.visible"
      :id="dataJson.tempJson.sku_id"
      :unit-id="dataJson.tempJson.unit_id"
      :visible="popSettingsData.unitCalculatorDialog.visible"
      :dialog-status="popSettingsData.unitCalculatorDialog.dialogStatus"
      @closeMeCancel="handleCloseDialogUnitCalculatorCancel"
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
import specDialog from '@/views/40_business/inplan/tabs/spec/dialog/dialog'
import selectUnit from '@/views/30_wms/spec/unit/selectUnit/selectUnit'
import InputSearch from '@/components/40_input/inputSearch'
import numeric from '@/components/40_input/numeric'
import unitCalculatorDialog from '@/views/30_wms/spec/unit/unitCalculator/unitCalculator'
import { isNotEmpty } from '@/utils/index.js'
import { getDetailApi, getCountApi } from '@/api/30_wms/spec/unit/unitCalc'
import SelectWarehouse from '@/views/30_wms/warehouse/selectgrid/selectWarehouseLocationBin'

export default {
  components: { InputSearch, specDialog, numeric, selectUnit, unitCalculatorDialog, SelectWarehouse },
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
        unwatch_tempJson: null,
        unwatch_unitData: null,
        unwatch_count: null
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
        },
        // 单位换算弹出框 unitCalculatorDialog
        unitCalculatorDialog: {
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
        unitConvertList: [],
        searchForm: {
          pageCondition: {},
          enable: 1
        },
        // 单条数据 json的，初始化原始数据
        tempJsonOriginal: {
          warehouse_id: null,
          warehouse_name: '',
          spec_code: '',
          count: 0,
          price: 0,
          unitData: null
        },
        // 单条数据 json
        tempJson: null,
        inputSettings: {
          maxLength: {
            name: 20,
            code: 20,
            remark: 100
          }
        }
      },
      // 页面设置json
      settings: {
        // loading 状态
        loading: true,
        btnUnitStatus: {
          // 关于单位的按钮显示
          showUnit: false,
          showInsert: false
        },
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
          warehouse_name: [
            { validator: this.checkWarehouse, trigger: 'change' }
          ],
          count: [
            { required: true, message: '请输入入库数量', trigger: 'change' },
            { validator: this.checkCount, trigger: 'change' }
          ],
          unit_id: [
            { validator: this.unitIdValidator, trigger: 'change' }
          ],
          price: [
            { validator: this.numberValidator, trigger: 'change' }
          ]

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
  watch: {
  },
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
      this.dataJson.tempJsonOriginal = this.$options.data.call(this).dataJson.tempJsonOriginal
    },
    initButtonShowStatus () {
      // 初始化按钮状态：默认都隐藏
      this.settings.btnShowStatus = this.$options.data.call(this).settings.btnShowStatus
    },
    initButtonDisabledStatus () {
      // 按钮状态初始化：默认不可用
      this.settings.btnDisabledStatus = this.$options.data.call(this).settings.btnDisabledStatus
    },
    // 新增时的初始化
    initInsertModel () {
      // 数据初始化
      this.initTempJsonOriginal()
      this.dataJson.tempJson = deepCopy(this.dataJson.tempJsonOriginal)
      // 新增时, 如果有选择合同, 商品单价是合同单价
      if (this.data !== null && this.data.sku_price !== null && this.data.sku_price !== undefined) {
        this.dataJson.tempJson.price = this.data.sku_price
      }
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
      this.dataJson.tempJson.unitData = {}
      this.dataJson.searchForm.sku_id = this.dataJson.tempJson.sku_id
      this.popSettingsData.searchDialogDataOne.selectedDataJson.id = this.data.business_id
      this.popSettingsData.searchDialogDataTwo.selectedDataJson.id = this.data.industry_id
      // 设置按钮
      this.settings.btnShowStatus.showUpdate = true
      // this.getUnitConvertComboData()
      // 控件focus
      // this.$nextTick(() => {
      //   this.$refs['refFocusOne'].focus()
      // })
    },
    // 查看时的初始化
    initViewModel () {
      // 数据初始化
      this.dataJson.tempJson = deepCopy(this.dataJson.tempJsonOriginal)
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
      // 监听入库单位,是否有变化，判断是否要显示单位换算按钮
      this.watch.unwatch_unitData = this.$watch(
        'dataJson.tempJson.unit_id',
        (newVal, oldVal) => {
          if (!isNotEmpty(newVal)) {
            // 为null时，因为suk重新选择，所以要初始化
            this.settings.btnUnitStatus.showUnit = false
            console.log('为null时，因为suk重新选择，所以要初始化')
          } else {
            // 判断入库单位、库存计量单位
            this.settings.btnUnitStatus.showUnit = true
            this.reCalcCountByUnit()
            console.log('判断入库单位、库存计量单位')
          }
        },
        { deep: true }
      )

      // 监听入库单位,是否有变化，重新计算入库数量换算
      this.watch.unwatch_count = this.$watch(
        'dataJson.tempJson.count',
        (newVal, oldVal) => {
          this.reCalcCountByUnit()
        },
      )
    },
    unWatch () {
      if (this.watch.unwatch_tempJson) {
        this.watch.unwatch_tempJson()
      }
      if (this.watch.unwatch_unitData) {
        this.watch.unwatch_unitData()
      }
      if (this.watch.unwatch_count) {
        this.watch.unwatch_count()
      }
    },

    // 取消按钮
    handleCancel () {
      this.$emit('closeMeCancel')
    },
    // 插入逻辑
    doInsert () {
      this.$refs['dataSubmitForm'].validate(valid => {
        // if (this.dataJson.tempJson.warehouse_name === null) {
        //   // 未选择单位时
        //   this.showErrorMsg('请选择仓库')
        //   return
        // }

        if (this.dataJson.tempJson.unit_id === null) {
          // 未选择单位时
          this.showErrorMsg('请选择入库单位')
          return
        }

        if (valid) {
          const tempData = deepCopy(this.dataJson.tempJson)
          // tempData.desc =
          this.$emit('closeMeOk', { return_flag: true, data: tempData })
        }
      })
    },
    // 更新逻辑
    doUpdate () {
      this.$refs['dataSubmitForm'].validate(valid => {
        if (this.dataJson.tempJson.warehouse_name === null) {
          // 未选择仓库时
          this.showErrorMsg('请选择仓库')
          return
        }

        if (this.dataJson.tempJson.unit_id === null) {
          // 未选择单位时
          this.showErrorMsg('请选择入库单位')
          return
        }

        if (valid) {
          const tempData = deepCopy(this.dataJson.tempJson)
          // tempData.desc =
          this.$emit('closeMeOk', { return_flag: true, data: tempData })
        }
      })
    },
    handleTabsClick (tab, event) { },

    // 规格数据选择
    handleSpecDialog () {
      this.popSettingsData.specDialog.visible = true
      if (this.data !== null && this.data.contract_no !== null && this.data.contract_no !== undefined) {
        this.popSettingsData.specDialog.data = { sku_code: this.data.sku_code, contract_no: this.data.contract_no }
      }
    },
    // 规格：关闭对话框：确定
    handleSpecCloseOk (val) {
      this.getCalCount(val.id)

      this.popSettingsData.specDialog.selectedDataJson = val
      this.dataJson.searchForm.sku_id = val.id
      this.dataJson.tempJson.goods_name = val.goods_name
      this.dataJson.tempJson.goods_id = val.goods_id
      this.dataJson.tempJson.spec = val.spec
      this.dataJson.tempJson.pm = val.pm
      // this.dataJson.tempJson = val
      this.dataJson.tempJson.spec_code = val.code
      this.dataJson.tempJson.sku_code = val.code
      this.popSettingsData.specDialog.visible = false
      this.dataJson.tempJson.unit = '吨'
      this.dataJson.tempJson.sku_id = val.id
      // this.getUnitConvertComboData()
    },
    // 规格：关闭对话框：取消
    handleSpecCloseCancel () {
      this.popSettingsData.specDialog.visible = false
    },
    // 仓库
    handleDialogClose () {
      this.popSettingsData.searchDialogDataOne.visible = true
    },
    handleUnitChange (val) {
      if (isNotEmpty(val)) {
        this.dataJson.tempJson.unit_id = val.src_unit_id
        this.dataJson.tempJson.unit_name = val.src_unit
        this.dataJson.tempJson.unitData = deepCopy(val)
        this.settings.btnUnitStatus.showInsert = false
        this.settings.btnUnitStatus.showUnit = true
      } else {
        this.dataJson.tempJson.unit_id = undefined
        this.dataJson.tempJson.unit_name = undefined
        this.dataJson.tempJson.unitData = { content: '' }
        this.settings.btnUnitStatus.showInsert = true
        this.settings.btnUnitStatus.showUnit = false
        this.dataJson.tempJson.weight = 0
      }
      // 重新计算
      this.reCalcCountByUnit()
    },
    checkCount (rule, value, callback) {
      if (value <= 0) {
        callback(new Error('入库数量必须大于0'))
      } else {
        callback()
      }
    },
    checkWarehouse (rule, value, callback) {
      if (!isNotEmpty(this.dataJson.tempJson.warehouse_id)) {
        callback(new Error('请选择入货仓库'))
      } else {
        callback()
      }
    },
    /**
   * 数字check
   */
    numberValidator (rule, value, callback) {
      if (value <= 0) {
        callback(new Error('请输入大于0的数字'))
      } else {
        callback()
      }
    },
    /**
   * 单位输入check
   */
    unitIdValidator (rule, value, callback) {
      if (!isNotEmpty(this.dataJson.tempJson.unit_id)) {
        callback(new Error('请选择入库单位'))
      } else {
        callback()
      }
    },
    // -------单位换算 开始-----
    // 入库数量换算逻辑
    reCalcCountByUnit () {
      if ((isNotEmpty(this.dataJson.tempJson.count)) &&
        (this.dataJson.tempJson.count > 0) &&
        isNotEmpty(this.dataJson.tempJson.unitData)) {
        this.dataJson.tempJson.weight = this.dataJson.tempJson.unitData.calc * this.dataJson.tempJson.count
      } else {
        this.dataJson.tempJson.weight = 0
      }
    },
    handleUnitCalculator () {
      // 修改
      this.popSettingsData.unitCalculatorDialog.visible = true
    },
    handleCloseDialogUnitCalculatorCancel () {
      this.popSettingsData.unitCalculatorDialog.visible = false
      this.settings.loading = true
      if (isNotEmpty(this.dataJson.tempJson.unitData) && isNotEmpty(this.dataJson.tempJson.unitData.id)) {
        getDetailApi({ 'id': this.dataJson.tempJson.unitData.id }).then(response => {
          // 增加对象属性，columnTypeShowIcon，columnNameShowIcon
          this.dataJson.tempJson.unitData = response.data
        }).finally(() => {
          this.settings.loading = false
        })
      }
      // 调用子组件刷新，此处是子组件的方法
      this.$refs.ref_select_unit.initCreated()
      this.settings.loading = false
    },
    getCalCount (sku_id) {
      // 查询单位
      getCountApi({ sku_id: sku_id }).then((_data) => {
        if (_data.data >= 0) {
          this.settings.btnUnitStatus.showInsert = true
          this.settings.btnUnitStatus.showUnit = false
        } else {
          this.settings.btnUnitStatus.showInsert = false
          this.settings.btnUnitStatus.showUnit = true
        }
      }, (_error) => {
      })
    },
    // -------单位换算 结束-----

    handleUnitInsert () {
      // 修改
      this.popSettingsData.unitCalculatorDialog.visible = true
    },
    // 选择仓库
    handleWarehouseReturnData (val) {
      if (val === null) {
        // 仓库
        this.dataJson.tempJson.warehouse_name = val.warehouse_name
        this.dataJson.tempJson.warehouse_id = val.warehouse_id
      } else {
        // 仓库
        this.dataJson.tempJson.warehouse_name = val.warehouse_name
        this.dataJson.tempJson.warehouse_id = val.warehouse_id
      }
    }
  }
}
</script>
