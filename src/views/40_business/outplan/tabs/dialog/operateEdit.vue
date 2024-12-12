<template>
  <div>
    <el-dialog
      v-if="listenVisible"
      v-el-drag-dialog
      v-loading="settings.loading"
      element-loading-text="拼命加载中，请稍后..."
      element-loading-background="rgba(255, 255, 255, 0.7)"
      title="出库"
      :visible="visible"
      :close-on-click-modal="PARAMETERS.DIALOG_CLOSE_BY_CLICK"
      :close-on-press-escape="PARAMETERS.DIALOG_CLOSE_BY_ESC"
      :show-close="PARAMETERS.DIALOG_SHOW_CLOSE"
      :append-to-body="true"
      :modal-append-to-body="true"
      width="1400px"
      destroy-on-close
    >

      <el-alert
        title="出库计划单基本信息"
        type="info"
        :closable="false"
      />
      <br>
      <el-descriptions
        title=""
        :column="4"
        :label-style="labelStyle"
        :content-style="contentStyle"
        direction="horizontal"
        border
      >
        <el-descriptions-item label="计划单号">{{ dataJson.tempJson.plan_code }}</el-descriptions-item>
        <el-descriptions-item label="序号">{{ dataJson.tempJson.code }}</el-descriptions-item>
        <el-descriptions-item label="出库类型">{{ dataJson.tempJson.type_name }}</el-descriptions-item>
        <el-descriptions-item label="货主">{{ dataJson.tempJson.owner_name }}</el-descriptions-item>
        <el-descriptions-item label="委托方">{{ dataJson.tempJson.consignor_name }}</el-descriptions-item>
        <el-descriptions-item label="" />
        <el-descriptions-item label="" />
        <el-descriptions-item label="" />
      </el-descriptions>
      <br>
      <el-alert
        title="合同信息"
        type="info"
        :closable="false"
      />
      <br>
      <el-descriptions
        title=""
        :column="4"
        :label-style="labelStyle"
        :content-style="contentStyle"
        direction="horizontal"
        border
      >
        <el-descriptions-item label="合同编号">{{ dataJson.tempJson.contract_no }}</el-descriptions-item>
        <el-descriptions-item label="单据类型">{{ dataJson.tempJson.bill_type_name }}</el-descriptions-item>
        <el-descriptions-item label="合同日期">
          {{ dataJson.tempJson.contract_dt == null?'':formatDate(dataJson.tempJson.contract_dt) }}

        </el-descriptions-item>
        <el-descriptions-item label="客户">{{ dataJson.tempJson.client_name }}</el-descriptions-item>
        <el-descriptions-item label="合同量">{{ dataJson.tempJson.contract_num }}</el-descriptions-item>
        <el-descriptions-item label="" />
        <el-descriptions-item label="" />
        <el-descriptions-item label="" />
      </el-descriptions>
      <br>
      <el-alert
        title="出库物料明细"
        type="info"
        :closable="false"
      />
      <br>
      <el-divider content-position="left">计划出库信息</el-divider>
      <el-descriptions
        title=""
        :column="4"
        :label-style="labelStyle"
        :content-style="contentStyle"
        direction="horizontal"
        border
      >
        <el-descriptions-item label="物料编码">{{ dataJson.tempJson.spec_code }}</el-descriptions-item>
        <el-descriptions-item label="物料名称">{{ dataJson.tempJson.goods_name }}</el-descriptions-item>
        <el-descriptions-item label="品名">{{ dataJson.tempJson.goods_name }}</el-descriptions-item>
        <el-descriptions-item label="规格">{{ dataJson.tempJson.spec }}</el-descriptions-item>
        <el-descriptions-item label="换算后数量">{{ dataJson.tempJson.plan_weight }}</el-descriptions-item>
        <el-descriptions-item label="出货仓库">{{ dataJson.tempJson.warehouse_name }}</el-descriptions-item>
        <el-descriptions-item label="可用库存">{{ dataJson.tempJson.qty_avaible }}</el-descriptions-item>
        <el-descriptions-item label="" />

      </el-descriptions>
      <br>
      <el-divider content-position="left">实际出库信息</el-divider>
      <br>
      <el-form
        ref="dataSubmitForm"
        :rules="settings.rules"
        :model="dataJson.tempJson"
        label-position="right"
        label-width="150px"
        status-icon
      >
        <el-row>
          <el-col :span="6">
            <el-form-item
              label="出库时间："
              prop="outbound_time"
            >
              <el-date-picker
                v-model="dataJson.tempJson.outbound_time"
                value-format="yyyy-MM-dd"
                type="date"
                clearable
                :disabled="isViewModel"
                :placeholder="isPlaceholderShow('选择日期')"
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item
              label="出库数量："
              prop="actual_count"
            >
              <el-input
                v-model.trim="dataJson.tempJson.actual_count"
                clearable
                show-word-limit
                :maxlength="dataJson.inputSettings.maxLength.actual_count"
                :placeholder="isPlaceholderShow('请输入')"
                :disabled="isViewModel"
                @change="countChange"
              />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item
              label="出库单位："
              prop="unit_id"
            >
              <el-select
                v-model.trim="dataJson.tempJson.unit_id"
                placeholder="请选择出库单位"
                :loading="settings.loading"
                loading-text="拼命加载..."
                clearable
                :disabled="isViewModel"
                @change="unitChange"
              >
                <el-option
                  v-for="item in dataJson.unitConvertList"
                  :key="item.jl_unit"
                  :label="item.jl_unit"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item
              label="换算后数量："
              prop="actual_weight"
            >
              <el-input
                v-model.trim="dataJson.tempJson.actual_weight"
                clearable
                show-word-limit
                :maxlength="dataJson.inputSettings.maxLength.actual_weight"
                :placeholder="isPlaceholderShow('请输入')"
                type="number"
                disabled
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="6">
            <el-form-item
              label="库存计量单位："
              prop="unit"
            >
              <el-input
                v-model.trim="dataJson.tempJson.unit"
                clearable
                show-word-limit
                :maxlength="dataJson.inputSettings.maxLength.unit"
                :placeholder="isPlaceholderShow('请输入')"
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
        <el-button
          plain
          :disabled="settings.loading"
          @click="handleCancel()"
        >返回</el-button>
        <el-button
          v-show="settings.btnShowStatus.showInsert"
          plain
          type="primary"
          :disabled="settings.loading || settings.btnDisabledStatus.disabledInsert "
          @click="doInsert()"
        >保存</el-button>
        <el-button
          v-show="settings.btnShowStatus.showUpdate && !isViewModel"
          plain
          type="primary"
          :disabled="settings.loading || settings.btnDisabledStatus.disabledUpdate "
          @click="doUpdate()"
        >保存</el-button>
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
<style >
.el-input-group__append_select,
.el-input-group__append {
  color: #ffffff;
  background-color: #1890ff;
  border-color: #1890ff;
}
</style>

