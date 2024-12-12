import request from '@/utils/request'

/**
 * 查询逻辑
 * @param {*} data
 */
export function getListApi (query) {
  return request({
    url: '/api/v1/outplan/list',
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
    url: '/api/v1/outplan/todo/count',
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
    url: '/api/v1/outplan/list/sum',
    method: 'post',
    data: query
  })
}

/**
 * 查询逻辑 单条数据
 * @param {*} data
 */
export function getApi (query) {
  return request({
    url: '/api/v1/outplan/get',
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
    url: '/api/v1/outplan/getplandetail',
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
    url: '/api/v1/outplan/save',
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
    url: '/api/v1/outplan/insert',
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
    url: '/api/v1/outplan/submit',
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
    url: '/api/v1/outplan/audit',
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
    url: '/api/v1/outplan/return',
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
    url: '/api/v1/outplan/cancelaudit',
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
    url: '/api/v1/outplan/cancelreturn',
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
    url: '/api/v1/outplan/cancel',
    method: 'post',
    data
  })
}

/**
 * 出库操作api
 * @param {*} data
 */
export function operateApi (data) {
  return request({
    url: '/api/v1/outplan/operate',
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
    url: '/api/v1/outplan/syncall',
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
    url: '/api/v1/outplan/sync',
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
    url: '/api/v1/outplan/export',
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
    url: '/api/v1/outplan/export_all',
    method: 'post',
    data,
    responseType: 'arraybuffer'
  })
}

/**
 * 完成api
 * @param {*} data
 */
export function finishApi (data) {
  return request({
    url: '/api/v1/outplan/finish',
    method: 'post',
    data
  })
}

/**
 * 完成api
 * @param {*} data
 */
export function getDetailCountAPi (data) {
  return request({
    url: '/api/v1/outplan/get_detail_count',
    method: 'post',
    data
  })
}

/**
 * 查询超收配置
 * @param {*} data
 */
export function getOverReleaseConfigApi (query) {
  return request({
    url: '/api/v1/outplan/over_release/get',
    method: 'post',
    data: query
  })
}

/**
 * 查询逻辑
 * @param {*} data
 */
export function getListCountApi (query) {
  return request({
    url: '/api/v1/outplan/list/count',
    method: 'post',
    data: query
  })
}

/**
 * 收货操作api
 * @param {*} data
 */
export function operateReceiveApi (data) {
  return request({
    url: '/api/v1/outplan/operateReceive',
    method: 'post',
    data
  })
}
