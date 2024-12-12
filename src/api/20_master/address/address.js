import request from '@/utils/request'

/**
 * 查询逻辑
 * @param {*} data
 */
export function getListApi (query) {
  return request({
    url: '/api/v1/mst/address/list',
    method: 'post',
    data: query
  })
}

/**
 * 更新api
 * @param {*} data
 */
export function updateApi (data) {
  return request({
    url: '/api/v1/mst/address/save',
    method: 'post',
    data
  })
}

/**
 * 插入api
 * @param {*} data
 */
export function insertApi (data) {
  return request({
    url: '/api/v1/mst/address/insert',
    method: 'post',
    data
  })
}

/**
 * 删除逻辑
 * @param {*} data
 */
export function realDeleteSelectionApi (data) {
  return request({
    url: '/api/v1/mst/address/delete',
    method: 'post',
    data
  })
}

/**
 * 获取数据byid逻辑
 * @param {*} data
 */
export function getDataByIdApi (data) {
  return request({
    url: '/api/v1/mst/address/get',
    method: 'post',
    data
  })
}

