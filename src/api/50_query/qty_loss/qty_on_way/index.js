import request from '@/utils/request'

/**
 * 导出
 * @param {*} data
 */
export function exportApi (query) {
  return request({
    url: '/api/v1/query/in_transit/inventor/list/export',
    method: 'post',
    data: query,
    responseType: 'arraybuffer'
  })
}

/**
 * 导出全部
 * @param {*} data
 */
export function exportAllApi (query) {
  return request({
    url: '/api/v1/query/in_transit/inventor/list/export_all',
    method: 'post',
    data: query,
    responseType: 'arraybuffer'
  })
}