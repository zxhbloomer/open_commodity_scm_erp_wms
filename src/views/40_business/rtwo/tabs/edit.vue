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
                  prop="delivery_order_code"
                  label-width="0"
                >
                  <input-search
                    v-model.trim="dataJson.tempJson.delivery_order_code"
                    :disabled="(isUpdateModel && isViewModel) || (data !== null && data.delivery_order_detail_id !== null)"
                    @onInputSearch="handleReleaseOrderDialog"
                  />
                </el-form-item>
              </el-descriptions-item>
              <el-descriptions-item label="类型">
                {{ dataJson.tempJson.delivery_order_type_name }}
              </el-descriptions-item>
              <el-descriptions-item label="货主">
                {{ dataJson.tempJson.release_owner_name }}
              </el-descriptions-item>
              <el-descriptions-item label="仓库">
                {{ dataJson.tempJson.release_warehouse_name }}
              </el-descriptions-item>
              <el-descriptions-item label="生产物料编码">
                {{ dataJson.tempJson.delivery_sku_code }}
              </el-descriptions-item>
              <el-descriptions-item label="生产物料名称">
                {{ dataJson.tempJson.delivery_sku_name }}
              </el-descriptions-item>
              <el-descriptions-item label="品名">
                {{ dataJson.tempJson.delivery_pm }}
              </el-descriptions-item>
              <el-descriptions-item label="规格">
                {{ dataJson.tempJson.delivery_spec }}
              </el-descriptions-item>
              <el-descriptions-item label="型规">
                {{ dataJson.tempJson.delivery_type_gauge }}
              </el-descriptions-item>
              <el-descriptions-item label="数量">
                {{ dataJson.tempJson.delivery_qty }}
              </el-descriptions-item>
              <el-descriptions-item label="单位">
                {{ dataJson.tempJson.delivery_unit_name }}
              </el-descriptions-item>
              <el-descriptions-item label="已生产数量">
                {{ dataJson.tempJson.has_product_num === null || dataJson.tempJson.has_product_num === undefined? '0' : formatNumber3(dataJson.tempJson.has_product_num) }}
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
          <el-descriptions-item label="生产编号">
            {{ dataJson.tempJson.code == null || dataJson.tempJson.code == ''?'系统自动生成':dataJson.tempJson.code }}
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
                :disabled="isViewModel || settings.btnDisabledStatus.disabledRelease"
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
          <el-descriptions-item />
          <el-descriptions-item>
            <div
              slot="label"
              class="required-mark"
            >
              仓库
            </div>
            <select-warehouse
              v-if="dataJson.tempJson.delivery_order_code == null"
              v-model.trim="dataJson.tempJson.warehouse_name"
              placement="left"
              :disabled="!(settings.btnShowStatus.showUpdate || settings.btnShowStatus.showInsert) || settings.btnDisabledStatus.disabledRelease"
              :warehouse1="dataJson.tempJson.warehouse_id"
              :reset1="dataJson.resetWarehouse"
              :filter-warehouse-type="['1', '4']"
              :is-zhong-lin="isZhongLin"
              @onReturnData="handleWarehouseReturnData"
            />
            {{ dataJson.tempJson.delivery_order_code !== null && dataJson.tempJson.delivery_order_code !== undefined ? dataJson.tempJson.warehouse_name : null }}
          </el-descriptions-item>
          <el-descriptions-item label="生产入库时间">
            {{ dataJson.tempJson.c_time == null || dataJson.tempJson.c_time == ''? '系统自动生成' : formatDateTime(dataJson.tempJson.c_time) }}
          </el-descriptions-item>
          <el-descriptions-item />
        </el-descriptions>
        <br>
        <el-button-group v-if="settings.btnShowStatus.showUpdate || settings.btnShowStatus.showInsert">
          <el-button
            type="primary"
            icon="el-icon-edit-outline"
            :loading="settings.loading"
            :disabled="settings.btnDisabledStatus.disabledInsert"
            @click="handleRouterSelection"
          >选择配方表</el-button>
          <el-button
            type="primary"
            icon="el-icon-edit-outline"
            :disabled="settings.btnDisabledStatus.disabledInsert"
            :loading="settings.loading"
            @click="handleRouterClear"
          >清空配方表</el-button>
        </el-button-group>
        <el-row>
          <el-col :span="24">
            <div class="grid-content bg-purple-light">
              <span class="count">
                <font color="#909399">
                  产成品
                </font>
              </span>
            </div>
          </el-col>
        </el-row>
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
              仓库
            </div>
            <!-- v-if="dataJson.tempJson.delivery_order_code == null" -->
            <!-- <select-warehouse
              v-model.trim="dataJson.tempJson.warehouse_name"
              :reset1="dataJson.resetWarehouse"
              placement="left"
              :disabled="!(settings.btnShowStatus.showUpdate || settings.btnShowStatus.showInsert) || settings.btnDisabledStatus.disabledRelease"
              :warehouse1="dataJson.tempJson.warehouse_id"
              :filter-warehouse-type="['1', '4']"
              :is-zhong-lin="isZhongLin"
              @onReturnData="handleWarehouseProductReturnData"
            /> -->
            {{ dataJson.tempJson.warehouse_name }}
            <!-- {{ dataJson.tempJson.delivery_order_code !== null && dataJson.tempJson.delivery_order_code !== undefined ? dataJson.tempJson.warehouse_name : null }} -->
          </el-descriptions-item>
          <el-descriptions-item label="商品编码">
            {{ dataJson.tempJson.sku_code }}
          </el-descriptions-item>
          <el-descriptions-item label="商品属性">
            {{ dataJson.tempJson.goods_prop }}
          </el-descriptions-item>
          <el-descriptions-item label="物料名称">
            {{ dataJson.tempJson.goods_name }}
          </el-descriptions-item>
          <el-descriptions-item label="品名">
            {{ dataJson.tempJson.pm }}
          </el-descriptions-item>
          <el-descriptions-item label="规格">
            {{ dataJson.tempJson.spec }}
          </el-descriptions-item>
          <el-descriptions-item label="型规">
            <!-- {{ dataJson.tempJson.spec }} -->
          </el-descriptions-item>
          <el-descriptions-item label="生产">
            <numeric
              v-model="dataJson.tempJson.wo_qty"
              :decimal-places="3"
              :currency-symbol="''"
              :disabled="isViewModel"
              @change.native="handleSumWoQty"
            />
          </el-descriptions-item>
          <el-descriptions-item label="单位">
            {{ dataJson.tempJson.unit_name }}
          </el-descriptions-item>
        </el-descriptions>
        <br>
        <el-row>
          <el-col :span="24">
            <div class="grid-content bg-purple-light">
              <span class="count">
                <font color="#909399">
                  副产品
                </font>
              </span>
              <span class="count_1">
                <font color="#909399">
                  合计:
                </font>
                <font color="red">
                  {{ formatNumber(dataJson.sumData.product_actual , 4) }}
                </font>
              </span>
            </div>
          </el-col>
        </el-row>
        <br>
        <el-table
          ref="multipleTable"
          :data="dataJson.tempJson.coproduct_list"
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
            label="序号"
          />
          <el-table-column
            min-width="200"
            label="仓库"
            :auto-fit="true"
            prop="warehouse_name"
          >

            <template v-slot="scope">
              {{ scope.row.warehouse_name }}
              <!-- <select-warehouse
                v-model.trim="scope.row.warehouse_name"
                placement="left"
                :disabled="!(settings.btnShowStatus.showUpdate || settings.btnShowStatus.showInsert) || settings.btnDisabledStatus.disabledRelease"
                :warehouse1="scope.row.warehouse_id"
                :filter-warehouse-type="['1', '4']"
                :is-zhong-lin="isZhongLin"
                @onReturnData="handleWarehouseCoproductReturnData"
              /> -->
            </template>
          </el-table-column>
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
            prop="spec"
            label="规格"
          />
          <!--          <el-table-column-->
          <!--            show-overflow-tooltip-->
          <!--            min-width="130"-->
          <!--            align="right"-->
          <!--            prop="qty_avaible"-->
          <!--            label="可用库存"-->
          <!--          >-->
          <!--            <template v-slot="scope">-->
          <!--              {{ scope.row.qty_avaible === null || scope.row.qty_avaible === undefined ?'0.0000': formatNumber(scope.row.qty_avaible,true,4) }}-->
          <!--            </template>-->
          <!--          </el-table-column>-->
          <el-table-column
            show-overflow-tooltip
            min-width="150"
            prop="wo_qty"
            label="生产入库数量"
            align="right"
          >
            <template v-slot="scope">
              <numeric
                v-model="scope.row.wo_qty"
                :decimal-places="3"
                :currency-symbol="''"
                :disabled="isViewModel"
                @input="handleSumData"
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
                @change="handleProductUnitChange"
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
                  {{ formatNumber3(dataJson.sumData.material_actual) }}
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
            label="序号"
          />
          <el-table-column
            min-width="200"
            label="仓库"
            :auto-fit="true"
            prop="warehouse_name"
          >
            <template v-slot="scope">
              {{ scope.row.warehouse_name }}
              <!-- <select-warehouse
                v-model.trim="scope.row.warehouse_name"
                placement="left"
                :disabled="!(settings.btnShowStatus.showUpdate || settings.btnShowStatus.showInsert) || settings.btnDisabledStatus.disabledRelease"
                :warehouse1="scope.row.warehouse_id"
                :filter-warehouse-type="['1', '4']"
                :is-zhong-lin="isZhongLin"
                @onReturnData="handleWarehouseMaterialReturnData"
              /> -->

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
          <!-- <el-table-column
            show-overflow-tooltip
            min-width="130"
            prop="pm"
            label="品名"
          /> -->
          <el-table-column
            show-overflow-tooltip
            min-width="130"
            prop="spec"
            label="规格"
          />
          <el-table-column
            show-overflow-tooltip
            min-width="130"
            align="right"
            prop="qty_avaible"
            label="可用库存"
          >
            <template v-slot="scope">
              {{ scope.row.qty_avaible === null || scope.row.qty_avaible === undefined ?'0.0000': formatNumber(scope.row.qty_avaible,true,4) }}
            </template>
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            min-width="150"
            prop="wo_qty"
            label="领料出库数量"
            align="right"
          >
            <template v-slot="scope">
              <numeric
                v-model="scope.row.wo_qty"
                :decimal-places="3"
                :currency-symbol="''"
                :disabled="isViewModel"
                @input="handleSumData"
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
                :disabled="!(settings.btnShowStatus.showUpdate || settings.btnShowStatus.showInsert)"
                @change="handleMaterialUnitChange"
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
import { getApi } from '@/api/40_business/rtworouter/rtworouter'
import { insertApi, updateApi, getDetailApi, getInventoryApi } from '@/api/40_business/rtwo/rtwo'
import { getOwnerComboListApi } from '@/api/30_wms/owner/owner'
// import constants_type from '@/common/constants/constants_dict'
import selectUnit from '@/views/30_wms/spec/unit/selectUnit/selectUnit'
import InputSearch from '@/components/40_input/inputSearch'
import ReleaseOrder from '@/views/40_business/wo/tabs/dialog/releaseOrder'
import { getOrderDetailApi } from '@/api/40_business/releaseorder/releaseorder'
import SelectWarehouse from '@/views/30_wms/warehouse/selectgrid/selectWarehouseLocationBin'
import WoRouter from '@/views/40_business/rtworouter/tabs/dialog/dialog'
import numeric from '@/components/40_input/numeric'

