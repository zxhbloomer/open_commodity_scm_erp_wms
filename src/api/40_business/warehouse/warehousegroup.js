import request from '@/utils/request'

/**
 * 查询逻辑
 * @param {*} data
 */
export function getDataByIdApi (query) {
  return request({
    url: '/api/v1/warehouse/group/id',
    method: 'post',
    data: query
  })
}

/**
 * 查询逻辑
 * @param {*} data
 */
export function getPageListApi (query) {
  return request({
    url: '/api/v1/warehouse/group/page/list',
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
    url: '/api/v1/warehouse/group/list',
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
    url: '/api/v1/warehouse/group/save',
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
    url: '/api/v1/warehouse/group/insert',
    method: 'post',
    data
  })
}

/**
 * 删除api
 * @param {*} data
 */
export function deleteApi (data) {
  return request({
    url: '/api/v1/warehouse/group/delete',
    method: 'post',
    data
  })
}

/**
 * 查询仓库穿梭框api
 * @param {*} data
 */
export function getWarehouseTransferListApi (data) {
  return request({
    url: '/api/v1/warehouse/group/transfer/get',
    method: 'post',
    data
  })
}

/**
 * 插入仓库穿梭框api
 * @param {*} data
 */
export function setWarehouseTransferApi (data) {
  return request({
    url: '/api/v1/warehouse/group/transfer/save',
    method: 'post',
    data
  })
}
