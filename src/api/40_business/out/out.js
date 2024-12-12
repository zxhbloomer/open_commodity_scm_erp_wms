import request from '@/utils/request'

/**
 * 查询逻辑
 * @param {*} data
 */
export function getListApi (query) {
  return request({
    url: '/api/v1/out/list',
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
    url: '/api/v1/out/todo/count',
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
    url: '/api/v1/out/list/sum',
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
    url: '/api/v1/out/get',
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
    url: '/api/v1/out/save',
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
    url: '/api/v1/out/insert',
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
    url: '/api/v1/out/submit',
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
    url: '/api/v1/out/audit',
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
    url: '/api/v1/out/return',
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
    url: '/api/v1/out/cancel',
    method: 'post',
    data
  })
}

/**
 * 作废api, 直接作废
 * @param {*} data
 */
export function cancelDirectApi (data) {
  return request({
    url: '/api/v1/out/canceldirect',
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
    url: '/api/v1/out/cancelaudit',
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
    url: '/api/v1/out/cancelreturn',
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
    url: '/api/v1/out/syncall',
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
    url: '/api/v1/out/sync',
    method: 'post',
    data
  })
}

/**
 * 导入逻辑
 * @param {*} data
 */
export function importBOutApi (data) {
  return request({
    url: '/api/v1/out/import',
    method: 'post',
    data
  })
}

/**
 * 导出逻辑
 * @param {*} data
 */
export function exportBOutApi (data) {
  return request({
    url: '/api/v1/out/export',
    method: 'post',
    data,
    responseType: 'arraybuffer'
  })
}

/**
 * 导出逻辑
 * @param {*} data
 */
export function exportAllBOutApi (data) {
  return request({
    url: '/api/v1/out/export_all',
    method: 'post',
    data,
    responseType: 'arraybuffer'
  })
}

/**
 * 查询逻辑
 * @param {*} data
 */
export function getListCountApi (query) {
  return request({
    url: '/api/v1/out/list/count',
    method: 'post',
    data: query
  })
}
