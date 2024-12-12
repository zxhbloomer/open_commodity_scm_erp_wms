<template>
  <div
    class="mytrees"
    style="height:500px;overflow-y:auto;overflow-x:auto;"
  >
    <el-tree
      ref="treeObject"
      :filter-node-method="filterNode"
      :data="dataJson.treeData"
      :props="dataJson.defaultProps"
      :expand-on-click-node="false"
      :indent="0"
      highlight-current
      node-key="id"
      default-expand-all
      class="tree"
      @current-change="handleCurrentChange"
    >
      <span
        slot-scope="{ node, data }"
        class="custom-tree-node"
      >
        <span>
          <svg-icon
            v-if="data.type === CONSTANTS.DICT_ORG_SETTING_TYPE_TENANT"
            icon-class="perfect-icon-tenant"
            class="el-icon--right"
          />
          <svg-icon
            v-else-if="data.type === CONSTANTS.DICT_ORG_SETTING_TYPE_GROUP"
            icon-class="perfect-icon-group"
            class="el-icon--right"
          />
          <svg-icon
            v-else-if="data.type === CONSTANTS.DICT_ORG_SETTING_TYPE_COMPANY"
            icon-class="perfect-icon-company"
            class="el-icon--right"
          />
          <svg-icon
            v-else-if="data.type === CONSTANTS.DICT_ORG_SETTING_TYPE_DEPT"
            icon-class="perfect-icon-dept"
            class="el-icon--right"
          />
          <svg-icon
            v-else-if="data.type === CONSTANTS.DICT_ORG_SETTING_TYPE_POSITION"
            icon-class="perfect-icon-position"
            class="el-icon--right"
          />
          <span v-if="data.type === CONSTANTS.DICT_ORG_SETTING_TYPE_TENANT">
            组织机构根节点
          </span>
          <span v-if="data.type !== CONSTANTS.DICT_ORG_SETTING_TYPE_TENANT">
            {{ data.simple_name }}
          </span>
        </span>
        <span class="org_png">
          <em
            v-if="data.type === CONSTANTS.DICT_ORG_SETTING_TYPE_GROUP"
            class="group"
          >集团</em>
          <em
            v-else-if="data.type === CONSTANTS.DICT_ORG_SETTING_TYPE_COMPANY"
            class="company"
          >企业</em>
          <em
            v-else-if="data.type === CONSTANTS.DICT_ORG_SETTING_TYPE_DEPT"
            class="dept"
          >部门</em>
          <em
            v-else-if="data.type === CONSTANTS.DICT_ORG_SETTING_TYPE_POSITION"
            class="position"
          >岗位</em>
        </span>
      </span>
    </el-tree>
  </div>
</template>
<script>
import { getTreeListApi } from '@/api/20_master/org/org'
import { EventBus } from '@/common/eventbus/eventbus'

