import request from '@/utils/request'

/**
 * 查询逻辑
 * @param {*} data
 */
export function getPageListApi (query) {
  return request({
    url: '/api/v1/wo/pagelist',
    method: 'post',
    data: query
  })
}

/**
 * 合计
 * @param {*} data
 */
export function getListSumApi (query) {
  return request({
    url: '/api/v1/wo/list/sum',
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
    url: '/api/v1/wo/insert',
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
    url: '/api/v1/wo/update',
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
    url: '/api/v1/wo/getDetail',
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
    url: '/api/v1/wo/submit',
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
    url: '/api/v1/wo/audit',
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
    url: '/api/v1/wo/reject',
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
    url: '/api/v1/wo/cancel',
    method: 'post',
    data: data
  })
}

/**
 * 公式校验
 * @param {*} data
 */
export function checkApi (data) {
  return request({
    url: '/api/v1/wo/check',
    method: 'post',
    data: data
  })
}

/**
 * 计算数量
 * @param {*} data
 */
export function checkQtyApi (data) {
  return request({
    url: '/api/v1/wo/check_qty',
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
    url: '/api/v1/wo/inventory/calc',
    method: 'post',
    data: data
  })
}

export function exportApi (data) {
  return request({
    url: '/api/v1/wo/export',
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
    url: '/api/v1/wo/todo/count',
    method: 'post',
    data: query
  })
}
