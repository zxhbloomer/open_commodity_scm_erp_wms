const state = {
  nodeMap: new Map(),
  selectedNode: {},
  design: {
    id: 'root',
    parentId: null,
    type: 'ROOT',
    name: '发起人',
    desc: '任何人',
    props: {
      assignedUser: [],
      formPerms: []
    },
    children: {}
  }
}

const mutations = {
  selectedNode (state, val) {
    state.selectedNode = val
  }
}

export default {
  namespaced: true,
  state,
  mutations
}
