<template>
  <div style="max-width: 350px">
    <div v-if="mode === 'DESIGN'">
      <el-button disabled icon="el-icon-user" type="primary" size="mini" round>选择人员</el-button>
      <span class="placeholder"> {{ placeholder }}</span>
    </div>
    <div v-else>
      <template v-if="!readerMode">
        <el-button icon="el-icon-user" type="primary" size="mini" round @click="$refs.orgPicker.show()">选择人员</el-button>
        <org-picker ref="orgPicker" type="user" :multiple="multiple" :selected="_value" @ok="selected" />
        <span class="placeholder"> {{ placeholder }}</span>
        <div style="margin-top: 5px">
          <el-tag v-for="(dept, i) in _value" :key="i" size="mini" style="margin: 5px" closable @close="delDept(i)">{{ dept.name }}</el-tag>
        </div>
      </template>
      <template v-else>
        <div>
          <el-tag v-for="(dept, i) in _value" :key="i" size="mini" style="margin: 5px">{{ dept.name }}</el-tag>
        </div>
      </template>

    </div>
  </div>
</template>

<script>
import componentMinxins from '../ComponentMinxins'
import OrgPicker from '@/components/60_bpm/common/OrgPicker'

export default {
  name: 'DeptPicker',
  components: { OrgPicker },
  mixins: [componentMinxins],
  props: {
    value: {
      type: Array,
      default: () => {
        return []
      }
    },
    placeholder: {
      type: String,
      default: '请选择人员'
    },
    multiple: {
      type: Boolean,
      default: false
    },
    readerMode: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      showOrgSelect: false
    }
  },
  methods: {
    selected (values) {
      this.showOrgSelect = false
      this._value = values
    },
    delDept (i) {
      this._value.splice(i, 1)
    }
  }
}
</script>

<style scoped>
.placeholder{
  margin-left: 10px;
  color: #adabab;
  font-size: smaller;
}
</style>
