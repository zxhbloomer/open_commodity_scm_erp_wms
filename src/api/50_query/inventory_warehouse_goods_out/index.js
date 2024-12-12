import request from '@/utils/request'

/**
 * 查询库存明细
 * @param {*} data
 */
export function queryReportOutList (query) {
  return request({
    url: '/api/v1/query/report/out/list',
    method: 'post',
    data: query
  })
}

/**
 * 查询库存合计
 * @param {*} data
 */
export function queryReportOutListSum (query) {
  return request({
    url: '/api/v1/query/report/out/list/sum',
    method: 'post',
    data: query
  })
}

/**
 * 导出
 * @param {*} data
 */
export function exportApi (query) {
  return request({
    url: '/api/v1/query/report/out/list/export',
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
    url: '/api/v1/query/report/out/list/export_all',
    method: 'post',
    data: query,
    responseType: 'arraybuffer'
  })
}

