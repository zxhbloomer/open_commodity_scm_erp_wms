import request from '@/utils/request'

/**
 * 查询逻辑
 * @param {*} data
 */
export function getListApi (query) {
  return request({
    url: '/api/v1/todo/list',
    method: 'post',
    data: query
  })
}

/**
 * 查询逻辑 已办
 * @param {*} data
 */
export function getAlreadyDoListApi (query) {
  return request({
    url: '/api/v1/todo/done_list',
    method: 'post',
    data: query
  })
}
