import request from '@/utils/request'

/**
 * 查询库存明细
 * @param {*} data
 */
export function queryInventoryDetails (query) {
  return request({
    url: '/api/v1/query/inventory/list',
    method: 'post',
    data: query
  })
}

/**
 * 查询库存明细合计信息
 * @param {*} data
 */
export function getListSumApi (query) {
  return request({
    url: '/api/v1/query/inventory/list/sum',
    method: 'post',
    data: query
  })
}

/**
 * 导出逻辑
 * @param {*} data
 */
export function exportApi (data) {
  return request({
    url: '/api/v1/query/inventory/export',
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
    url: '/api/v1/query/inventory/export_all',
    method: 'post',
    data,
    responseType: 'arraybuffer'
  })
}

/**
 * 查询库存明细, 根据 订单id, 用于出库计划新增
 * @param {*} data
 */
export function queryInventory2OutPlanDetails (query) {
  return request({
    url: '/api/v1/query/inventory/outplan/list',
    method: 'post',
    data: query
  })
}
