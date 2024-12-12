<template>
  <div class="header-notice">
    <el-badge
      :value="alarmCount"
      :max="99"
      class="item"
    >
      <div>
        <svg-icon
          v-popover:popover
          class-name="header-notice-icon"
          icon-class="bell"
          @click.stop="click"
        />
      </div>

      <el-popover
        ref="popover"
        placement="bottom"
        width="700"
      >
        <div>
          <span class="message-title">
            消息中心
          </span>
          <div style="float:right">
            <span class="notifications">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 16 16"
              >
                <path d="M8 6.5A1.5 1.5 0 1 0 9.5 8 1.5 1.5 0 0 0 8 6.5zm5 0A1.5 1.5 0 1 0 14.47 8 1.5 1.5 0 0 0 13 6.5zm-10 0A1.5 1.5 0 1 0 4.53 8 1.5 1.5 0 0 0 3 6.5z" />
              </svg>
            </span>
          </div>
          <el-tabs
            ref="inTabs"
            v-model="tabs.active"
            @tab-click="handleTabsClick(tabs.active)"
          >
            <el-tab-pane name="0">
              <template slot="label">待办</template>
            </el-tab-pane>
            <el-tab-pane name="1">
              <template slot="label">通知</template>
            </el-tab-pane>
            <el-tab-pane name="2">
              <template slot="label">
                <el-badge
                  :value="alarmCount"
                  class="item"
                >
                  预警
                </el-badge>
              </template>
            </el-tab-pane>
          </el-tabs>
          <AlarmHeader
            v-if="tabs.showAlarm"
            ref="sync"
            @closeTable="handleHeaderCloseTable"
          />
          <Pcnotice v-if="tabs.showNotice" />

        </div>
      </el-popover>
    </el-badge>
    <SyncPopup
      v-if="tabs.showAlarmPopup"
      title="预警"
      :show-alarm="tabs.showAlarmPopup"
      @closeTable="handleCloseTable"
    />
    <ResetPwdDialog
      v-if="tabs.showResetPwd"
      :show-dialog="tabs.showResetPwd"
      title="修改密码"
    />
  </div>
</template>

<style lang="scss" scoped>
.message-title {
  font-size: 18px;
  font-weight: bold;
}
.notifications {
  color: #b8d1e5;
  cursor: pointer;
}
</style>

<script>
import SockJS from 'sockjs-client'
import Stomp from 'stompjs'
import store from '@/store'
import AlarmHeader from '@/views/10_system/websocketnotice/header/alarmHeader'
import SyncPopup from '@/views/10_system/websocketnotice/dialog/alarmDialog'
import ResetPwdDialog from '@/views/10_system/websocketnotice/dialog/resetPwdDialog.vue'
import { getUserPwdWarningApi } from '@/api/user'
import { mapState } from 'vuex'
import Pcnotice from '@/views/10_system/pcnotice/dialog/header.vue'
// import { getCountApiApi } from '@/api/10_system/log/headerNotice'

const headers = {}

