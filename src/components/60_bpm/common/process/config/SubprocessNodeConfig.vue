<template>
  <div>
    <el-form label-position="top" label-width="90px">
      <el-form-item label="⚙ 选择审批对象" prop="text" class="user-type">
        <el-radio-group v-model="nodeProps.assignedType">
          <el-radio v-for="t in approvalTypes" :key="t.type" :label="t.type">{{ t.name }}</el-radio>
        </el-radio-group>
        <div v-if="nodeProps.assignedType === 'ASSIGN_USER'">
          <el-button size="mini" icon="el-icon-plus" type="primary" round @click="selectUser">选择人员</el-button>
          <org-items v-model="nodeProps.assignedUser" />
        </div>
        <div v-else-if="nodeProps.assignedType === 'SELF_SELECT'">
          <el-radio-group v-model="nodeProps.selfSelect.multiple" size="mini">
            <el-radio-button :label="false">自选一个人</el-radio-button>
            <el-radio-button :label="true">自选多个人</el-radio-button>
          </el-radio-group>
        </div>
        <div v-else-if="nodeProps.assignedType === 'LEADER_TOP'">
          <el-divider />
          <el-form-item label="审批终点" prop="text" class="approve-end">
            <el-radio-group v-model="nodeProps.leaderTop.endCondition">
              <el-radio label="TOP">直到最上层主管</el-radio>
              <el-radio label="LEAVE">不超过发起人的</el-radio>
            </el-radio-group>
            <div v-if="nodeProps.leaderTop.endCondition === 'LEAVE'" class="approve-end-leave">
              <span>第 </span>
              <el-input-number v-model="nodeProps.leaderTop.level" :min="1" :max="20" :step="1" size="mini" />
              <span> 级主管</span>
            </div>
          </el-form-item>
        </div>
        <div v-else-if="nodeProps.assignedType === 'LEADER'">
          <el-divider />
          <el-form-item label="指定主管" prop="text">
            <span>发起人的第 </span>
            <el-input-number
              v-model="nodeProps.leader.level"
              :min="1"
              :max="20"
              :step="1"
              size="mini"
            />
            <span> 级主管</span>
            <div style="color: #409EFF; font-size: small;">👉 直接主管为 第 1 级主管</div>
          </el-form-item>
        </div>
        <div v-else-if="nodeProps.assignedType === 'ROLE'">
          <el-button size="mini" icon="el-icon-plus" type="primary" round @click="selectRole">选择系统角色</el-button>
          <org-items v-model="nodeProps.role" />
        </div>
        <div v-else-if="nodeProps.assignedType === 'FORM_USER'">
          <el-form-item label="选择表单联系人项" prop="text" class="approve-end">
            <el-select v-model="nodeProps.formUser" style="width: 80%;" size="small" placeholder="请选择包含联系人的表单项">
              <el-option v-for="op in forms" :key="op.id" :label="op.title" :value="op.id" />
            </el-select>
          </el-form-item>
        </div>
        <div v-else>
          <span class="item-desc">发起人自己作为审批人进行审批</span>
        </div>
      </el-form-item>

      <el-divider />
      <el-form-item label="⚙子流程表单" prop="text" class="line-mode">
        <el-cascader
          v-model="nodeProps.subprocessId"
          style="width: 80%;"
          size="small"
          placeholder="请选择子流程表单"
          :options="fromGroup"
          :props="{ expandTrigger: 'hover'}"
          :show-all-levels="false"
          @change="handleChange"
        />
      </el-form-item>
    </el-form>
    <org-picker
      ref="orgPicker"
      :title="pickerTitle"
      multiple
      :type="orgPickerType"
      :selected="orgPickerSelected"
      @ok="selected"
    />
  </div>
</template>

<script>
import OrgPicker from '@/components/60_bpm/common/OrgPicker'
import OrgItems from '../OrgItems'
// import { getFormGroups } from '@/api/design'

