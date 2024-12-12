<template>
  <div>
    <el-dialog
      v-if="listenVisible"
      v-el-drag-dialog
      v-loading="settings.loading"
      element-loading-text="拼命加载中，请稍后..."
      element-loading-background="rgba(255, 255, 255, 0.7)"
      :title="settings.textMap"
      :visible="visible"
      :close-on-click-modal="PARAMETERS.DIALOG_CLOSE_BY_CLICK"
      :close-on-press-escape="PARAMETERS.DIALOG_CLOSE_BY_ESC"
      :show-close="PARAMETERS.DIALOG_SHOW_CLOSE"
      :append-to-body="true"
      :modal-append-to-body="true"
      width="700px"
      destroy-on-close
    >
      <div
        :style="{height: height + 'px'}"
        style="overflow-y:auto;overflow-x:auto;"
        class="mytree"
      >
        <el-tree
          ref="treeObject"
          :data="dataJson.treeData"
          :props="dataJson.defaultProps"
          :expand-on-click-node="false"
          :indent="0"
          highlight-current
          node-key="id"
          default-expand-all
          class="tree"
          draggable
          :allow-drop="allowDrop"
          :allow-drag="allowDrag"
          @node-drag-start="handleDragStart"
          @node-drag-enter="handleDragEnter"
          @node-drag-leave="handleDragLeave"
          @node-drag-over="handleDragOver"
          @node-drag-end="handleDragEnd"
          @node-drop="handleDrop"
          @current-change="handleCurrentChange"
        >
          <span
            slot-scope="{ node, data }"
            class="custom-tree-node"
          >
            <span>
              <svg-icon
                v-if="data.meta_icon"
                :icon-class="data.meta_icon"
                class="el-icon--right"
              />
              {{ data.label }}
            </span>
            <span class="menu_png">
              <em
                v-if="data.type ===CONSTANTS.DICT_SYS_MENU_TYPE_ROOT"
                class="root"
              >根结点</em>
              <em
                v-if="data.type ===CONSTANTS.DICT_SYS_MENU_TYPE_TOPNAV"
                class="top_nav"
              >顶部导航栏</em>
              <em
                v-if="data.type ===CONSTANTS.DICT_SYS_MENU_TYPE_NODE"
                class="node"
              >结点</em>
              <em
                v-if="data.type ===CONSTANTS.DICT_SYS_MENU_TYPE_PAGE"
                class="page"
              >页面</em>
              <em
                v-if="data.is_default"
                class="default"
              >默认菜单</em>
            </span>
          </span>
        </el-tree>
      </div>
      <div
        slot="footer"
        class="dialog-footer"
      >
        <el-divider />
        <el-button
          plain
          :disabled="settings.loading"
          @click="handleCancel()"
        >关闭</el-button>
      </div>
    </el-dialog>
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

  // .el-tree-node:after {
  //   border-top: 1px solid #4386c6;
  //   height: 20px;
  //   top: 12px;
  //   width: 8px;
  // }

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
import { dragsaveApi } from '@/api/20_master/menus/menu'
import elDragDialog from '@/directive/el-drag-dialog'
import { isNotEmpty } from '@/utils/index.js'
import constants_para from '@/common/constants/constants_para'
import '@/styles/menu_png.scss'

