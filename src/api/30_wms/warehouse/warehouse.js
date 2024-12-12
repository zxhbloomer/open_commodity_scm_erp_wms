import request from '@/utils/request'

/**
 * 查询逻辑
 * @param {*} data
 */
export function getListApi (query) {
  return request({
    url: '/api/v1/warehouse/pagelist',
    method: 'post',
    data: query
  })
}

/**
 * 根据传入的仓库id，获取到相应的库区/库位
 * @param {*} data
 */
export function getWare_loc_binApi (query) {
  return request({
    url: '/api/v1/warehouse/ware_loc_bin',
    method: 'post',
    data: query
  })
}

/**
 * 获取所有的仓库/库区/库位
 * @param {*} data
 */
export function getAll_ware_loc_binApi (query) {
  return request({
    url: '/api/v1/warehouse/all_ware_loc_bin',
    method: 'post',
    data: query
  })
}

/**
 * 查询逻辑
 * @param {*} data
 */
export function getWarehouseComboListApi (query) {
  return request({
    url: '/api/v1/warehouse/list',
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
    url: '/api/v1/warehouse/save',
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
    url: '/api/v1/warehouse/insert',
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
    url: '/api/v1/warehouse/delete',
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
    url: '/api/v1/warehouse/enabled',
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
    url: '/api/v1/warehouse/disabled',
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
    url: '/api/v1/warehouse/enable',
    method: 'post',
    data
  })
}

/**
 * 导出数据 全部导出
 * @param {*} data
 */
export function exportAllApi (data) {
  return request({
    url: '/api/v1/warehouse/export_all',
    method: 'post',
    data,
    responseType: 'arraybuffer'
  })
}

/**
 * 导出数据 部分导出
 * @param {*} data
 */
export function exportApi (data) {
  return request({
    url: '/api/v1/warehouse/export',
    method: 'post',
    data,
    responseType: 'arraybuffer'
  })
}

/**
 * 获取穿梭框数据
 * @param {*} data
 */
export function getTransferDataApi (query) {
  return request({
    url: '/api/v1/warehouse/transfer/get',
    method: 'post',
    data: query
  })
}

/**
 * 保存穿梭框数据
 * @param {*} data
 */
export function saveTransferDataApi (query) {
  return request({
    url: '/api/v1/warehouse/transfer/save',
    method: 'post',
    data: query
  })
}

