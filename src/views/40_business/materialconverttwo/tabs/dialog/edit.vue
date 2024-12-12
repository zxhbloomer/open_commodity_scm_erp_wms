<template>
  <div>
    <!-- pop窗口 数据编辑:新增、修改 -->
    <el-dialog
      v-if="listenVisible"
      v-el-drag-dialog
      v-loading="settings.loading"
      element-loading-text="拼命加载中，请稍后..."
      element-loading-background="rgba(255, 255, 255, 0.7)"
      :title="PARAMETERS.STATUS_TEXT_MAP[dialogStatus]"
      :visible="visible"
      :close-on-click-modal="PARAMETERS.DIALOG_CLOSE_BY_CLICK"
      :close-on-press-escape="PARAMETERS.DIALOG_CLOSE_BY_ESC"
      :show-close="PARAMETERS.DIALOG_SHOW_CLOSE"
      :append-to-body="true"
      :modal-append-to-body="true"
      width="1200px"
      destroy-on-close
    >
      <el-form
        ref="dataSubmitForm"
        :rules="settings.rules"
        :model="dataJson.tempJson"
        label-position="right"
        label-width="10px"
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

          <!-- <el-descriptions-item>
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
          </el-descriptions-item> -->
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
                disabled
                :para="CONSTANTS.DICT_B_MATERIAL_CONVERT_TYPE"
                init-placeholder="转换类型"
              />
            </el-form-item>
          </el-descriptions-item>
          <el-descriptions-item>
            <div
              slot="label"
              class="required-mark"
            >
              转换关系
            </div>
            <el-form-item prop="calc">
              <numeric
                v-model="dataJson.tempJson.calc"
                :decimal-places="2"
                :currency-symbol="''"
                :minimum-value="0"
                prefix="1(原商品))="
                suffix="(新商品)"
                width-css="45%"
                disabled
              />
            </el-form-item>
          </el-descriptions-item>
          <el-descriptions-item />
          <el-descriptions-item />
        </el-descriptions>
        <br>
        <el-alert
          title="转换前物料信息"
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

          <el-descriptions-item>
            <div
              slot="label"
              class="required-mark"
            >
              物料编码
            </div>
            <el-form-item prop="source_sku_code">

              <input-search
                v-model.trim="dataJson.tempJson.source_sku_code"
                :data="data"
                :disabled="isUpdateModel && isViewModel"
                @onInputSearch="handleOldSpecDialog"
              />
            </el-form-item>
          </el-descriptions-item>

          <el-descriptions-item label="物料名称">
            <el-form-item prop="source_goods_name">
              <el-input
                v-model.trim="dataJson.tempJson.source_goods_name"
                clearable
                disabled
                show-word-limit
              />
            </el-form-item>
          </el-descriptions-item>
          <!-- <el-descriptions-item label="品名">
            <el-form-item prop="source_pm">
              <el-input
                v-model.trim="dataJson.tempJson.source_pm"
                clearable
                show-word-limit
                disabled
              />
            </el-form-item>
          </el-descriptions-item> -->
          <el-descriptions-item label="规格">
            <el-form-item prop="source_spec">
              <el-input
                v-model.trim="dataJson.tempJson.source_spec"
                clearable
                show-word-limit
                disabled
              />
            </el-form-item>
          </el-descriptions-item>
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
                :disabled="isViewModel"
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
          <!-- <el-descriptions-item label="品名">
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
          </el-descriptions-item> -->
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
        </el-descriptions>
        <br>
      </el-form>
      <div
        slot="footer"
        class="dialog-footer"
      >
        <el-divider />
        <el-button
          plain
          :disabled="settings.loading"
          @click="handleCancel()"
        >取消</el-button>
        <el-button
          v-show="settings.btnShowStatus.showInsert"
          plain
          type="primary"
          :disabled="settings.loading || settings.btnDisabledStatus.disabledInsert "
          @click="doInsert()"
        >确定</el-button>
        <el-button
          v-show="settings.btnShowStatus.showUpdate && !isViewModel"
          plain
          type="primary"
          :disabled="settings.loading || settings.btnDisabledStatus.disabledUpdate "
          @click="doUpdate()"
        >确定</el-button>
      </div>
    </el-dialog>

    <old-spec-dialog
      v-if="popSettingsData.oldSpecDialog.visible"
      :visible="popSettingsData.oldSpecDialog.visible"
      :type="1"
      :data="popSettingsData.oldSpecDialog.data"
      @closeMeOk="handleOldSpecCloseOk"
      @closeMeCancel="handleOldSpecCloseCancel"
    />
    <new-spec-dialog
      v-if="popSettingsData.newSpecDialog.visible"
      :visible="popSettingsData.newSpecDialog.visible"
      :data="popSettingsData.newSpecDialog.data"
      :type="0"
      @closeMeOk="handleNewSpecCloseOk"
      @closeMeCancel="handleNewSpecCloseCancel"
    />

  </div>