export default {
  data () {
    return {
      dataJson: {
        searchForm: {
          type: this.CONSTANTS.DICT_ORG_SETTING_TYPE_TENANT
        },
        treeData: [],
        currentJson: null,
        tempJson: {},
        tempJsonOriginal: {},
        filterText: ''
      },
      settings: {
        loading: false
      }
    }
  },
  created () {
    this.getDataList()
  },
  methods: {
    filterNode (value, data) {
      if (!value) return true
      return data.label.indexOf(value) !== -1
    },
    // 选中节点
    handleCurrentChange (row) {
      this.dataJson.currentJson = Object.assign({}, row) // copy obj
      this.dataJson.tempJsonOriginal = Object.assign({}, row) // copy obj
      this.dataJson.tempJson = Object.assign({}, row) // copy obj
      this.dataJson.currentJson = this.$refs.treeObject.getCurrentNode()
      this.dataJson.currentJson.currentkey = this.$refs.treeObject.getCurrentKey()
      EventBus.$emit(this.EMITS.EMIT_ORG_DIALOG_CHANGE, row)
    },
    getDataList () {
      // 查询逻辑
      this.settings.loading = true
      getTreeListApi(this.dataJson.searchForm).then(response => {
        this.dataJson.treeData = response.data
        this.getListAfterProcess()
        this.settings.loading = false
        this.$nextTick(() => {
          let current_node = null
          if (this.dataJson.currentJson === null) {
            current_node = this.dataJson.treeData[0]
            this.$refs.treeObject.setCurrentKey(this.dataJson.treeData[0].id)
            this.$refs.treeObject.getCurrentNode(current_node)
          } else {
            current_node = this.dataJson.currentJson
            this.$refs.treeObject.setCurrentKey(this.dataJson.currentJson.currentkey)
            this.$refs.treeObject.getCurrentNode(current_node)
          }
          this.handleCurrentChange(current_node)
        })
      }).finally(() => {
        this.settings.loading = false
      })
    },
    // 查询后处理
    getListAfterProcess () {
      if (Object.keys(this.dataJson.filterText).length !== 0) {
        this.$nextTick(() => {
          this.$refs.treeObject.filter(this.dataJson.filterText)
        })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
/* For Chrome and Safari */

.mytrees ::v-deep {
  .el-tree > .el-tree-node:after {
    border-top: none;
  }

  .el-tree-node {
    position: relative;
    padding-left: 2px;
  }

  .el-tree-node__expand-icon.is-leaf {
    border-left: 5px solid;
    border-top: 5px solid;
    border-bottom: 5px solid;
    border-image: url('~@/assets/images/hyphen.png') 1 fill stretch;
  }

  .el-tree-node__expand-icon.is-leaf.el-icon-caret-right:before {
    content: '';
  }

  .el-tree-node__children {
    padding-left: 20px;
  }

  .el-tree-node :last-child:before {
    height: 38px;
  }

  .el-tree > .el-tree-node:before {
    border-left: none;
  }

  .el-tree > .el-tree-node:after {
    border-top: none;
  }

  .el-tree-node:before {
    content: '';
    left: 2px;
    position: absolute;
    right: auto;
    border-width: 1px;
  }

  .el-tree-node:after {
    content: '';
    left: 2px;
    position: absolute;
    right: auto;
    border-width: 1px;
  }

  .el-tree-node:before {
    border-left: 1px solid #4386c6;
    bottom: 0px;
    height: 100%;
    top: -26px;
    width: 1px;
  }

  .el-icon--right {
    margin-left: 0px;
  }

  .el-tree > .el-tree-node {
    min-width: 100%;
    display: inline-block;
  }

  .el-tree-node__content > .el-tree-node__expand-icon {
    padding-left: 2px;
    padding-right: 2px;
  }
}

</style>

<style scoped>
/* For Chrome and Safari */
::-webkit-scrollbar {
  width: 5px;
}
/* For Firefox */
.mytrees {
  scrollbar-width: thin;
}
.el-aside {
  background-color: white;
  padding: 2px 3px;
}
.treeStyle {
  overflow: auto;
  border: 1px solid #ebeef5;
}
.folder {
  width: 20px;
  background: #888;
}

.custom-tree-container {
  display: -ms-flexbox;
  display: flex;
  margin: -24px;
}

.block {
  -ms-flex: 1;
  flex: 1;
  padding: 8px 24px 24px;
}

.block > p {
  text-align: center;
  margin: 0;
  line-height: 4;
}

.block:first-child {
  border-right: 1px solid #eff2f6;
}

.custom-tree-node {
  -ms-flex: 1;
  flex: 1;
  display: -ms-flexbox;
  display: flex;
  -ms-flex-align: center;
  align-items: center;
  -ms-flex-pack: justify;
  justify-content: space-between;
  font-size: 14px;
  padding-right: 8px;
}
.el-tree-node:focus > .el-tree-node__content {
  background-color: transparent !important;
}
</style>
