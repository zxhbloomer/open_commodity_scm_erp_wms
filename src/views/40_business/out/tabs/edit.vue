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
          :label-style="labelStyle"
          :content-style="contentStyle"
          direction="horizontal"
          style="padding-right: 10px;padding-left: 10px;"
          border
        >
          <el-descriptions-item label="出库单号">
            {{ dataJson.tempJson.code == null || dataJson.tempJson.code == ''?'系统自动生成':dataJson.tempJson.code }}
          </el-descriptions-item>

          <el-descriptions-item>
            <div
              slot="label"
              class="required-mark"
            >
              委托方
            </div>
            <el-form-item
              prop="consignor_name"
              label-width="0"
            >
              <input-search
                v-model.trim="dataJson.tempJson.consignor_name"
                :disabled="isViewModel"
                @onInputSearch="handleConsignorDialog"
              />

            </el-form-item>
          </el-descriptions-item>
          <el-descriptions-item label="单据状态">
            {{ dataJson.tempJson.status_name == null?'制单':dataJson.tempJson.status_name }}
          </el-descriptions-item>
          <el-descriptions-item>
            <div
              slot="label"
              class="required-mark"
            >
              货主
            </div>
            <el-form-item
              prop="owner_name"
              label-width="0"
            >
              <!-- <input-search
                v-model.trim="dataJson.tempJson.owner_name"
                :disabled="isUpdateModel && isViewModel"
                @onInputSearch="handleOwnerDialog"
              /> -->
              <el-select
                v-model="dataJson.tempJson.owner_name"
                :placeholder="isPlaceholderShow('请选择货主')"
                :disabled="isUpdateModel && isViewModel"
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
            <div slot="label">
              出库仓库
            </div>
            <el-form-item label-width="0">
              <!-- <select-warehouse
                v-model.trim="dataJson.tempJson.warehouse_name"
                placement="left"
                :warehouse="dataJson.tempJson.warehouse_id"
                @closeParentDialog="handleDialogClose"
                @onReturnData="handleWLBReturnData"
              /> -->
              {{ dataJson.tempJson.warehouse_name }}
            </el-form-item>
          </el-descriptions-item>

          <el-descriptions-item label="物料编码">
            {{ dataJson.tempJson.sku_code == null?'-':dataJson.tempJson.sku_code }}
          </el-descriptions-item>

          <el-descriptions-item>
            <div
              slot="label"
              class="required-mark"
            >
              物料名称
            </div>
            <el-form-item
              prop="goods_name"
              label-width="0"
            >
              <input-search
                v-model.trim="dataJson.tempJson.goods_name"
                :disabled="isUpdateModel && isViewModel"
                @onInputSearch="handleSpecDialog"
              />
            </el-form-item>
          </el-descriptions-item>

          <el-descriptions-item label="品名">
            {{ dataJson.tempJson.pm == null?'-':dataJson.tempJson.pm }}
          </el-descriptions-item>
          <el-descriptions-item label="规格">
            {{ dataJson.tempJson.spec == null?'-':dataJson.tempJson.spec }}
          </el-descriptions-item>
          <el-descriptions-item label="型规">
            {{ dataJson.tempJson.type_gauge == null?'-':dataJson.tempJson.type_gauge }}
          </el-descriptions-item>
          <el-descriptions-item label="别称">
            {{ dataJson.tempJson.alias == null?'-':dataJson.tempJson.alias }}
          </el-descriptions-item>

          <el-descriptions-item>
            <div
              slot="label"
              class="required-mark"
            >
              出库类型
            </div>
            <el-form-item
              prop="type"
              label-width="0"
            >
              <select-dict
                v-model="dataJson.tempJson.type"
                :value="dataJson.tempJson.type"
                :para="CONSTANTS.DICT_B_OUT_PLAN_TYPE"
                init-placeholder="请选择"
                :disabled="isViewModel"
                style="width:100%"
              />
            </el-form-item>
          </el-descriptions-item>

          <el-descriptions-item label="创建人">{{ dataJson.tempJson.c_name }}</el-descriptions-item>
          <el-descriptions-item label="创建时间">{{ dataJson.tempJson.c_time == null ? '-' : formatDateTime(dataJson.tempJson.c_time) }}</el-descriptions-item>
          <el-descriptions-item label="更新人">{{ dataJson.tempJson.u_name }}</el-descriptions-item>
          <el-descriptions-item label="更新时间">{{ dataJson.tempJson.u_time == null ? '-' : formatDateTime(dataJson.tempJson.u_time) }}</el-descriptions-item>
          <el-descriptions-item label="审核人">{{ dataJson.tempJson.e_name }}</el-descriptions-item>
          <el-descriptions-item label="审核时间">{{ dataJson.tempJson.e_dt == null ? '-':formatDateTime(dataJson.tempJson.e_dt) }}</el-descriptions-item>

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
          style="padding-right: 10px;padding-left: 10px;"
          direction="horizontal"
          border
        >
          <el-descriptions-item>
            <div slot="label">
              合同编号
            </div>
            <el-form-item
              prop="contract_no"
              label-width="0"
            >
              <input-search
                v-model.trim="dataJson.tempJson.contract_no"
                :disabled="isUpdateModel && isViewModel"
                @onInputSearch="handleOrderDialog"
              />
            </el-form-item>
          </el-descriptions-item>
          <el-descriptions-item label="外部关联单号">
            {{ dataJson.tempJson.extra_code == null?'-':dataJson.tempJson.extra_code }}
          </el-descriptions-item>
          <el-descriptions-item label="放货指令编号">
            {{ dataJson.tempJson.release_order_code == null?'-':dataJson.tempJson.release_order_code }}
          </el-descriptions-item>
          <el-descriptions-item label="单据类型">
            {{ dataJson.tempJson.bill_type_name == null?'-':dataJson.tempJson.bill_type_name }}
          </el-descriptions-item>

          <el-descriptions-item label="合同日期">
            {{ dataJson.tempJson.contract_dt == null?'-':formatDate(dataJson.tempJson.contract_dt) }}
          </el-descriptions-item>

          <el-descriptions-item label="客户">
            {{ dataJson.tempJson.client_name == null?'-':dataJson.tempJson.client_name }}
          </el-descriptions-item>

          <el-descriptions-item label="合同量">
            {{ dataJson.tempJson.contract_num == null?'-':dataJson.tempJson.contract_num }}
          </el-descriptions-item>

          <el-descriptions-item />
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
          style="padding-right: 10px;padding-left: 10px;"
          direction="horizontal"
          border
        >
          <el-descriptions-item
            v-if="!isViewModel"
            label="可用库存"
          >
            {{ dataJson.tempJson.qty_avaible }}
          </el-descriptions-item>

          <el-descriptions-item label="车牌号">
            <el-form-item
              prop="vehicle_no"
              label-width="0"
            >
              <el-input
                v-model.trim="dataJson.tempJson.vehicle_no"
                clearable
                :disabled="isViewModel"
                :maxlength="dataJson.inputSettings.maxLength.vehicle_no"
              />
            </el-form-item>
          </el-descriptions-item>
          <el-descriptions-item v-if="isViewModel" />
          <el-descriptions-item />
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
                    :disabled="isViewModel"
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
                    :disabled="isViewModel"
                    :currency-symbol="''"
                  />
                </el-form-item>
              </div>
              <div class="right-side">{{ dataJson.tempJson.unit_name }}</div>
            </div>
          </el-descriptions-item>

          <el-descriptions-item label="出库数量（净重）">
            <el-form-item
              prop="actual_count"
              label-width="0"
            >
              <numeric
                v-model="dataJson.tempJson.actual_count"
                :disabled="isViewModel || settings.weight_control_config"
                :decimal-places="4"
                :currency-symbol="''"
              />
            </el-form-item>
          </el-descriptions-item>
          <!--          <el-descriptions-item label="出库单位">-->
          <!--            <el-form-item-->
          <!--              prop="unit_id"-->
          <!--              label-width="0"-->
          <!--            >-->
          <!--              <select-unit-->
          <!--                ref="ref_select_unit"-->
          <!--                v-model.trim="dataJson.tempJson.unit_id"-->
          <!--                :sku-id="dataJson.tempJson.sku_id"-->
          <!--                :disabled="isViewModel"-->
          <!--                @change="handleUnitChange"-->
          <!--              />-->
          <!--            </el-form-item>-->
          <!--          </el-descriptions-item>-->
          <el-descriptions-item>
            <div
              slot="label"
              class="required-mark"
            >
              出库时间
            </div>
            <el-form-item
              prop="outbound_time"
              label-width="0"
            >
              <el-date-picker
                v-model="dataJson.tempJson.outbound_time"
                value-format="yyyy-MM-dd HH:mm:ss"
                type="datetime"
                :disabled="isViewModel"
                clearable
                :placeholder="isPlaceholderShow('选择日期')"
                style="width: 100%"
              />
            </el-form-item>
          </el-descriptions-item>

          <el-descriptions-item label="出库数量换算">
            <numeric
              v-model="dataJson.tempJson.actual_weight"
              :decimal-places="4"
              :currency-symbol="''"
              :disabled="true"
            />
          </el-descriptions-item>

          <el-descriptions-item label="库存计量单位">
            <span>吨</span>
            <!-- 若出库单位不等于吨 -->
            <span
              v-if="settings.btnUnitStatus.showUnit"
              class="floatRight"
              style="padding-left: 5px;"
            >注：单位转换，{{ dataJson.tempJson.unitData.content }}
              <el-button
                v-if="!isViewModel"
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

          <el-descriptions-item>
            <div slot="label">
              商品单价
            </div>
            <el-form-item
              prop="price"
              label-width="0"
            >
              <el-input
                v-model.trim="dataJson.tempJson.price"
                show-word-limit
                :maxlength="dataJson.inputSettings.maxLength.price"
                :placeholder="isPlaceholderShow('请输入')"
                :disabled="isViewModel"
                type="number"
              />
            </el-form-item>
          </el-descriptions-item>

          <el-descriptions-item label="商品总价">
            {{ dataJson.tempJson.amount == null?'-':dataJson.tempJson.amount }}
          </el-descriptions-item>

          <el-descriptions-item label="退货数量">
            {{ dataJson.tempJson.return_qty == null?'-':dataJson.tempJson.return_qty }}
          </el-descriptions-item>

          <el-descriptions-item label="实际出库数量">
            {{ dataJson.tempJson.actual_count_return == null?'-':dataJson.tempJson.actual_count_return }}
          </el-descriptions-item>

          <el-descriptions-item label="实际出库换算数量">
            {{ dataJson.tempJson.actual_weight_return == null?'-':dataJson.tempJson.actual_weight_return }}
          </el-descriptions-item>

          <el-descriptions-item label="换算比例">
            {{ dataJson.tempJson.src_unit }}:{{ dataJson.tempJson.tgt_unit }}[{{ dataJson.tempJson.calc }}]
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

          <el-descriptions-item
            v-if="dataJson.tempJson.status =='4'"
            label="作废理由"
          >
            {{ dataJson.tempJson.cancel_remark }}
          </el-descriptions-item>
          <el-descriptions-item v-if="dataJson.tempJson.status !='4' && !settings.weight_control_config" />
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
                  v-show="!isViewModel"
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
                  v-show="!isViewModel"
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
        v-show="settings.btnShowStatus.showInsert"
        size="medium"
        type="primary"
        :disabled="settings.loading || settings.btnDisabledStatus.disabledInsert "
        @click="doInsert()"
      >保存</el-button>
      <el-button
        v-show="settings.btnShowStatus.showUpdate && !isViewModel"
        size="medium"
        type="primary"
        :disabled="settings.loading || settings.btnDisabledStatus.disabledUpdate "
        @click="doUpdate()"
      >保存</el-button>
      <el-button
        size="medium"
        :disabled="settings.loading"
        @click="handleCancel()"
      >返回</el-button>
    </div>

    <consignor-dialog
      v-if="popSettingsData.searchDialogDataOne.visible"
      :visible="popSettingsData.searchDialogDataOne.visible"
      @closeMeOk="handleConsignorCloseOk"
      @closeMeCancel="handleConsignorCloseCancel"
    />
    <owner-dialog
      v-if="popSettingsData.searchDialogDataTwo.visible"
      :visible="popSettingsData.searchDialogDataTwo.visible"
      @closeMeOk="handleOwnerCloseOk"
      @closeMeCancel="handleOwnerCloseCancel"
    />

    <inventory-detail-dialog
      v-if="popSettingsData.searchDialogDataFive.visible"
      :visible="popSettingsData.searchDialogDataFive.visible"
      :data="popSettingsData.searchDialogDataFive.data"
      @closeMeOk="handleSpecCloseOk"
      @closeMeCancel="handleSpecCloseCancel"
    />
    <order-dialog
      v-if="popSettingsData.searchDialogDataEight.visible"
      :title="popSettingsData.searchDialogDataEight.title"
      :visible="popSettingsData.searchDialogDataEight.visible"
      @closeMeOk="handleOrderCloseOk"
      @closeMeCancel="handleOrderCloseCancel"
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
br {
  display: block;
  margin: 10px;
  content: ' ';
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
import SelectDict from '@/components/00_dict/select/SelectDict'
import consignorDialog from '@/views/30_wms/customer/dialog/dialog'
import orderDialog from '@/views/40_business/outorder/dialog/dialog'
import SimpleUploadMutilFile from '@/components/10_file/SimpleUploadMutilFile'
import previewCard from '@/components/50_preview_card/preview_card'
import InputSearch from '@/components/40_input/inputSearch'
import numeric from '@/components/40_input/numeric'
import constants_para from '@/common/constants/constants_para'
import elDragDialog from '@/directive/el-drag-dialog'
import deepCopy from 'deep-copy'
import { insertApi, getApi, updateApi } from '@/api/40_business/out/out'
import { getUnitSelectDataApi } from '@/api/30_wms/unit/unit'
import { isNotEmpty } from '@/utils'
import { getDetailApi, getCountApi, getOnlyOneUnitCalcApi, getListApi } from '@/api/30_wms/spec/unit/unitCalc'
import unitCalculatorDialog from '@/views/30_wms/spec/unit/unitCalculator/unitCalculator'
import inventoryDetailDialog from '@/views/50_query/inventory_detail/dialog/dialog'
import { getOwnerComboListApi } from '@/api/30_wms/owner/owner'
import { getWeightControlConfigApi } from '@/api/40_business/inplan/inplan'

export default {
  directives: { elDragDialog },
  components: { InputSearch, inventoryDetailDialog, orderDialog, SelectDict, consignorDialog, previewCard, SimpleUploadMutilFile, unitCalculatorDialog, numeric },
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
      // 监听器
      watch: {
        unwatch_tempJson: null,
        unwatch_actual_count: null,
        unwatch_actual_price: null,
        'dataJson.tempJson.unit_id': {
          handler (newVal, oldVal) {
            console.log(newVal)
          }
        }
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
        // 弹出的仓库查询框参数设置
        searchDialogDataFour: {
          // 弹出框显示参数
          visible: false,
          data: null,
          // 点击确定以后返回的值
          selectedDataJson: {
            id: null
          }
        },
        // 弹出的规格查询框参数设置
        searchDialogDataFive: {
          // 弹出框显示参数
          visible: false,
          data: null,
          // 点击确定以后返回的值
          selectedDataJson: {
            id: null
          }
        },
        // 弹出的库区查询框参数设置
        searchDialogDataSix: {
          // 弹出框显示参数
          visible: false,
          data: null,
          // 点击确定以后返回的值
          selectedDataJson: {
            id: null
          }
        },
        // 弹出的库位查询框参数设置
        searchDialogDataSeven: {
          // 弹出框显示参数
          visible: false,
          data: null,
          // 点击确定以后返回的值
          selectedDataJson: {
            id: null
          }
        },
        // 弹出的库位查询框参数设置
        searchDialogDataEight: {
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
        // 用于监听
        actual_count: 0,
        // 磅单文件
        pounds: [],
        ownerComboList: [],
        pound_file: [],
        // 出库明细
        out_photos: [],
        out_photo_file: [],
        // 单条数据 json的，初始化原始数据
        tempJsonOriginal: {
          id: undefined,
          goods_name: '',
          owner_id: null,
          owner_name: '',
          unitData: { content: '' },
          qty_avaible: 0
        },
        // 单条数据 json
        tempJson: {
          id: undefined,
          owner_id: null,
          owner_name: '',
          goods_name: '',
          unitData: { content: '' },
          qty_avaible: 0
        },
        searchForm: {
          reset: false,
          owner_id: undefined,
          owner_name: ''
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
            vehicle_no: 20,
            remark: 100
          }
        }
      },
      // 页面设置json
      settings: {
        // 皮重毛重开关控制
        weight_control_config: false,
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
        dialogStatus: this.editStatus,
        // pop的check内容
        rules: {
          goods_name: [
            { required: true, message: '请选择物料', trigger: 'change' }
          ],
          consignor_name: [
            { required: true, message: '请选择委托方', trigger: 'click' }
          ],
          owner_name: [
            { required: true, message: '请选择货主', trigger: 'change' }
          ],
          type: [
            { required: true, message: '请选择出库类型', trigger: 'change' }
          ],
          // location_name: [
          //   { required: true, message: '请选择库区', trigger: 'change' }
          // ],
          bin_name: [
            { required: true, message: '请选择库位', trigger: 'change' }
          ],
          outbound_time: [
            { required: true, message: '请输入出库时间', trigger: 'change' }
          ],
          actual_count: [
            { required: true, message: '请输入出库数量', trigger: 'change' },
            { validator: this.in_qty_validator, trigger: 'blur' }
          ],
          unit_id: [
            { validator: this.unit_id_validator, trigger: 'change' }
          ],
          price: [
            { validator: this.checkPrice, trigger: 'change' }
          ],
          warehouse_name: [
            { validator: this.checkWarehouse, trigger: 'change' }
          ],
          gross_weight: [
            { validator: this.gross_weight_validator, trigger: 'change' }
          ],
          tare_weight: [
            { validator: this.tare_weight_validator, trigger: 'change' }
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
    // 监听毛重
    'dataJson.tempJson.gross_weight': {
      handler (newVal) {
        var number = (newVal === undefined ? 0 : newVal) - (this.dataJson.tempJson.tare_weight === undefined ? 0 : this.dataJson.tempJson.tare_weight)
        if (number < 0) {
          this.dataJson.tempJson.actual_count = 0
          this.dataJson.actual_count = 0
        } else {
          this.dataJson.tempJson.actual_count = number
          this.dataJson.actual_count = number
        }
      }
    },
    // 监听 皮重
    'dataJson.tempJson.tare_weight': {
      handler (newVal) {
        var number = (this.dataJson.tempJson.gross_weight === undefined ? 0 : this.dataJson.tempJson.gross_weight) - (newVal === undefined ? 0 : newVal)
        if (number < 0) {
          this.dataJson.tempJson.actual_count = 0
          this.dataJson.actual_count = 0
        } else {
          this.dataJson.tempJson.actual_count = number
          this.dataJson.actual_count = number
        }
      }
    },
    // 监听数量
    'dataJson.actual_count': {
      handler () {
        this.reCalcCountByUnit()
        this.reCalcTotalPrice()
      }
    }
  },
  created () {
    this.init()
    // 初始化货主
    this.getOwnerData()
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
      this.getWeightControlConfig()

      // this.dataJson.tempJson = this.$route.params.routeParams

      // this.dataJson.tempJson.unit_id = null
      // this.dataJson.tempJson.unit = '吨'
      // this.settings.rules = this.settings.rulesOne

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
    // 皮重， 毛重开关
    getWeightControlConfig () {
      this.settings.loading = true
      getWeightControlConfigApi().then((_data) => {
        const data = _data.data
        this.settings.weight_control_config = data.weight_control_config === '1'
      }).finally(() => {
        this.settings.loading = false
      })
    },
    // 新增时的初始化
    initInsertModel () {
      // 数据初始化
      this.initTempJsonOriginal()
      this.dataJson.tempJson = deepCopy(this.dataJson.tempJsonOriginal)
      this.dataJson.tempJson.unit = '吨'

      // 获取单位数据
      getUnitSelectDataApi({ enable: true }).then((_data) => {
        if (isNotEmpty(_data.data)) {
          this.dataJson.unitList = _data.data.unit_datas
          // this.dataJson.tempJson.unit_data = _data.data.active_data
        }
      }, (_error) => {
      })

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
      this.getData()
      // this.dataJson.pounds = this.dataJson.tempJson.pound_files
      // this.dataJson.out_photos = this.dataJson.tempJson.out_photo_files
      // this.dataJson.tempJson = deepCopy(this.$route.params.routeParams)
      // this.dataJson.tempJsonOriginal = deepCopy(this.$route.params.routeParams)
      // this.dataJson.tempJson.hs_gx = this.dataJson.tempJsonOriginal.detailVo[0].hs_gx
      // 设置按钮
      this.settings.btnShowStatus.showUpdate = true
      // 控件focus
      // this.$nextTick(() => {
      // this.$refs['refFocusOne'].focus()
      // })
    },
    // 查看时的初始化
    initViewModel () {
      // 数据初始化
      // this.dataJson.tempJson = deepCopy(this.data)
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
      this.watch.unwatch_actual_count = this.$watch(
        'dataJson.tempJson.actual_count',
        (newVal, oldVal) => {
          this.reCalcCountByUnit()
          this.reCalcTotalPrice()
        },
      )
      // 监听出库单位,是否有变化，判断是否要显示单位换算按钮
      this.watch.unwatch_actual_price = this.$watch(
        'dataJson.tempJson.price',
        (newVal, oldVal) => {
          this.reCalcTotalPrice()
        },
      )
    },
    unWatch () {
      if (this.watch.unwatch_tempJson) {
        this.watch.unwatch_tempJson()
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
    // 出库操作
    doInsert () {
      // 开始综合验证
      // this.doValidateByTabs()
      this.$refs['dataSubmitForm'].validate(valid => {
        if (valid) {
          const tempData = deepCopy(this.dataJson.tempJson)
          this.settings.loading = true
          insertApi(tempData)
            .then(
              _data => {
                // this.$emit('closeMeOk', { return_flag: true, data: _data })
                this.$notify({
                  title: '新增成功',
                  message: _data.data.message,
                  type: 'success',
                  duration: this.settings.duration
                })
              },
              _error => {
                // this.$emit('closeMeOk', { return_flag: false, error: _error })
                this.$notify({
                  title: '新增失败',
                  message: _error.error.message,
                  type: 'error',
                  duration: this.settings.duration
                })
              }
            )
            .finally(() => {
              // this.settings.loading = false
              // this.$router.push({
              //   path: '/inandout/outplan', query: {}
              // })
              this.$emit('emitReturn')
            })
        }
      })
    },
    // 更新逻辑
    doUpdate () {
      this.$refs['dataSubmitForm'].validate(valid => {
        if (valid) {
          const tempData = deepCopy(this.dataJson.tempJson)
          this.settings.loading = true
          updateApi(tempData)
            .then(
              _data => {
                this.dataJson.tempJson = deepCopy(_data.data)
                this.$emit('emitReturn', { return_flag: true, data: _data })
              },
              _error => {
                // this.$emit('emitReturn', { return_flag: false, error: _error })
              }
            )
            .finally(() => {
              this.settings.loading = false
            })
        }
      })
    },
    handleTabsClick (tab, event) { },
    // 委托方
    handleConsignorDialog () {
      this.popSettingsData.searchDialogDataOne.visible = true
    },
    // 委托方：关闭对话框：确定
    handleConsignorCloseOk (val) {
      this.popSettingsData.searchDialogDataOne.selectedDataJson = val
      this.popSettingsData.searchDialogDataOne.visible = false
      this.settings.btnDisabledStatus.disabledUpdate = false
      this.dataJson.tempJson.consignor_code = val.code
      this.dataJson.tempJson.consignor_name = val.name
      this.dataJson.tempJson.consignor_id = val.id
    },
    // 委托方：关闭对话框：取消
    handleConsignorCloseCancel () {
      this.popSettingsData.searchDialogDataOne.visible = false
    },
    // 货主
    handleOwnerDialog () {
      this.popSettingsData.searchDialogDataTwo.visible = true
    },
    // // 货主：关闭对话框：确定
    // handleOwnerCloseOk (val) {
    //   this.popSettingsData.searchDialogDataTwo.selectedDataJson = val
    //   this.dataJson.tempJson.owner_name = val.name
    //   this.dataJson.tempJson.owner_id = val.id
    //   this.dataJson.tempJson.owner_code = val.code
    //   this.dataJson.searchForm.owner_id = val.id
    //   this.dataJson.searchForm.owner_name = val.name
    //   this.popSettingsData.searchDialogDataTwo.visible = false
    //   this.settings.btnDisabledStatus.disabledUpdate = false
    // },
    // 货主：关闭对话框：取消
    handleOwnerCloseCancel () {
      this.popSettingsData.searchDialogDataTwo.visible = false
    },

    // 订单
    handleOrderDialog () {
      this.popSettingsData.searchDialogDataEight.title = '订单选择页面'
      this.popSettingsData.searchDialogDataEight.visible = true
    },
    // 订单：关闭对话框：确定
    handleOrderCloseOk (val) {
      this.popSettingsData.searchDialogDataEight.selectedDataJson = val
      this.dataJson.tempJson.contract_no = val.contract_no
      this.dataJson.tempJson.bill_type = val.bill_type
      this.dataJson.tempJson.bill_type_name = val.bill_type_name
      this.dataJson.tempJson.contract_dt = val.contract_dt
      this.dataJson.tempJson.contract_num = val.contract_num
      this.dataJson.tempJson.client_name = val.customer_name
      this.dataJson.tempJson.client_id = val.customer_id
      this.dataJson.tempJson.ship_name = val.ship_name
      this.dataJson.tempJson.order_id = val.id
      this.dataJson.tempJson.order_type = val.type
      this.popSettingsData.searchDialogDataEight.visible = false
      this.settings.btnDisabledStatus.disabledUpdate = false
    },
    // 订单：关闭对话框：取消
    handleOrderCloseCancel () {
      this.popSettingsData.searchDialogDataEight.visible = false
    },

    // 规格
    handleSpecDialog () {
      if (this.dataJson.tempJson.owner_id === null || this.dataJson.tempJson.owner_id === undefined) {
        this.showErrorMsg('请先选择货主')
        return
      }
      if (this.dataJson.tempJson.owner_name === null || this.dataJson.tempJson.owner_name === undefined) {
        this.showErrorMsg('请先选择货主')
        return
      }
      this.popSettingsData.searchDialogDataFive.data = { owner_id: this.dataJson.tempJson.owner_id, owner_name: this.dataJson.tempJson.owner_name }
      this.popSettingsData.searchDialogDataFive.visible = true
    },
    // 规格：关闭对话框：确定
    handleSpecCloseOk (val) {
      this.getUnitDetail(val.sku_id)
      this.popSettingsData.searchDialogDataFive.selectedDataJson = val
      this.popSettingsData.searchDialogDataFive.visible = false
      this.settings.btnDisabledStatus.disabledUpdate = false
      this.dataJson.tempJson.spec = val.spec
      this.dataJson.tempJson.sku_code = val.sku_code
      this.dataJson.tempJson.goods_name = val.sku_name
      this.dataJson.tempJson.sku_id = val.sku_id
      this.dataJson.tempJson.warehouse_id = val.warehouse_id
      this.dataJson.tempJson.warehouse_name = val.warehouse_name
      this.dataJson.tempJson.location_id = val.location_id
      this.dataJson.tempJson.bin_id = val.bin_id
      this.dataJson.tempJson.qty_avaible = val.qty_avaible
      this.dataJson.tempJson.pm = val.pm

      this.dataJson.searchForm.reset = !this.dataJson.searchForm.reset

      // 判断所选择的商品规格，单位是否需要换算
      this.showUnitHelpButton()
    },
    getUnitDetail (val) {
      const param = { sku_id: val }
      getListApi(param).then((_data) => {
        // 如果有一个， 只取一个单位， 如果有两个， 只取单位 吨
        let unitData = null
        if (_data.data.length === 1) {
          unitData = _data.data[0]
        } else if (_data.data.length === 2) {
          for (let i = 0; i < _data.data.length; i++) {
            if (_data.data[i].src_unit === '吨') {
              unitData = _data.data[i]
            }
          }
        }
        if (unitData !== null) {
          this.dataJson.tempJson.unit_id = unitData.src_unit_id
          this.dataJson.tempJson.unit_name = unitData.src_unit
          this.dataJson.tempJson.unitData = deepCopy(unitData)
        } else {
          this.dataJson.tempJson.unit_id = unitData.src_unit_id
          this.dataJson.tempJson.unit_name = unitData.src_unit
          this.dataJson.tempJson.unitData = { content: '' }
          this.showErrorMsg('当前商品没有单位')
        }
      }, (_error) => {
      })
    },
    // 规格：关闭对话框：取消
    handleSpecCloseCancel () {
      this.popSettingsData.searchDialogDataFive.visible = false
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
      // 强制更新DOM
      // this.dataJson.tempJson.splice(_index, 1)
    },

    // 商品单价验证
    checkPrice (rule, value, callback) {
      if (this.dataJson.tempJson.price < 0) {
        callback(new Error('商品单价不能为负数'))
      } else {
        callback()
      }
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
      const _index = this.dataJson.out_photo_file.lastIndexOf(val)
      // 从数组中移除
      this.dataJson.out_photos.splice(_index, 1)
      this.dataJson.out_photo_file.splice(_index, 1)
    },
    // 弹出框关闭
    handleDialogClose () {
      this.settings.visible = false
    },
    // 单位换算帮助按钮
    showUnitHelpButton () {
      // 获取单位
      // 判断是否存在单位换算
      getCountApi({ 'sku_id': this.dataJson.tempJson.sku_id }).then(response => {
        if (response.data >= 0) {
          this.settings.btnUnitStatus.showInsert = true
          this.settings.btnUnitStatus.showUnit = false
        } else {
          this.settings.btnUnitStatus.showInsert = false
          this.settings.btnUnitStatus.showUnit = true
        }
        if (response.data === 1) {
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
        }
      }).finally(() => {
      })
    },
    handleUnitInsert () {
      // 修改
      this.popSettingsData.unitCalculatorDialog.visible = true
    },
    handleUnitCalculator () {
      // 修改
      this.popSettingsData.unitCalculatorDialog.visible = true
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
    // 出库数量换算逻辑
    reCalcCountByUnit () {
      if ((isNotEmpty(this.dataJson.tempJson.actual_count)) &&
        (this.dataJson.tempJson.actual_count > 0) &&
        isNotEmpty(this.dataJson.tempJson.unitData)) {
        this.dataJson.tempJson.actual_weight = this.dataJson.tempJson.unitData.calc * this.dataJson.tempJson.actual_count
      } else {
        this.dataJson.tempJson.actual_weight = 0
      }
      this.$forceUpdate()
    },
    // 计算出库金额
    reCalcTotalPrice () {
      if ((isNotEmpty(this.dataJson.tempJson.price)) &&
        (isNotEmpty(this.dataJson.tempJson.actual_count))) {
        this.dataJson.tempJson.amount = this.dataJson.tempJson.price * this.dataJson.tempJson.actual_count
      } else {
        this.dataJson.tempJson.amount = 0
      }
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
    handleWLBDialogClose () {
      this.settings.visible = false
    },
    handleWLBReturnData (val) {
      if (!isNotEmpty(val)) {
        this.dataJson.tempJson.wlb_data = undefined
        // 仓库
        this.dataJson.tempJson.warehouse_id = undefined
        this.dataJson.tempJson.warehouse_name = undefined
        // 库区
        this.dataJson.tempJson.location_id = undefined
        this.dataJson.tempJson.location_name = undefined

        // 库位
        this.dataJson.tempJson.bin_id = undefined
        this.dataJson.tempJson.bin_name = undefined
      } else {
        this.dataJson.tempJson.wlb_data = val
        // 仓库
        this.dataJson.tempJson.warehouse_id = val.warehouse_id
        this.dataJson.tempJson.warehouse_name = val.warehouse_name
        this.dataJson.tempJson.warehouse_code = val.warehouse_code

        // 库区
        this.dataJson.tempJson.location_id = val.location_id
        this.dataJson.tempJson.location_name = val.location_name
        this.dataJson.tempJson.location_code = val.location_code

        // 库位
        this.dataJson.tempJson.bin_id = val.id
        this.dataJson.tempJson.bin_name = val.name
        this.dataJson.tempJson.bin_code = val.code
      }
    },
    /**
   * 出库数量check
   */
    in_qty_validator (rule, value, callback) {
      if (value <= 0) {
        callback(new Error('出库数量不能为0'))
      } else {
        callback()
      }
    },
    /**
   * 出库单价check
   */
    price_validator (rule, value, callback) {
      if (value <= 0) {
        callback(new Error('请输入出库单价'))
      } else {
        callback()
      }
    },
    /**
     * 出库单位check
     */
    unit_id_validator (rule, value, callback) {
      if (!isNotEmpty(this.dataJson.tempJson.unit_id)) {
        callback(new Error('请输入出库单位'))
      } else {
        callback()
      }
    },
    getData () {
      // 查询逻辑
      this.settings.loading = true
      getApi(this.data).then(response => {
        this.dataJson.tempJson = deepCopy(response.data)
        this.dataJson.tempJsonOriginal = deepCopy(response.data)
        this.dataJson.tempJson.unitData = this.data.unitData
        this.dataJson.tempJson.idx = this.data.idx
        this.dataJson.pounds = this.dataJson.tempJson.pound_files ? this.dataJson.tempJson.pound_files : []
        this.dataJson.out_photos = this.dataJson.tempJson.out_photo_files ? this.dataJson.tempJson.out_photo_files : []

        if (this.dataJson.tempJson.pound_files) {
          this.dataJson.pound_file = this.dataJson.tempJson.pound_files.map(item => item.url)
        }
        if (this.dataJson.tempJson.out_photo_files) {
          this.dataJson.out_photo_file = this.dataJson.tempJson.out_photo_files.map(item => item.url)
        }
        this.dataJson.tempJson.unitData = { unit_id: this.data.unit_id, unit_name: this.data.unit_name, calc: this.data.calc }
      }).finally(() => {
        this.settings.loading = false
      })
    },
    // 选择货主
    getOwnerData () {
      getOwnerComboListApi().then((_data) => {
        this.dataJson.ownerComboList = _data.data
        // 新增时默认选中第一条
        if (this.PARAMETERS.STATUS_INSERT === this.editStatus) {
          this.dataJson.tempJson.owner_name = _data.data[0].short_name
          this.dataJson.tempJson.owner_id = _data.data[0].id
          this.dataJson.tempJson.owner_code = _data.data[0].code
        }
      }, (_error) => {
      })
    },
    selectOwner (val) {
      if (val == null || val === '') {
        this.dataJson.tempJson.owner_name = null
        this.dataJson.tempJson.owner_code = null
      } else {
        this.dataJson.tempJson.owner_id = val
        var owner = this.dataJson.ownerComboList.find((item) => {
          return item.id === val
        })
        this.dataJson.tempJson.owner_name = owner.short_name
        this.dataJson.tempJson.owner_code = owner.code
      }
    },
    checkWarehouse (rule, value, callback) {
      if (!isNotEmpty(this.dataJson.tempJson.warehouse_id)) {
        callback(new Error('请选择仓库'))
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
    }
  }

}
</script>
