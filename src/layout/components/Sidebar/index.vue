<template>
  <div :class="{'has-logo':showLogo}">
    <logo
      v-if="showLogo"
      :collapse="isCollapse"
    />
    <el-scrollbar wrap-class="scrollbar-wrapper">
      <collapse-transition>
        <div v-show="visible">
          <el-menu
            :default-active="activeMenu"
            :collapse="isCollapse"
            :background-color="variables.menuBg"
            :text-color="variables.menuText"
            :unique-opened="true"
            :active-text-color="variables.menuActiveText"
            :collapse-transition="false"
            :default-openeds="openeds"
            mode="vertical"
          >
            <sidebar-item
              v-for="route in routers_data"
              :key="route.id"
              :item="route"
              :base-path="route.path"
            />
          </el-menu>
        </div>
      </collapse-transition>
    </el-scrollbar>
  </div>
</template>

<style>
.transition-box {
  margin-bottom: 10px;
  width: 200px;
  height: 100px;
  border-radius: 4px;
  background-color: #409eff;
  text-align: center;
  color: #fff;
  padding: 40px 20px;
  box-sizing: border-box;
  margin-right: 20px;
}
</style>

<script>
import { mapGetters } from 'vuex'
import Logo from './Logo'
import SidebarItem from './SidebarItem'
import variables from '@/styles/variables.scss'
import CollapseTransition from 'element-ui/lib/transitions/collapse-transition'
import deepCopy from 'deep-copy'

export default {
  components: { SidebarItem, Logo, CollapseTransition },
  data () {
    return {
      visible: true,
      routers_data: [],
      openeds: []
    }
  },
  computed: {
    ...mapGetters([
      'permission_menus_routers',
      'userPermissionData',
      'sidebar'
    ]),
    activeMenu () {
      const route = this.$route
      const { meta, path } = route
      // if set path, the sidebar will highlight the path you set
      if (meta.activeMenu) {
        return meta.activeMenu
      }
      return path
    },
    showLogo () {
      // upd by zxh
      // return this.$store.state.settings.sidebarLogo
      return true
    },
    variables () {
      return variables
    },
    isCollapse () {
      return !this.sidebar.opened
    }
  },
  watch: {
    'permission_menus_routers': {
      handler (newVal, oldVal) {
        this.visible = false
        setTimeout(() => {
          this.openeds = this.userPermissionData.nodes_id
          this.routers_data = deepCopy(this.permission_menus_routers)
          this.visible = true
        }, 200)
      }
    }
  },
  created () {
    this.routers_data = deepCopy(this.permission_menus_routers)
    this.openeds = this.userPermissionData.nodes_id
  }
}
</script>
