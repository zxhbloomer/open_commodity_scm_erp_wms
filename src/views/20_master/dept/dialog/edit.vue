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
      width="700px"
      destroy-on-close
    >
      <el-form
        ref="dataSubmitForm"
        :rules="settings.rules"
        :model="dataJson.tempJson"
        label-position="rigth"
        label-width="120px"
        status-icon
      >
        <el-alert
          title="基本信息"
          type="info"
          :closable="false"
        />
        <br>
        <el-row>
          <el-col :span="12">
            <el-form-item
              label="部门编号："
              prop="code"
            >
              <el-input
                ref="refFocusOne"
                v-model.trim="dataJson.tempJson.code"
                clearable
                show-word-limit
                :maxlength="dataJson.inputSettings.maxLength.code"
                :disabled="isUpdateModel || isViewModel"
                :placeholder="isPlaceholderShow('请输入')"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              label="部门名称："
              prop="name"
            >
              <el-input
                ref="refFocusTwo"
                v-model.trim="dataJson.tempJson.name"
                clearable
                show-word-limit
                :maxlength="dataJson.inputSettings.maxLength.name"
                :placeholder="isPlaceholderShow('请输入')"
                :disabled="isViewModel"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item
              label="部门简称："
              prop="simple_name"
            >
              <el-input
                v-model.trim="dataJson.tempJson.simple_name"
                clearable
                show-word-limit
                :maxlength="dataJson.inputSettings.maxLength.simple_name"
                :placeholder="isPlaceholderShow('请输入')"
                :disabled="isViewModel"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              label="部门主管："
              prop="handler_id"
            >
              <input-search
                v-model.trim="popSettings.one.selectedDataJson.name"
                @onInputSearch="handleStaffDialogClickOne"
              />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="12">
            <el-form-item
              label="部门副主管："
              prop="sub_handler_id"
            >
              <input-search
                v-model.trim="popSettings.two.selectedDataJson.name"
                @onInputSearch="handleStaffDialogClickTwo"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              label="上级主管领导："
              prop="leader_id"
            >
              <input-search
                v-model.trim="popSettings.three.selectedDataJson.name"
                @onInputSearch="handleStaffDialogClickThree"
              />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="12">
            <el-form-item
              label="上级分管领导："
              prop="response_leader_id"
            >
              <input-search
                v-model.trim="popSettings.four.selectedDataJson.name"
                @onInputSearch="handleStaffDialogClickFour"
              />
            </el-form-item>
          </el-col>
        </el-row>

        <el-form-item
          label="说明："
          prop="descr"
        >
          <el-input
            v-model.trim="dataJson.tempJson.descr"
            clearable
            type="textarea"
            show-word-limit
            :maxlength="dataJson.inputSettings.maxLength.descr"
            :placeholder="isPlaceholderShow('请输入')"
            :disabled="isViewModel"
          />
        </el-form-item>
        <el-row v-show="settings.dialogStatus === PARAMETERS.STATUS_UPDATE || isViewModel">
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
          v-show="settings.btnShowStatus.showUpdate"
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

    <staff-dialog
      :visible="popSettings.one.visible"
      @closeMeOk="handleStaffCloseOkOne"
      @closeMeCancel="handleStaffCloseCancelOne"
    />

    <staff-dialog
      :visible="popSettings.two.visible"
      @closeMeOk="handleStaffCloseOkTwo"
      @closeMeCancel="handleStaffCloseCancelTwo"
    />

    <staff-dialog
      :visible="popSettings.three.visible"
      @closeMeOk="handleStaffCloseOkThree"
      @closeMeCancel="handleStaffCloseCancelThree"
    />

    <staff-dialog
      :visible="popSettings.four.visible"
      @closeMeOk="handleStaffCloseOkFour"
      @closeMeCancel="handleStaffCloseCancelFour"
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
.el-input-group__append_select {
  color: #ffffff;
  background-color: #1890ff;
  border-color: #1890ff;
}
</style>

<script>

import constants_para from '@/common/constants/constants_para'
import elDragDialog from '@/directive/el-drag-dialog'
import { updateApi, insertApi } from '@/api/20_master/dept/dept'
import deepCopy from 'deep-copy'
import staffDialog from '@/views/20_master/staff/dialog/dialog'
import InputSearch from '@/components/40_input/inputSearch'