<script>
import { getUnitConvertComboListApi } from '@/api/30_wms/goodsunitconvert/goodsunitconvert'
import constants_para from '@/common/constants/constants_para'
import elDragDialog from '@/directive/el-drag-dialog'
import deepCopy from 'deep-copy'
import { operateApi } from '@/api/40_business/outplan/outplan'

export default {
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
        width: '16%'
      },
      labelStyle: {
        width: '9%',
        'text-align': 'right'
      },
      // 监听器
      watch: {
        unwatch_tempJson: null
      },
      popSettingsData: {
        // 弹出窗口状态名称
        dialogStatus: '',
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
        },
        // 弹出的行业查询框参数设置
        searchDialogDataTwo: {
          // 弹出框显示参数
          visible: false,
          data: null,
          // 点击确定以后返回的值
          selectedDataJson: {
            id: null
          }
        },
        // 弹出的查询框参数设置
        searchDialogDataThree: {
          // 弹出框显示参数
          visible: false,
          // 点击确定以后返回的值
          selectedDataJson: {
            id: null
          }
        },
        // 弹出的行业查询框参数设置
        searchDialogDataFour: {
          // 弹出框显示参数
          visible: false,
          data: null,
          // 点击确定以后返回的值
          selectedDataJson: {
            id: null
          }
        },
        // 弹出的行业查询框参数设置
        searchDialogDataFive: {
          // 弹出框显示参数
          visible: false,
          data: null,
          // 点击确定以后返回的值
          selectedDataJson: {
            id: null
          }
        },
        // 弹出的行业查询框参数设置
        searchDialogDataSix: {
          // 弹出框显示参数
          visible: false,
          data: null,
          // 点击确定以后返回的值
          selectedDataJson: {
            id: null
          }
        },
        // 弹出的行业查询框参数设置
        searchDialogDataSeven: {
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
        // 单条数据 json的，初始化原始数据
        tempJsonOriginal: {
          id: undefined,
          name: '',
          config_key: '',
          value: '',
          descr: ''
        },
        // 单条数据 json
        tempJson: { unit: '吨' },
        inputSettings: {
          maxLength: {
            contract_num: 20,
            ship_name: 20,
            contract_no: 20,
            primary_quantity: 10,
            car_count: 20,
            actual_count: 20,
            price: 10
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
        rulesOne: {
          consignor_name: [
            { required: true, message: '请选择委托方', trigger: 'change' }
          ],
          owner_name: [
            { required: true, message: '请选择货主', trigger: 'change' }
          ],
          type: [
            { required: true, message: '请选择入库类型', trigger: 'change' }
          ],
          warehouse_name: [
            { required: true, message: '请输选择仓库', trigger: 'change' }
          ],
          location_name: [
            { required: true, message: '请选择库区', trigger: 'change' }
          ],
          bin_name: [
            { required: true, message: '请选择库位', trigger: 'change' }
          ],
          inbound_time: [
            { required: true, message: '请输入入库时间', trigger: 'change' }
          ],
          goods_name: [
            { required: true, message: '请选择物料', trigger: 'change' }
          ],
          actual_count: [
            { required: true, message: '请输入入库数量', trigger: 'change' }
          ]
        },
        rules: {

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
      this.dataJson.tempJson = this.data
      this.getUnitConvertComboData()
      // this.dataJson.tempJson.unit_id = null
      this.dataJson.tempJson.unit = '吨'
      this.settings.rules = this.settings.rulesOne

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
      this.dataJson.tempJson.unit = '吨'
      this.dataJson.tempJson.hs_gx = this.dataJson.tempJsonOriginal.detailVo[0].hs_gx
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
      this.dataJson.tempJson = deepCopy(this.data)
      this.dataJson.tempJsonOriginal = deepCopy(this.data)
      this.dataJson.tempJson.hs_gx = this.dataJson.tempJsonOriginal.detailVo[0].hs_gx
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
      // 开始综合验证
      this.doValidateByTabs()
      this.$refs['dataSubmitForm'].validate(valid => {
        if (valid) {
          const tempData = deepCopy(this.dataJson.tempJson)
          this.settings.loading = true
          operateApi(tempData)
            .then(
              _data => {
                this.$emit('closeMeOk', { return_flag: true, data: _data })
              },
              _error => {
                this.$emit('closeMeOk', { return_flag: false, error: _error })
              }
            )
            .finally(() => {
              this.settings.loading = false
            })
        }
      })
    },
    // 更新逻辑
    doUpdate () {
      // 开始综合验证
      this.doValidateByTabs()
      this.$refs['dataSubmitForm'].validate(valid => {
        if (valid) {
          const tempData = deepCopy(this.dataJson.tempJson)
          this.settings.loading = true
          operateApi(tempData)
            .then(
              _data => {
                this.dataJson.tempJson = deepCopy(_data.data)
                this.$emit('closeMeOk', { return_flag: true, data: _data })
              },
              _error => {
                this.$emit('closeMeOk', { return_flag: false, error: _error })
              }
            )
            .finally(() => {
              this.settings.loading = false
            })
        }
      })
    },
    handleTabsClick (tab, event) { },

    // 开始综合验证
    doValidateByTabs () {
      // 第一个tabs
      this.settings.rules = this.settings.rulesOne
      this.$refs['dataSubmitForm'].rules = this.settings.rules
      this.$refs['dataSubmitForm'].clearValidate()
      this.$refs['dataSubmitForm'].validate((valid, validateItems) => {
        if (valid === false) {
          this.settings.badge.countOne = Object.keys(validateItems).length
        } else {
          this.settings.badge.countOne = 0
        }
      })
      // 所有的数据进行验证
      this.doValidateAllRules()
    },
    // 所有的数据开始validate
    doValidateAllRules () {
      if (this.isLoginEnabled) {
        this.settings.rules = { ...this.settings.rulesOne, ...this.settings.rulesTwo }
      } else {
        this.settings.rules = { ...this.settings.rulesOne }
      }

      this.$refs['dataSubmitForm'].rules = this.settings.rules
      this.$refs['dataSubmitForm'].clearValidate()
    },
    getUnitConvertComboData () {
      getUnitConvertComboListApi(this.data).then((_data) => {
        this.dataJson.unitConvertList = _data.data
        this.settings.loading = false
      }, (_error) => {
      })
    },
    unitChange (val) {
      let obj = {}
      obj = this.dataJson.unitConvertList.find((item) => {
        return item.id === val
      })
      this.dataJson.tempJson.hs_gx = obj.hs_gx
      this.dataJson.tempJson.actual_weight = this.dataJson.tempJson.actual_count * obj.hs_gx
    },
    countChange (val) {
      this.dataJson.tempJson.actual_weight = val * this.dataJson.tempJson.hs_gx
    }
  }

}
</script>