export default {
  name: 'SubprocessNodeConfig',
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
    return {
      showOrgSelect: false,
      orgPickerSelected: [],
      fromGroup: [],
      orgPickerType: 'user',
      approvalTypes: [
        { name: '指定人员', type: 'ASSIGN_USER' },
        { name: '发起人自选', type: 'SELF_SELECT' },
        { name: '连续多级主管', type: 'LEADER_TOP' },
        { name: '主管', type: 'LEADER' },
        { name: '角色', type: 'ROLE' },
        { name: '发起人自己', type: 'SELF' },
        { name: '表单内联系人', type: 'FORM_USER' }
      ]
    }
  },
  computed: {
    nodeProps () {
      return this.$store.getters.bpm_selectedNode.props
    },
    select () {
      return this.config.assignedUser || []
    },
    forms () {
      return this.$store.getters.bpm_design.formItems.filter(f => {
        return f.name === 'UserPicker'
      })
    },
    pickerTitle () {
      switch (this.orgPickerType) {
        case 'user':
          return '请选择人员'
        case 'role':
          return '请选择系统角色'
        default:
          return null
      }
    },
    nodeOptions () {
      const values = []
      const excType = ['ROOT', 'EMPTY', 'CONDITION', 'CONDITIONS', 'CONCURRENT', 'CONCURRENTS']
      this.$store.getters.bpm_nodeMap.forEach((v) => {
        if (excType.indexOf(v.type) === -1) {
          values.push({ id: v.id, name: v.name })
        }
      })
      return values
    },
    showMode () {
      switch (this.nodeProps.assignedType) {
        case 'ASSIGN_USER':
          return this.nodeProps.assignedUser.length > 0
        case 'SELF_SELECT':
          return this.nodeProps.selfSelect.multiple
        case 'LEADER_TOP':
          return this.nodeProps.formUser !== ''
        case 'FORM_USER':
          return true
        case 'ROLE':
          return true
        default:
          return false
      }
    }
  },
  mounted () {
    this.getGroups()
  },
  methods: {
    selectUser () {
      this.orgPickerSelected = this.select
      this.orgPickerType = 'user'
      this.$refs.orgPicker.show()
    },
    selectNoSetUser () {
      this.orgPickerSelected = this.config.nobody.assignedUser
      this.orgPickerType = 'user'
      this.$refs.orgPicker.show()
    },
    selectRole () {
      this.orgPickerSelected = this.select
      this.orgPickerType = 'role'
      this.$refs.orgPicker.show()
    },
    selected (select) {
      console.log(select)
      this.orgPickerSelected.length = 0
      select.forEach(val => this.orgPickerSelected.push(val))
    },
    removeOrgItem (index) {
      this.select.splice(index, 1)
    },
    getGroups () {
      // 简便  不使用迭代方法处理
      // getFormGroups().then(rsp => {
      //   var data = rsp.data
      //   this.fromGroup = data.map(group => {
      //     return {
      //       value: group.id,
      //       label: group.name,
      //       children: group.items.map(item => {
      //         return {
      //           value: item.formId,
      //           label: item.formName
      //         }
      //       })
      //     }
      //   })
      // }).catch(err => {
      //   console.error(err)
      //   this.$message.error('获取分组异常')
      // })
    },
    handleChange (key) {
      // 对值进行处理
    }
  }
}
</script>

<style lang="less" scoped>
.user-type {
  /deep/ .el-radio {
    width: 110px;
    margin-top: 10px;
    margin-bottom: 20px;
  }
}

/deep/ .line-mode {
  .el-radio {
    width: 150px;
    margin: 5px;
  }
}

/deep/ .el-form-item__label {
  line-height: 25px;
}

/deep/ .approve-mode {
  .el-radio {
    float: left;
    width: 100%;
    display: block;
    margin-top: 15px;
  }
}

/deep/ .approve-end {
  position: relative;

  .el-radio-group {
    width: 160px;
  }

  .el-radio {
    margin-bottom: 5px;
    width: 100%;
  }

  .approve-end-leave {
    position: absolute;
    bottom: -5px;
    left: 150px;
  }
}

/deep/ .el-divider--horizontal {
  margin: 10px 0;
}
</style>
