import request from '@/utils/request'

/**
 * 查询逻辑
 * @param {*} data
 */
export function getListApi (query) {
  return request({
    url: '/api/v1/inplan/list',
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
    url: '/api/v1/inplan/todo/count',
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
    url: '/api/v1/inplan/list/sum',
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
    url: '/api/v1/inplan/get',
    method: 'post',
    data: query
  })
}

/**
 * 查询入库数量
 * @param {*} data
 */
export function countApi (query) {
  return request({
    url: '/api/v1/inplan/checkcount',
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
    url: '/api/v1/inplan/getplandetail',
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
    url: '/api/v1/inplan/save',
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
    url: '/api/v1/inplan/insert',
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
    url: '/api/v1/inplan/submit',
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
    url: '/api/v1/inplan/audit',
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
    url: '/api/v1/inplan/return',
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
    url: '/api/v1/inplan/cancelaudit',
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
    url: '/api/v1/inplan/cancelreturn',
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
    url: '/api/v1/inplan/cancel',
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
    url: '/api/v1/inplan/finish',
    method: 'post',
    data
  })
}

/**
 * 入库操作api
 * @param {*} data
 */
export function operateApi (data) {
  return request({
    url: '/api/v1/inplan/operate',
    method: 'post',
    data
  })
}

/**
 * 提货操作api
 * @param {*} data
 */
export function operateDeliveryApi (data) {
  return request({
    url: '/api/v1/inplan/operateDelivery',
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
    url: '/api/v1/inplan/syncall',
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
    url: '/api/v1/inplan/sync',
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
    url: '/api/v1/inplan/export',
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
    url: '/api/v1/inplan/export_all',
    method: 'post',
    data,
    responseType: 'arraybuffer'
  })
}

/**
 * 查询选中的数据是否包含多个详情
 * @param {*} data
 */
export function getIsHaveMoreDetailApi (data) {
  return request({
    url: '/api/v1/inplan/get_detail_count',
    method: 'post',
    data
  })
}

/**
 * 查询超收配置
 * @param {*} data
 */
export function getOverReceiveConfigApi (query) {
  return request({
    url: '/api/v1/inplan/over_receive/get',
    method: 'post',
    data: query
  })
}

/**
 * 查询 皮重, 毛重 开关控制
 * @param {*} data
 */
export function getWeightControlConfigApi (query) {
  return request({
    url: '/api/v1/inplan/weight_control/get',
    method: 'get',
    data: query
  })
}

/**
 * 查询 皮重, 毛重 开关控制
 * @param {*} data
 */
export function getCountApi (query) {
  return request({
    url: '/api/v1/inplan/count',
    method: 'post',
    data: query
  })
}
