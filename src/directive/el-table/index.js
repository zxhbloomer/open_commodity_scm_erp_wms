import adaptive from './adaptive'
import Vue from 'vue'

const install = function (Vue) {
  Vue.directive('el-height-adaptive-table', adaptive)
}

if (window.Vue) {
  window['el-height-adaptive-table'] = adaptive
  Vue.use(install)
}

adaptive.install = install
export default adaptive
