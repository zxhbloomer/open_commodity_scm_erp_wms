<template>
  <div class="popover-content">
    <div
      class="popover-content__item el-button"
      @click.stop.prevent="menuClick('处理中心')"
    >
      <i class="el-icon-refresh-left icon" />重置列宽度
    </div>
    <el-divider />
    <div
      class="popover-content__item el-button"
      @click.stop.prevent="menuClick('我的工作台')"
    >
      <i class="el-icon-data-analysis icon" />设置列属性
    </div>
  </div>
</template>
<script>
export default {
  name: 'MenuPart',
  props: {},
  data () {
    return {}
  },
  methods: {
    menuClick (eventName) {
      switch (eventName) {
        case '处理中心':
          // 自定义菜单点击事件
          this.$alert('处理中心', '标题名称', {
            confirmButtonText: '确定'
          })
          // 关闭菜单的方法
          this.$emit('closeMenuAndFloating')
          break
        case '我的工作台':
          // 自定义菜单点击事件
          this.$alert('处理中心', '标题名称', {
            confirmButtonText: '确定'
          })
          // 关闭菜单的方法
          this.$emit('closeMenuAndFloating')
          break
        case '资源管理':
          // 自定义菜单点击事件
          this.$alert('处理中心', '标题名称', {
            confirmButtonText: '确定'
          })
          // 关闭菜单的方法
          // this.$emit('closeMenuAndFloating');
          break
        default:
          break
      }
    }
  }
}
</script>
<style lang="scss" scoped>
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

.popover-content__item.el-button:hover {
  // background: var(--shadowColor);
}

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

  .el-button:focus,
  .el-button:hover {
    // color: var(--themeColor);
  }

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

    &.el-button:hover {
      // background: var(--shadowColor);
    }

    > .icon {
      margin-right: 10px;
      font-size: 18px;
    }
  }
}
</style>
