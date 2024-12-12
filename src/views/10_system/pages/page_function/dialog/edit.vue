<template>
  <div>
    <!-- pop窗口 数据编辑:新增、修改、步骤窗体-->
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
        label-position="rigth"
        label-width="140px"
        status-icon
      >
        <el-alert
          title="页面信息"
          type="info"
          :closable="false"
        />
        <br>
        <el-row>
          <el-col :span="12">
            <el-form-item
              label="页面编号："
              prop="page_code"
            >
              <input-search
                v-model.trim="dataJson.tempJson.page_code"
                :disabled="isUpdateModel && isViewModel"
                @onInputSearch="handlePageOpen"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              label="页面名称："
              prop="page_name"
            >
              <el-input
                v-model.trim="dataJson.tempJson.page_name"
                disabled
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item
              label="页面权限标识："
              prop="page_perms"
            >
              <el-input
                v-model.trim="dataJson.tempJson.page_perms"
                disabled
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-alert
          title="按钮信息"
          type="info"
          :closable="false"
        />
        <br>
        <el-row>
          <el-col :span="12">
            <el-form-item
              label="按钮编号："
              prop="function_code"
            >
              <input-search
                v-model.trim="dataJson.tempJson.function_code"
                :disabled="isUpdateModel && isViewModel"
                @onInputSearch="handleFunctionOpen"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              label="按钮名称："
              prop="function_name"
            >
              <el-input
                v-model.trim="dataJson.tempJson.function_name"
                disabled
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item
              label="排序："
              prop="sort"
            >
              <el-input v-model.trim="dataJson.tempJson.sort" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-alert
          title="权限信息"
          type="info"
          :closable="false"
        />
        <br>
        <el-form-item
          label="权限标识："
          prop="perms"
        >
          <el-input
            v-model.trim="dataJson.tempJson.perms"
            disabled
          />
        </el-form-item>
        <el-form-item
          label="说明："
          prop="descr"
        >
          <el-input
            v-model.trim="dataJson.tempJson.descr"
            clearable
            show-word-limit
            type="textarea"
            :maxlength="dataJson.inputSettings.maxLength.descr"
            :disabled="isViewModel"
          />
        </el-form-item>

        <el-row v-show="settings.dialogStatus === PARAMETERS.STATUS_UPDATE">
          <el-col :span="12">
            <el-form-item
              label="更新人："
              prop="u_name"
            >
              <el-input
                v-model.trim="dataJson.tempJson.u_name"
                disabled
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              label="更新时间："
              prop="u_time"
            >
              <el-input
                v-model.trim="dataJson.tempJson.u_time"
                disabled
              />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div
        slot="footer"
        class="dialog-footer"
      >
        <el-divider />
        <div class="floatLeft">
          <el-button
            v-show="!isViewModel"
            type="danger"
            :disabled="settings.loading || settings.btnDisabledStatus.disabledReset"
            @click="doReset()"
          >重置</el-button>
        </div>
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
        <el-button
          v-show="settings.btnShowStatus.showCopyInsert"
          plain
          type="primary"
          :disabled="settings.loading || settings.btnDisabledStatus.disabledCopyInsert "
          @click="doCopyInsert()"
        >确定</el-button>
      </div>
    </el-dialog>

    <page-dialog
      v-if="popSettings.one.visible"
      :visible="popSettings.one.visible"
      @closeMeOk="handlePageCloseOk"
      @closeMeCancel="handlePageCloseCancel"
    />

    <function-dialog
      v-if="popSettings.two.visible"
      :visible="popSettings.two.visible"
      @closeMeOk="handleFunctionCloseOk"
      @closeMeCancel="handleFunctionCloseCancel"
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
.el-input.is-disabled::v-deep .el-input__inner {
  color: #606266 !important;
}
</style>

<script>

import constants_para from '@/common/constants/constants_para'
import elDragDialog from '@/directive/el-drag-dialog'
import { updateApi, insertApi } from '@/api/10_system/pages/page_function'
import InputSearch from '@/components/40_input/inputSearch'
import pageDialog from '@/views/10_system/pages/page/dialog/dialog'
import functionDialog from '@/views/10_system/pages/function/dialog/dialog'
import deepCopy from 'deep-copy'

