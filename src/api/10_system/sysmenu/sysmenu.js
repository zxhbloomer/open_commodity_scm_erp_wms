import request from '@/utils/request'

/**
 * 查询逻辑
 * @param {*} data
 */
export function getListApi (query) {
  return request({
    url: '/api/v1/menu/list',
    method: 'post',
    data: query
  })
}

/**
 * 查询逻辑：级联
 * @param {*} data
 */
export function getCascaderListApi (query) {
  return request({
    url: '/api/v1/menu/cascader/list',
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
    url: '/api/v1/menu/save',
    method: 'post',
    data
  })
}

/**
 * 新增菜单组
 * @param {*} data
 */
export function addMenuGroupApi (data) {
  return request({
    url: '/api/v1/menu/addmenugroup',
    method: 'post',
    data
  })
}

/**
 * 新增菜单组
 * @param {*} data
 */
export function addSubMenuApi (data) {
  return request({
    url: '/api/v1/menu/addsubmenu',
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
    url: '/api/v1/menu/realdelete',
    method: 'post',
    data
  })
}
