<template>
  <div class="app-container">
    <div class="edit-container">
      <el-form
        ref="dataSubmitForm"
        :rules="settings.rules"
        :model="dataJson.tempJson"
        label-position="right"
        label-width="150px"
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
            {{ dataJson.tempJson.code == null || dataJson.tempJson.code == ''?'系统自动生成':dataJson.tempJson.code }}
          </el-descriptions-item>

          <el-descriptions-item>
            <div
              slot="label"
              class="required-mark"
            >
              合同编号
            </div>
            <el-form-item
              prop="contract_no"
              label-width="0"
            >
              <el-input
                v-model.trim="dataJson.tempJson.contract_no"
                clearable
                show-word-limit
                :maxlength="dataJson.inputSettings.maxLength.contract_no"
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
              业务板块
            </div>
            <el-form-item
              prop="business_type_name"
              label-width="0"
            >
              <business-select
                v-model="dataJson.tempJson.business_type_name"
                :disabled="isUpdateModel && isViewModel"
                @change="handleBusinessChange"
              />
            </el-form-item>
          </el-descriptions-item>

          <el-descriptions-item>
            <div
              slot="label"
              class="required-mark"
            >
              单据类型
            </div>
            <el-form-item
              prop="bill_type"
              label-width="0"
            >
              <select-dict
                v-model="dataJson.tempJson.bill_type"
                :para="CONSTANTS.DICT_B_OUT_PLAN_BUSINESS_TYPE"
                init-placeholder="请选择单据类型"
                :disabled="isViewModel"
              />
            </el-form-item>
          </el-descriptions-item>

          <el-descriptions-item>
            <div
              slot="label"
              class="required-mark"
            >
              客户
            </div>
            <el-form-item
              prop="client_name"
              label-width="0"
            >
              <input-search
                v-model.trim="dataJson.tempJson.client_name"
                :disabled="isUpdateModel && isViewModel"
                @onInputSearch="handleClientDialog"
              />
            </el-form-item>
          </el-descriptions-item>

          <el-descriptions-item>
            <div
              slot="label"
              class="required-mark"
            >
              销售企业
            </div>
            <el-form-item
              prop="owner_name"
              label-width="0"
            >
              <input-search
                v-model.trim="dataJson.tempJson.owner_name"
                :disabled="isUpdateModel && isViewModel"
                @onInputSearch="handleOwnerDialog"
              />
            </el-form-item>
          </el-descriptions-item>

          <el-descriptions-item>
            <div
              slot="label"
              class="required-mark"
            >
              合同日期
            </div>
            <el-form-item
              prop="contract_dt"
              label-width="0"
            >
              <el-date-picker
                v-model="dataJson.tempJson.contract_dt"
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
              到期日期
            </div>
            <el-form-item
              prop="contract_expire_dt"
              label-width="0"
            >
              <el-date-picker
                v-model="dataJson.tempJson.contract_expire_dt"
                value-format="yyyy-MM-dd"
                type="date"
                clearable
                :disabled="isViewModel"
                :placeholder="isPlaceholderShow('选择日期')"
                style="width: 100%"
              />
            </el-form-item>
          </el-descriptions-item>

          <el-descriptions-item label="合同金额">
            {{ dataJson.tempJson.amount == null? '0' : formatCurrency(dataJson.tempJson.amount, true) }}
          </el-descriptions-item>
        </el-descriptions>

        <br>
        <el-alert
          title="入库物料明细"
          type="info"
          :closable="false"
        />
        <br>
        <el-button-group>
          <el-button
            v-show="!isViewModel"
            type="primary"
            icon="el-icon-circle-plus-outline"
            :loading="settings.loading"
            @click="handleGoodsInsert"
          >新增</el-button>

          <el-button
            v-show="!isViewModel"
            :disabled="settings.btnTableDisabledStatus.disabledUpdate"
            type="primary"
            icon="el-icon-edit-outline"
            :loading="settings.loading"
            @click="handleGoodsEdit"
          >编辑</el-button>

          <el-button
            v-show="!isViewModel"
            :disabled="settings.btnTableDisabledStatus.disabledDelete"
            type="primary"
            icon="el-icon-circle-close"
            :loading="settings.loading"
            @click="handleGoodsDelete"
          >删除</el-button>
        </el-button-group>

        <el-table
          ref="multipleTable"
          v-loading="settings.loading"
          :data="dataJson.tempJson.detailListData"
          :element-loading-text="'正在拼命加载中...'"
          element-loading-background="rgba(255, 255, 255, 0.5)"
          :height="settings.tableHeight"
          stripe
          border
          fit
          highlight-current-row
          :default-sort="{prop: 'u_time', order: 'descending'}"
          style="width: 100%"
          @row-click="handleRowClick"
          @current-change="handleCurrentChange"
        >
          <el-table-column
            type="index"
            width="45"
            label="No"
          />
          <el-table-column
            show-overflow-tooltip
            min-width="130"
            prop="sku_code"
            label="物料编码"
          />
          <el-table-column
            show-overflow-tooltip
            min-width="130"
            prop="sku_name"
            label="物料名称"
          />
          <el-table-column
            show-overflow-tooltip
            min-width="130"
            prop="pm"
            label="品名"
          />
          <el-table-column
            show-overflow-tooltip
            min-width="130"
            prop="spec"
            label="规格"
          />
          <el-table-column
            show-overflow-tooltip
            min-width="150"
            prop="num"
            label="合同数量"
            align="right"
          >
            <template v-slot="scope">
              {{ scope.row.num == null? '-': isZhongLin ? formatNumber3(scope.row.num) : formatNumber(scope.row.num,true,4) }}
            </template>
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            min-width="150"
            prop="unit_name"
            label="单位"
          />
          <el-table-column
            show-overflow-tooltip
            min-width="150"
            prop="price"
            label="合同价格"
            align="right"
          >
            <template v-slot="scope">
              {{ scope.row.price == null? '': formatCurrency(scope.row.price, true) }}
            </template>
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            min-width="150"
            prop="amount"
            label="金额"
            align="right"
          >
            <template v-slot="scope">
              {{ scope.row.price == null? '': formatCurrency(scope.row.amount, true) }}
            </template>
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            min-width="150"
            prop="rate"
            label="税率（%）"
            align="right"
          >
            <template v-slot="scope">
              {{ scope.row.rate == null? '': formatNumberTwo(scope.row.rate) }}
            </template>
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            min-width="150"
            prop="out_actual_count"
            label="已出库数量"
            align="right"
          >
            <template v-slot="scope">
              {{ scope.row.out_actual_count == null? '-': isZhongLin ? formatNumber3(scope.row.out_actual_count) : formatNumber(scope.row.out_actual_count,true,4) }}
            </template>
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            min-width="150"
            prop="delivery_date"
            label="交货日期"
            align="right"
          >
            <template v-slot="scope">
              {{ scope.row.delivery_date == null? '': formatDate(scope.row.delivery_date) }}
            </template>
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            min-width="150"
            prop="delivery_type_name"
            label="交货方式"
          />
        </el-table>

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

    <client-dialog
      v-if="popSettingsData.searchDialogDataOne.visible"
      :visible="popSettingsData.searchDialogDataOne.visible"
      @closeMeOk="handleClientCloseOk"
      @closeMeCancel="handleClientCloseCancel"
    />
    <owner-dialog
      v-if="popSettingsData.searchDialogDataTwo.visible"
      :visible="popSettingsData.searchDialogDataTwo.visible"
      @closeMeOk="handleOwnerCloseOk"
      @closeMeCancel="handleOwnerCloseCancel"
    />

    <!--    <business-dialog-->
    <!--      v-if="popSettingsData.searchDialogDataFour.visible"-->
    <!--      :visible="popSettingsData.searchDialogDataFour.visible"-->
    <!--      @closeMeOk="handleBusinessCloseOk"-->
    <!--      @closeMeCancel="handleBusinessCloseCancel"-->
    <!--    />-->

    <goods-dialog
      v-if="popSettingsData.goodsDialog.visible"
      :dialog-status="popSettingsData.goodsDialog.dialogStatus"
      :visible="popSettingsData.goodsDialog.visible"
      :data="popSettingsData.goodsDialog.data"
      @closeMeOk="handleGoodsCloseOk"
      @closeMeCancel="handleGoodsCloseCancel"
    />
  </div>
