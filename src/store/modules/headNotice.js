const state = {
  // 预警条数
  alarmCount: 0
}

const mutations = {
  UPDATE_ALARM_COUNT: (state, value) => {
    state.alarmCount = value
  }
}

const actions = {

}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