export default {
  components: {},
  directives: { elDragDialog },
  props: {
    height: {
      type: Number,
      default: 200
    },
    visible: {
      type: Boolean,
      default: false
    },
    id: {
      type: Number,
      default: null
    },
    sortData: {
      type: Array,
      default: null
    },
    dialogStatus: {
      type: String,
      default: constants_para.STATUS_VIEW
    }
  },
  data () {
    return {
      // 监听器
      watch: {
        unwatch_tempJson: null
      },
      dataJson: {
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
        // 弹出窗口状态名称
        dialogStatus: '',
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
        textMap: '拖动结点调整顺序'
      }
    }
  },
  computed: {
    // 是否为更新模式
    listenVisible () {
      return this.visible
    }
  },
  watch: {
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
  },
  mounted () {
  },
  methods: {
    getDataList () {
      // 查询逻辑
      this.settings.loading = true
      this.dataJson.treeData = this.sortData
      this.settings.loading = false
    },
    handleCurrentChange (row) {
      this.dataJson.currentJson = Object.assign({}, row) // copy obj
      this.dataJson.tempJsonOriginal = Object.assign({}, row) // copy obj
      this.dataJson.tempJson = Object.assign({}, row) // copy obj
      this.dataJson.currentJson = this.$refs.treeObject.getCurrentNode()
      this.dataJson.currentJson.currentkey = this.$refs.treeObject.getCurrentKey()
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
    handleDragStart (node, ev) {
    },
    handleDragEnter (draggingNode, dropNode, ev) {
    },
    handleDragLeave (draggingNode, dropNode, ev) {
    },
    handleDragOver (draggingNode, dropNode, ev) {
    },
    handleDragEnd (draggingNode, dropNode, dropType, ev) {
    },
    /**
     * 拖拽结束后事件
     * draggingNode:被拖拽结点对应的 Node
     * dropNode:结束拖拽时最后进入的结点
     * dropType:被拖拽结点的放置位置（before、after、inner）
     * ev:event
     */
    handleDrop (draggingNode, dropNode, dropType, ev) {
      // 进入结点，作为子结点
      if (dropType === 'inner') {
        // 获取老子的id
        const parent_id = dropNode.data.id
        // 获取儿子
        draggingNode.data.parent_id = parent_id
      }
      if (dropType === 'before') {
        // 获取老子的id
        const parent_id = dropNode.data.parent_id
        // 获取儿子
        draggingNode.data.parent_id = parent_id
      }
      if (dropType === 'after') {
        // 获取老子的id
        const parent_id = dropNode.data.parent_id
        // 获取儿子
        draggingNode.data.parent_id = parent_id
      }
      this.doDragSave()
    },
    doDragSave () {
      this.settings.loading = true
      dragsaveApi(this.dataJson.treeData).then((_data) => {
        this.$notify({
          title: '更新处理成功',
          message: _data.message,
          type: 'success',
          duration: this.settings.duration
        })
        // 查询
        this.getDataList()
        this.getDataList()
      }, (_error) => {
        this.$notify({
          title: '更新处理失败',
          message: _error.message,
          type: 'error',
          duration: this.settings.duration
        })
      }).finally(() => {
        this.settings.loading = false
      })
    },
    allowDrop (draggingNode, dropNode, type) {
      // 不得放到根目录之后，平级
      switch (draggingNode.data.type) {
        // 根结点
        case this.CONSTANTS.DICT_SYS_MENU_TYPE_ROOT:
          return false
        // 顶部导航栏
        case this.CONSTANTS.DICT_SYS_MENU_TYPE_TOPNAV:
          switch (dropNode.data.type) {
            case this.CONSTANTS.DICT_SYS_MENU_TYPE_ROOT:
              return false
            case this.CONSTANTS.DICT_SYS_MENU_TYPE_TOPNAV:
              if (type === 'inner') {
                return false
              } else {
                return true
              }
            case this.CONSTANTS.DICT_SYS_MENU_TYPE_NODE:
              return false
            case this.CONSTANTS.DICT_SYS_MENU_TYPE_PAGE:
              return false
          }
          break
        // 结点
        case this.CONSTANTS.DICT_SYS_MENU_TYPE_NODE:
          switch (dropNode.data.type) {
            case this.CONSTANTS.DICT_SYS_MENU_TYPE_ROOT:
              return false
            case this.CONSTANTS.DICT_SYS_MENU_TYPE_TOPNAV:
              if (type === 'inner') {
                return true
              } else {
                return false
              }
            case this.CONSTANTS.DICT_SYS_MENU_TYPE_NODE:
              return true
            case this.CONSTANTS.DICT_SYS_MENU_TYPE_PAGE:
              return false
          }
          break
        // 页面
        case this.CONSTANTS.DICT_SYS_MENU_TYPE_PAGE:
          switch (dropNode.data.type) {
            case this.CONSTANTS.DICT_SYS_MENU_TYPE_ROOT:
              return false
            case this.CONSTANTS.DICT_SYS_MENU_TYPE_TOPNAV:
              if (type === 'inner') {
                return true
              } else {
                return false
              }
            case this.CONSTANTS.DICT_SYS_MENU_TYPE_NODE:
              return true
            case this.CONSTANTS.DICT_SYS_MENU_TYPE_PAGE:
              if (type === 'inner') {
                return false
              } else {
                return true
              }
          }
          break
      }
      return false
    },
    // 允许拖拽的情况
    allowDrag (draggingNode) {
      if (isNotEmpty(draggingNode.data.parent_id)) {
        return true
      } else {
        return false
      }
    },
    // 取消按钮
    handleCancel () {
      this.$emit('closeMeCancel')
    }
  }
}
</script>
