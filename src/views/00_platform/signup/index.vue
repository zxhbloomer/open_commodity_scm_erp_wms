<template>
  <div class="login-container">

    <div class="header">
      <div class="clearfix">
        <div class="logo-title">企业注册</div>
        <div class="have-account">已有账号？
          <el-link>
            <router-link to="login">请登录</router-link>
          </el-link>
        </div>
      </div>
      <el-divider />
      <el-form
        ref="signupForm"
        :validate-on-rule-change="false"
        :model="signupForm"
        :rules="registRules"
        class="login-form"
        label-position="left"
      >

        <div class="progress-bar">
          <el-steps
            :space="200"
            :active="stepsSetting.active + 1"
            align-center
          >
            <el-step title="验证手机号" />
            <el-step title="填写账号信息" />
            <el-step title="注册成功" />
          </el-steps>
          <br>
          <br>
          <br>
        </div>
        <div v-show="stepsSetting.active === 0">
          <el-form-item v-show="checkJson.errorStatus">
            <el-alert
              :title="checkJson.errorMsg"
              type="error"
              show-icon
              close-text="知道了"
              @close="handleClose"
            />
          </el-form-item>
          <el-form-item prop="mobile">
            <span class="mobile-container">
              中国 +86
            </span>
            <el-input
              ref="mobile"
              v-model="signupForm.mobile"
              placeholder="请填写常用的手机号码"
              type="text"
              tabindex="1"
              class="input-width"
              autocomplete="off"
              @change="handleChange"
            />
          </el-form-item>

          <div v-if="!codeValidateFlg">
            <el-popover
              ref="popover"
              v-model="popoverShow"
              placement="top"
              width="430"
              title="请完成拼图验证"
            >
              <Verify
                :v-offset="10"
                type="puzzle"
                :show-button="false"
                :img-name="['1.jpg']"
                @success="handlePuzzleSuccess('success')"
                @error="handlePuzzleError('Error')"
              />
              <el-button
                slot="reference"
                :loading="loading"
                type="primary"
                style="width:100%;margin-bottom:30px;"
                class="form-item form-item-getcode"
                @click="handleShowPopover"
              >点击按钮开始验证</el-button>
            </el-popover>
          </div>

          <el-form-item
            v-if="codeValidateFlg"
            prop="sms_code"
          >
            <span class="code-container">
              手机验证码
            </span>
            <el-input
              v-model="signupForm.sms_code"
              placeholder="输入验证码"
              class="code-width"
              autocomplete="off"
            />
            <el-button
              class="code_button"
              @click="handleRecode"
            >
              <span v-if="msTime.show">
                {{ msTime.count }}秒后重新获取
              </span>
              <span v-if="msTime.show === false">
                重新获取
              </span>
            </el-button>
          </el-form-item>
        </div>

        <div v-show="stepsSetting.active === 1">
          <el-form-item prop="tenant">
            <span class="svg-container">
              <svg-icon icon-class="tenant" />
            </span>
            <el-input
              v-model="signupForm.tenant"
              placeholder="请输入租户名称"
              autocomplete="off"
            />
          </el-form-item>
          <el-form-item prop="admin">
            <span class="svg-container">
              <svg-icon icon-class="admin" />
            </span>
            <el-input
              v-model="signupForm.admin"
              placeholder="请输入管理员名称"
              autocomplete="off"
            />
          </el-form-item>
          <el-form-item prop="password">
            <span class="svg-container">
              <svg-icon icon-class="password" />
            </span>
            <el-input
              v-model="signupForm.password"
              placeholder="请输入密码"
              show-password
              autocomplete="new-password"
            />
          </el-form-item>
          <el-form-item prop="password2">
            <span class="svg-container">
              <svg-icon icon-class="password" />
            </span>
            <el-input
              v-model="signupForm.password2"
              placeholder="请确认密码"
              show-password
              autocomplete="new-password"
            />
          </el-form-item>
        </div>

        <div v-show="stepsSetting.active === 2">
          <p class="success_title">
            <svg-icon icon-class="ok" />
            您已成功注册账号
          </p>
          <p class="success_line1">
            手机号码：{{ signupForm.mobile }}（如果忘记密码或丢失账号，可以通过手机找回密码）
          </p>
          <p class="success_line2">
            系统将在{{ signUpOk_CountDown }}秒后自动跳转到登录页面，如果没有请点击返回登录页面手动跳转
          </p>
          <br>
        </div>

        <el-button
          v-show="stepsSetting.active !== 2"
          :loading="loading"
          type="primary"
          class="btn-register"
          @click="handleNext"
        >下一步</el-button>
        <el-button
          v-show="stepsSetting.active === 2"
          :loading="loading"
          type="primary"
          class="btn-register"
          @click="handleReturnLoginBtn"
        >返回登录页面</el-button>
      </el-form>
    </div>
  </div>
