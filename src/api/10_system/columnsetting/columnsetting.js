import request from '@/utils/request'

/**
 * 查询逻辑
 * @param {*} data
 */
export function getListApi (query) {
  return request({
    url: '/api/v1/table/column/original/page_list',
    method: 'post',
    data: query
  })
}

/**
 * 更新
 * @param {*} data
 */
export function updateApi (data) {
  return request({
    url: '/api/v1/table/column/original/update',
    method: 'post',
    data: data
  })
}

/**
 * 更新
 * @param {*} data
 */
export function sortApi (data) {
  return request({
    url: '/api/v1/table/column/original/sort',
    method: 'post',
    data: data
  })
}

/**
 * 更新
 * @param {*} data
 */
export function insertApi (data) {
  return request({
    url: '/api/v1/table/column/original/insert',
    method: 'post',
    data: data
  })
}

/**
 * 查询详情
 * @param {*} data
 */
export function getApi (query) {
  return request({
    url: '/api/v1/table/column/original/get',
    method: 'post',
    data: query
  })
}
