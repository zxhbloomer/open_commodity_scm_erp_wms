import request from '@/utils/request'

/**
 * 损耗报表
 * @param {*} data
 */
export function exportLossApi (query) {
  return request({
    url: '/api/v1/query/loss/export',
    method: 'post',
    data: query,
    responseType: 'arraybuffer'
  })
}

/**
 * 导出全部
 * @param {*} data
 */
export function exportLossAllApi (query) {
  return request({
    url: '/api/v1/query/loss/export_all',
    method: 'post',
    data: query,
    responseType: 'arraybuffer'
  })
}

/**
 * 导出
 * @param {*} data
 */
export function exportOnWayApi (query) {
  return request({
    url: '/api/v1/query/in_transit/inventor/export',
    method: 'post',
    data: query,
    responseType: 'arraybuffer'
  })
}

/**
 * 导出全部
 * @param {*} data
 */
export function exportOnWayAllApi (query) {
  return request({
    url: '/api/v1/query/in_transit/inventor/export_all',
    method: 'post',
    data: query,
    responseType: 'arraybuffer'
  })
}

/**
 * 根据商品类型 查询损耗 和 在途数量
 * @param {*} data
 */
export function getQtyListApi (query) {
  return request({
    url: '/api/v1/query/qty_total/list',
    method: 'post',
    data: query
  })
}

/**
 * 根据商品类型 在途数量
 * @param {*} data
 */
export function getWayQtyListApi (query) {
  return request({
    url: '/api/v1/query/qty_total/list',
    method: 'post',
    data: query
  })
}

/**
 * 根据商品类型 查询损耗 和 在途数量 合计
 * @param {*} data
 */
export function getQtyListSumApi (query) {
  return request({
    url: '/api/v1/query/qty_total/list/sum',
    method: 'post',
    data: query
  })
}

/**
 * 根据商品类型 在途数量 包含 铁路港口码头虚拟库
 * @param {*} data
 */
export function getWayQtyAndInventorListApi (query) {
  return request({
    url: '/api/v1/query/qty_total/list_and_inventor',
    method: 'post',
    data: query
  })
}

/**
 * 根据商品类型 在途数量 包含 铁路港口码头虚拟库
 * @param {*} data
 */
export function getWayQtyAndInventorListSumApi (query) {
  return request({
    url: '/api/v1/query/qty_total/list_and_inventor/sum',
    method: 'post',
    data: query
  })
}
