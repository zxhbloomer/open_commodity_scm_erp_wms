import request from '@/utils/request'

/**
 * 取所有的下拉选项的数据bean
 * @param {*} data
 */
export function getDeleteTypeNormalApi () {
  return request({
    url: '/api/v1/common/component/select/deletetypenormal/list',
    method: 'post'
  })
}

/**
 * 根据参数，取所有的下拉选项的数据bean
 * @param {*} data
 */
export function getDictDataApi (data) {
  return request({
    url: '/api/v1/common/component/select/dict/list',
    method: 'post',
    data
  })
}

/**
 * 根据参数，取所有的下拉选项的数据bean
 * @param {*} data
 */
export function getDictGroupDataApi (data) {
  return request({
    url: '/api/v1/common/component/select/dict/group_list',
    method: 'post',
    data
  })
}

/**
 *
 * @param {*} data
 */
export function getAllProvinces (data) {
  return request({
    url: '/api/v1/common/areas/provinces/list',
    method: 'post',
    data
  })
}
