import request from '@/utils/request'

/**
 * 查询逻辑
 * @param {*} data
 */
export function getListApi (query) {
  return request({
    url: '/api/v1/monitor/list',
    method: 'post',
    data: query
  })
}

/**
 * 详情查询逻辑
 * @param {*} data
 */
export function getApi (query) {
  return request({
    url: '/api/v1/monitor/get',
    method: 'post',
    data: query
  })
}

/**
 * 详情查询逻辑-上一条
 * @param {*} data
 */
export function getPrevApi (query) {
  return request({
    url: '/api/v1/monitor/get/prev',
    method: 'post',
    data: query
  })
}

/**
 * 详情查询逻辑-下一条
 * @param {*} data
 */
export function getNextApi (query) {
  return request({
    url: '/api/v1/monitor/get/next',
    method: 'post',
    data: query
  })
}

/**
 * 作废逻辑
 * @param {*} data
 */
export function cancelApi (query) {
  return request({
    url: '/api/v1/monitor/cancel',
    method: 'post',
    data: query
  })
}

/**
 * 监管出库修改逻辑逻辑
 * @param {*} data
 */
export function saveOutApi (query) {
  return request({
    url: '/api/v1/monitor/out/save',
    method: 'post',
    data: query
  })
}

/**
 * 监管入库修改逻辑逻辑
 * @param {*} data
 */
export function saveInApi (query) {
  return request({
    url: '/api/v1/monitor/in/save',
    method: 'post',
    data: query
  })
}

/**
 * 监管任务附件修改逻辑
 * @param {*} data
 */
export function saveFileApi (query) {
  return request({
    url: '/api/v1/monitor/file/save',
    method: 'post',
    data: query
  })
}

/**
 * 导出影像文件逻辑
 * @param {*} data
 */
export function exportApi (query) {
  return request({
    url: '/api/v1/monitor/export',
    method: 'post',
    data: query
  })
}

/**
 * 导出全部影像文件数据
 * @param {*} data
 */
export function exportAllApi (query) {
  return request({
    url: '/api/v1/monitor/exportall',
    method: 'post',
    data: query
  })
}

/**
 * 导出数据逻辑
 * @param {*} data
 */
export function exportDataApi (data) {
  return request({
    url: '/api/v1/monitor/exportdata',
    method: 'post',
    data,
    responseType: 'arraybuffer'
  })
}

/**
 * 导出数据逻辑
 * @param {*} data
 */
export function exportAllDataApi (data) {
  return request({
    url: '/api/v1/monitor/exportalldata',
    method: 'post',
    data,
    responseType: 'arraybuffer'
  })
}

/**
 * 重新获取轨迹
 * @param {*} data
 */
export function getTrackApi (query) {
  return request({
    url: '/api/v1/monitor/track/refresh',
    method: 'post',
    data: query
  })
}

/**
 * 结算
 * @param {*} data
 */
export function settleApi (query) {
  return request({
    url: '/api/v1/monitor/settle',
    method: 'post',
    data: query
  })
}

/**
 * 入库审核
 * @param {*} data
 */
export function auditInApi (query) {
  return request({
    url: '/api/v1/monitor/in/audit',
    method: 'post',
    data: query
  })
}

/**
 * 出库审核
 * @param {*} data
 */
export function auditOutApi (query) {
  return request({
    url: '/api/v1/monitor/out/audit',
    method: 'post',
    data: query
  })
}

/**
 * 驳回
 * @param {*} data
 */
export function returnApi (query) {
  return request({
    url: '/api/v1/monitor/return',
    method: 'post',
    data: query
  })
}

/**
 * 获取附件信息
 * @param {*} data
 */
export function getMonitorFileApi (query) {
  return request({
    url: '/api/v1/monitor/getfiles',
    method: 'post',
    data: query
  })
}

/**
 * 查询逻辑
 * @param {*} data
 */
export function getListSumApi (query) {
  return request({
    url: '/api/v1/monitor/list/sum',
    method: 'post',
    data: query
  })
}

/**
 * 监管任务司机修改
 * @param {*} data
 */
export function saveDriverApi (query) {
  return request({
    url: '/api/v1/monitor/driver/save',
    method: 'post',
    data: query
  })
}

/**
 * 监管任务车牌号修改
 * @param {*} data
 */
export function saveVehicleApi (query) {
  return request({
    url: '/api/v1/monitor/vehicle/save',
    method: 'post',
    data: query
  })
}

/**
 * 监管任务修改验车状态
 * @param {*} data
 */
export function saveValidatVehicleApi (query) {
  return request({
    url: '/api/v1/monitor/validatVehicle/save',
    method: 'post',
    data: query
  })
}

/**
 * 备份逻辑
 * @param {*} data
 */
export function backupApi (query) {
  return request({
    url: '/api/v2/monitor/backup/async',
    method: 'post',
    data: query
  })
}

/**
 * 备份逻辑
 * @param {*} data
 */
export function getBackupCountApi (query) {
  return request({
    url: '/api/v2/monitor/backup/count',
    method: 'post',
    data: query
  })
}

/**
 * 备份逻辑
 * @param {*} data
 */
export function getRestoreCountApi (query) {
  return request({
    url: '/api/v1/monitor/backup/restore/count',
    method: 'post',
    data: query
  })
}

/**
 * 查询数量
 * @param {*} data
 */
export function getCountApi (query) {
  return request({
    url: '/api/v1/monitor/count',
    method: 'post',
    data: query
  })
}

/**
 * 同步
 * @param {*} data
 */
export function syncApi (query) {
  return request({
    url: '/api/v1/monitor/sync',
    method: 'post',
    data: query
  })
}

/**
 * 全部同步
 * @param {*} data
 */
export function syncAllApi (query) {
  return request({
    url: '/api/v1/monitor/sync/all',
    method: 'post',
    data: query
  })
}

/**
 * 删除
 * @param {*} data
 */
export function deleteApi (query) {
  return request({
    url: '/api/v1/monitor/delete',
    method: 'post',
    data: query
  })
}

/**
 * 查询导出附件配置
 * @param {*} data
 */
export function getExportFileSettingsApi () {
  return request({
    url: '/api/v1/monitor_file/get',
    method: 'get'
  })
}

/**
 * 保存导出附件配置
 * @param {*} data
 */
export function saveExportFileSettingsApi (data) {
  return request({
    url: '/api/v1/monitor_file/save',
    method: 'post',
    data: data
  })
}

/**
 * 轨迹日志
 * @param {*} data
 */
export function getValidateAndTrackLogApi (data) {
  return request({
    url: '/api/v1/monitor/validate_track/log',
    method: 'post',
    data: data
  })
}

/**
 * 查询业务中台, 监管任务是否被结算
 * @param {*} id
 */
export function selectYWZTIsSettleApi (id) {
  return request({
    url: '/api/v1/monitor/selectsettle',
    method: 'get',
    params: { id }
  })
}

/**
 * 审核状态回滚待审核
 * @param {*} data
 */
export function statusRollbackApi (data) {
  return request({
    url: '/api/v1/monitor/statusRollback',
    method: 'post',
    data: data
  })
}

/**
 * 退货单 增加
 * @param {*} data
 */
export function insertReturnRelation (data) {
  return request({
    url: '/api/v1/return/relation/insert_return_relation',
    method: 'post',
    data: data
  })
}

/**
 * 退货单 修改
 * @param {*} data
 */
export function updateReturnRelation (data) {
  return request({
    url: '/api/v1/return/relation/update_return_relation',
    method: 'post',
    data: data
  })
}
