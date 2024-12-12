import request from '@/utils/request'

/**
 * 查询逻辑
 * @param {*} data
 */
export function getListApi (query) {
  return request({
    url: '/api/v1/role/list',
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
    url: '/api/v1/role/save',
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
    url: '/api/v1/role/insert',
    method: 'post',
    data
  })
}

/**
 * 导出逻辑，全部导出
 * @param {*} data
 */
export function exportAllApi (data) {
  return request({
    url: '/api/v1/role/export_all',
    method: 'post',
    data,
    responseType: 'arraybuffer'
  })
}

/**
 * 导出逻辑，部分导出
 * @param {*} data
 */
export function exportSelectionApi (data) {
  return request({
    url: '/api/v1/role/export_selection',
    method: 'post',
    data,
    responseType: 'arraybuffer'
  })
}

/**
 * 导入逻辑
 * @param {*} data
 */
export function importExcelApi (data) {
  return request({
    url: '/api/v1/role/import',
    method: 'post',
    data
  })
}

/**
 * 删除逻辑
 * @param {*} data
 */
export function deleteApi (data) {
  return request({
    url: '/api/v1/role/delete',
    method: 'post',
    data
  })
}

/**
 * 启用逻辑
 * @param {*} data
 */
export function enableApi (data) {
  return request({
    url: '/api/v1/role/enable',
    method: 'post',
    data
  })
}

/**
 * 获取所有角色的数据，为穿梭框服务
 * @param {*} data
 */
export function getRoleTransferListApi (data) {
  return request({
    url: '/api/v1/role/position/transfer/list',
    method: 'post',
    data
  })
}

/**
 * 保存穿梭框数据，权限角色设置
 * @param {*} data
 */
export function setRoleTransferListApi (data) {
  return request({
    url: '/api/v1/role/position/transfer/save',
    method: 'post',
    data
  })
}
