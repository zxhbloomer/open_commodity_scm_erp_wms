import request from '@/utils/request'

/**
 * 查询逻辑
 * @param {*} data
 */
export function getListApi (query) {
  return request({
    url: '/api/v1/inventory/list',
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
    url: '/api/v1/inventory/owner/list/sum',
    method: 'post',
    data: query
  })
}

/**
 * 查询逻辑-按货主
 * @param {*} data
 */
export function getListByOwnerApi (query) {
  return request({
    url: '/api/v1/inventory/owner/list',
    method: 'post',
    data: query
  })
}

/**
 * 查询逻辑-按货主规格
 * @param {*} data
 */
export function getListByOwnerSpecApi (query) {
  return request({
    url: '/api/v1/inventory/owner/spec/list',
    method: 'post',
    data: query
  })
}

/**
 * 查询逻辑-按货主规格
 * @param {*} data
 */
export function getSpecListSumApi (query) {
  return request({
    url: '/api/v1/inventory/owner/spec/list/sum',
    method: 'post',
    data: query
  })
}

/**
 * 查询逻辑-库存流水
 * @param {*} data
 */
export function getAccountListApi (query) {
  return request({
    url: '/api/v1/inventoryaccount/list',
    method: 'post',
    data: query
  })
}

/**
 * 查询逻辑-库存流水
 * @param {*} data
 */
export function getAccountListSumApi (query) {
  return request({
    url: '/api/v1/inventoryaccount/sum',
    method: 'post',
    data: query
  })
}

/**
 * 库存流水 导出
 * @param {*} data
 */
export function exportAccountApi (data) {
  return request({
    url: '/api/v1/inventoryaccount/export',
    method: 'post',
    data,
    responseType: 'arraybuffer'
  })
}

/**
 * 查询逻辑
 * @param {*} data
 */
export function getAllListApi (query) {
  return request({
    url: '/api/v1/inventory/alllist',
    method: 'post',
    data: query
  })
}

/**
 * 查询逻辑
 * @param {*} data
 */
export function getInventoryApi (query) {
  return request({
    url: '/api/v1/inventory/get',
    method: 'post',
    data: query
  })
}

/**
 * 审核逻辑
 * @param {*} data
 */
export function auditApi (query) {
  return request({
    url: '/api/v1/inventory/audit',
    method: 'post',
    data: query
  })
}

/**
 * 重新生成每日库存
 * @param {*} data
 */
export function reCreateDailyInventoryApi (query) {
  return request({
    url: '/api/v1/daily/inventory/recreate/all',
    method: 'post',
    data: query
  })
}

