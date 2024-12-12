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
              物料编码
            </div>
            <el-form-item prop="sku_code">
              <input-search
                v-model.trim="dataJson.tempJson.sku_code"
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
              合同数量
            </div>
            <el-form-item prop="num">
              <numeric
                v-model="dataJson.tempJson.num"
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
              合同价格
            </div>
            <el-form-item prop="price">
              <numeric
                v-model="dataJson.tempJson.price"
                :decimal-places="0"
                :currency-symbol="'¥'"
              />
            </el-form-item>
          </el-descriptions-item>
          <el-descriptions-item label="金额">
            {{ dataJson.tempJson.amount == null?"":formatCurrency(dataJson.tempJson.amount, true) }}
          </el-descriptions-item>
          <el-descriptions-item>
            <div
              slot="label"
              class="required-mark"
            >
              税率
            </div>
            <el-form-item prop="rate">
              <!--              <numeric-->
              <!--                v-model="dataJson.tempJson.rate"-->
              <!--                :decimal-places="2"-->
              <!--                :currency-symbol="''"-->
              <!--              />-->
              <el-input
                v-model.trim="dataJson.tempJson.rate"
                class="slotColor"
                type="text"
                clearable
                show-word-limit
                :maxlength="dataJson.inputSettings.maxLength.num"
                :placeholder="isPlaceholderShow('请输入')"
                :disabled="isViewModel"
              >
                <template slot="append">%</template>
              </el-input>
            </el-form-item>
          </el-descriptions-item>

          <el-descriptions-item>
            <div
              slot="label"
              class="required-mark"
            >
              交货日期
            </div>
            <el-form-item prop="delivery_date">
              <el-date-picker
                v-model="dataJson.tempJson.delivery_date"
                value-format="yyyy-MM-dd"
                type="date"
                clearable
                :disabled="isViewModel"
                :placeholder="isPlaceholderShow('选择日期')"
                style="width: 100%"
              />
            </el-form-item>
          </el-descriptions-item>

          <el-descriptions-item label="交货方式">
            <div
              slot="label"
              class="required-mark"
            >
              交货方式
            </div>
            <el-form-item prop="delivery_type">
              <select-dict
                v-model="dataJson.tempJson.delivery_type"
                :value="dataJson.tempJson.delivery_type"
                :para="CONSTANTS.DICT_DELIVERY_TYPE"
                init-placeholder="请选择"
                :disabled="isViewModel"
                style="width:100%"
                @change="handleDelivetyTypeChange"
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
import SelectDict from '@/components/00_dict/select/SelectDict'

export default {
  components: { InputSearch, specDialog, selectUnit, numeric, SelectDict },
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
          sku_code: null
        },
        // 单条数据 json
        tempJson: {
          amount: 0,
          sku_code: null
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
          sku_code: [
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
          rate: [
            { required: true, message: '请输入税率', trigger: 'change' },
            { validator: this.rate_validator, trigger: 'change' }
          ],
          delivery_date: [
            { required: true, message: '请输入交货日期', trigger: 'change' }
          ],
          delivery_type: [
            { required: true, message: '请选择交货方式', trigger: 'change' }
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
      this.dataJson.searchForm.sku_id = val.id
      this.dataJson.tempJson.goods_name = val.goods_name
      this.dataJson.tempJson.goods_id = val.goods_id
      this.dataJson.tempJson.spec = val.spec
      this.dataJson.tempJson.pm = val.pm
      this.dataJson.tempJson.sku_code = val.code
      this.popSettingsData.specDialog.visible = false
      this.dataJson.tempJson.unit = '吨'
      this.dataJson.tempJson.sku_id = val.id
    },
    // 规格：关闭对话框：取消
    handleSpecCloseCancel () {
      this.popSettingsData.specDialog.visible = false
    },
    handleUnitChange (val) {
      console.log(val)
      this.dataJson.tempJson.unit_id = val.src_unit_id
      this.dataJson.tempJson.unit_name = val.src_unit
      this.dataJson.tempJson.unit_code = val.src_unit_code
      this.dataJson.tempJson.unitData = deepCopy(val)
    },
    handleDelivetyTypeChange (val, selectedData) {
      this.dataJson.tempJson.delivery_type_name = selectedData.name
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
    }
  }
}
</script>