export default {
  components: { AlarmHeader, SyncPopup, Pcnotice, ResetPwdDialog },
  data () {
    return {
      socketUrl: process.env.VUE_APP_WEBSOCKET_NOTICE, // ws://localhost:8080/websocket/ws
      reconnecting: false,
      socket: null,
      stompClient: null,
      tabs: {
        active: '0',
        // 显示预警
        showAlarm: false,
        showAlarmPopup: false,
        showNotice: false, // 通知
        showResetPwd: false // 密码过期
      },
      dataJson: {
        // 消息总数
        count_all: 0,
        // 同步失败数量
        syncCount: 0
      }
    }
  },
  computed: {
    ...mapState('headNotice', ['alarmCount'])
  },
  created () {
    // 设置默认打开页面
    // const active = window.localStorage.getItem('WMS_HEADER_NOTICE_DEFAULT_PAGE')
    // if (active !== null && active !== undefined) {
    this.tabs.active = '2'
    this.handleTabsClick('2')
    // }
    // 查询数量
    // this.getNoticeNumber()
  },
  mounted () {
    this.getUserPwdWarning()
    this.initWebsocket()
  },
  beforeDestroy () {
    this.closeSocket()
  },
  methods: {
    click () {
      this.$refs.sync.handleParentReturn()
    },
    initWebsocket () {
      /*
      ① 创建sockJS对象；
      ② 创建stomp客户端
      ③ stompClient客户端 连接 stomp服务器
      */
      this.socket = new SockJS(this.socketUrl)
      // const ws = new WebSocket('ws://localhost:8088/notice')
      this.stompClient = Stomp.over(this.socket)

      this.stompClient.connect(
        headers,
        frame => {
          // 连接成功： 订阅服务器的地址。为了浏览器可以接收到消息，必须先订阅服务器的地址
          this.connectSucceed()
        }, err => {
          console.log(err)
          // 连接失败的回调
          this.reconnect(this.socketUrl, this.connectSucceed)
        })
    },
    /* 连接成功的回调：订阅服务器的地址。为了浏览器可以接收到消息，必须先订阅服务器的地址 */
    connectSucceed () {
      // 设置心跳发送接受频率（ms）默认为10000ms。 heart-beating是利用window.setInterval()去规律地发送heart-beats或者检查服务端的heart-beats。
      this.stompClient.heartbeat.outgoing = 10000
      this.stompClient.heartbeat.incoming = 0 // 客户端不从服务端接收心跳包

      // 订阅：1、该路由专门用于心跳检测
      this.stompClient.subscribe('/topic/beating', res => {
        console.log('ping!' + res)
      })

      // 订阅：1、同步错误通知
      // this.stompClient.subscribe('/topic/syncLog', res => {
      //   if (res.body) {
      //     this.tabs.showAlarm = true
      //     this.tabs.active = '1'
      //     window.localStorage.setItem('WMS_HEADER_NOTICE_DEFAULT_PAGE', this.tabs.active)
      //     // 弹窗
      //     // this.$syncError.show()
      //     // 点击显示
      //     this.$refs.popover.doShow()
      //     // 重新查询数量
      //     this.getNoticeNumber()
      //     this.$refs.sync.getDataList(true)
      //   }
      // })

      // 订阅：2、广播
      // this.stompClient.subscribe('/topic/broadcast/message', res => {
      //   // debugger
      //   // alert('订阅：2、广播--/topic/broadcast/message')
      // })
      // 订阅：3、一对一通知
      // this.stompClient.subscribe('/user/subscribe/message', res => {
      //   debugger
      //   alert('订阅：3、一对一通知--/user/message')
      // })
      this.stompClient.subscribe('/user/' + store.getters.staff_id + '/topic/syncLog', res => {
        console.log('/topic/syncLog!' + res)
        const data = JSON.parse(res.body)
        if (data.is_using) {
          if (data.notice_type === '1') {
            this.tabs.showAlarmPopup = true
          } else if (data.notice_type === '0') {
            this.tabs.showAlarm = true
            // 点击显示
            this.$refs.popover.doShow()
            this.$refs.sync.handleParentReturn()
            this.tabs.active = '2'
            window.localStorage.setItem('WMS_HEADER_NOTICE_DEFAULT_PAGE', this.tabs.active)
          } else if (data.notice_type === '2') {
            this.tabs.showResetPwd = true
          }
          // 重新查询数量
          // this.getNoticeNumber()
          // this.$refs.sync.getDataList(true)
        }
      })
    },
    reconnect (socketUrl, callback) {
      this.reconnecting = true
      let connected = false
      let retryCount = 0 // 添加计数器
      const maxRetry = 3 // 最大重试次数

      const timer = setInterval(() => {
        retryCount++ // 重试次数加1
        if (retryCount >= maxRetry) {
          clearInterval(timer)
          console.log('websocket达到重试上限制3次，退出')
          return
        }
        this.socket = new SockJS(socketUrl)
        this.stompClient = Stomp.over(this.socket)
        var _transportClose = this.socket._transportClose
        this.socket._transportClose = function (code, reason) {
          if (this._transport && this._transport.close) {
            this._transport.close()
          }
          _transportClose.call(this, code, reason)
        }
        this.stompClient.connect(headers, frame => {
          this.reconnectting = false
          connected = true
          clearInterval(timer)
          callback()
        }, err => {
          console.log('Reconnect failed！')
          if (!connected) console.log(err)
          console.log('retryCount:' + retryCount)
        })
      }, 10000)
    },
    closeSocket () {
      if (this.stompClient != null) {
        this.stompClient.disconnect()
      }
    },
    send (flag) {
      this.stompCLient.send('/topic/dashboard/send', {}, flag)
    },
    // 切换页签
    handleTabsClick (name, event) {
      switch (name) {
        case '0':
          this.tabs.showAlarm = false
          this.tabs.showNotice = false
          break
        case '1':
          this.tabs.showAlarm = false
          this.tabs.showNotice = true
          break
        case '2':
          this.tabs.showAlarm = true
          this.tabs.showNotice = false
          break
      }
      // 将选择的index存储在localstorage
      window.localStorage.setItem('WMS_HEADER_NOTICE_DEFAULT_PAGE', this.tabs.active)
    },
    // 关闭弹窗
    handleCloseTable () {
      this.$refs.popover.doClose()
      this.tabs.showAlarmPopup = false
    },
    // 关闭提醒
    handleHeaderCloseTable () {
      this.$refs.popover.doClose()
      // this.tabs.showAlarm = false
    },
    // 查询信息中心全部消息数量
    // getNoticeNumber () {
    //   getCountApiApi().then(response => {
    //     const data = response.data
    //     this.dataJson.syncCount = data.syncCount
    //     this.dataJson.count_all = data.syncCount
    //   }).finally(() => {
    //   })
    // }
    // 密码是否过期
    getUserPwdWarning () {
      getUserPwdWarningApi().then(response => {
        if (response.data.pwd_expired === true) {
          this.tabs.showResetPwd = true
        }
      }).finally(() => {
      })
    }
  }
}
</script>
<style scoped>
::v-deep .el-badge__content.is-fixed {
  top: 10px;
}
::v-deep .el-badge__content {
  border: 0px;
}
</style>
<style lang="scss" scoped>
.header-notice {
  font-size: 0 !important;

  .header-notice-icon {
    cursor: pointer;
    font-size: 18px;
    vertical-align: middle;
  }

  .header-notice-select {
    width: 600px;
    opacity: 1;

    font-size: 18px;
    transition: width 0.2s;
    width: 0;
    overflow: hidden;
    background: transparent;
    border-radius: 0;
    display: inline-block;
    vertical-align: middle;

    ::v-deep .el-input__inner {
      border-radius: 0;
      border: 0;
      padding-left: 0;
      padding-right: 0;
      box-shadow: none !important;
      border-bottom: 1px solid #d9d9d9;
      vertical-align: middle;
    }
  }

  &.show {
    .header-notice-select {
      width: 210px;
      // margin-left: 10px;
      pointer-events: auto;
      opacity: 1;
      position: absolute;
    }
  }
}
</style>
