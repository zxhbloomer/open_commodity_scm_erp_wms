import request from '@/utils/request'

/**
 * 获取验证码
 * @param {*} data
 */
export function signUpApi (query) {
  return request({
    url: '/api/v1/signup/mobile',
    method: 'post',
    data: query
  })
}
