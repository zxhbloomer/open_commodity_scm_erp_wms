<template>
  <div>
    <el-dialog
      v-if="showDialog"
      :title="title"
      :visible.sync="dialogVisible"
      width="25%"
      element-loading-text="拼命加载中，请稍后..."
      element-loading-background="rgba(255, 255, 255, 0.7)"
      :close-on-click-modal="PARAMETERS.DIALOG_CLOSE_BY_CLICK"
      :close-on-press-escape="PARAMETERS.DIALOG_CLOSE_BY_ESC"
      :show-close="PARAMETERS.DIALOG_SHOW_CLOSE"
      custom-class="configDialog"
      :append-to-body="true"
      :modal-append-to-body="true"
      :destroy-on-close="true"
    >
      <div style="margin-bottom: 10px">
        <el-alert
          title="成功修改密码后，将自动退出系统，请使用新密码重新登录"
          type="info"
          :closable="false"
        />
      </div>
      <el-form
        ref="form"
        :model="user"
        :rules="rules"
        label-width="80px"
      >

        <el-form-item
          label="旧密码"
          prop="oldPassword"
        >
          <el-input
            v-model="user.oldPassword"
            placeholder="请输入旧密码"
            type="password"
            show-password
          />

        </el-form-item>
        <el-form-item
          label="新密码"
          prop="newPassword"
        >
          <!--      <el-input-->
          <!--        v-model="user.newPassword"-->
          <!--        placeholder="请输入新密码"-->
          <!--        type="password"-->
          <!--        show-password-->
          <!--      />-->
          <password
            v-model="user.newPassword"
            placeholder="请输入新密码"
            type="password"
          />

        </el-form-item>
        <el-form-item
          label="确认密码"
          prop="confirmPassword"
        >
          <el-input
            v-model="user.confirmPassword"
            placeholder="请确认新密码"
            type="password"
            show-password
          />
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            size="mini"
            @click="submit"
          >保存
          </el-button>
          <el-button
            type="primary"
            plain
            icon="perfect-icon-reset"
            @click="doReset"
          >重置</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
// import Sync from '@/views/10_system/synclog/dialog/syncalarmdialog'
import constants_program from '@/common/constants/constants_program'
import { mapState } from 'vuex'
import { updatePwd } from '@/api/10_system/user/user'
import Password from '@/components/pwdMeter/pwdMeter.vue'

export default {
  components: { Password },
  props: {
    // 是否显示
    showDialog: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: ''
    }
  },
  data () {
    const equalToPassword = (rule, value, callback) => {
      if (this.user.newPassword !== value) {
        callback(new Error('两次输入的密码不一致'))
      } else {
        callback()
      }
    }
    return {
      dialogVisible: true,
      constants_program: constants_program,
      dataJson: {
        searchForm: {},
        sumData: {
          // 监管任务数量
          monitorCount: 0,
          // 监管任务同步失败
          monitorSyncErrorCount: 0,
          // 出库计划数量
          outPlanCount: 0,
          // 出库单数量
          outCount: 0,
          // 入库单数量
          inCount: 0,
          // 入库计划数量
          inPlanCount: 0,
          // 待审核预警
          monitor_unaudited: 0,
          // 港口停滞预警
          inventory_stagnation_warning: 0,
          // 监管任务损耗预警
          monitor_loss_warning: 0
        }
      },
      // 页面设置json
      settings: {
        duration: 4000
      },
      user: {
        oldPassword: undefined,
        newPassword: undefined,
        confirmPassword: undefined
      },
      // 表单校验
      rules: {
        oldPassword: [
          { required: true, message: '旧密码不能为空', trigger: 'blur' }
        ],
        newPassword: [
          { required: true, message: '新密码不能为空', trigger: 'blur' },
          { min: 8, message: '长度需大于8位', trigger: 'blur' },
          {
            validator: (rule, value, callback) => {
              if (!/[A-Z]/.test(value)) {
                callback(new Error('密码必须包含大写字母'))
              } else if (!/[a-z]/.test(value)) {
                callback(new Error('密码必须包含小写字母'))
              } else if (!/[0-9]/.test(value)) {
                callback(new Error('密码必须包含数字'))
              } else {
                callback()
              }
            },
            trigger: 'blur'
          }
        ],
        confirmPassword: [
          { required: true, message: '确认密码不能为空', trigger: 'blur' },
          { required: true, validator: equalToPassword, trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
    ...mapState('headNotice', ['alarmCount'])
  },
  created () {

  },
  beforeDestroy () {
    // alert('销毁了')
  },
  methods: {
    submit () {
      this.$refs['form'].validate(valid => {
        if (valid) {
          this.showLoading('数据保存中...')
          const tempJson = {}
          tempJson.pwd_his_pwd = this.user.oldPassword
          tempJson.pwd = this.user.newPassword
          updatePwd(tempJson).then((_data) => {
            this.$notify({
              title: '更新处理成功',
              message: _data.message,
              type: 'success',
              duration: this.settings.duration
            })
            this.logout()
          }, (_error) => {
            this.$notify({
              title: '更新处理失败',
              message: _error.message,
              type: 'error',
              duration: this.settings.duration
            })
          }).finally(() => {
            this.closeLoading()
          })
        }
      })
    },
    doReset () {
      this.user = this.$options.data.call(this).user
    },
    async logout () {
      await this.$store.dispatch('user/logout')
      this.$router.push(`/login?redirect=${this.$route.fullPath}`)
    }
  }
}
</script>

<style lang="scss" scoped>
.configDialog.el-dialog {
  .el-dialog__header {
    display: none !important;
  }
  .dj-dialog-content {
    padding: 0;
    overflow: unset;
  }
}
::v-deep .configDialog .el-dialog__body {
  padding: 10px 12px;
}

::v-deep .configDialog .el-dialog__footer {
  padding: 15px;
  padding-top: 0px;
}
.el-checkbox {
  width: auto;
}
.el-aside {
  background-color: white;
  padding: 10px 12px;
}
br {
  display: block;
  margin: 1px;
  content: ' ';
}
.el-main {
  padding: 1px;
  height: 300px;
}

::v-deep .el-main .container {
  height: 251px;
}
.el-divider--vertical {
  display: inline-block;
  width: 2px;
  height: 21em;
  margin: 1px 2px;
  vertical-align: middle;
  position: relative;
}

</style>
<!--<style>-->
<!--.el-dialog {-->
<!--  left: 50%;-->
<!--  top: 50%;-->
<!--  transform: translate(-50%, -50%);-->
<!--  margin: 0px !important;-->
<!--}-->
<!--</style>-->