</template>

<script>
import Verify from '@/components/Verify/Verify'
import { validMobile } from '@/utils/validate'
import { getSmsCodeApi, checkSmsCodeApi } from '@/api/00_platform/sms/smscode'
import { signUpApi } from '@/api/00_platform/signup/signup'
import { isNotEmpty } from '@/utils/index.js'

// import SocialSign from './components/SocialSignin'

export default {
  name: 'Login',
  components: { Verify },
  data () {
    const validateMobile = (rule, value, callback) => {
      if (!validMobile(value)) {
        callback(new Error('请输入正确的手机号码'))
      } else {
        callback()
      }
    }
    const validatePassword2 = (rule, value, callback) => {
      if (!isNotEmpty(value)) {
        callback(new Error('请输入密码'))
      } else {
        if (value !== this.signupForm.password) {
          callback(new Error('您输入的确认密码不一致，请确认后再次输入！'))
        } else {
          callback()
        }
      }
    }
    return {
      msTime: { // 倒计时数值
        show: false,		// 倒计时状态
        count: 120 // 倒计时
      },
      signupForm: {
        mobile: '',
        sms_code: '',
        password: '',
        password2: '',
        tenant: '',
        admin: ''
      },
      registRules: {},
      // 步骤设置部分
      stepsSetting: {
        active: 0, // 控制步骤
        stepNumber: 2, // 总步数
        // 步骤1的check内容
        rulesFirst: {
          mobile: [{ required: true, trigger: 'blur', validator: validateMobile }],
          sms_code: [{ required: true, message: '请输入验证码', trigger: 'change' }]
        },
        // 步骤2的check内容
        rulesSecond: {
          tenant: [{ required: true, message: '请输入租户名称', trigger: 'change' }],
          admin: [{ required: true, message: '请输入管理员名称', trigger: 'change' }],
          password: [{ required: true, message: '请输入密码', trigger: 'change' }],
          password2: [{ required: true, trigger: 'change', validator: validatePassword2 }]
        }
      },
      checkJson: {
        // 错误信息
        errorMsg: '',
        // 错误状态
        errorStatus: false
      },
      codeCount: 0,
      popoverShow: false,
      codeValidateFlg: false,
      codeImg: '',
      passwordType: 'password',
      capsTooltip: false,
      loading: false,
      showDialog: false,
      redirect: undefined,
      otherQuery: {},
      password_reset_href: process.env.VUE_APP_BASE_API + '/password_reset',
      signup_href: process.env.VUE_APP_BASE_API + '/signup',
      timeout: null,
      signUpOk_CountDown: 5,
      signUpOk_CountDown_timeout: null
    }
  },
  watch: {
    $route: {
      handler: function (route) {
        const query = route.query
        if (query) {
          this.redirect = query.redirect
          this.otherQuery = this.getOtherQuery(query)
        }
      },
      immediate: true
    },
    // 输入信息是否有变更监控，如果有变化则情况错误信息
    'signupForm': {
      handler (newVal, oldVal) {
        this.checkJson.errorMsg = ''
      },
      deep: true
    },
    // 错误信息
    'checkJson.errorMsg': {
      handler (newVal, oldVal) {
        if (newVal === undefined) {
          return
        }
        if (newVal.length === 0) {
          // 没有错误
          this.checkJson.errorStatus = false
        } else {
          // 有错误
          this.checkJson.errorStatus = true
        }
      }
    },
    // loading
    'loading': {
      handler (newVal, oldVal) {
        switch (newVal) {
          case true:
            this.showLoading('正在验证登录，请稍后...')
            break
          case false:
            this.closeLoading()
            break
        }
      }
    },
    'stepsSetting.active': {
      handler (newVal, oldVal) {
        switch (newVal) {
          case 0:
            this.registRules = this.stepsSetting.rulesFirst
            break
          case 1:
            this.registRules = this.stepsSetting.rulesSecond
            break
          case 2:
            this.handleReturnLogin()
            break
        }
      }
    }
  },
  created () {
    // window.addEventListener('storage', this.afterQRScan)
    this.initShow()
    this.stepsSetting.active = 0
  },
  mounted () {
    if (this.signupForm.mobile === '') {
      this.$refs.mobile.focus()
    }
  },
  destroyed () {
    // window.removeEventListener('storage', this.afterQRScan)
  },
  methods: {
    initShow () {
      // 步骤初始化
      // this.registRules = this.stepsSetting.rulesFirst
    },
    checkCapslock ({ shiftKey, key } = {}) {
      if (key && key.length === 1) {
        if (shiftKey && (key >= 'a' && key <= 'z') || !shiftKey && (key >= 'A' && key <= 'Z')) {
          this.capsTooltip = true
        } else {
          this.capsTooltip = false
        }
      }
      if (key === 'CapsLock' && this.capsTooltip === true) {
        this.capsTooltip = false
      }
    },
    showPwd () {
      if (this.passwordType === 'password') {
        this.passwordType = ''
      } else {
        this.passwordType = 'password'
      }
      this.$nextTick(() => {
        this.$refs.password.focus()
      })
    },
    getOtherQuery (query) {
      return Object.keys(query).reduce((acc, cur) => {
        if (cur !== 'redirect') {
          acc[cur] = query[cur]
        }
        return acc
      }, {})
    },
    handleClose () {
      this.checkJson.errorStatus = ''
    },
    handlePuzzleSuccess (val) {
      this.doPuzzleSuccess()
    },
    handlePuzzleError (val) {
      console.log('验证码错误')
    },
    doPuzzleSuccess () {
      // 隐藏
      this.popoverShow = false
      // 调用短信验证码
      getSmsCodeApi({ mobile: this.signupForm.mobile }).then(response => {
        this.codeCount = 0
        // 开始倒计时
        this.handleCountDown()
        this.codeValidateFlg = true
      }, (_error) => {

      })
    },
    handleShowPopover () {
      // 显示
      // this.popoverShow = false
      // 隐藏
      // this.popoverShow = true
      this.$refs['signupForm'].clearValidate()
      this.$refs['signupForm'].validate((valid) => {
        if (valid) {
          // 显示
          this.popoverShow = false
        } else {
          // 隐藏
          this.popoverShow = true
        }
      })
    },
    // 短信倒计时
    doCountDown (count) {
      this.msTime.count = this.msTime.count - 1
      if (this.msTime.count === 0) {
        this.msTime.show = false
        return
      } else {
        this.msTime.show = true
      }
      this.timeout = setTimeout(() => {
        this.doCountDown(this.msTime.count)
      }, 1000)
    },
    // 倒计时
    handleCountDown () {
      this.signupForm.sms_code = ''
      this.msTime.show = true
      this.msTime.count = 120
      clearTimeout(this.timeout)
      this.doCountDown(this.msTime.count)
    },
    // 手机号码变更
    handleChange () {
      this.codeValidateFlg = false
    },
    // 验证码重发
    handleRecode () {
      if (this.msTime.show) {
        return
      }
      if (this.codeCount > 1) {
        this.codeValidateFlg = false
        return
      }
      // 调用短信验证码
      getSmsCodeApi({ mobile: this.signupForm.mobile }).then(response => {
        this.codeCount = this.codeCount + 1
        // 开始倒计时
        this.handleCountDown()
        this.codeValidateFlg = true
      }, (_error) => {

      })
    },
    handleNext () {
      this.$refs['signupForm'].clearValidate()
      this.$refs['signupForm'].validate((valid, error) => {
        if (valid) {
          switch (this.stepsSetting.active) {
            case 0:
              this.doFirstNext()
              break
            case 1:
              this.doSecondNext()
              break
          }
        } else {
          // check有错误
          return false
        }
      })
    },
    doFirstNext () {
      // check没有错误
      if (this.stepsSetting.active === 0 && this.signupForm.sms_code === '') {
        this.$alert('请完成验证', '错误', {
          confirmButtonText: '关闭',
          type: 'error'
        }).then(() => {
        })
        return
      }
      // 调用短信验证码
      checkSmsCodeApi(this.signupForm).then(response => {
        if (this.stepsSetting.active === this.stepsSetting.stepNumber) {
          return
        }
        this.stepsSetting.active++
        this.$nextTick(() => {
          this.$refs['signupForm'].clearValidate()
        })
      }, (_error) => {

      })
    },
    doSecondNext () {
      signUpApi(this.signupForm).then(response => {
        if (this.stepsSetting.active === this.stepsSetting.stepNumber) {
          return
        }
        this.stepsSetting.active++
        this.$nextTick(() => {
          this.$refs['signupForm'].clearValidate()
        })
      }, (_error) => {

      })
    },
    handleReturnLogin () {
      this.signUpOk_CountDown = 5
      clearTimeout(this.signUpOk_CountDown_timeout)
      this.doReturnLoginCountDown(this.signUpOk_CountDown)
    },
    doReturnLoginCountDown (count) {
      this.signUpOk_CountDown = this.signUpOk_CountDown - 1
      if (this.signUpOk_CountDown === 0) {
        this.handleReturnLoginBtn()
        return
      }
      this.timeout = setTimeout(() => {
        this.doReturnLoginCountDown(this.msTime.count)
      }, 1000)
    },
    handleReturnLoginBtn () {
      this.$router.push('/login')
    }
  }
}
</script>

