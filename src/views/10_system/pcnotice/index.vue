<template>
  <el-container>
    <el-aside width="200px" :style="'height:' + settings.tableHeight + 'px'">
      <el-menu
        :default-active="settings.active"
        class="el-menu-vertical-demo"
        @select="handleSelect"
      >
        <el-menu-item index="0">
          <span slot="title">全部消息</span>
        </el-menu-item>
        <el-menu-item index="1">
          <span slot="title">未读消息</span>
        </el-menu-item>
        <el-menu-item index="2">
          <span slot="title">已读消息</span>
        </el-menu-item>
      </el-menu>
    </el-aside>
    <el-main>
      <NoticeList
        v-show="!settings.showDetails"
        :data="dataJson.searchForm"
        @handleView="handleOpenDetail"
      />
      <Detail
        v-if="settings.showDetails"
        :data="dataJson.tempJson"
        @closeDetail="settings.showDetails = false"
      />
    </el-main>
  </el-container>
</template>

<script>
import resizeMixin from './mixin/resizeHandlerMixin'
import NoticeList from '@/views/10_system/pcnotice/components/noticelist.vue'
import Detail from '@/views/10_system/pcnotice/components/detail.vue'
import urlUtil from '@/utils/urlUtil'

export default {
  name: 'Notice',
  components: { NoticeList, Detail },
  mixins: [resizeMixin],
  data () {
    return {
      dataJson: {
        searchForm: {
          is_read: ''
        },
        tempJson: {}
      },
      settings: {
        tableHeight: this.setUIheight(),
        active: '0',
        showDetails: false
      }
    }
  },
  created () {
    const p1 = urlUtil.getHashQueryVariable(window.location.href, 'p1')
    if (p1) {
      this.dataJson.tempJson.id = p1
      this.settings.showDetails = true
    }
  },
  methods: {
    handleSelect (key) {
      this.settings.active = key
      this.settings.showDetails = false
      if (key === '0') {
        this.dataJson.searchForm.is_read = ''
      } else if (key === '1') {
        this.dataJson.searchForm.is_read = '0'
      } else if (key === '2') {
        this.dataJson.searchForm.is_read = '1'
      }
    },
    handleOpenDetail (row) {
      this.settings.showDetails = true
      this.dataJson.tempJson = row
    }
  }
}
</script>

<style scoped>
.el-menu-vertical-demo {
  height: 100%;
}

html, body {
  height: 100%;
}

.el-aside {
  padding: 5px 12px;
  background-color: #fff;
}

.el-main {
  padding: 20px 0;
}
</style>