export default {
  // name: '', // 页面id，和router中的name需要一致，作为缓存
  components: { staffDialog, InputSearch },
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
        unwatch_tempJson: null,
        unwatch_staff_one: null,
        unwatch_staff_two: null,
        unwatch_staff_three: null,
        unwatch_staff_four: null
      },
      dataJson: {
        // 单条数据 json的，初始化原始数据
        tempJsonOriginal: {
          id: undefined,
          name: '',
          code: '',
          descr: '',
          dbversion: 0
        },
        // 单条数据 json
        tempJson: null,
        inputSettings: {
          maxLength: {
            name: 20,
            code: 20,
            descr: 200,
            simple_name: 20
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
        dialogStatus: this.dialogStatus,
        // pop的check内容
        rules: {
          name: [{ required: true, message: '请输入部门名称', trigger: 'change' }],
          simple_name: [{ required: true, message: '请输入部门简称', trigger: 'change' }]
        }
      },
      popSettings: {
        one: {
          visible: false,
          // 点击确定以后返回的值
          selectedDataJson: {}
        },
        two: {
          visible: false,
          // 点击确定以后返回的值
          selectedDataJson: {}
        },
        three: {
          visible: false,
          // 点击确定以后返回的值
          selectedDataJson: {}
        },
        four: {
          visible: false,
          // 点击确定以后返回的值
          selectedDataJson: {}
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
      // 控件focus
      this.$nextTick(() => {
        this.$refs['refFocusOne'].focus()
      })
    },
    // 复制新增时的初始化
    initCopyInsertModel () {
      // 数据初始化
      this.dataJson.tempJson = deepCopy(this.data)
      this.dataJson.tempJson.code = ''
      this.dataJson.tempJsonOriginal = deepCopy(this.data)
      this.initStaffData()
      // 设置按钮
      this.settings.btnShowStatus.showCopyInsert = true
      // 控件focus
      this.$nextTick(() => {
        this.$refs['refFocusTwo'].focus()
      })
    },
    // 修改时的初始化
    initUpdateModel () {
      // 数据初始化
      this.dataJson.tempJson = deepCopy(this.data)
      this.dataJson.tempJsonOriginal = deepCopy(this.data)
      this.initStaffData()
      // 设置按钮
      this.settings.btnShowStatus.showUpdate = true
      // 控件focus
      this.$nextTick(() => {
        this.$refs['refFocusTwo'].focus()
      })
    },
    // 查看时的初始化
    initViewModel () {
      // 数据初始化
      this.dataJson.tempJson = deepCopy(this.data)
      this.initStaffData()
    },
    // 初始化各个主管人员数据
    initStaffData () {
      this.popSettings.one.selectedDataJson = { handler_id: this.dataJson.tempJson.handler_id, name: this.dataJson.tempJson.handler_id_name }
      this.popSettings.two.selectedDataJson = { sub_handler_id: this.dataJson.tempJson.sub_handler_id, name: this.dataJson.tempJson.sub_handler_id_name }
      this.popSettings.three.selectedDataJson = { leader_id: this.dataJson.tempJson.leader_id, name: this.dataJson.tempJson.leader_id_name }
      this.popSettings.four.selectedDataJson = { response_leader_id: this.dataJson.tempJson.response_leader_id, name: this.dataJson.tempJson.leader_id_name }
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
      // 监听页面上员工staff是否有修改，one
      this.watch.unwatch_staff_one = this.$watch('popSettings.one.selectedDataJson', (newVal, oldVal) => {
        if (newVal !== {}) {
          this.dataJson.tempJson.handler_id = this.popSettings.one.selectedDataJson.id
        } else {
          this.popSettings.one.selectedDataJson.id = undefined
        }
      }
      )
      // 监听页面上员工staff是否有修改，two
      this.watch.unwatch_staff_two = this.$watch('popSettings.two.selectedDataJson', (newVal, oldVal) => {
        if (newVal !== {}) {
          this.dataJson.tempJson.handler_id = this.popSettings.two.selectedDataJson.id
        } else {
          this.popSettings.two.selectedDataJson.id = undefined
        }
      }
      )
      // 监听页面上员工staff是否有修改，three
      this.watch.unwatch_staff_three = this.$watch('popSettings.three.selectedDataJson', (newVal, oldVal) => {
        if (newVal !== {}) {
          this.dataJson.tempJson.handler_id = this.popSettings.three.selectedDataJson.id
        } else {
          this.popSettings.three.selectedDataJson.id = undefined
        }
      }
      )
      // 监听页面上员工staff是否有修改，four
      this.watch.unwatch_staff_four = this.$watch('popSettings.four.selectedDataJson', (newVal, oldVal) => {
        if (newVal !== {}) {
          this.dataJson.tempJson.handler_id = this.popSettings.four.selectedDataJson.id
        } else {
          this.popSettings.four.selectedDataJson.id = undefined
        }
      }
      )
    },
    unWatch () {
      if (this.watch.unwatch_tempJson) {
        this.watch.unwatch_tempJson()
      }
      if (this.watch.unwatch_staff_one) {
        this.watch.unwatch_staff_one()
      }
      if (this.watch.unwatch_staff_two) {
        this.watch.unwatch_staff_two()
      }
      if (this.watch.unwatch_staff_three) {
        this.watch.unwatch_staff_three()
      }
      if (this.watch.unwatch_staff_four) {
        this.watch.unwatch_staff_four()
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
          // this.dataJson.tempJson = Object.assign({}, this.dataJson.tempJsonOriginal)
          this.dataJson.tempJson = deepCopy(this.dataJson.tempJsonOriginal)
          // 设置控件焦点focus
          this.$nextTick(() => {
            this.$refs['refFocusOne'].focus()
          })
          break
        case this.PARAMETERS.STATUS_COPY_INSERT:
          // 数据初始化
          // this.dataJson.tempJson = Object.assign({}, this.dataJson.tempJsonOriginal)
          this.dataJson.tempJson = deepCopy(this.dataJson.tempJsonOriginal)
          this.dataJson.tempJson.code = ''
          // 设置控件焦点focus
          this.$nextTick(() => {
            this.$refs['refFocusTwo'].focus()
          })
          break
        default:
          // 数据初始化
          // this.dataJson.tempJson = Object.assign({}, this.dataJson.tempJsonOriginal)
          this.dataJson.tempJson = deepCopy(this.dataJson.tempJsonOriginal)
          // 设置控件焦点focus
          this.$nextTick(() => {
            this.$refs['refFocusOne'].focus()
          })
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
    // --------------弹出查询框：--------------
    // 1
    handleStaffDialogClickOne () {
      // 选择按钮
      this.popSettings.one.visible = true
    },
    // 关闭对话框：确定
    handleStaffCloseOkOne (val) {
      this.popSettings.one.selectedDataJson = val
      this.popSettings.one.visible = false
    },
    // 关闭对话框：取消
    handleStaffCloseCancelOne () {
      this.popSettings.one.visible = false
    },
    // 2
    handleStaffDialogClickTwo () {
      // 选择按钮
      this.popSettings.two.visible = true
    },
    // 关闭对话框：确定
    handleStaffCloseOkTwo (val) {
      this.popSettings.two.selectedDataJson = val
      this.popSettings.two.visible = false
    },
    // 关闭对话框：取消
    handleStaffCloseCancelTwo () {
      this.popSettings.two.visible = false
    },
    // 3
    handleStaffDialogClickThree () {
      // 选择按钮
      this.popSettings.three.visible = true
    },
    // 关闭对话框：确定
    handleStaffCloseOkThree (val) {
      this.popSettings.three.selectedDataJson = val
      this.popSettings.three.visible = false
    },
    // 关闭对话框：取消
    handleStaffCloseCancelThree () {
      this.popSettings.three.visible = false
    },
    // 4
    handleStaffDialogClickFour () {
      // 选择按钮
      this.popSettings.four.visible = true
    },
    // 关闭对话框：确定
    handleStaffCloseOkFour (val) {
      this.popSettings.four.selectedDataJson = val
      this.popSettings.four.visible = false
    },
    // 关闭对话框：取消
    handleStaffCloseCancelFour () {
      this.popSettings.four.visible = false
    }
  }
}
</script>
