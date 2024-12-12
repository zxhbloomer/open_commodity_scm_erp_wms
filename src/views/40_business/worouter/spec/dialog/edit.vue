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
      width="850px"
      destroy-on-close
    >
      <el-form
        ref="dataSubmitForm"
        :rules="settings.rulesOne"
        :model="dataJson.tempJson"
        label-position="right"
        label-width="150px"
        status-icon
      >
        <el-tabs
          style="height: 480px"
          @tab-click="handleTabsClick"
        >
          <el-tab-pane>
            <template slot="label">
              基本信息
              <el-badge
                v-show="settings.badge.countOne > 0"
                :value="settings.badge.countOne"
                type="danger"
              />
            </template>

            <el-alert
              title="物料信息"
              type="info"
              :closable="false"
            />
            <br>
            <el-row>
              <el-col :span="12">
                <el-form-item
                  label="所属板块："
                  prop="business_name"
                >
                  <el-input
                    v-model.trim="dataJson.tempJson.business_name"
                    disabled
                  >
                    <el-button
                      slot="append"
                      ref="selectOne"
                      icon="el-icon-search"
                      :disabled="isViewModel"
                      @click="handleBusinessDialog()"
                    >
                      选择
                    </el-button>
                  </el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item
                  label="所属行业："
                  prop="industry_name"
                >
                  <el-input
                    v-model.trim="dataJson.tempJson.industry_name"
                    disabled
                  >
                    <el-button
                      slot="append"
                      ref="selectOne"
                      icon="el-icon-search"
                      :disabled="isViewModel"
                      @click="handleIndustryDialog()"
                    >
                      选择
                    </el-button>
                  </el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item
                  label="所属类别："
                  prop="category_name"
                >
                  <el-input
                    v-model.trim="dataJson.tempJson.category_name"
                    disabled
                  >
                    <el-button
                      slot="append"
                      ref="selectOne"
                      icon="el-icon-search"
                      :disabled="isViewModel"
                      @click="handleCategoryDialog()"
                    >
                      选择
                    </el-button>
                  </el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item
                  label="物料名称："
                  prop="goods_name"
                >
                  <el-input
                    v-model.trim="dataJson.tempJson.goods_name"
                    disabled
                  >
                    <el-button
                      slot="append"
                      ref="selectOne"
                      icon="el-icon-search"
                      :disabled="isViewModel"
                      @click="handleGoodsDialog()"
                    >
                      选择
                    </el-button>
                  </el-input>
                </el-form-item>
              </el-col>
            </el-row>

            <el-alert
              title="规格信息"
              type="info"
              :closable="false"
            />
            <br>
            <el-row>
              <el-col :span="12">
                <el-form-item
                  label="物料规格编码："
                  prop="code"
                >
                  <el-input
                    v-model.trim="dataJson.tempJson.code"
                    clearable
                    show-word-limit
                    :maxlength="dataJson.inputSettings.maxLength.code"
                    :placeholder="isPlaceholderShow('请输入')"
                    :disabled="isViewModel"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item
                  label="品名："
                  prop="pm"
                >
                  <el-input
                    v-model.trim="dataJson.tempJson.pm"
                    clearable
                    show-word-limit
                    :maxlength="dataJson.inputSettings.maxLength.pm"
                    :placeholder="isPlaceholderShow('请输入')"
                    :disabled="isViewModel"
                  />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item
                  label="规格："
                  prop="spec"
                >
                  <el-input
                    v-model.trim="dataJson.tempJson.spec"
                    clearable
                    show-word-limit
                    :maxlength="dataJson.inputSettings.maxLength.spec"
                    :placeholder="isPlaceholderShow('请输入')"
                    :disabled="isViewModel"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item
                  label="是否启用："
                  prop="enable"
                >

                  <el-switch
                    v-model="dataJson.tempJson.enable"
                    active-color="#ff4949"
                    inactive-color="#dcdfe6"
                  />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item
                  label="净重："
                  prop="net_weight"
                >
                  <el-input
                    v-model.trim="dataJson.tempJson.net_weight"
                    clearable
                    show-word-limit
                    :maxlength="dataJson.inputSettings.maxLength.net_weight"
                    :placeholder="isPlaceholderShow('请输入')"
                    :disabled="isViewModel"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item
                  label="毛重："
                  prop="rough_weight"
                >
                  <el-input
                    v-model.trim="dataJson.tempJson.rough_weight"
                    clearable
                    show-word-limit
                    :maxlength="dataJson.inputSettings.maxLength.rough_weight"
                    :placeholder="isPlaceholderShow('请输入')"
                    :disabled="isViewModel"
                  />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item
                  label="体积："
                  prop="volume"
                >
                  <el-input
                    v-model.trim="dataJson.tempJson.volume"
                    clearable
                    show-word-limit
                    :maxlength="dataJson.inputSettings.maxLength.volume"
                    :placeholder="isPlaceholderShow('请输入')"
                    :disabled="isViewModel"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item
                  label="单位："
                  prop="unit"
                >
                  <select-dict
                    v-model="dataJson.tempJson.unit"
                    :para="CONSTANTS.DICT_M_UNIT"
                    init-placeholder="请选择单位"
                    :disabled="isViewModel"
                  />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item
                  label="产地："
                  prop="orgin"
                >
                  <el-input
                    v-model.trim="dataJson.tempJson.orgin"
                    clearable
                    show-word-limit
                    :maxlength="dataJson.inputSettings.maxLength.orgin"
                    :placeholder="isPlaceholderShow('请输入')"
                    :disabled="isViewModel"
                  />
                </el-form-item>
              </el-col>

            </el-row>

          </el-tab-pane>

        </el-tabs>
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

    <business-dialog
      v-if="popSettingsData.searchDialogDataOne.visible"
      :visible="popSettingsData.searchDialogDataOne.visible"
      @closeMeOk="handleCompanyCloseOk"
      @closeMeCancel="handleCompanyCloseCancel"
    />
    <industry-dialog
      v-if="popSettingsData.searchDialogDataTwo.visible"
      :visible="popSettingsData.searchDialogDataTwo.visible"
      :data="popSettingsData.searchDialogDataOne.selectedDataJson"
      @closeMeOk="handleIndustryCloseOk"
      @closeMeCancel="handleIndustryCloseCancel"
    />
    <category-dialog
      v-if="popSettingsData.searchDialogDataThree.visible"
      :visible="popSettingsData.searchDialogDataThree.visible"
      :data="popSettingsData.searchDialogDataTwo.selectedDataJson"
      @closeMeOk="handleCategoryCloseOk"
      @closeMeCancel="handleCategoryCloseCancel"
    />
    <goods-dialog
      v-if="popSettingsData.searchDialogDataFour.visible"
      :visible="popSettingsData.searchDialogDataFour.visible"
      :data="popSettingsData.searchDialogDataThree.selectedDataJson"
      @closeMeOk="handleGoodsCloseOk"
      @closeMeCancel="handleGoodsCloseCancel"
    />
  </div>

