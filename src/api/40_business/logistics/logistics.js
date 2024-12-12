import request from '@/utils/request'

/**
 * 查询逻辑
 * @param {*} data
 */
export function getListApi (query) {
  return request({
    url: '/api/v1/schedule/list',
    method: 'post',
    data: query
  })
}

/**
 * 详情查询逻辑
 * @param {*} data
 */
export function getApi (query) {
  return request({
    url: '/api/v1/schedule/get',
    method: 'post',
    data: query
  })
}

/**
 * 详情查询逻辑
 * @param {*} data
 */
export function getPlanDetailApi (query) {
  return request({
    url: '/api/v1/schedule/getplandetail',
    method: 'post',
    data: query
  })
}

/**
 * 更新api
 * @param {*} data
 */
export function updateApi1 (data) {
  return request({
    url: '/api/v1/schedule/update1',
    method: 'post',
    data
  })
}

/**
 * 更新api
 * @param {*} data
 */
export function updateApi2 (data) {
  return request({
    url: '/api/v1/schedule/update2',
    method: 'post',
    data
  })
}

/**
 * 插入api
 * @param {*} data
 */
export function insert1Api (data) {
  return request({
    url: '/api/v1/schedule/insert1',
    method: 'post',
    data
  })
}

/**
 * 插入api
 * @param {*} data
 */
export function insert2Api (data) {
  return request({
    url: '/api/v1/schedule/insert2',
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
    url: '/api/v1/schedule/submit',
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
    url: '/api/v1/schedule/audit',
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
    url: '/api/v1/schedule/return',
    method: 'post',
    data
  })
}

/**
 * 完成api
 * @param {*} data
 */
export function finishApi (data) {
  return request({
    url: '/api/v1/schedule/finish',
    method: 'post',
    data
  })
}

/**
 * 重新启用api
 * @param {*} data
 */
export function enableApi (data) {
  return request({
    url: '/api/v1/schedule/enable',
    method: 'post',
    data
  })
}

/**
 * 导出逻辑
 * @param {*} data
 */
export function exportApi (data) {
  return request({
    url: '/api/v1/schedule/export',
    method: 'post',
    data,
    responseType: 'arraybuffer'
  })
}

/**
 * 导出逻辑
 * @param {*} data
 */
export function exportAllApi (data) {
  return request({
    url: '/api/v1/schedule/export_all',
    method: 'post',
    data,
    responseType: 'arraybuffer'
  })
}

/**
 * 查询逻辑
 * @param {*} data
 */
export function getListSumApi (query) {
  return request({
    url: '/api/v1/schedule/list/sum',
    method: 'post',
    data: query
  })
}

/**
 * 查询逻辑
 * @param {*} data
 */
export function getScheduleQtyApi (query) {
  return request({
    url: '/api/v1/schedule/getScheduleQty',
    method: 'post',
    data: query
  })
}

/**
 * 作废
 * @param {*} data
 */
export function cancelApi (query) {
  return request({
    url: '/api/v1/schedule/cancel',
    method: 'post',
    data: query
  })
}

/**
 * 删除
 * @param {*} data
 */
export function deleteApi (query) {
  return request({
    url: '/api/v1/schedule/delete',
    method: 'post',
    data: query
  })
}

/**
 * 查询数据备份情况
 * @param {*} data
 */
export function isBackupApi (query) {
  return request({
    url: '/api/v1/schedule/is_backup',
    method: 'post',
    data: query
  })
}

/**
 * 插入api
 * @param {*} data
 */
export function insert3Api (data) {
  return request({
    url: '/api/v1/schedule/insert3',
    method: 'post',
    data
  })
}

/**
 * 更新api
 * @param {*} data
 */
export function updateApi3 (data) {
  return request({
    url: '/api/v1/schedule/update3',
    method: 'post',
    data
  })
}
