<template>
  <div>
    <el-input
      ref="minusLeftFilterInput"
      v-model="dataJson.filterText"
      class="filterInput"
      placeholder="输入关键字进行过滤"
      style="width:calc(100% - 120px)"
      @input="handlerFilterTextInput"
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
          content="新增仓库分组关系"
          placement="top-start"
        >
          <el-button
            type="primary"
            icon="el-icon-plus"
            style="padding:7px 7px"
            :disabled="settings.btnDisabledStatus.disabledInsert"
            @click="handleInsert"
          />
        </el-tooltip>
        <el-tooltip
          class="item"
          effect="dark"
          content="修改仓库组名称"
          placement="top"
        >
          <el-button
            type="primary"
            icon="el-icon-edit"
            style="padding:7px 7px"
            :disabled="settings.btnDisabledStatus.disabledUpdate"
            @click="handleUpdate"
          />
        </el-tooltip>
        <el-tooltip
          class="item"
          effect="dark"
          content="删除当前选中的仓库分组"
          placement="top"
        >
          <el-button
            type="danger"
            icon="el-icon-delete"
            style="padding:7px 7px"
            :disabled="settings.btnDisabledStatus.disabledDelete"
            @click="handleDelete"
          />
        </el-tooltip>
        <el-tooltip
          class="item"
          effect="dark"
          content="刷新所仓库分组"
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
            <span v-if="data.type === '0'">
              根节点组
            </span>
            <span v-if="data.type !== '0'">
              {{ data.name }}
            </span>
          </span>
          <span class="org_png">
            <el-tag
              v-if="data.type === CONSTANTS.DICT_B_WAREHOUSE_GROUP_1"
              size="mini"
              effect="dark"
              type="success"
            >一级</el-tag>
            <el-tag
              v-if="data.type === CONSTANTS.DICT_B_WAREHOUSE_GROUP_2"
              size="mini"
              effect="dark"
              type="info"
            >二级</el-tag>
            <el-tag
              v-if="data.type === CONSTANTS.DICT_B_WAREHOUSE_GROUP_3"
              size="mini"
              effect="dark"
              type="warning"
            >三级</el-tag>
            <el-checkbox
              v-model="data.is_enable"
              style="padding-left: 10px"
              @change="handleCheck(data)"
            />
          </span>
        </span>
      </el-tree>
    </div>

    <one-dialog
      v-if="popSettingsData.searchDialogDataOne.visible"
      :id="popSettingsData.searchDialogDataOne.id"
      :visible="popSettingsData.searchDialogDataOne.visible"
      :dialog-status="popSettingsData.searchDialogDataOne.status"
      :type="popSettingsData.searchDialogDataOne.type"
      @closeMeOk="handleOneCloseOk"
      @closeMeCancel="handleOneCloseCancel"
    />

    <two-dialog
      v-if="popSettingsData.searchDialogDataTwo.visible"
      :id="popSettingsData.searchDialogDataTwo.id"
      :visible="popSettingsData.searchDialogDataTwo.visible"
      :dialog-status="popSettingsData.searchDialogDataTwo.status"
      :type="popSettingsData.searchDialogDataTwo.type"
      @closeMeOk="handleTwoCloseOk"
      @closeMeCancel="handleTwoCloseCancel"
    />

    <three-dialog
      v-if="popSettingsData.searchDialogDataThree.visible"
      :id="popSettingsData.searchDialogDataThree.id"
      :visible="popSettingsData.searchDialogDataThree.visible"
      :dialog-status="popSettingsData.searchDialogDataThree.status"
      :type="popSettingsData.searchDialogDataThree.type"
      @closeMeOk="handleThreeCloseOk"
      @closeMeCancel="handleThreeCloseCancel"
    />

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
import { getTreeListApi, insertApi, deleteApi, dragsaveApi } from '@/api/20_master/relation/relation'
import elDragDialog from '@/directive/el-drag-dialog'
import oneDialog from '@/views/20_master/relation/left/dialog/edit_group'
import twoDialog from '@/views/20_master/relation/left/dialog/edit_group'
import threeDialog from '@/views/20_master/relation/left/dialog/edit_group'
import { isNotEmpty } from '@/utils/index.js'
import '@/styles/org_png.scss'
// import { MessageBox } from 'element-ui'
// import deepCopy from 'deep-copy'

