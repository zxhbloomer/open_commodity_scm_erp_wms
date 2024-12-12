<template>
  <div style="position: relative">
    <perfect-overLay
      v-if="settings.tree.disabled"
      :value="settings.tree.disabled"
      @click="handleOverLayClick"
    />
    <el-input
      ref="minusLeftFilterInput"
      v-model="dataJson.filterText"
      class="filterInput"
      placeholder="输入关键字进行过滤"
      style="width:calc(100% - 35px)"
    >
      <el-button
        slot="append"
        ref="buttonSearch"
        icon="el-icon-search"
        class="buttonSearch"
        @click="handleButtonSearch"
      />
    </el-input>
    <div class="floatRight">
      <el-button-group>
        <el-tooltip
          class="item"
          effect="dark"
          content="刷新所有组织"
          placement="top-end"
        >
          <el-button
            type="info"
            icon="el-icon-refresh-right"
            style="padding:7px 7px"
            @click="handleRefresh"
          />
        </el-tooltip>
      </el-button-group>
    </div>
    <div
      :style="{height: height + 'px'}"
      style="overflow-y:auto;overflow-x:auto;"
      class="mytree"
    >
      <el-tree
        ref="treeObject"
        :data="dataJson.treeData"
        :props="dataJson.defaultProps"
        :filter-node-method="filterNode"
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
            {{ data.simple_name }}
            <el-link
              v-if="data.type === CONSTANTS.DICT_ORG_SETTING_TYPE_DEPT"
              type="danger"
              style="vertical-align:top"
            >
              <span v-if="data.dept_permission_count">
                ({{ data.dept_permission_count }})
              </span>
              <span v-else>
                (0)
              </span>
            </el-link>
          </span>
          <!-- <span>[{{ data.type_text }}]</span> -->
          <span class="org_png">
            <em
              v-if="data.type === CONSTANTS.DICT_ORG_SETTING_TYPE_TENANT"
              class="tenant"
            >租户</em>
            <em
              v-else-if="data.type === CONSTANTS.DICT_ORG_SETTING_TYPE_GROUP"
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
  </div>
</template>

<style scoped>
.floatRight {
  float: right;
}
.floatLeft {
  float: left;
}
</style>

<style scoped>
.treeStyle {
  overflow: auto;
  border: 1px solid #ebeef5;
}
.filterInput {
  margin-bottom: 10px;
}

