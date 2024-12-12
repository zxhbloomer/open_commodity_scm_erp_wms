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
          <el-descriptions-item label="物料编码">
            {{ dataJson.tempJson.sku_code }}
          </el-descriptions-item>
          <el-descriptions-item label="物料名称">
            {{ dataJson.tempJson.sku_name }}
          </el-descriptions-item>
          <el-descriptions-item label="品名">
            {{ dataJson.tempJson.pm == null?"-":dataJson.tempJson.pm }}
          </el-descriptions-item>
          <el-descriptions-item label="规格">
            {{ dataJson.tempJson.spec }}
          </el-descriptions-item>
          <el-descriptions-item label="合同量">
            {{ dataJson.tempJson.num ==null?"-":dataJson.tempJson.num }}
          </el-descriptions-item>
          <el-descriptions-item>
            <div
              slot="label"
              class="required-mark"
            >
              单位
            </div>
            <el-form-item prop="unit_id">
              <select-unit
                ref="ref_select_unit"
                v-model.trim="dataJson.tempJson.unit_id"
                :sku-id="dataJson.tempJson.sku_id"
                @change="handleUnitChange"
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
          <!-- <el-descriptions-item label="可调度数量">
            {{ formatNumber(dataJson.tempJson.schedule_qty, true, 4) }}
          </el-descriptions-item> -->
          <el-descriptions-item>
            <div
              slot="label"
              class="required-mark"
            >
              运输数量
            </div>
            <el-form-item prop="actual_count">
              <numeric
                v-model="dataJson.tempJson.actual_count"
                :currency-symbol="''"
                :decimal-places="2"
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
import numeric from '@/components/40_input/numeric'
import selectUnit from '@/views/30_wms/spec/unit/selectUnit/selectUnit'
import unitCalculatorDialog from '@/views/30_wms/spec/unit/unitCalculator/unitCalculator'
import { isNotEmpty } from '@/utils/index.js'
import { getDetailApi, getCountApi } from '@/api/30_wms/spec/unit/unitCalc'

export default {
  components: { numeric, selectUnit, unitCalculatorDialog },
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
        searchForm: {
          pageCondition: {}
        },
        // 单条数据 json的，初始化原始数据
        tempJsonOriginal: {
          actual_count: 0,
          unit_id: ''
        },
        // 单条数据 json
        tempJson: {
          actual_count: 0,
          unit_id: ''
        },
        inputSettings: {
          maxLength: {
            actual_count: 20
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
          actual_count: [
            { validator: this.numberValidator, trigger: 'blur' }
          ],

          unit_id: [
            { validator: this.unitValidator, trigger: 'blur' }
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

      this.getCalCount(this.data.sku_id)

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
    handleUnitInsert () {
      // 修改
      this.popSettingsData.unitCalculatorDialog.visible = true
    },
    unitValidator (rule, value, callback) {
      if (this.dataJson.tempJson.unit_id === null || this.dataJson.tempJson.unit_id === undefined) {
        callback(new Error('请先选择单位'))
      } else {
        callback()
      }
    }

  }
}
</script>
