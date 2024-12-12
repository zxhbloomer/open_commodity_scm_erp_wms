<template>
  <div>
    <el-table :header-cell-style="{background:'#f5f6f6'}" :data="formPerms" border style="width: 100%">
      <el-table-column prop="title" show-overflow-tooltip label="表单字段">
        <template slot-scope="scope">
          <span v-if="scope.row.required" style="color: #c75450"> * </span>
          <span>{{ scope.row.title }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="readOnly" label="只读" width="80">
        <template slot="header">
          <el-radio v-model="permSelect" label="R" @change="allSelect('R')">只读</el-radio>
        </template>
        <template slot-scope="scope">
          <el-radio v-model="scope.row.perm" label="R" :name="scope.row.id" />
        </template>
      </el-table-column>
      <el-table-column v-if="nowNode.type !== 'CC'" prop="editable" label="可编辑" width="90">
        <template slot="header">
          <el-radio v-model="permSelect" label="E" @change="allSelect('E')">可编辑</el-radio>
        </template>
        <template slot-scope="scope">
          <el-radio v-model="scope.row.perm" label="E" :name="scope.row.id" />
        </template>
      </el-table-column>
      <el-table-column prop="hide" label="隐藏" width="80">
        <template slot="header">
          <el-radio v-model="permSelect" label="H" @change="allSelect('H')">隐藏</el-radio>
        </template>
        <template slot-scope="scope">
          <el-radio v-model="scope.row.perm" label="H" :name="scope.row.id" />
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  name: 'FormAuthorityConfig',
  components: {},
  data () {
    return {
      tableData: [],
      isIndeterminate: false,
      permSelect: '',
      checkStatus: {
        readOnly: true,
        editable: false,
        hide: false
      }
    }
  },
  computed: {
    nowNode () {
      return this.$store.getters.bpm_selectedNode
    },
    formData () {
      return this.$store.getters.bpm_design.formItems
    },
    formPerms () {
      return this.$store.getters.bpm_selectedNode.props.formPerms
    }
  },
  watch: {
    formPerms: {
      deep: true,
      handler () {
        const set = new Set(this.formPerms.map(f => f.perm))
        this.permSelect = set.size === 1 ? set.values()[0] : ''
      }
    }

  },
  created () {
    // 备份
    const oldPermMap = this.formPerms.toMap('id')
    // 重新清空，按顺序加载权限
    this.formPerms.length = 0
    this.formPermsLoad(oldPermMap, this.formData)
  },
  methods: {
    allSelect (type) {
      this.permSelect = type
      this.formPerms.forEach(f => {
        f.perm = type
      })
    },
    formPermsLoad (oldPermMap, forms) {
      forms.forEach(form => {
        if (form.name === 'SpanLayout') {
          this.formPermsLoad(oldPermMap, form.props.items)
        } else {
          // 刷新名称
          const old = oldPermMap.get(form.id)
          if (old) {
            old.title = form.title
            old.required = form.props.required
            this.formPerms.push(old)
          } else {
            this.formPerms.push({
              id: form.id,
              title: form.title,
              required: form.props.required,
              perm: this.$store.getters.bpm_selectedNode.type === 'ROOT' ? 'E' : 'R'
            })
          }
        }
      })
    },
    handleCheckAllChange () {

    }
  }
}
</script>

<style lang="less" scoped>

/deep/ .el-table__row {
  & > td:first-child {
    .cell {
      text-align: left;
    }
  }

  .cell {
    text-align: center;
  }

  .el-radio__label {
    display: none;
  }
}
</style>

