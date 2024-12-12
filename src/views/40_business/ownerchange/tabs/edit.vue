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
          title="货权转移基本信息"
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
          <el-descriptions-item label="货权转移单号">
            {{ dataJson.tempJson.code == null || dataJson.tempJson.code == ''?'系统自动生成':dataJson.tempJson.code }}
          </el-descriptions-item>
          <el-descriptions-item>
            <div
              slot="label"
              class="required-mark"
            >
              转移日期
            </div>
            <el-form-item
              prop="change_time"
              label-width="0"
            >
              <el-date-picker
                v-model="dataJson.tempJson.change_time"
                value-format="yyyy-MM-dd"
                :disabled="isViewModel"
                type="date"
                clearable
                :placeholder="isPlaceholderShow('选择日期')"
                style="width: 100%"
              />
            </el-form-item>
          </el-descriptions-item>
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
                :disabled="isViewModel"
                @onInputSearch="handleOrderDialog"
              />
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
              prop="out_warehouse_name"
              label-width="0"
            >
              <!-- <input-search
                v-model.trim="dataJson.tempJson.out_warehouse_name"
                :disabled="isUpdateModel && isViewModel"
                @onInputSearch="handleWarehouseOutDialog"
              /> -->
              <select-warehouse
                v-model.trim="dataJson.tempJson.out_warehouse_name"
                placement="left"
                :warehouse1="dataJson.tempJson.out_warehouse_id"
                :disabled="isUpdateModel && isViewModel"
                @onReturnData="handleWarehouseReturnData"
              />
            </el-form-item>
          </el-descriptions-item>
          <el-descriptions-item />
          <el-descriptions-item />
          <el-descriptions-item>
            <div slot="label">
              备注
            </div>
            <el-form-item
              prop="remark"
              label-width="0"
            >
              <el-input
                v-model.trim="dataJson.tempJson.remark"
                clearable
                show-word-limit
                type="textarea"
                :placeholder="isPlaceholderShow('请输入')"
                :disabled="isViewModel"
              />
            </el-form-item>
          </el-descriptions-item>

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
          <el-descriptions-item label="附件信息">
            <el-row style="display: flex;flex-wrap: wrap;">
              <el-col>
                <Simple-upload-mutil-file
                  v-show="!isViewModel"
                  :accept="'*'"
                  @upload-success="handleUploadFileSuccess"
                  @upload-error="handleUploadFileError"
                />
              </el-col>
              <el-col
                v-for="(item, i) in dataJson.files"
                :key="i"
                :offset="1"
                :span="4"
              >
                <previewCard
                  :show-delete="!isViewModel"
                  :file-name="item.fileName"
                  :url="item.url"
                  :time="item.timestamp"
                  @removeFile="removeFile"
                />
              </el-col>
            </el-row>
          </el-descriptions-item>
        </el-descriptions>

        <br>
        <el-alert
          title="原货主信息"
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
              货主
            </div>
            <el-form-item
              prop="out_owner_name"
              label-width="0"
            >
              <!-- <input-search
                v-model.trim="dataJson.tempJson.out_owner_name"
                :disabled="isUpdateModel && isViewModel"
                @onInputSearch="handleOutOwnerDialog"
              /> -->
              <el-select
                v-model="dataJson.tempJson.out_owner_name"
                :placeholder="isPlaceholderShow('请选择货主')"
                :disabled="isViewModel"
                filterable
                clearable
                @change="selectOutOwner"
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
          <el-descriptions-item />
        </el-descriptions>

        <br>
        <el-alert
          title="新货主信息"
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
              货主
            </div>
            <el-form-item
              prop="in_owner_name"
              label-width="0"
            >
              <!-- <input-search
                v-model.trim="dataJson.tempJson.in_owner_name"
                :disabled="isUpdateModel && isViewModel"
                @onInputSearch="handleInOwnerDialog"
              /> -->
              <el-select
                v-model="dataJson.tempJson.in_owner_name"
                :placeholder="isPlaceholderShow('请选择货主')"
                :disabled="isViewModel"
                filterable
                clearable
                @change="selectInOwner"
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
          <el-descriptions-item />

        </el-descriptions>

        <br>
        <el-alert
          title="物料明细"
          type="info"
          :closable="false"
        />
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
            :disabled="!settings.btnDisabledStatus.disabledGoodsUpdate"
            type="primary"
            icon="el-icon-edit-outline"
            :loading="settings.loading"
            @click="handleGoodsEdit"
          >编辑</el-button>

          <el-button
            v-show="!isViewModel"
            :disabled="!settings.btnDisabledStatus.disabledGoodsUpdate"
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
            prop="spec_code"
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
            prop="spec"
            label="规格"
          />
          <el-table-column
            show-overflow-tooltip
            min-width="130"
            prop="pm"
            label="品名"
          />
          <el-table-column
            show-overflow-tooltip
            min-width="150"
            prop="qty"
            label="转移数量"
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
      <!--      <el-button-->
      <!--        v-show="settings.btnShowStatus.showUpdate"-->
      <!--        type="primary"-->
      <!--        :disabled="settings.loading || settings.btnDisabledStatus.disabledUpdate"-->
      <!--        size="medium"-->
      <!--        @click="doUpdate()"-->
      <!--      >保存2</el-button>-->
      <el-button
        :disabled="settings.loading"
        size="medium"
        @click="handleCancel()"
      >返回</el-button>
    </div>

    <owner-in-dialog
      v-if="popSettingsData.searchDialogDataOne.visible"
      :title="popSettingsData.searchDialogDataOne.title"
      :visible="popSettingsData.searchDialogDataOne.visible"
      @closeMeOk="handleInOwnerCloseOk"
      @closeMeCancel="handleInOwnerCloseCancel"
    />
    <owner-out-dialog
      v-if="popSettingsData.searchDialogDataTwo.visible"
      :title="popSettingsData.searchDialogDataTwo.title"
      :visible="popSettingsData.searchDialogDataTwo.visible"
      @closeMeOk="handleOutOwnerCloseOk"
      @closeMeCancel="handleOutOwnerCloseCancel"
    />

    <order-dialog
      v-if="popSettingsData.searchDialogDataThree.visible"
      :title="popSettingsData.searchDialogDataThree.title"
      :visible="popSettingsData.searchDialogDataThree.visible"
      @closeMeOk="handleOrderCloseOk"
      @closeMeCancel="handleOrderCloseCancel"
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
.link {
  color: #2a6496;
}
br {
  display: block;
  margin: 10px;
  content: ' ';
}
.el-button-group {
  display: inline-block;
  vertical-align: middle;
  padding-top: 4px;
  padding-bottom: 4px;
}
</style>

