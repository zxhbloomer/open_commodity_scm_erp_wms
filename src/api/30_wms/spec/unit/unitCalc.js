import request from '@/utils/request'

/**
 * 查询逻辑
 * @param {*} data
 */
export function getPageListApi (query) {
  return request({
    url: '/api/v1/goods/unit/calc/pagelist',
    method: 'post',
    data: query
  })
}

/**
 * 查询逻辑
 * @param {*} data
 */
export function getUnusedUnitsListApi (query) {
  return request({
    url: '/api/v1/goods/unit/calc/get/unused/list',
    method: 'post',
    data: query
  })
}

/**
 * 查询逻辑
 * @param {*} data
 */
export function getListApi (query) {
  return request({
    url: '/api/v1/goods/unit/calc/list',
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
    url: '/api/v1/goods/unit/calc/insert',
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
    url: '/api/v1/goods/unit/calc/update',
    method: 'post',
    data: query
  })
}

/**
 * 删除逻辑
 * @param {*} data
 */
export function deleteApi (query) {
  return request({
    url: '/api/v1/goods/unit/calc/delete',
    method: 'post',
    data: query
  })
}

/**
 * 根据id查询数据
 * @param {*} data
 */
export function getDetailApi (query) {
  return request({
    url: '/api/v1/goods/unit/calc/detail',
    method: 'post',
    data: query
  })
}

/**
 * 根据id查询数据
 * @param {*} data
 */
export function getOnlyOneUnitCalcApi (query) {
  return request({
    url: '/api/v1/goods/unit/calc/one',
    method: 'post',
    data: query
  })
}

/**
 * 根据数据条数
 * @param {*} data
 */
export function getCountApi (query) {
  return request({
    url: '/api/v1/goods/unit/calc/count',
    method: 'post',
    data: query
  })
}
