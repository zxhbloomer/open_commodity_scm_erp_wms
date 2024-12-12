<template>
  <!--  <div class="">-->
  <!--    <h1>欢迎来到wms</h1>-->
  <!--    <h2>你将在<span style="color:red">{{ time }}</span>秒后进入系统</h2>-->
  <!--  </div>-->

  <div v-cloak class="sk-cube-grid">
    <div class="sk-cube sk-cube1" />
    <div class="sk-cube sk-cube2" />
    <div class="sk-cube sk-cube3" />
    <div class="sk-cube sk-cube4" />
    <div class="sk-cube sk-cube5" />
    <div class="sk-cube sk-cube6" />
    <div class="sk-cube sk-cube7" />
    <div class="sk-cube sk-cube8" />
    <div class="sk-cube sk-cube9" />
  </div>
</template>

<script>
// import { validUsername } from '@/utils/validate'
// import SocialSign from './components/SocialSignin'

import urlUtil from '@/utils/urlUtil'

export default {
  name: 'Link',
  // components: { SocialSign },
  data () {
    return {
      time: 5,
      des_page: '/',
      username: '',
      host: '',
      protocol: 'http://'
    }
  },
  computed: {

  },
  watch: {
    'time': function (newVal, oldVal) {
      if (newVal === 0) {
        // this.$router.push({ path: this.des_page, query: {}})
        console.log('+++++++++++++++' + this.protocol + this.host + '/#' + this.des_page)
        // location.href = this.protocol + '//' + this.host + '/#' + this.des_page
      }
    }
  },
  created () {
    this.username = urlUtil.getHashQueryVariable(window.location.href, 'u')
    this.des_page = decodeURIComponent(urlUtil.getHashQueryVariable(window.location.href, 'callback'))
    this.host = window.location.host
    this.protocol = window.location.protocol
    const loginParams = { 'username': this.username }
    this.$store.dispatch('user/ssoLoginAction', loginParams)
      .then((data) => {
        // this.$router.push({ path: '/', query: {}})
        // const _this = this
        // _this.time = 5
        // setInterval(_this.countDown, 1000)
        location.href = this.protocol + '//' + this.host + '/#' + this.des_page
      })
      .catch((data) => {

      })
      .finally(() => {
        this.loading = false
      })
  },
  mounted () {

  },
  beforeDestroy () {
  },
  destroyed () {
    // window.removeEventListener('storage', this.afterQRScan)
  },
  methods: {
    countDown () {
      const _this = this
      if (_this.time > 0) {
        _this.time--
      }
    }
  }
}
</script>

<style media="screen" type="text/css">
.bgcolor {
  background-color: #3c8dbc;
  height: auto!important;
}

.sk-cube-grid {
  width: 40px;
  height: 40px;
  margin: 100px auto;
}

.sk-cube-grid .sk-cube {
  width: 33%;
  height: 33%;
  background-color: #fff;
  float: left;
  -webkit-animation: sk-cubeGridScaleDelay 1.3s infinite ease-in-out;
  animation: sk-cubeGridScaleDelay 1.3s infinite ease-in-out;
}

.sk-cube-grid .sk-cube1 {
  -webkit-animation-delay: 0.2s;
  animation-delay: 0.2s;
}

.sk-cube-grid .sk-cube2 {
  -webkit-animation-delay: 0.3s;
  animation-delay: 0.3s;
}

.sk-cube-grid .sk-cube3 {
  -webkit-animation-delay: 0.4s;
  animation-delay: 0.4s;
}

.sk-cube-grid .sk-cube4 {
  -webkit-animation-delay: 0.1s;
  animation-delay: 0.1s;
}

.sk-cube-grid .sk-cube5 {
  -webkit-animation-delay: 0.2s;
  animation-delay: 0.2s;
}

.sk-cube-grid .sk-cube6 {
  -webkit-animation-delay: 0.3s;
  animation-delay: 0.3s;
}

.sk-cube-grid .sk-cube7 {
  -webkit-animation-delay: 0s;
  animation-delay: 0s;
}

.sk-cube-grid .sk-cube8 {
  -webkit-animation-delay: 0.1s;
  animation-delay: 0.1s;
}

.sk-cube-grid .sk-cube9 {
  -webkit-animation-delay: 0.2s;
  animation-delay: 0.2s;
}

@-webkit-keyframes sk-cubeGridScaleDelay {

  0%,
  70%,
  100% {
    -webkit-transform: scale3D(1, 1, 1);
    transform: scale3D(1, 1, 1);
  }

  35% {
    -webkit-transform: scale3D(0, 0, 1);
    transform: scale3D(0, 0, 1);
  }
}

@keyframes sk-cubeGridScaleDelay {

  0%,
  70%,
  100% {
    -webkit-transform: scale3D(1, 1, 1);
    transform: scale3D(1, 1, 1);
  }

  35% {
    -webkit-transform: scale3D(0, 0, 1);
    transform: scale3D(0, 0, 1);
  }
}
</style>
