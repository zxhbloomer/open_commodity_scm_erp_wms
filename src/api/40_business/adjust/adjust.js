import request from '@/utils/request'

/**
 * 查询逻辑
 * @param {*} data
 */
export function getListApi (query) {
  return request({
    url: '/api/v1/adjust/list',
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
    url: '/api/v1/adjust/insert',
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
    url: '/api/v1/adjust/audit',
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
    url: '/api/v1/adjust/delete',
    method: 'post',
    data
  })
}

/**
 * 删除api
 * @param {*} data
 */
export function submitApi (data) {
  return request({
    url: '/api/v1/adjust/submit',
    method: 'post',
    data
  })
}

/**
 * 删除api
 * @param {*} data
 */
export function getApi (data) {
  return request({
    url: '/api/v1/adjust/get',
    method: 'post',
    data
  })
}

