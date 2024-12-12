import request from '@/utils/request'

/**
 * 查询逻辑
 * @param {*} data
 */
export function getListApi (query) {
  return request({
    url: '/api/v1/log/api/new/list',
    method: 'post',
    data: query
  })
}

/**
 * 查詢詳情
 * @param {*} data
 */
export function getApi (query) {
  return request({
    url: '/api/v1/log/api/new/get',
    method: 'post',
    data: query
  })
}
