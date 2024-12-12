import { loginApi, logout, getUserInfoApi, setdnnode, getQxbConfigEntity, ssoLoginApi } from '@/api/user'
import { getToken, setToken, removeToken } from '@/utils/auth'
import router, { resetRouter } from '@/router'

const state = {
  token: getToken(),
  name: '',
  avatar: '',
  introduction: '',
  roles: [],
  // session信息
  session_bean: {}
}

const mutations = {
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_INTRODUCTION: (state, introduction) => {
    state.introduction = introduction
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  },
  SET_ROLES: (state, roles) => {
    state.roles = roles
  },
  SET_SESSION_BEAN: (state, session_bean) => {
    state.session_bean = session_bean
  }
}

const actions = {
  // user login
  loginAction ({ commit }, userInfo) {
    const { username, password, imageCode } = userInfo
    return new Promise((resolve, reject) => {
      loginApi({ username: username.trim(), password: password, imageCode: imageCode.trim() }).then(response => {
        const { data } = response
        // 设置令牌
        commit('SET_TOKEN', data.token)
        setToken(data.token)
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // user login 免密码
  ssoLoginAction ({ commit }, userInfo) {
    const { username, password } = userInfo
    return new Promise((resolve, reject) => {
      ssoLoginApi({ username: username.trim(), password: password.trim() }).then(response => {
        const { data } = response
        // 设置令牌
        commit('SET_TOKEN', data.token)
        setToken(data.token)
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // setdnnode
  setdnnode ({ commit }, userInfo) {
    const { username, dnnode } = userInfo
    return new Promise((resolve, reject) => {
      setdnnode({ username: username.trim(), dnnode: dnnode.trim() }).then(response => {
        const { data } = response
        console.log(data)
      }).catch(error => {
        reject(error)
      })
    })
  },

  getQxbConfigEntity ({ commit }) {
    return new Promise((resolve, reject) => {
      getQxbConfigEntity({}).then(response => {

      }).catch(error => {
        reject(error)
      })
    })
  },

  // get user info
  getUserInfoAction ({ commit, state }, _data) {
    return new Promise((resolve, reject) => {
      getUserInfoApi(state.token).then(response => {
        const { data } = response

        if (!data) {
          reject('验证失败，请重新登录')
        }

        const { roles, name, avatar, introduction, user_session_bean } = data

        // roles must be a non-empty array
        // if (!roles || roles.length <= 0) {
        //   reject('getInfo: roles must be a non-null array!')
        // }

        commit('SET_ROLES', roles)
        commit('SET_NAME', name)
        commit('SET_AVATAR', avatar)
        commit('SET_INTRODUCTION', introduction)
        commit('SET_SESSION_BEAN', user_session_bean)
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // user logout
  logout ({ commit, state }) {
    return new Promise((resolve, reject) => {
      logout(state.token).then(() => {
        commit('SET_TOKEN', '')
        commit('SET_ROLES', [])
        removeToken()
        resetRouter()

        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // remove token
  resetToken ({ commit }) {
    return new Promise(resolve => {
      commit('SET_TOKEN', '')
      commit('SET_ROLES', [])
      removeToken()
      resolve()
    })
  },

  // 动态改变权限
  changeRoles ({ commit, dispatch }, role) {
    return new Promise(async resolve => {
      const token = role + '-token'

      commit('SET_TOKEN', token)
      setToken(token)

      const { roles } = await dispatch('getInfo')

      resetRouter()

      // generate accessible routes map based on roles
      const accessRoutes = await dispatch('permission/generateRoutes', roles, { root: true })

      // dynamically add accessible routes
      router.addRoutes(accessRoutes)

      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
