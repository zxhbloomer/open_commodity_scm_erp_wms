<template>
  <div class="app-container">
    <div class="edit-container">
      <el-form
        ref="dataSubmitForm"
        :rules="settings.rules"
        :model="dataJson.tempJson"
        label-position="right"
        status-icon
      >

        <el-alert
          title="基本信息"
          type="info"
          :closable="false"
        />
        <br>
        <el-descriptions
          title=""
          :column="3"
          :content-style="contentStyle"
          :label-style="labelStyle"
          direction="horizontal"
          border
          style="padding-right: 10px;padding-left: 10px;"
        >
          <el-descriptions-item label="订单编号">
            {{ dataJson.tempJson.order_no === null || dataJson.tempJson.order_no === undefined? '系统自动生成' : dataJson.tempJson.order_no }}
          </el-descriptions-item>

          <el-descriptions-item>
            <div
              slot="label"
              class="required-mark"
            >
              合同编号
            </div>
            <el-form-item
              prop="carriage_contract_code"
              label-width="0"
            >
              <!--              <input-search-->
              <!--                v-model.trim="dataJson.tempJson.carriage_contract_code"-->
              <!--                :disabled="isViewModel"-->
              <!--                @onInputSearch="handleContractDialog"-->
              <!--              />-->
              <el-input
                v-model.trim="dataJson.tempJson.carriage_contract_code"
                clearable
                show-word-limit
                :maxlength="dataJson.inputSettings.maxLength.carriage_contract_code"
                :placeholder="isPlaceholderShow('请输入')"
                :disabled="isViewModel"
              />
            </el-form-item>
          </el-descriptions-item>

          <el-descriptions-item>
            <div
              slot="label"
              class="required-mark"
            >
              托运人
            </div>
            <el-form-item prop="org_name">
              <el-select
                v-model="dataJson.tempJson.org_name"
                placeholder="请选择托运人"
                :disabled="isViewModel || settings.btnDisabledStatus.disabledRelease"
                filterable
                clearable
                @change="selectOwner"
              >
                <el-option
                  v-for="item in dataJson.ownerComboList"
                  :key="item.id"
                  :label="item.short_name"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
          </el-descriptions-item>

          <el-descriptions-item>
            <div
              slot="label"
              class="required-mark"
            >
              承运商
            </div>
            <el-form-item
              prop="company_name"
              label-width="0"
            >
              <input-search
                v-model.trim="dataJson.tempJson.company_name"
                :disabled="isViewModel"
                @onInputSearch="handleCustomerDialog"
              />
            </el-form-item>

          </el-descriptions-item>

          <el-descriptions-item>
            <div
              slot="label"
              class="required-mark"
            >
              签订日期
            </div>
            <el-form-item
              prop="sign_dt"
              label-width="0"
            >
              <el-date-picker
                v-model="dataJson.tempJson.sign_dt"
                value-format="yyyy-MM-dd"
                type="date"
                clearable
                :disabled="isViewModel"
                :placeholder="isPlaceholderShow('选择日期')"
                style="width: 100%"
              />
            </el-form-item>
          </el-descriptions-item>

          <el-descriptions-item>
            <div
              slot="label"
              class="required-mark"
            >
              合同到期日期
            </div>
            <el-form-item
              prop="deadline_dt"
              label-width="0"
            >
              <el-date-picker
                v-model="dataJson.tempJson.deadline_dt"
                value-format="yyyy-MM-dd"
                type="date"
                clearable
                :disabled="isViewModel"
                :placeholder="isPlaceholderShow('选择日期')"
                style="width: 100%"
              />
            </el-form-item>
          </el-descriptions-item>
          <el-descriptions-item label="运输方式">
            <el-form-item
              prop="transport_type_name"
              label-width="0"
            >
              <select-dict
                v-model="dataJson.tempJson.transport_type_name"
                :para="CONSTANTS.DICT_CARRIAGE_ORDER_TRANSPORT"
                :disabled="isViewModel"
                init-placeholder="运输方式"
                @change="(val, selectedData) => dataJson.tempJson.transport_type_name = selectedData.name"
              />
            </el-form-item>
          </el-descriptions-item>

          <el-descriptions-item>
            <div
              slot="label"
              class="required-mark"
            >
              起运地
            </div>
            <el-form-item
              prop="origin_place"
              label-width="0"
            >
              <el-input
                v-model.trim="dataJson.tempJson.origin_place"
                clearable
                show-word-limit
                :maxlength="dataJson.inputSettings.maxLength.origin_place"
                :placeholder="isPlaceholderShow('请输入')"
                :disabled="isViewModel"
              />
            </el-form-item>
          </el-descriptions-item>

          <el-descriptions-item>
            <div
              slot="label"
              class="required-mark"
            >
              目的地
            </div>
            <el-form-item
              prop="destination_place"
              label-width="0"
            >
              <el-input
                v-model.trim="dataJson.tempJson.destination_place"
                clearable
                show-word-limit
                :maxlength="dataJson.inputSettings.maxLength.destination_place"
                :placeholder="isPlaceholderShow('请输入')"
                :disabled="isViewModel"
              />
            </el-form-item>
          </el-descriptions-item>
          <el-descriptions-item label="运距">
            <el-form-item
              prop="haul_distance"
              label-width="0"
            >
              <numeric
                v-model="dataJson.tempJson.haul_distance"
                :disabled="isViewModel"
                :decimal-places="2"
                :currency-symbol="''"
              />
            </el-form-item>
          </el-descriptions-item>
          <el-descriptions-item label="销售合同号">
            <el-form-item
              prop="sales_contract_code"
              label-width="0"
            >
              <input-search
                v-model.trim="dataJson.tempJson.sales_contract_code"
                :disabled="isViewModel"
                @onInputSearch="handleContractDialog"
              />
            </el-form-item>
          </el-descriptions-item>
          <el-descriptions-item label="付款方式">
            <el-form-item
              prop="pay_type"
              label-width="0"
            >
              <el-input
                v-model.trim="dataJson.tempJson.pay_type"
                clearable
                show-word-limit
                :maxlength="dataJson.inputSettings.maxLength.pay_type"
                :placeholder="isPlaceholderShow('请输入')"
                :disabled="isViewModel"
              />
            </el-form-item>
          </el-descriptions-item>

        </el-descriptions>

        <br>
        <el-alert
          title="费用信息"
          type="info"
          :closable="false"
        />
        <br>
        <el-descriptions
          title=""
          :column="3"
          :content-style="contentStyle"
          :label-style="labelStyle"
          direction="horizontal"
          border
          style="padding-right: 10px;padding-left: 10px;"
        >
          <el-descriptions-item>
            <div
              slot="label"
              class="required-mark"
            >
              运费单价
            </div>
            <el-form-item
              prop="price"
              label-width="0"
            >
              <numeric
                v-model="dataJson.tempJson.price"
                :disabled="isViewModel"
                :decimal-places="2"
              />
            </el-form-item>
          </el-descriptions-item>

          <el-descriptions-item>
            <div
              slot="label"
              class="required-mark"
            >
              运输数量（吨）
            </div>
            <el-form-item
              prop="num"
              label-width="0"
            >
              <numeric
                v-model="dataJson.tempJson.num"
                :decimal-places="2"
                :disabled="isViewModel"
                :currency-symbol="''"
              />
            </el-form-item>
          </el-descriptions-item>

          <el-descriptions-item>
            <div
              slot="label"
              class="required-mark"
            >
              运费总金额
            </div>
            <el-form-item
              prop="transport_amount"
              label-width="0"
            >
              <numeric
                v-model="dataJson.tempJson.transport_amount"
                :decimal-places="2"
                disabled
              />
            </el-form-item>
          </el-descriptions-item>

          <el-descriptions-item>
            <div
              slot="label"
              class="required-mark"
            >
              总货值
            </div>
            <el-form-item
              prop="total_amount"
              label-width="0"
            >
              <numeric
                v-model="dataJson.tempJson.total_amount"
                :decimal-places="2"
                :disabled="isViewModel"
              />
            </el-form-item>
          </el-descriptions-item>
          <el-descriptions-item />
          <el-descriptions-item />
        </el-descriptions>

      </el-form>
    </div>
    <div
      slot="footer"
      class="dialog-footer"
    >
      <el-divider />

      <el-button
        v-show="settings.btnShowStatus.showInsert"
        type="primary"
        :disabled="settings.loading || settings.btnDisabledStatus.disabledInsert"
        size="medium"
        @click="doInsert()"
      >保存</el-button>
      <el-button
        v-show="settings.btnShowStatus.showUpdate && !isViewModel"
        type="primary"
        :disabled="settings.loading || settings.btnDisabledStatus.disabledUpdate"
        size="medium"
        @click="doUpdate()"
      >保存</el-button>
      <el-button
        :disabled="settings.loading"
        size="medium"
        @click="handleCancel()"
      >返回</el-button>
    </div>

    <CustomerDialog
      v-if="popSettingsData.searchDialogDataOne.visible"
      :visible="popSettingsData.searchDialogDataOne.visible"
      @closeMeOk="handleCustomerCloseOk"
      @closeMeCancel="handleCustomerCloseCancel"
    />
    <owner-dialog
      v-if="popSettingsData.searchDialogDataTwo.visible"
      :visible="popSettingsData.searchDialogDataTwo.visible"
      @closeMeOk="handleOwnerCloseOk"
      @closeMeCancel="handleOwnerCloseCancel"
    />

    <goods-dialog
      v-if="popSettingsData.goodsDialog.visible"
      :dialog-status="popSettingsData.goodsDialog.dialogStatus"
      :visible="popSettingsData.goodsDialog.visible"
      :data="popSettingsData.goodsDialog.data"
      @closeMeOk="handleGoodsCloseOk"
      @closeMeCancel="handleGoodsCloseCancel"
    />

    <order-dialog
      v-if="popSettingsData.contractDialog.visible"
      :title="popSettingsData.contractDialog.title"
      :visible="popSettingsData.contractDialog.visible"
      :data="popSettingsData.contractDialog.data"
      @closeMeOk="handleOrderCloseOk"
      @closeMeCancel="handleOrderCloseCancel"
    />
  </div>
