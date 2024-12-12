import request from '@/utils/request'

/**
 * 查询逻辑
 * @param {*} data
 */
export function getWarehouseTransferListApi (query) {
  return request({
    url: '/api/v1/position/warehouse/transfer/list',
    method: 'post',
    data: query
  })
}

/**
 * 查询逻辑
 * @param {*} data
 */
export function setWarehousesTransferApi (query) {
  return request({
    url: '/api/v1/position/warehouse/transfer/save',
    method: 'post',
    data: query
  })
}

