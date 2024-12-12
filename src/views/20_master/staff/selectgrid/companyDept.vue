<template>
  <div class="el-select">
    <el-input
      ref="refSelectGrid"
      v-model.trim="value"
      v-popover:popover
      :placeholder="placeholder"
      :disabled="disabled"
      readonly
      style="cursor:pointer"
      @click.native="handleClick"
      @keydown.native.enter.prevent="handleClick"
      @keydown.native.esc.stop.prevent="settings.visible = false"
      @keydown.native.tab="settings.visible = false"
    >
      <template slot="suffix">
        <i
          v-if="isDataSet() && !disabled"
          class="el-input__icon el-icon-circle-close el-input__clear"
          @click.stop="clearMe"
        />
        <i
          v-show="!showClose"
          :class="['el-select__caret', 'el-input__icon', 'el-icon-' + iconClass]"
        />
        <i
          v-if="showClose"
          class="el-select__caret el-input__icon el-icon-circle-close"
        />
      </template>
    </el-input>
    <el-popover
      ref="popover"
      v-model="settings.visible"
      :title="title"
      width="400"
      trigger="manual"
      popper-class="perfect_popper"
    >
      <el-container>
        <el-header>请选择{{ showTitle }}</el-header>
        <el-main>
          <el-input
            ref="refFocus"
            v-model="dataJson.filterText"
            class="filterInput"
            placeholder="输入关键字进行过滤"
            style="width:calc(100% - 40px)"
            @keyup.enter.native="handleButtonSearch"
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
            <el-popconfirm
              confirm-button-text="确定"
              cancel-button-text="取消"
              icon="el-icon-info"
              icon-color="red"
              title="点击确定后跳转到组织机构页面，请注意保存当前数据。"
              @confirm="handleForward"
            >
              <el-button
                slot="reference"
                type="primary"
                icon="el-icon-edit"
                style="padding:7px 7px; height:27px"
              />
            </el-popconfirm>
          </div>
          <div
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
                  {{ node.label }}
                </span>
                <span>[{{ data.type_text }}]</span>
              </span>
            </el-tree>
          </div>
        </el-main>
        <el-footer style="text-align:right">
          <el-divider />
          <div class="floatLeft">
            <el-button
              type="danger"
              @click="doReset()"
            >刷新</el-button>
          </div>
          <el-button
            plain
            :disabled="settings.loading"
            @click="settings.visible = false"
          >取消</el-button>
          <el-button
            plain
            :disabled="settings.loading || settings.btnDisabledStatus.disabledOk "
            type="primary"
            @click="handleOk()"
          >确定</el-button>
        </el-footer>
      </el-container>
    </el-popover>
  </div>
</template>

<style>
.pointer_cursor {
  cursor: pointer;
}
.popper-class {
  padding: 0;
}
.popper-class[x-placement^='bottom'] .popper__arrow::after {
  border-bottom-color: #115aa5;
}
</style>

<style scoped>
.floatRight {
  float: right;
}
.floatLeft {
  float: left;
}
</style>

<style scoped>
.mytree {
  max-height: 300px;
  overflow: auto;
}
.el-header {
  padding: 10px 10px 10px 10px;
  background: #115aa5;
  color: #fff;
  height: 100% !important;
}

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
    color: transparent;
    border-top: 1px solid #4386c6;
    height: 3px;
    top: 12px;
    width: 8px;
    margin-right: 8px;
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
    padding: 2px;
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
import { getTreeListApi } from '@/api/20_master/org/org'
import { isNotEmpty } from '@/utils/index.js'
import deepCopy from 'deep-copy'

