<template>
  <div class="app-container">
    <el-tabs>
      <!-- <el-tab-pane>
        <template slot="label">系统图标集合
          <el-badge v-show="settings.badge.countOne>0" ref="minusTabOne" :value="settings.badge.countOne" type="danger" />
        </template>
        <section class="content element-doc content" :style="dataJson.tabHeightStyle" style="overflow-y:auto;overflow-x:hidden;">
          <ul class="icon-list">
            <li v-for="(item) in dataJson.vueIcons" :key="item" @dblclick="setIcon(item)">
              <span>
                <i :class="item" />
                <span class="icon-name">{{ item }}</span>
              </span>
            </li>
          </ul>
        </section>
      </el-tab-pane> -->
      <el-tab-pane>
        <template slot="label">图标集合
          <el-badge
            v-show="settings.badge.countTwo>0"
            ref="minusTabTwo"
            :value="settings.badge.countTwo"
            type="danger"
          />
        </template>
        <section
          class="content element-doc content"
          :style="dataJson.tabHeightStyle"
          style="overflow-y:auto;overflow-x:hidden;"
        >
          <ul class="icon-list">
            <li
              v-for="(item) in dataJson.svgs"
              :key="item"
              @dblclick="setIcon(item)"
            >
              <span>
                <i>
                  <svg-icon :icon-class="item" />
                </i>
                <span class="icon-name">{{ item }}</span>
              </span>
            </li>
          </ul>
        </section>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<style scoped>
