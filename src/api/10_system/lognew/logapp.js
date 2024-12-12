import request from '@/utils/request'

/**
 * 查询逻辑
 * @param {*} data
 */
export function getListApi (query) {
  return request({
    url: '/api/v1/log/app/new/list',
    method: 'post',
    data: query
  })
}

/**
 * 查询逻辑
 * @param {*} data
 */
export function getApi (query) {
  return request({
    url: '/api/v1/log/app/new/get',
    method: 'post',
    data: query
  })
}
