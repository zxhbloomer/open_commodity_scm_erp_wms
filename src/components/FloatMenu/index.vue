<template>
  <div
    ref="page"
    :class="{ 'floating-window': true, zIndexTop: moveFlags }"
    @mouseup.stop.prevent="moveEnd"
  >

    <div
      ref="floatBtn"
      class="popover-content__trigger floatBtn"
      :style="{
        transition: !moveFlags ? 'all 300ms ease' : 'unset',
        transform: `translate3d(${transform.left}px,${transform.top}px,0)`,
      }"
      @mouseover.stop.prevent="showButton"
      @click.stop.prevent="toggleMenu"
    >
      <el-badge
        :hidden="showDot"
        is-dot
        class="item"
      >
        <span
          :style="{
            left: transform.left < 50 ? '-50px' : 0,
            width: moveFlags ? '50px' : '100px',
          }"
          class="hover-area"
          @mouseleave.stop.prevent="hideButton"
        />
        <transition name="floating-popover-fade-in-out">
          <div
            v-if="popoverShow"
            ref="popoverContent"
            class="floating-popover"
            :style="menuPosition"
          >
            <slot>
              <div class="popover-content">
                <!-- <div
                class="popover-content__item el-button"
                @click.stop.prevent="handleResetCustomColumnsWidth"
              >
                <i class="el-icon-refresh-left icon" />重置列宽度
              </div>
              <el-divider /> -->
                <div
                  class="popover-content__item el-button"
                  @click.stop.prevent="handleTableColumnsSetting"
                >
                  <i class="el-icon-data-analysis icon" />列属性管理
                </div>
                <el-divider />
                <div
                  class="popover-content__item el-button"
                  @click.stop.prevent="handleBpmSetting"
                >
                  <svg-icon
                    icon-class="workflow"
                  />
                  <i class=" icon" />流程管理
                </div>
              </div>
            </slot>
          </div>
        </transition>
        <i
          :style="{ fontSize: `${form.fontSize}px` }"
          class="el-icon-s-tools"
        />
        <!-- <img class="icon" src="../assets/float-icon.png" /> -->
      </el-badge>
    </div>

    <el-dialog
      v-if="popSettings.one.visible"
      v-el-drag-dialog
      v-loading="settings.loading"
      title="列排序设置"
      element-loading-text="拼命加载中，请稍后..."
      element-loading-background="rgba(255, 255, 255, 0.7)"
      :visible="popSettings.one.visible"
      :close-on-click-modal="PARAMETERS.DIALOG_CLOSE_BY_CLICK"
      :close-on-press-escape="PARAMETERS.DIALOG_CLOSE_BY_ESC"
      :show-close="PARAMETERS.DIALOG_SHOW_CLOSE"
      custom-class="configDialog"
      :append-to-body="true"
      :modal-append-to-body="true"
      width="600px"
      height="300px"
      destroy-on-close
    >
      <div>
        <span class="checkCount">{{ selected.length }}/{{ resultList.length }}</span>
        <template>
          <div>
            <el-row
              :gutter="10"
              class="configTitle"
            >
              <el-col :span="1" />
              <el-col
                :span="2"
                class="tar"
              >
                序号
              </el-col>
              <el-col
                :span="6"
                class="tal"
              >
                列名称
              </el-col>
              <el-col
                :span="3"
                class="tal"
              >
                <el-checkbox
                  v-model="checkAll"
                  :indeterminate="isIndeterminate"
                  @change="handleCheckAllChange"
                />显示
              </el-col>
              <el-col
                :span="2"
                class="tal"
              >
                固定
              </el-col>
              <el-col
                :span="4"
                class="tal"
              >
                置顶
              </el-col>
            </el-row>
            <!-- <el-checkbox /> <a href="javascript:void(0);">重置</a> -->

            <el-row :gutter="10">
              <el-divider />
              <div class="el-dialog-div">

                <transition-group
                  name="drag"
                  class="list"
                  tag="ul"
                >

                  <li
                    v-for="(item, index) in resultList"
                    :key="item.id"
                    :draggable="!item.fix"
                    :class="['list-item', { 'is-dragover': index === newIndex }] "
                    @dragstart="dragStart(item, index)"
                    @dragover.prevent="dragOver(item, index)"
                    @dragend="dragEnd()"
                  >
                    <el-row :gutter="10">
                      <el-col
                        :span="1"
                        class="tal"
                      >
                        <i class="el-icon-rank" />
                      </el-col>
                      <el-col
                        :span="2"
                        class="tar"
                      >
                        {{ item.sort*1+1 }}
                      </el-col>
                      <el-col
                        :span="6"
                        class="tal"
                      >
                        {{ item.label }}
                      </el-col>
                      <el-col
                        :span="3"
                        class="tal"
                      >
                        <el-checkbox
                          v-model="item.is_enable"
                          :disabled="item.fix || item.is_delete !== false"
                          @change="handleCheckedChange"
                        />
                      </el-col>
                      <el-col
                        :span="3"
                        class="tal"
                      >
                        {{ item.fix === true?'是':'否' }}
                      </el-col>
                      <el-col
                        :span="4"
                        class="tal"
                      >
                        <i
                          v-if="!item.fix && item.is_delete === false"
                          class="el-icon-top"
                          @click="top(item)"
                        />
                      </el-col>
                      <!-- <span>{{ item.sort }}</span> -->

                    </el-row>
                  </li>
                </transition-group>
                <div />
              </div>
            </el-row>
          </div>
        </template>
      </div>
      <div
        slot="footer"
        class="dialog-footer"
      >
        <el-divider />
        <br>
        <el-button
          type="primary"
          class="floatLeft"
          :disabled="settings.loading"
          @click="handleReset"
        >重置列排序设置</el-button>
        <el-button
          type="primary"
          class="floatLeft"
          :disabled="settings.loading"
          @click="handleResetCustomColumnsWidth"
        >重置列宽度</el-button>

        <el-button
          :disabled="settings.loading"
          @click="handleCancel"
        >取消</el-button>

        <el-button
          plain
          type="primary"
          :disabled="settings.loading"
          @click="handleOk"
        >确定</el-button>
      </div>
    </el-dialog>

    <bpm-dialog
      v-if="bpmVisible"
      :visible="bpmVisible"
    />
  </div>
