import request from '@/utils/request'

/**
 * 查询逻辑
 * @param {*} data
 */
export function getListApi (query) {
  return request({
    url: '/api/v1/permission/dept/list',
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
    url: '/api/v1/permission/dept/save',
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
    url: '/api/v1/permission/dept/insert',
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
    url: '/api/v1/permission/dept/export_all',
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
    url: '/api/v1/permission/dept/export_selection',
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
    url: '/api/v1/permission/dept/import',
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
    url: '/api/v1/permission/dept/delete',
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
    url: '/api/v1/permission/dept/enable',
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
