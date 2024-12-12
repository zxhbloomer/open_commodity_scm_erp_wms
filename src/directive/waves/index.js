import waves from './waves'
import Vue from 'vue'

const install = function (Vue) {
  Vue.directive('waves', waves)
}

if (window.Vue) {
  window.waves = waves
  Vue.use(install)
}

waves.install = install
export default waves
