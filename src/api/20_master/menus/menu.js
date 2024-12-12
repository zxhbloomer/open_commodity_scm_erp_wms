import request from '@/utils/request'

/**
 * 查询逻辑
 * @param {*} data
 */
export function getListApi (query) {
  return request({
    url: '/api/v1/menus/list',
    method: 'post',
    data: query
  })
}

/**
 * 查询逻辑：级联
 * @param {*} data
 */
export function getCascaderListApi (query) {
  return request({
    url: '/api/v1/menus/cascader/list',
    method: 'post',
    data: query
  })
}

/**
 * 更新api
 * @param {*} data
 */
export function updateApi (data) {
  return request({
    url: '/api/v1/menus/save',
    method: 'post',
    data
  })
}

/**
 * 保存重定向数据
 * @param {*} data
 */
export function saveRedirectApi (data) {
  return request({
    url: '/api/v1/menus/redirect/save',
    method: 'post',
    data
  })
}

/**
 * 新增菜单组
 * @param {*} data
 */
export function addMenuGroupApi (data) {
  return request({
    url: '/api/v1/menus/addmenugroup',
    method: 'post',
    data
  })
}

/**
 * 新增子结点
 * @param {*} data
 */
export function addTopNavApi (data) {
  return request({
    url: '/api/v1/menus/addtopnav',
    method: 'post',
    data
  })
}

/**
 * 新增子结点
 * @param {*} data
 */
export function addSubNodeApi (data) {
  return request({
    url: '/api/v1/menus/addsubnode',
    method: 'post',
    data
  })
}

/**
 * 新增菜单组
 * @param {*} data
 */
export function addSubMenuApi (data) {
  return request({
    url: '/api/v1/menus/addsubmenu',
    method: 'post',
    data
  })
}

/**
 * 物理删除选择数据
 * @param {*} data
 */
export function realDeleteSelectionApi (data) {
  return request({
    url: '/api/v1/menus/realdelete',
    method: 'post',
    data
  })
}

/**
 * 组织架构主表数据更新保存，拖拽后，全量更
 * @param {*} data
 */
export function dragsaveApi (data) {
  return request({
    url: '/api/v1/menus/dragsave',
    method: 'post',
    data
  })
}

/**
 * search 弹框查询路径
 * @param query
 * @returns {AxiosPromise}
 */
export function getSearchListApi (query) {
  return request({
    url: '/api/v1/menus/cache/search',
    method: 'get',
    data: query
  })
}

/**
* search 弹框查询路径
* @param query
* @returns {AxiosPromise}
*/
export function saveCacheApi (query) {
  return request({
    url: '/api/v1/menus/cache/save',
    method: 'post',
    data: query
  })
}

/**
 * search 删除历史记录
 * @param query
 * @returns {AxiosPromise}
 */
export function deleteHistoryApi (query) {
  return request({
    url: '/api/v1/menus/cache/deletehistory',
    method: 'post',
    data: query
  })
}

/**
 * search 弹框查询路径
 * @param query
 * @returns {AxiosPromise}
 */
export function getCacheAPi (query) {
  return request({
    url: '/api/v1/menus/cache/history',
    method: 'get',
    data: query
  })
}

/**
 * search 保存收藏
 * @param query
 * @returns {AxiosPromise}
 */
export function saveCollectionMenuApi (query) {
  return request({
    url: '/api/v1/menus/cache/savecollection',
    method: 'post',
    data: query
  })
}

/**
 * search 弹框查询路径
 * @param query
 * @returns {AxiosPromise}
 */
export function getCollectionListApi (query) {
  return request({
    url: '/api/v1/menus/cache/getcollection',
    method: 'post',
    data: query
  })
}
