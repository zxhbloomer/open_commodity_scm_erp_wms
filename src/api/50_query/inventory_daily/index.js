import request from '@/utils/request'

/**
 * 查询每日库存
 * @param {*} data
 */
export function queryInventoryDaily (query) {
  return request({
    url: '/api/v1/query/inventory/daily/list',
    method: 'post',
    data: query
  })
}

/**
 * 查询每日库存
 * @param {*} data
 */
export function getListSumApi (query) {
  return request({
    url: '/api/v1/query/inventory/daily/list/sum',
    method: 'post',
    data: query
  })
}

/**
 * 重新计算每日库存
 * @param {*} data
 */
export function recreateApi (query) {
  return request({
    url: '/api/v1/daily/inventory/recreate/all',
    method: 'post',
    data: query
  })
}

/**
 * 导出逻辑
 * @param {*} data
 */
export function exportApi (data) {
  return request({
    url: '/api/v1/query/inventory/daily/export',
    method: 'post',
    data,
    responseType: 'arraybuffer'
  })
}

/**
 * 导出逻辑
 * @param {*} data
 */
export function exportAllApi (data) {
  return request({
    url: '/api/v1/query/inventory/daily/export_all',
    method: 'post',
    data,
    responseType: 'arraybuffer'
  })
}

