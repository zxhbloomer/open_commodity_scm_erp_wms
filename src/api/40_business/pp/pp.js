import request from '@/utils/request'

/**
 * 查询逻辑
 * @param {*} data
 */
export function getPageListApi (query) {
  return request({
    url: '/api/v1/pp/pagelist',
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
    url: '/api/v1/pp/list/sum',
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
    url: '/api/v1/pp/insert',
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
    url: '/api/v1/pp/update',
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
    url: '/api/v1/pp/getDetail',
    method: 'post',
    data: data
  })
}

/**
 * 提交
 * @param {*} data
 */
export function submitApi (data) {
  return request({
    url: '/api/v1/pp/submit',
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
    url: '/api/v1/pp/audit',
    method: 'post',
    data: data
  })
}

/**
 * 修改计划 已完成
 * @param {*} data
 */
export function finishApi (data) {
  return request({
    url: '/api/v1/pp/finish',
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
    url: '/api/v1/pp/reject',
    method: 'post',
    data: data
  })
}

/**
 * 作废
 * @param {*} data
 */
export function cancelApi (data) {
  return request({
    url: '/api/v1/pp/cancel',
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
    url: '/api/v1/pp/check',
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
    url: '/api/v1/pp/check_qty',
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
    url: '/api/v1/pp/export',
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
    url: '/api/v1/pp/todo/count',
    method: 'post',
    data: query
  })
}

/**
 * 下推生产订单
 * @param {*} data
 */
export function finishInsertApi (data) {
  return request({
    url: '/api/v1/wo/insert',
    method: 'post',
    data: data
  })
}