<style lang="scss">
$bg: #283443;
$light_gray: #fff;
$cursor: #fff;

@supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
  .login-container .el-input input {
    color: $cursor;
  }
}

.success_title {
  font-size: 25px;
  color: white;
}

.success_line1 {
  font-size: 16px;
  color: white;
}

.success_line2 {
  font-size: 13px;
  color: #9a9a9a;
}

.btn-register {
  margin-left: 0px !important;
  width: 100%;
  height: 54px;
  text-align: center;
  color: #fff;
  border: 0;
  font-size: 16px;
  cursor: pointer;
}

.el-step__head.is-finish {
  color: #67c23a;
  border-color: #67c23a;
}
.el-step__description.is-finish {
  color: #67c23a;
  border-color: #67c23a;
}
.el-step__title.is-finish {
  color: #67c23a;
}

.el-step__head.is-process {
  color: #c0c4cc;
  border-color: #c0c4cc;
}

.el-step__title.is-process {
  font-weight: normal;
  color: #c0c4cc;
  border-color: #c0c4cc;
}

.progress-bar {
  position: relative;
  width: 400px;
}

.header {
  height: 110px;
}

.header .logo {
  width: 160px;
  height: 50px;
  float: left;
  margin-top: 24px;
}

.header .logo-title {
  float: left;
  height: 34px;
  line-height: 34px;
  font-size: 24px;
  color: #fff;
  margin-top: 34px;
}

