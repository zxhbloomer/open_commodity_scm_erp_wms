import request from '@/utils/request'

/**
 * 查询逻辑
 * @param {*} data
 */
export function getTreeListApi (query) {
  return request({
    url: '/api/v1/relation/tree/list',
    method: 'post',
    data: query
  })
}

/**
 * 查询逻辑：组织
 * @param {*} data
 */
export function getListApi (query) {
  return request({
    url: '/api/v1/relation/list',
    method: 'post',
    data: query
  })
}

// /**
//  * 查询逻辑：获取所有的组织以及子组织数量，仅仅是数量
//  * @param {*} data
//  */
// export function getAllRelationDataCountApi (query) {
//   return request({
//     url: '/api/v1/relation/count',
//     method: 'post',
//     data: query
//   })
// }

/**
 * 查询逻辑：获取所有该岗位下的仓库
 * @param {*} data
 */
export function getAllWarehouseListByPositionApi (query) {
  return request({
    url: '/api/v1/relation/warehouse/all',
    method: 'post',
    data: query
  })
}

/**
 * 查询逻辑：获取所有该岗位下的仓库Count
 * @param {*} data
 */
export function getAllWarehouseListByPositionCountApi (query) {
  return request({
    url: '/api/v1/relation/warehouse/count',
    method: 'post',
    data: query
  })
}

/**
 * 查询逻辑：仓库
 * @param {*} data
 */
export function getWarehouseListApi (query) {
  return request({
    url: '/api/v1/relation/warehouse',
    method: 'post',
    data: query
  })
}

/**
 * 查询逻辑：仓库
 * @param {*} data
 */
export function getWarehouseAllListApi (query) {
  return request({
    url: '/api/v1/relation/warehouse/list',
    method: 'post',
    data: query
  })
}

/**
 * 查询逻辑：获取所有员工的数据，为穿梭框服务
 * @param {*} data
 */
export function getWarehouseTransferListApi (query) {
  return request({
    url: '/api/v1/relation/warehouse/transfer/list',
    method: 'post',
    data: query
  })
}

/**
 * 查询逻辑：获取所有仓库的数据，为穿梭框服务
 * @param {*} data
 */
export function setWarehousesTransferApi (query) {
  return request({
    url: '/api/v1/relation/warehouse/transfer/save',
    method: 'post',
    data: query
  })
}

// /**
//  * 更新api
//  * @param {*} data
//  */
// export function updateApi (data) {
//   return request({
//     url: '/api/v1/relation/save',
//     method: 'post',
//     data
//   })
// }

/**
 * 插入api
 * @param {*} data
 */
export function insertApi (data) {
  return request({
    url: '/api/v1/relation/insert',
    method: 'post',
    data
  })
}

/**
 * 删除子结点
 * @param {*} data
 */
export function deleteApi (data) {
  return request({
    url: '/api/v1/relation/delete',
    method: 'post',
    data
  })
}

/**
 * 组织架构主表数据更新保存，拖拽后，全量更
 * @param {*} data
 */
export function dragsaveApi (data) {
  return request({
    url: '/api/v1/relation/dragsave',
    method: 'post',
    data
  })
}

/**
 * 获取穿梭框数据-员工
 * @param {*} data
 */
export function getStaffTransferDataApi (query) {
  return request({
    url: '/api/v1/warehouse/staff/transfer/get',
    method: 'post',
    data: query
  })
}

/**
 * 保存穿梭框数据-员工
 * @param {*} data
 */
export function saveStaffTransferDataApi (query) {
  return request({
    url: '/api/v1/warehouse/staff/transfer/save',
    method: 'post',
    data: query
  })
}
