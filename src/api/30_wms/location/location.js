import request from '@/utils/request'

/**
 * 查询逻辑
 * @param {*} data
 */
export function getListApi (query) {
  return request({
    url: '/api/v1/location/list',
    method: 'post',
    data: query
  })
}

/**
 * 查询逻辑
 * @param {*} data
 */
export function getLocationComboListApi (query) {
  return request({
    url: '/api/v1/location/combolist',
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
    url: '/api/v1/location/save',
    method: 'post',
    data
  })
}

/**
 * 插入api
 * @param {*} data
 */
export function insertApi (data) {
  return request({
    url: '/api/v1/location/insert',
    method: 'post',
    data
  })
}

/**
 * 启用选择数据
 * @param {*} data
 */
export function enabledSelectionApi (data) {
  return request({
    url: '/api/v1/location/enabled',
    method: 'post',
    data
  })
}

/**
 * 停用选择数据
 * @param {*} data
 */
export function disAbledSelectionApi (data) {
  return request({
    url: '/api/v1/location/disabled',
    method: 'post',
    data
  })
}

/**
 * 停用/停用 选择数据
 * @param {*} data
 */
export function enableOrDisAbleApi (data) {
  return request({
    url: '/api/v1/location/enable',
    method: 'post',
    data
  })
}

/**
 * 导出
 * @param {*} data
 */
export function exportApi (data) {
  return request({
    url: '/api/v1/location/export',
    method: 'post',
    data,
    responseType: 'arraybuffer'
  })
}
