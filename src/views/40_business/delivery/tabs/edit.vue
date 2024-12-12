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

          <el-descriptions-item label="入库单号">
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
                :disabled="isUpdateModel && isViewModel"
                @onInputSearch="handleConsignorDialog"
              />
            </el-form-item>
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
                v-if="settings.btnShowStatus.showInsert || settings.btnShowStatus.showUpdate"
                v-model.trim="dataJson.tempJson.owner_name"
                :disabled="isUpdateModel && isViewModel"
                @onInputSearch="handleOwnerDialog"
              /> -->
              <el-select
                v-if="settings.btnShowStatus.showInsert || settings.btnShowStatus.showUpdate"
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
          <el-descriptions-item label="物料编码">
            {{ dataJson.tempJson.spec_code == null?'-':dataJson.tempJson.spec_code }}
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
                v-if="settings.btnShowStatus.showInsert || settings.btnShowStatus.showUpdate"
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

          <el-descriptions-item>
            <div
              slot="label"
              class="required-mark"
            >
              入库类型
            </div>
            <el-form-item
              prop="type"
              label-width="0"
            >
              <select-dict
                v-model="dataJson.tempJson.type"
                :value="dataJson.tempJson.type"
                :para="CONSTANTS.DICT_B_DELIVERY_TYPE"
                init-placeholder="请选择"
                :disabled="isViewModel"
                style="width:100%"
              />
            </el-form-item>
          </el-descriptions-item>
          <el-descriptions-item />

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
          :content-style="contentStyle"
          :label-style="labelStyle"
          direction="horizontal"
          border
          style="padding-right: 10px;padding-left: 10px;"
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

          <el-descriptions-item label="单据类型">
            {{ dataJson.tempJson.bill_type_name == null?'-':dataJson.tempJson.bill_type_name }}
          </el-descriptions-item>

          <el-descriptions-item label="合同日期">
            {{ dataJson.tempJson.contract_dt == null?'-':formatDate(dataJson.tempJson.contract_dt) }}
          </el-descriptions-item>

          <el-descriptions-item label="船名">
            {{ dataJson.tempJson.ship_name == null?'-':dataJson.tempJson.ship_name }}
          </el-descriptions-item>

          <el-descriptions-item label="供应商">
            {{ dataJson.tempJson.customer_name == null?'-':dataJson.tempJson.customer_name }}
          </el-descriptions-item>

          <el-descriptions-item label="合同量">
            {{ dataJson.tempJson.contract_num == null?'-':dataJson.tempJson.contract_num }}
          </el-descriptions-item>

        </el-descriptions>

        <br>
        <el-alert
          title="入库单信息"
          type="info"
          :closable="false"
        />
        <br>

        <el-form
          ref="dataSubmitForm"
          :rules="settings.rules"
          :model="dataJson.tempJson"
          label-position="right"
          label-width="150px"
          status-icon
        >
          <!--        毛皮净开关未开启-->
          <el-descriptions
            v-if="!settings.weight_control_config"
            title=""
            :column="3"
            :label-style="labelStyle"
            :content-style="contentStyle"
            direction="horizontal"
            border
            style="padding-right: 10px;padding-left: 10px;"
          >
            <el-descriptions-item>
              <div
                slot="label"
                class="required-mark"
              >
                入库仓库/库区/库位
              </div>
              <el-form-item prop="warehouse_name" label-width="0">
                <select-warehouse
                  v-model.trim="dataJson.tempJson.warehouse_name"
                  placement="left"
                  :disabled="isViewModel"
                  :warehouse1="dataJson.tempJson.warehouse_id"
                  @closeParentDialog="handleDialogClose"
                  @onReturnData="handleWLBReturnData"
                />
              </el-form-item>
            </el-descriptions-item>
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
            <el-descriptions-item />

            <el-descriptions-item>
              <div
                slot="label"
                class="required-mark"
              >
                数量
                <el-tooltip
                  v-if="settings.showTips"
                  class="item"
                  effect="dark"
                  placement="bottom"
                >
                  <div slot="content">
                    此处请填写升贴水数量
                  </div>
                  <svg-icon
                    icon-class="perfect-icon-question1_btn"
                    style="margin-left: 5px"
                  />
                </el-tooltip>
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
                提货时间
              </div>
              <el-form-item
                prop="inbound_time"
                label-width="0"
              >
                <el-date-picker
                  v-model="dataJson.tempJson.inbound_time"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  type="datetime"
                  clearable
                  :disabled="isViewModel"
                  placeholder="选择日期"
                  style="width: 100%"
                />
              </el-form-item>
            </el-descriptions-item>
            <el-descriptions-item>
              <div slot="label">
                商品单价
              </div>
              <el-form-item
                prop="price"
                label-width="0"
              >
                <numeric
                  v-model="dataJson.tempJson.price"
                  :decimal-places="2"
                />
              </el-form-item>
            </el-descriptions-item>
            <el-descriptions-item label="商品总价">
              <numeric
                v-model="dataJson.tempJson.amount"
                :decimal-places="2"
                :disabled="true"
              />
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
          </el-descriptions>

          <el-descriptions
            v-if="settings.weight_control_config"
            title=""
            :column="3"
            :label-style="labelStyle"
            :content-style="contentStyle"
            direction="horizontal"
            border
            style="padding-right: 10px;padding-left: 10px;"
          >
            <el-descriptions-item>
              <div
                slot="label"
                class="required-mark"
              >
                入库仓库/库区/库位
              </div>
              <el-form-item prop="warehouse_name" label-width="0">
                <select-warehouse
                  v-model.trim="dataJson.tempJson.warehouse_name"
                  placement="left"
                  :disabled="isViewModel"
                  :warehouse1="dataJson.tempJson.warehouse_id"
                  @closeParentDialog="handleDialogClose"
                  @onReturnData="handleWLBReturnData"
                />
              </el-form-item>
            </el-descriptions-item>

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
            <el-descriptions-item />

            <el-descriptions-item>
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
            <el-descriptions-item>
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
                <el-tooltip
                  v-if="settings.showTips"
                  class="item"
                  effect="dark"
                  placement="bottom"
                >
                  <div slot="content">
                    此处请填写升贴水数量
                  </div>
                  <svg-icon
                    icon-class="perfect-icon-question1_btn"
                    style="margin-left: 5px"
                  />
                </el-tooltip>
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
                提货时间
              </div>
              <el-form-item
                prop="inbound_time"
                label-width="0"
              >
                <el-date-picker
                  v-model="dataJson.tempJson.inbound_time"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  type="datetime"
                  clearable
                  :disabled="isViewModel"
                  placeholder="选择日期"
                  style="width: 100%"
                />
              </el-form-item>
            </el-descriptions-item>

            <el-descriptions-item>
              <div slot="label">
                商品单价
              </div>
              <el-form-item
                prop="price"
                label-width="0"
              >
                <numeric
                  v-model="dataJson.tempJson.price"
                  :decimal-places="2"
                />
              </el-form-item>
            </el-descriptions-item>
            <el-descriptions-item label="商品总价">
              <numeric
                v-model="dataJson.tempJson.amount"
                :decimal-places="2"
                :disabled="true"
              />
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
            <!--          <el-descriptions-item label="入库单位">{{ dataJson.tempJson.unit_name }}</el-descriptions-item>-->

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
            <el-descriptions-item label="提货明细附件">
              <el-row style="display: flex;flex-wrap: wrap;">
                <el-col>
                  <Simple-upload-mutil-file
                    :accept="'*'"
                    @upload-success="handleGoodsUploadFileSuccess"
                    @upload-error="handleGoodsUploadFileError"
                  />
                </el-col>
                <el-col
                  v-for="(item, i) in dataJson.goods"
                  :key="i"
                  :offset="1"
                  :span="4"
                >
                  <previewCard
                    :file-name="item.fileName"
                    :url="item.url"
                    :time="item.timestamp"
                    @removeFile="removeGoodsFile"
                  />
                </el-col>
              </el-row>
            </el-descriptions-item>

            <el-descriptions-item label="检验单">
              <el-row style="display: flex;flex-wrap: wrap;">
                <el-col>
                  <Simple-upload-mutil-file
                    :accept="'*'"
                    @upload-success="handleInspectionUploadFileSuccess"
                    @upload-error="handleInspectionUploadFileError"
                  />
                </el-col>
                <el-col
                  v-for="(item, i) in dataJson.inspections"
                  :key="i"
                  :offset="1"
                  :span="4"
                >
                  <previewCard
                    :file-name="item.fileName"
                    :url="item.url"
                    :time="item.timestamp"
                    @removeFile="removeInspectionFile"
                  />
                </el-col>
              </el-row>
            </el-descriptions-item>
            <el-descriptions-item label="提货照片">
              <el-row style="display: flex;flex-wrap: wrap;">
                <el-col>
                  <Simple-upload-mutil-file
                    :accept="'*'"
                    @upload-success="handlePhotoUploadFileSuccess"
                    @upload-error="handlePhotoUploadFileError"
                  />
                </el-col>
                <el-col
                  v-for="(item, i) in dataJson.photos"
                  :key="i"
                  :offset="1"
                  :span="4"
                >
                  <previewCard
                    :file-name="item.fileName"
                    :url="item.url"
                    :time="item.timestamp"
                    @removeFile="removePhotoFile"
                  />
                </el-col>
              </el-row>
            </el-descriptions-item>
          </el-descriptions>
          <br>

        </el-form>

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
        :disabled="settings.loading"
        size="medium"
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

    <spec-dialog
      v-if="popSettingsData.searchDialogDataFive.visible"
      :visible="popSettingsData.searchDialogDataFive.visible"
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
import InputSearch from '@/components/40_input/inputSearch'
import SelectDict from '@/components/00_dict/select/SelectDict'
import constants_para from '@/common/constants/constants_para'
import elDragDialog from '@/directive/el-drag-dialog'
import deepCopy from 'deep-copy'
import { getApi, updateApi } from '@/api/40_business/delivery/delivery'
import consignorDialog from '@/views/30_wms/customer/dialog/dialog'
import ownerDialog from '@/views/30_wms/owner/dialog/dialog'
import orderDialog from '@/views/40_business/inorder/dialog/dialog'
import specDialog from '@/views/30_wms/spec/dialog/dialog'
import SimpleUploadMutilFile from '@/components/10_file/SimpleUploadMutilFile'
import previewCard from '@/components/50_preview_card/preview_card'
import numeric from '@/components/40_input/numeric'
import { getUnitSelectDataApi } from '@/api/30_wms/unit/unit'
import { isNotEmpty } from '@/utils'
import { getCountApi, getDetailApi, getOnlyOneUnitCalcApi } from '@/api/30_wms/spec/unit/unitCalc'
import unitCalculatorDialog from '@/views/30_wms/spec/unit/unitCalculator/unitCalculator'
import { getOwnerComboListApi } from '@/api/30_wms/owner/owner'
import { getWeightControlConfigApi } from '@/api/40_business/inplan/inplan'
import SelectWarehouse from '@/views/30_wms/warehouse/selectgrid/selectWarehouseLocationBin.vue'
export default {
  components: { SelectWarehouse, InputSearch, orderDialog, SelectDict, consignorDialog, ownerDialog, specDialog, previewCard, SimpleUploadMutilFile, numeric, unitCalculatorDialog },
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
        // 弹出的合同订单查询框参数设置
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
        // 磅单文件
        pounds: [],
        pound_file: [],
        // 入库明细
        photos: [],
        photo_file: [],
        // 检验单
        inspections: [],
        inspection_file: [],
        // 货物照片
        goods: [],
        goods_file: [],

        // 级联选择器数据
        cascader: {
          data: null,
          value: ''
        },
        unitList: null,
        searchForm: {
          reset: null
        },
        // 单条数据 json的，初始化原始数据
        tempJsonOriginal: {
          id: null,
          name: '',
          config_key: '',
          value: '',
          descr: '',
          warehouse_name: '',
          // unit_data: null,
          unit_id: null,
          unit_name: null,
          consignor_name: null,
          owner_name: null,
          goods_name: null,
          sku_id: null,
          wlb_data: null,
          actual_count: 0,
          gross_weight: 0,
          tare_weight: 0,
          contract_no: null
        },
        // 单条数据 json
        tempJson: {
          id: null,
          name: '',
          config_key: '',
          value: '',
          descr: '',
          warehouse_name: '',
          // unit_data: null,
          unit_id: null,
          unit_name: null,
          consignor_name: null,
          owner_name: null,
          goods_name: null,
          sku_id: null,
          wlb_data: null,
          actual_count: 0,
          gross_weight: 0,
          tare_weight: 0,
          contract_no: null
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
            remark: 100
          }
        }
      },
      // 页面设置json
      settings: {
        // loading 状态
        loading: true,
        // 皮重, 毛重控制开关
        weight_control_config: false,
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
        btnDisabledStatus: {
          disabledInsert: true,
          disabledUpdate: true
        },
        // 以下为pop的内容：数据弹出框
        selection: [],
        dialogStatus: this.editStatus,
        // pop的check内容
        rules: {
          owner_name: [
            { required: true, message: '请选择货主', trigger: 'change' }
          ],
          consignor_name: [
            { required: true, message: '请选择委托方', trigger: 'change' }
          ],
          type: [
            { required: true, message: '请选择入库类型', trigger: 'change' }
          ],
          wlb_data: [
            // { required: true, message: '请输入入库仓库/库区/库位', trigger: 'change' }
            { validator: this.wlb_data_validator, trigger: 'blur' }
          ],
          inbound_time: [
            { required: true, message: '请输入入库时间', trigger: 'change' }
          ],
          goods_name: [
            { required: true, message: '请选择物料', trigger: 'change' }
          ],
          actual_count: [
            { required: true, message: '请输入入库数量', trigger: 'change' },
            { validator: this.in_qty_validator, trigger: 'blur' }
          ],
          unit_id: [
            { validator: this.unit_id_validator, trigger: 'blur' }
          ],
          primary_quantity: [
            { required: true, message: '请输入原发数量', trigger: 'change' },
            { validator: this.original_qty_validator, trigger: 'blur' }
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
      this.initButtonShowStatus()
      this.initButtonDisabledStatus()
      this.getWeightControlConfig()
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
    // 皮重, 毛重控制开关
    getWeightControlConfig () {
      this.settings.loading = true
      getWeightControlConfigApi().then((_data) => {
        const data = _data.data

        if (data.weight_control_config === '1') {
          this.settings.weight_control_config = true
        }
      }).finally(() => {
        this.settings.loading = false
      })
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

      // 获取单位数据
      getUnitSelectDataApi({ enable: true }).then((_data) => {
        if (isNotEmpty(_data.data)) {
          this.dataJson.unitList = _data.data.unit_datas
          // this.dataJson.tempJson.unit_data = _data.data.active_data
        }
      }, (_error) => {
      })

      this.settings.loading = false
      // 设置按钮
      this.settings.btnShowStatus.showInsert = true
    },
    // 更新打开页面
    initUpdateModel () {
      this.dataJson.tempJson.warehouse_id = this.data.warehouse_id
      this.getData()
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
      this.dataJson.tempJson = deepCopy(this.data)

      this.dataJson.pounds = this.dataJson.tempJson.pound_files
      this.dataJson.photos = this.dataJson.tempJson.photo_files
      this.dataJson.goods = this.dataJson.tempJson.goods_files
      this.dataJson.inspections = this.dataJson.tempJson.inspection_files
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
      // 监听入库单位,是否有变化，判断是否要显示单位换算按钮
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
    // 更新逻辑
    doUpdate () {
      // 开始综合验证
      this.$refs['dataSubmitForm'].validate(valid => {
        if (valid) {
          const tempData = deepCopy(this.dataJson.tempJson)
          if (!this.settings.weight_control_config) {
            tempData.gross_weight = null
            tempData.tare_weight = null
          }
          if (tempData.unit_id === null || tempData.unit_id === undefined) {
            this.showErrorMsg('当前商品没有单位, 需重新选择商品')
            return
          }
          this.settings.loading = true
          updateApi(tempData)
            .then(
              _data => {
                this.dataJson.tempJson = deepCopy(_data.data)

                this.$notify({
                  title: '提货单修改成功',
                  message: '提货单修改成功',
                  type: 'success',
                  duration: this.settings.duration
                })

                this.$emit('emitReturn', { return_flag: true, data: _data })
              },
              _error => {
                this.$notify({
                  title: '提货单修改失败',
                  message: '提货单修改失败',
                  type: 'error',
                  duration: this.settings.duration
                })
                // this.$emit('emitReturn', { return_flag: false, error: _error })
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
    // 委托方
    handleConsignorDialog () {
      this.popSettingsData.searchDialogDataOne.visible = true
    },
    // 委托方：关闭对话框：确定
    handleConsignorCloseOk (val) {
      this.popSettingsData.searchDialogDataOne.selectedDataJson = val
      this.dataJson.tempJson.consignor_id = val.id
      this.dataJson.tempJson.consignor_name = val.name
      this.dataJson.tempJson.consignor_code = val.code
      this.popSettingsData.searchDialogDataOne.visible = false
      this.settings.btnDisabledStatus.disabledUpdate = false
    },
    // 委托方：关闭对话框：取消
    handleConsignorCloseCancel () {
      this.popSettingsData.searchDialogDataOne.visible = false
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
    // 仓库
    handleWarehouseDialog () {
      this.popSettingsData.searchDialogDataFour.visible = true
    },
    // 仓库：关闭对话框：确定
    handleWarehouseCloseOk (val) {
      this.popSettingsData.searchDialogDataFour.selectedDataJson = val
      this.popSettingsData.searchDialogDataFour.visible = false
      this.settings.btnDisabledStatus.disabledUpdate = false
      this.dataJson.tempJson.warehouse_name = val.name
      this.dataJson.tempJson.warehouse_id = val.id
    },
    // 仓库：关闭对话框：取消
    handleWarehouseCloseCancel () {
      this.popSettingsData.searchDialogDataFour.visible = false
    },
    // 规格
    handleSpecDialog () {
      this.popSettingsData.searchDialogDataFive.visible = true
    },
    // 规格：关闭对话框：确定
    handleSpecCloseOk (val) {
      // this.getUnitDetail(val.id)
      this.popSettingsData.searchDialogDataFive.selectedDataJson = val
      this.popSettingsData.searchDialogDataFive.visible = false
      this.settings.btnDisabledStatus.disabledUpdate = false
      this.dataJson.tempJson.spec = val.spec
      this.dataJson.tempJson.spec_code = val.code
      this.dataJson.tempJson.pm = val.pm
      this.dataJson.tempJson.goods_name = val.goods_name
      this.dataJson.tempJson.sku_id = val.id
      // 判断所选择的商品规格，单位是否需要换算
      this.showUnitHelpButton()
    },

    // 规格：关闭对话框：取消
    handleSpecCloseCancel () {
      this.popSettingsData.searchDialogDataFive.visible = false
    },
    // 库区
    handleLocationDialog () {
      if (this.dataJson.tempJson.warehouse_id === null || this.dataJson.tempJson.warehouse_id === undefined) {
        this.showErrorMsg('请先选择仓库')
        return
      }
      this.popSettingsData.searchDialogDataSix.visible = true
    },
    // 库区：关闭对话框：确定
    handleLocationCloseOk (val) {
      this.popSettingsData.searchDialogDataSix.selectedDataJson = val
      this.popSettingsData.searchDialogDataSix.visible = false
      this.settings.btnDisabledStatus.disabledUpdate = false
      this.dataJson.tempJson.location_name = val.name
      this.dataJson.tempJson.location_id = val.id
    },
    // 库区：关闭对话框：取消
    handleLocationCloseCancel () {
      this.popSettingsData.searchDialogDataSix.visible = false
    },
    // 库位
    handleBinDialog () {
      if (this.dataJson.tempJson.location_id === null || this.dataJson.tempJson.location_id === undefined) {
        this.showErrorMsg('请先选择库区')
        return
      }
      this.popSettingsData.searchDialogDataSeven.visible = true
    },
    // 库位：关闭对话框：确定
    handleBinCloseOk (val) {
      this.popSettingsData.searchDialogDataSeven.selectedDataJson = val
      this.popSettingsData.searchDialogDataSeven.visible = false
      this.settings.btnDisabledStatus.disabledUpdate = false
      this.dataJson.tempJson.bin_name = val.name
      this.dataJson.tempJson.bin_id = val.id
    },
    // 库位：关闭对话框：取消
    handleBinCloseCancel () {
      this.popSettingsData.searchDialogDataSeven.visible = false
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
      this.dataJson.tempJson.customer_id = val.customer_id
      this.dataJson.tempJson.customer_name = val.customer_name
      this.dataJson.tempJson.customer_code = val.customer_code
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
      // this.dataJson.tempJson.splice(_index, 1)
    },

    // 入库明细附件上传成功
    handlePhotoUploadFileSuccess (res) {
      res.response.data.timestamp = res.response.timestamp
      this.dataJson.photos.push(res.response.data)
      this.dataJson.photo_file.push(res.response.data.url)
      this.dataJson.tempJson.photo_files = this.dataJson.photos
    },
    // 入库明细附件上传失败
    handlePhotoUploadFileError () {
      console.debug('文件上传失败')
      this.$notify({
        title: '上传错误',
        message: '文件上传发生错误！',
        type: 'error',
        duration: 0
      })
    },
    // 删除入库明细附件文件
    removePhotoFile (val) {
      // 获取下标
      const _index = this.dataJson.photo_file.lastIndexOf(val)
      // 从数组中移除
      this.dataJson.photos.splice(_index, 1)
      this.dataJson.photo_file.splice(_index, 1)
      // this.dataJson.photo_files.splice(_index, 1)
    },

    // 检验单上传成功
    handleInspectionUploadFileSuccess (res) {
      res.response.data.timestamp = res.response.timestamp
      this.dataJson.inspections.push(res.response.data)
      this.dataJson.inspection_file.push(res.response.data.url)
      this.dataJson.tempJson.inspection_files = this.dataJson.inspections
    },
    // 检验单上传失败
    handleInspectionUploadFileError () {
      console.debug('文件上传失败')
      this.$notify({
        title: '上传错误',
        message: '文件上传发生错误！',
        type: 'error',
        duration: 0
      })
    },
    // 删除检验单文件
    removeInspectionFile (val) {
      // 获取下标
      const _index = this.dataJson.inspection_file.lastIndexOf(val)
      // 从数组中移除
      this.dataJson.inspections.splice(_index, 1)
      this.dataJson.inspection_file.splice(_index, 1)
      // this.dataJson.inspection_files.splice(_index, 1)
    },

    // 货物照片上传成功
    handleGoodsUploadFileSuccess (res) {
      res.response.data.timestamp = res.response.timestamp
      this.dataJson.goods.push(res.response.data)
      this.dataJson.goods_file.push(res.response.data.url)
      this.dataJson.tempJson.goods_files = this.dataJson.goods
    },
    // 货物照片上传失败
    handleGoodsUploadFileError () {
      console.debug('文件上传失败')
      this.$notify({
        title: '上传错误',
        message: '文件上传发生错误！',
        type: 'error',
        duration: 0
      })
    },
    // 删除货物照片
    removeGoodsFile (val) {
      // 获取下标
      const _index = this.dataJson.goods_file.lastIndexOf(val)
      // 从数组中移除
      this.dataJson.goods.splice(_index, 1)
      this.dataJson.goods_file.splice(_index, 1)
      // this.dataJson.goods_files.splice(_index, 1)
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
    // 入库数量换算逻辑
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
    // 计算入库金额
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
    // 选择货主
    getOwnerData () {
      getOwnerComboListApi().then((_data) => {
        this.dataJson.ownerComboList = _data.data
        // 默认选中第一条
        if (constants_para.STATUS_INSERT === this.settings.dialogStatus) {
          this.dataJson.tempJson.owner_code = _data.data[0].code
          this.dataJson.tempJson.owner_name = _data.data[0].short_name
          this.dataJson.tempJson.owner_id = _data.data[0].id
        }
      }, (_error) => {
      })
    },
    selectOwner (val) {
      this.dataJson.tempJson.owner_id = val
      var owner = this.dataJson.ownerComboList.find((item) => {
        return item.id === val
      })
      this.dataJson.tempJson.owner_code = owner.code
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
     * 入库数量check
     */
    in_qty_validator (rule, value, callback) {
      if (value <= 0) {
        callback(new Error('入库数量需大于0'))
      } else {
        callback()
      }
    },
    // 入库仓库验证
    wlb_data_validator (rule, value, callback) {
      if (this.dataJson.tempJson.warehouse_id) {
        callback()
      } else {
        callback(new Error('请输入入库仓库/库区/库位'))
      }
    },
    /**
     * 原发数量check
     */
    original_qty_validator (rule, value, callback) {
      if (value <= 0) {
        callback(new Error('请输入原发数量'))
      } else {
        callback()
      }
    },
    /**
     * 原发数量check
     */
    vehicle_qty_validator (rule, value, callback) {
      if (value <= 0) {
        callback(new Error('请输入实收车数'))
      } else {
        callback()
      }
    },
    /**
     * 入库单价check
     */
    price_validator (rule, value, callback) {
      if (value <= 0) {
        callback(new Error('请输入入库单价'))
      } else {
        callback()
      }
    },
    /**
     * 入库单位check
     */
    unit_id_validator (rule, value, callback) {
      if (!isNotEmpty(value)) {
        callback(new Error('请输入入库单位'))
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
    getData () {
      // 查询逻辑
      this.settings.loading = true
      getApi(this.data).then(response => {
        this.dataJson.tempJson = deepCopy(response.data)
        this.dataJson.tempJsonOriginal = deepCopy(response.data)
        this.dataJson.tempJson.idx = this.data.idx

        this.dataJson.pounds = (this.dataJson.tempJson.pound_files && this.dataJson.tempJson.pound_files.length) ? this.dataJson.tempJson.pound_files : []
        this.dataJson.photos = (this.dataJson.tempJson.photo_files && this.dataJson.tempJson.photo_files.length) ? this.dataJson.tempJson.photo_files : []
        this.dataJson.goods = (this.dataJson.tempJson.goods_files && this.dataJson.tempJson.goods_files.length) ? this.dataJson.tempJson.goods_files : []
        this.dataJson.inspections = (this.dataJson.tempJson.inspection_files && this.dataJson.tempJson.inspection_files.length) ? this.dataJson.tempJson.inspection_files : []

        if (this.dataJson.tempJson.pound_files) {
          this.dataJson.pound_file = this.dataJson.tempJson.pound_files.map(item => item.url)
        }
        if (this.dataJson.tempJson.photo_files) {
          this.dataJson.photo_file = this.dataJson.tempJson.photo_files.map(item => item.url)
        }
        if (this.dataJson.tempJson.goods_files) {
          this.dataJson.goods_file = this.dataJson.tempJson.goods_files.map(item => item.url)
        }
        if (this.dataJson.tempJson.inspection_files) {
          this.dataJson.inspection_file = this.dataJson.tempJson.inspection_files.map(item => item.url)
        }

        if (this.dataJson.tempJson.gross_weight === null || this.dataJson.tempJson.gross_weight === undefined) {
          this.dataJson.tempJson.gross_weight = this.dataJson.tempJson.actual_count
        }
        if (this.dataJson.tempJson.tare_weight === null || this.dataJson.tempJson.tare_weight === undefined) {
          this.dataJson.tempJson.tare_weight = 0
        }
      }).finally(() => {
        this.settings.loading = false
      })
    }

  }

}
</script>
