import { getDictDataApi } from '@/api/00_common/commonComponent'

const state = {
  // 默认值， 为空
  dict_value: ''
}

const mutations = {
  SET_DICT_DEFAULT_VALUE (state, val) {
    state.dict_value = val
  }
}

const actions = {
  // src\permission.js 53行调用
  getRemoteData ({ commit }, params) {
    const param = { para: params }
    getDictDataApi(param).then((_data) => {
      var selectOptions = []
      selectOptions = _data.data
      if (selectOptions !== null && selectOptions.length) {
        const data = selectOptions.find(item => {
          // 额外配置为 1 的是默认的
          return item.extra1 === '1'
        })
        if (data !== null && data !== undefined) {
          commit('SET_DICT_DEFAULT_VALUE', data.value)
        }
      }
    }, (_error) => {
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
