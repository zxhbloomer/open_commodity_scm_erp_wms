import request from '@/utils/request'

/**
 * 当日累计调度统计
 * @param {*} data
 */
export function getScheduleApi (query) {
  return request({
    url: '/api/v1/data_board/get/schedule',
    method: 'post',
    data: query
  })
}

/**
 * 当日累计出库量
 * @param {*} data
 */
export function getOutApi (query) {
  return request({
    url: '/api/v1/data_board/get/out',
    method: 'post',
    data: query
  })
}

/**
 * 当日累计入库量
 * @param {*} data
 */
export function getInApi (query) {
  return request({
    url: '/api/v1/data_board/get/in',
    method: 'post',
    data: query
  })
}
