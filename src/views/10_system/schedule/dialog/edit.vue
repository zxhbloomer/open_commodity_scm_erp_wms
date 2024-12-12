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
      top="5vh"
    >
      <div class="el-dialog-div">
        <el-form
          ref="dataSubmitForm"
          :rules="settings.rules"
          :model="dataJson.tempJson"
          label-position="rigth"
          label-width="140px"
          status-icon
        >

          <el-alert
            title="定时任务基本信息"
            type="info"
            :closable="false"
          />
          <br>
          <el-row>
            <el-col :span="12">
              <el-form-item
                label="任务名称："
                prop="job_name"
              >
                <el-input
                  v-model.trim="dataJson.tempJson.job_name"
                  clearable
                  show-word-limit
                  :maxlength="dataJson.inputSettings.maxLength.job_name"
                  :disabled="isUpdateModel"
                  :placeholder="isPlaceholderShow('请输入')"
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item
                label="任务组类型："
                prop="job_group_type"
              >
                <select-dict
                  v-model="dataJson.tempJson.job_group_type"
                  :para="CONSTANTS.DICT_SYS_JOB_GROUP_TYPE"
                  init-placeholder="请选择"
                />
              </el-form-item>
            </el-col>
          </el-row>
          <el-form-item
            label="cron表达式："
            prop="cron_expression"
          >
            <el-input
              v-model="dataJson.tempJson.cron_expression"
              placeholder="请输入cron执行表达式"
            >
              <template slot="append">
                <el-button
                  type="primary"
                  @click="handleShowCron"
                >
                  生成表达式
                  <i class="el-icon-time el-icon--right" />
                </el-button>
              </template>
            </el-input>
          </el-form-item>
          <el-row>
            <el-col :span="12">
              <el-form-item label="执行策略：">
                <el-radio-group v-model="dataJson.tempJson.misfire_policy">
                  <el-radio-button label="1">立即执行</el-radio-button>
                  <el-radio-button label="2">执行一次</el-radio-button>
                  <el-radio-button label="3">放弃执行</el-radio-button>
                </el-radio-group>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item
                label="是否启用："
                prop="long_term"
              >
                <el-switch
                  v-model="dataJson.tempJson.is_effected"
                  inactive-text="未启用"
                  active-text="启用"
                  :disabled="isViewModel"
                />
              </el-form-item>
            </el-col>
          </el-row>
          <el-form-item
            label="说明："
            prop="job_desc"
          >
            <el-input
              v-model.trim="dataJson.tempJson.job_desc"
              clearable
              type="textarea"
              show-word-limit
              :maxlength="dataJson.inputSettings.maxLength.job_desc"
              :disabled="isViewModel"
              :placeholder="isPlaceholderShow('请输入')"
            />
          </el-form-item>

          <el-alert
            title="定时任务执行内容"
            type="info"
            :closable="false"
          />
          <br>
          <el-form-item
            label="定时任务类名称："
            prop="class_name"
          >
            <el-input
              v-model.trim="dataJson.tempJson.class_name"
              clearable
              type="text"
              show-word-limit
              :maxlength="dataJson.inputSettings.maxLength.class_name"
              :disabled="isViewModel"
              :placeholder="isPlaceholderShow('请输入')"
            />
          </el-form-item>
          <el-form-item
            label="方法名称："
            prop="class_name"
          >
            <el-input
              v-model.trim="dataJson.tempJson.method_name"
              clearable
              type="text"
              show-word-limit
              :maxlength="dataJson.inputSettings.maxLength.method_name"
              :disabled="isViewModel"
              :placeholder="isPlaceholderShow('请输入')"
            />
          </el-form-item>
          <el-form-item
            label="参数类名称："
            prop="param_class"
          >
            <el-input
              v-model.trim="dataJson.tempJson.param_class"
              clearable
              type="text"
              show-word-limit
              :maxlength="dataJson.inputSettings.maxLength.param_class"
              :disabled="isViewModel"
              :placeholder="isPlaceholderShow('请输入')"
            />
          </el-form-item>

          <el-form-item
            label="参数值："
            prop="param_data"
          >
            <json-editor
              ref="jsonEditor"
              v-model="dataJson.tempJson.param_data"
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
      </div>
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
    <el-dialog
      title="Cron表达式生成器"
      :visible.sync="settings.openCron"
      append-to-body
      destroy-on-close
      class="scrollbar"
    >
      <crontab
        :expression="dataJson.expression"
        @hide="settings.openCron=false"
        @fill="crontabFill"
      />
    </el-dialog>
  </div>
</template>

<style scoped>
.el-dialog-div {
  height: 70vh;
  overflow: auto;
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
</style>

<script>

import constants_para from '@/common/constants/constants_para'
import elDragDialog from '@/directive/el-drag-dialog'
import { updateApi, insertApi } from '@/api/10_system/schedule/schedule'
import SelectDict from '@/components/00_dict/select/SelectDict'
import deepCopy from 'deep-copy'
import Crontab from '@/components/Crontab'
import JsonEditor from '@/components/JsonEditor'

export default {
  // name: '', // 页面id，和router中的name需要一致，作为缓存
  components: { SelectDict, Crontab, JsonEditor },
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
          is_cron: true,
          id: undefined,
          job_group_type: undefined,
          cron_expression: undefined,
          code: undefined,
          job_desc: undefined,
          misfire_policy: 1,
          dbversion: 0
        },
        // 传入的表达式
        expression: '',
        // 单条数据 json
        tempJson: null,
        inputSettings: {
          maxLength: {
            name: 20,
            code: 20,
            job_desc: 200,
            simple_name: 20
          }
        }
      },
      settings: {
        // 是否显示Cron表达式弹出层
        openCron: false,
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
          job_name: [{ required: true, message: '请输入任务名称！', trigger: 'change' }],
          job_group_type: [{ required: true, message: '任务组类型！', trigger: 'change' }],
          name: [{ required: true, message: '请输入集团名称', trigger: 'change' }],
          simple_name: [{ required: true, message: '请输入集团简称', trigger: 'change' }],
          cron_expression: [{ required: true, message: 'cron执行表达式不能为空', trigger: 'change' }],
          class_name: [{ required: true, message: '定时任务class_name不能为空', trigger: 'change' }],
          method_name: [{ required: true, message: '定时任务method_name不能为空', trigger: 'change' }]
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
        // this.$refs['refFocusOne'].focus()
      })
    },
    // 复制新增时的初始化
    initCopyInsertModel () {
      // 数据初始化
      this.dataJson.tempJson = deepCopy(this.data)
      this.dataJson.tempJson.code = ''
      this.dataJson.tempJsonOriginal = deepCopy(this.data)
      // 设置按钮
      this.settings.btnShowStatus.showCopyInsert = true
      // 控件focus
      this.$nextTick(() => {
        // this.$refs['refFocusOne'].focus()
      })
    },
    // 修改时的初始化
    initUpdateModel () {
      // 数据初始化
      this.dataJson.tempJson = deepCopy(this.data)
      this.dataJson.tempJsonOriginal = deepCopy(this.data)
      // 设置按钮
      this.settings.btnShowStatus.showUpdate = true
      // 控件focus
      this.$nextTick(() => {
        // this.$refs['refFocusOne'].focus()
      })
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
    /** cron表达式按钮操作 */
    handleShowCron () {
      this.dataJson.expression = this.dataJson.tempJson.cron_expression
      this.settings.openCron = true
    },
    /** 确定后回传值 */
    crontabFill (value) {
      this.dataJson.tempJson.cron_expression = value
    }
  }
}
</script>
