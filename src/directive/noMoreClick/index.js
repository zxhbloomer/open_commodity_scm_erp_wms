import noMoreClick from './noMoreClick'
import Vue from 'vue'

const install = function (Vue) {
  Vue.directive('no-more-click', noMoreClick)
}

if (window.Vue) {
  window['no-more-click'] = noMoreClick
  Vue.use(install)
}

noMoreClick.install = install
export default noMoreClick