</template>

<style scoped>
.el-form-item--mini.el-form-item {
  margin-bottom: 0px;
}
.el-form-item .el-select {
  width: 100%;
}
br {
  display: block;
  margin: 10px;
  content: ' ';
}
.required-mark::before {
  content: '*';
  color: #ff4949;
  margin-right: 4px;
}
</style>
<style >
.el-input-group__append_select,
.el-input-group__append {
  color: #ffffff;
  background-color: #1890ff;
  border-color: #1890ff;
}
</style>

<script>
import constants_para from '@/common/constants/constants_para'
import elDragDialog from '@/directive/el-drag-dialog'
import deepCopy from 'deep-copy'
import { getOwnerComboListApi } from '@/api/30_wms/owner/owner'
import { insertApi, updateApi } from '@/api/40_business/materialconvert/materialconvertnew'
import newSpecDialog from '@/views/40_business/materialconverttwo/tabs/dialog/goodsdialog'
import InputSearch from '@/components/40_input/inputSearch'
import oldSpecDialog from '@/views/40_business/materialconverttwo/tabs/dialog/goodsdialog'
import numeric from '@/components/40_input/numeric'
import { isNotEmpty } from '@/utils'
import SelectDict from '@/components/00_dict/select/SelectDict'

export default {
  components: { newSpecDialog, InputSearch, oldSpecDialog, numeric, SelectDict },
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
    dialogStatus: {
      type: String,
      default: constants_para.STATUS_VIEW
    }
  },
  data () {
    return {
      // 监听器
      watch: {
        unwatch_tempJson: null
      },
      contentStyle: {
        width: '15%'
      },
      labelStyle: {
        width: '7%',
        'text-align': 'right'
      },
      popSettingsData: {
        // 弹出窗口状态名称
        dialogStatus: '',
        textMap: {
          update: '请选择要修改结点的类型',
          insert: '请选择添加下级结点类型'
        },
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
        newSpecDialog: {
          // 弹出框显示参数
          visible: false,
          data: null,
          // 点击确定以后返回的值
          selectedDataJson: {
            id: null
          }
        },
        // 规格弹出框
        oldSpecDialog: {
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

        searchForm: {
          pageCondition: {}
        },
        // 单条数据 json的，初始化原始数据
        tempJsonOriginal: {
          id: undefined,
          name: '',
          config_key: '',
          value: '',
          descr: '',
          owner_name: undefined,
          calc: 1,
          type: '1',
          detailList: [],
          warehouse_id: null,
          sku_id: null,
          source_sku_id: null,
          owner_id: null
        },
        // 单条数据 json
        tempJson: {
          owner_name: undefined,
          calc: 1, // 默认装换关系为 1
          type: '1', // 默认转换任务为 定时任务,
          detailList: [],
          warehouse_id: null,
          sku_id: null,
          source_sku_id: null,
          owner_id: null
        },
        inputSettings: {
          maxLength: {
            name: 20,
            code: 20
          }
        },
        // 货主集合
        ownerComboList: []
      },
      // 页面设置json
      settings: {
        // loading 状态
        loading: true,
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
          sku_code: [
            { validator: this.sku_code_validator, trigger: 'blur' }
          ],
          source_sku_code: [
            { validator: this.source_sku_code, trigger: 'blur' }

          ],
          owner_name: [
            { required: true, message: '请选择货主', trigger: 'change' }
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
    },
    bindModel () {
      const { source_sku_id, owner_id, sku_id } = this.dataJson.tempJson
      return {
        source_sku_id,
        owner_id,
        sku_id
      }
    }
  },
  // 监听器
  watch: {},
  created () {
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
      switch (this.dialogStatus) {
        case this.PARAMETERS.STATUS_INSERT:
          this.initInsertModel()
          break
        case this.PARAMETERS.STATUS_UPDATE:
          this.initUpdateModel()
          this.getData()
          break
        case this.PARAMETERS.STATUS_VIEW:
          this.initViewModel()
          this.getData()
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
    // 新增时的初始化
    initInsertModel () {
      // 数据初始化
      this.initTempJsonOriginal()
      this.dataJson.tempJson = deepCopy(this.dataJson.tempJsonOriginal)

      // 设置按钮
      this.settings.btnShowStatus.showInsert = true
      // 控件focus
      // this.$nextTick(() => {
      //   this.$refs['refFocusOne'].focus()
      // })
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
      this.popSettingsData.searchDialogDataOne.selectedDataJson.id = this.data.supplier_id
      // 设置按钮
      this.settings.btnShowStatus.showUpdate = true
      // 控件focus
      // this.$nextTick(() => {
      //   this.$refs['refFocusOne'].focus()
      // })
    },
    // 查看时的初始化
    initViewModel () {
      // 数据初始化
      this.dataJson.tempJson = deepCopy(this.data)
    },
    // 设置监听器
    setWatch () {
      this.unWatch()
      // 监听页面上面是否有修改，有修改按钮高亮
      this.watch.unwatch_tempJson = this.$watch(
        'bindModel',
        (newVal, oldVal) => {
          if (newVal.sku_id !== null && newVal.source_sku_id !== null && newVal.owner_id !== null) {
            this.settings.btnDisabledStatus.disabledInsert = false
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
    },
    // 取消按钮
    handleCancel () {
      this.$emit('closeMeCancel')
    },
    // 插入逻辑
    doInsert () {
      this.$refs['dataSubmitForm'].validate(valid => {
        if (valid) {
          const tempData = deepCopy(this.dataJson.tempJson)
          this.settings.loading = true
          insertApi(tempData)
            .then(
              _data => {
                this.$emit('closeMeOk', { return_flag: true, data: _data })
              },
              _error => {
                this.$emit('closeMeOk', { return_flag: false, error: _error })
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
      this.$refs['dataSubmitForm'].validate(valid => {
        if (valid) {
          const tempData = deepCopy(this.dataJson.tempJson)
          tempData.source
          if (this.popSettingsData.searchDialogDataOne.selectedDataJson != null) {
            // tempData.supplier_id = this.popSettingsData.searchDialogDataOne.selectedDataJson.id
            // tempData.supplier_code = this.popSettingsData.searchDialogDataOne.selectedDataJson.code
          }
          this.settings.loading = true
          updateApi(tempData)
            .then(
              _data => {
                this.dataJson.tempJson = deepCopy(_data.data)
                this.$emit('closeMeOk', { return_flag: true, data: _data })
              },
              _error => {
                this.$emit('closeMeOk', { return_flag: false, error: _error })
              }
            )
            .finally(() => {
              this.settings.loading = false
            })
        }
      })
    },

    selectOwner (val) {
      if (val !== '') {
        this.dataJson.tempJson.owner_id = val
        var owner = this.dataJson.ownerComboList.find((item) => {
          return item.id === val
        })
        this.dataJson.tempJson.owner_code = owner.code
        this.dataJson.tempJson.owner_name = owner.name
      } else {
        // 如果清空
        this.dataJson.tempJson.owner_id = null
        this.dataJson.tempJson.owner_code = null
        this.dataJson.tempJson.owner_name = null
      }
      // 触发后, 清空
      this.dataJson.tempJson.source_spec_code = null
      this.dataJson.tempJson.source_sku_code = null
      this.dataJson.tempJson.source_goods_name = null
      this.dataJson.tempJson.source_sku_id = null
      this.dataJson.tempJson.source_spec = null
      this.dataJson.tempJson.source_pm = null
      this.dataJson.tempJson.detailList.splice(0, 1, {})

      this.dataJson.tempJson.spec_code = null
      this.dataJson.tempJson.sku_code = null
      this.dataJson.tempJson.goods_name = null
      this.dataJson.tempJson.sku_id = null
      this.dataJson.tempJson.spec = null
      this.dataJson.tempJson.pm = null
      this.dataJson.tempJson.target_spec_code = null
      this.dataJson.tempJson.target_sku_code = null
      this.dataJson.tempJson.target_goods_name = null
      this.dataJson.tempJson.target_sku_id = null
      this.dataJson.tempJson.target_spec = null
      this.dataJson.tempJson.target_pm = null
    },

    // 选择货主
    getOwnerData () {
      getOwnerComboListApi().then((_data) => {
        this.dataJson.ownerComboList = _data.data
        // 默认选中第一条
        if (this.dataJson.tempJson.owner_id === null || this.dataJson.tempJson.owner_id === undefined) {
          this.dataJson.tempJson.owner_name = _data.data[0].short_name
          this.dataJson.tempJson.owner_id = _data.data[0].id
          this.dataJson.tempJson.owner_code = _data.data[0].code
        }
      }, (_error) => {
      })
    },
    // 选择仓库
    // handleWarehouseReturnData (val) {
    //   this.dataJson.tempJson.warehouse_name = val.warehouse_name
    //   this.dataJson.tempJson.warehouse_code = val.warehouse_code
    //   this.dataJson.tempJson.warehouse_id = val.warehouse_id
    // },
    // 规格数据选择
    handleOldSpecDialog () {
      if (this.dataJson.tempJson.owner_id === '' || this.dataJson.tempJson.owner_id === undefined || this.dataJson.tempJson.owner_id === null) {
        this.showErrorMsg('请先选择货主')
        return
      }
      const data = {}
      data.owner_id = this.dataJson.tempJson.owner_id
      this.popSettingsData.oldSpecDialog.data = data
      this.popSettingsData.oldSpecDialog.visible = true
    },
    // 规格：关闭对话框：确定
    handleOldSpecCloseOk (val) {
      this.popSettingsData.oldSpecDialog.selectedDataJson = val
      this.dataJson.tempJson.source_spec_code = val.sku_code
      this.dataJson.tempJson.source_sku_code = val.sku_code
      this.dataJson.tempJson.source_goods_name = val.name
      this.dataJson.tempJson.source_sku_id = val.id
      this.dataJson.tempJson.source_spec = val.spec
      this.dataJson.tempJson.source_pm = val.pm
      if (this.dataJson.tempJson.sku_id === this.dataJson.tempJson.source_sku_id) {
        this.showErrorMsg('转换前物料不能和转换后物料相同！')
        return
      }
      const detailList = {}
      detailList.source_spec_code = val.sku_code
      detailList.source_sku_code = val.sku_code
      detailList.source_goods_name = val.name
      detailList.source_sku_id = val.id
      detailList.source_spec = val.spec
      detailList.source_pm = val.pm
      detailList.calc = this.dataJson.tempJson.calc
      this.dataJson.tempJson.detailList = []
      this.dataJson.tempJson.detailList.splice(0, 1, detailList)
      this.popSettingsData.oldSpecDialog.visible = false
    },
    // 规格：关闭对话框：取消
    handleOldSpecCloseCancel () {
      this.popSettingsData.oldSpecDialog.visible = false
    },
    // 规格数据选择
    handleNewSpecDialog () {
      if (this.dataJson.tempJson.owner_id === '' || this.dataJson.tempJson.owner_id === undefined || this.dataJson.tempJson.owner_id === null) {
        this.showErrorMsg('请先选择货主')
        return
      }
      const ownerData = { owner_id: this.dataJson.tempJson.owner_id }
      this.popSettingsData.newSpecDialog.data = ownerData
      this.popSettingsData.newSpecDialog.visible = true
    },
    // 规格：关闭对话框：确定
    handleNewSpecCloseOk (val) {
      if (val.id === this.dataJson.tempJson.source_sku_id) {
        this.showErrorMsg('转换前物料不能和转换后物料相同！')
        return
      }
      this.popSettingsData.newSpecDialog.selectedDataJson = val
      this.dataJson.tempJson.spec_code = val.sku_code
      this.dataJson.tempJson.sku_code = val.sku_code
      this.dataJson.tempJson.goods_name = val.name
      this.dataJson.tempJson.sku_id = val.id
      this.dataJson.tempJson.spec = val.spec
      this.dataJson.tempJson.pm = val.pm

      this.dataJson.tempJson.target_spec_code = val.sku_code
      this.dataJson.tempJson.target_sku_code = val.sku_code
      this.dataJson.tempJson.target_goods_name = val.name
      this.dataJson.tempJson.target_sku_id = val.id
      this.dataJson.tempJson.target_spec = val.spec
      this.dataJson.tempJson.target_pm = val.pm

      this.popSettingsData.newSpecDialog.visible = false

      this.settings.btnDisabledStatus.disabledInsert = false
      this.settings.btnDisabledStatus.disabledUpdate = false
    },
    // 规格：关闭对话框：取消
    handleNewSpecCloseCancel () {
      this.popSettingsData.newSpecDialog.visible = false
    },
    getData () {
      // 查询逻辑
      const data = this.data
      // this.dataJson.tempJson = deepCopy(data)
      // this.dataJson.tempJsonOriginal = deepCopy(data)
      this.dataJson.tempJson.source_sku_code = data.source_sku_code
      this.dataJson.tempJson.source_sku_id = data.source_sku_id
      this.dataJson.tempJson.spec = data.target_spec
      this.dataJson.tempJson.goods_name = data.target_goods_name
      this.dataJson.tempJson.sku_code = data.target_sku_code
      this.dataJson.tempJson.material_convert_id = data.id
      this.dataJson.tempJson.type = '1'
      // this.dataJson.tempJson.owner_id = data.owner_id
      this.dataJson.tempJson.calc = 1
      const detailList = {}
      detailList.source_spec_code = data.sku_code
      detailList.source_sku_code = data.source_sku_code
      detailList.source_goods_name = data.source_goods_name
      detailList.source_sku_id = data.source_sku_id
      detailList.calc = data.calc
      this.dataJson.tempJson.detailList = []
      this.dataJson.tempJson.detailList.splice(0, 1, detailList)
      this.popSettingsData.oldSpecDialog.visible = false
    },
    // 校验转换后
    sku_code_validator (rule, value, callback) {
      if (!isNotEmpty(this.dataJson.tempJson.sku_code)) {
        callback(new Error('请选择物料'))
      } else {
        callback()
      }
    },
    // 校验装换前物料
    source_sku_code (rule, value, callback) {
      if (!isNotEmpty(this.dataJson.tempJson.source_sku_code)) {
        callback(new Error('请选择物料'))
      } else {
        callback()
      }
    }
  }
}
</script>
