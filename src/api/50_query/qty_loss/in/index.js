import request from '@/utils/request'

/**
 * 采购合同 部分导出
 * @param {*} data
 */
export function exportApi (query) {
  return request({
    url: '/api/v1/query/in/export',
    method: 'post',
    data: query,
    responseType: 'arraybuffer'
  })
}

/**
 * 采购合同 全部导出
 * @param {*} data
 */
export function exportAllApi (query) {
  return request({
    url: '/api/v1/query/in/export_all',
    method: 'post',
    data: query,
    responseType: 'arraybuffer'
  })
}

/**
 * 采购合同 查询
 * @param {*} data
 */
export function getInListApi (query) {
  return request({
    url: '/api/v1/query/in/list',
    method: 'post',
    data: query
  })
}

/**
 * 采购合同合计 查询
 * @param {*} data
 */
export function getInListSumApi (query) {
  return request({
    url: '/api/v1/query/in/list/sum',
    method: 'post',
    data: query
  })
}

/**
 * 按类型查询合同量
 * @param {*} data
 */
export function getContractNumApi (query) {
  return request({
    url: '/api/v1/query/in_out/list',
    method: 'post',
    data: query
  })
}

