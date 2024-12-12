
const state = {
  program: null,
  selectedDataJson: null
}

const mutations = {
  SET_PROGRAM: (state, program) => {
    state.program = program
  },
  SET_SELECTED_DATA_JSON: (state, selectedDataJson) => {
    state.selectedDataJson = selectedDataJson
  }
}

const actions = {
  program ({ commit }, data) {
    commit('SET_PROGRAM', data)
  },
  selectedDataJson ({ commit }, data) {
    commit('SET_SELECTED_DATA_JSON', data)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
