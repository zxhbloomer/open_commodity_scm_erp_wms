<template>
  <div
    :class="{'show':show}"
    class="header-search"
  >
    <svg-icon
      class-name="search-icon"
      icon-class="search"
      @click.stop="click(1)"
    />
    <el-dialog
      ref="dialog"
      :visible.sync="show"
      :close-on-click-modal="false"
      :modal-append-to-body="false"
      :show-close="false"
      :destroy-on-close="true"
      width="35%"
      @close="handleClose"
      @open="getDataList"
      @keydown.native="handleKeyDown"
    >
      <el-input
        ref="input"
        v-model="search"
        placeholder="请输入内容"
        prefix-icon="el-icon-search"
        @click.native.stop
        @input="querySearch"
      />
      <div
        class="dialog"
        :style="{ height: dialogHeight }"
      >
        <div v-if="showCollection && collection_menus && collection_menus.length && !search" class="dialog-history-title">收藏</div>
        <div v-if="showCollection && collection_menus && collection_menus.length && !search">
          <div
            v-for="(item, index) in collection_menus"
            :key="'c' + item.menu_id"
          >
            <el-card
              v-if="showCollection"
              ref="headerSearchCard"
              :class="{ 'highlighted': 'c' + index === mouseover_type + selectedIndex }"
              shadow="always"
              @click.native="change(item)"
              @mouseover.native="selectedIndex = index; mouseover_type = 'c'"
            >
              <span
                v-for="(meta, meta_index) in item.meta"
                :key="meta_index"
              >
                <svg-icon v-if="meta.meta_icon" :icon-class="meta.meta_icon" />
                <span v-html="meta.meta_title" />
                <!--              {{ meta.meta_title }}-->
                <span v-if="meta_index !== item.meta.length - 1"> > </span>
              </span>
              <!--            收藏功能 -->
              <el-button
                type="text"
                class="scButton"
                @click.stop="saveCollection(item)"
              >
                <span v-if="item.is_collection === null || !item.is_collection">收藏</span>
                <span v-else>已收藏</span>
              </el-button>
            </el-card>
            <br>
          </div>
        </div>
        <div v-if="showHistory && options.length" class="dialog-history-title">搜索历史</div>
        <div v-if="!options.length && !collection_menus.length" class="dialog-content">暂无历史记录</div>
        <div
          v-for="(item, index) in optionsList"
          :key="index"
        >
          <el-card
            ref="headerSearchCard"
            :class="{ 'highlighted': 'h' + index === mouseover_type + selectedIndex }"
            shadow="always"
            @click.native="change(item)"
            @mouseover.native="selectedIndex = index; mouseover_type = 'h'"
          >
            <span
              v-for="(meta, meta_index) in item.meta"
              :key="meta_index"
            >
              <svg-icon v-if="meta.meta_icon" :icon-class="meta.meta_icon" />
              <span v-html="meta.meta_title" />
              <span v-if="meta_index !== item.meta.length - 1"> > </span>
            </span>
            <el-button
              v-if="!search"
              type="text"
              circle
              class="scButton"
              @click.stop="deleteHistory(item)"
            >
              删除
            </el-button>
            <!--            收藏功能 -->
            <el-button
              type="text"
              class="scButton"
              @click.stop="saveCollection(item)"
            >
              <span v-if="item.is_collection === null || !item.is_collection">收藏</span>
              <span v-else>已收藏</span>
            </el-button>
          </el-card>
          <br>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <span style="margin-right: 15px">
          <kbd>
            <svg width="15" height="15" aria-label="Enter key" role="img"><g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.2"><path d="M12 3.53088v3c0 1-1 2-2 2H4M7 11.53088l-3-3 3-3" /></g></svg>
          </kbd>
          <span style="margin-left: 2px">
            选择
          </span>
        </span>
        <span style="margin-right: 15px">
          <kbd>
            <svg width="15" height="15" aria-label="Arrow up" role="img"><g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.2"><path d="M7.5 11.5v-8M10.5 6.5l-3-3-3 3" /></g></svg>
          </kbd>
          <kbd>
            <svg width="15" height="15" aria-label="Arrow down" role="img"><g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.2"><path d="M7.5 3.5v8M10.5 8.5l-3 3-3-3" /></g></svg>
          </kbd>
          <span style="margin-left: 2px">
            切换
          </span>
        </span>
        <span>
          <kbd>
            <svg width="15" height="15" aria-label="Escape key" role="img"><g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.2"><path d="M13.6167 8.936c-.1065.3583-.6883.962-1.4875.962-.7993 0-1.653-.9165-1.653-2.1258v-.5678c0-1.2548.7896-2.1016 1.653-2.1016.8634 0 1.3601.4778 1.4875 1.0724M9 6c-.1352-.4735-.7506-.9219-1.46-.8972-.7092.0246-1.344.57-1.344 1.2166s.4198.8812 1.3445.9805C8.465 7.3992 8.968 7.9337 9 8.5c.032.5663-.454 1.398-1.4595 1.398C6.6593 9.898 6 9 5.963 8.4851m-1.4748.5368c-.2635.5941-.8099.876-1.5443.876s-1.7073-.6248-1.7073-2.204v-.4603c0-1.0416.721-2.131 1.7073-2.131.9864 0 1.6425 1.031 1.5443 2.2492h-2.956" /></g></svg>
          </kbd>
          <span style="margin-left: 2px">
            关闭
          </span>
        </span>
      </span>
    </el-dialog>
  </div>
