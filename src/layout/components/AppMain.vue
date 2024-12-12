<template>
  <section class="app-main">
    <!-- 过渡动画注释 by zxh -->
    <!-- <transition name="fade-transform" mode="out-in"> -->
    <transition>
      <!-- <keep-alive> -->
      <router-tab :tabs="tabs" />
      <!-- </keep-alive> -->
    </transition>
  </section>
</template>

<script>
// import path from 'path'

export default {
  name: 'AppMain',
  data () {
    return {
      tabs: []
    }
  },
  computed: {
    routes () {
      // return this.$store.state.permission.routes
      return this.$store.getters.userPermissionData.permission_redirect
    }
  },
  created () {
    this.initTabs()
  },
  methods: {
    // 初始页签数据
    initTabs () {
      // 固定标签
      if (this.routes === undefined) {
        return
      }
      this.tabs.push({ to: this.routes.path, title: this.routes.meta.title, closable: !this.routes.meta.title })
      // const affixTags = this.affixTags = this.filterAffixTags(this.routes)
      // affixTags.forEach(tag => {
      //   const item = {
      //     closable: false,
      //     icon: tag.meta.icon,
      //     id: tag.path,
      //     title: tag.meta.title,
      //     to: tag.fullPath,
      //     affix: tag.meta.affix
      //   }
      //   this.tabs.push(item)
      // })
    }
    // /**
    //  * 获取需要固定的标签
    //  */
    // filterAffixTags (routes, basePath = '/') {
    //   let tags = []
    //   routes.forEach(route => {
    //     if (route.meta && route.meta.affix) {
    //       const tagPath = path.resolve(basePath, route.path)
    //       tags.push({
    //         fullPath: tagPath,
    //         path: tagPath,
    //         name: route.name,
    //         meta: { ...route.meta }
    //       })
    //     }
    //     if (route.children) {
    //       const tempTags = this.filterAffixTags(route.children, route.path)
    //       if (tempTags.length >= 1) {
    //         tags = [...tags, ...tempTags]
    //       }
    //     }
    //   })
    //   return tags
    // }
  }
}
</script>

<style lang="scss" scoped>
.app-main {
  /* 50= navbar  50  */
  min-height: calc(100vh - 50px);
  width: 100%;
  position: relative;
  overflow: hidden;
}

.fixed-header + .app-main {
  padding-top: 50px;
}

.hasTagsView {
  .app-main {
    /* 84 = navbar + tags-view = 50 + 34 */
    min-height: calc(100vh - 84px);
  }

  .fixed-header + .app-main {
    padding-top: 84px;
  }
}
</style>

