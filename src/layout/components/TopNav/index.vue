<template>
  <scrollView>
    <div>
      <template>
        <el-menu
          mode="horizontal"
          class="topnav"
          :default-active="activeIndex"
          @select="handleSelect"
        >
          <el-menu-item
            v-for="(item,key) in permission_topNav"
            :key="key"
            :index="item.code"
          >
            <svg-icon :icon-class="item.meta.icon" />
            <span
              slot="title"
              style="margin-left: 8px"
            >{{ item.meta.name }}</span>
          </el-menu-item>
        </el-menu>
      </template>
    </div>
  </scrollView>
</template>

<style scoped>
.topnav {
  background-color: transparent;
  /* float: left; */
  display: flex;
}
.el-menu > .el-menu-item {
  display: inline-block;
  line-height: 50px;
  height: 50px;
  color: #fff;
  vertical-align: middle;
  border-bottom: none;
}
.el-menu > .el-menu-item.is-active {
  color: #fff !important;
  background-color: rgba(0, 0, 0, 0.2) !important;
}
.el-menu > .el-menu-item:hover {
  color: #fff !important;
  background-color: rgba(0, 0, 0, 0.1) !important;
}
</style>

<script>
import { mapGetters } from 'vuex'
import store from '@/store'
import router, { resetRouter } from '@/router'
import scrollView from '@/components/99_util/scrollview'

export default {
  components: { scrollView },
  data () {
    return {
      // 监听器
      watch: {
        unwatch_active_index: null
      },
      activeIndex: undefined
    }
  },
  computed: {
    ...mapGetters([
      'permission_topNav',
      'permission_topNav_activeIndex',
      'permission_topNav_code'
    ])
  },
  watch: {
    $route (to, from) {
      // alert(this.permission_topNav_code)
      if (to.meta.active_topnav_code !== from.meta.active_topnav_code) {
        this.activeIndex = to.meta.active_topnav_code
        this.handleSelectNoResetRouter(this.activeIndex)
      }
    }

  },
  created () {
    this.setActiveIndex()
    this.setWatch()
  },
  mounted () {
    // 描绘完成
  },
  methods: {
    setActiveIndex () {
      var _index
      for (const item of this.permission_topNav) {
        if (item.meta.top_nav_code === this.permission_topNav_code) {
          _index = item.meta.top_nav_code
          break
        }
      }
      this.activeIndex = _index
    },
    // 设置监听器
    setWatch () {
      this.unWatch()
      // 监听页面上面是否有修改，有修改按钮高亮
      this.watch.unwatch_active_index = this.$watch('permission_topNav_code', (newVal, oldVal) => {
        this.setActiveIndex()
        return new Promise(async resolve => {
          this.showLoading('正在查询，请稍后...')
          resetRouter()
          // 顶部导航栏处理
          // 获取路由处理
          const accessRoutes = await store.dispatch('permission/getPermissionAndSetTopNavAction', {
            pathOrIndex: this.activeIndex,
            topNavCode: this.permission_topNav_code,
            type: this.PARAMETERS.TOP_NAV_FIND_BY_INDEX
          })
          // 动态添加路由
          router.addRoutes(accessRoutes)
          this.setWatch()
          resolve()
        }).finally(
          this.closeLoading()
        )
      }, { deep: true }
      )
    },
    unWatch () {
      if (this.watch.unwatch_active_index) {
        this.watch.unwatch_active_index()
      }
    },
    handleSelect (key, keyPath) {
      this.unWatch()

      // if (this.permission_topNav[key - 1].index === this.activeIndex) {
      //   return
      // }
      // this.activeIndex = this.permission_topNav[key - 1].index
      // if (key === this.activeIndex) {
      //   return
      // }
      // this.activeIndex = key
      return new Promise(async resolve => {
        this.showLoading('正在查询，请稍后...')
        resetRouter()
        // 顶部导航栏处理
        // 获取路由处理
        var _nav
        for (const item of this.permission_topNav) {
          if (item.meta.top_nav_code === key) {
            _nav = item
            break
          }
        }
        const accessRoutes = await store.dispatch('permission/getPermissionAndSetTopNavAction', {
          pathOrIndex: _nav.index,
          topNavCode: _nav.meta.top_nav_code,
          type: this.PARAMETERS.TOP_NAV_FIND_BY_INDEX
        })
        // 动态添加路由
        router.addRoutes(accessRoutes)
        this.setWatch()
        resolve()
      }).finally(
        this.closeLoading()
      )
    },

    // 測試
    handleSelectNoResetRouter (key, keyPath) {
      this.unWatch()
      return new Promise(async resolve => {
        // this.showLoading('正在查询，请稍后...')
        // resetRouter()
        // 顶部导航栏处理
        // 获取路由处理
        var _nav
        for (const item of this.permission_topNav) {
          if (item.meta.top_nav_code === key) {
            _nav = item
            break
          }
        }
        const accessRoutes = await store.dispatch('permission/getPermissionAndSetTopNavAction', {
          pathOrIndex: _nav.index,
          topNavCode: _nav.meta.top_nav_code,
          type: this.PARAMETERS.TOP_NAV_FIND_BY_INDEX
        })
        // 动态添加路由
        router.addRoutes(accessRoutes)
        this.setWatch()
        resolve()
      }).finally(
        // this.closeLoading()
      )
    }
  }
}
</script>

