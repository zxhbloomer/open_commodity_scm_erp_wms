import request from '@/utils/request'

/**
 * 根据岗位id，设置仓库组
 * @param {*} data
 */
export function setRelationByPostionIdWarehouseGroup (query) {
  return request({
    url: '/api/v1/position/whgroup/relation/save',
    method: 'post',
    data: query
  })
}
