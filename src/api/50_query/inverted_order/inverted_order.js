import request from '@/utils/request'

/**
 * 获取存在数据的日期
 * @param {*} data
 */
export function getBadgeDateApi (query) {
  return request({
    url: '/api/v1/query/inverted_order_query/getBadgeDate',
    method: 'post',
    data: query
  })
}

/**
 * 获取存在数据的日期
 * @param {*} data
 */
export function getListApi (query) {
  return request({
    url: '/api/v1/query/inverted_order_query/list',
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
    url: '/api/v1/query/inverted_order_query/export',
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
    url: '/api/v1/query/inverted_order_query/export_all',
    method: 'post',
    data,
    responseType: 'arraybuffer'
  })
}
