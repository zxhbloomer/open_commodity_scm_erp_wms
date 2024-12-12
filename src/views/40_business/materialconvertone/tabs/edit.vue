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
          <el-descriptions-item label="物料转换单号">
            {{ dataJson.tempJson.code == null || dataJson.tempJson.code == ''?'系统自动生成':dataJson.tempJson.code }}
          </el-descriptions-item>

          <el-descriptions-item>
            <div
              slot="label"
              class="required-mark"
            >
              名称
            </div>
            <el-form-item
              prop="name"
              label-width="0"
            >
              <el-input
                v-model.trim="dataJson.tempJson.name"
                clearable
                show-word-limit
                :maxlength="dataJson.inputSettings.maxLength.num"
                :placeholder="isPlaceholderShow('请输入名称')"
                :disabled="isViewModel"
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
              <el-select
                v-model="dataJson.tempJson.owner_name"
                :placeholder="isPlaceholderShow('请选择货主')"
                :disabled="isViewModel"
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
              仓库
            </div>
            <el-form-item
              prop="warehouse_name"
              label-width="0"
            >

              <select-warehouse
                v-model.trim="dataJson.tempJson.warehouse_name"
                placement="left"
                :warehouse1="dataJson.tempJson.warehouse_id"
                :disabled="isUpdateModel && isViewModel"
                @onReturnData="handleWarehouseReturnData"
              />
            </el-form-item>
          </el-descriptions-item>

          <el-descriptions-item>
            <div
              slot="label"
              class="required-mark"
            >
              转换类型
            </div>
            <el-form-item
              prop="type"
              label-width="0"
            >
              <select-dict
                v-model="dataJson.tempJson.type"
                :disabled="isUpdateModel && isViewModel"
                :para="CONSTANTS.DICT_B_MATERIAL_CONVERT_TYPE"
                init-placeholder="转换类型"
              />
            </el-form-item>
          </el-descriptions-item>

          <el-descriptions-item v-if="dataJson.tempJson.type === '1'">
            <div
              slot="label"
              class="required-mark"
            >
              启用状态
            </div>
            <el-form-item
              prop="is_effective"
              label-width="0"
            >
              <el-switch
                v-model="dataJson.tempJson.is_effective"
                :disabled="isUpdateModel && isViewModel"
                active-text="启用"
                inactive-text="停用"
              />
            </el-form-item>
          </el-descriptions-item>
          <el-descriptions-item v-if="dataJson.tempJson.type === '0'" />
        </el-descriptions>

        <br>

        <el-alert
          title="转换后物料信息"
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
              物料编码
            </div>
            <el-form-item
              prop="sku_code"
              label-width="0"
            >
              <input-search
                v-model.trim="dataJson.tempJson.sku_code"
                :disabled="!dataJson.tempJson.is_sku ||( isUpdateModel && isViewModel)"
                :data="data"
                @onInputSearch="handleNewSpecDialog"
              />
            </el-form-item>
          </el-descriptions-item>
          <el-descriptions-item label="物料名称">
            <el-form-item
              prop="goods_name"
              label-width="0"
            >
              <el-input
                v-model.trim="dataJson.tempJson.goods_name"
                clearable
                disabled
                show-word-limit
              />
            </el-form-item>
          </el-descriptions-item>
          <el-descriptions-item label="品名">
            <el-form-item
              prop="pm"
              label-width="0"
            >
              <el-input
                v-model.trim="dataJson.tempJson.pm"
                clearable
                show-word-limit
                disabled
              />
            </el-form-item>
          </el-descriptions-item>
          <el-descriptions-item label="规格">
            <el-form-item
              prop="spec"
              label-width="0"
            >
              <el-input
                v-model.trim="dataJson.tempJson.spec"
                clearable
                show-word-limit
                disabled
              />
            </el-form-item>
          </el-descriptions-item>
          <el-descriptions-item />
          <el-descriptions-item />
        </el-descriptions>
        <br>

        <el-alert
          type="info"
          :closable="false"
        >
          <div style="position:relative;display:block; width:100%">
            <span>转换前物料明细</span>
            <span style="position:absolute;right:0"> {{ dataJson.tempJson.count == null?'0':dataJson.tempJson.count }}</span>
          </div>
        </el-alert>
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
            :disabled="!settings.topBtnShowStatus.showUpdate"
            type="primary"
            icon="el-icon-edit-outline"
            :loading="settings.loading"
            @click="handleGoodsEdit"
          >编辑</el-button>

          <el-button
            v-show="!isViewModel"
            :disabled="!settings.topBtnShowStatus.showUpdate"
            type="primary"
            icon="el-icon-circle-close"
            :loading="settings.loading"
            @click="handleGoodsDelete"
          >删除</el-button>
        </el-button-group>

        <el-table
          ref="multipleTable"
          v-loading="settings.loading"
          :data="dataJson.detailListData"
          :element-loading-text="'正在拼命加载中...'"
          element-loading-background="rgba(255, 255, 255, 0.5)"
          :height="settings.tableHeight"
          stripe
          border
          highlight-current-row
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
            min-width="150"
            prop="source_sku_code"
            label="原物料编码"
          />
          <el-table-column
            show-overflow-tooltip
            min-width="120"
            prop="source_goods_name"
            label="原物料名称"
          />
          <el-table-column
            show-overflow-tooltip
            min-width="130"
            prop="source_spec"
            label="原物料规格"
          />
          <el-table-column
            show-overflow-tooltip
            min-width="130"
            prop="source_pm"
            label="原物料品名"
          />
          <!-- <el-table-column
            show-overflow-tooltip
            min-width="120"
            prop="target_sku_code"
            label="新物料编码"
          />
          <el-table-column
            show-overflow-tooltip
            min-width="130"
            prop="target_goods_name"
            label="新物料名称"
          />
          <el-table-column
            show-overflow-tooltip
            min-width="130"
            prop="target_spec"
            label="新物料规格"
          />
          <el-table-column
            show-overflow-tooltip
            min-width="130"
            prop="target_pm"
            label="新物料品名"
          /> -->
          <el-table-column
            show-overflow-tooltip
            min-width="150"
            prop="relation"
            label="转换比例"
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
        v-show="settings.btnShowStatus.showUpdate"
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

    <owner-dialog
      v-if="popSettingsData.searchDialogDataTwo.visible"
      :title="popSettingsData.searchDialogDataTwo.title"
      :visible="popSettingsData.searchDialogDataTwo.visible"
      @closeMeOk="handleOwnerCloseOk"
      @closeMeCancel="handleOwnerCloseCancel"
    />

    <goods-dialog
      v-if="popSettingsData.goodsDialog.visible"
      :dialog-status="popSettingsData.goodsDialog.dialogStatus"
      :title="popSettingsData.goodsDialog.title"
      :visible="popSettingsData.goodsDialog.visible"
      :data="popSettingsData.goodsDialog.data"
      @closeMeOk="handleGoodsCloseOk"
      @closeMeCancel="handleGoodsCloseCancel"
    />

    <warehouse-dialog
      v-if="popSettingsData.searchDialogDataFive.visible"
      :title="popSettingsData.searchDialogDataFive.title"
      :visible="popSettingsData.searchDialogDataFive.visible"
      @closeMeOk="handleWarehouseCloseOk"
      @closeMeCancel="handleWarehouseCloseCancel"
    />

    <new-spec-dialog
      v-if="popSettingsData.newSpecDialog.visible"
      :visible="popSettingsData.newSpecDialog.visible"
      :data="dataJson.searchForm"
      @closeMeOk="handleNewSpecCloseOk"
      @closeMeCancel="handleNewSpecCloseCancel"
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
<style>
.el-alert__content {
  width: 100% !important;
}
</style>

