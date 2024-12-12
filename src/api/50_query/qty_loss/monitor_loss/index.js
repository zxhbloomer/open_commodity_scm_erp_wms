import request from '@/utils/request'

/**
 * 导出
 * @param {*} data
 */
export function exportApi (query) {
  return request({
    url: '/api/v1/query/monitor/list/export',
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
    url: '/api/v1/query/monitor/list/export_all',
    method: 'post',
    data: query,
    responseType: 'arraybuffer'
  })
}

/**
 * 查询库存明细
 * @param {*} data
 */
export function getMonitorListApi (query) {
  return request({
    url: '/api/v1/query/monitor/list',
    method: 'post',
    data: query
  })
}

/**
 * 查询库存明细
 * @param {*} data
 */
export function getMonitorListSumApi (query) {
  return request({
    url: '/api/v1/query/monitor/list/sum',
    method: 'post',
    data: query
  })
}
