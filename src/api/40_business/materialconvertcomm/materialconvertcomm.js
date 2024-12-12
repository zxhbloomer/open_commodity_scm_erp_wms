import request from '@/utils/request'

/**
 * 查询逻辑
 * @param {*} data
 */
export function getListApi (query) {
  return request({
    url: '/api/v1/materialConvertPrice/list',
    method: 'post',
    data: query
  })
}

/**
 * 导出
 * @param {*} data
 */
export function exportApi (data) {
  return request({
    url: '/api/v1/materialConvertPrice/export',
    method: 'post',
    data,
    responseType: 'arraybuffer'
  })
}

/**
 * 求和
 * @param {*} data
 */
export function getListSumApi (query) {
  return request({
    url: '/api/v1/materialConvertPrice/list/sum',
    method: 'post',
    data: query
  })
}

/**
 * 同步
 * @param {*} data
 */
export function syncAllApi (query) {
  return request({
    url: '/api/v1/inventory/price/sync',
    method: 'get',
    data: query
  })
}
