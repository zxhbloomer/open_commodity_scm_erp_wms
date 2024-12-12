<template>
  <div class="app-container">
    <div class="edit-container">
      <el-form
        ref="dataSubmitForm"
        :rules="settings.rules"
        :model="dataJson.tempJson"
        label-position="right"
        label-width="0px"
        status-icon
      >
        <el-alert
          title="生产配方信息"
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

          <el-descriptions-item label="配方编号">
            {{ dataJson.tempJson.code == null || dataJson.tempJson.code == ''?'系统自动生成':dataJson.tempJson.code }}
          </el-descriptions-item>

          <el-descriptions-item>
            <div
              slot="label"
              class="required-mark"
            >
              配方名称
            </div>
            <el-form-item prop="name">
              <el-input
                v-model.trim="dataJson.tempJson.name"
                clearable
                :disabled="isViewModel"
                placeholder="请输入配方名称"
              />
            </el-form-item>
          </el-descriptions-item>
          <el-descriptions-item />
          <el-descriptions-item>
            <div
              slot="label"
              class="required-mark"
            >
              物料编码
            </div>
            <el-form-item prop="sku_code">
              <input-search
                v-model.trim="dataJson.tempJson.sku_code"
                :disabled="isViewModel"
                @onInputSearch="handleSpecDialog"
              />
            </el-form-item>
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
            {{ dataJson.tempJson.sku_code == null ? '' : '1' }}
          </el-descriptions-item>
          <el-descriptions-item>
            <div
              slot="label"
              class="required-mark"
            >
              单位
            </div>
            <el-form-item prop="unit_id">
              <select-unit
                ref="ref_select_unit"
                v-model.trim="dataJson.tempJson.unit_id"
                :sku-id="dataJson.tempJson.sku_id"
                :disabled="isViewModel || !(settings.btnShowStatus.showUpdate || settings.btnShowStatus.showInsert)"
                @change="handleUnitChange"
              />
            </el-form-item>
          </el-descriptions-item>
          <el-descriptions-item />
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
                  {{ formatNumber3(dataJson.sumData.product_actual) }}
                </font>
              </span>
            </div>
          </el-col>
        </el-row>
        <br>
        <el-button-group v-if="!isViewModel">
          <el-button
            :disabled="!settings.btnDisabledStatus.disabledInsert"
            type="primary"
            icon="el-icon-edit-outline"
            :loading="settings.loading"
            @click="handleProductInsert"
          >新增</el-button>
          <el-button
            :disabled="!settings.btnDisabledStatus.disabledProductUpdate"
            type="primary"
            icon="el-icon-edit-outline"
            :loading="settings.loading"
            @click="handleProductUpdate"
          >编辑</el-button>
          <el-button
            :disabled="!settings.btnDisabledStatus.disabledProductDelete"
            type="primary"
            icon="el-icon-edit-outline"
            :loading="settings.loading"
            @click="handleProductDelete"
          >删除</el-button>
        </el-button-group>

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
          style="width: 98%;margin-right: 10px;margin-left: 10px;"
          @current-change="handleProductCurrentChange"
        >
          <el-table-column
            type="index"
            width="50"
            label="序号"
          />
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
          />

          <el-table-column
            show-overflow-tooltip
            min-width="150"
            prop="router"
            label="生产"
            align="right"
          >
            <template v-slot="scope">
              {{ scope.row.qty == null? '': formatNumber3(scope.row.qty) }}
            </template>
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            min-width="130"
            prop="unit_name"
            label="单位"
          />
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
                  {{ formatNumber3(dataJson.sumData.material_actual) }}
                </font>
              </span>
            </div>
          </el-col>
        </el-row>
        <br>
        <el-button-group v-if="!isViewModel">
          <el-button
            :disabled="!settings.btnDisabledStatus.disabledInsert"
            type="primary"
            icon="el-icon-edit-outline"
            :loading="settings.loading"
            @click="handleMaterialInsert"
          >新增</el-button>
          <el-button
            :disabled="!settings.btnDisabledStatus.disabledMaterialUpdate"
            type="primary"
            icon="el-icon-edit-outline"
            :loading="settings.loading"
            @click="handleMaterialUpdate"
          >编辑</el-button>
          <el-button
            :disabled="!settings.btnDisabledStatus.disabledMaterialDelete"
            type="primary"
            icon="el-icon-edit-outline"
            :loading="settings.loading"
            @click="handleMaterialDelete"
          >删除</el-button>
        </el-button-group>
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
          style="width: 98%;margin-right: 10px;margin-left: 10px;"
          @current-change="handleMaterialCurrentChange"
        >
          <el-table-column
            type="index"
            width="50"
            label="序号"
          />
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
          />

          <el-table-column
            show-overflow-tooltip
            min-width="150"
            prop="qty"
            label="消耗"
            align="right"
          >
            <template v-slot="scope">
              {{ scope.row.qty == null? '': formatNumber3(scope.row.qty) }}
            </template>
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            min-width="130"
            prop="unit_name"
            label="单位"
          />
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
        :loading="settings.loading"
        @click="doInsert()"
      >保存</el-button>
      <el-button
        v-show="settings.btnShowStatus.showUpdate && !isViewModel"
        type="primary"
        :disabled="settings.loading || settings.btnDisabledStatus.disabledUpdate"
        size="medium"
        :loading="settings.loading"
        @click="doUpdate()"
      >保存</el-button>
      <el-button
        :disabled="settings.loading"
        size="medium"
        @click="handleCancel()"
      >返回</el-button>
    </div>

    <!--    副产品-->
    <product-goods
      v-if="popSettingsData.productGoods.visible"
      :visible="popSettingsData.productGoods.visible"
      :dialog-status="popSettingsData.productGoods.dialogStatus"
      :data="popSettingsData.productGoods.data"
      @closeMeOk="handleProductCloseOk"
      @closeMeCancel="handleProductCloseCancel"
      @closeMeUpdateOk="handleProductCloseUpdateOk"
    />

    <material-goods
      v-if="popSettingsData.materialGoods.visible"
      :visible="popSettingsData.materialGoods.visible"
      :dialog-status="popSettingsData.materialGoods.dialogStatus"
      :data="popSettingsData.materialGoods.data"
      @closeMeOk="handleMaterialCloseOk"
      @closeMeCancel="handleMaterialCloseCancel"
      @closeMeUpdateOk="handleMaterialCloseUpdateOk"
    />

    <!-- 产成品 -->
    <spec-dialog
      v-if="popSettingsData.specDialog.visible"
      :visible="popSettingsData.specDialog.visible"
      :data="popSettingsData.productGoods.data"
      :search-data="'产成品'"
      @closeMeOk="handleSpecCloseOk"
      @closeMeCancel="handleSpecCloseCancel"
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
</style>

