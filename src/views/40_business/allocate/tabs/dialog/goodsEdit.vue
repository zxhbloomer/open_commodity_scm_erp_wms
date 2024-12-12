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
        :rules="settings.rules"
        :model="dataJson.tempJson"
        label-position="right"
        label-width="0px"
        status-icon
      >
        <br>
        <el-descriptions
          title=""
          :column="2"
          :label-style="labelStyle"
          :content-style="contentStyle"
          direction="horizontal"
          border
        >

          <el-descriptions-item>
            <div
              slot="label"
              class="required-mark"
            >
              物料编码
            </div>
            <el-form-item prop="spec_code">

              <input-search
                v-model.trim="dataJson.tempJson.spec_code"
                :data="data"
                :disabled="isUpdateModel && isViewModel"
                @onInputSearch="handleSpecDialog"
              />
            </el-form-item>
          </el-descriptions-item>

          <el-descriptions-item label="物料名称">
            <el-form-item prop="goods_name">
              <el-input
                v-model.trim="dataJson.tempJson.goods_name"
                clearable
                disabled
                show-word-limit
              />
            </el-form-item>
          </el-descriptions-item>
          <el-descriptions-item label="品名">
            <el-form-item prop="pm">
              <el-input
                v-model.trim="dataJson.tempJson.pm"
                clearable
                show-word-limit
                disabled
              />
            </el-form-item>
          </el-descriptions-item>
          <el-descriptions-item label="规格">
            <el-form-item prop="spec">
              <el-input
                v-model.trim="dataJson.tempJson.spec"
                clearable
                show-word-limit
                disabled
              />
            </el-form-item>
          </el-descriptions-item>
          <el-descriptions-item label="原库存量">
            <el-form-item prop="qty_avaible">
              <el-input
                v-model.trim="dataJson.tempJson.qty_avaible"
                clearable
                show-word-limit
                disabled
              />
            </el-form-item>
          </el-descriptions-item>
          <el-descriptions-item>

            <div
              slot="label"
              class="required-mark"
            >
              调出量
            </div>
            <el-form-item prop="qty">
              <numeric
                v-model="dataJson.tempJson.qty"
                :decimal-places="4"
                :currency-symbol="''"
              />
            </el-form-item>
          </el-descriptions-item>
        </el-descriptions>
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
          v-show="settings.btnShowStatus.showUpdate"
          plain
          type="primary"
          :disabled="settings.loading || settings.btnDisabledStatus.disabledUpdate "
          @click="doUpdate()"
        >确定</el-button>
      </div>
    </el-dialog>

    <spec-dialog
      v-if="popSettingsData.specDialog.visible"
      :visible="popSettingsData.specDialog.visible"
      :data="dataJson.searchForm"
      @closeMeOk="handleSpecCloseOk"
      @closeMeCancel="handleSpecCloseCancel"
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
.el-input-group__append_select,
.el-input-group__append {
  color: #ffffff;
  background-color: #1890ff;
  border-color: #1890ff;
}
.required-mark::before {
  content: '*';
  color: #ff4949;
  margin-right: 4px;
}
.el-form-item--mini.el-form-item {
  margin-bottom: 0px;
}
</style>

<script>
import constants_para from '@/common/constants/constants_para'
import elDragDialog from '@/directive/el-drag-dialog'
import numeric from '@/components/40_input/numeric'
import deepCopy from 'deep-copy'
import specDialog from '@/views/50_query/inventory_detail/dialog/dialog'
import InputSearch from '@/components/40_input/inputSearch'