.content > ul:not(.timeline) {
  margin: 10px 0;
  padding: 0 0 0 20px;
  font-size: 14px;
  color: #5e6d82;
  line-height: 2em;
}
.content > ul.icon-list {
  overflow: hidden;
  list-style: none;
  padding: 0 !important;
  border: 1px solid #eaeefb;
  border-radius: 4px;
}
[class*=' icon-'],
[class^='icon-'] {
  font-family: icomoon !important;
  speak: none;
  font-style: normal;
  font-weight: 400;
  font-variant: normal;
  text-transform: none;
  line-height: 1;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
.icon-list li {
  float: left;
  width: 16.66%;
  text-align: center;
  height: 120px;
  line-height: 120px;
  color: #666;
  font-size: 13px;
  border-right: 1px solid #eee;
  border-bottom: 1px solid #eee;
  margin-right: -1px;
  margin-bottom: -1px;
}
.icon-list li span {
  line-height: normal;
  font-family: Helvetica Neue, Helvetica, PingFang SC, Hiragino Sans GB,
    Microsoft YaHei, SimSun, sans-serif;
  color: #99a9bf;
  transition: color 0.15s linear;
}

.icon-list li:after,
.icon-list li span {
  display: inline-block;
  vertical-align: middle;
}
.icon-list li i {
  display: block;
  font-size: 32px;
  margin-bottom: 15px;
  color: #606266;
  transition: color 0.15s linear;
}
.icon-list li .icon-name {
  display: inline-block;
  padding: 0 3px;
  height: 1em;
}
.icon-list li span {
  line-height: normal;
  font-family: Helvetica Neue, Helvetica, PingFang SC, Hiragino Sans GB,
    Microsoft YaHei, SimSun, sans-serif;
  color: #99a9bf;
  transition: color 0.15s linear;
}
.icon-list li:hover i,
.icon-list li:hover span {
  color: #5cb6ff;
}
.el-backtop {
  background-color: #1890ff;
  color: #ffffff;
}
</style>

<script>
import resizeMixin from './iconResizeHandlerMixin'

export default {
  components: {},
  directives: {},
  mixins: [resizeMixin],
  props: {
    // 自己作为弹出框时的参数
    meDialogStatus: {
      type: Boolean,
      default: false
    },
    dataModel: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      dataJson: {
        tabHeightStyle: '',
        svgs: [],
        vueIcons: [
          'el-icon-platform-eleme',
          'el-icon-eleme',
          'el-icon-delete-solid',
          'el-icon-delete',
          'el-icon-s-tools',
          'el-icon-setting',
          'el-icon-user-solid',
          'el-icon-user',
          'el-icon-phone',
          'el-icon-phone-outline',
          'el-icon-more',
          'el-icon-more-outline',
          'el-icon-star-on',
          'el-icon-star-off',
          'el-icon-s-goods',
          'el-icon-goods',
          'el-icon-warning',
          'el-icon-warning-outline',
          'el-icon-question',
          'el-icon-info',
          'el-icon-remove',
          'el-icon-circle-plus',
          'el-icon-success',
          'el-icon-error',
          'el-icon-zoom-in',
          'el-icon-zoom-out',
          'el-icon-remove-outline',
          'el-icon-circle-plus-outline',
          'el-icon-circle-check',
          'el-icon-circle-close',
          'el-icon-s-help',
          'el-icon-help',
          'el-icon-minus',
          'el-icon-plus',
          'el-icon-check',
          'el-icon-close',
          'el-icon-picture',
          'el-icon-picture-outline',
          'el-icon-picture-outline-round',
          'el-icon-upload',
          'el-icon-upload2',
          'el-icon-download',
          'el-icon-camera-solid',
          'el-icon-camera',
          'el-icon-video-camera-solid',
          'el-icon-video-camera',
          'el-icon-message-solid',
          'el-icon-bell',
          'el-icon-s-cooperation',
          'el-icon-s-order',
          'el-icon-s-platform',
          'el-icon-s-fold',
          'el-icon-s-unfold',
          'el-icon-s-operation',
          'el-icon-s-promotion',
          'el-icon-s-home',
          'el-icon-s-release',
          'el-icon-s-ticket',
          'el-icon-s-management',
          'el-icon-s-open',
          'el-icon-s-shop',
          'el-icon-s-marketing',
          'el-icon-s-flag',
          'el-icon-s-comment',
          'el-icon-s-finance',
          'el-icon-s-claim',
          'el-icon-s-custom',
          'el-icon-s-opportunity',
          'el-icon-s-data',
          'el-icon-s-check',
          'el-icon-s-grid',
          'el-icon-menu',
          'el-icon-share',
          'el-icon-d-caret',
          'el-icon-caret-left',
          'el-icon-caret-right',
          'el-icon-caret-bottom',
          'el-icon-caret-top',
          'el-icon-bottom-left',
          'el-icon-bottom-right',
          'el-icon-back',
          'el-icon-right',
          'el-icon-bottom',
          'el-icon-top',
          'el-icon-top-left',
          'el-icon-top-right',
          'el-icon-arrow-left',
          'el-icon-arrow-right',
          'el-icon-arrow-down',
          'el-icon-arrow-up',
          'el-icon-d-arrow-left',
          'el-icon-d-arrow-right',
          'el-icon-video-pause',
          'el-icon-video-play',
          'el-icon-refresh',
          'el-icon-refresh-right',
          'el-icon-refresh-left',
          'el-icon-finished',
          'el-icon-sort',
          'el-icon-sort-up',
          'el-icon-sort-down',
          'el-icon-rank',
          'el-icon-loading',
          'el-icon-view',
          'el-icon-c-scale-to-original',
          'el-icon-date',
          'el-icon-edit',
          'el-icon-edit-outline',
          'el-icon-folder',
          'el-icon-folder-opened',
          'el-icon-folder-add',
          'el-icon-folder-remove',
          'el-icon-folder-delete',
          'el-icon-folder-checked',
          'el-icon-tickets',
          'el-icon-document-remove',
          'el-icon-document-delete',
          'el-icon-document-copy',
          'el-icon-document-checked',
          'el-icon-document',
          'el-icon-document-add',
          'el-icon-printer',
          'el-icon-paperclip',
          'el-icon-takeaway-box',
          'el-icon-search',
          'el-icon-monitor',
          'el-icon-attract',
          'el-icon-mobile',
          'el-icon-scissors',
          'el-icon-umbrella',
          'el-icon-headset',
          'el-icon-brush',
          'el-icon-mouse',
          'el-icon-coordinate',
          'el-icon-magic-stick',
          'el-icon-reading',
          'el-icon-data-line',
          'el-icon-data-board',
          'el-icon-pie-chart',
          'el-icon-data-analysis',
          'el-icon-collection-tag',
          'el-icon-film',
          'el-icon-suitcase',
          'el-icon-suitcase-1',
          'el-icon-receiving',
          'el-icon-collection',
          'el-icon-files',
          'el-icon-notebook-1',
          'el-icon-notebook-2',
          'el-icon-toilet-paper',
          'el-icon-office-building',
          'el-icon-school',
          'el-icon-table-lamp',
          'el-icon-house',
          'el-icon-no-smoking',
          'el-icon-smoking',
          'el-icon-shopping-cart-full',
          'el-icon-shopping-cart-1',
          'el-icon-shopping-cart-2',
          'el-icon-shopping-bag-1',
          'el-icon-shopping-bag-2',
          'el-icon-sold-out',
          'el-icon-sell',
          'el-icon-present',
          'el-icon-box',
          'el-icon-bank-card',
          'el-icon-money',
          'el-icon-coin',
          'el-icon-wallet',
          'el-icon-discount',
          'el-icon-price-tag',
          'el-icon-news',
          'el-icon-guide',
          'el-icon-male',
          'el-icon-female',
          'el-icon-thumb',
          'el-icon-cpu',
          'el-icon-link',
          'el-icon-connection',
          'el-icon-open',
          'el-icon-turn-off',
          'el-icon-set-up',
          'el-icon-chat-round',
          'el-icon-chat-line-round',
          'el-icon-chat-square',
          'el-icon-chat-dot-round',
          'el-icon-chat-dot-square',
          'el-icon-chat-line-square',
          'el-icon-message',
          'el-icon-postcard',
          'el-icon-position',
          'el-icon-turn-off-microphone',
          'el-icon-microphone',
          'el-icon-close-notification',
          'el-icon-bangzhu',
          'el-icon-time',
          'el-icon-odometer',
          'el-icon-crop',
          'el-icon-aim',
          'el-icon-switch-button',
          'el-icon-full-screen',
          'el-icon-copy-document',
          'el-icon-mic',
          'el-icon-stopwatch',
          'el-icon-medal-1',
          'el-icon-medal',
          'el-icon-trophy',
          'el-icon-trophy-1',
          'el-icon-first-aid-kit',
          'el-icon-discover',
          'el-icon-place',
          'el-icon-location',
          'el-icon-location-outline',
          'el-icon-location-information',
          'el-icon-add-location',
          'el-icon-delete-location',
          'el-icon-map-location',
          'el-icon-alarm-clock',
          'el-icon-timer',
          'el-icon-watch-1',
          'el-icon-watch',
          'el-icon-lock',
          'el-icon-unlock',
          'el-icon-key',
          'el-icon-service',
          'el-icon-mobile-phone',
          'el-icon-bicycle',
          'el-icon-truck',
          'el-icon-ship',
          'el-icon-basketball',
          'el-icon-football',
          'el-icon-soccer',
          'el-icon-baseball',
          'el-icon-wind-power',
          'el-icon-light-rain',
          'el-icon-lightning',
          'el-icon-heavy-rain',
          'el-icon-sunrise',
          'el-icon-sunrise-1',
          'el-icon-sunset',
          'el-icon-sunny',
          'el-icon-cloudy',
          'el-icon-partly-cloudy',
          'el-icon-cloudy-and-sunny',
          'el-icon-moon',
          'el-icon-moon-night',
          'el-icon-dish',
          'el-icon-dish-1',
          'el-icon-food',
          'el-icon-chicken',
          'el-icon-fork-spoon',
          'el-icon-knife-fork',
          'el-icon-burger',
          'el-icon-tableware',
          'el-icon-sugar',
          'el-icon-dessert',
          'el-icon-ice-cream',
          'el-icon-hot-water',
          'el-icon-water-cup',
          'el-icon-coffee-cup',
          'el-icon-cold-drink',
          'el-icon-goblet',
          'el-icon-goblet-full',
          'el-icon-goblet-square',
          'el-icon-goblet-square-full',
          'el-icon-refrigerator',
          'el-icon-grape',
          'el-icon-watermelon',
          'el-icon-cherry',
          'el-icon-apple',
          'el-icon-pear',
          'el-icon-orange',
          'el-icon-coffee',
          'el-icon-ice-tea',
          'el-icon-ice-drink',
          'el-icon-milk-tea',
          'el-icon-potato-strips',
          'el-icon-lollipop',
          'el-icon-ice-cream-square',
          'el-icon-ice-cream-round'
        ]
      },
      // 页面设置json
      settings: {
        badge: {
          countOne: 0,
          countTwo: 0
        }
      }
    }
  },
  computed: {
  },
  // 监听器
  watch: {
  },
  created () {
    this.initShow()
  },
  mounted () {
    // 描绘完成
  },
  methods: {
    initShow () {
      // 初始化查询
      this.getDataList()
    },
    getDataList () {
      this.settings.badge.countOne = this.dataJson.vueIcons.length
      this.getCustomerIcons()
      this.settings.badge.countTwo = this.dataJson.svgs.length
    },
    getCustomerIcons () {
      const files = require.context('@/icons/svg', false, /.svg$/).keys()
      files.forEach(key => {
        const name = key.substring(2).substring(0, key.substring(2).indexOf('.svg'))
        this.dataJson.svgs.push(name)
      })
    },
    setIcon (val) {
      if (this.meDialogStatus) {
        this.$emit('iconDbClick', val)
      }
    }
  }
}
</script>