.header .have-account {
  font-size: 16px;
  float: right;
  margin-top: 44px;
  color: #999;
}

.header .have-account a {
  color: #ffffff;
}

.header .have-account a:hover {
  color: #fff;
  text-decoration: underline;
}

.clearfix {
  width: 990px;
  margin: 0 auto;
}

/* reset element-ui css */
.login-container {
  .el-input {
    display: inline-block;
    height: 47px;
    width: 85%;

    input {
      background: transparent;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      padding: 12px 5px 12px 15px;
      color: $light_gray;
      height: 47px;
      caret-color: $cursor;

      &:-webkit-autofill {
        box-shadow: 0 0 0px 1000px $bg inset !important;
        -webkit-text-fill-color: $cursor !important;
      }
    }
  }

  .el-form-item {
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    color: #454545;
  }
}
</style>

<style lang="scss" scoped>
$bg: #2d3a4b;
$dark_gray: #889aa4;
$light_gray: #eee;

.floatRight {
  float: right;
}

.form-item {
  position: relative;
  z-index: 0;
}

.form-item-getcode {
  background-color: $bg;
  height: 47px;
  text-align: center;
  font-size: 14px;
  color: #c0c4cc;
  cursor: pointer;
  z-index: 2;
  border: solid 1px rgba(255, 255, 255, 0.1);
}

.form-item-getcode:hover {
  border-color: #fff;
}

.login-container {
  min-height: 100%;
  width: 100%;
  background-color: $bg;
  overflow: hidden;

  .login-form {
    position: relative;
    width: 520px;
    max-width: 100%;
    padding: 50px 35px 0;
    margin: 0 auto;
    overflow: hidden;
  }

  .tips {
    font-size: 14px;
    color: #fff;
    margin-bottom: 10px;

    span {
      &:first-of-type {
        margin-right: 16px;
      }
    }
  }

  .code-container {
    padding: 0px 0px 0px 20px;
    color: $dark_gray;
    width: 100px;
    display: inline-block;
    border: solid 1px rgba(255, 255, 255, 0.1);
    border-top: none;
    border-bottom: none;
    border-left: none;
  }

  .mobile-container {
    padding: 0px 0px 0px 20px;
    color: $dark_gray;
    width: 100px;
    display: inline-block;
    border: solid 1px rgba(255, 255, 255, 0.1);
    border-top: none;
    border-bottom: none;
    border-left: none;
  }

  .input-width {
    width: 330px;
  }

  .code-width {
    width: 200px;
  }

  .code_button {
    width: 140px;
    height: 47px;
    background-color: #2d3a4b;
    font-size: 14px;
    color: #c0c4cc;
    border: solid 1px rgba(255, 255, 255, 0.1);
  }
  .code_button:hover {
    border-color: #fff;
  }

  .svg-container {
    padding: 6px 5px 6px 15px;
    color: $dark_gray;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
  }

  .title-container {
    position: relative;

    .title {
      font-size: 26px;
      color: $light_gray;
      margin: 0px auto 40px auto;
      text-align: center;
      font-weight: bold;
    }
  }

  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }

  .imageCode {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }

  .thirdparty-button {
    position: absolute;
    right: 0;
    bottom: 6px;
  }

  @media only screen and (max-width: 470px) {
    .thirdparty-button {
      display: none;
    }
  }
}
</style>