</template>
<style scoped>
br {
  display: block;
  margin: 10px;
  content: ' ';
}
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
</style>

<script>
import goodsDialog from '@/views/40_business/outorder/tabs/dialog/edit'
import InputSearch from '@/components/40_input/inputSearch'
import SelectDict from '@/components/00_dict/select/SelectDict'
import constants_para from '@/common/constants/constants_para'
import elDragDialog from '@/directive/el-drag-dialog'
import deepCopy from 'deep-copy'
import { updateApi, insertApi, getApi } from '@/api/40_business/outorder/outorder'
import ownerDialog from '@/views/30_wms/owner/dialog/dialog'
import clientDialog from '@/views/30_wms/customer/dialog/dialog'
import BusinessSelect from '@/views/30_wms/businesstype/component/businessSelect.vue'
import { EventBus } from '@/common/eventbus/eventbus'

// import businessDialog from '@/views/30_wms/businesstype/dialog/dialog'

export default {
  components: { BusinessSelect, InputSearch, SelectDict, ownerDialog, goodsDialog, clientDialog },
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

        unitList: null,
        searchForm: {
          reset: null
        },
        // 单条数据 json的，初始化原始数据
        tempJsonOriginal: {
          detailListData: [],
          business_type_name: null,
          business_type_code: null,
          business_type_id: null
        },
        // 单条数据 json
        tempJson: {
          detailListData: []
        },
        inputSettings: {
          maxLength: {
            contract_num: 20,
            ship_name: 20,
            contract_no: 50,
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
        btnUnitStatus: {
          // 关于单位的按钮显示
          showUnit: false,
          showInsert: false
        },
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
          contract_no: [
            { required: true, message: '请选择合同编号', trigger: 'change' }
          ],
          // 业务板块
          business_type_name: [
            // { required: true, message: '请选择业务板块', trigger: 'change' }
            { validator: this.business_type_name_validator, trigger: 'change' }
          ],
          // 单据类型
          bill_type: [
            { required: true, message: '请选择单据类型', trigger: 'change' }
          ],
          // 客户
          client_name: [
            // { required: true, message: '请选择客户', trigger: 'change' }
            { validator: this.client_name_validator, trigger: 'change' }
          ],
          // 销售企业
          owner_name: [
            // { required: true, message: '请选择销售企业', trigger: 'change' }
            { validator: this.owner_name_validator, trigger: 'change' }
          ],
          // 合同日期
          contract_dt: [
            { required: true, message: '请选择合同日期', trigger: 'change' }
          ],
          // 到期日期
          contract_expire_dt: [
            { required: true, message: '请选择到期日期', trigger: 'change' }
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
    // 编辑时的初始化
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
          if (this.dataJson.tempJson.detailListData === undefined || this.dataJson.tempJson.detailListData <= 0) {
            this.showErrorMsg('请添加商品')
            return
          }
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
                this.$emit('emitReturn')
                // 通知兄弟组件, 刷新列表
                EventBus.$emit('updateOutOrder')
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
          if (this.dataJson.tempJson.detailListData === undefined || this.dataJson.tempJson.detailListData <= 0) {
            this.showErrorMsg('请添加商品')
            return
          }
          const tempData = deepCopy(this.dataJson.tempJson)
          this.settings.loading = true
          updateApi(tempData)
            .then(
              _data => {
                this.$notify({
                  title: '编辑处理成功',
                  message: _data.data.message,
                  type: 'success',
                  duration: this.settings.duration
                })
                // const operate_tab_data = {
                //   data: _data.data,
                //   editStatus: this.PARAMETERS.STATUS_UPDATE
                // }
                this.$emit('emitReturn')
                EventBus.$emit('updateOutOrder')
                // this.$emit('emitReturn', operate_tab_data)
              },
              _error => {
                this.$notify({
                  title: '编辑处理失败',
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
    // 商品新增
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
    // 商品更新
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
      // this.popSettingsData.goodsDialog.data.index = deepCopy(this.dataJson.currentJson.index)

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
    // 客户
    handleClientDialog () {
      this.popSettingsData.searchDialogDataOne.visible = true
    },
    // 客户：关闭对话框：确定
    handleClientCloseOk (val) {
      this.popSettingsData.searchDialogDataOne.selectedDataJson = val
      this.dataJson.tempJson.client_id = val.id
      this.dataJson.tempJson.client_code = val.code
      this.dataJson.tempJson.client_name = val.name
      this.popSettingsData.searchDialogDataOne.visible = false
      this.settings.btnDisabledStatus.disabledUpdate = false
    },
    // 客户：关闭对话框：取消
    handleClientCloseCancel () {
      this.popSettingsData.searchDialogDataOne.visible = false
    },
    getData () {
      // 查询逻辑
      this.settings.loading = true
      getApi(this.data).then(response => {
        this.dataJson.tempJson = deepCopy(response.data)

        this.dataJson.tempJson.amount = 0
        this.dataJson.tempJson.contract_num = 0
        this.dataJson.tempJson.detailListData.forEach(element => {
          this.dataJson.tempJson.amount += element.amount
          this.dataJson.tempJson.contract_num += element.num
        })
      }).finally(() => {
        this.settings.loading = false
      })
    },
    // 业务板块校验
    business_type_name_validator (rule, value, callback) {
      if (this.dataJson.tempJson.business_type_name === null || this.dataJson.tempJson.business_type_name === undefined) {
        callback(new Error('请选择业务板块'))
      } else {
        callback()
      }
    },
    // 供应商校验
    client_name_validator (rule, value, callback) {
      if (this.dataJson.tempJson.client_name === null || this.dataJson.tempJson.client_name === undefined) {
        callback(new Error('请选择客户'))
      } else {
        callback()
      }
    },
    // 采购企业校验
    owner_name_validator (rule, value, callback) {
      if (this.dataJson.tempJson.owner_name === null || this.dataJson.tempJson.owner_name === undefined) {
        callback(new Error('请选择采购企业'))
      } else {
        callback()
      }
    },
    // 业务板块选择
    handleBusinessChange (id, value) {
      this.dataJson.tempJson.business_type_id = value.id
      this.dataJson.tempJson.business_type_code = value.code
      this.dataJson.tempJson.business_type_name = value.name
    }

  }

}
</script>
