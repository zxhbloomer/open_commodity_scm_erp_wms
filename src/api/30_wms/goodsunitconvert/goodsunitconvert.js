import request from '@/utils/request'

/**
 * 查询逻辑
 * @param {*} data
 */
export function getListApi (query) {
  return request({
    url: '/api/v1/goodsunitconvert/pagelist',
    method: 'post',
    data: query
  })
}

/**
 * 查询逻辑
 * @param {*} data
 */
export function getUnitConvertComboListApi (query) {
  return request({
    url: '/api/v1/goodsunitconvert/list',
    method: 'post',
    data: query
  })
}

/**
 * 插入逻辑
 * @param {*} data
 */
export function insertApi (query) {
  return request({
    url: '/api/v1/goodsunitconvert/insert',
    method: 'post',
    data: query
  })
}

/**
 * 更新逻辑
 * @param {*} data
 */
export function updateApi (query) {
  return request({
    url: '/api/v1/goodsunitconvert/update',
    method: 'post',
    data: query
  })
}

