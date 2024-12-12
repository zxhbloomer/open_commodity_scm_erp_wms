import request from '@/utils/request'

/**
 * 导出
 * @param {*} data
 */
export function exportApi (query) {
  return request({
    url: '/api/v1/query/out/list/export',
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
    url: '/api/v1/query/out/list/export_all',
    method: 'post',
    data: query,
    responseType: 'arraybuffer'
  })
}

/**
 * 销售订单 查询
 * @param {*} data
 */
export function getOutListApi (query) {
  return request({
    url: '/api/v1/query/out/list',
    method: 'post',
    data: query
  })
}

/**
 * 查询库存明细
 * @param {*} data
 */
export function getOutListSumApi (query) {
  return request({
    url: '/api/v1/query/out/list/sum',
    method: 'post',
    data: query
  })
}
