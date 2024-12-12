import request from '@/utils/request'
// 合同统计

/**
 * 采购合同统计
 * @param {*} query
 */
export function getPurchasePageListApi (query) {
  return request({
    url: 'api/v1/report/purchase/page_list',
    method: 'post',
    data: query
  })
}

/**
 * 稻谷入库进度表 合计
 * @param {*} query
 */
export function getPurchaseListSumAPi (query) {
  return request({
    url: 'api/v1/report/purchase/sum',
    method: 'post',
    data: query
  })
}

/**
 * 采购合同统计表 导出
 * @param {*} query
 */
export function exportPurchaseApi (query) {
  return request({
    url: 'api/v1/report/purchase/export',
    method: 'post',
    data: query,
    responseType: 'arraybuffer'
  })
}

/**
 * 销售合同统计
 * @param {*} query
 */
export function getSalesPageListApi (query) {
  return request({
    url: 'api/v1/report/sales/page_list',
    method: 'post',
    data: query
  })
}

/**
 * 销售合同统计 合计
 * @param {*} query
 */
export function getSalesPageListSumApi (query) {
  return request({
    url: 'api/v1/report/sales/sum',
    method: 'post',
    data: query
  })
}

/**
 * 销售合同统计表 导出
 * @param {*} query
 */
export function exportSalesApi (query) {
  return request({
    url: 'api/v1/report/sales/export',
    method: 'post',
    data: query,
    responseType: 'arraybuffer'
  })
}
