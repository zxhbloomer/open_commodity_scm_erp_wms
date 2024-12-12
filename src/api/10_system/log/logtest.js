import request from '@/utils/request'

/**
 * 验车日志
 * @param {*} data
 */
export function getValidateTestLogApi (query) {
  return request({
    url: '/api/v1/trackvalidate/log/validate',
    method: 'post',
    data: query
  })
}

/**
 * 轨迹日期
 * @param {*} data
 */
export function getTrackTestLogApi (query) {
  return request({
    url: '/api/v1/trackvalidate/log/track',
    method: 'post',
    data: query
  })
}