<script>
import constants_para from '@/common/constants/constants_para'
import elDragDialog from '@/directive/el-drag-dialog'
import deepCopy from 'deep-copy'
import { insertApi, updateApi, get1Api } from '@/api/40_business/materialconvert/materialconvert'
import InputSearch from '@/components/40_input/inputSearch'
import ownerDialog from '@/views/30_wms/owner/dialog/dialog'
import warehouseDialog from '@/views/30_wms/warehouse/dialog/dialog'
import goodsDialog from '@/views/40_business/materialconvert/tabs/dialog/goodsEdit'
import mixin from './mixin/editResizeHandlerMixin'
import newSpecDialog from '@/views/30_wms/spec/dialog/dialog'
import SelectDict from '@/components/00_dict/select/SelectDict'
import { getOwnerComboListApi } from '@/api/30_wms/owner/owner'
import SelectWarehouse from '@/views/30_wms/warehouse/selectgrid/selectWarehouseLocationBin'

export default {
  components: { SelectDict, newSpecDialog, InputSearch, ownerDialog, goodsDialog, warehouseDialog, SelectWarehouse },
  directives: { elDragDialog },
  mixins: [mixin],
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    data: {
      type: Object,
      default: null
    },
    editStatus: {
      type: String,
      default: constants_para.STATUS_INSERT
    },
    canEdit: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      id: '',
      // 监听器
      watch: {
        unwatch_tempJson: null
      },
      contentStyle: {
        width: '15%'
      },
      labelStyle: {
        width: '10%',
        'text-align': 'right'
      },
      popSettingsData: {
        newSpecDialog: {
          // 弹出框显示参数
          visible: false,
          data: null,
          // 点击确定以后返回的值
          selectedDataJson: {
            id: null
          }
        },
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
        ownerComboList: [],
        // 弹出的商品查询框参数设置
        goodsDialog: {
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
        // 级联选择器数据
        cascader: {
          data: null,
          value: ''
        },
        // 单条数据 json的，初始化原始数据
        tempJsonOriginal: {
          type: '0',
          frequency: '2',
          is_sku: true,
          warehouse_name: undefined,
          sku_code: undefined,
          owner_name: undefined

        },
        // 单条数据 json
        tempJson: {
          type: '0',
          frequency: '2',
          is_sku: true,
          warehouse_name: undefined,
          sku_code: undefined,
          owner_name: undefined
        },
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
        },
        detailListData: []
      },
      // 页面设置json
      settings: {
        // loading 状态
        loading: true,
        tableHeight: this.setUIheight(),
        duration: 4000,
        // 按钮是否显示，默认不显示，false：不显示，true：显示
        btnShowStatus: {
          showInsert: false,
          showUpdate: false
        },
        showDefaultOwner: false,
        topBtnShowStatus: {
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
          owner_name: [
            { required: true, message: '请选择货主', trigger: 'change' }
          ],

          warehouse_name: [
            { required: true, message: '请选择仓库', trigger: 'change' }
          ],

          name: [
            { required: true, message: '请输入名称', trigger: 'change' }
          ],
          sku_code: [
            { required: true, message: '选择物料', trigger: 'change' }
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
        this.editStatus === this.PARAMETERS.STATUS_INSERT ||
        this.editStatus === this.PARAMETERS.STATUS_COPY_INSERT
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
      if (this.editStatus === this.PARAMETERS.STATUS_VIEW) {
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
      switch (this.editStatus) {
        case this.PARAMETERS.STATUS_INSERT:
          this.initInsertModel()
          this.settings.showDefaultOwner = true
          break
        case this.PARAMETERS.STATUS_UPDATE:
          this.initUpdateModel()
          break
        case this.PARAMETERS.STATUS_VIEW:
          this.initViewModel()
          break
      }

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
      // 设置按钮
      this.settings.btnShowStatus.showInsert = true
      this.settings.topBtnShowStatus.showInsert = true
      this.settings.topBtnShowStatus.showUpdate = false

      // 初始化watch
      this.setWatch()
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
      // this.dataJson.tempJson = deepCopy(this.data)
      // this.dataJson.tempJsonOriginal = deepCopy(this.data)
      this.dataJson.tempJson.warehouse_id = deepCopy(this.data.warehouse_id)
      this.getData()

      // 设置按钮
      this.settings.btnShowStatus.showUpdate = true
      this.settings.topBtnShowStatus.showInsert = true
      this.settings.topBtnShowStatus.showUpdate = false
    },
    // 查看时的初始化
    initViewModel () {
      // 数据初始化
      // this.dataJson.tempJson = deepCopy(this.data)
      // this.dataJson.detailListData = this.data.detailVo
      this.dataJson.tempJson.warehouse_id = deepCopy(this.data.warehouse_id)
      this.getData()
    },
    // 设置监听器
    setWatch () {
      this.unWatch()
      // 监听页面上面是否有修改，有修改按钮高亮
      this.watch.unwatch_tempJson = this.$watch('dataJson.tempJson', (newVal, oldVal) => {
        this.settings.btnDisabledStatus.disabledInsert = false
        this.settings.btnDisabledStatus.disabledUpdate = false
      }, { deep: true }
      )
    },
    unWatch () {
      if (this.watch.unwatch_tempJson) {
        this.watch.unwatch_tempJson()
      }
    },

    // 返回按钮
    handleCancel () {
      this.$emit('emitReturn')
    },
    // 插入逻辑
    doInsert () {
      // 开始综合验证
      this.$refs['dataSubmitForm'].validate(valid => {
        if (valid) {
          const tempData = deepCopy(this.dataJson.tempJson)
          // tempData.owner_id = this.popSettingsData.searchDialogDataTwo.selectedDataJson.id
          // tempData.owner_code = this.popSettingsData.searchDialogDataTwo.selectedDataJson.code
          tempData.detailList = this.dataJson.detailListData
          if (tempData.detailList === null || tempData.detailList.length === 0) {
            this.showErrorMsg('请添加物料明细')
            return
          }
          let _msg = ''
          if (this.dataJson.tempJson.type === '0') {
            _msg = '该物料转换单，转换类型为立即执行，点击保存后会立即执行该物料转换任务'
          } else {
            _msg = '该物料转换单，转换类型为定时任务，点击保存后不会立即执行该物料转换任务'
          }
          this.$confirm(_msg, '确认信息', {
            distinguishCancelAndClose: true,
            confirmButtonText: '确认',
            cancelButtonText: '取消'
          }).then(() => {
            // 设置到table中绑定的json数据源
            this.settings.loading = true
            insertApi(tempData)
              .then(
                _data => {
                  this.$notify({
                    title: '新增处理成功',
                    message: _data.message,
                    type: 'success',
                    duration: this.settings.duration
                  })

                  this.$emit('emitReturn')
                },
                _error => {
                  this.$notify({
                    title: '新增处理失败',
                    message: _error.message,
                    type: 'error',
                    duration: this.settings.duration
                  })
                }
              )
              .finally(() => {
                this.settings.loading = false
              })
          }).catch(action => {

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
          // tempData.owner_id = this.popSettingsData.searchDialogDataTwo.selectedDataJson.id
          // tempData.owner_code = this.popSettingsData.searchDialogDataTwo.selectedDataJson.code
          tempData.detailList = this.dataJson.detailListData
          if (tempData.detailList === null || tempData.detailList.length === 0) {
            this.showErrorMsg('请添加物料明细')
            return
          }
          let _msg = ''
          if (this.dataJson.tempJson.type === '0') {
            _msg = '该物料转换单，转换类型为立即执行，点击保存后会立即执行该物料转换任务'
          } else {
            _msg = '该物料转换单，转换类型为定时任务，点击保存后不会立即执行该物料转换任务'
          }
          this.$confirm(_msg, '确认信息', {
            distinguishCancelAndClose: true,
            confirmButtonText: '确认',
            cancelButtonText: '取消'
          }).then(() => {
            this.settings.loading = true
            updateApi(tempData)
              .then(
                _data => {
                  this.$notify({
                    title: '新增处理成功',
                    message: _data.message,
                    type: 'success',
                    duration: this.settings.duration
                  })

                  this.$emit('emitReturn')
                },
                _error => {
                  this.$notify({
                    title: '新增处理失败',
                    message: _error.message,
                    type: 'error',
                    duration: this.settings.duration
                  })
                }
              )
              .finally(() => {
                this.settings.loading = false
              })
          }).catch(action => {

          })
        }
      })
    },

    // 原货主
    handleOwnerDialog () {
      this.popSettingsData.searchDialogDataTwo.visible = true
      this.popSettingsData.searchDialogDataTwo.title = '货主选择页面'
    },
    // 货主：关闭对话框：确定
    handleOwnerCloseOk (val) {
      if (val.enable === false) {
        this.showErrorMsg('该货主已禁用，请重新选择')
        return
      }
      this.popSettingsData.searchDialogDataTwo.selectedDataJson = val
      this.dataJson.tempJson.owner_name = val.name
      this.dataJson.tempJson.owner_code = val.code
      this.dataJson.tempJson.owner_id = val.id
      this.popSettingsData.searchDialogDataTwo.visible = false
      this.settings.btnDisabledStatus.disabledUpdate = false
    },
    // 货主：关闭对话框：取消
    handleOwnerCloseCancel () {
      this.popSettingsData.searchDialogDataTwo.visible = false
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
        this.dataJson.detailListData.splice(this.dataJson.currentJson.index, 1)
      }).catch(action => {

      })
    },
    // 商品数据编辑
    handleGoodsEdit () {
      // 编辑
      if (this.dataJson.tempJson.owner_id === '' || this.dataJson.tempJson.owner_id === undefined) {
        this.showErrorMsg('请先选择货主')
        return
      }

      if (this.dataJson.tempJson.warehouse_id === '' || this.dataJson.tempJson.warehouse_id === undefined) {
        this.showErrorMsg('请先选择仓库')
        return
      }
      if (this.dataJson.tempJson.is_sku && (this.dataJson.tempJson.sku_id === '' || this.dataJson.tempJson.sku_id === undefined)) {
        this.showErrorMsg('请先选择物料')
        return
      }
      // 新增
      this.popSettingsData.goodsDialog.data = {}
      this.popSettingsData.goodsDialog.data.warehouse_id = this.dataJson.tempJson.warehouse_id
      this.popSettingsData.goodsDialog.data.owner_id = this.dataJson.tempJson.owner_id
      this.popSettingsData.goodsDialog.data.owner_name = this.dataJson.tempJson.owner_name

      this.popSettingsData.goodsDialog.data.target_sku_id = this.dataJson.tempJson.sku_id
      this.popSettingsData.goodsDialog.data.target_sku_code = this.dataJson.tempJson.sku_code
      this.popSettingsData.goodsDialog.data.target_spec_code = this.dataJson.tempJson.sku_code
      this.popSettingsData.goodsDialog.data.target_goods_name = this.dataJson.tempJson.goods_name
      this.popSettingsData.goodsDialog.data.target_pm = this.dataJson.tempJson.pm
      this.popSettingsData.goodsDialog.data.target_spec = this.dataJson.tempJson.spec

      this.popSettingsData.goodsDialog.dialogStatus = this.PARAMETERS.STATUS_UPDATE
      this.popSettingsData.goodsDialog.visible = true
    },

    // 商品数据选择
    handleGoodsInsert () {
      if (this.dataJson.tempJson.owner_id === '' || this.dataJson.tempJson.owner_id === undefined) {
        this.showErrorMsg('请先选择货主')
        return
      }

      if (this.dataJson.tempJson.warehouse_id === '' || this.dataJson.tempJson.warehouse_id === undefined) {
        this.showErrorMsg('请先选择仓库')
        return
      }
      if (this.dataJson.tempJson.is_sku && (this.dataJson.tempJson.sku_id === '' || this.dataJson.tempJson.sku_id === undefined)) {
        this.showErrorMsg('请先选择物料')
        return
      }
      // 新增
      this.popSettingsData.goodsDialog.data = {}
      this.popSettingsData.goodsDialog.data.warehouse_id = this.dataJson.tempJson.warehouse_id
      this.popSettingsData.goodsDialog.data.owner_id = this.dataJson.tempJson.owner_id
      this.popSettingsData.goodsDialog.data.owner_name = this.dataJson.tempJson.owner_name

      this.popSettingsData.goodsDialog.data.target_sku_id = this.dataJson.tempJson.sku_id
      this.popSettingsData.goodsDialog.data.target_sku_code = this.dataJson.tempJson.sku_code
      this.popSettingsData.goodsDialog.data.target_spec_code = this.dataJson.tempJson.sku_code
      this.popSettingsData.goodsDialog.data.target_goods_name = this.dataJson.tempJson.goods_name
      this.popSettingsData.goodsDialog.data.target_pm = this.dataJson.tempJson.pm
      this.popSettingsData.goodsDialog.data.target_spec = this.dataJson.tempJson.spec

      this.popSettingsData.goodsDialog.dialogStatus = this.PARAMETERS.STATUS_INSERT
      this.popSettingsData.goodsDialog.visible = true
    },

    // 商品：关闭对话框：确定
    handleGoodsCloseOk (val) {
      val.data.id = null

      switch (this.popSettingsData.goodsDialog.dialogStatus) {
        case this.PARAMETERS.STATUS_INSERT:
          this.doInsertModelCallBack(val)
          break
        case this.PARAMETERS.STATUS_UPDATE:
          this.doUpdateModelCallBack(val)
          break
      }
    },
    // 新增回调
    doInsertModelCallBack (val) {
      if (val.return_flag) {
        if (this.dataJson.tempJson.sku_id === val.data.source_sku_id) {
          this.showErrorMsg('转换前物料不能和转换后物料相同！')
          return
        }
        this.popSettingsData.goodsDialog.visible = false
        // 设置到table中绑定的json数据源
        var result = this.dataJson.detailListData.some(item => {
          if (item.source_sku_id === val.data.source_sku_id) {
            return true
          }
          return false
        })

        if (result) {
          this.showErrorMsg('已存在物料，不能添加相同物料！')
          return
        }
        this.dataJson.detailListData.push(val.data)
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
    // 编辑回调
    doUpdateModelCallBack (val) {
      if (val.return_flag) {
        if (this.dataJson.tempJson.sku_id === val.data.source_sku_id) {
          this.showErrorMsg('转换前物料不能和转换后物料相同！')
          return
        }
        this.popSettingsData.goodsDialog.visible = false
        val.data.code = this.dataJson.detailListData[this.popSettingsData.goodsDialog.rowIndex].code
        // 设置到table中绑定的json数据源
        this.dataJson.detailListData.splice(this.popSettingsData.goodsDialog.rowIndex, 1, val.data)
        // 设置到currentjson中
        this.dataJson.currentJson = Object.assign({}, val.data.data)
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
    // 商品：关闭对话框：取消
    handleGoodsCloseCancel () {
      this.popSettingsData.goodsDialog.visible = false
    },
    handleRowClick (row) {
      this.popSettingsData.goodsDialog.rowIndex = this.getRowIndex(row)
    },
    // 获取行索引
    getRowIndex (row) {
      const _index = this.dataJson.detailListData.lastIndexOf(row)
      return _index
    },
    handleCurrentChange (row) {
      this.dataJson.currentJson = Object.assign({}, row) // copy obj
      this.dataJson.currentJson.target_spec_code = this.dataJson.currentJson.target_sku_code
      this.dataJson.currentJson.index = this.getRowIndex(row)

      if (this.dataJson.currentJson !== undefined && this.editStatus !== this.PARAMETERS.STATUS_VIEW) {
        this.settings.topBtnShowStatus.showUpdate = true
      } else {
        this.settings.topBtnShowStatus.showUpdate = false
      }
    },
    getData () {
      // 查询逻辑
      this.settings.loading = true
      get1Api(this.data).then(response => {
        this.dataJson.tempJson = deepCopy(response.data)
        this.dataJson.tempJsonOriginal = deepCopy(response.data)
        this.dataJson.detailListData = this.dataJson.tempJson.detailList

        this.popSettingsData.searchDialogDataOne.selectedDataJson.id = this.dataJson.tempJson.consignor_id
        this.popSettingsData.searchDialogDataTwo.selectedDataJson.id = this.dataJson.tempJson.owner_id
        // 初始化watch
        this.setWatch()
      }).finally(() => {
        this.settings.loading = false
      })
    },

    // 仓库
    handleWarehouseDialog () {
      this.popSettingsData.searchDialogDataFive.visible = true
    },
    // 仓库：关闭对话框：确定
    handleWarehouseCloseOk (val) {
      this.popSettingsData.searchDialogDataFive.selectedDataJson = val
      this.dataJson.tempJson.warehouse_name = val.name
      this.dataJson.tempJson.warehouse_code = val.code
      this.dataJson.tempJson.warehouse_id = val.id

      this.popSettingsData.searchDialogDataFive.selectedDataJson = val
      this.popSettingsData.searchDialogDataFive.visible = false
    },
    // 仓库：关闭对话框：取消
    handleWarehouseCloseCancel () {
      this.popSettingsData.searchDialogDataFive.visible = false
    },
    // 规格数据选择
    handleNewSpecDialog () {
      this.popSettingsData.newSpecDialog.visible = true
    },
    // 规格：关闭对话框：确定
    handleNewSpecCloseOk (val) {
      this.popSettingsData.newSpecDialog.selectedDataJson = val
      this.dataJson.tempJson.spec_code = val.sku_code
      this.dataJson.tempJson.sku_code = val.sku_code
      this.dataJson.tempJson.goods_name = val.name
      this.dataJson.tempJson.sku_id = val.id
      this.dataJson.tempJson.spec = val.spec
      this.dataJson.tempJson.pm = val.pm
      this.popSettingsData.newSpecDialog.visible = false
    },
    // 规格：关闭对话框：取消
    handleNewSpecCloseCancel () {
      this.popSettingsData.newSpecDialog.visible = false
    },
    changeSwitch (val) {
      if (val === false) {
        this.dataJson.tempJson.spec_code = undefined
        this.dataJson.tempJson.sku_code = undefined
        this.dataJson.tempJson.goods_name = undefined
        this.dataJson.tempJson.sku_id = undefined
        this.dataJson.tempJson.spec = undefined
        this.dataJson.tempJson.pm = undefined
      }
    },
    // 选择货主
    getOwnerData () {
      console.log(this.dataJson.tempJson)
      getOwnerComboListApi().then((_data) => {
        this.dataJson.ownerComboList = _data.data
        if (this.settings.showDefaultOwner) {
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
      this.dataJson.tempJson.owner_name = owner.name
    },
    // 选择仓库
    handleWarehouseReturnData (val) {
      this.popSettingsData.searchDialogDataFive.selectedDataJson = val
      this.dataJson.tempJson.warehouse_name = val.warehouse_name
      this.dataJson.tempJson.warehouse_code = val.warehouse_code
      this.dataJson.tempJson.warehouse_id = val.warehouse_id

      this.popSettingsData.searchDialogDataFive.selectedDataJson = val
    }
  }

}
</script>
