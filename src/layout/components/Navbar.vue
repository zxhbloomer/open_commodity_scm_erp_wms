<template>
  <div class="navbar">
    <hamburger
      id="hamburger-container"
      :is-active="sidebar.opened"
      class="hamburger-container"
      @toggleClick="toggleSideBar"
    />

    <!-- 面包屑 -->
    <!-- <breadcrumb id="breadcrumb-container" class="breadcrumb-container" /> -->
    <top-nav />
    <div class="right-menu">
      <template v-if="device!=='mobile'">

        <header-notice class="right-menu-item" />

        <search
          id="header-search"
          class="right-menu-item"
        />

        <error-log class="errLog-container right-menu-item hover-effect" />

        <screenfull
          id="screenfull"
          class="right-menu-item hover-effect"
        />

        <el-tooltip
          content="Global Size"
          effect="dark"
          placement="bottom"
        >
          <size-select
            v-show="false"
            id="size-select"
            class="right-menu-item hover-effect"
          />
        </el-tooltip>

      </template>
      <div class="avatar-container right-menu-item hover-effect">
        <div class="avatar-wrapper">
          <img
            class="user-avatar"
            :src="avatar+'?imageView2/1/w/80/h/80'"
          >
        </div>
      </div>

      <el-dropdown
        class="avatar-container right-menu-item hover-effect"
        trigger="click"
        style="margin-right: 30px;"
      >
        <div class="avatar-wrapper">
          <name-filter :name="name" />
          <i class="el-icon-caret-bottom" />
        </div>
        <el-dropdown-menu slot="dropdown">
          <router-link to="/user/info1">
            <el-dropdown-item>个人中心</el-dropdown-item>
          </router-link>
          <router-link to="/">
            <el-dropdown-item>首页</el-dropdown-item>
          </router-link>
          <el-dropdown-item divided>
            <span
              style="display:block;"
              @click="logout"
            >登出</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
// import Breadcrumb from '@/components/Breadcrumb'
import Hamburger from '@/components/Hamburger'
import ErrorLog from '@/components/ErrorLog'
import Screenfull from '@/components/Screenfull'
import SizeSelect from '@/components/SizeSelect'
import Search from '@/components/HeaderSearch/index.vue'
import HeaderNotice from '@/components/HeaderNotice'
import topNav from '@/layout/components/TopNav'
import NameFilter from '@/components/99_util/namefilter/index'

export default {
  components: {
    // Breadcrumb,
    Hamburger,
    ErrorLog,
    Screenfull,
    SizeSelect,
    Search,
    HeaderNotice,
    topNav,
    NameFilter
  },
  computed: {
    ...mapGetters([
      'name',
      'sidebar',
      'avatar',
      'device'
    ])
  },
  methods: {
    toggleSideBar () {
      this.$store.dispatch('app/toggleSideBar')
    },
    async logout () {
      await this.$store.dispatch('user/logout')
      this.$router.push(`/login?redirect=${this.$route.fullPath}`)
    }
  }
}
</script>

<style lang="scss" scoped>
.user-avatar-img {
  cursor: pointer;
  width: 40px;
  height: 40px;
  border-radius: 10px;
}
.navbar {
  height: 50px;
  overflow: hidden;
  position: relative;
  // upd by zxh
  // background: #fff;
  // box-shadow: 0 1px 4px rgba(0,21,41,.08);
  background: #3c8dbc;

  .hamburger-container {
    // upd by zxh
    // line-height: 46px;
    line-height: 50px;
    height: 100%;
    float: left;
    cursor: pointer;
    transition: background 0.3s;
    -webkit-tap-highlight-color: transparent;

    &:hover {
      background: rgba(0, 0, 0, 0.025);
    }
  }

  .breadcrumb-container {
    float: left;
  }

  .errLog-container {
    display: inline-block;
    vertical-align: top;
  }

  .right-menu {
    float: right;
    height: 100%;
    line-height: 50px;

    &:focus {
      outline: none;
    }

    .right-menu-item {
      display: inline-block;
      padding: 0 9px;
      height: 100%;
      // font-size: 18px;
      // upd by zxh
      // color: #5a5e66;
      color: #fff;
      vertical-align: text-bottom;

      &.hover-effect {
        cursor: pointer;
        transition: background 0.3s;

        &:hover {
          background: rgba(0, 0, 0, 0.025);
        }
      }
    }

    .avatar-container {
      // margin-right: 30px;

      .avatar-wrapper {
        margin-top: 5px;
        position: relative;

        .user-avatar {
          cursor: pointer;
          width: 40px;
          height: 40px;
          border-radius: 10px;
        }

        .el-icon-caret-bottom {
          cursor: pointer;
          position: absolute;
          right: -20px;
          top: 25px;
          font-size: 12px;
        }
      }
    }
  }
}
</style>