export default {
  components: { oneDialog, twoDialog, threeDialog },
  directives: { elDragDialog },
  props: {
    height: {
      type: Number,
      default: 200
    },
    serialData: {
      type: Object,
      default: null
    }
  },
  data () {
    return {
      dataJson: {
        // 查询使用的json
        searchForm: {
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
        }
      },
      popSettingsData: {
        // 弹出窗口状态名称
        dialogStatus: '',
        btnDisabledStatus: {
          disabledOK: false
        },
        // 弹出的查询框参数设置
        searchDialogDataOne: {
          // id
          id: null,
          // 弹出框显示参数
          visible: false,
          // 类型（1:一级，2:二级，3:三级）
          type: null,
          // 弹出框状态
          status: this.PARAMETERS.STATUS_VIEW,
          // 点击确定以后返回的值
          selectedDataJson: {}
        },
        // 弹出的查询框参数设置
        searchDialogDataTwo: {
          // id
          id: null,
          // 弹出框显示参数
          visible: false,
          // 类型（1:一级，2:二级，3:三级）
          type: null,
          // 弹出框状态
          status: this.PARAMETERS.STATUS_VIEW,
          // 点击确定以后返回的值
          selectedDataJson: {}
        },
        // 弹出的查询框参数设置
        searchDialogDataThree: {
          // id
          id: null,
          // 弹出框显示参数
          visible: false,
          // 类型（1:一级，2:二级，3:三级）
          type: null,
          // 弹出框状态
          status: this.PARAMETERS.STATUS_VIEW,
          // 点击确定以后返回的值
          selectedDataJson: {}
        }
      }
    }
  },
  computed: {
  },
  watch: {
    // 'dataJson.filterText': {
    //   handler (newVal, oldVal) {
    //     this.$refs.treeObject.filter(newVal)
    //   }
    // },
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
            if (this.dataJson.currentJson.type === this.CONSTANTS.DICT_B_WAREHOUSE_GROUP_1) {
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
    this.$on(this.EMITS.EMIT_RELATION_LEFT, _data => {
      this.handleRefresh()
    })
  },
  mounted () {
    this.initSearchButton()
    // 和right开始绑定事件
    // 描绘完成
    this.$on(this.EMITS.EMIT_RELATION_LOADING, _data => { this.settings.loading = true })
    this.$on(this.EMITS.EMIT_RELATION_LOADING_OK, _data => { this.settings.loading = false })
  },
  methods: {
    handlerFilterTextInput () {
      this.$refs.treeObject.filter(this.dataJson.filterText)
    },
    // 选择or重置按钮的初始化
    initSearchButton () {
      this.$nextTick(() => {
        this.$refs.buttonSearch.$el.parentElement.className = ' buttonSearch ' + this.$refs.buttonSearch.$el.parentElement.className
      })
    },
    filterNode (value, data) {
      console.log(data)
      if (!value) return true
      if (data.label.indexOf(value) !== -1) {
        return true
      }
      if (data.warehouse_name != null && data.warehouse_name.indexOf(value) !== -1) {
        return true
      }
    },
    getDataList () {
      // 查询逻辑
      this.settings.loading = true
      const searchCondition = (!isNotEmpty(this.serialData)) ? this.dataJson.searchForm : this.serialData

      getTreeListApi(searchCondition).then(response => {
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
        this.$emit(this.EMITS.EMIT_RELATION_LEFT_CHECKED, this.dataJson.treeData)
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
      this.$off(this.EMITS.EMIT_RELATION_CHANGE)
      this.$emit(this.EMITS.EMIT_RELATION_CHANGE, row)
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
    // 点击新增子结构按钮
    handleInsert () {
      // 新增
      this.popSettingsData.dialogStatus = this.PARAMETERS.STATUS_INSERT
      switch (this.dataJson.currentJson.level - 1) {
        case 0:
          // 根目录，向下新增第一级
          this.popSettingsData.searchDialogDataOne.visible = true
          this.popSettingsData.searchDialogDataOne.status = this.PARAMETERS.STATUS_INSERT
          this.popSettingsData.searchDialogDataOne.type = String(this.dataJson.currentJson.level)
          break
        case 1:
          // 第一级，向下新增第二级
          this.popSettingsData.searchDialogDataTwo.visible = true
          this.popSettingsData.searchDialogDataTwo.status = this.PARAMETERS.STATUS_INSERT
          this.popSettingsData.searchDialogDataTwo.type = String(this.dataJson.currentJson.level)
          break
        case 2:
          // 第二级，向下新增第三级
          this.popSettingsData.searchDialogDataThree.visible = true
          this.popSettingsData.searchDialogDataThree.status = this.PARAMETERS.STATUS_INSERT
          this.popSettingsData.searchDialogDataThree.type = String(this.dataJson.currentJson.level)
          break
      }
    },

    // 修改当前结点按钮
    handleUpdate () {
      // 修改
      this.popSettingsData.dialogStatus = this.PARAMETERS.STATUS_UPDATE
      switch (this.dataJson.currentJson.level - 1) {
        case 1:
          // 第一级，编辑
          this.popSettingsData.searchDialogDataOne.visible = true
          this.popSettingsData.searchDialogDataOne.status = this.PARAMETERS.STATUS_UPDATE
          this.popSettingsData.searchDialogDataOne.id = this.dataJson.currentJson.serial_id
          break
        case 2:
          // 第二级，编辑
          this.popSettingsData.searchDialogDataTwo.visible = true
          this.popSettingsData.searchDialogDataTwo.status = this.PARAMETERS.STATUS_UPDATE
          this.popSettingsData.searchDialogDataTwo.id = this.dataJson.currentJson.serial_id
          break
        case 3:
          // 第三级，编辑
          this.popSettingsData.searchDialogDataThree.visible = true
          this.popSettingsData.searchDialogDataThree.status = this.PARAMETERS.STATUS_UPDATE
          this.popSettingsData.searchDialogDataThree.id = this.dataJson.currentJson.serial_id
          break
      }
    },
    handleDelete () {
      this.$confirm('请注意：即将删除当前选择结点以及【子结点】的数据，而且不能恢复。', '确认信息', {
        distinguishCancelAndClose: true,
        confirmButtonText: '确定删除',
        cancelButtonText: '取消'
      }).then(() => {
        this.doDelete()
      }).catch(action => {
        // 右上角X
        // if (action !== 'close') {
        //   //
        // }
      })
    },
    handleRefresh () {
      // 初始化查询
      this.getDataList()
    },
    doDelete () {
      // 删除当前结点和子结点
      deleteApi(this.dataJson.tempJson).then((_data) => {
        this.$notify({
          title: '新增处理成功',
          message: _data.message,
          type: 'success',
          duration: this.settings.duration
        })
        // 查询
        this.dataJson.currentJson = null
        this.getDataList()
        this.settings.loading = false
      }, (_error) => {
        this.$notify({
          title: '新增处理失败',
          message: _error.message,
          type: 'error',
          duration: this.settings.duration
        })
      }).finally(() => {
        this.settings.loading = false
      })
    },
    // --------------弹出查询框：开始--------------
    // 集团：关闭对话框：确定
    handleOneCloseOk (val) {
      this.popSettingsData.searchDialogDataOne.selectedDataJson = val.data.data
      this.popSettingsData.searchDialogDataOne.visible = false
      this.settings.loading = true
      let _type
      switch (this.dataJson.currentJson.level) {
        case 1:
          _type = this.CONSTANTS.DICT_B_WAREHOUSE_GROUP_1
          break
        case 2:
          _type = this.CONSTANTS.DICT_B_WAREHOUSE_GROUP_2
          break
        case 3:
          _type = this.CONSTANTS.DICT_B_WAREHOUSE_GROUP_3
          break
      }
      if (this.popSettingsData.dialogStatus === this.PARAMETERS.STATUS_INSERT) {
        insertApi({
          serial_id: this.popSettingsData.searchDialogDataOne.selectedDataJson.id,
          type: _type,
          parent_id: this.dataJson.currentJson.id
        }).then((_data) => {
          this.$notify({
            title: '新增处理成功',
            message: _data.message,
            type: 'success',
            duration: this.settings.duration
          })
          // 查询
          this.getDataList()
        }, (_error) => {
          this.$notify({
            title: '新增处理失败',
            message: _error.message,
            type: 'error',
            duration: this.settings.duration
          })
        }).finally(() => {
          this.settings.loading = false
        })
      } else {
        this.settings.loading = true
        this.popSettingsData.searchDialogDataOne.selectedDataJson = val.data.data
        this.popSettingsData.searchDialogDataOne.visible = false
        this.handleRefresh()
        this.settings.loading = false
      }
    },
    // 集团：关闭对话框：取消
    handleOneCloseCancel () {
      this.popSettingsData.searchDialogDataOne.visible = false
    },
    // 企业：关闭对话框：确定
    handleTwoCloseOk (val) {
      this.popSettingsData.searchDialogDataTwo.selectedDataJson = val.data.data
      this.popSettingsData.searchDialogDataTwo.visible = false
      this.settings.loading = true
      let _type
      switch (this.dataJson.currentJson.level) {
        case 1:
          _type = this.CONSTANTS.DICT_B_WAREHOUSE_GROUP_1
          break
        case 2:
          _type = this.CONSTANTS.DICT_B_WAREHOUSE_GROUP_2
          break
        case 3:
          _type = this.CONSTANTS.DICT_B_WAREHOUSE_GROUP_3
          break
      }
      if (this.popSettingsData.dialogStatus === this.PARAMETERS.STATUS_INSERT) {
        insertApi({
          serial_id: this.popSettingsData.searchDialogDataTwo.selectedDataJson.id,
          type: _type,
          parent_id: this.dataJson.currentJson.id
        }).then((_data) => {
          this.$notify({
            title: '新增处理成功',
            message: _data.message,
            type: 'success',
            duration: this.settings.duration
          })
          // 查询
          this.getDataList()
        }, (_error) => {
          this.$notify({
            title: '新增处理失败',
            message: _error.message,
            type: 'error',
            duration: this.settings.duration
          })
        }).finally(() => {
          this.settings.loading = false
        })
      } else {
        this.settings.loading = true
        this.popSettingsData.searchDialogDataTwo.selectedDataJson = val.data.data
        this.popSettingsData.searchDialogDataTwo.visible = false
        this.handleRefresh()
        this.settings.loading = false
      }
    },
    // 企业：关闭对话框：取消
    handleTwoCloseCancel () {
      this.popSettingsData.searchDialogDataTwo.visible = false
    },
    // 部门：关闭对话框：确定
    handleThreeCloseOk (val) {
      this.popSettingsData.searchDialogDataThree.selectedDataJson = val.data.data
      this.popSettingsData.searchDialogDataThree.visible = false
      this.settings.loading = true
      let _type
      switch (this.dataJson.currentJson.level) {
        case 1:
          _type = this.CONSTANTS.DICT_B_WAREHOUSE_GROUP_1
          break
        case 2:
          _type = this.CONSTANTS.DICT_B_WAREHOUSE_GROUP_2
          break
        case 3:
          _type = this.CONSTANTS.DICT_B_WAREHOUSE_GROUP_3
          break
      }
      if (this.popSettingsData.dialogStatus === this.PARAMETERS.STATUS_INSERT) {
        insertApi({
          serial_id: this.popSettingsData.searchDialogDataThree.selectedDataJson.id,
          type: _type,
          parent_id: this.dataJson.currentJson.id
        }).then((_data) => {
          this.$notify({
            title: '新增处理成功',
            message: _data.message,
            type: 'success',
            duration: this.settings.duration
          })
          // 查询
          this.getDataList()
        }, (_error) => {
          this.$notify({
            title: '新增处理失败',
            message: _error.message,
            type: 'error',
            duration: this.settings.duration
          })
        }).finally(() => {
          this.settings.loading = false
        })
      } else {
        this.settings.loading = true
        this.popSettingsData.searchDialogDataThree.selectedDataJson = val.data.data
        this.popSettingsData.searchDialogDataThree.visible = false
        this.handleRefresh()
        this.settings.loading = false
      }
    },
    // 部门：关闭对话框：取消
    handleThreeCloseCancel () {
      this.popSettingsData.searchDialogDataThree.visible = false
    },
    // --------------弹出查询框：结束--------------
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
      this.$off(this.EMITS.EMIT_RELATION_LOADING)
      this.$emit(this.EMITS.EMIT_RELATION_LOADING)
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
        this.$off(this.EMITS.EMIT_RELATION_LOADING_OK)
        this.$emit(this.EMITS.EMIT_RELATION_LOADING_OK)
      }, (_error) => {
        this.$notify({
          title: '更新处理失败',
          message: _error.message,
          type: 'error',
          duration: this.settings.duration
        })
        this.$off(this.EMITS.EMIT_RELATION_LOADING_OK)
        this.$emit(this.EMITS.EMIT_RELATION_LOADING_OK)
      }).finally(() => {
        this.settings.loading = false
      })
    },
    allowDrop (draggingNode, dropNode, type) {
      // if (type !== 'inner') {
      //   return false
      // }
      // 不得放到根目录之前
      if (!isNotEmpty(dropNode.data.parent_id)) {
        return false
      }
      // 不得放到根目录之后，平级
      if (!isNotEmpty(dropNode.data.parent_id)) {
        return false
      }
      switch (draggingNode.data.type) {
        case this.CONSTANTS.DICT_ORG_SETTING_TYPE_GROUP:
          // 集团可嵌套，必须在租户下
          switch (dropNode.data.type) {
            case this.CONSTANTS.DICT_ORG_SETTING_TYPE_GROUP:
              return true
            case this.CONSTANTS.DICT_ORG_SETTING_TYPE_TENANT:
              return true
          }
          break
        case this.CONSTANTS.DICT_ORG_SETTING_TYPE_COMPANY:
          // 企业必须在集团下
          switch (dropNode.data.type) {
            case this.CONSTANTS.DICT_ORG_SETTING_TYPE_GROUP:
              if (dropNode.data.code.length <= 8 && type === 'prev') {
                return false
              }
              return true
            case this.CONSTANTS.DICT_ORG_SETTING_TYPE_COMPANY:
              if (type === 'inner') {
                return false
              }
              return true
          }
          break
        case this.CONSTANTS.DICT_ORG_SETTING_TYPE_DEPT:
          switch (dropNode.data.type) {
            case this.CONSTANTS.DICT_ORG_SETTING_TYPE_GROUP:
              return false
            case this.CONSTANTS.DICT_ORG_SETTING_TYPE_COMPANY:
              if (type === 'inner') {
                return true
              }
              break
            case this.CONSTANTS.DICT_ORG_SETTING_TYPE_DEPT:
              return true
          }
          break
        case this.CONSTANTS.DICT_ORG_SETTING_TYPE_POSITION:
          switch (dropNode.data.type) {
            case this.CONSTANTS.DICT_ORG_SETTING_TYPE_GROUP:
              return false
            case this.CONSTANTS.DICT_ORG_SETTING_TYPE_COMPANY:
              return false
            case this.CONSTANTS.DICT_ORG_SETTING_TYPE_DEPT:
              if (type === 'inner') {
                return true
              }
              break
            case this.CONSTANTS.DICT_ORG_SETTING_TYPE_POSITION:
              if (type !== 'inner') {
                return true
              }
              break
          }
          break
        case this.CONSTANTS.DICT_ORG_SETTING_TYPE_STAFF:
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
    // 点击checkbox
    handleCheck (val) {
      if (val.children) {
        this.doCheckone(val)
      }
      // 设置dialog的返回
      this.$store.dispatch('popUpSearchDialog/selectedDataJson', Object.assign({}, this.dataJson.treeData))

      // 通知兄弟组件
      this.$off(this.EMITS.EMIT_RELATION_LEFT_CHECKED)
      this.$emit(this.EMITS.EMIT_RELATION_LEFT_CHECKED, this.dataJson.treeData)
    },
    doCheckone (val) {
      // 总共三级，所以不需要递归，直接做
      if (val.children) {
        this.doChecktwo(val.children, val.is_enable)
      }
    },
    doChecktwo (children, value) {
      for (const _child of children) {
        _child.is_enable = value
        if (_child.children) {
          this.doCheckthree(_child.children, value)
        }
      }
    },
    doCheckthree (children, value) {
      for (const _child of children) {
        _child.is_enable = value
        if (_child.children) {
          this.doCheckfour(_child.children, value)
        }
      }
    },
    doCheckfour (children, value) {
      for (const _child of children) {
        _child.is_enable = value
      }
    }
  }
}
</script>
