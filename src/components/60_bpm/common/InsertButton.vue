<template>
  <el-popover placement="bottom-start" title="添加流程节点" width="450" trigger="click">
    <div class="node-select">
      <div @click="addApprovalNode">
        <i class="el-icon-s-check" style="color:rgb(255, 148, 62);" />
        <span>审批人</span>
      </div>
      <div @click="addTaskNode">
        <i class="el-icon-s-check" style="color:rgb(230, 176, 57);" />
        <span>办理人</span>
      </div>
      <div @click="addCcNode">
        <i class="el-icon-s-promotion" style="color:rgb(50, 150, 250);" />
        <span>抄送人</span>
      </div>
      <div @click="addConditionsNode">
        <i class="el-icon-share" style="color:rgb(21, 188, 131);" />
        <span>条件分支</span>
      </div>
      <!--      <div @click="addConcurrentsNode">-->
      <!--        <i class="el-icon-s-operation" style="color:#718dff;" />-->
      <!--        <span>并行分支</span>-->
      <!--      </div>-->
      <!--      <div @click="addInclusivesNode">-->
      <!--        <i class="el-icon-s-operation" style="color:#718dff;" />-->
      <!--        <span>包容分支</span>-->
      <!--      </div>-->
      <div @click="addDelayNode">
        <i class="el-icon-time" style="color:#f25643;" />
        <span>延迟等待</span>
      </div>
      <div @click="addTriggerNode">
        <i class="el-icon-set-up" style="color:#15BC83;" />
        <span>触发器</span>
      </div>
      <!--      <div @click="addSubprocessNode">-->
      <!--        <i class="el-icon-set-up" style="color:#15BC93;" />-->
      <!--        <span>子流程</span>-->
      <!--      </div>-->
    </div>
    <el-button slot="reference" icon="el-icon-plus" type="primary" size="small" circle />
  </el-popover>
</template>

<script>
export default {
  name: 'InsertButton',
  components: {},
  data () {
    return {}
  },
  computed: {
    selectedNode () {
      return this.$store.getters.bpm_selectedNode
    }
  },
  methods: {
    addApprovalNode () {
      this.$emit('insertNode', 'APPROVAL')
    },
    addTaskNode () {
      this.$emit('insertNode', 'TASK')
    },
    addCcNode () {
      this.$emit('insertNode', 'CC')
    },
    addDelayNode () {
      this.$emit('insertNode', 'DELAY')
    },
    addConditionsNode () {
      this.$emit('insertNode', 'CONDITIONS')
    },
    addConcurrentsNode () {
      this.$emit('insertNode', 'CONCURRENTS')
    },
    addInclusivesNode () {
      this.$emit('insertNode', 'INCLUSIVES')
    },
    addTriggerNode () {
      this.$emit('insertNode', 'TRIGGER')
    },
    addSubprocessNode () {
      this.$emit('insertNode', 'SUBPROCESS')
    }
  }
}
</script>

<style lang="less" scoped>
.node-select{
  div{
    display: inline-block;
    margin: 5px 5px;
    cursor: pointer;
    padding: 10px 15px;
    border: 1px solid #F8F9F9;
    background-color: #F8F9F9;
    border-radius: 10px;
    width: 130px;
    position: relative;
    span{
      position: absolute;
      left: 65px;
      top: 18px;
    }
    &:hover{
      background-color: #fff;
      box-shadow: 0 0 8px 2px #d6d6d6;
    }
    i{
      font-size: 25px;
      padding: 5px;
      border: 1px solid #dedfdf;
      border-radius: 14px;
    }
  }
}
</style>

