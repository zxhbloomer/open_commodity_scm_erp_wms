import { constantRoutes, convertToOneRouter, setAsyncRouters, setRedirectRouter, deepRecursiveLoadComponent } from '@/router'
import { getPermissionAndTopNavApi } from '@/api/user'
import { asyncRoutesArray, asyncRoutesAll, topNav } from '@/router/devMenu'
import deepcopy from 'deep-copy'

/**
 * Use meta.role to determine if the current user has permission
 * @param roles
 * @param route
 */
function hasPermission (roles, route) {
  if (route.meta && route.meta.roles) {
    return roles.some(role => route.meta.roles.includes(role))
  } else {
    return true
  }
}

/**
 * Filter asynchronous routing tables by recursion
 * @param routes asyncRoutes
 * @param roles
 */
export function filterAsyncRoutes (routes, roles) {
  const res = []

  routes.forEach(route => {
    const tmp = { ...route }
    if (hasPermission(roles, tmp)) {
      if (tmp.children) {
        tmp.children = filterAsyncRoutes(tmp.children, roles)
      }
      res.push(tmp)
    }
  })

  return res
}

const state = {
  // 顶部导航栏
  topNav: [],
  topNavActiveIndex: '',
  topNavActiveCode: '',
  // 当前激活的菜单
  menus: [],
  addRoutes: [],
  // 菜单权限和操作权限信息
  permission_data: {},
  staff_id: null,
  session_id: null
}

const mutations = {
  // 添加默认路由，需要包含url根目录redirect跳转
  SET_MENUS_ROUTERS: (state, menus) => {
    state.addRoutes = menus
    state.menus = constantRoutes.concat(menus)
  },
  // 添加顶部导航栏数据
  SET_TOP_NAV: (state, topNav) => {
    state.topNav = topNav
  },
  SET_TOP_NAV_ACTIVE_INDEX: (state, topNavActiveIndex) => {
    state.topNavActiveIndex = topNavActiveIndex
  },
  SET_TOP_NAV_ACTIVE_CODE: (state, topNavActiveCode) => {
    state.topNavActiveCode = topNavActiveCode
  },
  SET_PERMISSION_DATA: (state, permission_data) => {
    state.permission_data = permission_data
  },
  SET_STAFF_ID: (state, staff_id) => {
    state.staff_id = staff_id
  },
  SET_SESSION_ID: (state, session_id) => {
    state.session_id = session_id
  }
}

const actions = {
  setRoutes ({ commit }, routers) {
    // 设置到vuex中是菜单树
    commit('SET_MENUS_ROUTERS', routers)
  },
  setTopNavActiveIndex ({ commit }, topNavIndex) {
    // 设置到vuex中是菜单树
    commit('SET_TOP_NAV_ACTIVE_INDEX', topNavIndex)
  },
  setTopNavActiveCode ({ commit }, topNavCode) {
    //
    commit('SET_TOP_NAV_ACTIVE_CODE', topNavCode)
  },

  /**
   * 此方法为远程调用api
   * @param {*} param0
   * @param {*} _data
   * @returns
   */
  getPermissionAndSetTopNavAction ({ commit }, _data) {
    return new Promise((resolve, reject) => {
      // 获取权限，顶部导航栏，操作权限数据
      getPermissionAndTopNavApi(_data.pathOrIndex, _data.topNavCode, _data.type).then(response => {
        const { data } = response
        if (!data) {
          reject('验证失败，请重新登录')
        }
        const { top_nav_data, user_permission_menu, all_routers, user_permission_operation, redirect, nodes_id, session_id, staff_id } = data
        commit('SET_PERMISSION_DATA', {
          permission_top_nav: top_nav_data,
          permission_menu: user_permission_menu,
          permission_operation: user_permission_operation,
          permission_redirect: redirect,
          nodes_id: nodes_id
        })
        // 根据to的path，解析激活哪一个顶部导航栏
        // 把顶部导航栏，设置到vuex中去
        commit('SET_TOP_NAV', top_nav_data.data)
        // 查找当前属于哪一个active_index
        var sort_index = 0
        for (const item of top_nav_data.data) {
          sort_index++
          if (item.code === top_nav_data.active_code) {
            break
          }
        }
        // commit('SET_TOP_NAV_ACTIVE_INDEX', top_nav_data.active_index)
        commit('SET_TOP_NAV_ACTIVE_INDEX', sort_index)
        commit('SET_TOP_NAV_ACTIVE_CODE', top_nav_data.active_code)
        commit('SET_STAFF_ID', staff_id)
        commit('SET_SESSION_ID', session_id)

        /**
           *  设置菜单
           *  需要注意：菜单和router不是一一匹配的
           *  此处把菜单格式化成自有一个节点的router,asyncRoutes
           *  把菜单返回给左侧sidebar显示，但是router是一个节点向下的
           *
           *  最后还需要考虑redirect的数据，该数据需要包含到'SET_MENUS_ROUTERS'的vuex中
           */
        // 动态读取所有路由中的component，成为对象，没有层级
        deepRecursiveLoadComponent(all_routers)
        /** 增加404错误跳转，需要加在最后 */
        all_routers.push({
          path: '*',
          redirect: '/404',
          hidden: true
        })
        // 设置到异步对象中去
        const convertData = setAsyncRouters(all_routers)
        // 设置根节点跳转的url
        setRedirectRouter(redirect)
        // 菜单设置到vuex中
        commit('SET_MENUS_ROUTERS', user_permission_menu)
        // 返回格式化好的路由
        resolve(convertData)
      }).catch(error => {
        reject(error)
      })
    })
  },

  /**
   * 以下为手工代码，调试使用
   * @param {*} param0
   * @param {*} _data
   */
  getPermissionAndSetTopNavAction2 ({ commit }, _data) {
    return new Promise(resolve => {
      // TODO 此处修改，调试顶部导航栏
      const _topNavData = topNav

      let _navindex = 0
      if (!isNaN(_data.pathOrIndex)) {
        _navindex = _data.pathOrIndex - 1
      }

      // 设置顶部导航栏高亮
      commit('SET_TOP_NAV_ACTIVE_INDEX', (_navindex + 1).toString())
      // 把顶部导航栏，设置到vuex中去
      commit('SET_TOP_NAV', _topNavData)

      /** 设置菜单
       *  需要注意：菜单和router不是一一匹配的
       *  此处把菜单格式化成自有一个节点的router
       *  把菜单返回给左侧sidebar显示，但是router是一个节点向下的
       *
       *  最后还需要考虑redirect的数据，该数据需要包含到'SET_MENUS_ROUTERS'的vuex中
      */
      var _routers = deepcopy(asyncRoutesAll)
      const convertData = convertToOneRouter(_routers)
      const redirect_data = {
        redirect: '/dashboard',
        path: 'dashboard',
        component: '/01_dashboard/index',
        meta: {
          title: '首页', icon: 'dashboard', affix: true
        }
      }
      setRedirectRouter(redirect_data)
      commit('SET_MENUS_ROUTERS', asyncRoutesArray[_navindex])
      resolve(convertData)
    })
  }

}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
