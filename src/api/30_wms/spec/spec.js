import request from '@/utils/request'

/**
 * 查询逻辑
 * @param {*} data
 */
export function getListApi (query) {
  return request({
    url: '/api/v1/goodsspec/list',
    method: 'post',
    data: query
  })
}

/**
 * 查询逻辑
 * @param {*} data
 */
export function getListByGoodsIdApi (query) {
  return request({
    url: '/api/v1/goodsspec/search_by_goods',
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
    url: '/api/v1/goodsspec/save',
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
    url: '/api/v1/goodsspec/insert',
    method: 'post',
    data
  })
}

/**
 * 物理删除选择数据
 * @param {*} data
 */
export function realDeleteSelectionApi (data) {
  return request({
    url: '/api/v1/goodsspec/delete',
    method: 'post',
    data
  })
}

/**
 * 启用选择数据
 * @param {*} data
 */
export function enabledSelectionApi (data) {
  return request({
    url: '/api/v1/goodsspec/enabled',
    method: 'post',
    data
  })
}

/**
 * 停用选择数据
 * @param {*} data
 */
export function disAbledSelectionApi (data) {
  return request({
    url: '/api/v1/goodsspec/disabled',
    method: 'post',
    data
  })
}

/**
 * 停用/停用 选择数据
 * @param {*} data
 */
export function enableOrDisAbleApi (data) {
  return request({
    url: '/api/v1/goodsspec/enable',
    method: 'post',
    data
  })
}

/**
 * 导出
 * @param {*} data
 */
export function exportApi (data) {
  return request({
    url: '/api/v1/goodsspec/export',
    method: 'post',
    data,
    responseType: 'arraybuffer'
  })
}

/**
 * 物料转换查询逻辑
 * @param {*} data
 */
export function getConvertGoodsListApi (query) {
  return request({
    url: '/api/v1/goodsspec/convert/list',
    method: 'post',
    data: query
  })
}
