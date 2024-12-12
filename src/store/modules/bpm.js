
export default {
  state: {
    nodeMap: new Map(),
    isEdit: null,
    selectedNode: {},
    selectFormItem: null,
    design: {},
    runningList: [],
    noTakeList: [],
    endList: [],
    diagramMode: 'design'
  },
  mutations: {
    selectedNode (state, val) {
      state.selectedNode = val
    },
    loadForm (state, val) {
      state.design = val
    },
    setIsEdit (state, val) {
      state.isEdit = val
    },
    setSelectFormItem (state, val) {
      state.selectFormItem = val
    }
  },
  getters: {},
  actions: {},
  modules: {}
}
