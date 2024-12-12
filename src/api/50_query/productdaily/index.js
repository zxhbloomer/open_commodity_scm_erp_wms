import request from '@/utils/request'

/**
 * 查询每日库存
 * @param {*} data
 */
export function getPageListApi (query) {
  return request({
    url: 'api/v1/product_daily/pagelist',
    method: 'post',
    data: query
  })
}

/**
 * 导出
 * @param {*} data
 */
export function exportApi (data) {
  return request({
    url: 'api/v1/product_daily/export',
    method: 'post',
    data,
    responseType: 'arraybuffer'
  })
}

/**
 * 查询 合计
 * @param {*} query
 */
export function getListSumApi (query) {
  return request({
    url: 'api/v1/product_daily/sum',
    method: 'post',
    data: query
  })
}
