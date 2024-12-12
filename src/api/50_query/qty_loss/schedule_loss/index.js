import request from '@/utils/request'

/**
 * 导出
 * @param {*} data
 */
export function exportApi (query) {
  return request({
    url: '/api/v1/query/schedule/list/export',
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
    url: '/api/v1/query/schedule/list/export_all',
    method: 'post',
    data: query,
    responseType: 'arraybuffer'
  })
}

/**
 * 物流损耗查询
 * @param {*} data
 */
export function getScheduleListApi (query) {
  return request({
    url: '/api/v1/query/schedule/list',
    method: 'post',
    data: query
  })
}

/**
 * 物流损耗合计查询
 * @param {*} data
 */
export function getScheduleListSumApi (query) {
  return request({
    url: '/api/v1/query/schedule/list/sum',
    method: 'post',
    data: query
  })
}
