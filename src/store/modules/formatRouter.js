
const state = {
  isdo: null
}

const mutations = {
  SET_IS_DO: (state, setMenuRouter) => {
    state.isdo = true
  }
}

const actions = {
  setIsDo ({ commit }, data) {
    commit('SET_IS_DO', data)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