<script>
import constants_para from '@/common/constants/constants_para'
import elDragDialog from '@/directive/el-drag-dialog'
import deepCopy from 'deep-copy'
import { insertApi, updateApi, getApi } from '@/api/40_business/ownerchange/ownerchange'
import InputSearch from '@/components/40_input/inputSearch'
import ownerInDialog from '@/views/30_wms/owner/dialog/dialog'
import ownerOutDialog from '@/views/30_wms/owner/dialog/dialog'
import orderDialog from '@/views/40_business/ownerchangeorder/dialog/dialog'
import goodsDialog from '@/views/40_business/ownerchange/tabs/dialog/goodsEdit'
import mixin from './mixin/editResizeHandlerMixin'
import SimpleUploadMutilFile from '@/components/10_file/SimpleUploadMutilFile'
import previewCard from '@/components/50_preview_card/preview_card'
import { getOwnerComboListApi } from '@/api/30_wms/owner/owner'
import SelectWarehouse from '@/views/30_wms/warehouse/selectgrid/selectWarehouseLocationBin'

export default {
  components: { previewCard, SimpleUploadMutilFile, InputSearch, ownerOutDialog, ownerInDialog, orderDialog, goodsDialog, SelectWarehouse },
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
        // 附件信息
        files: [],
        file_file: [],

        // 单条数据 json的，初始化原始数据
        tempJsonOriginal: {
          change_time: new Date(),
          out_owner_name: '',
          out_warehouse_name: '',
          in_owner_name: '',
          in_warehouse_name: ''
        },
        // 单条数据 json
        tempJson: {
          change_time: new Date(),
          out_owner_name: '',
          out_warehouse_name: '',
          in_owner_name: '',
          in_warehouse_name: ''
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
          showUpdate: false,
          // 物料明细是否可用
          showDetailUpdate: false
        },
        topBtnShowStatus: {
          showInsert: false,
          showUpdate: false
        },
        // 按钮状态：是否可用，false:可用，true不可用
        btnDisabledStatus: {
          disabledInsert: true,
          disabledUpdate: true,
          disabledGoodsUpdate: false
        },
        // 以下为pop的内容：数据弹出框
        selection: [],
        dialogStatus: this.dialogStatus,
        // pop的check内容
        rulesOne: {
          out_owner_name: [
            { required: true, message: '请选择原货主', trigger: 'change' }
          ],
          in_owner_name: [
            { required: true, message: '请选择新货主', trigger: 'change' }
          ],
          out_warehouse_name: [
            { required: true, message: '请选择原仓库', trigger: 'change' }
          ],
          in_warehouse_name: [
            { required: true, message: '请选择新仓库', trigger: 'change' }
          ],
          change_time: [
            { required: true, message: '请输入转移日期', trigger: 'change' }
          ]
        },
        rules: {

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
    // 选择货主
    this.getOutOwnerData()
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
      this.settings.rules = this.settings.rulesOne
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
      this.dataJson.tempJson.out_warehouse_id = deepCopy(this.data.out_warehouse_id)
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
      const operate_tab_data = {
        editStatus: ''
      }
      this.$emit('emitReturn', operate_tab_data)
      // this.$emit('emitReturn')
    },
    // 插入逻辑
    doInsert () {
      // 开始综合验证
      this.$refs['dataSubmitForm'].validate(valid => {
        if (valid) {
          const tempData = deepCopy(this.dataJson.tempJson)
          tempData.consignor_id = this.popSettingsData.searchDialogDataOne.selectedDataJson.id
          tempData.owner_id = this.popSettingsData.searchDialogDataTwo.selectedDataJson.id
          tempData.order_id = this.popSettingsData.searchDialogDataThree.selectedDataJson.id
          tempData.consignor_code = this.popSettingsData.searchDialogDataOne.selectedDataJson.code
          tempData.owner_code = this.popSettingsData.searchDialogDataTwo.selectedDataJson.code
          tempData.order_code = this.popSettingsData.searchDialogDataThree.selectedDataJson.code
          tempData.detailList = this.dataJson.detailListData
          if (tempData.detailList === null || tempData.detailList.length === 0) {
            this.showErrorMsg('请添加物料明细')
            return
          }
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

                const operate_tab_data = {
                  data: _data.data,
                  editStatus: this.PARAMETERS.STATUS_INSERT
                }

                this.$emit('emitReturn', operate_tab_data)
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
        }
      })
    },
    // 更新逻辑
    doUpdate () {
      // 开始综合验证
      this.$refs['dataSubmitForm'].validate(valid => {
        if (valid) {
          const tempData = deepCopy(this.dataJson.tempJson)
          tempData.consignor_id = this.popSettingsData.searchDialogDataOne.selectedDataJson.id
          tempData.owner_id = this.popSettingsData.searchDialogDataTwo.selectedDataJson.id
          tempData.order_id = this.popSettingsData.searchDialogDataThree.selectedDataJson.id
          tempData.consignor_code = this.popSettingsData.searchDialogDataOne.selectedDataJson.code
          tempData.owner_code = this.popSettingsData.searchDialogDataTwo.selectedDataJson.code
          tempData.order_code = this.popSettingsData.searchDialogDataThree.selectedDataJson.code
          tempData.detailList = this.dataJson.detailListData
          if (tempData.detailList === null || tempData.detailList.length === 0) {
            this.showErrorMsg('请添加物料明细')
            return
          }
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
        }
      })
    },
    handleTabsClick (tab, event) { },
    // 新货主
    handleInOwnerDialog () {
      this.popSettingsData.searchDialogDataOne.visible = true
      this.popSettingsData.searchDialogDataOne.title = '货主选择页面'
    },
    // 新货主：关闭对话框：确定
    handleInOwnerCloseOk (val) {
      if (val.enable === false) {
        this.showErrorMsg('该货主已禁用，请重新选择')
        return
      }

      if (this.dataJson.tempJson.out_warehouse_id != null && this.dataJson.tempJson.in_warehouse_id != null && this.dataJson.tempJson.out_warehouse_id === this.dataJson.tempJson.in_warehouse_id && this.dataJson.tempJson.out_owner_id === val.id) {
        this.showErrorMsg('原货主与新货主不能相同')
        return
      }

      this.popSettingsData.searchDialogDataOne.selectedDataJson = val
      this.dataJson.tempJson.in_owner_name = val.name
      this.dataJson.tempJson.in_owner_code = val.code
      this.dataJson.tempJson.in_owner_id = val.id
      this.popSettingsData.searchDialogDataOne.visible = false
      this.settings.btnDisabledStatus.disabledUpdate = false
    },
    // 新货主：关闭对话框：取消
    handleInOwnerCloseCancel () {
      this.popSettingsData.searchDialogDataOne.visible = false
    },
    // 原货主
    handleOutOwnerDialog () {
      this.popSettingsData.searchDialogDataTwo.visible = true
      this.popSettingsData.searchDialogDataTwo.title = '货主选择页面'
    },
    // 原货主：关闭对话框：确定
    handleOutOwnerCloseOk (val) {
      if (this.dataJson.tempJson.out_warehouse_id != null && this.dataJson.tempJson.in_warehouse_id != null && this.dataJson.tempJson.out_warehouse_id === this.dataJson.tempJson.in_warehouse_id && this.dataJson.tempJson.in_owner_id === val.id) {
        this.showErrorMsg('原货主与新货主不能相同')
        return
      }

      if (val.enable === false) {
        this.showErrorMsg('该货主已禁用，请重新选择')
        return
      }
      this.popSettingsData.searchDialogDataTwo.selectedDataJson = val
      this.dataJson.tempJson.out_owner_name = val.name
      this.dataJson.tempJson.out_owner_code = val.code
      this.dataJson.tempJson.out_owner_id = val.id
      this.popSettingsData.searchDialogDataTwo.visible = false
      this.settings.btnDisabledStatus.disabledUpdate = false

      this.dataJson.detailListData = []
    },
    // 原货主：关闭对话框：取消
    handleOutOwnerCloseCancel () {
      this.popSettingsData.searchDialogDataTwo.visible = false
    },
    // 订单
    handleOrderDialog () {
      this.popSettingsData.searchDialogDataThree.title = '订单选择页面'
      this.popSettingsData.searchDialogDataThree.visible = true
    },
    // 订单：关闭对话框：确定
    handleOrderCloseOk (val) {
      this.popSettingsData.searchDialogDataThree.selectedDataJson = val
      this.dataJson.tempJson.contract_no = val.contract_no
      this.dataJson.tempJson.bill_type = val.bill_type
      this.dataJson.tempJson.bill_type_name = val.bill_type_name
      this.dataJson.tempJson.contract_dt = val.contract_dt
      this.dataJson.tempJson.contract_num = val.contract_num
      this.dataJson.tempJson.supplier_name = val.supplier_name
      this.dataJson.tempJson.ship_name = val.ship_name
      this.dataJson.tempJson.order_id = val.id
      this.popSettingsData.searchDialogDataThree.visible = false
      this.settings.btnDisabledStatus.disabledUpdate = false
    },
    // 订单：关闭对话框：取消
    handleOrderCloseCancel () {
      this.popSettingsData.searchDialogDataThree.visible = false
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
        this.dataJson.detailListData.splice(this.dataJson.rowIndex, 1)
        this.settings.btnDisabledStatus.disabledGoodsUpdate = false
      }).catch(action => {

      })
    },
    // 商品数据编辑
    handleGoodsEdit () {
      if (this.dataJson.rowIndex === null) {
        this.showErrorMsg('请选择一条数据')
        return
      }

      // 编辑
      this.popSettingsData.goodsDialog.data = Object.assign({}, this.dataJson.currentJson)
      this.popSettingsData.goodsDialog.data.warehouse_id = this.dataJson.tempJson.out_warehouse_id
      this.popSettingsData.goodsDialog.data.owner_id = this.dataJson.tempJson.out_owner_id
      this.popSettingsData.goodsDialog.data.owner_name = this.dataJson.tempJson.out_owner_name
      this.popSettingsData.goodsDialog.dialogStatus = this.PARAMETERS.STATUS_UPDATE
      this.popSettingsData.goodsDialog.visible = true
    },

    // 商品数据选择
    handleGoodsInsert () {
      if (this.dataJson.tempJson.out_owner_id === '' || this.dataJson.tempJson.out_owner_id === undefined) {
        this.showErrorMsg('请先选择原货主')
        return
      }

      if (this.dataJson.tempJson.out_warehouse_id === '' || this.dataJson.tempJson.out_warehouse_id === undefined) {
        this.showErrorMsg('请先选择原仓库')
        return
      }
      // 新增
      this.popSettingsData.goodsDialog.data = {}
      this.popSettingsData.goodsDialog.data.warehouse_id = this.dataJson.tempJson.out_warehouse_id
      this.popSettingsData.goodsDialog.data.owner_id = this.dataJson.tempJson.out_owner_id
      this.popSettingsData.goodsDialog.data.owner_name = this.dataJson.tempJson.out_owner_name
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
        this.popSettingsData.goodsDialog.visible = false
        // 设置到table中绑定的json数据源
        var result = this.dataJson.detailListData.some(item => {
          if (item.stock_id === val.data.stock_id) {
            return true
          }
          return false
        })

        if (result) {
          this.showErrorMsg('已存在物料，不能添加相同物料！')
          return
        }

        val.data.sku_name = val.data.goods_name
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
      this.dataJson.currentJson.index = this.getRowIndex(row)

      if (this.dataJson.currentJson !== undefined && this.dataJson.currentJson.index !== -1 && this.editStatus !== this.PARAMETERS.STATUS_VIEW) {
        this.settings.btnDisabledStatus.disabledGoodsUpdate = true
      } else {
        this.settings.btnDisabledStatus.disabledGoodsUpdate = false
      }
    },
    getData () {
      // 查询逻辑
      this.settings.loading = true
      getApi(this.data).then(response => {
        this.dataJson.tempJson = deepCopy(response.data)
        this.dataJson.tempJsonOriginal = deepCopy(response.data)
        this.dataJson.detailListData = this.dataJson.tempJson.detailList

        this.popSettingsData.searchDialogDataOne.selectedDataJson.id = this.dataJson.tempJson.consignor_id
        this.popSettingsData.searchDialogDataTwo.selectedDataJson.id = this.dataJson.tempJson.owner_id
        this.popSettingsData.searchDialogDataThree.selectedDataJson.id = this.dataJson.tempJson.order_id

        this.dataJson.files = this.dataJson.tempJson.file_files
        // 初始化watch
        this.setWatch()
      }).finally(() => {
        this.settings.loading = false
      })
    },
    // 新仓库
    handleWarehouseInDialog () {
      this.popSettingsData.searchDialogDataFour.visible = true
    },
    // 新仓库：关闭对话框：确定
    handleWarehouseInCloseOk (val) {
      if (this.dataJson.tempJson.out_owner_id != null && this.dataJson.tempJson.in_owner_id != null && this.dataJson.tempJson.out_owner_id === this.dataJson.tempJson.in_owner_id && this.dataJson.tempJson.out_warehouse_id === val.id) {
        this.showErrorMsg('新仓库与原仓库不能相同')
        return
      }

      this.popSettingsData.searchDialogDataFour.selectedDataJson = val
      this.dataJson.tempJson.in_warehouse_name = val.name
      this.dataJson.tempJson.in_warehouse_code = val.code
      this.dataJson.tempJson.in_warehouse_id = val.id

      this.popSettingsData.searchDialogDataFour.selectedDataJson = val
      this.popSettingsData.searchDialogDataFour.visible = false
    },
    // 原仓库：关闭对话框：取消
    handleWarehouseOutCloseCancel () {
      this.popSettingsData.searchDialogDataFive.visible = false
    },

    // 附件上传成功
    handleUploadFileSuccess (res) {
      res.response.data.timestamp = res.response.timestamp
      this.dataJson.files.push(res.response.data)
      this.dataJson.file_file.push(res.response.data.url)
      this.dataJson.tempJson.file_files = this.dataJson.files
    },
    // 附件上传失败
    handleUploadFileError () {
      console.debug('文件上传失败')
      this.$notify({
        title: '上传错误',
        message: '文件上传发生错误！',
        type: 'error',
        duration: 0
      })
    },
    // 删除附件文件
    removeFile (val) {
      // 获取下标
      const _index = this.dataJson.file_file.lastIndexOf(val)
      // 从数组中移除
      this.dataJson.files.splice(_index, 1)
      this.dataJson.file_file.splice(_index, 1)
      this.dataJson.file_files.splice(_index, 1)
    },
    // 选择原货主
    getOutOwnerData () {
      getOwnerComboListApi().then((_data) => {
        this.dataJson.ownerComboList = _data.data
        // 默认选中第一条
        this.dataJson.tempJson.out_owner_name = _data.data[0].short_name
        this.dataJson.tempJson.out_owner_id = _data.data[0].id
        this.dataJson.tempJson.in_owner_name = _data.data[0].short_name
        this.dataJson.tempJson.in_owner_id = _data.data[0].id
        this.dataJson.tempJson.out_owner_code = _data.data[0].code
        this.dataJson.tempJson.in_owner_code = _data.data[0].code
      }, (_error) => {
      })
    },
    // 选择原货主
    selectOutOwner (val) {
      this.dataJson.tempJson.out_owner_id = val
      var owner = this.dataJson.ownerComboList.find((item) => {
        return item.id === val
      })
      this.dataJson.tempJson.out_owner_code = owner.code
      this.dataJson.tempJson.out_owner_name = owner.short_name
    },
    // 选择原货主
    selectInOwner (val) {
      this.dataJson.tempJson.in_owner_id = val
      var owner = this.dataJson.ownerComboList.find((item) => {
        return item.id === val
      })
      this.dataJson.tempJson.in_owner_code = owner.code
    },
    // 选择仓库
    handleWarehouseReturnData (val) {
      if (this.dataJson.tempJson.out_owner_id != null && this.dataJson.tempJson.in_owner_id != null && this.dataJson.tempJson.out_owner_id === this.dataJson.tempJson.in_owner_id && this.dataJson.tempJson.in_warehouse_id === val.id) {
        this.showErrorMsg('原仓库与新仓库不能相同')
        return
      }

      this.popSettingsData.searchDialogDataFive.selectedDataJson = val
      this.dataJson.tempJson.out_warehouse_name = val.warehouse_name
      this.dataJson.tempJson.out_warehouse_code = val.warehouse_code
      this.dataJson.tempJson.out_warehouse_id = val.warehouse_id

      this.dataJson.tempJson.in_warehouse_name = val.warehouse_name
      this.dataJson.tempJson.in_warehouse_code = val.warehouse_code
      this.dataJson.tempJson.in_warehouse_id = val.warehouse_id

      this.popSettingsData.searchDialogDataFive.selectedDataJson = val
      this.popSettingsData.searchDialogDataFive.visible = false

      this.dataJson.detailListData = []
    }
  }

}
</script>
