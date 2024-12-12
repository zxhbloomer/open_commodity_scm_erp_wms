
const state = {
  table: null,
  columns: null
}

const mutations = {
  SET_CUSTOM_TABLE: (state, table) => {
    state.table = table
  },
  SET_CUSTOM_COLUMNS: (state, columns) => {
    state.columns = columns
  }
}

const actions = {
  table ({ commit }, data) {
    commit('SET_CUSTOM_TABLE', data)
  },
  columns ({ commit }, data) {
    commit('SET_CUSTOM_COLUMNS', data)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