</template>
<script>

import { EventBus } from '@/common/eventbus/eventbus'
import elDragDialog from '@/directive/el-drag-dialog'
import bpmDialog from '@/components/60_bpm/dialog'

import { getTableConfigApi, saveTableConfigApi, getTableConfigOriginalApi, resetTableConfigApi, checkTableConfigApi } from '@/api/00_common/table_config'

export default {
  name: 'FloatMenu',
  components: { bpmDialog },
  directives: { elDragDialog },
  mixins: [],
  props: {
    form: {
      type: Object,
      default: function () {
        return {
          fontSize: 28
        }
      }
    }
  },
  data () {
    return {
      bpmVisible: false,
      showDot: true,
      checkAll: false,
      isIndeterminate: false,
      contentStyle: {
        width: '100%'
      },
      labelStyle: {
        width: '0%'
      },
      resultList: [],
      selected: [],
      oldIndex: '',
      oldData: '',
      newIndex: '',
      newData: '',
      dragIndex: '',
      enterIndex: '',
      // 页面设置json
      settings: {
        // loading 状态
        loading: true
      },
      dialogVisible: false,
      moveFlags: false,
      clickFlag: false,
      hoverFlag: false,
      // 初始的位置记录
      movePosition: { x: 0, y: 0 },
      nx: '',
      ny: '',
      dx: '',
      dy: '',
      xPum: '',
      yPum: '',
      popoverShow: false,

      // 浮窗的位置
      transform: {
        top: document.body.offsetHeight - 300,
        left: document.body.offsetWidth - 25
      },
      lastMoveIndex: 0, //  拖拽计数
      curMoveIndex: 0, //  历史计数
      menuPosition: {
        top: 0,
        left: 0
      },
      popSettings: {
        // 弹出编辑页面
        one: {
          visible: false,
          page_code: ''
        }
      }
    }
  },
  computed: {

  },
  // 监听器
  watch: {
    'resultList': {
      handler (newVal, oldVal) {
        this.selected = this.resultList.filter(item => {
          return item.is_enable === true
        })
        console.log(this.selected.length)
      }
    }
  },
  created () {
    document.addEventListener('mouseup', (e) => {
      if (
        e.clientY > window.innerHeight ||
        e.clientY < 60 ||
        e.clientX < 0 ||
        e.clientX > window.innerWidth
      ) {
        this.moveEnd()
      }
    })
    // 控制小红点显示隐藏
    var _this = this
    this.checkTableConfigData(this.$route.meta.page_code, function (page_code, response) {
      _this.showDot = response.data
    })
  },

  mounted () {
    this.getParentPageInfo()
    this.$set(this.transform, 'left', document.body.offsetWidth - window.document.querySelector('.sidebar-container').offsetWidth - 25)
    window.addEventListener('resize', () => {
      this.$set(this.transform, 'top', document.body.offsetHeight - 300)
      this.$set(this.transform, 'left', document.body.offsetWidth - window.document.querySelector('.sidebar-container').offsetWidth - 25)
    })
    const floatBtn = this.$refs.floatBtn
    document.addEventListener('click', (event) => {
      if (!floatBtn) return
      var tDom = event.target
      if (floatBtn !== tDom && !floatBtn.contains(tDom)) {
        this.closeMenuAndFloating()
      }
    })
  },
  methods: {
    closeMenuAndFloating () {
      // console.log('closeMenuAndFloating')
      this.popoverShow = false
      this.hoverFlag = false
      this.moveFlags = false
      this.resetFloatBtnLocation()
    },
    async toggleMenu () {
      //  如果上一次down事件到下一次click事件中 相同即为点击事件
      if (this.lastMoveIndex === this.curMoveIndex) {
        console.log(this.lastMoveIndex - this.curMoveIndex)
        this.popoverShow = !this.popoverShow
        await this.$nextTick()
        if (this.popoverShow) {
          document.onmousemove = null
          const { top, left } = this.transform
          if (top >= 60) {
            this.menuPosition.top = `-${this.$refs.popoverContent.offsetHeight +
              10}px`
          } else {
            this.menuPosition.top = '60px'
          }
          if (left > 200) {
            this.menuPosition.left = '-132px'
          } else {
            this.menuPosition.left = 0
          }
          console.log(`top:${top},left:${left}`)
        }
      }
      this.curMoveIndex = this.lastMoveIndex
    },
    hideButton () {
      console.log('mouse-leave')
      if (this.popoverShow) return
      this.hoverFlag = false
      // 移动过程中不复位 按钮；
      if (this.moveFlags) return
      this.resetFloatBtnLocation()
    },
    showButton () {
      console.log('mouse-over')
      if (this.moveFlags) return (this.hoverFlag = false)
      this.hoverFlag = true
      const { left, top } = this.transform
      if (left > 0 && left < -25) return
      const bodyWidth = document.body.clientWidth - window.document.querySelector('.sidebar-container').offsetWidth
      if (left < bodyWidth / 2) {
        this.generateTransform({ top: top, left: 20 })
      } else {
        this.generateTransform({ top: top, left: bodyWidth - 70 })
      }
    },
    moveStart (e) {
      console.log('moveStart')
      if (e.button === 2) return
      if (this.popoverShow) {
        this.moveFlags = false
        return
      }
      if (this.moveFlags) {
        console.log('---移动中点击---')
        this.hoverFlag = false
        this.moveEnd()
        return
      }
      this.clickFlag = true
      const floatBtn = this.$refs.floatBtn // 获取目标元素
      this.movePosition.x = e.clientX
      this.movePosition.y = e.clientY
      // 计算鼠标相对元素的位置
      const { left, top } = this.transform
      this.dx = e.clientX - left
      this.dy = e.clientY - top
      this.moveFlags = true
      document.onmousemove = async (e) => {
        this.clickFlag = false
        this.moveFlags = true
        console.log('onmousemove')
        const bodyWidth = document.body.clientWidth
        const bodyHeight = document.body.clientHeight
        const moveMaxHeight = bodyHeight - 30
        const moveMaxWidth = bodyWidth - floatBtn.offsetWidth / 2 + this.dx
        this.nx = e.clientX
        this.ny = e.clientY
        this.xPum = (this.nx > moveMaxWidth ? moveMaxWidth : this.nx) - this.dx
        this.yPum =
          (this.ny > moveMaxHeight ? moveMaxHeight : this.ny) - this.dy
        await this.$nextTick()
        this.lastMoveIndex++
        this.generateTransform({
          left: this.xPum > -25 ? this.xPum : -25,
          top: this.yPum > 0 ? this.yPum : 0
        })
      }
      document.onmouseup = () => {
        document.onmousemove = null
        document.onmouseup = null
        this.moveEnd()
      }
    },
    generateTransform ({ top, left }) {
      const floatBtn = this.$refs.floatBtn // 获取目标元素
      if (!floatBtn) return
      this.$set(this.transform, 'left', left)
      this.$set(this.transform, 'top', top)
    },
    resetFloatBtnLocation () {
      // console.log('------reset')
      const floatBtn = this.$refs.floatBtn // 获取目标元素
      if (!floatBtn) return
      const bodyWidth = document.body.clientWidth
      const { left, top } = this.transform
      if (left < bodyWidth / 2) {
        this.generateTransform({ top, left: `-25` })
      } else {
        this.generateTransform({ top, left: bodyWidth - window.document.querySelector('.sidebar-container').offsetWidth - 25 })
      }
    },
    moveEnd () {
      console.log(`moveEnd---this.moveFlags,this.hoverFlag:` + this.moveFlags + ',' + this.hoverFlag)
      this.moveFlags = false
      if (this.hoverFlag) return
      document.onmousemove = null
      this.resetFloatBtnLocation()
    },
    // 重置表格列
    handleResetCustomColumnsWidth () {
      this.$confirm('确定要重置该表格的宽度设置吗！', '确认信息', {
      }).then(() => {
        // 通过vuex，删除数据
        // this.$options.name = this.$route.meta.page_code
        const _para = {
          page_code: this.$route.meta.page_code
        }
        console.log(`----page_code:` + _para)
        this.$store.dispatch('customTableColumns/columns', _para)
        EventBus.$emit(this.EMITS.EMIT_TABLE_COLUMNS_CONFIG_START, this.$route.fullPath)
      }).catch(action => {
      })
    },
    // 设置列属性
    handleTableColumnsSetting () {
      this.popSettings.one.visible = true
      var _this = this
      this.checkTableConfigData(this.$route.meta.page_code, function (page_code, response) {
        if (response.data === false) {
          _this.$confirm('该表格列数据有变化，点击确定读取最新列数据。读取最新列数据将删除您设置的列排序，您需要重新设置列排序数据。', '确认信息', {
          }).then(() => {
            _this.resetTableConfigData(page_code)
          }).catch(action => {
          })
        }
      })
      this.getTableConfig(this.$route.meta.page_code)
    },
    handleBpmSetting () {
      this.bpmVisible = true
    },
    getTableConfig (page_code) {
      // 获取数据
      getTableConfigApi({ page_code: page_code }).then(response => {
        this.resultList = response.data
        this.selected = this.resultList.filter(item => {
          return item.is_enable === true
        })
        if (this.selected.length === this.resultList.length) {
          this.checkAll = true
        } else if (this.selected.length > 0 && this.selected.length < this.resultList.length) {
          this.checkAll = true
          this.isIndeterminate = true
        } else {
          this.checkAll = false
        }
      }).finally(() => {
        this.settings.loading = false
      })
    },
    resetTableConfig (page_code) {
      this.$confirm('读取最新列数据将删除您设置的列排序，您需要重新设置列排序数据。', '确认信息', {
      }).then(() => {
        this.resetTableConfigData(page_code)
      }).catch(action => {
      })
    },
    handleReset () {
      this.resetTableConfig(this.$route.meta.page_code)
    },
    handleOk () {
      this.popSettings.one.visible = false
      this.doSortUpdate(this.resultList)
    },
    handleCancel () {
      this.popSettings.one.visible = false
    },

    // sort重新计算
    doReIndexSort () {
      this.resultList.forEach(function (item, index, arr) {
        // 开始排序
        item.sort = index
      })
    },
    // 更新逻辑
    doSortUpdate (listData) {
      saveTableConfigApi(listData).then((_data) => {

      }, (_error) => {

      }).finally(() => {
        this.settings.loading = false
        // EventBus.$emit(this.EMITS.EMIT_TABLE_COLUMNS_CONFIG_START)
        // console.log(this.$route.fullPath + '==================')
        // console.log(this.$route.path + '==================')
        EventBus.$emit(this.EMITS.EMIT_TABLE_COLUMNS_CONFIG_START, this.$route.path)
      })
    },
    dragStart (val, i) {
      this.oldIndex = i
      this.oldData = val
    },
    dragOver (val, i) {
      this.newIndex = i
      this.newData = val
    },
    dragEnd () {
      // 属性fix为true的数据不能拖动
      if (this.oldData.fix === true || this.newData.fix === true) {
        return false
      }
      const newItems = [...this.resultList]
      // 删除老的节点
      newItems.splice(this.oldIndex, 1)
      // 在列表中目标位置增加新的节点
      newItems.splice(this.newIndex, 0, this.oldData)
      this.resultList = [...newItems]
      this.newIndex = ''

      this.doReIndexSort()
    },
    checkTableConfigData (page_code, callback) {
      checkTableConfigApi({ page_code: page_code }).then(response => {
        callback(page_code, response)
      }).finally(() => {
        this.settings.loading = false
      })
    },
    resetTableConfigData (page_code) {
      // 重置
      resetTableConfigApi({ page_code: page_code }).then(response => {
        // 获取数据
        getTableConfigOriginalApi({ page_code: page_code }).then(response => {
          this.resultList = response.data
          this.selected = this.resultList.filter(item => {
            return item.is_enable === true
          })
          if (this.selected.length === this.resultList.length) {
            this.checkAll = true
          } else if (this.selected.length > 0 && this.selected.length < this.resultList.length) {
            this.checkAll = true
            this.isIndeterminate = true
          } else {
            this.checkAll = false
          }
        }).finally(() => {
          this.settings.loading = false
        })
      }).finally(() => {
        this.settings.loading = false
      })
    },
    // 全选change事件
    handleCheckAllChange (val) {
      console.log(val)
      if (val === true) {
        this.resultList.forEach(function (element, index, array) {
          if (element.is_delete !== true) {
            element.is_enable = true
          }
        })
      } else {
        this.resultList.forEach(function (element, index, array) {
          if (element.fix !== true && element.is_delete !== true) {
            element.is_enable = false
          }
        })
      }
      this.selected = this.resultList.filter(item => {
        return item.is_enable === true
      })
      this.isIndeterminate = false
    },
    // 复选框change事件
    handleCheckedChange () {
      this.selected = this.resultList.filter(item => {
        return item.is_enable === true
      })

      this.isIndeterminate = this.selected.length > 0 && this.selected.length < this.resultList.length
    },
    // 置顶
    top (item) {
      // 属性fix为true的数据不能拖动

      const newItems = [...this.resultList]
      // 删除老的节点
      newItems.splice(item.sort, 1)
      // 在列表中目标位置增加新的节点
      newItems.splice(item.min_sort, 0, item)
      this.resultList = [...newItems]
      this.newIndex = ''

      this.doReIndexSort()
    },
    // 获取父页面page_code,并获取其页面的配置，判断是否要开启审批流程按钮
    getParentPageInfo () {
      const page_code = this.$parent.$options.name
      console.log(`page_code:` + page_code)
    }

  }
}
</script>
<style lang="scss" scoped>
.zIndexTop {
  z-index: 1000;
}
.el-icon-s-tools {
  color: white;
}
.hover-area {
  position: absolute;
  width: 100px;
  height: 100%;
}
.floating-window {
  position: absolute;
  top: 0;
  left: 0;
  width: 100vw;
  height: 80vh;
  overflow: hidden;
  pointer-events: none;
  .floatBtn {
    position: absolute;
    z-index: 1000;
    cursor: pointer;
    span:last-child {
      z-index: 2;
    }
  }
  .popover-content {
    width: 100% !important;
    &__trigger {
      width: 50px;
      height: 50px;
      background: #2196f3;
      display: -webkit-box;
      justify-content: center;
      align-items: center;
      border-radius: 40px;
      box-shadow: 0px 16px 34px 0px rgba(0, 49, 128, 0.2);
      pointer-events: auto;
    }
  }
}
</style>
<style lang="scss" scoped>
.floating-popover-fade-in-out {
  &-enter-active,
  &-leave-active {
    transition-timing-function: ease;
    transition-duration: 300ms;
    transition-property: opacity, transform;
  }
  &-enter,
  &-leave-to {
    opacity: 0;
    transform: translate3d(0, -10px, 0);
  }
}
.floating-popover {
  position: absolute;
  /* width: 182px; */
  padding: 0 !important;
  border: 0 !important;
  /* border-radius: 40px !important; */
  /* box-shadow: 0px 16px 34px 0px rgba(0, 49, 128, 0.2); */
}

