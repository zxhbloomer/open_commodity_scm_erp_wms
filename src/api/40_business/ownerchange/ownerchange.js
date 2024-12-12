import request from '@/utils/request'

/**
 * 查询逻辑
 * @param {*} data
 */
export function getApi (query) {
  return request({
    url: '/api/v1/ownerchange/get',
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
    url: '/api/v1/ownerchange/list',
    method: 'post',
    data: query
  })
}

/**
 * 新增逻辑
 * @param {*} data
 */
export function insertApi (query) {
  return request({
    url: '/api/v1/ownerchange/insert',
    method: 'post',
    data: query
  })
}

/**
 * 编辑逻辑
 * @param {*} data
 */
export function updateApi (query) {
  return request({
    url: '/api/v1/ownerchange/update',
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
    url: '/api/v1/ownerchange/audit',
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
    url: '/api/v1/ownerchange/delete',
    method: 'post',
    data
  })
}
