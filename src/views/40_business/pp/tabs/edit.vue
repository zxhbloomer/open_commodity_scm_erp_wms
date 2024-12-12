<template>
  <div class="app-container">
    <div
      v-loading="settings.loading"
      class="edit-container"
    >
      <el-form
        ref="dataSubmitForm"
        :rules="settings.rules"
        :model="dataJson.tempJson"
        label-position="right"
        label-width="0px"
        status-icon
      >
        <el-collapse v-model="dataJson.activeNames">
          <el-collapse-item
            title="订单信息"
            class="collapse-info"
            :name="activeName"
          >
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
                <el-form-item
                  prop="release_order_code"
                  label-width="0"
                >
                  <input-search
                    v-model.trim="dataJson.tempJson.release_order_code"
                    :disabled="(isUpdateModel && isViewModel) || (data !== null && data.release_order_detail_id !== null)||isFinishModel"
                    @onInputSearch="handleReleaseOrderDialog"
                  />
                </el-form-item>
              </el-descriptions-item>
              <el-descriptions-item label="类型">
                {{ dataJson.tempJson.release_order_type_name }}
              </el-descriptions-item>
              <el-descriptions-item label="货主">
                {{ dataJson.tempJson.owner_name }}
              </el-descriptions-item>
              <el-descriptions-item label="仓库">
                {{ dataJson.tempJson.warehouse_name }}
              </el-descriptions-item>
              <el-descriptions-item label="生产物料编码">
                {{ dataJson.tempJson.release_sku_code }}
              </el-descriptions-item>
              <el-descriptions-item label="生产物料名称">
                {{ dataJson.tempJson.release_sku_name }}
              </el-descriptions-item>
              <el-descriptions-item label="品名">
                {{ dataJson.tempJson.release_pm }}
              </el-descriptions-item>
              <el-descriptions-item label="规格">
                {{ dataJson.tempJson.release_spec }}
              </el-descriptions-item>
              <el-descriptions-item label="型规">
                {{ dataJson.tempJson.release_type_gauge }}
              </el-descriptions-item>
              <el-descriptions-item label="数量">
                {{ dataJson.tempJson.release_qty }}
              </el-descriptions-item>
              <el-descriptions-item label="单位">
                {{ dataJson.tempJson.release_unit_name }}
              </el-descriptions-item>
              <el-descriptions-item label="已生产数量">
                {{
                  dataJson.tempJson.has_product_num === null || dataJson.tempJson.has_product_num === undefined ? '' : formatNumber(dataJson.tempJson.has_product_num, 4)
                }}
              </el-descriptions-item>
            </el-descriptions>
          </el-collapse-item>
        </el-collapse>
        <br>
        <el-alert
          title="工单信息"
          type="info"
          :closable="false"
        />
        <br>
        <el-descriptions
          title=""
          :column="3"
          :content-style="contentStyle2"
          :label-style="labelStyle2"
          direction="horizontal"
          border
          style="padding-right: 10px;padding-left: 10px;"
        >
          <el-descriptions-item label="计划编号">
            {{
              dataJson.tempJson.code == null || dataJson.tempJson.code == '' ? '系统自动生成' : dataJson.tempJson.code
            }}
          </el-descriptions-item>
          <el-descriptions-item>
            <div
              slot="label"
              class="required-mark"
            >
              货主
            </div>
            <el-form-item prop="owner_name">
              <el-select
                v-model="dataJson.tempJson.owner_name"
                placeholder="请选择货主"
                :disabled="isViewModel || settings.btnDisabledStatus.disabledRelease||isFinishModel"
                filterable
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
              仓库
            </div>
            <select-warehouse
              v-if="dataJson.tempJson.release_order_code == null"
              v-model.trim="dataJson.tempJson.warehouse_name"
              placement="left"
              :disabled="!(settings.btnShowStatus.showUpdate || settings.btnShowStatus.showInsert) || settings.btnDisabledStatus.disabledRelease"
              :warehouse1="dataJson.tempJson.warehouse_id"
              :reset="dataJson.resetWarehouse"
              :filter-warehouse-type="['1', '4']"
              :is-zhong-lin="isZhongLin"
              @onReturnData="handleWarehouseReturnData"
            />
            {{
              dataJson.tempJson.release_order_code !== null && dataJson.tempJson.release_order_code !== undefined ? dataJson.tempJson.warehouse_name : null
            }}
          </el-descriptions-item>
        </el-descriptions>

        <el-descriptions
          title=""
          :column="2"
          :content-style="contentStyle2"
          :label-style="labelStyle2"
          direction="horizontal"
          border
          style="padding-right: 10px;padding-left: 10px;"
        >
          <el-descriptions-item label="产成品，副产品产量公式">
            产成品、副产品产量=产成品产量 ÷ 产成品配比 : {{ formatNumber(dataJson.sumData.prod_all_num, 4) }}<br
              class="fontBr"
            >
            产成品产量=产成品、副产品产量 * 产成品配比 : {{ formatNumber(dataJson.sumData.prod_num, 4) }}<br
              class="fontBr"
            >
            副产品产量=产成品、副产品产量 * 副产品配比 : {{ formatNumber(dataJson.sumData.prod_f_num, 4) }}
          </el-descriptions-item>
          <el-descriptions-item label="原材料消耗公式">
            原材料消耗量=产成品、副产品总产量(消耗=产出) : {{ formatNumber(dataJson.sumData.prod_all_num, 4) }}
          </el-descriptions-item>
          <el-descriptions-item
            v-if="settings.btnShowStatus.showUpdate || settings.btnShowStatus.showInsert"
            label="公式校验"
          >
            <span v-if="dataJson.err_msg">
              <font
                v-for="item in dataJson.err_msg"
                :key="item.error_msg"
                color="red"
              >
                {{ item.error_msg }}<br class="fontBr">
              </font>
            </span>
            <span v-if="!dataJson.err_msg.length">
              -
            </span>
          </el-descriptions-item>
          <el-descriptions-item v-if="!isFinishModel">
            <div
              slot="label"
              class="required-mark"
            >计划入库时间
            </div>
            <el-date-picker
              v-if="settings.isOldTime"
              v-model.trim="dataJson.tempJson.plan_time"
              type="datetime"
              placeholder="选择日期时间"
              :disabled="isViewModel ||isFinishModel"
            />

            <el-date-picker
              v-if="!settings.isOldTime"
              v-model="dataJson.tempJson.daterange"
              value-format="yyyy-MM-dd HH:mm:ss"
              type="datetimerange"
              align="right"
              unlink-panels
              range-separator="-"
              start-placeholder="计划开始入库时间"
              end-placeholder="计划结束入库时间"
              :disabled="isViewModel ||isFinishModel"
            />
          </el-descriptions-item>

          <el-descriptions-item v-if="isFinishModel" label="入库时间">
            系统自动生成
          </el-descriptions-item>

        </el-descriptions>
        <br>
        <el-button-group v-if="settings.btnShowStatus.showUpdate || settings.btnShowStatus.showInsert">
          <el-button
            type="primary"
            icon="el-icon-edit-outline"
            :loading="settings.loading"
            :disabled="settings.btnDisabledStatus.disabledInsert"
            @click="handleRouterSelection"
          >选择配方表
          </el-button>
          <el-button
            type="primary"
            icon="el-icon-edit-outline"
            :disabled="settings.btnDisabledStatus.disabledInsert"
            :loading="settings.loading"
            @click="handleRouterClear"
          >清空配方表
          </el-button>
        </el-button-group>
        <el-row v-if="dataJson.tempJson.router_name">
          <el-col :span="24">
            <div class="grid-content" style="padding-left: 10px;padding-bottom: 10px;">
              {{ dataJson.tempJson.router_name }} ( {{ dataJson.tempJson.router_code }} )
            </div>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <div class="grid-content bg-purple-light">
              <span class="count">
                <font color="#909399">
                  产成品, 副产品
                </font>
              </span>
              <span class="count_1">
                <font color="#909399">
                  合计:
                </font>
                <font color="red">
                  {{ formatNumber(isFinishModel?dataJson.sumData.product_actual_wo:dataJson.sumData.product_actual, 4) }}
                </font>
              </span>
            </div>
          </el-col>
        </el-row>
        <br>
        <el-table
          ref="multipleTable"
          :data="dataJson.tempJson.product_list"
          :element-loading-text="'正在拼命加载中...'"
          element-loading-background="rgba(255, 255, 255, 0.5)"
          :height="settings.tableHeight"
          stripe
          border
          fit
          highlight-current-row
          style="width: 99%;margin-right: 10px;margin-left: 10px;"
          @current-change="handleProductCurrentChange"
        >
          <el-table-column
            type="index"
            width="50"
            label="NO"
          />
          <el-table-column
            min-width="200"
            label="仓库"
            :auto-fit="true"
            prop="warehouse_name"
          >

            <template v-slot="scope">
              <!-- <select-warehouse
                v-model.trim="scope.row.warehouse_name"
                placement="left"
                :disabled="!(settings.btnShowStatus.showUpdate || settings.btnShowStatus.showInsert) || settings.btnDisabledStatus.disabledRelease"
                :warehouse1="scope.row.warehouse_id"
                :filter-warehouse-type="['1', '4']"
                :is-zhong-lin="isZhongLin"
                @onReturnData="handleWarehouseProductReturnData"
              /> -->
              {{ scope.row.warehouse_name }}
            </template>
          </el-table-column>
          <!--          <el-table-column-->
          <!--            show-overflow-tooltip-->
          <!--            min-width="110"-->
          <!--            prop="type_name"-->
          <!--            label="产品类型"-->
          <!--          />-->
          <el-table-column
            show-overflow-tooltip
            min-width="110"
            prop="goods_prop"
            label="商品属性"
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
            prop="goods_name"
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
          >
            <template v-slot="scope">
              <spec-select
                v-model.trim="scope.row.sku_id"
                :disabled="!(settings.btnShowStatus.showUpdate || settings.btnShowStatus.showInsert)"
                :goods-id="scope.row.goods_id"
                :clearable="false"
                @change="(val, _data) => {scope.row.sku_id = val; scope.row.goods_name = _data.name; scope.row.sku_code = _data.code}"
              />
            </template>
          </el-table-column>

          <!--          <el-table-column-->
          <!--            show-overflow-tooltip-->
          <!--            min-width="130"-->
          <!--            prop="type_gauge"-->
          <!--            label="型规"-->
          <!--          />-->
          <el-table-column
            show-overflow-tooltip
            min-width="150"
            prop="pp_router"
            label="配比 ( % )"
            align="right"
          >
            <template v-slot="scope">
              <numeric
                v-model="scope.row.pp_router"
                :decimal-places="2"
                :currency-symbol="''"
                :disabled="!(settings.btnShowStatus.showUpdate || settings.btnShowStatus.showInsert)"
                @change.native="handleCheck"
              />
            </template>
          </el-table-column>

          <el-table-column
            show-overflow-tooltip
            min-width="150"
            prop="qty"
            label="计划生产入库数量"
            align="right"
          >
            <template v-slot="scope">
              <numeric
                v-model="scope.row.qty"
                :decimal-places="4"
                :currency-symbol="''"
                :disabled="!(settings.btnShowStatus.showUpdate || settings.btnShowStatus.showInsert) || scope.row.type !== '1'"
                @change.native="handleProductNum(scope.row.qty, scope.row)"
              />
            </template>
          </el-table-column>

          <el-table-column
            v-if="isFinishModel"
            show-overflow-tooltip
            min-width="150"
            prop="qty"
            label="生产入库数量"
            align="right"
          >
            <template v-slot="scope">
              <numeric
                v-model="scope.row.wo_qty"
                :decimal-places="4"
                :currency-symbol="''"
                :disabled="isFinishModel && scope.row.type !== '1'"
                @change.native="handleProductNum(scope.row.wo_qty, scope.row)"
              />
            </template>
          </el-table-column>

          <el-table-column
            show-overflow-tooltip
            min-width="110"
            prop="unit_name"
            label="单位"
            align="right"
          >
            <template v-slot="scope">
              <select-unit
                ref="ref_select_unit"
                v-model.trim="scope.row.unit_id"
                :disabled="!(settings.btnShowStatus.showUpdate || settings.btnShowStatus.showInsert)"
                :sku-id="scope.row.sku_id"
                :clearable="false"
                @change="(val) => handleProductUnitChange(val, scope.row)"
              />
            </template>
          </el-table-column>
        </el-table>
        <br>
        <el-row>
          <el-col :span="24">
            <div class="grid-content bg-purple-light">
              <span class="count">
                <font color="#909399">
                  原材料
                </font>
              </span>
              <span class="count_1">
                <font color="#909399">
                  合计:
                </font>
                <font color="red">
                  <!-- {{ material_num === 0 ? formatNumber(dataJson.material_num, 4) : formatNumber(material_num, 4) }} -->
                  {{ formatNumber(isFinishModel?dataJson.sumData.material_actual_wo:dataJson.sumData.material_actual, 4) }}
                </font>
              </span>
            </div>
          </el-col>
        </el-row>
        <br>
        <el-table
          ref="multipleTable"
          :data="dataJson.tempJson.material_list"
          :element-loading-text="'正在拼命加载中...'"
          element-loading-background="rgba(255, 255, 255, 0.5)"
          :height="settings.tableHeight"
          stripe
          border
          fit
          highlight-current-row
          style="width: 99%;margin-right: 10px;margin-left: 10px;"
          @current-change="handleMaterialCurrentChange"
        >
          <el-table-column
            type="index"
            width="50"
            label="NO"
          />
          <el-table-column
            min-width="200"
            label="仓库"
            :auto-fit="true"
            prop="warehouse_name"
          >
            <template v-slot="scope">
              <!-- <select-warehouse
                v-model.trim="scope.row.warehouse_name"
                placement="left"
                :disabled="!(settings.btnShowStatus.showUpdate || settings.btnShowStatus.showInsert) || settings.btnDisabledStatus.disabledRelease"
                :warehouse1="scope.row.warehouse_id"
                :filter-warehouse-type="['1', '4']"
                :is-zhong-lin="isZhongLin"
                @onReturnData="handleWarehouseMaterialReturnData"
              /> -->
              {{ scope.row.warehouse_name }}
            </template>
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            min-width="130"
            prop="goods_prop"
            label="商品属性"
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
            prop="goods_name"
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
          >
            <template v-slot="scope">
              <spec-select
                ref="specSelect"
                v-model.trim="scope.row.sku_id"
                :row="scope.row"
                :goods-id="scope.row.goods_id"
                :disabled="!(settings.btnShowStatus.showUpdate || settings.btnShowStatus.showInsert)"
                :clearable="false"
                @change="(val, _data) => {scope.row.sku_id = val; scope.row.goods_name = _data.name; scope.row.sku_code = _data.code; handleCalcInventory()}"
              />
            </template>
          </el-table-column>

          <el-table-column
            v-if="isFinishModel"
            show-overflow-tooltip
            min-width="130"
            align="right"
            prop="qty_avaible"
            label="可用库存"
          >
            <template v-slot="scope">
              {{
                scope.row.qty_avaible === null || scope.row.qty_avaible === undefined ? '0.0000' : formatNumber(scope.row.qty_avaible, true, 4)
              }}
            </template>
          </el-table-column>

          <el-table-column
            show-overflow-tooltip
            min-width="150"
            prop="pp_router"
            label="配比 ( % )"
            align="right"
          >
            <template v-slot="scope">
              <numeric
                v-model="scope.row.pp_router"
                :decimal-places="2"
                :currency-symbol="''"
                :disabled="!(settings.btnShowStatus.showUpdate || settings.btnShowStatus.showInsert)"
                @change.native="handleCheck"
              />
            </template>
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            min-width="150"
            prop="qty"
            label="计划领料出库数量"
            align="right"
          >
            <template v-slot="scope">
              <numeric
                v-model="scope.row.qty"
                :decimal-places="4"
                :currency-symbol="''"
                disabled
              />
            </template>
          </el-table-column>

          <el-table-column
            v-if="isFinishModel"
            show-overflow-tooltip
            min-width="150"
            prop="wo_qty"
            label="领料出库数量"
            align="right"
          >
            <template v-slot="scope">
              <numeric
                v-model="scope.row.wo_qty"
                :decimal-places="4"
                :currency-symbol="''"
                disabled
              />
            </template>
          </el-table-column>

          <el-table-column
            show-overflow-tooltip
            min-width="110"
            prop="unit_name"
            label="单位"
            align="right"
          >
            <template v-slot="scope">
              <select-unit
                ref="ref_select_unit"
                v-model.trim="scope.row.unit_id"
                :sku-id="scope.row.sku_id"
                :clearable="false"
                :disabled="!(settings.btnShowStatus.showUpdate || settings.btnShowStatus.showInsert)"
                @change="(val) => handleMaterialUnitChange(val, scope.row)"
              />
            </template>
          </el-table-column>
        </el-table>
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
        type="primary"
        :disabled="settings.loading || settings.btnDisabledStatus.disabledSave"
        size="medium"
        @click="doInsert()"
      >保存
      </el-button>
      <el-button
        v-show="settings.btnShowStatus.showUpdate && !isViewModel"
        type="primary"
        :disabled="settings.loading || settings.btnDisabledStatus.disabledUpdate"
        size="medium"
        @click="doUpdate()"
      >保存
      </el-button>

      <el-button
        v-show="isFinishModel && !isViewModel"
        type="primary"
        :disabled="settings.loading || settings.btnDisabledStatus.disabledUpdate"
        size="medium"
        @click="dFinish()"
      >保存
      </el-button>

      <el-button
        :disabled="settings.loading"
        size="medium"
        @click="handleCancel()"
      >返回
      </el-button>
    </div>

    <release-order
      v-if="popSettingsData.releaseOrder.visible"
      :visible="popSettingsData.releaseOrder.visible"
      :data="popSettingsData.releaseOrder.data"
      @closeMeCancel="handleReleaseOrderCancel"
      @closeMeOk="handleReleaseOrderOk"
    />
    <wo-router
      v-if="popSettingsData.woRouter.visible"
      :visible="popSettingsData.woRouter.visible"
      :data="popSettingsData.woRouter.data"
      @closeMeCancel="handleWoRouterCancel"
      @closeMeOk="handleWoRouterOk"
    />
  </div>
