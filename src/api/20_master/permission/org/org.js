import request from '@/utils/request'

/**
 * 查询逻辑
 * @param {*} data
 */
export function getTreeListApi (query) {
  return request({
    url: '/api/v1/permission/org/tree/dept/list',
    method: 'post',
    data: query
  })
}
