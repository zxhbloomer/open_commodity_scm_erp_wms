<template>
  <div class="VideoBg">
    <video
      v-if="!env.indexOf('grainscm') !== -1"
      ref="video"
      autoplay
      playsinline
      loop
      :muted="true"
    >
      <source
        :src="source"
        :type="getMediaType(source)"
      >
    </video>

    <img v-if="env.indexOf('grainscm') !== -1" class="hd_bg" src="../../assets/images/hd_login_bg.jpg">
    <span v-if="env.indexOf('grainscm') !== -1" class="small-image-position">
      <img class="small-image" src="../../assets/images/hd_QR_code.png">
      <div>监管app</div>
    </span>
    <span v-if="env.indexOf('shyiyuanth') !== -1" class="small-image-position">
      <img class="small-image" src="../../assets/images/zl_QR_code.png">
      <div>监管app</div>
    </span>

    <el-container
      style="min-height: 100%; "
      class="login-container-background"
    >
      <el-aside
        style="width: 15%; min-height: 100%;"
        class="login-container-background"
      />
      <el-container class="login-container-background">
        <el-header />
        <el-main>
          <div class="login-container">
            <el-form
              ref="loginForm"
              :model="loginForm"
              :rules="loginRules"
              autocomplete="on"
              label-position="left"
            >
              <div class="login-form">
                <div class="title-container">
                  <h3 class="title">登&#8195;&#8195;录</h3>
                </div>
                <el-form-item v-show="checkJson.errorStatus">
                  <el-alert
                    :title="checkJson.errorMsg"
                    type="error"
                    show-icon
                    close-text="知道了"
                    @close="handleClose"
                  />
                </el-form-item>

                <!-- <el-form-item prop="dnnode">
        <span class="svg-container">
          <svg-icon icon-class="user" />
        </span>
        <el-input
          ref="dnnode"
          v-model="loginForm.dnnode"
          placeholder="数据库"
          name="dnnode"
          type="text"
          tabindex="1"
          autocomplete="on"
          @change="setdncode"
        />
      </el-form-item> -->

                <el-form-item prop="username">
                  <span class="svg-container">
                    <svg-icon icon-class="user" />
                  </span>
                  <el-input
                    ref="username"
                    v-model="loginForm.username"
                    placeholder="用户名"
                    name="username"
                    type="text"
                    tabindex="1"
                    autocomplete="on"
                    @change="setdncode"
                  />
                </el-form-item>

                <el-tooltip
                  v-model="capsTooltip"
                  content="Caps lock is On"
                  placement="right"
                  manual
                >
                  <el-form-item prop="password">
                    <span class="svg-container">
                      <svg-icon icon-class="password" />
                    </span>
                    <el-input
                      :key="passwordType"
                      ref="password"
                      v-model="loginForm.password"
                      :type="passwordType"
                      placeholder="密码"
                      name="password"
                      tabindex="2"
                      autocomplete="new-password"
                      @keyup.native="checkCapslock"
                      @blur="capsTooltip = false"
                      @keyup.enter.native="handleLogin"
                    />
                    <span
                      class="show-pwd"
                      @click="showPwd"
                    >
                      <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'" />
                    </span>
                  </el-form-item>
                </el-tooltip>
                <el-form-item prop="imageCode">
                  <span class="svg-container">
                    <svg-icon icon-class="验证码" />
                  </span>
                  <el-input
                    ref="imageCode"
                    v-model="loginForm.imageCode"
                    placeholder="验证码"
                    name="imageCode"
                    type="text"
                    tabindex="3"
                    @keyup.enter.native="handleLogin"
                  />
                  <span class="imageCode">
                    <img
                      :src="codeImg"
                      class="floatRight"
                      alt="验证码"
                      title="点击换一张"
                      @click="updateCode"
                    >
                  </span>
                </el-form-item>

                <el-button
                  :loading="loading"
                  type="primary"
                  style="width:100%;margin-bottom:30px;"
                  @click.native.prevent="handleLogin"
                >登录</el-button>
                <el-divider class="el-form-item" />

                <!-- <p class="create-account-callout mt-3">
        <el-link>
          <router-link :to="password_reset_href">忘记密码</router-link>
        </el-link>
        <el-link class="floatRight">
          <router-link :to="signup_href">免费注册</router-link>
        </el-link>
      </p> -->
              </div>
            </el-form>
          </div>
        </el-main>
        <el-footer />
      </el-container>
      <el-aside
        style="width: 15%; min-height: 100%;"
        class="login-container-background"
      />
    </el-container>
  </div>
