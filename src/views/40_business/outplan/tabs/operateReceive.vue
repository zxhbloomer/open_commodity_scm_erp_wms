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
          title="出库计划基本信息"
          type="info"
          :closable="false"
        />
        <br>
        <el-descriptions
          title=""
          :column="3"
          :label-style="labelStyle"
          :content-style="contentStyle"
          direction="horizontal"
          border
          style="padding-right: 10px;padding-left: 10px;"
        >
          <el-descriptions-item label="计划单号">{{ dataJson.tempJson.plan_code }}</el-descriptions-item>
          <el-descriptions-item label="序号">{{ dataJson.tempJson.no }}</el-descriptions-item>
          <el-descriptions-item label="出库类型">{{ dataJson.tempJson.type_name }}</el-descriptions-item>
          <el-descriptions-item label="货主">{{ dataJson.tempJson.owner_name }}</el-descriptions-item>
          <el-descriptions-item label="委托方">{{ dataJson.tempJson.consignor_name }}</el-descriptions-item>
          <el-descriptions-item label="物料编码">{{ dataJson.tempJson.sku_code }}</el-descriptions-item>
          <el-descriptions-item label="物料名称">{{ dataJson.tempJson.goods_name }}</el-descriptions-item>
          <el-descriptions-item label="品名">{{ dataJson.tempJson.pm }}</el-descriptions-item>
          <el-descriptions-item label="规格">{{ dataJson.tempJson.spec }}</el-descriptions-item>
          <el-descriptions-item label="计划出库数量">{{ dataJson.tempJson.count == null?'':formatNumber(dataJson.tempJson.count,true,2) }}</el-descriptions-item>
          <el-descriptions-item label="单位">{{ dataJson.tempJson.unit_name }}</el-descriptions-item>
          <el-descriptions-item label="最大出库量">{{ dataJson.tempJson.max_count == null?'-':dataJson.tempJson.max_count }}</el-descriptions-item>
          <el-descriptions-item label="已出库数量">{{ dataJson.tempJson.has_handle_count == null?'':formatNumber(dataJson.tempJson.has_handle_count,true,2) }}</el-descriptions-item>
          <el-descriptions-item label="待出库数量">{{ dataJson.tempJson.pending_count == null?'':formatNumber(dataJson.tempJson.pending_count,true,2) }}</el-descriptions-item>
          <el-descriptions-item label="备注">{{ dataJson.tempJson.remark }}</el-descriptions-item>
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
          :column="3"
          :label-style="labelStyle"
          :content-style="contentStyle"
          direction="horizontal"
          border
          style="padding-right: 10px;padding-left: 10px;"
        >
          <el-descriptions-item label="合同编号">{{ dataJson.tempJson.contract_no }}</el-descriptions-item>
          <el-descriptions-item label="单据类型">{{ dataJson.tempJson.bill_type_name }}</el-descriptions-item>
          <el-descriptions-item label="合同日期">
            {{ dataJson.tempJson.contract_dt == null?'':formatDate(dataJson.tempJson.contract_dt) }}
          </el-descriptions-item>
          <el-descriptions-item label="客户">{{ dataJson.tempJson.customer_name }}</el-descriptions-item>
          <el-descriptions-item label="合同量">{{ dataJson.tempJson.contract_num == null?'':formatNumber(dataJson.tempJson.contract_num,true,4) }}</el-descriptions-item>
          <el-descriptions-item
            v-if="dataJson.tempJson.over_inventory_policy"
            label="上浮百分比"
          >
            {{ dataJson.tempJson.over_inventory_upper == null ? '0%' : dataJson.tempJson.over_inventory_upper * 100 + '%' }}
          </el-descriptions-item>
          <el-descriptions-item v-if="!dataJson.tempJson.over_inventory_policy" />
        </el-descriptions>
        <br>
        <el-alert
          title="出库单信息"
          type="info"
          :closable="false"
        />
        <br>
        <el-descriptions
          title=""
          :column="3"
          :label-style="labelStyle"
          :content-style="contentStyle"
          direction="horizontal"
          border
          style="padding-right: 10px;padding-left: 10px;"
        >

          <el-descriptions-item label="出货仓库 / 库区 / 库位">
            <el-form-item prop="warehouse_name" label-width="0">
              <select-warehouse
                v-model.trim="dataJson.tempJson.warehouse_name"
                placement="left"
                disabled
                :warehouse1="dataJson.tempJson.warehouse_id"
                @closeParentDialog="handleDialogClose"
                @onReturnData="handleWarehouseReturnData"
              />
            </el-form-item>
          </el-descriptions-item>
          <el-descriptions-item label="可用库存">{{ dataJson.tempJson.qty_avaible !== null && dataJson.tempJson.qty_avaible !== undefined && dataJson.tempJson.qty_avaible !== '' ? formatNumber(dataJson.tempJson.qty_avaible * 1, true, 4) : 0 }}</el-descriptions-item>
          <el-descriptions-item label="车牌号">
            <el-form-item
              prop="vehicle_no"
              label-width="0"
            >
              <el-input
                v-model.trim="dataJson.tempJson.vehicle_no"
                clearable
                :maxlength="dataJson.inputSettings.maxLength.vehicle_no"
                placeholder="请输入车牌号"
              />
            </el-form-item>
          </el-descriptions-item>
          <!--          毛重， 开关控制是否显示-->
          <el-descriptions-item v-if="settings.weight_control_config">
            <div
              slot="label"
              class="required-mark"
            >
              毛重
            </div>
            <div class="form-items-container">
              <div class="left-side">
                <el-form-item
                  prop="gross_weight"
                  label-width="0"
                >
                  <numeric
                    v-model="dataJson.tempJson.gross_weight"
                    :decimal-places="4"
                    :currency-symbol="''"
                  />
                </el-form-item>
              </div>
              <div class="right-side">
                &nbsp;{{ dataJson.tempJson.unit_name }}
              </div>
            </div>
          </el-descriptions-item>
          <!-- 皮重， 开关控制是否显示 -->
          <el-descriptions-item v-if="settings.weight_control_config">
            <div
              slot="label"
              class="required-mark"
            >
              皮重
            </div>
            <div class="form-items-container">
              <div class="left-side">
                <el-form-item
                  prop="tare_weight"
                  label-width="0"
                >
                  <numeric
                    v-model="dataJson.tempJson.tare_weight"
                    :decimal-places="4"
                    :currency-symbol="''"
                  />
                </el-form-item>
              </div>
              <div class="right-side">{{ dataJson.tempJson.unit_name }}</div>
            </div>
          </el-descriptions-item>
          <el-descriptions-item>
            <div
              slot="label"
              class="required-mark"
            >
              数量
            </div>

            <div class="form-items-container">
              <div class="left-side">
                <el-form-item
                  prop="actual_count"
                  label-width="0"
                >
                  <numeric
                    v-model="dataJson.tempJson.actual_count"
                    :decimal-places="4"
                    :disabled="settings.weight_control_config"
                    :currency-symbol="''"
                  />
                </el-form-item>
              </div>
              <div class="right-side">{{ dataJson.tempJson.unit_name }}</div>
            </div>
          </el-descriptions-item>
          <el-descriptions-item label="单位">{{ dataJson.tempJson.unit_name }}</el-descriptions-item>

          <el-descriptions-item>
            <div
              slot="label"
              class="required-mark"
            >
              出库时间
            </div>
            <el-form-item
              label-width="0"
              prop="outbound_time"
            >
              <el-date-picker
                v-model="dataJson.tempJson.outbound_time"
                value-format="yyyy-MM-dd HH:mm:ss"
                type="datetime"
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
              商品单价
            </div>
            <el-form-item
              prop="price"
              label-width="0"
            >
              <numeric
                v-model="dataJson.tempJson.price"
                :minimum-value="0"
                :decimal-places="2"
                :disabled="isViewModel"
              />
            </el-form-item>
          </el-descriptions-item>

          <el-descriptions-item label="商品总价">
            {{ dataJson.tempJson.amount == null?'-':dataJson.tempJson.amount }}
          </el-descriptions-item>

          <el-descriptions-item label="备注">
            <el-form-item
              prop="remark"
              label-width="0"
            >
              <el-input
                v-model.trim="dataJson.tempJson.detail_remark"
                show-word-limit
                :placeholder="isPlaceholderShow('请输入')"
                :maxlength="dataJson.inputSettings.maxLength.detail_remark"
                :disabled="isViewModel"
              />
            </el-form-item>
          </el-descriptions-item>
          <el-descriptions-item v-if="!settings.weight_control_config" />
          <el-descriptions-item v-if="!settings.weight_control_config" />

        </el-descriptions>
        <br>
        <el-alert
          title="附件信息"
          type="info"
          :closable="false"
        />
        <br>
        <el-descriptions
          title=""
          :column="1"
          :label-style="fileLabelStyle"
          :content-style="contentStyle"
          direction="horizontal"
          border
          style="padding-right: 10px;padding-left: 10px;"
        >
          <el-descriptions-item label="磅单文件">
            <el-row style="display: flex;flex-wrap: wrap;">
              <el-col>
                <Simple-upload-mutil-file
                  :accept="'*'"
                  @upload-success="handlePoundUploadFileSuccess"
                  @upload-error="handlePoundUploadFileError"
                />
              </el-col>
              <el-col
                v-for="(item, i) in dataJson.pounds"
                :key="i"
                :offset="1"
                :span="4"
              >
                <previewCard
                  :file-name="item.fileName"
                  :url="item.url"
                  :time="item.timestamp"
                  @removeFile="removePoundFile"
                />
              </el-col>
            </el-row>
          </el-descriptions-item>
          <el-descriptions-item label="出库照片">
            <el-row style="display: flex;flex-wrap: wrap;">
              <el-col>
                <Simple-upload-mutil-file
                  :accept="'*'"
                  @upload-success="handleOutPhotoUploadFileSuccess"
                  @upload-error="handleOutPhotoUploadFileError"
                />
              </el-col>
              <el-col
                v-for="(item, i) in dataJson.out_photos"
                :key="i"
                :offset="1"
                :span="4"
              >
                <previewCard
                  :file-name="item.fileName"
                  :url="item.url"
                  :time="item.timestamp"
                  @removeFile="removeOutPhotoFile"
                />
              </el-col>
            </el-row>
          </el-descriptions-item>
        </el-descriptions>
        <br>

      </el-form>
    </div>
    <div
      slot="footer"
      class="dialog-footer"
    >
      <el-divider />
      <el-button
        v-show="settings.btnShowStatus.showUpdate && !isViewModel"
        type="primary"
        :disabled="settings.loading || settings.btnDisabledStatus.disabledUpdate"
        size="medium"
        @click="doUpdate()"
      >保存</el-button>
      <el-button
        size="medium"
        @click="handleCancel()"
      >返回</el-button>
    </div>

    <location-dialog
      v-if="popSettingsData.searchDialogDataTwo.visible"
      :visible="popSettingsData.searchDialogDataTwo.visible"
      @closeMeOk="handleLocationCloseOk"
      @closeMeCancel="handleLocationCloseCancel"
    />
    <bin-dialog
      v-if="popSettingsData.searchDialogDataThree.visible"
      :visible="popSettingsData.searchDialogDataThree.visible"
      @closeMeOk="handleBinCloseOk"
      @closeMeCancel="handleBinCloseCancel"
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
.edit-container {
  height: calc(100vh - 160px);
  overflow-x: auto;
}
.el-form-item--mini.el-form-item {
  margin-bottom: 0px;
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
.required-mark::before {
  content: '*';
  color: #ff4949;
  margin-right: 4px;
}
.form-items-container {
  display: flex;
  align-items: center;
}

.left-side {
  flex: 9; /* 或者你想要的更高的值，表示左边占据较多的空间 */
}

.right-side {
  flex: 1; /* 或者你想要的更低的值，表示右边占据较少的空间 */
  margin-left: 5px;
}
</style>

<script>
import constants_para from '@/common/constants/constants_para'
import elDragDialog from '@/directive/el-drag-dialog'
import deepCopy from 'deep-copy'
import { getPlanDetailApi, operateReceiveApi } from '@/api/40_business/outplan/outplan'
import { getOnlyOneUnitCalcApi, getCountApi } from '@/api/30_wms/spec/unit/unitCalc'
import previewCard from '@/components/50_preview_card/preview_card.vue'
import SimpleUploadMutilFile from '@/components/10_file/SimpleUploadMutilFile/index.vue'
import locationDialog from '@/views/30_wms/location/dialog/dialog.vue'
import unitCalculatorDialog from '@/views/30_wms/spec/unit/unitCalculator/unitCalculator.vue'
import { isNotEmpty } from '@/utils'
import binDialog from '@/views/30_wms/bin/dialog/dialog.vue'
import numeric from '@/components/40_input/numeric/index.vue'
import SelectWarehouse from '@/views/30_wms/warehouse/selectgrid/selectWarehouseLocationBin.vue'
import { getWeightControlConfigApi } from '@/api/40_business/inplan/inplan'

export default {
  directives: { elDragDialog },
  components: { SelectWarehouse, SimpleUploadMutilFile, previewCard, locationDialog, binDialog, numeric, unitCalculatorDialog },
  // mixins: [mixin],
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
      contentStyle: {
        width: '16%'
      },
      labelStyle: {
        width: '9%',
        'text-align': 'right'
      },
      fileLabelStyle: {
        width: '2.3%',
        'text-align': 'right'
      },
      // 上传文件窗口的状态
      popSettingsUpload: {
        // 弹出窗口会否显示
        dialogFormVisible: false,
        // 错误数据文件
        errorFileUrl: ''
      },
      // 监听器
      watch: {
        unwatch_tempJson: null,
        unwatch_unitData: null,
        unwatch_actual_count: null,
        unwatch_actual_price: null
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
        // 单条数据 json的，初始化原始数据
        // 磅单文件
        pounds: [],
        pound_file: [],
        // 出库明细
        out_photos: [],
        out_photo_file: [],
        tempJsonOriginal: {
          unit_id: '',
          price: 0,
          outbound_time: '',
          actual_count: 0,
          unitData: { content: '' }
        },
        searchForm: {
          reset: null
        },
        // 单条数据 json
        tempJson: {
          unit: '吨',
          unitData: { content: '' },
          actual_count: 0
        },
        warehouse: {
          location_id: null,
          location_name: null,
          bin_id: null,
          bin_name: null,
          unitData: null
        },
        inputSettings: {
          maxLength: {
            contract_num: 20,
            ship_name: 20,
            contract_no: 20,
            primary_quantity: 10,
            car_count: 20,
            actual_count: 20,
            price: 10,
            // 车牌号
            vehicle_no: 20,
            detail_remark: 100
          }
        }
      },
      // 页面设置json
      settings: {
        // 皮重毛重开关控制
        weight_control_config: false,
        btnUnitStatus: {
          // 关于单位的按钮显示
          showUnit: false,
          showInsert: false
        },
        // tableHeight: this.setUIheight(),
        // loading 状态
        loading: true,
        loading1: true,
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
        dialogStatus: this.editStatus,
        // pop的check内容
        rules: {
          outbound_time: [
            { required: true, message: '请输入出库时间', trigger: 'change' }
          ],
          actual_count: [
            { required: true, message: '请输入出库数量', trigger: 'change' },
            { validator: this.in_qty_validator, trigger: 'blur' }
          ],
          gross_weight: [
            { validator: this.gross_weight_validator, trigger: 'change' }
          ],
          tare_weight: [
            { validator: this.tare_weight_validator, trigger: 'change' }
          ],
          unit_calc: [
            { validator: this.unit_calc_validator, trigger: 'blur' }
          ],
          price: [
            { validator: this.check_price, trigger: 'blur' }
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
  watch: {
    // 全屏loading
    'settings.loading1': {
      handler (newVal, oldVal) {
        switch (newVal) {
          case true:
            this.showLoading('正在查询，请稍后...')
            break
          case false:
            this.closeLoading()
            break
        }
      }
    },
    // 监听毛重
    'dataJson.tempJson.gross_weight': {
      handler (newVal) {
        var number = (newVal === undefined ? 0 : newVal) - (this.dataJson.tempJson.tare_weight === undefined ? 0 : this.dataJson.tempJson.tare_weight)
        if (number < 0) {
          this.dataJson.tempJson.actual_count = 0
        } else {
          this.dataJson.tempJson.actual_count = number
        }
      }
    },
    // 监听 皮重
    'dataJson.tempJson.tare_weight': {
      handler (newVal) {
        var number = (this.dataJson.tempJson.gross_weight === undefined ? 0 : this.dataJson.tempJson.gross_weight) - (newVal === undefined ? 0 : newVal)
        if (number < 0) {
          this.dataJson.tempJson.actual_count = 0
        } else {
          this.dataJson.tempJson.actual_count = number
        }
      }
    }
    // 监听数量
    // 'dataJson.actual_count': {
    //   handler () {
    //     this.reCalcCountByUnit()
    //   }
    // }
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
    async init () {
      this.dataJson.tempJson = this.data
      this.getWeightControlConfig()
      this.initButtonShowStatus()
      this.initButtonDisabledStatus()
      switch (this.editStatus) {
        case this.PARAMETERS.STATUS_UPDATE:
          await this.initUpdateModel()
          break
      }
      this.$nextTick(() => {
        // 初始化watch
        this.setWatch()
      })

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
      this.getData()
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

      this.getData()
      this.dataJson.tempJson.actual_weight = 0
      this.dataJson.tempJson.actual_count = 0
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

      // 监听入库单位,是否有变化，判断是否要显示单位换算按钮
      // this.watch.unwatch_unitData = this.$watch(
      //   'dataJson.tempJson.unitData',
      //   (newVal, oldVal) => {
      //     if (newVal === null) {
      //       // 为null时，因为suk重新选择，所以要初始化
      //       this.settings.btnUnitStatus.showUnit = false
      //       console.log('为null时，因为suk重新选择，所以要初始化')
      //     } else {
      //       // 判断入库单位、库存计量单位
      //       this.settings.btnUnitStatus.showUnit = true
      //       this.reCalcCountByUnit()
      //       console.log('判断入库单位、库存计量单位')
      //     }
      //   },
      //   { deep: true }
      // )
      // 监听入库单位,是否有变化，判断是否要显示单位换算按钮
      // this.watch.unwatch_actual_count = this.$watch(
      //   'dataJson.tempJson.actual_count',
      //   (newVal, oldVal) => {
      //     this.reCalcCountByUnit()
      //   },
      // )
      // 监听入库单价
      this.watch.unwatch_actual_price = this.$watch(
        'dataJson.tempJson.price',
        (newVal, oldVal) => {
          this.reCalcTotalPrice()
        },
      )
      this.watch.unwatch_actual_count = this.$watch(
        'dataJson.tempJson.actual_count',
        (newVal, oldVal) => {
          this.reCalcCountByUnit()
          this.reCalcTotalPrice()
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
      if (this.watch.unwatch_actual_count) {
        this.watch.unwatch_actual_count()
      }
      if (this.watch.unwatch_actual_price) {
        this.watch.unwatch_actual_price()
      }
    },

    // 取消按钮
    handleCancel () {
      // this.$emit('closeMeCancel')
      // this.$router.go(-1)
      this.$emit('emitReturn')
    },
    // 更新逻辑
    doUpdate () {
      // 开始综合验证

      this.$refs['dataSubmitForm'].validate(valid => {
        if (valid) {
          const tempData = deepCopy(this.dataJson.tempJson)
          this.settings.loading = true
          operateReceiveApi(tempData)
            .then(
              _data => {
                this.$notify({
                  title: '收货操作成功',
                  message: _data.data.message,
                  type: 'success',
                  duration: this.settings.duration
                })
                this.$emit('emitReturn')
              },
              _error => {
                this.$notify({
                  title: '收货操作失败',
                  message: _error.message,
                  type: 'error',
                  duration: this.settings.duration
                })
                this.settings.loading = false
              }
            )
            .finally(() => {

            })
        }
      })
    },
    handleTabsClick (tab, event) { },

    getData () {
      // 查询逻辑
      this.settings.loading1 = true
      getPlanDetailApi(this.data).then(response => {
        this.dataJson.warehouse.location_id = this.dataJson.tempJson.location_id
        this.dataJson.warehouse.location_name = this.dataJson.tempJson.location_name
        this.dataJson.warehouse.bin_id = this.dataJson.tempJson.bin_id
        this.dataJson.warehouse.bin_name = this.dataJson.tempJson.bin_name
        this.dataJson.warehouse.unitData = this.dataJson.tempJson.unitData

        this.dataJson.tempJson = deepCopy(response.data)

        this.dataJson.tempJson.unitData = this.dataJson.warehouse.unitData
        this.dataJson.tempJson.location_id = this.dataJson.warehouse.location_id
        this.dataJson.tempJson.location_name = this.dataJson.warehouse.location_name
        this.dataJson.tempJson.bin_id = this.dataJson.warehouse.bin_id
        this.dataJson.tempJson.bin_name = this.dataJson.warehouse.bin_name

        this.dataJson.tempJsonOriginal = deepCopy(response.data)

        this.dataJson.searchForm.id = response.data.warehouse_id
        this.dataJson.tempJson.idx = this.data.idx
        if (!isNotEmpty(this.dataJson.tempJson.unitData)) {
          this.dataJson.tempJson.unitData = { content: '' }
        }

        // 获取单位
        getOnlyOneUnitCalcApi({ 'sku_id': this.dataJson.tempJson.sku_id, 'src_unit_id': this.dataJson.tempJson.unit_id }).then(response => {
          if (isNotEmpty(response.data)) {
            this.dataJson.tempJson.unitData = deepCopy(response.data)
            this.settings.btnUnitStatus.showInsert = false
            this.settings.btnUnitStatus.showUnit = true
            console.log(this.dataJson.tempJson.unitData)
          } else {
            // 判断是否存在单位换算
            getCountApi({ 'sku_id': this.dataJson.tempJson.sku_id }).then(response => {
              if (response.data >= 0) {
                this.settings.btnUnitStatus.showInsert = true
                this.settings.btnUnitStatus.showUnit = false
              } else {
                this.settings.btnUnitStatus.showInsert = false
                this.settings.btnUnitStatus.showUnit = true
              }
            }).finally(() => {
            })
          }
        }).finally(() => {
        })
      }).finally(() => {
        this.settings.loading1 = false
      })
    },

    // 磅单上传成功
    handlePoundUploadFileSuccess (res) {
      res.response.data.timestamp = res.response.timestamp
      this.dataJson.pounds.push(res.response.data)
      this.dataJson.pound_file.push(res.response.data.url)
      this.dataJson.tempJson.pound_files = this.dataJson.pounds
    },
    // 磅单上传失败
    handlePoundUploadFileError () {
      console.debug('文件上传失败')
      this.$notify({
        title: '上传错误',
        message: '文件上传发生错误！',
        type: 'error',
        duration: 0
      })
    },
    // 删除磅单文件
    removePoundFile (val) {
      // 获取下标
      const _index = this.dataJson.pound_file.lastIndexOf(val)
      // 从数组中移除
      this.dataJson.pounds.splice(_index, 1)
      this.dataJson.pound_file.splice(_index, 1)
      this.dataJson.tempJson.splice(_index, 1)
    },

    // 出库照片上传成功
    handleOutPhotoUploadFileSuccess (res) {
      res.response.data.timestamp = res.response.timestamp
      this.dataJson.out_photos.push(res.response.data)
      this.dataJson.out_photo_file.push(res.response.data.url)
      this.dataJson.tempJson.out_photo_files = this.dataJson.out_photos
    },
    // 出库照片附件上传失败
    handleOutPhotoUploadFileError () {
      console.debug('文件上传失败')
      this.$notify({
        title: '上传错误',
        message: '文件上传发生错误！',
        type: 'error',
        duration: 0
      })
    },
    // 删除出库照片
    removeOutPhotoFile (val) {
      // 获取下标
      const _index = this.dataJson.goods_file.lastIndexOf(val)
      // 从数组中移除
      this.dataJson.out_photos.splice(_index, 1)
      this.dataJson.out_photo_file.splice(_index, 1)
      this.dataJson.out_photo_files.splice(_index, 1)
    },
    // 库区
    handleLocationDialog () {
      this.popSettingsData.searchDialogDataTwo.visible = true
    },
    // 库区：关闭对话框：确定
    handleLocationCloseOk (val) {
      this.popSettingsData.searchDialogDataTwo.selectedDataJson = val
      this.popSettingsData.searchDialogDataTwo.visible = false
      this.settings.btnDisabledStatus.disabledUpdate = false
      this.dataJson.tempJson.location_name = val.name
      this.dataJson.tempJson.location_id = val.id
    },
    // 库区：关闭对话框：取消
    handleLocationCloseCancel () {
      this.popSettingsData.searchDialogDataTwo.visible = false
    },
    // 库位
    handleBinDialog () {
      this.popSettingsData.searchDialogDataThree.visible = true
    },
    // 库位：关闭对话框：确定
    handleBinCloseOk (val) {
      this.popSettingsData.searchDialogDataThree.selectedDataJson = val
      this.popSettingsData.searchDialogDataThree.visible = false
      this.settings.btnDisabledStatus.disabledUpdate = false
      this.dataJson.tempJson.bin_name = val.name
      this.dataJson.tempJson.bin_id = val.id
    },
    // 库位：关闭对话框：取消
    handleBinCloseCancel () {
      this.popSettingsData.searchDialogDataThree.visible = false
    },
    handleWarehouseReturnData (val) {
      if (val === null) {
        // 库区
        this.dataJson.tempJson.location_id = null
        this.dataJson.tempJson.location_name = null
        // 库位
        this.dataJson.tempJson.bin_id = null
        this.dataJson.tempJson.bin_name = null
        // 仓库
        this.dataJson.tempJson.warehouse_name = null
        this.dataJson.tempJson.warehouse_id = null
      } else {
        // 库区
        this.dataJson.tempJson.location_id = val.location_id
        this.dataJson.tempJson.location_name = val.location
        // 库位
        this.dataJson.tempJson.bin_id = val.bin_id
        this.dataJson.tempJson.bin_name = val.bin_id
        // 仓库
        this.dataJson.tempJson.warehouse_name = val.warehouse_name
        this.dataJson.tempJson.warehouse_id = val.warehouse_id
      }
    },
    // 弹出框关闭
    handleDialogClose () {
      this.settings.visible = false
    },
    // 入库数量换算逻辑
    reCalcCountByUnit () {
      if ((isNotEmpty(this.dataJson.tempJson.actual_count)) &&
        (this.dataJson.tempJson.actual_count > 0) &&
        isNotEmpty(this.dataJson.tempJson.unitData)) {
        console.log(this.dataJson.tempJson.unitData.calc)
        console.log(this.dataJson.tempJson.actual_count)
        console.log(this.dataJson.tempJson.actual_count * this.dataJson.tempJson.unitData.calc)
        this.dataJson.tempJson.actual_weight = this.dataJson.tempJson.unitData.calc * this.dataJson.tempJson.actual_count
      } else {
        this.dataJson.tempJson.actual_weight = 0
      }
      this.$forceUpdate()
    },
    handleUnitCalculator () {
      // 修改
      this.popSettingsData.unitCalculatorDialog.visible = true
    },
    handleCloseDialogUnitCalculatorCancel () {
      this.popSettingsData.unitCalculatorDialog.visible = false
      this.settings.loading = true
      // 获取单位
      getOnlyOneUnitCalcApi({ 'sku_id': this.dataJson.tempJson.sku_id, 'src_unit_id': this.dataJson.tempJson.unit_id }).then(response => {
        if (isNotEmpty(response.data)) {
          this.dataJson.tempJson.unitData = deepCopy(response.data)
          this.settings.btnUnitStatus.showInsert = false
          this.settings.btnUnitStatus.showUnit = true
        } else {
          // 判断是否存在单位换算
          getCountApi({ 'sku_id': this.dataJson.tempJson.sku_id }).then(response => {
            if (response.data >= 0) {
              this.settings.btnUnitStatus.showInsert = true
              this.settings.btnUnitStatus.showUnit = false
            } else {
              this.settings.btnUnitStatus.showInsert = false
              this.settings.btnUnitStatus.showUnit = true
            }
          }).finally(() => {
            this.reCalcCountByUnit()
          })
        }
      }).finally(() => {
        this.reCalcCountByUnit()
      })
      this.settings.loading = false
    },
    handleUnitInsert () {
      // 修改
      this.popSettingsData.unitCalculatorDialog.visible = true
    },
    // 皮重， 毛重开关控制
    getWeightControlConfig () {
      this.settings.loading = true
      getWeightControlConfigApi().then((_data) => {
        const data = _data.data
        this.settings.weight_control_config = data.weight_control_config === '1'
      }).finally(() => {
        this.settings.loading = false
      })
    },
    // 计算出库金额
    reCalcTotalPrice () {
      if ((isNotEmpty(this.dataJson.tempJson.price)) &&
        (isNotEmpty(this.dataJson.tempJson.actual_count))) {
        this.dataJson.tempJson.amount = this.dataJson.tempJson.price * this.dataJson.tempJson.actual_count
      } else {
        this.dataJson.tempJson.amount = 0
      }
      this.$forceUpdate()
    },
    unit_calc_validator (rule, value, callback) {
      if (this.dataJson.tempJson.unitData === null || this.dataJson.tempJson.unitData.content === '') {
        callback(new Error('请先维护单位数据'))
      } else {
        callback()
      }
      // if (value <= 0) {
      //   callback(new Error('请新增货修改库存计量单位对应关系'))
      // } else {
      //   callback()
      // }
    },
    check_price (rule, value, callback) {
      if (this.dataJson.tempJson.price === null || this.dataJson.tempJson.price === '' || this.dataJson.tempJson.price === 0) {
        callback(new Error('请输入大于0的单价'))
      } else {
        callback()
      }
    },
    // 皮重校验, 当开关开启时, 且需小于毛重
    tare_weight_validator (rule, value, callback) {
      if (this.settings.weight_control_config) {
        if (this.dataJson.tempJson.tare_weight === null || this.dataJson.tempJson.tare_weight === undefined || this.dataJson.tempJson.tare_weight === '') {
          callback(new Error('请输入皮重'))
        } else {
          callback()
        }
      }
    },
    // 毛重不能为空
    gross_weight_validator (rule, value, callback) {
      if (this.settings.weight_control_config) {
        if (this.dataJson.tempJson.gross_weight === null || this.dataJson.tempJson.gross_weight === undefined || this.dataJson.tempJson.gross_weight === '') {
          callback(new Error('请输入毛重'))
        } else {
          callback()
        }
      }
    },
    /**
     * 入库数量check
     */
    in_qty_validator (rule, value, callback) {
      if (value <= 0) {
        callback(new Error('入库数量需大于0'))
      } else {
        callback()
      }
    }
  }
}
</script>
