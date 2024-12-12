import request from '@/utils/request'

/**
 * 查询逻辑
 * @param {*} data
 */
export function getListApi (query) {
  return request({
    url: '/api/v1/permission/role/list',
    method: 'post',
    data: query
  })
}

/**
 * 查询逻辑
 * @param {*} data
 */
export function getCascaderListApi (query) {
  return request({
    url: '/api/v1/permission/role/cascaderlist',
    method: 'post',
    data: query
  })
}

/**
 * 查询逻辑
 * @param {*} data
 */
export function getPermissionTransferListApi (query) {
  return request({
    url: '/api/v1/permission/role/permission/transfer/list',
    method: 'post',
    data: query
  })
}

/**
 * 保存逻辑
 * @param {*} data
 */
export function setPermissionTransferApi (query) {
  return request({
    url: '/api/v1/permission/role/permission/transfer/save',
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
    url: '/api/v1/permission/role/save',
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
    url: '/api/v1/permission/role/insert',
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
    url: '/api/v1/permission/role/export_all',
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
    url: '/api/v1/permission/role/export_selection',
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
    url: '/api/v1/permission/role/import',
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
    url: '/api/v1/permission/role/delete',
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
    url: '/api/v1/permission/role/enable',
    method: 'post',
    data
  })
}

/**
   * 设为管理员逻辑
   * @param {*} data
   */
export function adminApi (data) {
  return request({
    url: '/api/v1/permission/role/admin',
    method: 'post',
    data
  })
}

// /**
//    * 部门权限表数据获取系统菜单根节点
//    * @param {*} data
//    */
// export function getSystemMenuRootListApi(data) {
//   return request({
//     url: '/api/v1/permission/dept/get_sys_menu_root_node',
//     method: 'post'
//   })
// }

// /**
//    * 判断是否已经选择过，默认菜单进行编辑
//    * @param {*} data
//    */
// export function isAlreadySetMenuIdApi(data) {
//   return request({
//     url: '/api/v1/permission/dept/setted',
//     method: 'post',
//     data
//   })
// }
