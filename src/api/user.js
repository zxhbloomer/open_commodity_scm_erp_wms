import request from '@/utils/request'

// update by zxh
export function loginApi (data) {
  return request({
    url: '/api/v1/user/token/get',
    method: 'post',
    data
  })
}

export function ssoLoginApi (data) {
  return request({
    url: '/api/sso/v1/user/username/token/get',
    method: 'post',
    data
  })
}

export function setdnnode (data) {
  return request({
    url: '/api/v1/user/setdnnode',
    method: 'post',
    data
  })
}

export function getQxbConfigEntity (data) {
  return request({
    url: '/api/v1/qxb/getQxbConfigEntity',
    method: 'post',
    data
  })
}

export function getUserInfoApi (token) {
  return request({
    url: '/api/v1/user/info',
    method: 'get',
    params: { token }
  })
}

export function logout () {
  return request({
    url: '/api/v1/user/logout',
    method: 'post'
  })
}

export function getUserPwdWarningApi (data) {
  return request({
    url: '/api/v1/user/user_pwd_warning',
    method: 'post',
    data
  })
}

export function getUserBeanByIdApi (data) {
  return request({
    url: '/api/v1/user/detail',
    method: 'post',
    data
  })
}

export function getUsrPsdStringApi (data) {
  return request({
    url: '/api/v1/user/getpsd',
    method: 'post',
    data
  })
}

export function getPermissionAndTopNavApi (pathOrIndex, topNavCode, type) {
  return request({
    url: '/api/v1/user/permiss_topnav',
    method: 'post',
    params: { pathOrIndex, topNavCode, type }
  })
}

