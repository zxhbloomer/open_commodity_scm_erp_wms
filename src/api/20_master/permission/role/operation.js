import request from '@/utils/request'

/**
   * 获取操作清单
   * @param {*} data
   */
export function getOperationListApi (data) {
  return request({
    url: '/api/v1/permission/operation/role/list',
    method: 'post',
    data
  })
}

// /**
//    * 复制选中的菜单
//    * @param {*} data
//    */
// export function setSystemMenuData2PermissionDataApi(data) {
//   return request({
//     url: '/api/v1/permission/operation/dept/set_permission_menu_data',
//     method: 'post',
//     data
//   })
// }

/**
   * 保存选中的权限
   * @param {*} data
   */
export function savePermissionApi (data) {
  return request({
    url: '/api/v1/permission/operation/role/save',
    method: 'post',
    data
  })
}

/**
   * 重置权限菜单
   * @param {*} data
   */
export function refreshPermissionApi (data) {
  return request({
    url: '/api/v1/permission/role/refresh',
    method: 'post',
    data
  })
}