<style lang="scss">
// fix css style bug in open el-dialog
.el-popup-parent--hidden {
  .fixed-header {
    padding-right: 15px;
  }
}
</style>
<style scoped>
@font-face {
  font-family: 'iconfont';
  src: url('//at.alicdn.com/t/font_1423566_igs45ugc2o.eot?t=1568859254302'); /* IE9 */
  src: url('//at.alicdn.com/t/font_1423566_igs45ugc2o.eot?t=1568859254302#iefix')
      format('embedded-opentype'),
    /* IE6-IE8 */
      url('data:application/x-font-woff2;charset=utf-8;base64,d09GMgABAAAAAAUsAAsAAAAACegAAATeAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAHEIGVgCDMgqGYIVXATYCJAMUCwwABCAFhG0HbxuKCBEVpOWQfYmpyEjnhZCVswGhCcuCvpYn7qL27hvwGvwGCgAAAAAInmi//53Zmb3fVFHRKGKR1yCJWIJmScQ67fl9azoBrCc3ru5I5vnEl1SA/t7xbGcn5Gpk58vLn6jKbsnZAmK2sJNUHzfJ7y7937krum+Ht2jAIiugAU2gdKMZbkCRz1PVW7KRHL1dZXqRAx4QJ02EIbkA+OPecev8g7WeZbmMuWwPmxZgggGNvciKQoy5/QDPcGECp0OAaPKpRfoPHD6eSAyhngCyfMmiOUS6lFgMIkRKgpCuJnIEjIh0e9HrgDis317+gEyEwOEVYabRCwfMp/d3lc/vkvpPgbWGwH95swF4QIFawEDWhhqXo6a7FiX64zR6w/e+SBzuu8pH3U+59zubCLg9EkeLQsp44jkMJEAQxiKut8BGjiVToPBdlwKBH7n0j4mf75C9YoSeakcD8SAeZB1Ic8tsYngkNjZbWEFQBecITWuEzYqef+z1k+YPnN4/iQ+D7nwUy0dM9wEnHsXDgzN9oHv8vkmu7buwj4yHD6c8SdF9LJ9pOPpMxRdu+CQ4RmuRfXIxcTduGcTizaAwwWLHS+yifZ3rOwr9JHcrS/bR1Lbm9jZ42jqns3UK4T9MUIzMqZepiuBLbcMRpg0h/Lk5Vo41mNpfQviHby7/fgTOPIK+jY0Zanp6W1hueh78zciQUWe2nuw9Tp3oa+g9Cej5W0yPOT+RmrxTt3V2c31d+v7rXh5CyCOtb8h70FSL3GIRZCuDtrwkeBB/LNJU2WMC9RASWjEIuWM3xhKMsIdIY9sj4gJh/4A7x2LBzHlMahFzG90H+nQTFzuXuam7ZViCitu/PbcYGTRjRF9JndGd0aF1aTC/YmAKFE1oZCikJlFG4vrCAm4qhmEJjXQUw/u21jawftBFVhGX4cQHyWlJ0lVl9kJfeiM6aUP4epJq5NVanBo1cQLhgtuEtDRxm2hEV7icwJU6cYkJRxnyLjEdUzjA6AkOIY7IEwi5+Id223zcoxMWfok8TXn/73aW7ra0e2LI0GS0+Y+X5IlOi3Uod38r7ti/VHD8uxb74+6Om+6X7C67ox7jGqRqkgvmHe1edLJlw+6kFHEgsvcIM7qspllf1MxUuaP+pXX+g7ZIxZGCIY1Dz9g4Mrb1rtEf1BbIGbFpVXJNaU3iQ/Ga5AeS3aAAIEzhmG7Raz/AWMzg/zrH0dChV43/V6alJHT/Cla57RVNVBMzHUqFdPyISM060JJMwxtkeucIRm+ECdGZMj1VdA/wTN5EZgfHVMrhZU3mfTmitFqYKj/SxbqBI4I8UCIpRRmuFjwxtEJAJL0gmhoG9Y4hhbUoYlFANTsBhEQugCOeB6Ak8hhluHfgSecfBCQKBtFMlJQhYygXUTlPcTCc+fjg8iSdkzQ2N2I/kF+agzo5Ov4HGkobp1Hi9a3QQctoEa55ZubYqbS8hNnQNMJepcLJosLML+LYhV0oOklLc0pxMJz5+ODyJJ1T89vcd/0P5JfmoDEZP9Q/0FAWzmmUpECthF2qjG3ZJVzzzMyxU2l5CXo0olvYh1eqcLKoyOH0i5hyubTCqH5xu4xZZ3lWYQSi50TFxEuA3wuCzQL/efxsLTpzzyUXa8oObwfvw+50CSbtLrx8ujtaNxoBRgQAAA==')
      format('woff2'),
    url('//at.alicdn.com/t/font_1423566_igs45ugc2o.woff?t=1568859254302')
      format('woff'),
    url('//at.alicdn.com/t/font_1423566_igs45ugc2o.ttf?t=1568859254302')
      format('truetype'),
    /* chrome, firefox, opera, Safari, Android, iOS 4.2+ */
      url('//at.alicdn.com/t/font_1423566_igs45ugc2o.svg?t=1568859254302#iconfont')
      format('svg'); /* iOS 4.1- */
}

.iconfont {
  font-family: 'iconfont' !important;
  font-size: 16px;
  font-style: normal;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

.perfect-icon-question:before {
  content: '\e628';
}

.perfect-icon-commentquestionoutline:before {
  content: '\e768';
}

.perfect-icon-apps_custom_question1_btn:before {
  content: '\e61d';
}

.perfect-icon-reset:before {
  content: '\e8e3';
}
</style>
