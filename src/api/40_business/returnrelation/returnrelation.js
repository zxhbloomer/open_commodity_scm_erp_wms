import request from '@/utils/request'

/**
 * 查询逻辑
 * @param {*} data
 */
export function getListApi (query) {
  return request({
    url: '/api/v1/return/relation/pagelist',
    method: 'post',
    data: query
  })
}

/**
 * 查询详情
 * @param {*} data
 */
export function getApi (query) {
  return request({
    url: '/api/v1/return/relation/getDetail',
    method: 'post',
    data: query
  })
}

/**
 * 部分导出
 * @param {*} data
 */
export function exportAllApi (query) {
  return request({
    url: '/api/v1/return/relation/export_all',
    method: 'post',
    data: query,
    responseType: 'arraybuffer'
  })
}
/**
 * 全部导出
 * @param {*} data
 */
export function exportApi (query) {
  return request({
    url: '/api/v1/return/relation/export',
    method: 'post',
    data: query,
    responseType: 'arraybuffer'
  })
}