</template>

<script>
// fuse is a lightweight fuzzy-search module
// make search results more in line with expectations
import Fuse from 'fuse.js'
import path from 'path'
import {
  getSearchListApi,
  saveCacheApi,
  getCacheAPi,
  saveCollectionMenuApi,
  getCollectionListApi,
  deleteHistoryApi
} from '@/api/20_master/menus/menu'
import deepCopy from 'deep-copy'

export default {
  name: 'HeaderSearch',
  data () {
    return {
      search: '',
      options: [],
      // 备份数据
      optionsBack: [],
      searchPool: [],
      show: false,
      fuse: undefined,
      fuseCode: undefined,
      menus: [],
      selectedIndex: 0,
      shiftKeyPressed: false,
      doubleClickThreshold: 500, // 双击间隔阈值
      showHistory: false, // 是否显示历史记录
      mouseover_type: 'h',
      collection_menus: [], // 收藏菜单
      showCollection: false, // 是否显示收藏
      search_page_code: [
        { type: 'IN', name: '/in/bill' },
        { type: 'INP', name: '/in/plan' },
        { type: 'OTP', name: '/out/plan' },
        { type: 'OT', name: '/out/bill' },
        { type: 'BWO', name: '/wo/index' },
        { type: 'MON', name: '/monitor/index' }
      ],
      include_param: false // 跳转页面是否包含参数
    }
  },
  computed: {
    dialogHeight () {
      if (!this.options.length) {
        return 'auto'
      } else if (this.options.length + this.collection_menus.length > 4) {
        return '268px'
      } else {
        return 'auto'
      }
    },
    optionsList () {
      // 将 value.meta.title 中, 与搜索关键字匹配的部分加上 <span class="highlighted"></span>
      const optionsList = deepCopy(this.options) // 用深度拷贝，避免修改原数据
      if (optionsList && optionsList.length) {
        optionsList.forEach(item => {
          item.meta.forEach(meta => {
            if (meta.meta_title) {
              const index = meta.meta_title.toLowerCase().indexOf(this.search.toLowerCase())
              if (index !== -1) {
                meta.meta_title = meta.meta_title.substring(0, index) + '<span class="highlighted-yellow">' + meta.meta_title.substring(index, index + this.search.length) + '</span>' + meta.meta_title.substring(index + this.search.length)
              }
            }
          })
        })
      }

      return optionsList
    }
    // routes () {
    //   return this.$store.getters.permission_menus_routers
    // }
  },
  watch: {
    routes () {
      // this.searchPool = this.generateRoutes1(this.menus)
    },
    searchPool (list) {
      this.initFuse(list)
      this.initFuse2(list)
    },
    show (value) {
      if (value) {
        document.body.addEventListener('click', this.close)
      } else {
        document.body.removeEventListener('click', this.close)
      }
    }
  },
  mounted () {
    // 快捷键
    // document.addEventListener('keydown', this.openDialogKey)
    // document.addEventListener('keyup', this.openDialogKeyUp)
    document.addEventListener('keydown', this.openDialogKey)
    document.addEventListener('keyup', this.handleKeyUp)
  },
  methods: {
    click () {
      this.show = !this.show
      if (this.show) {
        this.getCacheDataList()
      }
    },
    close () {
      this.options = []
      this.show = false
      this.collection_menus = []
    },
    change (val) {
      if (this.include_param) {
        this.$router.push({
          path: val.path,
          query: {
            code: this.search,
            fullpath: true
          }
        })
      } else {
        this.$router.push(val.path)
      }
      this.search = ''
      this.$nextTick(() => {
        this.show = false
      })
      this.setSearchHistory(val)
    },
    // 将 历史记录添加到缓存
    setSearchHistory (val) {
      // 根据 val.menu_id, 返回this.options中的数据
      const menu = this.menus.find(item => item.menu_id === val.menu_id)
      saveCacheApi(menu)
        .then(
          _data => {
            this.options = []
          },
          _error => {}
        )
        .finally(() => {})
    },
    initFuse (list) {
      this.fuse = new Fuse(list, {
        shouldSort: true,
        threshold: 0.1, // 设置匹配度为 90%
        location: 0,
        distance: 100,
        maxPatternLength: 32,
        minMatchCharLength: 1,
        caseSensitive: false,
        keys: [{
          name: 'title',
          weight: 0.3
        }, {
          name: 'path',
          weight: 0.2
        }, {
          name: 'name_py',
          weight: 0.1
        }, {
          name: 'name_simple_py',
          weight: 0.4
        }]
      })
    },
    initFuse2 (list) {
      this.fuseCode = new Fuse(list, {
        shouldSort: true,
        threshold: 0, // 设置匹配度为 90%
        location: 0,
        distance: 100,
        maxPatternLength: 32,
        minMatchCharLength: 1,
        caseSensitive: false,
        keys: [{
          name: 'path',
          weight: 1
        }]
      })
    },
    generateRoutes1 (routes) {
      const res = []
      for (const router of routes) {
        res.push(...this.generateRoutes(router.children))
      }
      return res
    },
    // Filter out the routes that can be displayed in the sidebar
    // And generate the internationalized title
    generateRoutes (routes, basePath = '/', prefixTitle = [], name_pinyin = [], name_simple_py = [], meta = []) {
      let res = []

      for (const router of routes) {
        const data = {
          path: path.resolve(basePath, router.path),
          title: [...prefixTitle],
          name_py: [...name_pinyin],
          name_simple_py: [...name_simple_py]
        }

        if (router.meta_title) {
          data.title = [...data.title, router.meta_title]
          data.name_py = [...data.name_py, router.name_py]
          data.name_simple_py = [...name_simple_py, router.name_first_py]
          data.meta = [...meta, router.meta]

          if (router.redirect !== 'noRedirect') {
            // only push the routes with title
            // special case: need to exclude parent router without redirect
            res.push(data)
          }
        }

        // recursive child routes
        if (router.children) {
          const tempRoutes = this.generateRoutes(router.children, data.path, data.title, data.name_py, data.name_simple_py, data.meta)
          if (tempRoutes.length >= 1) {
            res = [...res, ...tempRoutes]
          }
        }
      }
      return res
    },
    querySearch (query) {
      if (query !== '') {
        const lettersMatch = query.match(/[a-zA-Z]+/)
        this.showHistory = false
        if (lettersMatch && lettersMatch.length) {
          const matchingObject = this.search_page_code.find(item => item.type === lettersMatch[0])
          if (matchingObject) {
            this.include_param = true
            this.options = this.fuseCode.search(matchingObject.name)
          } else {
            this.include_param = false
            this.options = this.fuse.search(query)
          }
        } else {
          this.include_param = false
          this.options = this.fuse.search(query)
        }
        if (this.options.length > 0) {
          this.selectedIndex = 0
        }
      } else {
        // this.options = JSON.parse(localStorage.getItem('menu-search-history')) || []
        // if (this.options && this.options.length) {
        //   this.showHistory = true
        // }
        this.getCacheDataList()
      }
    },
    getDataList () {
      // 查询逻辑
      getSearchListApi().then(response => {
        // 设置全部菜单
        const recorders = response.data
        if (recorders && recorders.length) {
          this.menus = response.data
          this.searchPool = response.data
        }
      }).finally(() => {
        this.$nextTick(() => {
          this.$refs.input.focus()
        })
      })
      // 查询收藏
      getCollectionListApi({}).then(response => {
        // 设置全部菜单
        const recorders = response.data
        if (recorders && recorders.length) {
          this.collection_menus = response.data
          this.showCollection = true
        }
      }).finally(() => {
      })
    },
    getCacheDataList () {
      // 查询逻辑
      getCacheAPi().then(response => {
        // 设置全部菜单
        const recorders = response.data
        if (recorders && recorders.length) {
          this.options = recorders
          this.showHistory = true
        }
      }).finally(() => {
        this.$nextTick(() => {
          this.$refs.input.focus()
        })
      })
    },
    // 关闭弹窗
    handleClose () {
      this.search = ''
      this.options = []
      this.showHistory = false
      this.showCollection = false
    },
    handleKeyDown (event) {
      const cardHeight = 68 // el-card 的高度，你可能需要根据你的实际情况来调整这个值
      const dialog = this.$refs.dialog.$el.querySelector('.dialog')
      switch (event.key) {
        case 'ArrowUp':
          // 如果用户按下了上键，将 selectedIndex 减 1
          if (this.selectedIndex > 0) {
            this.selectedIndex--
            // 如果 selectedIndex 小于滚动条的位置，滚动 .dialog 的滚动条
            if (dialog.scrollTop > this.selectedIndex * cardHeight) {
              dialog.scrollTop = this.selectedIndex * cardHeight
            }
          }
          break
        case 'ArrowDown':
          // 如果用户按下了下键，将 selectedIndex 加 1
          if (this.selectedIndex < this.options.length - 1) {
            this.selectedIndex++
            // 如果 selectedIndex 大于滚动条的位置，滚动 .dialog 的滚动条
            if (dialog.scrollTop < (this.selectedIndex + 1) * cardHeight - dialog.clientHeight) {
              dialog.scrollTop = (this.selectedIndex + 1) * cardHeight - dialog.clientHeight
            }
          }
          break
        case 'Enter':
          // 如果用户按下了回车键，触发点击事件
          this.change(this.options[this.selectedIndex])
          break
        case 'Shift':
      }
    },
    // 快捷键打开
    openDialogKey (event) {
      if (event.key === 'Shift') {
        const now = Date.now()
        if (!this.lastKeyDownTime || now - this.lastKeyDownTime > this.doubleClickThreshold) {
          // 如果这是新的按键序列或上一次按键距离现在超过阈值，则重置计时器
          this.lastKeyDownTime = now
        } else if (now - this.lastKeyDownTime < this.doubleClickThreshold && this.shiftKeyPressed) {
          // 如果两次按键间隔小于阈值，则认为是双击Shift
          this.show = true
          this.getCacheDataList()
          // 可以在此处清除lastKeyDownTime避免再次触发
          this.lastKeyDownTime = 0
        }
      }
    },
    handleKeyUp (event) {
      if (event.key === 'Shift') {
        this.shiftKeyPressed = true
        const timerId = setTimeout(() => {
          // 执行你的任务
          this.shiftKeyPressed = false
          // 完成任务后清除定时器
          clearTimeout(timerId)
        }, 500) // 2000毫秒即2秒
      }
    },
    // 保存收藏信息
    saveCollection (item) {
      const is_collection = item.is_collection
      item.is_collection = !item.is_collection
      saveCollectionMenuApi(item)
        .then(
          _data => {
            if (!item.is_collection) {
              // 如果取消收藏，从数组中移除该项
              const index = this.collection_menus.findIndex(i => i.menu_id === item.menu_id)
              if (index !== -1) {
                this.collection_menus.splice(index, 1)
              }
              // 更新历史记录，将收藏改为未收藏
              const historyIndex = this.options.findIndex(i => i.menu_id === item.menu_id)
              if (historyIndex !== -1) {
                this.options[historyIndex].is_collection = false
              }
            } else {
              // 如果收藏，将该项添加到数组中
              this.collection_menus.unshift(item)
              // 更新历史记录，将收藏改为已收藏
              const historyIndex = this.options.findIndex(i => i.menu_id === item.menu_id)
              if (historyIndex !== -1) {
                this.options[historyIndex].is_collection = true
              }
            }
          },
          _error => {
            item.is_collection = is_collection
          }
        )
        .finally(() => {})
    },
    deleteHistory (item) {
      // 从缓存中删除
      deleteHistoryApi(item, true)
        .then(
          _data => {
            // 从数组中移除该项
            const index = this.options.findIndex(i => i.menu_id === item.menu_id)
            if (index !== -1) {
              this.options.splice(index, 1)
            }
          },
          _error => {}
        )
        .finally(() => {})
    }
  }
}
</script>