.el-divider--horizontal {
  height: 1px;
  width: 100%;
  margin: 0px 0 0 0;
}
.popover-content__item {
  width: 100% !important;
  height: 40px;
  padding: 0;
  border: 0;
  line-height: 40px;
  font-size: 16px;
  border-radius: 0;
  // color: var(--themeColor);
  padding: 0 20px;
  text-align: left;
}

// .popover-content__item.el-button:hover {
//   // background: var(--shadowColor);
// }

.popover-content__item > .icon {
  margin-right: 10px;
  font-size: 18px;
}

.popover-content {
  width: 182px;
  overflow: hidden;
  border-radius: 8px;
  box-shadow: 0px 0px 34px 5px rgb(0 49 128 / 45%);

  .el-button + .el-button {
    margin-left: 0;
  }

  // .el-button:focus,
  // .el-button:hover {
  //   // color: var(--themeColor);
  // }

  &__item {
    width: 100% !important;
    height: 40px;
    padding: 0;
    border: 0;
    line-height: 40px;
    font-size: 16px;
    border-radius: 0;
    // color: var(--themeColor);
    padding: 0 20px;
    text-align: left;

    // &.el-button:hover {
    //   // background: var(--shadowColor);
    // }

    > .icon {
      margin-right: 10px;
      font-size: 18px;
    }
  }
}
.li > span {
  display: inline-block;
  width: 50px;
}

.list {
  list-style: none;
  .drag-move {
    transition: transform 0.3s;
  }
  .list-item {
    cursor: pointer;
    position: relative;
    border-radius: 4px;
    height: 31px;
    line-height: 31px;
    text-align: center;
    margin-top: 2px;
  }
}
.el-icon-rank {
  cursor: move;
}

.floatRight {
  float: right;
}
.floatLeft {
  float: left;
}
.configDialog.el-dialog {
  .el-dialog__header {
    display: none !important;
  }
  .dj-dialog-content {
    padding: 0;
    overflow: unset;
  }
}
.el-checkbox {
  width: auto;
}
.configDialog ul {
  margin: 0;
  padding: 0;
}
.el-dialog-div {
  height: 40vh;
  overflow-y: auto;
  overflow-x: hidden;
}
.configTitle .el-col {
  padding: 5px 0;
}
.checkCount {
  position: absolute;
  top: 0;
  right: 0;
}
</style>
<style lang="scss" >
.configDialog .el-dialog__body {
  position: relative;
}
.tal {
  text-align: left;
}
.tar {
  text-align: right;
}
.el-badge__content.is-fixed.is-dot {
  right: 33px;
}
</style>
