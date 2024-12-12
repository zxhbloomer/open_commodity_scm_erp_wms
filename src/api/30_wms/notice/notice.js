import request from '@/utils/request'

/**
 * 查询逻辑
 * @param {*} data
 */
export function getListApi (query) {
  return request({
    url: '/api/v1/notice/list',
    method: 'post',
    data: query
  })
}

/**
 * 插入api
 * @param {*} data
 */
export function insertApi (data) {
  return request({
    url: '/api/v1/notice/insert',
    method: 'post',
    data
  })
}

/**
 * 修改api
 * @param {*} data
 */
export function updateApi (data) {
  return request({
    url: '/api/v1/notice/update',
    method: 'post',
    data
  })
}
