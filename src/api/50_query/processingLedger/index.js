import request from '@/utils/request'
// 加工台账

/**
 * 稻谷入库进度表
 * @param {*} query
 */
export function getRicePageListApi (query) {
  return request({
    url: 'api/v1/ledger/rice_in/page_list',
    method: 'post',
    data: query
  })
}

/**
 * 稻谷入库进度表 合计
 * @param {*} query
 */
export function getRiceListSumApi (query) {
  return request({
    url: 'api/v1/ledger/rice_in/sum',
    method: 'post',
    data: query
  })
}

/**
 * 稻谷入库进度表 导出
 * @param {*} query
 */
export function exportRiceListApi (query) {
  return request({
    url: 'api/v1/ledger/rice_in/export',
    method: 'post',
    data: query,
    responseType: 'arraybuffer'
  })
}

/**
 * 玉米入库进度表
 * @param {*} query
 */
export function getMaizePageListApi (query) {
  return request({
    url: 'api/v1/ledger/maize_in/page_list',
    method: 'post',
    data: query
  })
}

/**
 * 玉米入库进度表 求和
 * @param {*} query
 */
export function getMaizePageListSumApi (query) {
  return request({
    url: 'api/v1/ledger/maize_in/sum',
    method: 'post',
    data: query
  })
}

/**
 * 玉米入库进度表 导出
 * @param {*} query
 */
export function exportMaizeListApi (query) {
  return request({
    url: 'api/v1/ledger/maize_in/export',
    method: 'post',
    data: query,
    responseType: 'arraybuffer'
  })
}

/**
 * 小麦入库进度表
 * @param {*} query
 */
export function getWheatPageListApi (query) {
  return request({
    url: 'api/v1/ledger/wheat_in/page_list',
    method: 'post',
    data: query
  })
}

/**
 * 小麦入库进度表 合计
 * @param {*} query
 */
export function getWheatPageListSumApi (query) {
  return request({
    url: 'api/v1/ledger/wheat_in/sum',
    method: 'post',
    data: query
  })
}

/**
 * 小麦入库进度表 合计
 * @param {*} query
 */
export function exportWheatListApi (query) {
  return request({
    url: 'api/v1/ledger/wheat_in/export',
    method: 'post',
    data: query,
    responseType: 'arraybuffer'
  })
}

/**
 * 混合物出库进度表
 * @param {*} query
 */
export function getComboPageListApi (query) {
  return request({
    url: 'api/v1/ledger/combo_out/page_list',
    method: 'post',
    data: query
  })
}

/**
 * 混合物出库进度表 求和
 * @param {*} query
 */
export function getComboListSumApi (query) {
  return request({
    url: 'api/v1/ledger/combo_out/sum',
    method: 'post',
    data: query
  })
}

/**
 * 混合物出库进度表 导出
 * @param {*} query
 */
export function exportComboListApi (query) {
  return request({
    url: 'api/v1/ledger/combo_out/export',
    method: 'post',
    data: query,
    responseType: 'arraybuffer'
  })
}

/**
 * 糙米出库进度表
 * @param {*} query
 */
export function getGrainOutPageListApi (query) {
  return request({
    url: 'api/v1/ledger/grain_out/page_list',
    method: 'post',
    data: query
  })
}

/**
 * 混合物出库进度表 求和
 * @param {*} query
 */
export function getGrainOutListSumApi (query) {
  return request({
    url: 'api/v1/ledger/grain_out/sum',
    method: 'post',
    data: query
  })
}

/**
 * 混合物出库进度表 导出
 * @param {*} query
 */
export function exportGrainOutListApi (query) {
  return request({
    url: 'api/v1/ledger/grain_out/export',
    method: 'post',
    data: query,
    responseType: 'arraybuffer'
  })
}

/**
 * 糙米入库进度表
 * @param {*} query
 */
export function getGrainInPageListApi (query) {
  return request({
    url: 'api/v1/ledger/grain_in/page_list',
    method: 'post',
    data: query
  })
}

/**
 * 糙米入库进度表 求和
 * @param {*} query
 */
export function getGrainInListSumApi (query) {
  return request({
    url: 'api/v1/ledger/grain_in/sum',
    method: 'post',
    data: query
  })
}

/**
 * 糙米入库进度表 导出
 * @param {*} query
 */
export function exportGrainInListApi (query) {
  return request({
    url: 'api/v1/ledger/grain_in/export',
    method: 'post',
    data: query,
    responseType: 'arraybuffer'
  })
}

/**
 * 稻壳出库进度表
 * @param {*} query
 */
export function getRiceHullPageListApi (query) {
  return request({
    url: 'api/v1/ledger/ricehull_out/page_list',
    method: 'post',
    data: query
  })
}

/**
 * 稻壳出库进度表
 * @param {*} query
 */
export function exportRiceHullListApi (query) {
  return request({
    url: 'api/v1/ledger/ricehull_out/export',
    method: 'post',
    data: query,
    responseType: 'arraybuffer'
  })
}

