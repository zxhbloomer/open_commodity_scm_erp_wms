<template>
  <el-main class="position_relative">
    <div class="scale">
      <el-button icon="el-icon-plus" size="small" :disabled="scale >= 150" circle @click="scale += 10" />
      <span>{{ scale }}%</span>
      <el-button icon="el-icon-minus" size="small" :disabled="scale <= 40" circle @click="scale -= 10" />
    </div>
    <div class="design" :style="'transform: scale('+ scale / 100 +');'">
      <process-tree-viewer ref="process-tree" @selectedNode="nodeSelected" />
    </div>
  </el-main>
</template>

<script>
// import NodeConfig from '../../common/process/config/NodeConfig'
import ProcessTreeViewer from '@/components/60_bpm/admin/layout/process/ProcessTreeViewer'

export default {
  name: 'ProcessDesign',
  components: { ProcessTreeViewer },
  data () {
    return {
      scale: 100,
      selected: {},
      showInput: false,
      showConfig: false
    }
  },
  computed: {
    selectedNode () {
      return this.$store.getters.bpm_selectedNode
    }
  },
  watch: {
    /* selectedNode:{
      deep: true,
      handler(node){
        console.log("更新")
        this.$refs["process-tree"].nodeDomUpdate(node)
      }
    }*/
  },
  created () {
    this.$store.getters.bpm_diagramMode = 'viewer'
  },
  beforeDestroy () {
    this.$store.getters.bpm_diagramMode = 'design'
  },
  methods: {
    validate () {
      return this.$refs['process-tree'].validateProcess()
    },
    nodeSelected (node) {
      console.log('配置节点', node)
      this.showConfig = true
    }
  }
}
</script>

<style lang="less" scoped>
.design {
  margin-top: 100px;
  display: flex;
  transform-origin: 50% 0px 0px;
}

.position_relative {
  position: relative;
}

.scale {
  z-index: 999;
  position: absolute;
  top: 80px;
  right: 40px;

  span {
    margin: 0 10px;
    font-size: 15px;
    color: #7a7a7a;
    width: 50px;
  }
}

.node-config-content{
  padding: 0 20px 20px;
}

/deep/ .el-drawer__body{
  overflow-y: auto;
}
</style>
