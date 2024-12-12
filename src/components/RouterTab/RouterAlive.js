import { emptyObj } from './util'
import { getFirstComponentChild } from './util/dom'

import rule from './rule'

export default {
  name: 'RouterAlive',
  mixins: [rule],

  created () {
    Object.assign(this, {
      cache: Object.create(null),
      lastRoute: this.$route
    })
  },

  // 销毁后清理缓存
  destroyed () {
    this.removeAll()
    this.cache = null
    this.lastRoute = null
  },

  render () {
    const slot = this.$slots.default
    const vnode = getFirstComponentChild(slot)
    const vmOpts = vnode && vnode.componentOptions

    if (vmOpts) {
      const { $route, lastRoute } = this

      // 如果是transition组件，页面组件则为子元素
      const pageNode = vmOpts.tag === 'transition' ? vmOpts.children[0] : vnode

      if (pageNode && pageNode.componentOptions) {
        // 获取缓存
        const key = this.getAliveId()
        const cacheItem = this.get(key)
        const { vm: cacheVm, route: cacheRoute } = cacheItem || emptyObj

        // 是否需要重载路由强制刷新页面组件
        let needReloadView = false

        // 路由是否改变
        const isRouteChange = lastRoute !== $route

        // 是否与上次路由相似
        const likeLastRoute = this.isAlikeRoute($route, lastRoute)

        // 是否跟上次路由不同单共用组件
        const isShareComp = isRouteChange &&
          !likeLastRoute &&
          this.getPageComp($route) === this.getPageComp(lastRoute)

        if (isRouteChange) {
          // 更新上次路由
          this.lastRoute = $route

          // 添加缓存
          this.set(key, { route: $route })
        }

        if (cacheVm) {
          const ctorId = this.getCtorIdByNode(pageNode)
          const lastCtorId = cacheVm._ctorId

          // 页面实例组件构造函数改变则清理旧缓存，解决 webpack 热加载后组件缓存不更新
          if (lastCtorId && lastCtorId !== ctorId) {
            // 清理缓存组件
            this.remove(key)
          } else if (this.isAlikeRoute(cacheRoute, $route)) {
            // 缓存组件的路由地址匹配则取缓存的组件
            pageNode.componentInstance = cacheVm

            // 嵌套路由缓存导致页面不匹配时强制更新
            if (
              !likeLastRoute &&
              cacheRoute.fullPath !== $route.fullPath &&
              this.isNestRoute($route)
            ) {
              cacheVm._nestCacheForceReload = true
            }
          } else {
            // 缓存组件路由地址不匹配则销毁缓存并重载路由
            this.remove(key)
            needReloadView = true
          }

          // 更新构造 id
          cacheVm._ctorId = ctorId
        }

        // 共用组件的路由切换需重载路由
        if (isShareComp) needReloadView = true

        // 重载路由以强制更新页面
        needReloadView && this.$routerTab.reloadView()

        // 标记为 keepAlive和 routerAlive
        pageNode.data.keepAlive = true
        pageNode.data.routerAlive = this
      }
    }

    return vnode || (slot && slot[0])
  },

  methods: {
    // 设置缓存项
    set (key, item) {
      const { cache } = this
      const origin = cache[key]

      if (origin) {
        item = Object.assign(origin, item)
      }

      this.$emit('update', key, item)

      // 更新缓存数据
      return (cache[key] = item)
    },

    // 获取缓存项
    get (key) {
      return this.cache[key]
    },

    // 删除缓存项
    remove (key) {
      const { cache } = this
      const item = this.get(key)

      // 销毁组件实例
      if (item) {
        item.vm && item.vm.$destroy()
        delete cache[key]
      }
    },

    // 清理所有缓存
    removeAll () {
      const { cache } = this

      for (const i in cache) {
        this.remove(i)
      }
    }
  }
}
