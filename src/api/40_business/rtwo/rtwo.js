import request from '@/utils/request'

/**
 * 查询逻辑
 * @param {*} data
 */
export function getPageListApi (query) {
  return request({
    url: '/api/v1/rt/wo/pagelist',
    method: 'post',
    data: query
  })
}

/**
 * 新增
 * @param {*} data
 */
export function insertApi (data) {
  return request({
    url: '/api/v1/rt/wo/insert',
    method: 'post',
    data: data
  })
}

/**
 * 更新
 * @param {*} data
 */
export function updateApi (data) {
  return request({
    url: '/api/v1/rt/wo/update',
    method: 'post',
    data: data
  })
}

/**
 * 查看详情
 * @param {*} data
 */
export function getDetailApi (data) {
  return request({
    url: '/api/v1/rt/wo/getDetail',
    method: 'post',
    data: data
  })
}

/**
 * 查看详情
 * @param {*} data
 */
export function submitApi (data) {
  return request({
    url: '/api/v1/rt/wo/submit',
    method: 'post',
    data: data
  })
}

/**
 * 查看详情
 * @param {*} data
 */
export function auditApi (data) {
  return request({
    url: '/api/v1/rt/wo/audit',
    method: 'post',
    data: data
  })
}

/**
 * 驳回
 * @param {*} data
 */
export function rejectApi (data) {
  return request({
    url: '/api/v1/rt/wo/reject',
    method: 'post',
    data: data
  })
}

/**
 * 驳回
 * @param {*} data
 */
export function cancelApi (data) {
  return request({
    url: '/api/v1/rt/wo/cancel',
    method: 'post',
    data: data
  })
}

/**
 * 获取库存
 * @param {*} data
 */
export function getInventoryApi (data) {
  return request({
    url: '/api/v1/rt/wo/inventory/calc',
    method: 'post',
    data: data
  })
}

export function exportApi (data) {
  return request({
    url: '/api/v1/rt/wo/export',
    method: 'post',
    data,
    responseType: 'arraybuffer'
  })
}

/**
 * 查询 待办数量
 * @param {*} data
 */
export function getTodoCountApi (query) {
  return request({
    url: '/api/v1/rt/wo/todo/count',
    method: 'post',
    data: query
  })
}

