<template>
  <div
    v-loading="settings.loading"
    class="app-container"
  >
    <div class="edit-container">
      <el-alert
        title="入库计划基本信息"
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
        <el-descriptions-item label="入库单号">
          系统自动生成
        </el-descriptions-item>
        <el-descriptions-item label="序号">{{ dataJson.tempJson.idx }}</el-descriptions-item>
        <el-descriptions-item label="入库类型">{{ dataJson.tempJson.type_name }}</el-descriptions-item>
        <el-descriptions-item label="委托方">{{ dataJson.tempJson.consignor_name }}</el-descriptions-item>
        <el-descriptions-item label="货主">{{ dataJson.tempJson.owner_name }}</el-descriptions-item>
        <el-descriptions-item label="物料编码">{{ dataJson.tempJson.spec_code }}</el-descriptions-item>
        <el-descriptions-item label="物料名称">{{ dataJson.tempJson.goods_name }}</el-descriptions-item>
        <el-descriptions-item label="品名">{{ dataJson.tempJson.pm }}</el-descriptions-item>
        <el-descriptions-item label="规格">{{ dataJson.tempJson.spec }}</el-descriptions-item>
        <el-descriptions-item label="计划入库数量">{{ dataJson.tempJson.count == null?'':formatNumber(dataJson.tempJson.count,true,2) }}</el-descriptions-item>
        <el-descriptions-item label="单位">{{ dataJson.tempJson.unit_name }}</el-descriptions-item>
        <el-descriptions-item label="已入库数量">{{ dataJson.tempJson.has_handle_count == null?'':formatNumber(dataJson.tempJson.has_handle_count,true,2) }}</el-descriptions-item>
        <el-descriptions-item label="待入库数量">{{ dataJson.tempJson.pending_count == null?'':formatNumber(dataJson.tempJson.pending_count,true,2) }}</el-descriptions-item>
        <el-descriptions-item label="备注">{{ dataJson.tempJson.remark }}</el-descriptions-item>
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
        :label-style="labelStyle"
        :content-style="contentStyle"
        direction="horizontal"
        border
        style="padding-right: 10px;padding-left: 10px;"
      >
        <el-descriptions-item
          label-class-name=""
          label="合同编号"
        >
          {{ dataJson.tempJson.contract_no == null?'-':dataJson.tempJson.contract_no }}
        </el-descriptions-item>
        <el-descriptions-item label="外部关联单号">
          {{ dataJson.tempJson.extra_code == null?'-':dataJson.tempJson.extra_code }}
        </el-descriptions-item>
        <el-descriptions-item label="单据类型">
          {{ dataJson.tempJson.bill_type_name == null?'-':dataJson.tempJson.bill_type_name }}
        </el-descriptions-item>
        <el-descriptions-item label="合同日期">
          {{ dataJson.tempJson.contract_dt == null?'':formatDate(dataJson.tempJson.contract_dt) }}
        </el-descriptions-item>
        <el-descriptions-item label="船名">
          {{ dataJson.tempJson.ship_name == null?'':dataJson.tempJson.ship_name }}
        </el-descriptions-item>
        <el-descriptions-item label="供应商">
          {{ dataJson.tempJson.customer_name == null?'':dataJson.tempJson.customer_name }}
        </el-descriptions-item>
        <el-descriptions-item label="合同量">
          {{ dataJson.tempJson.contract_num == null?'':formatNumber(dataJson.tempJson.contract_num,true,4) }}
        </el-descriptions-item>
        <el-descriptions-item label="物流合同">
          {{ dataJson.tempJson.waybill_code }}
        </el-descriptions-item>
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
                disabled
                :warehouse1="dataJson.tempJson.warehouse_id"
                @closeParentDialog="handleDialogClose"
                @onReturnData="handleWarehouseReturnData"
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
          <el-descriptions-item>
            <div slot="label">
              实收车数
            </div>
            <el-form-item
              prop="car_count"
              label-width="0"
            >
              <numeric
                v-model="dataJson.tempJson.car_count"
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
              原发数量
              <el-tooltip
                v-if="settings.showTips"
                class="item"
                effect="dark"
                placement="bottom"
              >
                <div slot="content">
                  此处请填写合同数量
                </div>
                <svg-icon
                  icon-class="perfect-icon-question1_btn"
                  style="margin-left: 5px"
                />
              </el-tooltip>
            </div>
            <el-form-item
              prop="primary_quantity"
              label-width="0"
            >
              <numeric
                v-model="dataJson.tempJson.primary_quantity"
                :decimal-places="4"
                :currency-symbol="''"
              />
            </el-form-item>
          </el-descriptions-item>
          <el-descriptions-item>
            <div
              slot="label"
              class="required-mark"
            >
              入库数量
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
          <el-descriptions-item label="入库单位">{{ dataJson.tempJson.unit_name }}</el-descriptions-item>
          <el-descriptions-item>
            <div
              slot="label"
              class="required-mark"
            >
              入库时间
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
          <el-descriptions-item label="入库数量换算">
            <el-form-item
              prop="actual_weight"
              label-width="0"
            >
              <numeric
                v-model="dataJson.tempJson.actual_weight"
                :decimal-places="4"
                :currency-symbol="''"
                :disabled="true"
              />
            </el-form-item>
          </el-descriptions-item>
          <el-descriptions-item label="库存计量单位">
            <el-form-item
              prop="unit_calc"
              label-width="0"
            >

              <span>吨</span>
              <!-- 若入库单位不等于吨 -->
              <span
                v-if="settings.btnUnitStatus.showUnit"
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
            </el-form-item>
          </el-descriptions-item>
          <el-descriptions-item>
            <div slot="label">
              入库单价
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
          <el-descriptions-item label="入库金额">
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
                v-model.trim="dataJson.tempJson.detail_remark"
                show-word-limit
                :maxlength="dataJson.inputSettings.maxLength.detail_remark"
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
                disabled
                :warehouse1="dataJson.tempJson.warehouse_id"
                @closeParentDialog="handleDialogClose"
                @onReturnData="handleWarehouseReturnData"
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
          <el-descriptions-item>
            <div slot="label">
              实收车数
            </div>
            <el-form-item
              prop="car_count"
              label-width="0"
            >
              <numeric
                v-model="dataJson.tempJson.car_count"
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
              原发数量
              <el-tooltip
                v-if="settings.showTips"
                class="item"
                effect="dark"
                placement="bottom"
              >
                <div slot="content">
                  此处请填写合同数量
                </div>
                <svg-icon
                  icon-class="perfect-icon-question1_btn"
                  style="margin-left: 5px"
                />
              </el-tooltip>
            </div>
            <el-form-item
              prop="primary_quantity"
              label-width="0"
            >
              <numeric
                v-model="dataJson.tempJson.primary_quantity"
                :decimal-places="4"
                :currency-symbol="''"
              />
            </el-form-item>
          </el-descriptions-item>
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
              入库数量
              <span>(净重)</span>
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
          <el-descriptions-item />
          <el-descriptions-item />
          <el-descriptions-item>
            <div
              slot="label"
              class="required-mark"
            >
              入库时间
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
          <el-descriptions-item label="入库数量换算">
            <el-form-item
              prop="actual_weight"
              label-width="0"
            >
              <numeric
                v-model="dataJson.tempJson.actual_weight"
                :decimal-places="4"
                :currency-symbol="''"
                :disabled="true"
              />
            </el-form-item>
          </el-descriptions-item>
          <el-descriptions-item label="库存计量单位">
            <el-form-item
              prop="unit_calc"
              label-width="0"
            >

              <span>吨</span>
              <!-- 若入库单位不等于吨 -->
              <span
                v-if="settings.btnUnitStatus.showUnit"
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
            </el-form-item>
          </el-descriptions-item>
          <el-descriptions-item>
            <div slot="label">
              入库单价
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
          <el-descriptions-item label="入库金额">
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
                v-model.trim="dataJson.tempJson.detail_remark"
                show-word-limit
                :maxlength="dataJson.inputSettings.maxLength.detail_remark"
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
          <el-descriptions-item label="入库明细附件">
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
          <el-descriptions-item label="货物照片">
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
.link {
  color: #2a6496;
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
import { getPlanDetailApi, operateApi, getWeightControlConfigApi } from '@/api/40_business/inplan/inplan'
import SimpleUploadMutilFile from '@/components/10_file/SimpleUploadMutilFile'
import previewCard from '@/components/50_preview_card/preview_card'
import unitCalculatorDialog from '@/views/30_wms/spec/unit/unitCalculator/unitCalculator'
import { isNotEmpty } from '@/utils'
import numeric from '@/components/40_input/numeric'
import { getOnlyOneUnitCalcApi, getCountApi } from '@/api/30_wms/spec/unit/unitCalc'
import SelectWarehouse from '@/views/30_wms/warehouse/selectgrid/selectWarehouseLocationBin.vue'

export default {
  components: { SelectWarehouse, SimpleUploadMutilFile, previewCard, unitCalculatorDialog, numeric },
  directives: { elDragDialog },
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
        width: '7%',
        'text-align': 'right'
      },
      fileLabelStyle: {
        width: '2.3%',
        'text-align': 'right'
      },
      // 监听器
      watch: {
        unwatch_tempJson: null,
        unwatch_unitData: null,
        unwatch_actual_count: null,
        unwatch_actual_price: null
      },
      // 上传文件窗口的状态
      popSettingsUpload: {
        // 弹出窗口会否显示
        dialogFormVisible: false,
        // 错误数据文件
        errorFileUrl: ''
      },
      popSettingsData: {
        // 弹出窗口状态名称
        dialogStatus: '',
        dialogFormVisible: false,
        btnDisabledStatus: {
          disabledOK: false
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
        // actual_count: 0,
        unitConvertList: [],
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

        searchForm: {
          reset: undefined
        },

        // 单条数据 json的，初始化原始数据
        tempJsonOriginal: {
          plan_code: '',
          inbound_time: '',
          actual_count: 0,
          primary_quantity: 0,
          car_count: 0,
          bin_name: '',
          bin_id: '',
          location_name: '',
          location_id: '',
          actual_weight: 0,
          unitData: { content: '' },
          gross_weight: 0,
          tare_weight: 0
        },
        // 单条数据 json
        tempJson: {
          actual_weight: 0,
          actual_count: 0,
          gross_weight: 0,
          tare_weight: 0
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
            vehicle_no: 20,
            detail_remark: 100
          }
        }
      },
      // 页面设置json
      settings: {
        // loading 状态
        loading: true,
        loading1: true,
        showTips: false,
        // 皮重毛重开关控制
        weight_control_config: false,
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
          inbound_time: [
            { required: true, message: '请输入入库时间', trigger: 'change' }
          ],
          gross_weight: [
            { validator: this.gross_weight_validator, trigger: 'change' }
          ],
          tare_weight: [
            { validator: this.tare_weight_validator, trigger: 'change' }
          ],
          actual_count: [
            { required: true, message: '请输入入库数量', trigger: 'change' },
            { validator: this.in_qty_validator, trigger: 'blur' }
          ],
          primary_quantity: [
            { required: true, message: '请输入原发数量', trigger: 'change' },
            { validator: this.original_qty_validator, trigger: 'blur' }
          ],
          location_name: [
            { required: true, message: '请选择库区 / 库位', trigger: 'change' }
          ],
          unit_calc: [
            { validator: this.unit_calc_validator, trigger: 'blur' }
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
          this.dataJson.tempJson.actual_count = deepCopy(number)
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
    // // 监听数量, 监听 this.dataJson.tempJson.actual_count 不起效果,,,,
    // 'dataJson.tempJson.actual_count': {
    //   handler (newVal) {
    //     this.reCalcCountByUnit()
    //     this.reCalcTotalPrice()
    //   }
    // }
  },
  created () {
    const href = window.location.href
    if (href.indexOf('shyiyuanth') !== -1) {
      this.settings.showTips = true
    }

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
    // 修改时的初始化
    initUpdateModel () {
      // 数据初始化
      this.dataJson.tempJson = deepCopy(this.data)
      // 数据初始化
      this.getData()
      this.dataJson.tempJson.actual_count = 0
      this.dataJson.tempJson.actual_weight = 0
      this.dataJson.tempJson.tare_weight = 0
      this.dataJson.tempJson.gross_weight = 0
      // 设置按钮
      this.settings.btnShowStatus.showUpdate = true
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

      const operate_tab_data = {
        data: this.data
      }

      // if (history.state.pushState) {
      //   // 如果是列表页面过来的，可以直接返回
      //   window.history.go(-1)
      // } else {
      //   // 如果是直接打开的，返回查询页面
      //   // 全部
      //   this.$router.push({ name: constants_program.P_IN_PLAN })
      // }
      this.$router.push({
        query: {}
      })

      this.$emit('emitReturn', operate_tab_data)
    },
    // 更新逻辑
    doUpdate () {
      this.settings.loading = true
      this.$refs['dataSubmitForm'].validate(valid => {
        if (valid) {
          const tempData = deepCopy(this.dataJson.tempJson)
          // this.checkCount(tempData)
          this.handleOperate(tempData)
        } else {
          this.settings.loading = false
        }
      })
    },
    /*  checkCount (tempData) {
      // 查询逻辑
      this.settings.loading = true
      countApi(tempData).then(
        _data => {
          if (_data.data !== 'ok') {
            this.$confirm(_data.data + '是否确认继续入库操作', '确认信息', {
              distinguishCancelAndClose: true,
              confirmButtonText: '确认',
              cancelButtonText: '取消'
            }).then(() => {
              this.handleOperate(tempData)
            }).catch(action => {

            })
          } else {
            this.handleOperate(tempData)
          }
        },
        _error => {
          this.settings.loading = false
        }
      )
        .finally(() => {
          // this.settings.loading = false
        })
    }, */
    handleOperate (tempData) {
      operateApi(tempData)
        .then(
          _data => {
            // this.$emit('closeMeOk', { return_flag: true, data: _data })
            this.$notify({
              title: '入库操作成功',
              message: '入库操作成功',
              type: 'success',
              duration: this.settings.duration
            })

            const operate_tab_data = {
              data: this.data
            }

            this.$emit('emitReturn', operate_tab_data)
          },
          _error => {
            // this.$emit('closeMeOk', { return_flag: false, error: _error })
            this.$notify({
              title: '入库操作失败',
              message: '入库操作失败',
              type: 'error',
              duration: this.settings.duration
            })
            this.settings.loading = false
          }
        )
        .finally(() => {
          // this.settings.loading = false
        })
    },
    getData () {
      // 查询逻辑
      this.settings.loading = true
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
        this.settings.loading = false
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
      this.dataJson.photo_files.splice(_index, 1)
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
      this.dataJson.inspection_files.splice(_index, 1)
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
      this.dataJson.goods_files.splice(_index, 1)
    },
    // handleLocationReturnData (val) {
    //   if (val === null) {
    //     // 库区
    //     this.dataJson.tempJson.location_id = null
    //     this.dataJson.tempJson.location_name = null
    //
    //     // 库位
    //     this.dataJson.tempJson.bin_id = null
    //     this.dataJson.tempJson.bin_name = null
    //   } else {
    //     // 库区
    //     this.dataJson.tempJson.location_id = val.location_id
    //     this.dataJson.tempJson.location_name = val.location_name
    //
    //     // 库位
    //     this.dataJson.tempJson.bin_id = val.bin_id
    //     this.dataJson.tempJson.bin_name = val.bin_name
    //   }
    // },
    // 弹出框关闭
    handleDialogClose () {
      this.settings.visible = false
    },
    // 选择仓库时, 库区库位
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
    // 入库数量换算逻辑
    reCalcCountByUnit () {
      if ((isNotEmpty(this.dataJson.tempJson.actual_count)) &&
        (this.dataJson.tempJson.actual_count > 0) &&
        isNotEmpty(this.dataJson.tempJson.unitData)) {
        this.dataJson.tempJson.actual_weight = deepCopy(this.dataJson.tempJson.unitData.calc * this.dataJson.tempJson.actual_count)
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
     * 入库单价check
     */
    price_validator (rule, value, callback) {
      if (value <= 0) {
        callback(new Error('请输入入库单价'))
      } else {
        callback()
      }
    },
    unit_calc_validator (rule, value, callback) {
      if (this.dataJson.tempJson.unitData === null || this.dataJson.tempJson.unitData.content === '') {
        callback(new Error('请选择单位'))
      } else {
        callback()
      }
      // if (value <= 0) {
      //   callback(new Error('请新增货修改库存计量单位对应关系'))
      // } else {
      //   callback()
      // }
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
    // Placeholder设置
    isPlaceholderShow (val) {
      if (this.isViewModel) {
        return ''
      } else {
        return val
      }
    }
    // 皮重需小于毛重
    // tare_weight_compare_validator (rule, value, callback) {
    //   if (this.settings.weight_control_config) {
    //     if ()
    //   }
    // }

  }
}
</script>