<script>
import constants_para from '@/common/constants/constants_para'
import elDragDialog from '@/directive/el-drag-dialog'
import deepCopy from 'deep-copy'
import { insertApi, updateApi, getApi } from '@/api/40_business/rtworouter/rtworouter'
import specDialog from '@/views/40_business/worouter/spec/dialog/dialog'
import productGoods from '@/views/40_business/rtworouter/tabs/dialog/productGoods'
import materialGoods from '@/views/40_business/rtworouter/tabs/dialog/materialGoods'
// import constants_type from '@/common/constants/constants_dict'
import InputSearch from '@/components/40_input/inputSearch'
import { isNotEmpty } from '@/utils/index.js'
import selectUnit from '@/views/30_wms/spec/unit/selectUnit/selectUnit'

export default {
  components: { productGoods, materialGoods, specDialog, InputSearch, selectUnit },
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
        // 产成品, 副产品弹出框
        productGoods: {
          // 弹出框显示参数
          visible: false,
          data: null,
          // 点击确定以后返回的值
          selectedDataJson: {
            id: null
          }
        },
        // 原材料弹出框
        materialGoods: {
          // 弹出框显示参数
          visible: false,
          data: null,
          // 点击确定以后返回的值
          selectedDataJson: {
            id: null
          }
        },
        // 产成品 选择商品弹窗
        specDialog: {
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
        // 单条数据 json的，初始化原始数据
        tempJsonOriginal: {
          id: null,
          name: '',
          code: null,
          product_list: [],
          material_list: [],
          coproduct_list: []
        },
        sumData: {
          product_actual: 0,
          material_actual: 0
        },
        // 单条数据 json
        tempJson: {
          id: null,
          name: '',
          code: null,
          product_list: [],
          material_list: [],
          coproduct_list: []
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
          disabledInsert: true,
          // 产成品编辑
          disabledProductUpdate: false,
          // 产成品删除
          disabledProductDelete: false,
          // 原材料删除
          disabledMaterialDelete: false,
          // 原材料编辑
          disabledMaterialUpdate: false,
          // 保存按钮
          disabledSave: true,
          disabledUpdate: true
        },
        // 以下为pop的内容：数据弹出框
        selection: [],
        dialogStatus: this.editStatus,
        // pop的check内容
        rules: {
          name: [
            { required: true, message: '请选择配方名称', trigger: 'blur' }
          ],
          unit_id: [
            { validator: this.unit_id_validator, trigger: 'change' }
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

      this.settings.loading = false
      // 设置按钮
      this.settings.btnShowStatus.showInsert = true
    },
    // 编辑时初始化
    initUpdateModel () {
      this.settings.btnShowStatus.showUpdate = true
      this.getData()
    },
    // 查看时的初始化
    initViewModel () {
      // 数据初始化
      // this.dataJson.tempJson = deepCopy(this.data)
      this.getData()
    },
    // 设置监听器
    setWatch () {
      this.unWatch()
      // 监听页面上面是否有修改，有修改按钮高亮
      this.watch.unwatch_tempJson = this.$watch(
        'dataJson.tempJson.coproduct_list', (newVal, oldVal) => {
          this.handleSumData()
          if (this.dataJson.tempJson.coproduct_list && this.dataJson.tempJson.material_list) {
            this.settings.btnDisabledStatus.disabledSave = false
            this.settings.btnDisabledStatus.disabledUpdate = false
          }
        },
        { deep: true }
      )
      this.watch.unwatch_tempJson = this.$watch(
        'dataJson.tempJson.material_list', (newVal, oldVal) => {
          if (this.dataJson.tempJson.coproduct_list && this.dataJson.tempJson.material_list) {
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
          // 计算产成品, 副产品配比
          if (tempData.product_list.length === 0) {
            this.showErrorMsg('请选择产成品')
            return
          }
          if (tempData.coproduct_list.length === 0) {
            this.showErrorMsg('请选择副产品')
            return
          }
          if (tempData.material_list.length === 0) {
            this.showErrorMsg('请选择原材料')
            return
          }
          // const productRouter = tempData.product_list.map(item => item.router).reduce((pre, cur) => pre + cur)
          // if (productRouter !== 100) {
          //   this.showErrorMsg('产成品,副产品明细的配比之和应为100%')
          //   return
          // }
          // const materialRouter = tempData.material_list.map(item => item.router).reduce((pre, cur) => pre + cur)
          // debugger
          // if (materialRouter !== 100) {
          //   this.showErrorMsg('原材料明细的配比之和应为100%')
          //   debugger

          //   return
          // }
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
          // 计算产成品, 副产品配比
          if (tempData.product_list.length === 0) {
            this.showErrorMsg('请选择产成品')
            return
          }
          if (tempData.coproduct_list.length === 0) {
            this.showErrorMsg('请选择副产品')
            return
          }
          if (tempData.material_list.length === 0) {
            this.showErrorMsg('请选择原材料')
            return
          }
          // 计算产成品, 副产品配比
          // const productRouter = tempData.product_list.map(item => item.router).reduce((pre, cur) => pre + cur)
          // if (productRouter !== 100) {
          //   this.showErrorMsg('产成品,副产品明细的配比之和应为100%')
          //   return
          // }
          // const materialRouter = tempData.material_list.map(item => item.router).reduce((pre, cur) => pre + cur)
          // if (materialRouter !== 100) {
          //   this.showErrorMsg('原材料明细的配比之和应为100%')
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
    // 副产品 新增弹框
    handleProductInsert () {
      this.popSettingsData.productGoods.visible = true
      this.popSettingsData.productGoods.dialogStatus = this.PARAMETERS.STATUS_INSERT
    },
    //  副产品, 新增
    handleProductCloseOk (value) {
      const data = value.data
      // 判断是否只有一个产成品, 是否有相同的sku
      if (this.dataJson.tempJson.coproduct_list.length) {
        for (let i = 0; i < this.dataJson.tempJson.coproduct_list.length; i++) {
          if (this.dataJson.tempJson.coproduct_list[i].sku_id === data.sku_id) {
            this.showErrorMsg('不可添加两条相同的商品')
            return
          }
        }
      }
      if (this.dataJson.tempJson.sku_id !== null && this.dataJson.tempJson.sku_id !== undefined && this.dataJson.tempJson.sku_id === data.sku_id) {
        this.showErrorMsg('产成品, 副产品不能选择相同商品')
        return
      }
      this.dataJson.tempJson.coproduct_list.push(data)
      this.popSettingsData.productGoods.visible = false
      this.handleSumData()
    },
    // 产成品,副产品关闭弹窗
    handleProductCloseCancel () {
      this.popSettingsData.productGoods.visible = false
    },
    //  副产品编辑
    handleProductUpdate () {
      this.popSettingsData.productGoods.visible = true
      this.popSettingsData.productGoods.dialogStatus = this.PARAMETERS.STATUS_UPDATE
      this.popSettingsData.productGoods.data = this.dataJson.productCurrentJson
    },
    // 获取行索引
    getProductRowIndex (row) {
      const _index = this.dataJson.tempJson.coproduct_list.lastIndexOf(row)
      return _index
    },
    // 产成品,副产品行选中
    handleProductCurrentChange (row) {
      this.dataJson.productCurrentJson = Object.assign({}, row) // copy obj
      this.dataJson.productCurrentJson.index = this.getProductRowIndex(row)
      if (this.dataJson.productCurrentJson.index !== -1) {
        this.settings.btnDisabledStatus.disabledProductUpdate = true
        this.settings.btnDisabledStatus.disabledProductDelete = true
      } else {
        this.settings.btnDisabledStatus.disabledProductUpdate = false
        this.settings.btnDisabledStatus.disabledProductDelete = false
      }
      // 设置dialog的返回
      this.$store.dispatch('popUpSearchDialog/selectedDataJson', Object.assign({}, row))
    },
    // 副产品更新
    handleProductCloseUpdateOk (value) {
      // 判断是否只有一个产成品, 是否有相同的sku
      if (this.dataJson.tempJson.coproduct_list.length) {
        for (let i = 0; i < this.dataJson.tempJson.coproduct_list.length; i++) {
          if (value.data.index !== i) {
            if (this.dataJson.tempJson.coproduct_list[i].sku_id === value.data.sku_id) {
              this.showErrorMsg('不可添加两条相同的商品')
              return
            }
          }
        }
      }
      if (this.dataJson.tempJson.sku_id !== null && this.dataJson.tempJson.sku_id !== undefined && this.dataJson.tempJson.sku_id === value.data.sku_id) {
        this.showErrorMsg('产成品, 副产品不能选择相同商品')
        return
      }

      this.popSettingsData.productGoods.visible = false
      this.dataJson.tempJson.coproduct_list.splice(value.data.index, 1, value.data)
      this.handleSumData()
    },
    // 副产品, 删除
    handleProductDelete () {
      this.dataJson.tempJson.coproduct_list.splice(this.dataJson.productCurrentJson.index, 1)
      this.handleSumData()
    },
    // 原材料新增 弹窗
    handleMaterialInsert () {
      this.popSettingsData.materialGoods.visible = true
      this.popSettingsData.materialGoods.dialogStatus = this.PARAMETERS.STATUS_INSERT
    },
    // 原材料, 新增
    handleMaterialCloseOk (value) {
      const data = value.data
      // 是否有相同的sku
      if (this.dataJson.tempJson.material_list.length) {
        for (let i = 0; i < this.dataJson.tempJson.material_list.length; i++) {
          if (this.dataJson.tempJson.material_list[i].sku_id === data.sku_id) {
            this.showErrorMsg('不可添加两条相同的商品')
            return
          }
        }
      }
      this.dataJson.tempJson.material_list.push(data)
      this.popSettingsData.materialGoods.visible = false
      this.handleSumData()
    },
    // 原材料关闭弹窗
    handleMaterialCloseCancel () {
      this.popSettingsData.materialGoods.visible = false
    },
    // 原材料编辑
    handleMaterialUpdate () {
      this.popSettingsData.materialGoods.visible = true
      this.popSettingsData.materialGoods.dialogStatus = this.PARAMETERS.STATUS_UPDATE
      this.popSettingsData.materialGoods.data = this.dataJson.materialCurrentJson
    },
    // 获取行索引
    getMaterialRowIndex (row) {
      const _index = this.dataJson.tempJson.material_list.lastIndexOf(row)
      return _index
    },
    // 产成品,副产品行选中
    handleMaterialCurrentChange (row) {
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
    // 产成品, 副产品更新
    handleMaterialCloseUpdateOk (value) {
      // 判断是否只有一个产成品, 是否有相同的sku
      if (this.dataJson.tempJson.material_list.length) {
        for (let i = 0; i < this.dataJson.tempJson.material_list.length; i++) {
          if (value.data.index !== i) {
            if (this.dataJson.tempJson.material_list[i].sku_id === value.data.sku_id) {
              this.showErrorMsg('不可添加两条相同的商品')
              return
            }
          }
        }
      }
      this.popSettingsData.materialGoods.visible = false
      this.dataJson.tempJson.material_list.splice(value.data.index, 1, value.data)
      this.handleSumData()
    },
    // 产成品, 副产品, 删除
    handleMaterialDelete () {
      this.dataJson.tempJson.material_list.splice(this.dataJson.materialCurrentJson.index, 1)
      this.handleSumData()
    },
    // 获取数据
    getData () {
      this.settings.loading = true
      getApi(this.data).then(response => {
        this.dataJson.tempJson = deepCopy(response.data)
        // 把产成品取出来
        if (response.data.product_list !== null) {
          const val = response.data.product_list[0]
          this.dataJson.tempJson.goods_name = val.goods_name
          this.dataJson.tempJson.goods_prop = val.goods_prop
          this.dataJson.tempJson.goods_id = val.goods_id
          this.dataJson.tempJson.spec = val.spec
          this.dataJson.tempJson.pm = val.pm
          this.dataJson.tempJson.sku_code = val.sku_code
          this.dataJson.tempJson.sku_id = val.sku_id
          // this.popSettingsData.specDialog.visible = false
          this.dataJson.tempJson.unit = '吨'
        }
      }).finally(() => {
        this.settings.loading = false
      })
    },
    // 产成品选择商品
    handleSpecDialog () {
      this.popSettingsData.specDialog.visible = true
    },
    // 产成品, 规格：关闭对话框：确定
    handleSpecCloseOk (val) {
      // 校验是否跟副产品有重复商品
      if (this.dataJson.tempJson.coproduct_list.length) {
        for (let i = 0; i < this.dataJson.tempJson.coproduct_list.length; i++) {
          if (this.dataJson.tempJson.coproduct_list[i].sku_id === val.id) {
            this.showErrorMsg('产成品, 副产品不能选择相同商品')
            return
          }
        }
      }
      const product = {}
      this.popSettingsData.specDialog.selectedDataJson = val
      this.dataJson.tempJson.goods_name = val.name
      this.dataJson.tempJson.goods_prop = val.prop_name
      this.dataJson.tempJson.goods_id = val.goods_id
      this.dataJson.tempJson.spec = val.spec
      this.dataJson.tempJson.pm = val.pm
      this.dataJson.tempJson.sku_code = val.code
      this.dataJson.tempJson.sku_id = val.id
      this.popSettingsData.specDialog.visible = false
      this.dataJson.tempJson.unit = '吨'
      this.dataJson.tempJson.sku_id = val.id
      this.dataJson.tempJson.product_list = []
      this.dataJson.tempJson.qty = 1
      product.sku_code = val.code
      product.sku_id = val.id
      product.goods_prop = val.prop_name
      product.goods_name = val.name
      product.pm = val.pm
      product.spec = val.spec
      product.qty = 1
      this.dataJson.tempJson.product_list.splice(0, 1, product)
    },
    // 规格：关闭对话框：取消
    handleSpecCloseCancel () {
      this.popSettingsData.specDialog.visible = false
    },
    // 选择单位
    handleUnitChange (val) {
      if (isNotEmpty(val)) {
        this.dataJson.tempJson.unit_id = val.src_unit_id
        this.dataJson.tempJson.unit_name = val.src_unit
        const product = this.dataJson.tempJson.product_list[0]
        product.unit_id = val.src_unit_id
        product.unit_name = val.src_unit
        this.dataJson.tempJson.product_list.splice(0, 1, product)
      } else {
        this.dataJson.tempJson.unit_id = undefined
        this.dataJson.tempJson.unit_name = undefined
      }
    },
    // 计算合计
    handleSumData () {
      // 计算合计
      if (this.dataJson.tempJson.coproduct_list.length) {
        this.dataJson.sumData.product_actual = this.dataJson.tempJson.coproduct_list.map(item => item.qty).reduce((pre, cur) => pre + cur)
      } else {
        this.dataJson.sumData.product_actual = 0
      }
      if (this.dataJson.tempJson.material_list.length) {
        this.dataJson.sumData.material_actual = this.dataJson.tempJson.material_list.map(item => item.qty).reduce((pre, cur) => pre + cur)
      } else {
        this.dataJson.sumData.material_actual = 0
      }
    },
    // 单位校验
    unit_id_validator (rule, value, callback) {
      if (this.dataJson.tempJson.unit_id === undefined || this.dataJson.tempJson.unit_id === null) {
        callback(new Error('请选择单位'))
      } else {
        callback()
      }
    }
  }

}

</script>