export default {
  components: { InputSearch, specDialog, numeric },
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
      default: constants_para.STATUS_INSERT
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
        width: '5%',
        'text-align': 'right'
      },
      popSettingsData: {
        // 规格弹出框
        specDialog: {
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
        textMap: {
          update: '请选择要修改结点的类型',
          insert: '请选择添加下级结点类型'
        },
        dialogFormVisible: false,
        btnDisabledStatus: {
          disabledOK: false
        },
        // 弹出的仓库查询框参数设置
        searchDialogDataOne: {
          // 弹出框显示参数
          visible: false,
          data: null,
          // 点击确定以后返回的值
          selectedDataJson: {
            id: null
          }
        },

        // 弹出的库区查询框参数设置
        searchDialogDataTwo: {
          // 弹出框显示参数
          visible: false,
          data: null,
          // 点击确定以后返回的值
          selectedDataJson: {
            id: null
          }
        },
        // 弹出的库位查询框参数设置
        searchDialogDataThree: {
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
          warehouse_name: '',
          spec_code: '',
          count: 0
        },
        // 单条数据 json
        tempJson: {
          warehouse_name: '',
          spec_code: '',
          count: 0
        },
        inputSettings: {
          maxLength: {
            name: 20,
            code: 20
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
        rules: {
          spec_code: [
            { required: true, message: '请选择物料', trigger: 'change' }
          ],
          count: [
            { required: true, message: '请输入入库数量', trigger: 'change' },
            { validator: this.checkCount, trigger: 'blur' }
          ],

          qty_adjust: [
            { required: true, message: '请选择调出量', trigger: 'change' }
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
      this.dataJson.tempJson.unit = '吨'
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
      this.dataJson.searchForm.warehouse_id = this.data.warehouse_id
      this.dataJson.searchForm.warehouse_name = this.data.warehouse_name
      this.dataJson.searchForm.owner_id = this.data.owner_id
      this.dataJson.searchForm.owner_name = this.data.owner_name

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
      this.dataJson.searchForm.warehouse_id = this.data.warehouse_id
      this.dataJson.searchForm.warehouse_name = this.data.warehouse_name
      this.dataJson.searchForm.owner_id = this.data.owner_id
      this.dataJson.searchForm.owner_name = this.data.owner_name

      this.dataJson.tempJsonOriginal = deepCopy(this.data)
      this.popSettingsData.searchDialogDataOne.selectedDataJson.id = this.data.business_id
      this.popSettingsData.searchDialogDataTwo.selectedDataJson.id = this.data.industry_id
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

    // 取消按钮
    handleCancel () {
      this.$emit('closeMeCancel')
    },
    // 插入逻辑
    doInsert () {
      this.$refs['dataSubmitForm'].validate(valid => {
        if (valid) {
          const tempData = deepCopy(this.dataJson.tempJson)
          // tempData.desc =
          this.settings.loading = true
          this.$emit('closeMeOk', { return_flag: true, data: tempData })
        }
      })
    },
    // 更新逻辑
    doUpdate () {
      this.$refs['dataSubmitForm'].validate(valid => {
        if (valid) {
          const tempData = deepCopy(this.dataJson.tempJson)
          // tempData.desc =
          this.settings.loading = true
          this.$emit('closeMeOk', { return_flag: true, data: tempData })
        }
      })
    },
    handleTabsClick (tab, event) { },
    // 规格数据选择
    handleSpecDialog () {
      this.popSettingsData.specDialog.visible = true
    },
    // 规格：关闭对话框：确定
    handleSpecCloseOk (val) {
      this.popSettingsData.specDialog.selectedDataJson = val
      this.dataJson.tempJson.spec_code = val.sku_code
      this.dataJson.tempJson.sku_code = val.sku_code
      this.dataJson.tempJson.sku_id = val.sku_id
      this.dataJson.tempJson.spec = val.spec
      this.dataJson.tempJson.pm = val.pm
      this.dataJson.tempJson.qty = val.qty_avaible
      this.dataJson.tempJson.qty_avaible = val.qty_avaible
      this.dataJson.tempJson.warehouse_id = val.warehouse_id
      this.dataJson.tempJson.bin_id = val.bin_id
      this.dataJson.tempJson.location_id = val.location_id
      this.dataJson.tempJson.goods_name = val.sku_name
      this.dataJson.tempJson.warehouse_name = val.warehouse_name
      this.dataJson.tempJson.stock_id = val.id
      this.popSettingsData.specDialog.visible = false
    },
    // 规格：关闭对话框：取消
    handleSpecCloseCancel () {
      this.popSettingsData.specDialog.visible = false
    }
  }
}
</script>
