import request from '@/utils/request'

/**
 * 获取验证码
 * @param {*} data
 */
export function getSmsCodeApi (query) {
  return request({
    url: '/api/v1/sms/code',
    method: 'post',
    data: query
  })
}

/**
 * 获取验证码
 * @param {*} data
 */
export function checkSmsCodeApi (query) {
  return request({
    url: '/api/v1/sms/code/check',
    method: 'post',
    data: query
  })
}