export default {
  name: 'SelectGrid', // 页面id，和router中的name需要一致，作为缓存
  components: {},
  mixins: [],
  props: {
    disabled: {
      type: Boolean,
      default: false
    },
    placeholder: {
      type: String,
      default: ''
    },
    title: {
      type: String,
      default: ''
    },
    type: {
      type: String,
      default: ''
    },
    // 返回和设定的值
    value: {
      type: String,
      default: null
    },
    // 初始选择的行
    currentId: {
      type: Number,
      default: null
    },
    parentId: {
      type: Number,
      default: null
    }
  },
  data () {
    return {
      dataJson: {
        // 查询使用的json
        searchForm: {
          type: this.type,
          serial_id: null,
          serial_type: null
        },
        // 下拉树的对象
        element: null,
        node: null,
        // 下拉选项json
        selectOptions: [],
        filterText: '',
        treeData: [],
        // 单条数据 json
        currentJson: null,
        tempJson: {
          org_type: '',
          // 组件之间通讯，传值
          inputData: this.value
        },
        tempJsonOriginal: null
      },
      settings: {
        isUpIcon: true,
        visible: false,
        para: this.CONSTANTS.DICT_ORG_SETTING_TYPE,
        filterPara: [],
        loading: true,
        // 按钮状态：是否可用
        btnDisabledStatus: {
          disabledOk: true
        },
        defaultProps: {
          children: 'children',
          label: 'label'
        }
      }
    }
  },
  computed: {
    showClose () {
      const hasValue = false
      return hasValue
    },
    iconClass () {
      return (this.settings.visible ? 'arrow-up is-reverse' : 'arrow-up')
    },
    showTitle () {
      switch (this.type) {
        case this.CONSTANTS.DICT_ORG_SETTING_TYPE_COMPANY:
          return '企业'
        case this.CONSTANTS.DICT_ORG_SETTING_TYPE_DEPT:
          return '部门'
        default:
          return ''
      }
    }
  },
  // 监听器
  watch: {
    'settings.visible': {
      handler (newVal, oldVal) {
        if (newVal) {
          // 显示popover
          this.settings.isUpIcon = true
          this.initCreated()
        } else {
          // 隐藏popover
          this.settings.isUpIcon = false
        }
      },
      immediate: true
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
    // 页面初始化
    this.initCreated()
    // 点击其他不在的区域触发事件
    document.addEventListener('click', (e) => {
      if (this.settings.visible !== false) {
        if (!this.$el.contains(e.target)) {
          this.settings.visible = false
        }
      }
    })
  },
  mounted () {
    // 描绘完成
    const originalClass = this.$refs['refSelectGrid'].$el.children[0].className
    const newClass = originalClass + ' , pointer_cursor '
    this.$refs['refSelectGrid'].$el.children[0].className = newClass
  },
  methods: {
    isDataSet () {
      if (isNotEmpty(this.dataJson.tempJson.inputData)) {
        return true
      } else {
        return false
      }
    },
    // 页面初始化
    initCreated () {
      // Object.assign(this.$data.dataJson, this.$options.data.call(this).dataJson)
      this.$data.dataJson = deepCopy(this.$options.data.call(this).dataJson)
      this.settings.btnDisabledStatus.disabledOk = true
      // 展开时，调用查询
      this.getDataList()
      // 控件focus
      this.$nextTick(() => {
        this.$refs['refFocus'].focus()
      })
    },
    // 单击事件
    handleClick () {
      if (this.disabled) {
        return
      }
      this.settings.visible = !this.settings.visible
    },
    doDestroy () {
      this.$refs.popper && this.$refs.popper.doDestroy()
    },
    handleClearClick (event) {
    },
    handleButtonSearch () {
      // 查询
      this.getDataList()
    },
    getDataList () {
      if (this.settings.visible === false) {
        return
      }
      if (this.CONSTANTS.DICT_ORG_SETTING_TYPE_DEPT === this.type) {
        // 若没有选择所属公司，则报提示：请选择所属公司
        if (!isNotEmpty(this.parentId)) {
          this.settings.visible = false
          this.showErrorMsg('请先选择所属公司！')
          return
        }

        // 部门
        this.dataJson.searchForm.serial_type = 'm_company'
        this.dataJson.searchForm.serial_id = this.parentId
      }
      // 查询逻辑
      this.settings.loading = true

      getTreeListApi(this.dataJson.searchForm).then(response => {
        this.dataJson.treeData = response.data
        this.getListAfterProcess()
        this.settings.loading = false
        this.$nextTick(() => {
          let current_node = null
          if (this.currentId === null) {
            current_node = this.dataJson.treeData[0]
            this.$refs.treeObject.setCurrentKey(this.dataJson.treeData[0].id)
            this.$refs.treeObject.getCurrentNode(current_node)
          } else {
            this.getCurrentElement(this.dataJson.treeData, this.currentId)
            var _node = this.dataJson.node
            if (_node !== null) {
              this.$refs.treeObject.setCurrentKey(_node.id)
              this.$refs.treeObject.getCurrentNode(_node)
            }
            // this.$refs.treeObject.setCurrentKey(this.currentId)
            // this.$refs.treeObject.getCurrentNode(current_node)
          }
        })
      })
    },
    // 获取当前的选中的结点
    getCurrentElement (treeData, val) {
      if (isNotEmpty(this.dataJson.node)) {
        return this.dataJson.node
      }
      for (const element of treeData) {
        this.dataJson.element = element
        switch (this.type) {
          case this.CONSTANTS.DICT_ORG_SETTING_TYPE_COMPANY:
            // 企业
            if (element.serial_id === val && element.serial_type === 'm_company') {
              this.dataJson.node = this.dataJson.element
              return this.dataJson.element
            }
            break
          case this.CONSTANTS.DICT_ORG_SETTING_TYPE_DEPT:
            // 部门
            if (element.serial_id === val && element.serial_type === 'm_dept') {
              this.dataJson.node = this.dataJson.element
              return this.dataJson.element
            }
            break
          default:
            return null
        }
        if (isNotEmpty(element.children)) {
          this.getCurrentElement(element.children, val)
        }
      }
      return this.dataJson.element
    },
    filterNode (value, data) {
      if (!value) return true
      return data.label.indexOf(value) !== -1
    },
    // 查询后处理
    getListAfterProcess () {
      if (Object.keys(this.dataJson.filterText).length !== 0) {
        this.$nextTick(() => {
          this.$refs.treeObject.filter(this.dataJson.filterText)
        })
      }
    },
    // 点击确定按钮
    handleOk () {
      // 关闭父窗体（弹出框）
      this.$emit('onReturnData', this.dataJson.currentJson)
      this.value = this.dataJson.currentJson.name
      this.dataJson.tempJson.inputData = this.dataJson.currentJson.name
      this.settings.visible = false
    },
    // 当前选中结点变化时触发的事件
    handleCurrentChange (row) {
      this.dataJson.currentJson = deepCopy(row) // copy obj
      this.dataJson.tempJsonOriginal = deepCopy(row) // copy obj
      this.dataJson.tempJson = deepCopy(row) // copy obj
      this.dataJson.tempJson.inputData = this.value
      this.dataJson.currentJson = this.$refs.treeObject.getCurrentNode()
      this.dataJson.currentJson.currentkey = this.$refs.treeObject.getCurrentKey()
      this.settings.btnDisabledStatus.disabledOk = true
      if (this.type === this.dataJson.currentJson.type) {
        this.settings.btnDisabledStatus.disabledOk = false
      }
    },
    // 重置
    doReset () {
      this.initCreated()
    },
    // 点击跳转到组织机构页面
    handleForward () {
      // 关闭父窗体（弹出框）
      this.$emit('closeParentDialog')

      // 通知路由，打开组织机构页面
      this.$router.push({ name: this.PROGRAMS.P_ORG })
    },
    // 删除数据
    clearMe () {
      if (this.disabled) {
        return
      }
      this.dataJson.tempJson.inputData = null
      this.$emit('onReturnData', { company_id: '', company_name: '', company_simple_name: '' })
    }
  }
}
</script>
