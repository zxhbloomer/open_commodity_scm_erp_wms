import router from './router'
import store from './store'
import { Message, MessageBox } from 'element-ui'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import { getToken } from '@/utils/auth' // get token from cookie
import getPageTitle from '@/utils/get-page-title'
import constants_para from '@/common/constants/constants_para'

NProgress.configure({ showSpinner: false }) // NProgress Configuration

const whiteList = ['/login', '/auth-redirect', '/signup', '/assets/', '/api/v1/sms/code', '/sso'] // no redirect whitelist

// 导航守卫
// 路由守卫
router.beforeEach(async (to, from, next) => {
  // start progress bar
  NProgress.start()

  // set page title
  document.title = getPageTitle(to.meta.title)

  // determine whether the user has logged in
  const hasToken = getToken()

  if (hasToken) {
    if (to.path === '/login') {
      // if is logged in, redirect to the home page
      next({ path: '/' })
      NProgress.done()
    } else {
      // determine whether the user has obtained his permission roles through getInfo
      const hasRoles = store.getters.roles && store.getters.roles.length > 0
      if (hasRoles) {
        next()
      } else {
        try {
          // get user info
          // note: roles must be a object array! such as: ['admin'] or ,['developer','editor']

          // 调用后台获取用户数据
          // 角色
          // const { roles, permission_data } = await store.dispatch('user/getUserInfoAction', { path_to: to })
          await store.dispatch('user/getUserInfoAction')
          // 顶部导航栏处理
          // 获取路由处理
          const accessRoutes = await store.dispatch('permission/getPermissionAndSetTopNavAction', {
            pathOrIndex: to.path,
            topNavCode: null,
            type: constants_para.TOP_NAV_FIND_BY_PATH
          })
          // 加载报表查询批次默认值
          await store.dispatch('dictDefaultValue/getRemoteData', 'b_report_business_start_date')
          // 动态添加路由
          router.addRoutes(accessRoutes)

          // hack method to ensure that addRoutes is complete
          // set the replace: true, so the navigation will not leave a history record
          next({ ...to, replace: true })
        } catch (error) {
          // remove token and go to login page to re-login
          await store.dispatch('user/resetToken')
          Message.error(error || 'Has Error')
          next(`/login?redirect=${to.path}`)
          NProgress.done()
        }
      }
    }
  } else {
    /* 没有token*/
    if (whiteList.indexOf(to.path) !== -1) {
      // 如果在白名单中，可以进行跳转
      next()
    } else {
      if (from.fullPath !== '/') {
        // 没有在白名单中，进行重定向到login页面
        MessageBox.alert('您的登录已经超时，请点击重新登录', '登录已过期', {
          confirmButtonText: '重新登录',
          showClose: false,
          type: 'error'
        }).then(() => {
          next(`/login?redirect=${to.path}`)
        })
      } else {
        next(`/login`)
      }
      NProgress.done()
    }
  }
})

router.afterEach(() => {
  // finish progress bar
  NProgress.done()
})
