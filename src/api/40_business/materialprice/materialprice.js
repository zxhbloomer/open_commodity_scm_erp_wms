import request from '@/utils/request'

/**
 * 查询逻辑
 * @param {*} data
 */
export function getListApi (query) {
  return request({
    url: '/api/v1/materialprice/page_list',
    method: 'post',
    data: query
  })
}

/**
 * 同步逻辑, 暂时没有用到
 * @param {*} data
 */
export function syncApi (query) {
  return request({
    url: '/api/v1/materialprice/sync',
    method: 'post',
    data: query
  })
}

/**
 * 全部同步逻辑
 * @param {*} data
 */
export function syncAllApi (query) {
  return request({
    url: '/api/v1/materialprice/sync_all',
    method: 'get',
    data: query
  })
}

/**
 * 全部同步逻辑
 * @param {*} data
 */
export function recreateApi (query) {
  return request({
    url: '/api/v1/materialprice/recreate',
    method: 'post',
    data: query
  })
}