</template>
<style scoped>
.edit-container {
  height: calc(100vh - 160px);
  overflow-x: auto;
}
.el-form-item--mini.el-form-item {
  margin-bottom: 0px;
}
.required-mark::before {
  content: '*';
  color: #ff4949;
  margin-right: 4px;
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
.el-button-group {
  margin-bottom: 15px;
}
.el-popup-border-color >>> .el-input__inner {
  border-color: #1890ff;
}
br {
  display: block;
  margin: 10px;
  content: ' ';
}
</style>

<script>
import goodsDialog from '@/views/40_business/inorder/tabs/dialog/edit'
import InputSearch from '@/components/40_input/inputSearch'
import SelectDict from '@/components/00_dict/select/SelectDict'
import constants_para from '@/common/constants/constants_para'
import elDragDialog from '@/directive/el-drag-dialog'
import deepCopy from 'deep-copy'
import { insertApi, getApi, updateApi } from '@/api/40_business/carriageorder'
import ownerDialog from '@/views/30_wms/owner/dialog/dialog'
import CustomerDialog from '@/views/30_wms/customer/dialog/dialog'
import { getOwnerComboListApi } from '@/api/30_wms/owner/owner'
import numeric from '@/components/40_input/numeric/index.vue'
import orderDialog from '@/views/40_business/order/dialog/dialog.vue'

export default {
  components: { numeric, InputSearch, SelectDict, ownerDialog, goodsDialog, CustomerDialog, orderDialog },
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
    editStatus: {
      type: String,
      default: constants_para.STATUS_INSERT
    }
  },
  data () {
    return {
      // 监听器
      watch: {
        unwatch_tempJson: null,
        unwatch_actual_count: null,
        unwatch_actual_price: null
      },
      contentStyle: {
        width: '15%'
      },
      labelStyle: {
        width: '10%',
        'text-align': 'right'
      },
      fileLabelStyle: {
        width: '2.3%',
        'text-align': 'right'
      },
      popSettingsData: {
        // 弹出窗口状态名称
        dialogStatus: '',
        dialogFormVisible: false,
        btnDisabledStatus: {
          disabledOK: false
        },
        // 合同弹出框
        contractDialog: {
          // 弹出框显示参数
          title: null,
          visible: false,
          data: null,
          // 点击确定以后返回的值
          selectedDataJson: {
            id: null
          }
        },
        // 弹出的查询框参数设置
        goodsDialog: {
          // 弹出框显示参数
          visible: false,
          // 点击确定以后返回的值
          selectedDataJson: {
            id: null
          }
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
        // 弹出的规格查询框参数设置
        searchDialogDataFour: {
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
        ownerComboList: [],
        searchForm: {
          reset: null
        },
        // 单条数据 json的，初始化原始数据
        tempJsonOriginal: {
          detailListData: [],
          price: null,
          num: null
        },
        // 单条数据 json
        tempJson: {
          detailListData: []
        },
        inputSettings: {
          maxLength: {
            origin_place: 50,
            destination_place: 50,
            // 付款方式
            pay_type: 10
          }
        }
      },
      // 页面设置json
      settings: {
        // loading 状态
        loading: true,
        duration: 4000,
        // 按钮是否显示，默认不显示，false：不显示，true：显示
        btnShowStatus: {
          showInsert: false,
          showUpdate: false
        },
        // 按钮状态：是否可用，false:可用，true不可用
        btnTableDisabledStatus: {
          disabledInsert: true,
          disabledUpdate: true
        },
        btnDisabledStatus: {
          disabledInsert: true,
          disabledUpdate: true
        },
        // 以下为pop的内容：数据弹出框
        selection: [],
        dialogStatus: this.editStatus,
        // pop的check内容
        rules: {
          // 合同编号
          carriage_contract_code: [
            { validator: this.carriage_contract_code_validator, trigger: 'change' }
          ],
          // 托运人
          org_name: [
            { required: true, message: '请选择托运人', trigger: 'change' }
          ],
          // 承运商
          company_name: [
            { validator: this.company_name_validator, trigger: 'change' }
          ],
          // 签订日期
          sign_dt: [
            { required: true, message: '请选择签订日期', trigger: 'change' }
          ],
          // 合同到期日期
          deadline_dt: [
            { required: true, message: '请选择合同到期日期', trigger: 'change' }
          ],
          // 起运地
          origin_place: [
            { required: true, message: '请输入起运地', trigger: 'change' }
          ],
          // 合同到期日期
          destination_place: [
            { required: true, message: '请输入目的地', trigger: 'change' }
          ],
          price: [
            { validator: this.price_validator, trigger: 'change' }
          ],
          num: [
            { validator: this.num_validator, trigger: 'change' }
          ],
          transport_amount: [
            { validator: this.transport_amount_validator, trigger: 'change' }
          ]
        }
      }
    }
  },
  computed: {
    listenVisible () {
      return this.visible
    },
    isViewModel () {
      if (this.settings.dialogStatus === this.PARAMETERS.STATUS_VIEW) {
        return true
      } else {
        return false
      }
    },
    // 判断是否是中林环境
    isZhongLin () {
      const href = window.location.href
      if (href.indexOf('shyiyuanth') !== -1 || href.indexOf('172.21.1.249') !== -1 || href.indexOf('localhost') !== -1) {
        return true
      } else {
        return false
      }
    }
  },
  // 监听器
  watch: {
    'dataJson.tempJson.price': {
      handler (newVal) {
        if (newVal !== null && this.dataJson.tempJson.num !== null) {
          this.dataJson.tempJson.transport_amount = newVal * this.dataJson.tempJson.num
        }
      }
    },
    'dataJson.tempJson.num': {
      handler (newVal) {
        if (newVal !== null && this.dataJson.tempJson.price !== null) {
          this.dataJson.tempJson.transport_amount = newVal * this.dataJson.tempJson.price
        }
      }
    }
  },
  created () {
    // 初始化货主下拉框
    this.getOwnerData()
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
      switch (this.editStatus) {
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

      this.settings.btnTableDisabledStatus.disabledInsert = false

      this.settings.loading = false
      // 设置按钮
      this.settings.btnShowStatus.showInsert = true
    },
    // 修改时的初始化
    initUpdateModel () {
      // 数据初始化
      this.getData()

      this.settings.loading = false
      // 设置按钮
      this.settings.btnShowStatus.showUpdate = true
    },
    // Placeholder设置
    isPlaceholderShow (val) {
      if (this.isViewModel) {
        return ''
      } else {
        return val
      }
    },
    // 查看时的初始化
    initViewModel () {
      // 数据初始化
      this.getData()
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
      this.$emit('emitReturn')
    },
    // 插入逻辑
    doInsert () {
      this.$refs['dataSubmitForm'].validate(valid => {
        if (valid) {
          const tempData = deepCopy(this.dataJson.tempJson)
          this.settings.loading = true
          insertApi(tempData)
            .then(
              _data => {
                this.$notify({
                  title: '新增处理成功',
                  message: _data.data.message,
                  type: 'success',
                  duration: this.settings.duration
                })

                const operate_tab_data = {
                  data: _data.data,
                  editStatus: this.PARAMETERS.STATUS_INSERT,
                  return_flag: true
                }
                this.$emit('emitReturnOK', operate_tab_data)
              },
              _error => {
                this.$notify({
                  title: '新增处理失败',
                  message: _error.error.message,
                  type: 'error',
                  duration: this.settings.duration
                })
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
      this.$refs['dataSubmitForm'].validate(valid => {
        if (valid) {
          const tempData = deepCopy(this.dataJson.tempJson)
          this.settings.loading = true
          updateApi(tempData)
            .then(
              _data => {
                this.$notify({
                  title: '更新处理成功',
                  message: _data.data.message,
                  type: 'success',
                  duration: this.settings.duration
                })
                const operate_tab_data = {
                  data: _data.data,
                  editStatus: this.PARAMETERS.STATUS_UPDATE,
                  return_flag: true
                }
                this.$emit('emitReturnOK', operate_tab_data)
              },
              _error => {
                this.$notify({
                  title: '更新处理失败',
                  message: _error.error.message,
                  type: 'error',
                  duration: this.settings.duration
                })
              }
            )
            .finally(() => {
              this.settings.loading = false
            })
        }
      })
    },
    handleTabsClick (tab, event) {
    },
    // 货主
    handleOwnerDialog () {
      this.popSettingsData.searchDialogDataTwo.visible = true
    },
    // 货主：关闭对话框：确定
    handleOwnerCloseOk (val) {
      this.popSettingsData.searchDialogDataTwo.selectedDataJson = val
      this.dataJson.tempJson.owner_id = val.id
      this.dataJson.tempJson.owner_name = val.name
      this.dataJson.tempJson.owner_code = val.code
      this.popSettingsData.searchDialogDataTwo.visible = false
      this.settings.btnDisabledStatus.disabledUpdate = false
    },
    // 货主：关闭对话框：取消
    handleOwnerCloseCancel () {
      this.popSettingsData.searchDialogDataTwo.visible = false
    },

    // 弹出框关闭
    handleDialogClose () {
      this.settings.visible = false
    },

    // 商品数据选择
    handleGoodsInsert () {
      // 新增
      this.popSettingsData.goodsDialog.dialogStatus = this.PARAMETERS.STATUS_INSERT
      this.popSettingsData.goodsDialog.visible = true
    },
    handleGoodsCloseOk (val) {
      if (val.edit_status === this.PARAMETERS.STATUS_INSERT) {
        this.doGoodsInsert(val)
      } else if (val.edit_status === this.PARAMETERS.STATUS_UPDATE) {
        this.doGoodsUpdate(val)
      }
    },

    doGoodsInsert (val) {
      if (val.return_flag) {
        this.popSettingsData.goodsDialog.visible = false
        // 设置到table中绑定的json数据源
        this.dataJson.tempJson.detailListData.push(val.data)
        this.dataJson.tempJson.amount = 0
        this.dataJson.tempJson.contract_num = 0
        this.dataJson.tempJson.detailListData.forEach(element => {
          this.dataJson.tempJson.amount += element.amount
          this.dataJson.tempJson.contract_num += element.num
        })
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
    doGoodsUpdate (val) {
      if (val.return_flag) {
        this.popSettingsData.goodsDialog.visible = false
        // 设置到table中绑定的json数据源
        this.dataJson.tempJson.detailListData.splice(val.data.index, 1, val.data)
        this.dataJson.tempJson.amount = 0
        this.dataJson.tempJson.contract_num = 0
        this.dataJson.tempJson.detailListData.forEach(element => {
          this.dataJson.tempJson.amount += element.amount
          this.dataJson.tempJson.contract_num += element.num
        })
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
    handleGoodsCloseCancel () {
      this.popSettingsData.goodsDialog.visible = false
    },
    // 商品数据编辑
    handleGoodsEdit () {
      if (this.dataJson.rowIndex === null) {
        this.showErrorMsg('请选择一条数据')
        return
      }
      // 编辑
      this.popSettingsData.goodsDialog.data = deepCopy(this.dataJson.currentJson)

      this.popSettingsData.goodsDialog.dialogStatus = this.PARAMETERS.STATUS_UPDATE
      this.popSettingsData.goodsDialog.visible = true
    },
    // 商品数据删除
    handleGoodsDelete () {
      if (this.dataJson.rowIndex === null) {
        this.showErrorMsg('请选择一条数据')
        return
      }

      // 删除
      this.$confirm('是否确认删除该条数据', '确认信息', {
        distinguishCancelAndClose: true,
        confirmButtonText: '确认',
        cancelButtonText: '取消'
      }).then(() => {
        // 设置到table中绑定的json数据源
        this.dataJson.tempJson.detailListData.splice(this.popSettingsData.goodsDialog.rowIndex, 1)
      }).catch(action => {

      })
    },
    handleRowClick (row) {
      this.popSettingsData.goodsDialog.rowIndex = this.getRowIndex(row)
    },
    // 获取行索引
    getRowIndex (row) {
      const _index = this.dataJson.tempJson.detailListData.lastIndexOf(row)
      return _index
    },
    handleCurrentChange (row) {
      this.dataJson.currentJson = Object.assign({}, row) // copy obj
      this.dataJson.currentJson.index = this.getRowIndex(row)
      this.settings.btnTableDisabledStatus.disabledInsert = false
      this.settings.btnTableDisabledStatus.disabledUpdate = false
      this.settings.btnTableDisabledStatus.disabledDelete = false
    },
    // handleBusiness () {
    //   this.popSettingsData.searchDialogDataFour.visible = true
    // },
    // 板块：关闭对话框：确定
    // handleBusinessCloseOk (val) {
    //   this.popSettingsData.searchDialogDataFour.selectedDataJson = val
    //   this.popSettingsData.searchDialogDataFour.visible = false
    //   this.settings.btnDisabledStatus.disabledUpdate = false
    //   this.dataJson.tempJson.business_type_id = val.id
    //   this.dataJson.tempJson.business_type_code = val.code
    //   this.dataJson.tempJson.business_type_name = val.name
    // },
    // 板块：关闭对话框：取消
    // handleBusinessCloseCancel () {
    //   this.popSettingsData.searchDialogDataFour.visible = false
    // },
    // 供应商
    handleCustomerDialog () {
      this.popSettingsData.searchDialogDataOne.visible = true
    },
    // 供应商：关闭对话框：确定
    handleCustomerCloseOk (val) {
      this.popSettingsData.searchDialogDataOne.selectedDataJson = val
      this.dataJson.tempJson.company_name = val.name
      this.popSettingsData.searchDialogDataOne.visible = false
    },
    // 供应商：关闭对话框：取消
    handleCustomerCloseCancel () {
      this.popSettingsData.searchDialogDataOne.visible = false
    },
    getData () {
      // 查询逻辑
      this.settings.loading = true
      console.log(this.data)
      getApi(this.data).then(response => {
        this.dataJson.tempJson = deepCopy(response.data)
      }).finally(() => {
        this.settings.loading = false
      })
    },
    // 业务板块校验
    carriage_contract_code_validator (rule, value, callback) {
      if (this.dataJson.tempJson.carriage_contract_code === null || this.dataJson.tempJson.carriage_contract_code === undefined) {
        callback(new Error('请选择合同编号'))
      } else {
        callback()
      }
    },
    // 承运商校验
    company_name_validator (rule, value, callback) {
      if (this.dataJson.tempJson.company_name === null || this.dataJson.tempJson.company_name === undefined) {
        callback(new Error('请选择承运商'))
      } else {
        callback()
      }
    },
    // 运费单价
    price_validator (rule, value, callback) {
      if (this.dataJson.tempJson.price === null || this.dataJson.tempJson.price === undefined || this.dataJson.tempJson.price === 0) {
        callback(new Error('请输入单价'))
      } else {
        callback()
      }
    },
    // 运费数量
    num_validator (rule, value, callback) {
      if (this.dataJson.tempJson.num === null || this.dataJson.tempJson.num === undefined || this.dataJson.tempJson.num === 0) {
        callback(new Error('请输入'))
      } else {
        callback()
      }
    },
    // 运费数量
    transport_amount_validator (rule, value, callback) {
      if (this.dataJson.tempJson.transport_amount === null || this.dataJson.tempJson.transport_amount === undefined || this.dataJson.tempJson.transport_amount === 0) {
        callback(new Error('请输入'))
      } else {
        callback()
      }
    },
    // 销售合同号
    handleContractDialog () {
      this.popSettingsData.contractDialog.title = '合同选择页面'
      this.popSettingsData.contractDialog.visible = true
    },
    handleOrderCloseOk (val) {
      this.popSettingsData.contractDialog.visible = false
      this.dataJson.tempJson.sales_contract_code = val.contract_no
    },
    // 合同：关闭对话框：取消
    handleOrderCloseCancel () {
      this.popSettingsData.contractDialog.visible = false
    },
    // 选择货主
    selectOwner (val) {
      var owner = this.dataJson.ownerComboList.find((item) => {
        return item.id === val
      })
      this.dataJson.tempJson.org_name = owner.short_name
    },
    // 货主下拉框
    getOwnerData () {
      getOwnerComboListApi().then((_data) => {
        this.dataJson.ownerComboList = _data.data
      }, (_error) => {
      })
    }

  }

}
</script>
