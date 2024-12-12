import request from '@/utils/request'

/**
 * 查询逻辑
 * @param {*} data
 */
export function getListApi (query) {
  return request({
    url: '/api/v1/job/list',
    method: 'post',
    data: query
  })
}

/**
 * 更新api
 * @param {*} data
 */
export function updateApi (data) {
  return request({
    url: '/api/v1/job/save',
    method: 'post',
    data
  })
}

/**
 * 插入api
 * @param {*} data
 */
export function insertApi (data) {
  return request({
    url: '/api/v1/job/insert',
    method: 'post',
    data
  })
}

/**
 * 插入api
 * @param {*} data
 */
export function deleteApi (data) {
  return request({
    url: '/api/v1/job/delete',
    method: 'post',
    data
  })
}