</template>

<script>
import { validUsername } from '@/utils/validate'
// import SocialSign from './components/SocialSignin'

export default {
  name: 'Login',
  // components: { SocialSign },
  data () {
    const validateUsername = (rule, value, callback) => {
      if (!validUsername(value)) {
        callback(new Error('请输入正确的用户名'))
      } else {
        callback()
      }
    }
    const validatePassword = (rule, value, callback) => {
      if (value.length < 6) {
        callback(new Error('密码长度不能小于6位'))
      } else {
        callback()
      }
    }
    return {
      videoRatio: null,
      source: require('@/assets/video/bg_video_steel.webm'),
      loginForm: {
        username: '',
        password: '',
        imageCode: '',
        dnnode: ''
      },
      loginRules: {
        // dnnode: [{ required: true, message: '请输入数据库', trigger: 'change' }],
        username: [{ required: true, trigger: 'blur', validator: validateUsername }],
        password: [{ required: true, trigger: 'blur', validator: validatePassword }],
        imageCode: [{ required: true, message: '请输入验证码', trigger: 'change' }]
      },
      checkJson: {
        // 错误信息
        errorMsg: '',
        // 错误状态
        errorStatus: false
      },
      codeImg: '',
      passwordType: 'password',
      capsTooltip: false,
      loading: false,
      showDialog: false,
      redirect: undefined,
      otherQuery: {},
      password_reset_href: '/password_reset',
      signup_href: '/signup'
    }
  },
  computed: {
    // 判断是否是中林环境
    env () {
      return window.location.href
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
    'loginForm': {
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
    }
  },
  created () {
    // window.addEventListener('storage', this.afterQRScan)
    // 获取验证码
    this.getImageCode()
  },
  mounted () {
    if (this.loginForm.username === '') {
      this.$refs.username.focus()
    } else if (this.loginForm.password === '') {
      this.$refs.password.focus()
    }
    // 视频配置
    this.setImageUrl()
    this.setContainerHeight()

    if (this.videoCanPlay()) {
      this.$refs.video.oncanplay = () => {
        if (!this.$refs.video) return

        this.videoRatio = this.$refs.video.videoWidth / this.$refs.video.videoHeight
        this.setVideoSize()
        this.$refs.video.style.visibility = 'visible'
      }
    }

    window.addEventListener('resize', this.resize)
  },
  beforeDestroy () {
    window.removeEventListener('resize', this.resize)
  },
  destroyed () {
    // window.removeEventListener('storage', this.afterQRScan)
  },
  methods: {
    // 获取验证码
    getImageCode () {
      this.codeImg = `${process.env.VUE_APP_BASE_API}/api/v1/imagecode?=${Math.random()}`
    },
    setdncode () {
      // this.$store.dispatch('user/setdnnode', this.loginForm)
      //   .then((data) => {

      //   })
      //   .catch((data) => {

      //   })
      //   .finally(() => {
      //     this.loading = false
      //   })
    },
    updateCode () {
      // 获取验证码
      this.getImageCode()
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
    handleLogin () {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true
          this.$store.dispatch('user/loginAction', this.loginForm)
            .then((data) => {
              this.$router.push({ path: this.redirect || '/', query: this.otherQuery })
            })
            .catch((data) => {
              // 获取验证码
              this.getImageCode()
              this.loginForm.imageCode = ''
              this.loading = false
              this.$nextTick(() => {
                this.checkJson.errorMsg = data.message
              })
            })
            .finally(() => {
              this.loading = false
            })
        } else {
          console.log('error submit!!')
          return false
        }
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
    handleSignUp () {
    },
    resize () {
      this.setContainerHeight()

      if (this.videoCanPlay()) {
        this.setVideoSize()
      }
    },

    videoCanPlay () {
      return !!this.$refs.video.canPlayType
    },

    setImageUrl () {
      if (this.img) {
        this.$el.style.backgroundImage = `url(${this.img})`
      }
    },

    setContainerHeight () {
      this.$el.style.height = `${window.innerHeight}px`
    },

    setVideoSize () {
      var width; var height; var containerRatio = this.$el.offsetWidth / this.$el.offsetHeight

      if (containerRatio > this.videoRatio) {
        width = this.$el.offsetWidth
      } else {
        height = this.$el.offsetHeight
      }

      this.$refs.video.style.width = width ? `${width}px` : 'auto'
      this.$refs.video.style.height = height ? `${height}px` : 'auto'
    },

    getMediaType (src) {
      return 'video/' + src.split('.').pop()
    }
  }
}
</script>

<style>
/* [] 是属性选择器 */
/* 把所有带有v-cloak属性的元素样式隐藏 */
[v-cloak] {
  display: none;
}
.hd_bg {
    position: fixed;
    width: 100%;
    height: 100%;
}
</style>

<style lang="scss" scoped>
$bg: #334056;
$light_gray: #fff;
$cursor: #fff;

// .login-container {
//   /deep/ .el-input {
//     display: inline-block;
//     height: 47px;
//     width: 85%;

//     input {
//       background: transparent;
//       border: 0px;
//       -webkit-appearance: none;
//       border-radius: 0px;
//       padding: 12px 5px 12px 15px;
//       height: 47px;
//     }
//   }

//   .el-form-item {
//     border: 1px solid rgba(255, 255, 255, 0.1);
//     background: rgba(0, 0, 0, 0.1);
//     border-radius: 5px;
//     // color: #454545;
//   }
// }

.login-container-background {
  margin-bottom: 0px;
  background: #989ea747;
}
.login-container::v-deep .el-input {
  display: inline-block;
  height: 47px;
  width: 85%;
}

.login-container::v-deep .el-input__inner {
  background: transparent;
  border: 0px;
  -webkit-appearance: none;
  border-radius: 0px;
  padding: 12px 5px 12px 15px;
  height: 47px;

  -webkit-text-fill-color: #ffffff !important; /*记住密码的字的颜色*/
  transition: background-color 5000s ease-in-out 0s; /*延时渲染背景色来去除背景色*/
  caret-color: #acfff2; /*光标颜色*/
}

.login-container::v-deep .el-form-item {
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(0, 0, 0, 0.1);
  border-radius: 5px;
  // color: #454545;
}

.VideoBg {
  position: relative;
  background-size: cover;
  background-position: center;
  overflow: hidden;
}

.VideoBg video {
  position: absolute;
  top: 50%;
  left: 50%;
  visibility: hidden;
  transform: translate(-50%, -50%);
}

.floatRight {
  float: right;
}

$bg: #2d3a4b5e;
$dark_gray: #889aa4;
$light_gray: #eee;

.login-form {
  position: relative;
  width: 520px;
  max-width: 100%;
  padding: 20px;
  margin: 0 auto;
  overflow: hidden;
  background-color: #2d3a4b7d;
}
.login-form::after {
  -webkit-filter: blur(5px);
  -moz-filter: blur(5px);
  -ms-filter: blur(5px);
  -o-filter: blur(5px);
  filter: blur(5px);
}

.small-image-position .small-image {
  width: 100px;
  height: 100px;
}

.small-image-position {
  position: absolute;
  bottom: 7%;  /* 小图片相对于容器顶部的位置 */
  left: 4%; /* 小图片相对于容器左侧的位置 */
  z-index: 999; /* 如果需要，可以使用 z-index 调整小图片的层级 */
}

.small-image-position div {
  color: white;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
  margin-left: 19%;
}

.login-container {
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