export default {
  // name: '', // 页面id，和router中的name需要一致，作为缓存
  components: { InputSearch, pageDialog, functionDialog },
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
      dataJson: {
        // 单条数据 json的，初始化原始数据
        tempJsonOriginal: {
          id: undefined,
          page_code: undefined,
          page_name: undefined,
          page_perms: '',
          function_code: '',
          function_name: undefined,
          sort: undefined,
          perms: '',
          dbversion: 0
        },
        // 单条数据 json
        tempJson: null,
        inputSettings: {
          maxLength: {
            name: 20,
            code: 20,
            component: 100,
            meta_title: 20,
            meta_icon: 20,
            perms: 20,
            descr: 200
          }
        }
      },
      settings: {
        // loading 状态
        loading: true,
        // 按钮是否显示，默认不显示，false：不显示，true：显示
        btnShowStatus: {
          showInsert: false,
          showUpdate: false,
          showCopyInsert: false
        },
        // 按钮状态：是否可用，false:可用，true不可用
        btnDisabledStatus: {
          disabledReset: true,
          disabledInsert: true,
          disabledUpdate: true,
          disabledCopyInsert: true
        },
        // 以下为pop的内容：数据弹出框
        selection: [],
        dialogStatus: this.dialogStatus,
        // pop的check内容
        rules: {
          page_code: [{ required: true, message: '请选择页面', trigger: 'change' }],
          page_name: [{ required: true, message: '请选择页面', trigger: 'change' }],
          page_perms: [{ required: true, message: '请选择页面', trigger: 'change' }],
          function_code: [{ required: true, message: '请选择按钮', trigger: 'change' }],
          function_name: [{ required: true, message: '请选择按钮', trigger: 'change' }],
          sort: [{ required: true, message: '请输入排序字段', trigger: 'change' }],
          perms: [{ required: true, message: '权限标识为必须输入字段', trigger: 'change' }]
        }
      },
      popSettings: {
        // 弹出编辑页面
        one: {
          visible: false,
          props: {
            id: undefined,
            data: {},
            dialogStatus: ''
          }
        },
        two: {
          visible: false,
          props: {
            id: undefined,
            data: {},
            dialogStatus: ''
          }
        }
      }
    }
  },
  computed: {
    // 是否为更新模式
    isUpdateModel () {
      if (this.settings.dialogStatus === this.PARAMETERS.STATUS_INSERT || this.settings.dialogStatus === this.PARAMETERS.STATUS_COPY_INSERT) {
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
  },
  created () {
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
      switch (this.dialogStatus) {
        case this.PARAMETERS.STATUS_INSERT:
          this.initInsertModel()
          break
        case this.PARAMETERS.STATUS_UPDATE:
          this.initUpdateModel()
          break
        case this.PARAMETERS.STATUS_COPY_INSERT:
          this.initCopyInsertModel()
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
      this.settings.btnShowStatus = this.$options.data.call(this).settings.btnShowStatus
    },
    initButtonDisabledStatus () {
      // 按钮状态初始化：默认不可用
      this.settings.btnDisabledStatus = this.$options.data.call(this).settings.btnDisabledStatus
    },
    // 新增时的初始化
    initInsertModel () {
      // 数据初始化
      this.initTempJsonOriginal()
      this.dataJson.tempJson = deepCopy(this.dataJson.tempJsonOriginal)
      // 设置按钮
      this.settings.btnShowStatus.showInsert = true
    },
    // 复制新增时的初始化
    initCopyInsertModel () {
      // 数据初始化
      this.dataJson.tempJson = deepCopy(this.data)
      this.dataJson.tempJson.function_id = undefined
      this.dataJson.tempJson.function_code = ''
      this.dataJson.tempJson.function_name = ''
      this.dataJson.tempJson.perms = this.dataJson.tempJson.page_perms + ':' + this.dataJson.tempJson.function_code
      this.dataJson.tempJsonOriginal = deepCopy(this.data)
      // 设置按钮
      this.settings.btnShowStatus.showCopyInsert = true
    },
    // 修改时的初始化
    initUpdateModel () {
      // 数据初始化
      this.dataJson.tempJson = deepCopy(this.data)
      this.dataJson.tempJsonOriginal = deepCopy(this.data)
      // 设置按钮
      this.settings.btnShowStatus.showUpdate = true
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
      this.watch.unwatch_tempJson = this.$watch('dataJson.tempJson', (newVal, oldVal) => {
        this.settings.btnDisabledStatus.disabledReset = false
        this.settings.btnDisabledStatus.disabledInsert = false
        this.settings.btnDisabledStatus.disabledUpdate = false
        this.settings.btnDisabledStatus.disabledCopyInsert = false
      }, { deep: true }
      )
    },
    unWatch () {
      if (this.watch.unwatch_tempJson) {
        this.watch.unwatch_tempJson()
      }
    },
    // Placeholder设置
    isPlaceholderShow (val) {
      if (this.isViewModel) {
        return ''
      } else {
        return val
      }
    },
    // 取消按钮
    handleCancel () {
      this.$emit('closeMeCancel')
    },
    // 重置按钮
    doReset () {
      switch (this.settings.dialogStatus) {
        case this.PARAMETERS.STATUS_UPDATE:
          // 数据初始化
          this.dataJson.tempJson = deepCopy(this.dataJson.tempJsonOriginal)
          break
        case this.PARAMETERS.STATUS_COPY_INSERT:
          // 数据初始化
          this.dataJson.tempJson = deepCopy(this.dataJson.tempJsonOriginal)
          this.dataJson.tempJson.function_id = undefined
          this.dataJson.tempJson.function_code = ''
          this.dataJson.tempJson.function_name = ''
          this.dataJson.tempJson.perms = this.dataJson.tempJson.page_perms + ':' + this.dataJson.tempJson.function_code
          break
        default:
          // 数据初始化
          this.dataJson.tempJson = deepCopy(this.dataJson.tempJsonOriginal)
          break
      }
      // 初始化按钮
      this.initButtonDisabledStatus()
      // 初始化watch
      this.setWatch()
      // 去除validate信息
      this.$nextTick(() => {
        this.$refs['dataSubmitForm'].clearValidate()
      })
    },
    // 插入逻辑
    doInsert () {
      this.$refs['dataSubmitForm'].validate((valid) => {
        if (valid) {
          // const tempData = Object.assign({}, this.dataJson.tempJson)
          const tempData = deepCopy(this.dataJson.tempJson)
          this.settings.loading = true
          insertApi(tempData).then((_data) => {
            this.$emit('closeMeOk', { return_flag: true, data: _data })
          }, (_error) => {
            this.$emit('closeMeOk', { return_flag: false, error: _error })
          }).finally(() => {
            this.settings.loading = false
          })
        }
      })
    },
    // 更新逻辑
    doUpdate () {
      this.$refs['dataSubmitForm'].validate((valid) => {
        if (valid) {
          // const tempData = Object.assign({}, this.dataJson.tempJson)
          const tempData = deepCopy(this.dataJson.tempJson)
          this.settings.loading = true
          updateApi(tempData).then((_data) => {
            // this.dataJson.tempJson = Object.assign({}, _data.data)
            this.dataJson.tempJson = deepCopy(_data.data)
            this.$emit('closeMeOk', { return_flag: true, data: _data })
          }, (_error) => {
            this.$emit('closeMeOk', { return_flag: false, error: _error })
          }).finally(() => {
            this.settings.loading = false
          })
        }
      })
    },
    // 复制新增逻辑
    doCopyInsert () {
      this.$refs['dataSubmitForm'].validate((valid) => {
        if (valid) {
          // const tempData = Object.assign({}, this.dataJson.tempJson)
          const tempData = deepCopy(this.dataJson.tempJson)
          this.settings.loading = true
          insertApi(tempData).then((_data) => {
            // this.dataJson.tempJson = Object.assign({}, _data.data)
            this.dataJson.tempJson = deepCopy(_data.data)
            this.$emit('closeMeOk', { return_flag: true, data: _data })
          }, (_error) => {
            this.$emit('closeMeOk', { return_flag: false, error: _error })
          }).finally(() => {
            this.settings.loading = false
          })
        }
      })
    },
    // ------------------页面编辑出框 start--------------------
    handlePageOpen () {
      this.popSettings.one.visible = true
    },
    handlePageCloseOk (val) {
      this.popSettings.one.selectedDataJson = val
      this.dataJson.tempJson.page_id = this.popSettings.one.selectedDataJson.id
      this.dataJson.tempJson.page_code = this.popSettings.one.selectedDataJson.code
      this.dataJson.tempJson.page_name = this.popSettings.one.selectedDataJson.name
      this.dataJson.tempJson.page_perms = this.popSettings.one.selectedDataJson.perms

      this.dataJson.tempJson.perms = this.dataJson.tempJson.page_perms + ':' + this.dataJson.tempJson.function_code
      this.popSettings.one.visible = false
    },
    handlePageCloseCancel () {
      this.popSettings.one.visible = false
    },
    // ------------------页面编辑出框 end--------------------
    // ------------------按钮出框 start--------------------
    handleFunctionOpen () {
      this.popSettings.two.visible = true
    },
    handleFunctionCloseOk (val) {
      this.popSettings.two.selectedDataJson = val
      this.dataJson.tempJson.function_id = this.popSettings.two.selectedDataJson.id
      this.dataJson.tempJson.function_code = this.popSettings.two.selectedDataJson.code
      this.dataJson.tempJson.function_name = this.popSettings.two.selectedDataJson.name
      this.dataJson.tempJson.sort = this.popSettings.two.selectedDataJson.sort
      this.dataJson.tempJson.perms = this.dataJson.tempJson.page_perms + ':' + this.dataJson.tempJson.function_code
      this.popSettings.two.visible = false
    },
    handleFunctionCloseCancel () {
      this.popSettings.two.visible = false
    }
    // ------------------按钮出框 end--------------------
  }
}
</script>
