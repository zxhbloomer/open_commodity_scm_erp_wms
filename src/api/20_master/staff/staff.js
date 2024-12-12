import request from '@/utils/request'

/**
 * 查询逻辑
 * @param {*} data
 */
export function getListApi (query) {
  return request({
    url: '/api/v1/staff/list',
    method: 'post',
    data: query
  })
}

/**
 * 查询逻辑
 * @param {*} data
 */
export function getApi (query) {
  return request({
    url: '/api/v1/staff/get',
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
    url: '/api/v1/staff/save',
    method: 'post',
    data
  })
}

/**
 * 更新api
 * @param {*} data
 */
export function updateSelfApi (data) {
  return request({
    url: '/api/v1/staff/self/save',
    method: 'post',
    data
  })
}

/**
 * 更新头像api
 * @param {*} data
 */
export function updateAvatarApi (data) {
  return request({
    url: '/api/v1/staff/avatar',
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
    url: '/api/v1/staff/insert',
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
    url: '/api/v1/staff/export_all',
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
    url: '/api/v1/staff/export_selection',
    method: 'post',
    data,
    responseType: 'arraybuffer'
  })
}

/**
 * 删除逻辑
 * @param {*} data
 */
export function deleteApi (data) {
  return request({
    url: '/api/v1/staff/delete',
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
    url: '/api/v1/staff/enable',
    method: 'post',
    data
  })
}

/**
 * 查询岗位员工
 * @param {*} data
 */
export function getPositionStaffData (data) {
  return request({
    url: '/api/v1/staff/position/list',
    method: 'post',
    data
  })
}

/**
 * 设置岗位员工
 * @param {*} data
 */
export function setPositionStaff (data) {
  return request({
    url: '/api/v1/staff/position/save',
    method: 'post',
    data
  })
}
