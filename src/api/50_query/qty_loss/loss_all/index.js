import request from '@/utils/request'

/**
 * 导出
 * @param {*} data
 */
export function exportApi (query) {
  return request({
    url: '/api/v1/query/qty_loss/list/export',
    method: 'post',
    data: query,
    responseType: 'arraybuffer'
  })
}

/**
 * 导出全部
 * @param {*} data
 */
export function exportAllApi (query) {
  return request({
    url: '/api/v1/query/qty_loss/list/export_all',
    method: 'post',
    data: query,
    responseType: 'arraybuffer'
  })
}

/**
 * 损耗详情 查询
 * @param {*} data
 */
export function getLossQtListApi (query) {
  return request({
    url: '/api/v1/query/qty_loss/list',
    method: 'post',
    data: query
  })
}

/**
 * 损耗详情合计 查询
 * @param {*} data
 */
export function getLossQtListSumApi (query) {
  return request({
    url: '/api/v1/query/qty_loss/list/sum',
    method: 'post',
    data: query
  })
}

/**
 * 在途报表详情包含铁路港口码头虚拟库
 * @param {*} data
 */
export function getLossInventorListApi (query) {
  return request({
    url: '/api/v1/query/qty_loss/list_inventor',
    method: 'post',
    data: query
  })
}

/**
 * 在途报表 合计 包含铁路港口码头虚拟库
 * @param {*} data
 */
export function getLossInventorListSumApi (query) {
  return request({
    url: '/api/v1/query/qty_loss/list_inventor/sum',
    method: 'post',
    data: query
  })
}
