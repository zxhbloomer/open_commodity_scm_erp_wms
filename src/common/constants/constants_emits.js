/**
 * 组织机构管理页面之间，进行通讯，兄弟通讯，
 * left：树
 * right：tabs
 *        tab1：组织机构
 *        tab2：集团信息
 *        tab3：企业信息
 *        tab4：部门信息
 *        tab5：岗位信息
 *        tab6：员工信息
 */
const EMIT_ORG_LEFT = 'global:org:getDataListLeft'
const EMIT_ORG_CHANGE = 'global:org:getDataList'
const EMIT_ORG_LOADING = 'global:org:getDataList_loading'
const EMIT_ORG_LOADING_OK = 'global:org:getDataList_loading_ok'
const EMIT_ORG_POSITION_UPDATED = 'global:org:position_updated'

/**
 * 部门权限页面之间，进行通讯，兄弟通讯，
 * left：树
 * right：tabs
 *        tab1：权限列表
 *        tab2：操作权限
 */
const EMIT_PERMISSION_DEPT_LEFT = 'global:permission_dept:getDataListLeft'
const EMIT_PERMISSION_DEPT_CHANGE = 'global:permission_dept:getDataList'
const EMIT_PERMISSION_DEPT_OPERATE_EDIT = 'global:permission_dept:edit_permission'
const EMIT_PERMISSION_DEPT_OPERATE_EDIT_OK = 'global:permission_dept:edit_permission_ok'
const EMIT_PERMISSION_DEPT_OPERATE_INFO = 'global:permission_dept:info_permission'
const EMIT_PERMISSION_DEPT_OPERATE_INFO_OK = 'global:permission_dept:info_permission_ok'
const EMIT_PERMISSION_DEPT_LOADING = 'global:permission_dept:getDataList_loading'
const EMIT_PERMISSION_DEPT_LOADING_OK = 'global:permission_dept:getDataList_loading_ok'
const EMIT_PERMISSION_DEPT_IS_EDIT = 'global:permission_dept:is_edit'

/**
 * 权限页面之间，进行通讯，
 * left：树
 * right：tabs
 *        tab1：权限列表
 *        tab2：操作权限
 */

const EMIT_PERMISSION_ROLE_OPERATE_EDIT = 'global:permission_role:edit_permission'
const EMIT_PERMISSION_ROLE_OPERATE_EDIT_OK = 'global:permission_role:edit_permission_ok'

/**
 * 物料规格页面之间，进行通讯，兄弟通讯，
 * left：树
 * right：tabs
 *        tab1：物料规格
 */
const EMIT_SPEC_LEFT = 'global:org:getDataListLeft'
const EMIT_SPEC_RIGHT = 'global:org:getDataList'
const EMIT_SPEC_LOADING = 'global:org:getDataList_loading'
const EMIT_SPEC_LOADING_OK = 'global:org:getDataList_loading_ok'

/**
 * 入库计划页面之间，进行通讯，兄弟通讯，
 * 页签1：入库计划list
 * 页签2：入库计划数据维护
 */
const EMIT_INPLAN_CHANGE = 'global:inplan:getDataList'
const EMIT_INPLAN_LOADING = 'global:inplan:getDataList_loading'
const EMIT_INPLAN_LOADING_OK = 'global:inplan:getDataList_loading_ok'

/**
 * 出库计划页面之间，进行通讯，兄弟通讯，
 * 页签1：出库计划list
 * 页签2：出库计划数据维护
 */
const EMIT_OUTPLAN_CHANGE = 'global:outplan:getDataList'
const EMIT_OUTPLAN_LOADING = 'global:outplan:getDataList_loading'
const EMIT_OUTPLAN_LOADING_OK = 'global:outplan:getDataList_loading_ok'

/**
 * 仓库分组页面之间，进行通讯，兄弟通讯，
 * left：树
 * right：tabs
 *        tab1：仓库分组页面
 *        tab2：仓库
 */
const EMIT_RELATION_LEFT = 'global:relation:getDataListLeft'
const EMIT_RELATION_LEFT_CHECKED = 'global:relation:getDataListLeftChecked'
const EMIT_RELATION_CHANGE = 'global:relation:getDataList'
const EMIT_RELATION_LOADING = 'global:relation:getDataList_loading'
const EMIT_RELATION_LOADING_OK = 'global:relation:getDataList_loading_ok'

/**
 * 设置列属性，兄弟通讯,全局
 *
 */
const EMIT_TABLE_COLUMNS_CONFIG_START = 'global:table:config:start'
const EMIT_TABLE_COLUMNS_CONFIG_LOADING = 'global:table:config:loading'
const EMIT_TABLE_COLUMNS_CONFIG_LOADING_OK = 'global:table:config:loading_ok'

/**
 * 组织机构弹窗页面之间，进行通讯，兄弟通讯，
 */
const EMIT_ORG_DIALOG_CHANGE = 'global:org:dialog:getDataList'
const EMIT_ORG_DIALOG_STAFF_SELECT = 'global:org:dialog:staff:select'

export default {
  /**
   * 组织机构管理页面之间，进行通讯，兄弟通讯，
   */
  EMIT_ORG_LEFT,
  EMIT_ORG_CHANGE,
  EMIT_ORG_LOADING,
  EMIT_ORG_LOADING_OK,
  EMIT_ORG_POSITION_UPDATED,
  /**
   * 部门权限页面之间，进行通讯，兄弟通讯，
   */
  EMIT_PERMISSION_DEPT_LEFT,
  EMIT_PERMISSION_DEPT_CHANGE,
  EMIT_PERMISSION_DEPT_OPERATE_EDIT,
  EMIT_PERMISSION_DEPT_OPERATE_EDIT_OK,
  EMIT_PERMISSION_DEPT_OPERATE_INFO,
  EMIT_PERMISSION_DEPT_OPERATE_INFO_OK,
  EMIT_PERMISSION_DEPT_LOADING,
  EMIT_PERMISSION_DEPT_LOADING_OK,
  EMIT_PERMISSION_DEPT_IS_EDIT,

  EMIT_PERMISSION_ROLE_OPERATE_EDIT,
  EMIT_PERMISSION_ROLE_OPERATE_EDIT_OK,

  EMIT_SPEC_LEFT,
  EMIT_SPEC_RIGHT,
  EMIT_SPEC_LOADING,
  EMIT_SPEC_LOADING_OK,

  EMIT_INPLAN_CHANGE,
  EMIT_INPLAN_LOADING,
  EMIT_INPLAN_LOADING_OK,

  EMIT_OUTPLAN_CHANGE,
  EMIT_OUTPLAN_LOADING,
  EMIT_OUTPLAN_LOADING_OK,

  EMIT_RELATION_LEFT,
  EMIT_RELATION_LEFT_CHECKED,
  EMIT_RELATION_CHANGE,
  EMIT_RELATION_LOADING,
  EMIT_RELATION_LOADING_OK,

  EMIT_TABLE_COLUMNS_CONFIG_START,
  EMIT_TABLE_COLUMNS_CONFIG_LOADING,
  EMIT_TABLE_COLUMNS_CONFIG_LOADING_OK,
  EMIT_ORG_DIALOG_CHANGE,
  EMIT_ORG_DIALOG_STAFF_SELECT

}

