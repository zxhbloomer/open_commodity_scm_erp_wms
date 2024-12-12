import request from '@/utils/request'

/**
 * 查询列表逻辑
 * @param {*} data
 */
export function getListApi (query) {
  return request({
    url: '/api/v1/delivery/list',
    method: 'post',
    data: query
  })
}

/**
 * 查询列表数量逻辑
 * @param {*} data
 */
export function getCountApi (query) {
  return request({
    url: '/api/v1/delivery/list/count',
    method: 'post',
    data: query
  })
}

/**
 * 查询逻辑
 * @param {*} data
 */
export function getTodoCountApi (query) {
  return request({
    url: '/api/v1/delivery/todo/count',
    method: 'post',
    data: query
  })
}

/**
 * 查询逻辑
 * @param {*} data
 */
export function getListSumApi (query) {
  return request({
    url: '/api/v1/delivery/list/sum',
    method: 'post',
    data: query
  })
}

/**
 * 查询明细逻辑
 * @param {*} data
 */
export function getApi (query) {
  return request({
    url: '/api/v1/delivery/get',
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
    url: '/api/v1/delivery/save',
    method: 'post',
    data
  })
}

/**
 * 提交api
 * @param {*} data
 */
export function submitApi (data) {
  return request({
    url: '/api/v1/delivery/submit',
    method: 'post',
    data
  })
}

/**
 * 审核api
 * @param {*} data
 */
export function auditApi (data) {
  return request({
    url: '/api/v1/delivery/audit',
    method: 'post',
    data
  })
}

/**
 * 驳回api
 * @param {*} data
 */
export function returnApi (data) {
  return request({
    url: '/api/v1/delivery/return',
    method: 'post',
    data
  })
}

/**
 * 作废审核api
 * @param {*} data
 */
export function cancelAuditApi (data) {
  return request({
    url: '/api/v1/delivery/cancelaudit',
    method: 'post',
    data
  })
}

/**
 * 作废驳回api
 * @param {*} data
 */
export function cancelReturnApi (data) {
  return request({
    url: '/api/v1/delivery/cancelreturn',
    method: 'post',
    data
  })
}

/**
 * 作废api
 * @param {*} data
 */
export function cancelApi (data) {
  return request({
    url: '/api/v1/delivery/cancel',
    method: 'post',
    data
  })
}

/**
 * 同步所有数据
 * @param {*} data
 */
export function syncAllApi (data) {
  return request({
    url: '/api/v1/delivery/syncall',
    method: 'post',
    data
  })
}

/**
 * 同步选中数据
 * @param {*} data
 */
export function syncApi (data) {
  return request({
    url: '/api/v1/delivery/sync',
    method: 'post',
    data
  })
}

/**
 * 导出逻辑
 * @param {*} data
 */
export function exportBInApi (data) {
  return request({
    url: '/api/v1/delivery/export',
    method: 'post',
    data,
    responseType: 'arraybuffer'
  })
}

/**
 * 导出逻辑
 * @param {*} data
 */
export function exportAllBInApi (data) {
  return request({
    url: '/api/v1/delivery/export_all',
    method: 'post',
    data,
    responseType: 'arraybuffer'
  })
}