export default {
  components: { InputSearch, ReleaseOrder, WoRouter, selectUnit, numeric, SelectWarehouse },
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
        // 折叠面板默认打开值
        activeNames: ['1'],
        material_num: 0,
        resetWarehouse: false,
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
          material_list: [],
          warehouse_name: null
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
          product_actual: 0
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
          coproduct_list: [],
          warehouse_name: null
        },
        inputSettings: {
          maxLength: {
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
        // 以下为pop的内容：数据弹出框
        selection: [],
        dialogStatus: this.editStatus,
        // pop的check内容
        rules: {
          // delivery_order_code: [
          //   { validator: this.checkDeliveryOrderCode, trigger: 'blur' }
          // ]
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
    // 返回唯一id
    activeName () {
      if ((this.dataJson.tempJson.delivery_order_code !== null && this.dataJson.tempJson.delivery_order_code !== undefined) || (this.data !== null && this.data.delivery_order_detail_id !== null)) {
        return '1'
      } else {
        return null
      }
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
  },
  created () {
    // 初始化货主下拉框
    this.getOwnerData()
    // 描绘完成
    this.init()
  },
  mounted () {

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
      this.dataJson.tempJson = deepCopy(this.dataJson.tempJsonOriginal)

      this.settings.loading = false
      // 设置按钮
      this.settings.btnShowStatus.showInsert = true

      if (this.data !== null && this.data.delivery_order_detail_id !== null) {
        this.getDeliveryOrderDetail(this.data.delivery_order_detail_id)
      }
    },
    // 编辑时初始化
    initUpdateModel () {
      this.settings.btnShowStatus.showUpdate = true
      this.settings.btnDisabledStatus.disabledInsert = false
      this.dataJson.tempJson.warehouse_id = this.data.warehouse_id
      this.getData()
    },
    // 查看时的初始化
    initViewModel () {
      // 数据初始化
      // this.dataJson.tempJson = deepCopy(this.data)
      this.dataJson.tempJson.warehouse_id = this.data.warehouse_id
      this.getData()
    },
    // 设置监听器
    setWatch () {
      this.unWatch()
      // 监听页面上面是否有修改，有修改按钮高亮
      this.watch.unwatch_tempJson = this.$watch(
        'dataJson.tempJson.coproduct_list', (newVal, oldVal) => {
          if (this.dataJson.tempJson.product_list && this.dataJson.tempJson.material_list) {
            this.settings.btnDisabledStatus.disabledSave = false
            this.settings.btnDisabledStatus.disabledUpdate = false
            this.handleSumWoQty()
          }
        }
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
      // this.$emit('closeMeCancel')
      // this.$router.go(-1)
      this.$emit('emitReturn')
    },
    // 插入逻辑
    doInsert () {
      this.$refs['dataSubmitForm'].validate(valid => {
        if (valid) {
          const tempData = deepCopy(this.dataJson.tempJson)
          // 判断生产入库数量 + 已生产入库数量 不能大于 发货数量
          // const wo_qty = this.dataJson.tempJson.wo_qty
          // let has_product_num = this.dataJson.tempJson.has_product_num
          // if (this.dataJson.tempJson.has_product_num === null || this.dataJson.tempJson.has_product_num === undefined) {
          //   has_product_num = 0
          // }
          // if ((wo_qty + has_product_num) > this.dataJson.tempJson.delivery_qty) {
          //   this.showErrorMsg('生产入库数量和已生产入库数量之和不得大于发货数量!')
          //   return
          // }
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
                // this.$emit('emitReturn')
                this.$emit('closeMeOk', { return_flag: true, data: _data, edit_status: this.PARAMETERS.STATUS_INSERT })
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
          // 判断生产入库数量 + 已生产入库数量 不能大于 发货数量
          // const wo_qty = this.dataJson.tempJson.wo_qty
          // let has_product_num = this.dataJson.tempJson.has_product_num
          // if (this.dataJson.tempJson.has_product_num === null || this.dataJson.tempJson.has_product_num === undefined) {
          //   has_product_num = 0
          // }
          // if ((wo_qty + has_product_num - this.dataJson.tempJson.current_num) > this.dataJson.tempJson.delivery_qty) {
          //   this.showErrorMsg('生产入库数量和已生产入库数量之和不得大于发货数量!')
          //   return
          // }
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
                // this.$emit('emitReturn')
                this.$emit('closeMeOk', { return_flag: true, data: _data, edit_status: this.PARAMETERS.STATUS_UPDATE })
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
      if (this.dataJson.tempJson.product_list.length || this.dataJson.tempJson.delivery_order_code !== undefined && this.dataJson.tempJson.delivery_order_code !== val.code) {
        this.$confirm('订单信息已改变，需重新选择配方信息', '确认信息', {
          distinguishCancelAndClose: true,
          confirmButtonText: '确认',
          cancelButtonText: '取消'
        }).then(() => {
          // 点击确认
          this.handleRouterClear()
          this.handleUpdateReleaseOrder(val)
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
      this.dataJson.tempJson.delivery_order_code = val.code
      this.dataJson.tempJson.delivery_order_id = val.id
      this.dataJson.tempJson.delivery_order_detail_id = val.detail_id
      this.dataJson.tempJson.delivery_order_type_name = val.type_name
      this.dataJson.tempJson.owner_name = val.owner_name
      this.dataJson.tempJson.owner_id = val.owner_id
      this.dataJson.tempJson.warehouse_name = val.warehouse_name
      this.dataJson.tempJson.warehouse_code = val.warehouse_code
      this.dataJson.tempJson.warehouse_id = val.warehouse_id
      this.dataJson.tempJson.delivery_sku_code = val.commodity_spec_code
      this.dataJson.tempJson.delivery_sku_name = val.commodity_name
      this.dataJson.tempJson.delivery_pm = val.pm
      this.dataJson.tempJson.delivery_type_gauge = val.type_gauge
      this.dataJson.tempJson.delivery_qty = val.qty
      this.dataJson.tempJson.delivery_unit_name = val.unit_name
      this.dataJson.tempJson.delivery_spec = val.commodity_spec
      this.dataJson.tempJson.has_product_num = val.has_product_num
      this.dataJson.tempJson.release_owner_name = val.owner_name
      this.dataJson.tempJson.release_warehouse_name = val.warehouse_name
      this.dataJson.tempJson.release_warehouse_id = val.warehouse_id
      this.dataJson.tempJson.release_warehouse_code = val.warehouse_code
      this.dataJson.resetWarehouse = false
    },
    // 选择仓库
    handleWarehouseCoproductReturnData (val) {
      if ((this.PARAMETERS.STATUS_INSERT === this.editStatus && this.settings.isPicthOnProduct) || (this.PARAMETERS.STATUS_UPDATE === this.editStatus && this.settings.isPicthOnProduct)) {
        // 获取当前仓库的下标
        const index = this.dataJson.productCurrentJson.index
        const product = this.dataJson.tempJson.coproduct_list[index]
        product.warehouse_id = val.warehouse_id
        product.warehouse_code = val.warehouse_code
        product.warehouse_name = val.warehouse_name
        this.dataJson.tempJson.coproduct_list.splice(index, 1, product)
      }
    },
    // 选择配方表
    handleRouterSelection () {
      this.popSettingsData.woRouter.visible = true
      this.popSettingsData.woRouter.data = { is_enable: '1', product_sku_code: this.dataJson.tempJson.delivery_sku_code }
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
        this.dataJson.tempJson.material_list = data.material_list
        this.dataJson.tempJson.coproduct_list = data.coproduct_list
        this.dataJson.tempJson.product_list = data.product_list

        const val = data.product_list[0]
        this.dataJson.tempJson.goods_name = val.goods_name
        this.dataJson.tempJson.goods_prop = val.goods_prop
        this.dataJson.tempJson.goods_id = val.goods_id
        this.dataJson.tempJson.spec = val.spec
        this.dataJson.tempJson.pm = val.pm
        this.dataJson.tempJson.sku_code = val.sku_code
        this.dataJson.tempJson.sku_id = val.sku_id
        this.dataJson.tempJson.wo_qty = 1
        this.dataJson.tempJson.sku_id = val.id
        this.dataJson.tempJson.unit_id = val.unit_id
        this.dataJson.tempJson.unit_name = val.unit_name
        // if (this.dataJson.tempJson.delivery_order_code !== null && this.dataJson.tempJson.delivery_order_code !== undefined) {
        this.dataJson.tempJson.warehouse_name = this.dataJson.tempJson.warehouse_name
        this.dataJson.tempJson.warehouse_id = this.dataJson.tempJson.warehouse_id
        this.dataJson.tempJson.warehouse_code = this.dataJson.tempJson.warehouse_code
        // }

        this.dataJson.tempJson.material_list.forEach(item => {
          item.wo_qty = item.qty
          item.wo_router = item.qty
          item.warehouse_name = this.dataJson.tempJson.warehouse_name
          item.warehouse_code = this.dataJson.tempJson.warehouse_code
          item.warehouse_id = this.dataJson.tempJson.warehouse_id
        })

        this.dataJson.tempJson.product_list.forEach(item => {
          item.wo_qty = item.qty
          item.wo_router = item.qty
          // 如果选择了订单, 添加仓库
          item.warehouse_name = this.dataJson.tempJson.warehouse_name
          item.warehouse_code = this.dataJson.tempJson.warehouse_code
          item.warehouse_id = this.dataJson.tempJson.warehouse_id
        })

        this.dataJson.tempJson.coproduct_list.forEach(item => {
          item.wo_qty = item.qty
          item.wo_router = item.qty

          item.warehouse_name = this.dataJson.tempJson.warehouse_name
          item.warehouse_code = this.dataJson.tempJson.warehouse_code
          item.warehouse_id = this.dataJson.tempJson.warehouse_id
        })
        this.handleSumData(this.dataJson.tempJson.coproduct_list)

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
    handleWarehouseMaterialReturnData (val) {
      if ((this.PARAMETERS.STATUS_INSERT === this.editStatus && this.settings.isPicthOnMaterial) || (this.PARAMETERS.STATUS_UPDATE === this.editStatus && this.settings.isPicthOnMaterial)) {
        // 获取当前仓库的下标
        const index = this.dataJson.materialCurrentJson.index
        const material = this.dataJson.tempJson.material_list[index]
        material.warehouse_id = val.warehouse_id
        material.warehouse_code = val.warehouse_code
        material.warehouse_name = val.warehouse_name
        this.dataJson.tempJson.material_list.splice(index, 1, material)
      }
    },
    // 获取行索引
    getProductRowIndex (row) {
      const _index = this.dataJson.tempJson.coproduct_list.lastIndexOf(row)
      return _index
    },
    // 副产品行选中
    handleProductCurrentChange (row) {
      this.settings.isPicthOnProduct = true
      this.dataJson.productCurrentJson = Object.assign({}, row) // copy obj
      this.dataJson.productCurrentJson.index = this.getProductRowIndex(row)
      // 设置dialog的返回
      this.$store.dispatch('popUpSearchDialog/selectedDataJson', Object.assign({}, row))
    },
    //  副产品更新
    handleProductCloseUpdateOk (value) {
      this.popSettingsData.productGoods.visible = false
      this.dataJson.tempJson.coproduct_list.splice(value.data.index, 1, value.data)
    },
    // 副产品, 删除
    handleProductDelete () {
      this.dataJson.tempJson.coproduct_list.splice(this.dataJson.productCurrentJson.index, 1)
    },
    // 原材料新增 弹窗
    handleMaterialInsert () {
      this.popSettingsData.materialGoods.visible = true
      this.popSettingsData.materialGoods.dialogStatus = this.PARAMETERS.STATUS_INSERT
    },
    // 原材料, 新增
    handleMaterialCloseOk (value) {
      const data = value.data
      var skuNum = 1
      // 是否有相同的sku
      if (this.dataJson.tempJson.material_list) {
        this.dataJson.tempJson.material_list.forEach(item => {
          // 判断是否有相同的sku
          if (item.sku_id === data.sku_id) {
            skuNum++
          }
        })
        if (skuNum !== 1) {
          this.showErrorMsg('不可添加两条相同的商品')
          return
        }
      }
      this.dataJson.tempJson.material_list.push(data)
      this.popSettingsData.materialGoods.visible = false
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
        const val = response.data.product_list[0]
        this.dataJson.tempJson.goods_name = val.goods_name
        this.dataJson.tempJson.goods_prop = val.goods_prop
        this.dataJson.tempJson.goods_id = val.goods_id
        this.dataJson.tempJson.spec = val.spec
        this.dataJson.tempJson.pm = val.pm
        this.dataJson.tempJson.sku_code = val.sku_code
        this.dataJson.tempJson.sku_id = val.sku_id
        this.dataJson.tempJson.unit_name = val.unit_name
        this.dataJson.tempJson.unit_id = val.unit_id
        this.dataJson.tempJson.warehouse_name = val.warehouse_name
        this.dataJson.tempJson.wo_qty = val.wo_qty
        this.dataJson.tempJson.warehouse_id = val.warehouse_id
        this.dataJson.tempJson.warehouse_code = val.warehouse_code
        this.dataJson.tempJson.current_num = val.wo_qty
        if (this.dataJson.tempJson.delivery_order_code !== null && this.dataJson.tempJson.delivery_order_code !== undefined) {
          this.settings.btnDisabledStatus.disabledRelease = true
          this.dataJson.tempJson.release_owner_name = this.dataJson.tempJson.owner_name
          this.dataJson.tempJson.release_warehouse_name = this.dataJson.tempJson.warehouse_name
          this.dataJson.tempJson.release_warehouse_id = this.dataJson.tempJson.warehouse_id
          this.dataJson.tempJson.release_warehouse_code = this.dataJson.tempJson.warehouse_code
        }
      }).finally(() => {
        this.settings.loading = false
      })
    },
    // 选择单位
    handleProductUnitChange (val) {
      // 根据 sku_id 匹配
      this.dataJson.tempJson.coproduct_list.forEach(item => {
        if (item.sku_id === val.sku_id) {
          item.unit_id = val.src_unit_id
          item.unit_name = val.src_unit
        }
      })
    },
    handleMaterialUnitChange (val) {
      // 获取当前单位的下标
      this.dataJson.tempJson.material_list.forEach(item => {
        if (item.sku_id === val.sku_id) {
          item.unit_id = val.src_unit_id
          item.unit_name = val.src_unit
        }
      })
    },
    // 根据原材料计算副产品数量
    handleProductNum (val, row) {
    },
    // 清空配方表
    handleRouterClear () {
      this.dataJson.tempJson.material_list = []
      this.dataJson.tempJson.coproduct_list = []
      this.dataJson.tempJson.goods_name = null
      this.dataJson.tempJson.goods_prop = null
      this.dataJson.tempJson.goods_id = null
      this.dataJson.tempJson.spec = null
      this.dataJson.tempJson.pm = null
      this.dataJson.tempJson.sku_code = null
      this.dataJson.tempJson.sku_id = null
      this.dataJson.tempJson.wo_qty = 0
      this.dataJson.tempJson.sku_id = null
      this.dataJson.tempJson.unit_id = null
      this.dataJson.tempJson.unit_name = null
      // 不清空仓库
      // if (this.dataJson.tempJson.delivery_order_code === null || this.dataJson.tempJson.delivery_order_code === undefined) {
      //   this.dataJson.tempJson.warehouse_id = null
      //   this.dataJson.tempJson.warehouse_name = null
      //   this.dataJson.tempJson.warehouse_code = null
      // }
      // this.dataJson.resetWarehouse = !this.dataJson.resetWarehouse
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
    // 产量计算
    handleSumWoQty () {
      const wo_qty = this.dataJson.tempJson.wo_qty
      // 计算副产品
      this.dataJson.tempJson.coproduct_list.forEach(item => {
        item.wo_qty = item.wo_router * wo_qty
      })
      this.dataJson.tempJson.material_list.forEach(item => {
        item.wo_qty = item.wo_router * wo_qty
      })
      this.dataJson.tempJson.material_list = deepCopy(this.dataJson.tempJson.material_list)
      // 将值放在 product_list中
      const product = this.dataJson.tempJson.product_list[0]
      product.wo_qty = wo_qty
      this.dataJson.tempJson.product_list.splice(0, 1, product)
      this.handleSumData()
    },
    // 计算合计
    handleSumData () {
      // 计算合计
      if (this.dataJson.tempJson.coproduct_list.length) {
        this.dataJson.sumData.product_actual = this.dataJson.tempJson.coproduct_list.map(item => item.wo_qty).reduce((pre, cur) => pre + cur)
      } else {
        this.dataJson.sumData.product_actual = 0
      }
      if (this.dataJson.tempJson.material_list.length) {
        this.dataJson.sumData.material_actual = this.dataJson.tempJson.material_list.map(item => item.wo_qty).reduce((pre, cur) => pre + cur)
      } else {
        this.dataJson.sumData.material_actual = 0
      }
    },
    getDeliveryOrderDetail (delivery_order_detail_id) {
      const param = { detail_id: delivery_order_detail_id }
      getOrderDetailApi(param).then(response => {
        // this.handleRouterClear()
        this.handleUpdateReleaseOrder(response.data)
      }).finally(() => {
        this.settings.loading = false
      })
    },
    // 货主下拉框
    getOwnerData () {
      getOwnerComboListApi().then((_data) => {
        this.dataJson.ownerComboList = _data.data
        // 下推情况下, 或者选择订单 不覆盖带过来的货主
        if ((this.data === null || this.data.delivery_order_detail_id === null) && (this.dataJson.tempJson.delivery_order_code === null || this.dataJson.tempJson.delivery_order_code === undefined)) {
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
    // 选择仓库
    /*  handleWarehouseProductReturnData (val) {
      if (val !== null) {
        // 获取当前仓库的下标
        this.dataJson.tempJson.warehouse_name = val.warehouse_name
        this.dataJson.tempJson.warehouse_id = val.warehouse_id
        this.dataJson.tempJson.warehouse_code = val.warehouse_code
        const product = this.dataJson.tempJson.product_list[0]
        if (product !== undefined) {
          debugger
          product.warehouse_id = val.warehouse_id
          product.warehouse_code = val.warehouse_code
          product.warehouse_name = val.warehouse_name
          this.dataJson.tempJson.product_list.splice(0, 1, product)
        }
      } else {
        // 获取当前仓库的下标
        this.dataJson.tempJson.warehouse_name = null
        this.dataJson.tempJson.warehouse_id = null
        this.dataJson.tempJson.warehouse_code = null
        const product = this.dataJson.tempJson.product_list[0]
        if (product !== undefined) {
          product.warehouse_id = null
          product.warehouse_code = null
          product.warehouse_name = null
          this.dataJson.tempJson.product_list.splice(0, 1, product)
        }
      }
    },*/
    // 选择仓库
    handleWarehouseReturnData (val) {
      if (val !== null) {
        // 获取当前仓库的下标
        this.dataJson.tempJson.warehouse_name = val.warehouse_name
        this.dataJson.tempJson.warehouse_id = val.warehouse_id
        this.dataJson.tempJson.warehouse_code = val.warehouse_code
        const product = this.dataJson.tempJson.product_list[0]
        // 添加原材料
        if (product !== undefined) {
          product.warehouse_id = val.warehouse_id
          product.warehouse_code = val.warehouse_code
          product.warehouse_name = val.warehouse_name
          this.dataJson.tempJson.product_list.splice(0, 1, product)
        }
        if (this.dataJson.tempJson.coproduct_list !== undefined) {
          this.dataJson.tempJson.coproduct_list.forEach(item => {
            item.warehouse_name = this.dataJson.tempJson.warehouse_name
            item.warehouse_code = this.dataJson.tempJson.warehouse_code
            item.warehouse_id = this.dataJson.tempJson.warehouse_id
          })
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
        const product = this.dataJson.tempJson.product_list[0]
        if (product !== undefined) {
          product.warehouse_id = null
          product.warehouse_code = null
          product.warehouse_name = null
          this.dataJson.tempJson.product_list.splice(0, 1, product)
        }
        if (this.dataJson.tempJson.coproduct_list !== undefined) {
          this.dataJson.tempJson.coproduct_list.forEach(item => {
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
      // 如果 product_list 和 material_list 不为空, 且仓库,货主不为空, 查询集合中的商品数量
      if ((this.dataJson.tempJson.material_list !== null && this.dataJson.tempJson.material_list !== undefined && this.dataJson.tempJson.material_list.length) &&
        (this.dataJson.tempJson.warehouse_id !== null && this.dataJson.tempJson.warehouse_id !== undefined) &&
        (this.dataJson.tempJson.owner_id !== null && this.dataJson.tempJson.owner_id !== undefined)) {
        this.handleCalcInventory()
      }
    },
    // 获取商品库存
    handleCalcInventory () {
      getInventoryApi(this.dataJson.tempJson).then(response => {
        const data = response.data.material_list
        this.dataJson.tempJson.material_list.forEach(item => {
          for (const index in data) {
            if (data[index].sku_id === item.sku_id) {
              item.qty_avaible = data[index].qty_avaible
            }
          }
        })
        this.dataJson.tempJson.material_list = deepCopy(response.data.material_list)
      }).finally(() => {
        this.settings.loading = false
      })
    }
  }

}

</script>
