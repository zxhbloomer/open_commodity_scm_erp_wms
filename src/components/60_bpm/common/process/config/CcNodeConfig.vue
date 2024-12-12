<template>
  <div>
    <el-button size="mini" icon="el-icon-plus" type="primary" round @click="selectOrg">选择抄送人</el-button>
    <div class="option">
      <el-checkbox v-model="config.shouldAdd" label="允许发起人添加抄送人" />
    </div>
    <org-items v-model="select" />
    <org-picker ref="orgPicker" multiple :selected="select" @ok="selected" />
  </div>
</template>

<script>
import OrgPicker from '@/components/60_bpm/common/OrgPicker'
import OrgItems from '../OrgItems'

export default {
  name: 'CcNodeConfigVue',
  components: { OrgPicker, OrgItems },
  props: {
    config: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  data () {
    return {}
  },
  computed: {
    select: {
      get () {
        return this.config.assignedUser || []
      },
      set (val) {
        this.config.assignedUser = val
      }
    }
  },
  methods: {
    selectOrg () {
      this.$refs.orgPicker.show()
    },
    selected (select) {
      console.log(select)
      this.select = Object.assign([], select)
    },
    removeOrgItem (index) {
      this.select.splice(index, 1)
    }
  }
}
</script>

<style lang="less" scoped>
.option {
  color: #606266;
  margin-top: 20px;
  font-size: small;
}

.desc {
  font-size: small;
  color: #8c8c8c;
}

.org-item {
  margin: 5px;
}
</style>