<style lang="scss" scoped>
.header-search {

  font-size: 0 !important;
  .search-icon {
    cursor: pointer;
    font-size: 16px;
    vertical-align: middle;
  }

  &.show {
    .header-search-select {
      width: 90%;
      // margin-left: 10px;
      pointer-events: auto;
      opacity: 1;
      position: absolute;
    }
  }
}
::v-deep .el-dialog {
  border-radius: 10px;
}
::v-deep .el-dialog__header {
  background: #fff;  // 替换为你想要的颜色
  padding: 0 0 0 0;
}
::v-deep .el-input--mini .el-input__inner {
  height: 48px;
  line-height: 28px;
  font-size: 16px;
}
::v-deep .el-card__body {
   padding: 5px;
  font-size: 15px;
  border: none;
}
::v-deep.el-card {
  margin-bottom: 0;
  border-radius: 4px;
  background-color: #fff;  // 背景色
  color: #333;  // 字体色
  transition: all 0.2s;
  cursor: pointer;
 }
::v-deep .highlighted {
  background-color: #115aa5;  // 选中时的背景色
  color: white;  // 选中时的字体色
}
.dialog {
  overflow: auto;
}
::v-deep .dialog::-webkit-scrollbar {
  width: 5px;
}
.dialog-content {
  text-align: center;
  color:#969faf
}
::v-deep .el-dialog__footer {
  text-align: left;
  height: 46px;
  padding-left: 15px;
  box-shadow: 0 0 5px rgba(0,0,0,0.5);
  padding-bottom: 0;
  padding-top: 0;

  .dialog-footer {
    //font-size: 25px;
    color: black;
    font-size: 16px;
  }
}
kbd {
  padding: 2px 4px;
  font-size: 90%;
  background-color: #f8f8f8;
  border-radius: 3px;
  box-shadow: inset 0 -1px 0 rgba(0,0,0,.25);
}
br {
  display: block;
  margin: 6px;
  content: ' ';
}
.dialog-history-title {
  line-height: 20px;
  color: #2196f3;
  font-weight: 600;;
}
.scButton {
  float: right;
  padding-top: 16px;
  padding-right: 5px;
  font-size: 15px;
}
::v-deep .highlighted-yellow {
  color: rgba(231, 231, 50, 0.94);
}
.list-leave-active {
  transition: all 0.3s;
}
.list-leave-to {
  transform: translateX(100%);
  opacity: 0;
}
</style>