</template>

<style lang="scss" scoped>
.edit-container {
  height: calc(100vh - 160px);
  overflow-x: auto;
}

.dialog-footer {
  text-align: center;
}

.floatRight {
  float: right;

  .el-button--mini {
    padding: 2px 9px;
    font-size: 9px;
    border-radius: 3px;
  }
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

.fontBr {
  display: block;
  margin: 1px;
  content: ' ';
}

.el-button-group {
  margin-bottom: 15px;
}

.bg-purple-light {
  background: #f4f4f5;
}

.grid-content {
  border-radius: 4px;
  min-height: 32px;
}

.count {
  display: inline-block;
  height: 30px;
  text-align: center;
  font-size: 13px;
  line-height: 18px;
}

.count_1 {
  display: inline-block;
  height: 30px;
  text-align: center;
  font-size: 13px;
  line-height: 18px;
}

.grid-content .count {
  top: 10px;
  position: absolute;
  left: 20px;
}

.grid-content .count_1 {
  top: 10px;
  position: absolute;
  right: 20px;
}

.collapse-info {
  ::v-deep .el-collapse-item__header {
    background-color: #f4f4f5;
    height: 34px;
    color: #909399;
    padding-left: 25px;
    border-radius: 4px;
    margin-bottom: 10px;
  }

  ::v-deep .el-collapse-item__wrap .el-collapse-item__content {
    padding-bottom: 10px;
  }
}
</style>

<script>
import constants_para from '@/common/constants/constants_para'
import elDragDialog from '@/directive/el-drag-dialog'
import deepCopy from 'deep-copy'
import { getApi } from '@/api/40_business/worouter/worouter'
import {
  insertApi,
  updateApi,
  getDetailApi,
  checkApi,
  checkQtyApi,
  getInventoryApi,
  finishInsertApi
} from '@/api/40_business/pp/pp'
import { getOwnerComboListApi } from '@/api/30_wms/owner/owner'
import constants_type from '@/common/constants/constants_dict'
import selectUnit from '@/views/30_wms/spec/unit/selectUnit/selectUnit'
import InputSearch from '@/components/40_input/inputSearch'
import ReleaseOrder from '@/views/40_business/wo/tabs/dialog/releaseOrder'
import { getOrderDetailApi } from '@/api/40_business/releaseorder/releaseorder'
import SelectWarehouse from '@/views/30_wms/warehouse/selectgrid/selectWarehouseLocationBin'
import WoRouter from '@/views/40_business/worouter/tabs/dialog/dialog'
import numeric from '@/components/40_input/numeric'
import specSelect from '@/views/30_wms/spec/components/specSelect.vue'

export default {
  components: { InputSearch, ReleaseOrder, WoRouter, selectUnit, numeric, SelectWarehouse, specSelect },
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
      labelStyle2: {
        width: '6%',
        'text-align': 'right'
      },
      contentStyle2: {
        width: '15%'
      },
      popSettingsData: {
        // 弹出窗口状态名称
        dialogStatus: '',
        // 订单弹出框
        releaseOrder: {
          // 弹出框显示参数
          visible: false,
          data: {},
          // 点击确定以后返回的值
          selectedDataJson: {
            id: null
          }
        },
        // 生产配方
        woRouter: {
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

        // 字段隐藏
        // 折叠面板默认打开值
        activeNames: ['1'],
        material_num: 0,
        err_msg: [],
        // 货主
        ownerComboList: [],
        // 单条数据 json的，初始化原始数据
        tempJsonOriginal: {
          id: null,
          name: '',
          code: null,
          owner_name: '',
          owner_id: null,
          owner_code: '',
          product_list: [],
          material_list: []
        },
        // 合计
        sumData: {
          // 产成品, 副产品产量
          prod_all_num: 0,
          // 产成品产量
          prod_num: 0,
          // 副产品产量
          prod_f_num: 0,
          // 实际合计:
          material_actual: 0,
          product_actual: 0,
          // 实际合计:
          material_actual_wo: 0,
          product_actual_wo: 0
        },
        // 初始化生产入库数量
        productNumOriginal: 0,
        // 单条数据 json
        tempJson: {
          id: null,
          name: '',
          code: null,
          owner_name: '',
          owner_id: null,
          owner_code: '',
          product_list: [],
          material_list: [],
          warehouse_id: null,
          warehouse_name: '',
          warehouse_code: '',
          router_name: '',
          router_code: '',
          daterange: []
        },
        inputSettings: {
          maxLength: {}
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
          showUpdate: false,
          showFinish: false
        },
        // 按钮状态：是否可用，false:可用，true不可用
        btnDisabledStatus: {
          disabledInsert: false,
          // 产成品删除
          disabledProductDelete: false,
          // 原材料删除
          disabledMaterialDelete: false,
          // 原材料编辑
          disabledMaterialUpdate: false,
          // 保存按钮
          disabledSave: true,
          disabledUpdate: true,
          disabledRelease: false
        },
        // 是否选中产成品, 原材料的所在行
        isPicthOnMaterial: false,
        isPicthOnProduct: false,
        // 兼容旧数据的显示
        isOldTime: false,
        // 以下为pop的内容：数据弹出框
        selection: [],
        dialogStatus: this.editStatus,
        // pop的check内容
        rules: {
          owner_name: [
            // { required: true, message: '请选择货主', trigger: 'change' }
            { validator: this.checkOwnerName, trigger: 'change' }
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
    isFinishModel () {
      if (this.settings.dialogStatus === this.PARAMETERS.MODEL_EDIT) {
        return true
      } else {
        return false
      }
    },
    // 返回唯一id
    activeName () {
      if ((this.dataJson.tempJson.release_order_code !== null && this.dataJson.tempJson.release_order_code !== undefined) || (this.data !== null && this.data.release_order_detail_id !== null)) {
        return '1'
      } else {
        return null
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
        case this.PARAMETERS.MODEL_EDIT:
          this.initFinishModel()
          break
      }
      // 初始化watch
      this.setWatch()
      this.settings.loading = false
    },
    // 下推时的初始化
    initFinishModel () {
      // 数据初始化
      this.settings.btnShowStatus.showFinish = true
      this.dataJson.tempJson.warehouse_id = this.data.product_list[0].warehouse_id
      this.getData()
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
      this.dataJson.tempJson = deepCopy(this.dataJson.tempJsonOriginal)

      this.settings.loading = false
      // 设置按钮
      this.settings.btnShowStatus.showInsert = true

      if (this.data !== null && this.data.release_order_detail_id !== null) {
        this.getDeliveryOrderDetail(this.data.release_order_detail_id)
      }
    },
    // 编辑时初始化
    initUpdateModel () {
      this.settings.btnShowStatus.showUpdate = true
      this.settings.btnDisabledStatus.disabledInsert = false
      this.dataJson.tempJson.warehouse_id = this.data.product_list[0].warehouse_id
      this.getData()
    },
    // 查看时的初始化
    initViewModel () {
      // 数据初始化
      // this.dataJson.tempJson = deepCopy(this.data)
      // this.dataJson.tempJson.warehouse_id = this.data.product_list[0].warehouse_id
      this.getData()
    },
    // 设置监听器
    setWatch () {
      this.unWatch()
      // 监听页面上面是否有修改，有修改按钮高亮
      this.watch.unwatch_tempJson = this.$watch(
        'dataJson.tempJson.product_list', (newVal, oldVal) => {
          if (this.dataJson.tempJson.product_list && this.dataJson.tempJson.material_list) {
            this.settings.btnDisabledStatus.disabledSave = false
            this.settings.btnDisabledStatus.disabledUpdate = false
            // this.sumPorductNum()
          }
        },
        { deep: true }
      )
      this.watch.unwatch_tempJson = this.$watch(
        'dataJson.tempJson.material_list', (newVal, oldVal) => {
          if (this.dataJson.tempJson.product_list && this.dataJson.tempJson.material_list) {
            this.settings.btnDisabledStatus.disabledSave = false
            this.settings.btnDisabledStatus.disabledUpdate = false
          }
        },
        { deep: true }
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
      this.$emit('emitReturn', '123')
    },
    // 插入逻辑
    doInsert () {
      this.$refs['dataSubmitForm'].validate(valid => {
        if (valid) {
          const tempData = deepCopy(this.dataJson.tempJson)
          // 计算产成品, 副产品配比
          const productRouter = tempData.product_list.map(item => item.pp_router).reduce((pre, cur) => pre + cur)
          if (productRouter !== 100) {
            this.showErrorMsg('产成品,副产品明细的配比之和应为100%')
            return
          }
          const materialRouter = tempData.material_list.map(item => item.pp_router).reduce((pre, cur) => pre + cur)
          if (materialRouter !== 100) {
            this.showErrorMsg('原材料明细的配比之和应为100%')
            return
          }

          if (tempData.daterange == null || tempData.daterange.length < 2) {
            this.showErrorMsg('计划入库时间不能为空')
            return
          }

          tempData.plan_time = tempData.daterange[0]
          tempData.plan_end_time = tempData.daterange[1]

          this.settings.loading = true
          insertApi(tempData)
            .then(
              _data => {
                // this.$emit('closeMeOk', { return_flag: true, data: _data })
                this.$notify({
                  title: '新增处理成功',
                  message: _data.data.message,
                  type: 'success',
                  duration: this.settings.duration
                })
                this.$emit('closeMeOk', { return_flag: true, data: _data, edit_status: this.PARAMETERS.STATUS_INSERT })
                // this.$emit('emitReturn')
              },
              _error => {
                // this.$emit('closeMeOk', { return_flag: false, error: _error })
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

    // 下推逻辑/调用插入生产
    dFinish () {
      this.$refs['dataSubmitForm'].validate(valid => {
        if (valid) {
          const tempData = deepCopy(this.dataJson.tempJson)
          // // 计划生产数量
          // const qty = tempData.product_list.filter(item => item.type === '1').map(item => item.qty).reduce((pre, cur) => pre + cur)
          // // 生产入库数量
          // const wo_qty = tempData.product_list.filter(item => item.type === '1').map(item => item.wo_qty).reduce((pre, cur) => pre + cur)
          // if (wo_qty <= 0 || (qty - tempData.has_product_num) < wo_qty) {
          //   this.showErrorMsg('生产入库数量，需>0,且最大不可超过该生产计划')
          //   return
          // }

          for (const item of tempData.material_list) {
            const avaible = item.qty_avaible == null ? 0.000 : item.qty_avaible
            if (item.wo_qty > avaible) {
              this.showErrorMsg('【' + item.warehouse_name + '】仓库，【' + item.goods_name + '】商品库存不足。当前库存' + avaible + '吨，生产所需' + item.wo_qty + '吨')
              return
            }
          }

          // 组装生产数据
          tempData.delivery_order_code = tempData.release_order_code
          tempData.delivery_order_id = tempData.release_order_id
          tempData.delivery_order_detail_id = tempData.release_order_detail_id
          tempData.delivery_order_type_name = tempData.release_order_type_name
          tempData.delivery_sku_code = tempData.release_sku_code
          tempData.delivery_sku_name = tempData.release_sku_name
          tempData.delivery_pm = tempData.release_pm
          tempData.delivery_type_gauge = tempData.release_type_gauge
          tempData.delivery_qty = tempData.release_qty
          tempData.delivery_unit_name = tempData.release_unit_name
          tempData.delivery_spec = tempData.release_spec
          // eslint-disable-next-line no-return-assign
          tempData.product_list.forEach(item => item.wo_router = item.pp_router)
          // eslint-disable-next-line no-return-assign
          tempData.material_list.forEach(item => item.wo_router = item.pp_router)
          tempData.pp_id = tempData.id
          tempData.id = null

          console.log(tempData)
          this.settings.loading = true
          finishInsertApi(tempData)
            .then(
              _data => {
                // this.$emit('closeMeOk', { return_flag: true, data: _data })
                this.$notify({
                  title: '新增处理成功',
                  message: _data.data.message,
                  type: 'success',
                  duration: this.settings.duration
                })
                this.$emit('closeMeOk', { return_flag: true, data: _data, edit_status: this.PARAMETERS.STATUS_INSERT })
                // this.$emit('emitReturn')
              },
              _error => {
                // this.$emit('closeMeOk', { return_flag: false, error: _error })
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
          // 计算产成品, 副产品配比
          const productRouter = tempData.product_list.map(item => item.pp_router).reduce((pre, cur) => pre + cur)
          if (productRouter !== 100) {
            this.showErrorMsg('产成品,副产品明细的配比之和应为100%')
            return
          }
          const materialRouter = tempData.material_list.map(item => item.pp_router).reduce((pre, cur) => pre + cur)
          if (materialRouter !== 100) {
            this.showErrorMsg('原材料明细的配比之和应为100%')
            return
          }

          if (tempData.daterange == null || tempData.daterange.length < 2) {
            this.showErrorMsg('计划入库时间不能为空')
            return
          }

          tempData.plan_time = tempData.daterange[0]
          tempData.plan_end_time = tempData.daterange[1]

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
                this.$emit('closeMeOk', { return_flag: true, data: _data, edit_status: this.PARAMETERS.STATUS_UPDATE })
                // this.$emit('emitReturn')
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

    // 订单弹窗
    handleReleaseOrderDialog () {
      this.popSettingsData.releaseOrder.data.is_wo = true
      this.popSettingsData.releaseOrder.visible = true
    },
    // 订单弹出关闭
    handleReleaseOrderCancel () {
      this.popSettingsData.releaseOrder.visible = false
    },
    // 订单选中
    handleReleaseOrderOk (val) {
      this.popSettingsData.releaseOrder.visible = false
      // 判断是否重新选择了订单
      if (this.dataJson.tempJson.product_list.length || this.dataJson.tempJson.release_order_code !== undefined && this.dataJson.tempJson.release_order_code !== val.code) {
        this.$confirm('订单信息已改变，需重新选择配方信息', '确认信息', {
          distinguishCancelAndClose: true,
          confirmButtonText: '确认',
          cancelButtonText: '取消'
        }).then(() => {
          // 点击确认
          this.handleUpdateReleaseOrder(val)
          this.handleRouterClear()
          return
        }).catch(action => {
          // 点击取消
          if (action !== 'close') {
            return
          }
          return
        })
      } else {
        // 初次选择, 不需要弹窗
        this.handleUpdateReleaseOrder(val)
      }
    },
    handleUpdateReleaseOrder (val) {
      if (val.has_product_num !== null && val.has_product_num > val.qty) {
        this.showErrorMsg('所选订单生产数量已大于放货数量')
        return
      }
      this.settings.btnDisabledStatus.disabledRelease = true
      this.settings.btnDisabledStatus.disabledInsert = false
      this.dataJson.tempJson.release_order_code = val.code
      this.dataJson.tempJson.release_order_id = val.id
      this.dataJson.tempJson.release_order_detail_id = val.detail_id
      this.dataJson.tempJson.release_order_type_name = val.type_name
      this.dataJson.tempJson.owner_name = val.owner_name
      this.dataJson.tempJson.owner_id = val.owner_id
      this.dataJson.tempJson.warehouse_name = val.warehouse_name
      this.dataJson.tempJson.warehouse_code = val.warehouse_code
      this.dataJson.tempJson.warehouse_id = val.warehouse_id
      this.dataJson.tempJson.wc_warehouse_name = val.warehouse_name
      this.dataJson.tempJson.wc_warehouse_code = val.warehouse_code
      this.dataJson.tempJson.wc_warehouse_id = val.warehouse_id
      this.dataJson.tempJson.release_sku_code = val.commodity_spec_code
      this.dataJson.tempJson.release_sku_name = val.commodity_name
      this.dataJson.tempJson.release_pm = val.pm
      this.dataJson.tempJson.release_type_gauge = val.type_gauge
      this.dataJson.tempJson.release_qty = val.qty
      this.dataJson.tempJson.release_unit_name = val.unit_name
      this.dataJson.tempJson.release_spec = val.commodity_spec
      this.dataJson.tempJson.has_product_num = val.has_product_num
    },
    // 选择配方表
    handleRouterSelection () {
      this.popSettingsData.woRouter.visible = true
      this.popSettingsData.woRouter.data = {
        is_enable: '1',
        product_sku_code: this.dataJson.tempJson.release_sku_code
      }
    },
    // 关闭 配方表 弹窗
    handleWoRouterCancel () {
      this.popSettingsData.woRouter.visible = false
    },
    // 选择 配方表 弹窗
    handleWoRouterOk (val) {
      this.popSettingsData.woRouter.visible = false
      this.settings.loading = true
      const selectJson = {}
      selectJson.id = val.id
      this.dataJson.tempJson.router_id = val.id
      getApi(selectJson).then(response => {
        const data = deepCopy(response.data)
        this.dataJson.tempJson.router_name = data.name
        this.dataJson.tempJson.router_code = data.code
        this.dataJson.tempJson.material_list = deepCopy(data.material_list)
        this.dataJson.tempJson.product_list = deepCopy(data.product_list)

        this.dataJson.tempJson.material_list.forEach(item => {
          item.pp_router = item.router
          item.warehouse_name = this.dataJson.tempJson.warehouse_name
          item.warehouse_code = this.dataJson.tempJson.warehouse_code
          item.warehouse_id = this.dataJson.tempJson.warehouse_id
        })

        this.dataJson.tempJson.product_list.forEach(item => {
          item.pp_router = item.router
          item.warehouse_name = this.dataJson.tempJson.warehouse_name
          item.warehouse_code = this.dataJson.tempJson.warehouse_code
          item.warehouse_id = this.dataJson.tempJson.warehouse_id
        })

        // 如果 product_list 和 material_list 不为空, 且仓库,货主不为空, 查询集合中的商品数量
        if ((this.dataJson.tempJson.material_list !== null && this.dataJson.tempJson.material_list !== undefined && this.dataJson.tempJson.material_list.length) &&
          (this.dataJson.tempJson.warehouse_id !== null && this.dataJson.tempJson.warehouse_id !== undefined) &&
          (this.dataJson.tempJson.owner_id !== null && this.dataJson.tempJson.owner_id !== undefined)) {
          this.handleCalcInventory()
        }
      }).finally(() => {
        this.settings.loading = false
      })
    },

    // 获取行索引
    getProductRowIndex (row) {
      const _index = this.dataJson.tempJson.product_list.lastIndexOf(row)
      return _index
    },
    // 产成品,副产品行选中
    handleProductCurrentChange (row) {
      this.settings.isPicthOnProduct = true
      this.dataJson.productCurrentJson = Object.assign({}, row) // copy obj
      this.dataJson.productCurrentJson.index = this.getProductRowIndex(row)
      // 设置dialog的返回
      this.$store.dispatch('popUpSearchDialog/selectedDataJson', Object.assign({}, row))
    },

    // 获取行索引
    getMaterialRowIndex (row) {
      const _index = this.dataJson.tempJson.material_list.lastIndexOf(row)
      return _index
    },
    // 产成品,副产品行选中
    handleMaterialCurrentChange (row) {
      this.settings.isPicthOnMaterial = true
      this.dataJson.materialCurrentJson = Object.assign({}, row) // copy obj
      this.dataJson.materialCurrentJson.index = this.getMaterialRowIndex(row)
      if (this.dataJson.materialCurrentJson.index !== -1) {
        this.settings.btnDisabledStatus.disabledMaterialUpdate = true
        this.settings.btnDisabledStatus.disabledMaterialDelete = true
      } else {
        this.settings.btnDisabledStatus.disabledMaterialUpdate = false
        this.settings.btnDisabledStatus.disabledMaterialDelete = false
      }
      // 设置dialog的返回
      this.$store.dispatch('popUpSearchDialog/selectedDataJson', Object.assign({}, row))
    },
    // 获取数据
    getData () {
      this.settings.loading = true
      getDetailApi(this.data).then(response => {
        this.dataJson.tempJson = deepCopy(response.data)
        if (this.dataJson.tempJson.release_order_code !== null && this.dataJson.tempJson.release_order_code !== undefined) {
          this.settings.btnDisabledStatus.disabledRelease = true
        }
        const product = this.dataJson.tempJson.product_list[0]
        this.dataJson.tempJson.warehouse_name = product.warehouse_name
        this.dataJson.tempJson.warehouse_code = product.warehouse_code
        this.dataJson.tempJson.warehouse_id = product.warehouse_id

        // 兼容旧数据回显
        if (this.dataJson.tempJson.plan_end_time != null) {
          this.$set(this.dataJson.tempJson, 'daterange', [this.dataJson.tempJson.plan_time, this.dataJson.tempJson.plan_end_time])
        }

        if (this.settings.dialogStatus === this.PARAMETERS.STATUS_VIEW && this.dataJson.tempJson.plan_end_time == null) {
          this.settings.isOldTime = true
        }

        this.sumPorductNum()
      }).finally(() => {
        this.settings.loading = false
      })
    },
    // 选择单位
    handleProductUnitChange (val, row) {
      if (val !== null && val !== undefined) {
        row.unit_id = val.src_unit_id
        row.unit_name = val.src_unit
      } else {
        row.unit_id = null
        row.unit_name = null
      }
    },
    handleMaterialUnitChange (val, row) {
      // 获取当前单位的下标
      if (val !== null && val !== undefined) {
        row.unit_id = val.src_unit_id
        row.unit_name = val.src_unit
      } else {
        row.unit_id = null
        row.unit_name = null
      }
    },
    // 根据原材料计算副产品数量
    handleProductNum (val, row) {
      this.handleCheck()
    },
    // 清空配方表
    handleRouterClear () {
      this.dataJson.tempJson.material_list = []
      this.dataJson.tempJson.product_list = []
      this.dataJson.tempJson.router_name = null
      this.dataJson.tempJson.router_code = null

      // 清空合计
      this.dataJson.sumData.material_actual = 0
      this.dataJson.sumData.product_actual = 0
      // 产成品, 副产品产量
      this.dataJson.sumData.prod_all_num = 0
      // 产成品产量
      this.dataJson.sumData.prod_num = 0
      // 副产品产量
      this.dataJson.sumData.prod_f_num = 0
    },
    /**
     *  订单check
     */
    checkOwnerName (rule, value, callback) {
      if (this.dataJson.tempJson.owner_id === null || this.dataJson.tempJson.owner_id === undefined || this.dataJson.tempJson.owner_id === '') {
        callback(new Error('请选择货主'))
      } else {
        callback()
      }
    },
    // 公式校验
    handleCheck () {
      const selectJson = this.dataJson.tempJson
      checkApi(selectJson).then(response => {
        const data = deepCopy(response.data)
        this.dataJson.err_msg = data
      }).finally(() => {
        this.settings.loading = false
      })
      this.sumPorductNum()
    },
    // 产量计算
    sumPorductNum () {
      if (this.settings.btnShowStatus.showFinish) {
        // 计算产成品, 副产品合计产量
        const product = this.dataJson.tempJson.product_list.filter(item => item.type === constants_type.DICT_B_ROUTER_PRODUCT_TYPE_C)[0]
        // 产成品产量
        if (product.wo_qty === undefined) {
          product.wo_qty = 0
        }
        this.dataJson.sumData.prod_num = product.wo_qty
        // 产成品, 副产品产量
        const wo_qty = product.wo_qty / (product.pp_router / 100)

        // 获得副产品的比例
        const productRouterList = this.dataJson.tempJson.product_list.filter(item => item.type === constants_type.DICT_B_ROUTER_PRODUCT_TYPE_F)
        let productRouter = 0
        if (productRouterList.length) {
          productRouter = productRouterList.map(item => item.pp_router).reduce((pre, cur) => pre + cur)
        }
        this.dataJson.sumData.prod_f_num = wo_qty * productRouter / 100

        this.dataJson.sumData.prod_all_num = this.dataJson.sumData.prod_num + this.dataJson.sumData.prod_f_num
      } else {
        // 计算产成品, 副产品合计产量
        const product = this.dataJson.tempJson.product_list.filter(item => item.type === constants_type.DICT_B_ROUTER_PRODUCT_TYPE_C)[0]
        // 产成品产量
        if (product.qty === undefined) {
          product.qty = 0
        }
        this.dataJson.sumData.prod_num = product.qty

        // 产成品, 副产品产量
        const qty = product.qty / (product.pp_router / 100)

        // 获得副产品的比例
        const productRouterList = this.dataJson.tempJson.product_list.filter(item => item.type === constants_type.DICT_B_ROUTER_PRODUCT_TYPE_F)
        let productRouter = 0
        if (productRouterList.length) {
          productRouter = productRouterList.map(item => item.pp_router).reduce((pre, cur) => pre + cur)
        }
        this.dataJson.sumData.prod_f_num = qty * productRouter / 100

        this.dataJson.sumData.prod_all_num = this.dataJson.sumData.prod_num + this.dataJson.sumData.prod_f_num
      }
      // 计算配比
      checkQtyApi(this.dataJson.tempJson).then(response => {
        this.dataJson.tempJson.product_list = deepCopy(response.data.product_list)
        this.dataJson.tempJson.material_list = deepCopy(response.data.material_list)
        this.dataJson.sumData.product_actual = deepCopy(response.data.product_actual)
        this.dataJson.sumData.material_actual = deepCopy(response.data.material_actual)
        this.dataJson.sumData.product_actual_wo = deepCopy(response.data.product_actual_wo)
        this.dataJson.sumData.material_actual_wo = deepCopy(response.data.material_actual_wo)
      }).finally(() => {
        this.settings.loading = false
      })

      // 如果 product_list 和 material_list 不为空, 且仓库,货主不为空, 查询集合中的商品数量
      if ((this.dataJson.tempJson.material_list !== null && this.dataJson.tempJson.material_list !== undefined) &&
        (this.dataJson.tempJson.warehouse_id !== null && this.dataJson.tempJson.warehouse_id !== undefined) &&
        (this.dataJson.tempJson.owner_id !== null && this.dataJson.tempJson.owner_id !== undefined) && this.settings.btnShowStatus.showFinish) {
        this.handleCalcInventory()
      }
    },
    getDeliveryOrderDetail (release_order_detail_id) {
      const param = { detail_id: release_order_detail_id }
      getOrderDetailApi(param).then(response => {
        this.handleUpdateReleaseOrder(response.data)
        this.handleRouterClear()
      }).finally(() => {
        this.settings.loading = false
      })
    },
    // 货主下拉框
    getOwnerData () {
      getOwnerComboListApi().then((_data) => {
        this.dataJson.ownerComboList = _data.data
        if (this.dataJson.tempJson.owner_id != null && this.dataJson.tempJson.release_order_id != null) {
          // 默认选中第一条
          this.dataJson.tempJson.owner_name = _data.data[0].short_name
          this.dataJson.tempJson.owner_id = _data.data[0].id
          this.dataJson.tempJson.owner_code = _data.data[0].code
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
      this.dataJson.tempJson.owner_name = owner.short_name

      // 如果 product_list 和 material_list 不为空, 且仓库,货主不为空, 查询集合中的商品数量
      if ((this.dataJson.tempJson.material_list !== null && this.dataJson.tempJson.material_list !== undefined && this.dataJson.tempJson.material_list.length) &&
        (this.dataJson.tempJson.warehouse_id !== null && this.dataJson.tempJson.warehouse_id !== undefined) &&
        (this.dataJson.tempJson.owner_id !== null && this.dataJson.tempJson.owner_id !== undefined)) {
        this.handleCalcInventory()
      }
    },
    handleWarehouseReturnData (val) {
      if (val !== null) {
        // 获取当前仓库的下标
        this.dataJson.tempJson.warehouse_name = val.warehouse_name
        this.dataJson.tempJson.warehouse_id = deepCopy(val.warehouse_id)
        this.dataJson.tempJson.warehouse_code = val.warehouse_code
        if (this.dataJson.tempJson.product_list !== undefined) {
          this.dataJson.tempJson.product_list.forEach(item => {
            item.warehouse_name = this.dataJson.tempJson.warehouse_name
            item.warehouse_code = this.dataJson.tempJson.warehouse_code
            item.warehouse_id = this.dataJson.tempJson.warehouse_id
          })
          this.dataJson.tempJson.product_list = deepCopy(this.dataJson.tempJson.product_list)
        }
        if (this.dataJson.tempJson.material_list !== undefined) {
          this.dataJson.tempJson.material_list.forEach(item => {
            item.warehouse_name = this.dataJson.tempJson.warehouse_name
            item.warehouse_code = this.dataJson.tempJson.warehouse_code
            item.warehouse_id = this.dataJson.tempJson.warehouse_id
          })
          this.dataJson.tempJson.material_list = deepCopy(this.dataJson.tempJson.material_list)
        }

        // 添加副产品
      } else {
        // 获取当前仓库的下标
        this.dataJson.tempJson.warehouse_name = null
        this.dataJson.tempJson.warehouse_id = null
        this.dataJson.tempJson.warehouse_code = null
        if (this.dataJson.tempJson.product_list !== undefined) {
          this.dataJson.tempJson.product_list.forEach(item => {
            item.warehouse_name = null
            item.warehouse_code = null
            item.warehouse_id = null
          })
        }
        if (this.dataJson.tempJson.material_list !== undefined) {
          this.dataJson.tempJson.material_list.forEach(item => {
            item.warehouse_name = null
            item.warehouse_code = null
            item.warehouse_id = null
            item.qty_avaible = 0
          })
        }
      }
      // // 如果 product_list 和 material_list 不为空, 且仓库,货主不为空, 查询集合中的商品数量
      // if ((this.dataJson.tempJson.material_list !== null && this.dataJson.tempJson.material_list !== undefined) &&
      //   (this.dataJson.tempJson.warehouse_id !== null && this.dataJson.tempJson.warehouse_id !== undefined) &&
      //   (this.dataJson.tempJson.owner_id !== null && this.dataJson.tempJson.owner_id !== undefined)) {
      //   this.handleCalcInventory()
      // }
    },

    handleCalcInventory () {
      getInventoryApi(this.dataJson.tempJson).then(response => {
        // 此处单位有问题, 在选择单位前调用的接口, 然后去选择单位, 返回后单位为空了, 怎么解决!
        const data = response.data.material_list
        this.dataJson.tempJson.material_list.forEach(item => {
          for (const index in data) {
            if (data[index].sku_id === item.sku_id) {
              item.qty_avaible = data[index].qty_avaible
            }
          }
        })
        this.dataJson.tempJson.material_list = deepCopy(this.dataJson.tempJson.material_list)
      }).finally(() => {
        this.settings.loading = false
      })
    }

  }

}

</script>
