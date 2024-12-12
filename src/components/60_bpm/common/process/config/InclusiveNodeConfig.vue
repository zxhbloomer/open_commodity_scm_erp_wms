<template>
  <div>
    <el-form inline label-width="100px">
      <el-form-item label="调整优先级" prop="level">
        <el-popover placement="right" title="拖拽条件调整优先级顺序" width="250" trigger="click">
          <draggable style="width: 100%; min-height:25px" :list="prioritySortList" group="from" :options="sortOption">
            <div
              v-for="(cd, index) in prioritySortList"
              :key="index"
              :class="{'drag-no-choose': true, 'drag-hover': cd.id === selectedNode.id}"
            >
              <ellipsis style="width: 160px;" hover-tip :content="cd.name" />
              <div>优先级 {{ index + 1 }}</div>
            </div>
          </draggable>
          <el-button slot="reference" icon="el-icon-sort" size="small">第{{ nowNodeLeave + 1 }}级</el-button>
        </el-popover>
      </el-form-item>
      <el-form-item label="条件组关系" label-width="150px">
        <el-switch
          v-model="config.groupsType"
          active-color="#409EFF"
          inactive-color="#c1c1c1"
          active-value="AND"
          inactive-value="OR"
          active-text="且"
          inactive-text="或"
        />
      </el-form-item>
      <el-form-item label="条件组表达式">
        <el-input v-model="config.expression" size="mini" placeholder="输入条件组关系表达式  &为与，|为或" />
        <span class="item-desc">使用表达式构建复杂逻辑，例如: (A & B) | C</span>
      </el-form-item>
    </el-form>
    <div>
      <el-button type="primary" size="mini" icon="el-icon-plus" style="margin: 0 15px 15px 0" round @click="addConditionGroup">
        添加条件组
      </el-button>
      <span class="item-desc">只有必填选项才能作为审批条件</span>
    </div>
    <group-item />
  </div>
</template>

<script>
import draggable from 'vuedraggable'
import GroupItem from './InclusiveGroupItemConfig.vue'
import Ellipsis from '@/components/60_bpm/common/Ellipsis'

export default {
  name: 'InclusiveNodeConfig',
  components: { draggable, GroupItem, Ellipsis },
  props: {
    config: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  data () {
    return {
      sortOption: {
        animation: 300,
        chosenClass: 'choose',
        scroll: true,
        sort: true
      }
    }
  },
  computed: {
    selectedNode () {
      return this.$store.getters.bpm_selectedNode
    },
    select () {
      return this.config.assignedUser || []
    },
    nowNodeLeave () {
      return this.prioritySortList.indexOf(this.selectedNode)
    },
    // 条件节点
    prioritySortList () {
      const node = this.$store.getters.bpm_nodeMap.get(this.selectedNode.parentId)
      console.log(this.selectedNode.id, node)
      if (node) {
        return node.branchs || []
      }
      return []
    }
  },
  methods: {
    addConditionGroup () {
      this.config.groups.push({
        cids: [],
        groupType: 'OR',
        conditions: []
      })
    },
    selectUser () {
      this.showOrgSelect = true
    },
    selected (select) {
      console.log(select)
      this.showOrgSelect = false
      select.forEach(val => this.select.push(val))
    },
    removeOrgItem (index) {
      this.select.splice(index, 1)
    }
  }
}
</script>

<style lang="less" scoped>
.choose {
  border-radius: 5px;
  margin-top: 2px;
  background: #f4f4f4;
  border: 1px dashed #1890FF !important;
}

.drag-hover {
  color: #1890FF
}

.drag-no-choose {
  cursor: move;
  background: #f8f8f8;
  border-radius: 5px;
  margin: 5px 0;
  height: 25px;
  line-height: 25px;
  padding: 5px 10px;
  border: 1px solid #ffffff;
  div{
    display: inline-block;
    font-size: small !important;
  }

  div:nth-child(2) {
    float: right !important;
  }
}
</style>
