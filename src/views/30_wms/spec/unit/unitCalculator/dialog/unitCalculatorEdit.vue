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
      width="750px"
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
              入库时计量单位
            </div>
            <el-form-item prop="src_unit_data">
              <el-select
                v-model="dataJson.tempJson.src_unit_data"
                filterable
                placeholder="请选择计量单位"
                :loading="settings.loading"
                loading-text="拼命加载..."
                clearable
                value-key="id"
                :disabled="(settings.dialogStatus === PARAMETERS.STATUS_UPDATE )"
                @change="handleUnitChange"
              >
                <el-option
                  v-for="item in dataJson.unitList"
                  :key="item.id"
                  :label="item.name"
                  :value="item"
                />
              </el-select>
            </el-form-item>
          </el-descriptions-item>
          <el-descriptions-item label="库存计量单位">
            <el-form-item prop="tgt_unit_id">
              吨
            </el-form-item>
          </el-descriptions-item>
          <el-descriptions-item label="换算关系：">
            <el-form-item prop="calc">
              <!-- <el-input
                ref="refFocusOne"
                v-model.trim="dataJson.tempJson.calc"
                clearable
                show-word-limit
                style="width:170px"
                :placeholder="isPlaceholderShow('请输入')"
                :disabled="isViewModel"
                @change="convertRelationChange"
              /> -->
              <numeric
                v-model="dataJson.tempJson.calc"
                :decimal-places="2"
                :currency-symbol="''"
                :minimum-value="0"
                prefix="1(入库计量单位)="
                suffix="(库存计量单位)"
                width-css="30%"
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
          :disabled="settings.loading || settings.btnDisabledStatus.disabledInsert"
          @click="doInsert()"
        >确定</el-button>
        <el-button
          v-show="settings.btnShowStatus.showUpdate"
          plain
          type="primary"
          :disabled="settings.loading || settings.btnDisabledStatus.disabledUpdate"
          @click="doUpdate()"
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
import constants_para from '@/common/constants/constants_para'
import elDragDialog from '@/directive/el-drag-dialog'
import deepCopy from 'deep-copy'
import { validateDecimals } from '@/common/validate/validate'
import { getUnusedUnitsListApi, updateApi, insertApi } from '@/api/30_wms/spec/unit/unitCalc'
import numeric from '@/components/40_input/numeric'
import { isNotEmpty } from '@/utils'

export default {
  name: 'UnitCalculatorEdit',
  components: { numeric },
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
    },
    appCode: {
      type: String,
      default: '00'
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
        btnDisabledStatus: {
          disabledOK: false
        }
      },
      dataJson: {
        source_uint: null,
        // 单位列表
        unitList: [],
        // 单条数据 json的，初始化原始数据
        tempJsonOriginal: {
          tgt_unit: '',
          src_unit: '',
          tgt_unit_id: null,
          src_unit_id: null,
          content: '',
          src_unit_data: {
            id: null
          }
        },
        // 单条数据 json
        tempJson: {
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
        dialogStatus: this.dialogStatus,
        // pop的check内容
        rules: {
          src_unit_data: [
            { validator: this.validateSrcUnitData, trigger: 'change' }
          ],
          calc: [
            { required: true, message: '请输入换算关系', trigger: 'change' },
            { validator: this.validateHsGx, trigger: 'change' }
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
      this.settings.loading = true
      this.getUnitComboData()
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
      this.$nextTick(() => {
        // this.$refs['refFocusOne'].focus()
      })
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
      this.dataJson.tempJsonOriginal = deepCopy(this.data)
      this.dataJson.tempJson = deepCopy(this.dataJson.tempJsonOriginal)
      // 设置按钮
      this.settings.btnShowStatus.showUpdate = true
      // 控件focus
      this.$nextTick(() => {
        // this.$refs['refFocusOne'].focus()
      })
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
          // this.handleUnitChange(this.dataJson.tempJson.src_unit_id)
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
          this.dataJson.tempJson.sku_id = this.id
          this.dataJson.tempJson.src_unit_id = this.dataJson.tempJson.src_unit_data.id
          this.dataJson.tempJson.src_unit_code = this.dataJson.tempJson.src_unit_data.code
          this.dataJson.tempJson.src_unit = this.dataJson.tempJson.src_unit_data.name
          this.dataJson.tempJson.src_unit_id = this.dataJson.tempJson.src_unit_data.id
          const tempData = deepCopy(this.dataJson.tempJson)
          this.settings.loading = true
          insertApi(tempData).then((_data) => {
            this.$emit('closeMeOk', { return_flag: true, data: _data })
          }, (_error) => {
            this.$emit('closeMeOk', { return_flag: false, error: _error })
          }).finally(() => {
            this.settings.loading = false
          })
        }
      })
    },
    // 插入逻辑
    doUpdate () {
      this.$refs['dataSubmitForm'].validate(valid => {
        if (valid) {
          const tempData = deepCopy(this.dataJson.tempJson)
          this.settings.loading = true
          updateApi(tempData).then((_data) => {
            // this.dataJson.tempJson = Object.assign({}, _data.data)
            this.dataJson.tempJson = deepCopy(_data.data)
            this.$emit('closeMeOk', { return_flag: true, data: _data })
          }, (_error) => {
            this.$emit('closeMeOk', { return_flag: false, error: _error })
          }).finally(() => {
            this.settings.loading = false
          })
        }
      })
    },
    handleUnitChange (val) {
    },
    getUnitComboData () {
      getUnusedUnitsListApi({ 'sku_id': this.id, 'status': this.settings.dialogStatus }).then((_data) => {
        this.dataJson.unitList = _data.data
        this.settings.loading = false
        // this.dataJson.tempJson.tgt_unit_id = 1
        const obj = _data.data.find((item) => {
          return item.id === this.data.src_unit_id
        })
        this.dataJson.tempJson.src_unit_data = obj
      }, (_error) => {
      })
    },
    validateHsGx (rule, value, callback) {
      if (!validateDecimals(value).status) {
        callback(new Error(validateDecimals(value).msg))
      } else {
        if (value <= 0) {
          callback(new Error('换算关系必须大于0！'))
        } else {
          callback()
        }
      }
    },
    validateSrcUnitData (rule, value, callback) {
      if (!isNotEmpty(this.dataJson.tempJson.src_unit_data)) {
        callback(new Error('请选择入库时计量单位'))
      } else {
        callback()
      }
    }
  }
}
</script>
