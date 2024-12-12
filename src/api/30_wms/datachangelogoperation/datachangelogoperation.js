import request from '@/utils/request'

/**
 * 查询逻辑
 * @param {*} data
 */
export function getListApi (query) {
  return request({
    url: '/api/v1/log/datachange/operation/list',
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
    url: '/api/v1/log/datachange/operation/get',
    method: 'post',
    data: query
  })
}

