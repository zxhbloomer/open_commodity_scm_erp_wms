import request from '@/utils/request'

/**
 * 保存逻辑
 * @param {*} data
 */
export function saveFileApi (query) {
  return request({
    url: '/api/v1/fileinfo/save',
    method: 'post',
    data: query
  })
}