.leaf {
  width: 20px;
  background: #ddd;
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

<style lang="scss" scoped>
.mytree ::v-deep {
  .el-tree > .el-tree-node:after {
    border-top: none;
  }

  // .el-tree-node__content {
  //   margin-left: -20px;
  // }

  .el-tree-node {
    position: relative;
    padding-left: 2px;
  }
  //结点有间隙，隐藏掉展开按钮就好了,如果觉得空隙没事可以删掉
  .el-tree-node__expand-icon.is-leaf {
    // display: none;
    // color: transparent;
    border-left: 5px solid;
    border-top: 5px solid;
    border-bottom: 5px solid;
    // height: 10px;
    // top: 12px;
    // width: 8px;
    // margin-right: 8px;
    // assets使用方法
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
    // padding: 2px
    padding-left: 2px;
    padding-right: 2px;
  }
}
</style>

<style >
.buttonSearch {
  color: #ffffff;
  background-color: #1890ff;
  border-color: #1890ff;
}
</style>

<script>
import { getTreeListApi } from '@/api/20_master/permission/org/org'
import elDragDialog from '@/directive/el-drag-dialog'
import '@/styles/org_png.scss'
import perfectOverLay from '@/components/99_util/overlay'

export default {
  components: { perfectOverLay },
  directives: { elDragDialog },
  props: {
    height: {
      type: Number,
      default: 200
    }
  },
  data () {
    return {
      dataJson: {
        // 查询使用的json
        searchForm: {
          type: this.CONSTANTS.DICT_ORG_SETTING_TYPE_TENANT
        },
        // 下拉选项json
        selectOptions: [],
        filterText: '',
        treeData: [],
        // 单条数据 json
        currentJson: null,
        tempJson: {
          org_type: ''
        },
        tempJsonOriginal: null
      },
      // 页面设置json
      settings: {
        para: this.CONSTANTS.DICT_ORG_SETTING_TYPE,
        filterPara: [],
        loading: true,
        // 按钮状态：是否可用
        btnDisabledStatus: {
          disabledInsert: true,
          disabledUpdate: true,
          disabledDelete: true
        },
        defaultProps: {
          children: 'children',
          label: 'label'
        },
        tree: {
          disabled: false
        }
      },
      popSettingsData: {
        // 弹出窗口状态名称
        dialogStatus: '',
        dialogFormVisible: false,
        btnDisabledStatus: {
          disabledOK: false
        }
      }
    }
  },
  computed: {
  },
  watch: {
    'dataJson.filterText': {
      handler (newVal, oldVal) {
        this.$refs.treeObject.filter(newVal)
      }
    },
    'dataJson.currentJson': {
      handler (newVal, oldVal) {
        if (newVal !== null) {
          // 判断是否是第一个结点：第一个结点是租户，所以不能删除，修改，只能新增
          if (this.dataJson.currentJson.parent_id === null) {
            this.settings.btnDisabledStatus.disabledInsert = false
            this.settings.btnDisabledStatus.disabledUpdate = true
            this.settings.btnDisabledStatus.disabledDelete = true
          } else {
            // 判断是否是岗位结点
            if (this.dataJson.currentJson.type === this.CONSTANTS.DICT_ORG_SETTING_TYPE_POSITION) {
              this.settings.btnDisabledStatus.disabledInsert = false
              this.settings.btnDisabledStatus.disabledUpdate = false
              this.settings.btnDisabledStatus.disabledDelete = false
            } else {
              this.settings.btnDisabledStatus.disabledInsert = false
              this.settings.btnDisabledStatus.disabledUpdate = false
              this.settings.btnDisabledStatus.disabledDelete = false
            }
          }
        } else {
          this.settings.btnDisabledStatus.disabledInsert = true
          this.settings.btnDisabledStatus.disabledUpdate = true
          this.settings.btnDisabledStatus.disabledDelete = true
        }
      }
    },
    'settings.loading': {
      handler (newVal, oldVal) {
        switch (newVal) {
          case true:
            this.showLoading('正在查询，请稍后...')
            break
          case false:
            this.closeLoading()
            break
        }
      }
    }
  },
  created () {
    // 初始化查询
    this.getDataList()
    this.$on(this.EMITS.EMIT_PERMISSION_DEPT_LEFT, _data => {
      this.handleRefresh()
    })
  },
  mounted () {
    this.initSearchButton()
    // 和right开始绑定事件
    // 描绘完成
    this.$on(this.EMITS.EMIT_PERMISSION_DEPT_LOADING, _data => { this.settings.loading = true })
    this.$on(this.EMITS.EMIT_PERMISSION_DEPT_LOADING_OK, _data => { this.settings.loading = false })
    // 开始编辑操作权限时，接收兄弟信息，把tree设置为不可用
    this.$on(this.EMITS.EMIT_PERMISSION_DEPT_OPERATE_EDIT, _data => {
      this.settings.tree.disabled = true
    })
    this.$on(this.EMITS.EMIT_PERMISSION_DEPT_OPERATE_INFO, _data => {
      this.settings.tree.disabled = true
    })
    // 操作权限编辑完成后，接收兄弟信息，把tree设置为可用
    this.$on(this.EMITS.EMIT_PERMISSION_DEPT_OPERATE_EDIT_OK, _data => {
      this.settings.tree.disabled = false
    })
    this.$on(this.EMITS.EMIT_PERMISSION_DEPT_OPERATE_INFO_OK, _data => {
      this.settings.tree.disabled = false
    })
  },
  methods: {
    // 选择or重置按钮的初始化
    initSearchButton () {
      this.$nextTick(() => {
        this.$refs.buttonSearch.$el.parentElement.className = ' buttonSearch ' + this.$refs.buttonSearch.$el.parentElement.className
      })
    },
    filterNode (value, data) {
      if (!value) return true
      return data.label.indexOf(value) !== -1 || data.type_text.indexOf(value) !== -1
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
    handleCurrentChange (row) {
      this.dataJson.currentJson = Object.assign({}, row) // copy obj
      this.dataJson.tempJsonOriginal = Object.assign({}, row) // copy obj
      this.dataJson.tempJson = Object.assign({}, row) // copy obj
      this.dataJson.currentJson = this.$refs.treeObject.getCurrentNode()
      this.dataJson.currentJson.currentkey = this.$refs.treeObject.getCurrentKey()
      // 通知兄弟组件
      this.$off(this.EMITS.EMIT_PERMISSION_DEPT_CHANGE)
      this.$emit(this.EMITS.EMIT_PERMISSION_DEPT_CHANGE, row)
    },
    // 兄弟组件发过来的调用请求
    handleDataChange () {
      // 查询
      this.getDataList()
    },
    handleButtonSearch () {
      // 查询
      this.getDataList()
    },
    // 查询后处理
    getListAfterProcess () {
      if (Object.keys(this.dataJson.filterText).length !== 0) {
        this.$nextTick(() => {
          this.$refs.treeObject.filter(this.dataJson.filterText)
        })
      }
    },
    handleRefresh () {
      // 初始化查询
      this.getDataList()
    },
    // 悬浮层点击事件
    handleOverLayClick () {
      this.$alert('点击无效，请完成操作权限的编辑，并点击保存！', '提示', {
        confirmButtonText: '关闭',
        type: 'error'
      }).then(() => {

      })
    }
  }
}
</script>