</template>

<style scoped>
.floatRight {
  float: right;
}
.floatLeft {
  float: left;
}
.el-form-item .el-select {
  width: 100%;
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
import SelectDict from '@/components/00_dict/select/SelectDict'
import constants_para from '@/common/constants/constants_para'
import elDragDialog from '@/directive/el-drag-dialog'
import deepCopy from 'deep-copy'
import { updateApi, insertApi } from '@/api/30_wms/spec/spec'
import { getListApi } from '@/api/30_wms/businesstype/businesstype'
import businessDialog from '@/views/30_wms/businesstype/dialog/dialog'
import industryDialog from '@/views/30_wms/industry/dialog/dialog'
import categoryDialog from '@/views/30_wms/category/dialog/dialog'
import goodsDialog from '@/views/30_wms/goods/dialog/dialog'

export default {
  components: { SelectDict, businessDialog, industryDialog, categoryDialog, goodsDialog },
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
          selectedDataJson: {}
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
        // 弹出的行业查询框参数设置
        searchDialogDataThree: {
          // 弹出框显示参数
          visible: false,
          data: null,
          // 点击确定以后返回的值
          selectedDataJson: {
            id: null
          }
        },
        // 弹出的商品查询框参数设置
        searchDialogDataFour: {
          // 弹出框显示参数
          visible: false,
          data: null,
          // 点击确定以后返回的值
          selectedDataJson: {
            id: null
          }
        },
        // 弹出的商品查询框参数设置
        convertDialog: {
          // 弹出框显示参数
          visible: false,
          data: null,
          // 点击确定以后返回的值
          selectedDataJson: {
            id: null
          }
        }
      },
      // 板块下拉框
      business_list: [],
      dataJson: {
        listData: [],

        searchForm: {
          pageCondition: {}
        },
        // 单条数据 json的，初始化原始数据
        tempJsonOriginal: {
          id: undefined,
          name: '',
          config_key: '',
          value: '',
          descr: ''
        },
        // 单条数据 json
        tempJson: {
        },
        inputSettings: {
          maxLength: {
            code: 20,
            pm: 20,
            spec: 20,
            net_weight: 20,
            rough_weight: 10,
            volume: 20,
            unit: 20,
            orgin: 20
          }
        }
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
        rulesOne: {
          code: [
            { required: true, message: '请输入规格编号', trigger: 'change' }
          ],
          spec: [
            { required: true, message: '请输入规格名称', trigger: 'change' }
          ],
          goods_name: [
            { required: true, message: '请选择物料', trigger: 'change' }
          ],
          category_name: [
            { required: true, message: '请选择类别', trigger: 'change' }
          ],
          business_name: [
            { required: true, message: '请选择板块', trigger: 'change' }
          ],
          industry_name: [
            { required: true, message: '请选择行业', trigger: 'change' }
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
    this.businessList()
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
      this.popSettingsData.searchDialogDataOne.selectedDataJson.id = this.data.business_id
      this.popSettingsData.searchDialogDataTwo.selectedDataJson.id = this.data.industry_id
      this.popSettingsData.searchDialogDataThree.selectedDataJson.id = this.data.category_id
      this.popSettingsData.searchDialogDataFour.selectedDataJson.id = this.data.goods_id

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
        'dataJson.tempJson',
        (newVal, oldVal) => {
          this.settings.btnDisabledStatus.disabledInsert = false
          this.settings.btnDisabledStatus.disabledUpdate = false
        },
        { deep: true }
      )
    },
    unWatch () {
      if (this.watch.unwatch_tempJson) {
        this.watch.unwatch_tempJson()
      }
    },
    businessList () {
      // 查询逻辑
      this.settings.loading = true
      getListApi(this.dataJson.searchForm).then(response => {
        // 增加对象属性，columnTypeShowIcon，columnNameShowIcon
        this.business_list = response.data
      }).finally(() => {
        this.settings.loading = false
      })
    },
    // 取消按钮
    handleCancel () {
      this.$emit('closeMeCancel')
    },
    // 插入逻辑
    doInsert () {
      // 开始综合验证
      this.doValidateByTabs()
      this.$refs['dataSubmitForm'].validate(valid => {
        if (valid) {
          const tempData = deepCopy(this.dataJson.tempJson)
          tempData.business_id = this.popSettingsData.searchDialogDataOne.selectedDataJson.id
          tempData.industry_id = this.popSettingsData.searchDialogDataTwo.selectedDataJson.id
          tempData.category_id = this.popSettingsData.searchDialogDataThree.selectedDataJson.id
          tempData.goods_id = this.popSettingsData.searchDialogDataFour.selectedDataJson.id
          tempData.goods_name = this.popSettingsData.searchDialogDataFour.selectedDataJson.name
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
      // 开始综合验证
      this.doValidateByTabs()
      this.$refs['dataSubmitForm'].validate(valid => {
        if (valid) {
          const tempData = deepCopy(this.dataJson.tempJson)
          if (this.popSettingsData.searchDialogDataOne.selectedDataJson != null) {
            tempData.business_id = this.popSettingsData.searchDialogDataOne.selectedDataJson.id
          }
          if (this.popSettingsData.searchDialogDataTwo.selectedDataJson != null) {
            tempData.industry_id = this.popSettingsData.searchDialogDataTwo.selectedDataJson.id
          }
          if (this.popSettingsData.searchDialogDataThree.selectedDataJson != null) {
            tempData.category_id = this.popSettingsData.searchDialogDataThree.selectedDataJson.id
          }
          if (this.popSettingsData.searchDialogDataFour.selectedDataJson != null) {
            tempData.goods_id = this.popSettingsData.searchDialogDataFour.selectedDataJson.id
            tempData.goods_name = this.popSettingsData.searchDialogDataFour.selectedDataJson.name
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
    handleTabsClick (tab, event) { },
    // 板块
    handleBusinessDialog () {
      this.popSettingsData.searchDialogDataOne.visible = true
    },
    // 板块：关闭对话框：确定
    handleCompanyCloseOk (val) {
      this.popSettingsData.searchDialogDataOne.selectedDataJson = val
      this.popSettingsData.searchDialogDataOne.visible = false
      this.settings.btnDisabledStatus.disabledUpdate = false
      this.dataJson.tempJson.business_name = val.name
    },
    // 板块：关闭对话框：取消
    handleCompanyCloseCancel () {
      this.popSettingsData.searchDialogDataOne.visible = false
    },
    // 行业
    handleIndustryDialog () {
      if (this.popSettingsData.searchDialogDataOne.selectedDataJson.id == null) {
        this.showErrorMsg('请先选择板块')
        return
      }
      this.popSettingsData.searchDialogDataTwo.data = this.popSettingsData.searchDialogDataOne.selectedDataJson
      this.popSettingsData.searchDialogDataTwo.visible = true
    },
    // 行业：关闭对话框：确定
    handleIndustryCloseOk (val) {
      this.popSettingsData.searchDialogDataTwo.selectedDataJson = val
      this.popSettingsData.searchDialogDataTwo.visible = false
      this.settings.btnDisabledStatus.disabledUpdate = false
      this.dataJson.tempJson.industry_name = val.name
    },
    // 行业：关闭对话框：取消
    handleIndustryCloseCancel () {
      this.popSettingsData.searchDialogDataTwo.visible = false
    },
    // 类别
    handleCategoryDialog () {
      if (this.popSettingsData.searchDialogDataTwo.selectedDataJson.id == null) {
        this.showErrorMsg('请先选择行业')
        return
      }
      this.popSettingsData.searchDialogDataThree.data = this.popSettingsData.searchDialogDataOne.selectedDataJson
      this.popSettingsData.searchDialogDataThree.visible = true
    },
    // 类别：关闭对话框：确定
    handleCategoryCloseOk (val) {
      this.popSettingsData.searchDialogDataThree.selectedDataJson = val
      this.popSettingsData.searchDialogDataThree.visible = false
      this.settings.btnDisabledStatus.disabledUpdate = false
      this.dataJson.tempJson.category_name = val.name
    },
    // 类别：关闭对话框：取消
    handleCategoryCloseCancel () {
      this.popSettingsData.searchDialogDataThree.visible = false
    },
    // 商品
    handleGoodsDialog () {
      if (this.popSettingsData.searchDialogDataThree.selectedDataJson.id == null) {
        this.showErrorMsg('请先选择类别')
        return
      }
      this.popSettingsData.searchDialogDataFour.data = this.popSettingsData.searchDialogDataOne.selectedDataJson
      this.popSettingsData.searchDialogDataFour.visible = true
    },
    // 商品：关闭对话框：确定
    handleGoodsCloseOk (val) {
      this.popSettingsData.searchDialogDataFour.selectedDataJson = val
      this.popSettingsData.searchDialogDataFour.visible = false
      this.settings.btnDisabledStatus.disabledUpdate = false
      this.dataJson.tempJson.goods_name = val.name
    },
    // 商品：关闭对话框：取消
    handleGoodsCloseCancel () {
      this.popSettingsData.searchDialogDataFour.visible = false
    },
    // 点击新增单位换算
    handleConvertInsert () {
      // 新增
      this.popSettingsData.convertDialog.visible = true
    },
    // 点击清空单位换算
    handleClearConvert () {
      // 清空
    },
    // 开始综合验证
    doValidateByTabs () {
      // 第一个tabs
      this.settings.rules = this.settings.rulesOne
      this.$refs['dataSubmitForm'].rules = this.settings.rules
      this.$refs['dataSubmitForm'].clearValidate()
      this.$refs['dataSubmitForm'].validate((valid, validateItems) => {
        if (valid === false) {
          this.settings.badge.countOne = Object.keys(validateItems).length
        } else {
          this.settings.badge.countOne = 0
        }
      })
      // 所有的数据进行验证
      this.doValidateAllRules()
    },
    // 所有的数据开始validate
    doValidateAllRules () {
      if (this.isLoginEnabled) {
        this.settings.rules = { ...this.settings.rulesOne }
      } else {
        this.settings.rules = { ...this.settings.rulesOne }
      }

      this.$refs['dataSubmitForm'].rules = this.settings.rules
      this.$refs['dataSubmitForm'].clearValidate()
    }

  }
}
</script>
