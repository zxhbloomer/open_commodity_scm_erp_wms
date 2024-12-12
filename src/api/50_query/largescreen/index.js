import request from '@/utils/request'

/**
 * 仓库数据看板 供应链相关
 * @param {*}
 */
export function getLogisticsSupplyApi () {
  return request({
    url: `/api/v1/largescreen/logistics/supply`,
    method: 'get'
  })
}

/**
 * 物流数据看板 车次相关
 * @param {*}
 */
export function getTrainCountApi () {
  return request({
    url: `/api/v1/largescreen/logistics/train_count`,
    method: 'get'
  })
}

/**
 * 物流数据看板 物流合同
 * @param {*}
 */
export function getCarriageCountApi () {
  return request({
    url: `/api/v1/largescreen/logistics/carriage`,
    method: 'get'
  })
}

/**
 * 物流数据看板 当月数据
 * @param {*}
 */
export function getMonthDataApi () {
  return request({
    url: `/api/v1/largescreen/logistics/month`,
    method: 'get'
  })
}

/**
 * 物流数据看板 实时运输状态
 * @param {*}
 */
export function getMonitorListApi () {
  return request({
    url: `/api/v1/largescreen/logistics/monitor`,
    method: 'get'
  })
}
