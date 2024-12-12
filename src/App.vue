<template>
  <div
    v-cloak
    id="app"
    style="min-width: 1000px;"
  >
    <router-view />
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style >
.bgcolor {
  background-color: #fff;
}
/* add by zxh 解决闪烁 */
[v-cloak] {
  display: none !important;
}
</style>
