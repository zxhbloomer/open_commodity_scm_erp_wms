import request from '@/utils/request'

/**
 * 获取列表配置信息
 * @param {*} data
 */
export function getTableConfigApi (query) {
  return request({
    url: '/api/v1/table/column/list',
    method: 'post',
    data: query
  })
}

/**
 * 获取列表初始配置信息
 * @param {*} data
 */
export function getTableConfigOriginalApi (query) {
  return request({
    url: '/api/v1/table/column/original/list',
    method: 'post',
    data: query
  })
}

/**
 * 重置列表配置信息
 * @param {*} data
 */
export function resetTableConfigApi (query) {
  return request({
    url: '/api/v1/table/column/reset',
    method: 'post',
    data: query
  })
}

/**
 * check用户数据是否与original数据一致
 * @param {*} data
 */
export function checkTableConfigApi (query) {
  return request({
    url: '/api/v1/table/column/check',
    method: 'post',
    data: query
  })
}

/**
 * 保存列表配置信息
 * @param {*} data
 */
export function saveTableConfigApi (query) {
  return request({
    url: '/api/v1/table/column/save',
    method: 'post',
    data: query
  })
}
