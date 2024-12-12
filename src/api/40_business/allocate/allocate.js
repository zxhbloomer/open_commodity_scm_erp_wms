import request from '@/utils/request'

/**
 * 查询逻辑
 * @param {*} data
 */
export function getApi (query) {
  return request({
    url: '/api/v1/allocate/get',
    method: 'post',
    data: query
  })
}

/**
 * 查询逻辑
 * @param {*} data
 */
export function getListApi (query) {
  return request({
    url: '/api/v1/allocate/list',
    method: 'post',
    data: query
  })
}

/**
 * 详情查询逻辑
 * @param {*} data
 */
export function insertApi (query) {
  return request({
    url: '/api/v1/allocate/insert',
    method: 'post',
    data: query
  })
}

/**
 * 审核api
 * @param {*} data
 */
export function auditApi (data) {
  return request({
    url: '/api/v1/allocate/audit',
    method: 'post',
    data
  })
}

/**
 * 删除api
 * @param {*} data
 */
export function deleteApi (data) {
  return request({
    url: '/api/v1/allocate/delete',
    method: 'post',
    data
  })
}
