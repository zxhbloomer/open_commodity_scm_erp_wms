<template>
  <div>
    <!-- pop窗口 数据编辑:新增、修改、步骤窗体-->
    <el-dialog
      v-if="listenVisible"
      v-el-drag-dialog
      v-loading="settings.loading"

      element-loading-text="拼命加载中，请稍后..."
      element-loading-background="rgba(255, 255, 255, 0.7)"
      :title="PARAMETERS.STATUS_TEXT_MAP[dialogStatus]"
      :visible="visible"
      :close-on-click-modal="PARAMETERS.DIALOG_CLOSE_BY_CLICK"
      :close-on-press-escape="PARAMETERS.DIALOG_CLOSE_BY_ESC"
      :show-close="PARAMETERS.DIALOG_SHOW_CLOSE"
      :append-to-body="true"
      :modal-append-to-body="true"
      width="1300px"
      destroy-on-close
    >
      <el-form
        ref="dataSubmitForm"
        :rules="settings.rules"
        :model="dataJson.tempJson"
        label-position="rigth"
        label-width="155px"
        status-icon
        :validate-on-rule-change="false"
      >
        <el-tabs
          :value="settings.tabName"
          style="height: 600px"
          @tab-click="handleTabsClick"
        >
          <br>
          <el-tab-pane name="tab1">
            <template slot="label">基本信息
              <el-badge
                v-show="settings.badge.countOne > 0"
                :value="settings.badge.countOne"
                type="danger"
              />
            </template>
            <el-row>
              <el-col :span="12">
                <el-form-item
                  label="员工姓名："
                  prop="name"
                >
                  <el-input
                    ref="refFocusOne"
                    v-model.trim="dataJson.tempJson.name"
                    clearable
                    show-word-limit
                    :maxlength="dataJson.inputSettings.maxLength.name"
                    :placeholder="isPlaceholderShow('请输入')"
                    :disabled="isViewModel"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item
                  label="员工姓名拼音："
                  prop="name_py"
                >
                  <el-input
                    v-model.trim="dataJson.tempJson.name_py"
                    clearable
                    show-word-limit
                    :maxlength="dataJson.inputSettings.maxLength.name_py"
                    :placeholder="isPlaceholderShow('请输入')"
                    :disabled="isViewModel"
                  />
                </el-form-item>
              </el-col>
            </el-row>

            <!--            <el-row>-->
            <!--              <el-col :span="12">-->
            <!--                <el-form-item-->
            <!--                  label="员工姓名简称："-->
            <!--                  prop="simple_name"-->
            <!--                >-->
            <!--                  <el-input-->
            <!--                    v-model.trim="dataJson.tempJson.simple_name"-->
            <!--                    clearable-->
            <!--                    show-word-limit-->
            <!--                    :maxlength="dataJson.inputSettings.maxLength.simple_name"-->
            <!--                    :placeholder="isPlaceholderShow('请输入')"-->
            <!--                    :disabled="isViewModel"-->
            <!--                  />-->
            <!--                </el-form-item>-->
            <!--              </el-col>-->
            <!--              <el-col :span="12">-->
            <!--                <el-form-item-->
            <!--                  label="员工姓名简称拼音："-->
            <!--                  prop="simple_name_py"-->
            <!--                >-->
            <!--                  <el-input-->
            <!--                    v-model.trim="dataJson.tempJson.simple_name_py"-->
            <!--                    clearable-->
            <!--                    show-word-limit-->
            <!--                    :maxlength="dataJson.inputSettings.maxLength.simple_name_py"-->
            <!--                    :placeholder="isPlaceholderShow('请输入')"-->
            <!--                    :disabled="isViewModel"-->
            <!--                  />-->
            <!--                </el-form-item>-->
            <!--              </el-col>-->
            <!--            </el-row>-->

            <el-row>
              <el-col :span="12">
                <el-form-item
                  label="身份证号码："
                  prop="id_card"
                >
                  <el-input
                    v-model.trim="dataJson.tempJson.id_card"
                    clearable
                    show-word-limit
                    :maxlength="dataJson.inputSettings.maxLength.id_card"
                    :placeholder="isPlaceholderShow('请输入')"
                    :disabled="isViewModel"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item
                  label="护照号码："
                  prop="passport"
                >
                  <el-input
                    v-model.trim="dataJson.tempJson.passport"
                    clearable
                    show-word-limit
                    :maxlength="dataJson.inputSettings.maxLength.passport"
                    :placeholder="isPlaceholderShow('请输入')"
                    :disabled="isViewModel"
                  />
                </el-form-item>
              </el-col>
            </el-row>

            <el-row>
              <el-col :span="12">
                <el-form-item
                  label="民族："
                  prop="nation"
                >
                  <el-input
                    v-model.trim="dataJson.tempJson.nation"
                    clearable
                    show-word-limit
                    :maxlength="dataJson.inputSettings.maxLength.nation"
                    :placeholder="isPlaceholderShow('请输入')"
                    :disabled="isViewModel"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item
                  label="生日："
                  prop="birthday"
                >
                  <el-date-picker
                    v-model="dataJson.tempJson.birthday"
                    value-format="yyyy-MM-dd"
                    type="date"
                    clearable
                    :placeholder="isPlaceholderShow('请输入')"
                    style="width: 100%"
                    :disabled="isViewModel"
                  />
                </el-form-item>
              </el-col>
            </el-row>

            <el-row>
              <el-col :span="12">
                <el-form-item
                  label="性别："
                  prop="sex"
                >
                  <radio-dict
                    v-model="dataJson.tempJson.sex"
                    :para="CONSTANTS.DICT_SYS_SEX_TYPE"
                    :disabled="isViewModel"
                    @change="handleSexDictChange"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item
                  label="在职情况："
                  prop="service"
                >
                  <select-dict
                    v-model="dataJson.tempJson.service"
                    :para="CONSTANTS.DICT_USR_SERVICE_TYPE"
                    init-placeholder="请选择在职情况"
                    :disabled="isViewModel"
                  />
                </el-form-item>
              </el-col>
            </el-row>

            <el-row>
              <el-col :span="12">
                <el-form-item
                  label="婚否 ："
                  prop="is_wed"
                >
                  <radio-dict
                    v-model="dataJson.tempJson.is_wed"
                    :para="CONSTANTS.DICT_USR_WED_TYPE"
                    :disabled="isViewModel"
                    @change="handleWedDictChange"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item
                  label="学历："
                  prop="degree"
                >
                  <select-dict
                    v-model="dataJson.tempJson.degree"
                    :para="CONSTANTS.DICT_USR_DEGREE_TYPE"
                    init-placeholder="请选择学历情况"
                    :disabled="isViewModel"
                  />
                </el-form-item>
              </el-col>
            </el-row>

            <!-- <el-row>
              <el-form-item
                label="说明："
                prop="descr"
              >
                <el-input
                  v-model.trim="dataJson.tempJson.descr"
                  clearable
                  show-word-limit
                  type="textarea"
                  :maxlength="dataJson.inputSettings.maxLength.descr"
                  :placeholder="isPlaceholderShow('请输入')"
                  :disabled="isViewModel"
                />
              </el-form-item>
            </el-row> -->

            <el-row style="display: flex;flex-wrap: wrap;">
              <el-form-item
                label="身份证正面照片："
                prop="descr"
              >
                <previewCard
                  :show-update="!isViewModel"
                  :data="dataJson.tempJson.one_fileVo"
                  :title="'身份证正面照片'"
                  @upload-success="uploadSuccessOne"
                />
              </el-form-item>
              <el-form-item
                label="身份证背面照片："
                prop="descr"
              >
                <previewCard
                  :show-update="!isViewModel"
                  :title="'身份证背面照片'"
                  :data="dataJson.tempJson.two_fileVo"
                  @upload-success="uploadSuccessTwo"
                />
              </el-form-item>
            </el-row>

          </el-tab-pane>

          <el-tab-pane name="tab2">
            <template slot="label">联系方式
              <el-badge
                v-show="settings.badge.countFour > 0"
                :value="settings.badge.countFour"
                type="danger"
              />
            </template>
            <el-row>
              <el-col :span="12">
                <el-form-item
                  label="家庭电话："
                  prop="home_phone"
                >
                  <el-input
                    v-model.trim="dataJson.tempJson.home_phone"
                    clearable
                    show-word-limit
                    :maxlength="dataJson.inputSettings.maxLength.home_phone"
                    :placeholder="isPlaceholderShow('请输入')"
                    :disabled="isViewModel"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item
                  label="办公室电话："
                  prop="office_phone"
                >
                  <el-input
                    v-model.trim="dataJson.tempJson.office_phone"
                    clearable
                    show-word-limit
                    :maxlength="dataJson.inputSettings.maxLength.office_phone"
                    :placeholder="isPlaceholderShow('请输入')"
                    :disabled="isViewModel"
                  />
                </el-form-item>
              </el-col>
            </el-row>

            <el-row>
              <el-col :span="12">
                <el-form-item
                  label="手机号码："
                  prop="mobile_phone"
                >
                  <el-input
                    v-model.trim="dataJson.tempJson.mobile_phone"
                    clearable
                    show-word-limit
                    :maxlength="dataJson.inputSettings.maxLength.mobile_phone"
                    :placeholder="isPlaceholderShow('请输入')"
                    :disabled="isViewModel"
                    @blur="handleChangePhone"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item
                  label="手机备用号码："
                  prop="mobile_phone_backup"
                >
                  <el-input
                    v-model.trim="dataJson.tempJson.mobile_phone_backup"
                    clearable
                    show-word-limit
                    :maxlength="
                      dataJson.inputSettings.maxLength.mobile_phone_backup
                    "
                    :placeholder="isPlaceholderShow('请输入')"
                    :disabled="isViewModel"
                  />
                </el-form-item>
              </el-col>
            </el-row>

            <el-row>
              <el-col :span="12">
                <el-form-item
                  label="邮箱地址："
                  prop="email"
                >
                  <el-input
                    v-model.trim="dataJson.tempJson.email"
                    clearable
                    show-word-limit
                    :maxlength="dataJson.inputSettings.maxLength.email"
                    :placeholder="isPlaceholderShow('请输入')"
                    :disabled="isViewModel"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item
                  label="邮箱备用地址："
                  prop="email_backup"
                >
                  <el-input
                    v-model.trim="dataJson.tempJson.email_backup"
                    clearable
                    show-word-limit
                    :maxlength="dataJson.inputSettings.maxLength.email_backup"
                    :placeholder="isPlaceholderShow('请输入')"
                    :disabled="isViewModel"
                  />
                </el-form-item>
              </el-col>
            </el-row>

            <el-row v-show="settings.dialogStatus === PARAMETERS.STATUS_UPDATE">
              <el-col :span="12">
                <el-form-item
                  label="更新人："
                  prop="u_name"
                >
                  <el-input
                    v-model.trim="dataJson.tempJson.u_name"
                    disabled
                  />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item
                  label="更新时间："
                  prop="u_time"
                >
                  <el-input
                    v-model.trim="dataJson.tempJson.u_time"
                    disabled
                  />
                </el-form-item>
              </el-col>
            </el-row>
          </el-tab-pane>

          <el-tab-pane name="tab3">
            <template slot="label">登录账号信息
              <el-badge
                v-show="settings.badge.countTwo > 0"
                :value="settings.badge.countTwo"
                type="danger"
              />
            </template>
            <el-row>
              <el-col :span="12">
                <el-form-item
                  label="开启账号登录："
                  prop="is_enable"
                >
                  <el-switch
                    v-model="dataJson.tempJson.user.is_enable"
                    active-text="开启"
                    inactive-text="关闭"
                    :disabled="isViewModel"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="12" />
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item
                  label="登录模式："
                  prop="login_type"
                >
                  <radio-dict
                    v-model="dataJson.tempJson.user.login_type"
                    :para="CONSTANTS.DICT_SYS_LOGIN_TYPE"
                    :disabled="!isAccountLoginType || isViewModel"
                    @change="handleSysLoginTypeChange"
                  />
                </el-form-item>
              </el-col>
            </el-row>

            <el-row>
              <el-col :span="12">
                <el-form-item
                  label="登录用户名："
                  prop="user.login_name"
                >
                  <el-input
                    v-model.trim="dataJson.tempJson.user.login_name"
                    clearable
                    show-word-limit
                    :maxlength="dataJson.inputSettings.user.maxLength.login_name"
                    :placeholder="isPlaceholderShow('请输入')"
                    :disabled="!isAccountLoginType || isViewModel"
                    @blur="handleChangeLoginName"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item
                  label="设置密码："
                  prop=""
                >
                  <el-button
                    type="primary"
                    icon="el-icon-unlock"
                    :disabled="!isAccountLoginType || isViewModel"
                    @click="handleSetPassword"
                  >设置密码</el-button>
                  <el-tag
                    v-show="
                      !(
                        dataJson.tempJson.user.pwd === '' ||
                        dataJson.tempJson.user.pwd === null ||
                        dataJson.tempJson.user.pwd === undefined
                      )
                    "
                    type="success"
                    effect="dark"
                  >已设置密码</el-tag>
                  <el-tag
                    v-show="
                      dataJson.tempJson.user.pwd === '' ||
                        dataJson.tempJson.user.pwd === null ||
                        dataJson.tempJson.user.pwd === undefined
                    "
                    type="danger"
                    effect="dark"
                  >未设置密码</el-tag>
                </el-form-item>
              </el-col>
            </el-row>

            <el-row>
              <el-form-item
                label="生效日期区间："
                prop=""
              >
                <el-date-picker
                  v-model="dataJson.tempJson.user.datetimerange"
                  type="datetimerange"
                  :picker-options="settings.pickerOptions"
                  range-separator="至"
                  start-placeholder="生效开始日期"
                  end-placeholder="生效结束日期"
                  align="right"
                  style="width: 100%"
                  :disabled="!isAccountLoginType || isViewModel"
                />
              </el-form-item>
            </el-row>

            <el-row>
              <el-col :span="12">
                <el-form-item
                  label="登录用户类型："
                  prop="type"
                >
                  <select-dict
                    v-model="dataJson.tempJson.user.type"
                    :para="CONSTANTS.DICT_USR_LOGIN_TYPE"
                    init-placeholder="请选择登录用户类型"
                    :disabled="!isAccountLoginType || isViewModel"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item
                  label="是否删除："
                  prop="is_del"
                >
                  <el-switch
                    v-model="dataJson.tempJson.user.is_del"
                    active-color="#ff4949"
                    inactive-color="#dcdfe6"
                    active-text="已删除"
                    inactive-text="未删除"
                    :disabled="!isAccountLoginType || isViewModel"
                  />
                </el-form-item>
              </el-col>
            </el-row>

            <el-row>
              <el-col :span="12">
                <el-form-item
                  label="用户锁定时间："
                  prop="locked_time"
                >
                  <el-date-picker
                    v-model="dataJson.tempJson.user.locked_time"
                    value-format="yyyy-MM-dd"
                    type="date"
                    clearable
                    :placeholder="isPlaceholderShow('选择日期')"
                    style="width: 100%"
                    :disabled="!isAccountLoginType || isViewModel"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item
                  label="是否锁定："
                  prop="is_lock"
                >
                  <el-switch
                    v-model="dataJson.tempJson.user.is_lock"
                    active-color="#ff4949"
                    inactive-color="#dcdfe6"
                    active-text="已锁定"
                    inactive-text="未锁定"
                    :disabled="!isAccountLoginType || isViewModel"
                  />
                </el-form-item>
              </el-col>
            </el-row>

            <el-row>
              <el-col :span="12">
                <el-form-item
                  label="登录错误次数："
                  prop="err_count"
                >
                  <el-input
                    v-model.trim="dataJson.tempJson.user.err_count"
                    disabled
                    placeholder="[无]"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item
                  label="是否修改过密码："
                  prop="is_changed_pwd"
                >
                  <el-switch
                    v-model="dataJson.tempJson.user.is_changed_pwd"
                    active-color="#ff4949"
                    inactive-color="#dcdfe6"
                    active-text="已修改"
                    inactive-text="未修改"
                    :disabled="!isAccountLoginType || isViewModel"
                  />
                </el-form-item>
              </el-col>
            </el-row>

            <el-row>
              <el-col :span="12">
                <el-form-item
                  label="最后登录时间："
                  prop="last_login_date"
                >
                  <!--                  <el-input-->
                  <!--                    v-model="dataJson.tempJson.user.last_login_date"-->
                  <!--                    disabled-->
                  <!--                    placeholder="[无]"-->
                  <!--                  />-->
                  <el-date-picker
                    v-model="dataJson.tempJson.user.last_login_date"
                    type="datetime"
                    disabled
                    placeholder="[无]"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item
                  label="最后登出时间："
                  prop="last_logout_date"
                >
                  <el-date-picker
                    v-model="dataJson.tempJson.user.last_logout_date"
                    type="datetime"
                    disabled
                    placeholder="[无]"
                  />
                </el-form-item>
              </el-col>
            </el-row>

            <el-form-item
              label="说明："
              prop="descr"
            >
              <el-input
                v-model.trim="dataJson.tempJson.user.descr"
                clearable
                show-word-limit
                type="textarea"
                :maxlength="dataJson.inputSettings.maxLength.descr"
                :placeholder="isPlaceholderShow('选择日期')"
                :disabled="isViewModel"
              />
            </el-form-item>
          </el-tab-pane>

          <el-tab-pane name="tab4">
            <template slot="label">所属信息
              <el-badge
                v-show="settings.badge.countTwo > 0"
                :value="settings.badge.countTwo"
                type="danger"
              />
            </template>
            <el-row>
              <el-col :span="12">
                <el-form-item
                  label="所属公司："
                  prop="company_name"
                >
                  <el-popover
                    v-model="settings.popover.visible"
                    placement="top"
                    width="200"
                    trigger="manual"
                  >
                    <p>您修改了所属公司，请您重新选择默认部门！</p>
                    <div style="text-align: right; margin: 0">
                      <el-button
                        type="primary"
                        size="mini"
                        @click="settings.popover.visible = false"
                      >确定</el-button>
                    </div>

                    <select-company-dept
                      slot="reference"
                      v-model.trim="dataJson.tempJson.company_name"
                      :placeholder="isPlaceholderShow('请选择所属公司')"
                      :type="CONSTANTS.DICT_ORG_SETTING_TYPE_COMPANY"
                      :current-id="dataJson.tempJson.company_id"
                      :disabled="isViewModel"
                      @closeParentDialog="handleDialogClose"
                      @onReturnData="handleCompanyReturnData"
                    />
                  </el-popover>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item
                  label="默认部门："
                  prop="dept_name"
                >
                  <select-company-dept
                    v-model.trim="dataJson.tempJson.dept_name"
                    :placeholder="isPlaceholderShow('请选择默认部门')"
                    :type="CONSTANTS.DICT_ORG_SETTING_TYPE_DEPT"
                    :current-id="dataJson.tempJson.dept_id"
                    :disabled="isViewModel"
                    :parent-id="dataJson.tempJson.company_id"
                    @closeParentDialog="handleDialogClose"
                    @onReturnData="handleDeptReturnData"
                  />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="岗位信息：">
                  <template>
                    <div
                      v-show="positionIsShow()"
                      class="el-input-tag input-tag-wrapper"
                    >
                      <el-popconfirm
                        v-for="item in dataJson.tempJson.positions"
                        :key="item.position_id"
                        confirm-button-text="确定"
                        cancel-button-text="取消"
                        icon="el-icon-info"
                        icon-color="red"
                        title="点击确定后跳转到岗位页面，请注意保存当前数据。"
                        @confirm="handlePositionClick(item.position_name)"
                      >
                        <el-tag
                          slot="reference"
                          class="position_tag"
                        >
                          {{ item.position_name }}
                        </el-tag>
                      </el-popconfirm>
                    </div>
                    <div v-show="!positionIsShow()">
                      <el-input
                        v-model.trim="dataJson.tempJson.user.last_login_date"
                        disabled
                        placeholder="[无]"
                      />
                    </div>
                  </template>
                </el-form-item>
              </el-col>
              <el-col :span="12" />
            </el-row>
          </el-tab-pane>

          <el-tab-pane label="权限信息" name="tab5">
            <div style="margin-left:30px;">
              <el-row :gutter="20">
                <el-col :span="5">
                  <el-switch
                    v-model="horizontal"
                    :width="50"
                    active-text="横排"
                    inactive-text="竖排"
                    style="margin-top:8px;"
                  />
                </el-col>
                <el-col :span="5">
                  <el-switch
                    v-model="expandAll"
                    :width="50"
                    active-text="全部展开"
                    inactive-text="全部折叠"
                    style="margin-top:8px;"
                    @change="expandChange"
                  />
                </el-col>

              </el-row>
            </div>

            <div style="font-size:12px;margin-top:30px;text-align:center">
              <el-scrollbar
                :style="scrollTreeStyle"
                class="el-org-tree"
              >
                <org-tree
                  v-if="dataJson.tempJson.permissionTreeData"
                  name="permission-tree"
                  :props="{label: 'label', children: 'children', expand: 'expand'}"
                  :data="dataJson.tempJson.permissionTreeData"
                  :horizontal="horizontal"
                  :collapsable="collapsable"
                  :render-content="renderContent"
                  @on-expand="onExpand"
                  @on-node-click="onNodeClick"
                />
              </el-scrollbar>
            </div>

          </el-tab-pane>
          <el-tab-pane label="仓库数据权限授权" name="tab6">
            <el-tabs tab-position="right">

              <el-tab-pane label="授权操作">
                <el-alert
                  title="授权操作"
                  type="info"
                  :closable="false"
                />
                <br>
                <el-descriptions
                  title=""
                  :column="1"
                  direction="horizontal"
                  :content-style="contentStyle"
                  :label-style="labelStyle"
                  border
                  style="padding-right: 10px;padding-left: 10px;"
                >
                  <el-descriptions-item label="按仓库组授权：">
                    <el-checkbox-group v-model="dataJson.tempJson.warehouseGroupIds">
                      <el-checkbox-button
                        v-for="item in dataJson.warehouseGroupListData"
                        :key="item.id"
                        :disabled="isViewModel"
                        :label="item.id"
                        :checked="item.checked"
                        @change="changeWarehouseGroup(item)"
                      >{{ item.name }}</el-checkbox-button>
                    </el-checkbox-group>
                  </el-descriptions-item>

                  <el-descriptions-item label="按仓库授权：">
                    <el-button
                      :disabled="isViewModel"
                      type="primary"
                      icon="el-icon-edit-outline"
                      :loading="settings.loading"
                      @click="handleEditWarehouseMember"
                    >授权</el-button>
                  </el-descriptions-item>
                </el-descriptions>
                <br>
                <el-alert
                  title="已授权仓库"
                  type="info"
                  :closable="false"
                />
                <br>
                <el-table
                  ref="multipleTable"
                  v-loading="settings.loading"
                  type="org_group"
                  :data="dataJson.warehouseListData"
                  :element-loading-text="'正在拼命加载中...'"
                  element-loading-background="rgba(255, 255, 255, 0.5)"
                  height="300px"
                  stripe
                  border
                  fit
                  highlight-current-row
                  :default-sort="{prop: 'u_time', order: 'descending'}"
                  style="width: 100%"
                >
                  <!-- <el-table-column type="selection" width="45" prop="id" /> -->
                  <el-table-column
                    type="index"
                    width="45"
                    label="No"
                  />

                  <el-table-column
                    show-overflow-tooltip
                    min-width="160"
                    prop="name"
                    label="仓库名称"
                    :auto-fit="true"
                  />
                  <el-table-column
                    show-overflow-tooltip
                    min-width="180"
                    prop="short_name"
                    label="仓库简称"
                    :auto-fit="true"
                  />
                  <el-table-column
                    show-overflow-tooltip
                    min-width="150"
                    prop="code"
                    label="仓库编码"
                    :auto-fit="true"
                  />
                  <el-table-column
                    show-overflow-tooltip
                    min-width="250"
                    prop="type"
                    label="授权类型"
                    :auto-fit="true"
                  >
                    <template v-slot="scope">
                      <span
                        v-for="(item, index) in scope.row.types"
                        :key="index"
                      >
                        {{ scope.row.types.length == (index+1)? item == 1 ? '按员工仓库组授权':'按员工仓库授权':item == 1 ? '按员工仓库组授权，':'按员工仓库授权，' }}
                      </span>
                    </template>
                  </el-table-column>
                </el-table>
              </el-tab-pane>
              <el-tab-pane label="授权信息">
                <div style="margin-left:30px;">
                  <el-row :gutter="20">
                    <el-col :span="5">
                      <el-switch
                        v-model="horizontal2"
                        :width="50"
                        active-text="横排"
                        inactive-text="竖排"
                        style="margin-top:8px;"
                      />
                    </el-col>
                    <el-col :span="5">
                      <el-switch
                        v-model="expandAll2"
                        :width="50"
                        active-text="全部展开"
                        inactive-text="全部折叠"
                        style="margin-top:8px;"
                        @change="expandChange"
                      />
                    </el-col>

                  </el-row>
                </div>

                <div style="font-size:12px;margin-top:30px;text-align:center">
                  <el-scrollbar
                    :style="scrollTreeStyle2"
                    class="el-org-tree"
                  >
                    <org-tree
                      v-if="dataJson.tempJson.warehouseTreeData"
                      name="permission-tree"
                      :props="{label: 'label', children: 'children', expand: 'expand'}"
                      :data="dataJson.tempJson.warehouseTreeData"
                      :horizontal="horizontal2"
                      :collapsable="collapsable2"
                      :render-content="renderContent2"
                      @on-expand="onExpand2"
                      @on-node-click="onNodeClick2"
                    />
                  </el-scrollbar>
                </div>
              </el-tab-pane>
            </el-tabs>

          </el-tab-pane>
        </el-tabs>
      </el-form>
      <div
        slot="footer"
        class="dialog-footer"
      >
        <el-divider />

        <el-button
          plain
          :disabled="settings.loading"
          @click="handleCancel"
        >取消</el-button>
        <el-button
          v-show="settings.btnShowStatus.showInsert"
          plain
          type="primary"
          :disabled="
            settings.loading || settings.btnDisabledStatus.disabledInsert
          "
          @click="doInsert()"
        >确定</el-button>
        <el-button
          v-show="settings.btnShowStatus.showUpdate && !isViewModel"
          plain
          type="primary"
          :disabled="
            settings.loading || settings.btnDisabledStatus.disabledUpdate
          "
          @click="doUpdate()"
        >确定</el-button>
        <el-button
          v-show="settings.btnShowStatus.showCopyInsert"
          plain
          type="primary"
          :disabled="
            settings.loading || settings.btnDisabledStatus.disabledCopyInsert
          "
          @click="doCopyInsert()"
        >确定</el-button>
      </div>
    </el-dialog>

    <psd-dialog
      :visible="popSettings.two.visible"
      @closeMeOk="handlePsdDialogCloseOk"
      @closeMeCancel="handlePsdDialogCloseCancel"
    />

    <set-warehouse-dialog
      v-if="popSettings.one.visible"
      :id="popSettings.one.props.id"
      :data="popSettings.one.props.data"
      :visible="popSettings.one.visible"
      :model="popSettings.one.props.model"
      @closeMeOk="handleCloseDialogOneOk"
      @closeMeCancel="handleCloseDialogOneCancel"
    />
  </div>
</template>

<style scoped>
.input-tag-wrapper {
  position: relative;
  font-size: 14px;
  background-color: #fff;
  background-image: none;
  border-radius: 4px;
  border: 1px solid #dcdfe6;
  box-sizing: border-box;
  color: #606266;
  display: inline-block;
  outline: none;
  padding: 0 10px 0 5px;
  transition: border-color 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);
  width: 100%;
}

.el-card ::v-deep .el-card__header {
  padding: 10px 10px;
}

.el-card ::v-deep .el-card__body {
  padding: 10px;
}

.position_tag {
  cursor: pointer;
}
.floatRight {
  float: right;
}
.floatLeft {
  float: left;
}
.el-form-item .el-select {
  width: 100%;
}

.el-input-group__append_select {
  color: #ffffff;
  background-color: #1890ff;
  border-color: #1890ff;
}
.el-input-group__append_reset {
  color: #ffffff;
  background-color: #f56c6c;
  border-color: #f56c6c;
}
</style>

<script>

import constants_para from '@/common/constants/constants_para'
import elDragDialog from '@/directive/el-drag-dialog'
import { updateApi, insertApi, getApi } from '@/api/20_master/staff/staff'
import RadioDict from '@/components/00_dict/redio'
import SelectDict from '@/components/00_dict/select/SelectDict'
import SelectCompanyDept from '@/views/20_master/staff/selectgrid/companyDept'
import psdDialog from '@/views/20_master/staff/dialog/setPsdDialog'
// import { getUserBeanByIdApi } from '@/api/user'
import deepCopy from 'deep-copy'
import { isNotEmpty } from '@/utils/index.js'
import previewCard from '@/components/50_preview_card/preview_card_new'
import { getListApi as getWarehouseGroupList } from '@/api/40_business/warehouse/warehousegroup'
import { getWarehouseAllListApi as getWarehouseListApi } from '@/api/20_master/relation/relation'
import setWarehouseDialog from '@/views/20_master/staff/dialog/setWarehouse'
import OrgTree from '@/components/OrgTree/index.js'

export default {
  // name: '', // 页面id，和router中的name需要一致，作为缓存
  components: { previewCard, RadioDict, SelectDict, psdDialog, SelectCompanyDept, setWarehouseDialog, OrgTree },
  directives: { elDragDialog },
  mixins: [],
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    id: {
      type: Number,
      default: null
    },
    data: {
      type: Object,
      default: null
    },
    dialogStatus: {
      type: String,
      default: constants_para.STATUS_VIEW
    },
    // 选中的标签页
    tabName: {
      type: String,
      default: 'tab1'
    }
  },
  data () {
    return {
      // 权限信息
      scrollTreeStyle: 'width:100%;height:500px',
      horizontal: false,
      collapsable: true,
      expandAll: true,
      // 权限信息
      scrollTreeStyle2: 'width:100%;height:500px',
      horizontal2: false,
      collapsable2: true,
      expandAll2: true,
      // 监听器
      watch: {
        unwatch_tempJson: null
      },
      contentStyle: {
        width: '40%'
      },
      labelStyle: {
        width: '5%',
        'text-align': 'right'
      },

      // 身份证正面
      file_ones: [],
      file_one_file: [],
      // 身份证背面
      file_twos: [],
      file_two_file: [],
      dataJson: {
        warehouseGroupListData: [],
        warehouseListData: [],
        warehouseListData1: [],
        // 单条数据 json的，初始化原始数据
        tempJsonOriginal: {
          one_fileVo: {},
          two_fileVo: {},
          id: undefined,
          name: '',
          code: '',
          descr: '',
          sex: '',
          is_wed: '',
          user: {
            is_enable: true,
            login_name: null,
            login_type: '',
            pwd: ''
          },
          company_id: undefined,
          company_name: '',
          company_simple_name: ''
        },
        // 单条数据 json
        tempJson: {
          warehouseGroupIds: [],
          warehouseIds: [],
          one_fileVo: {},
          two_fileVo: {},
          id: undefined,
          name: '',
          code: '',
          descr: '',
          sex: '',
          is_wed: '',
          user: {
            is_enable: true,
            login_type: '',
            login_name: null,
            pwd: ''
          },
          company_id: undefined,
          company_name: '',
          company_simple_name: '',
          mobile_phone: null
        },
        inputSettings: {
          maxLength: {
            name: 20,
            name_py: 20,
            simple_name: 10,
            simple_name_py: 15,
            id_card: 25,
            passport: 20,
            nation: 20,
            home_phone: 15,
            office_phone: 15,
            mobile_phone: 15,
            mobile_phone_backup: 15,
            email: 20,
            email_backup: 20,
            descr: 200
          },
          user: {
            maxLength: {
              login_name: 20
            }
          }
        }
      },
      settings: {
        popover: {
          visible: false
        },
        // loading 状态
        loading: true,
        // 按钮是否显示，默认不显示，false：不显示，true：显示
        btnShowStatus: {
          showInsert: false,
          showUpdate: false,
          showCopyInsert: false
        },
        // 按钮状态：是否可用，false:可用，true不可用
        btnDisabledStatus: {
          disabledReset: true,
          disabledInsert: true,
          disabledUpdate: true,
          disabledCopyInsert: true
        },
        // 以下为pop的内容：数据弹出框
        selection: [],
        dialogStatus: this.dialogStatus,
        // pop的check内容
        rules: {},
        // 基本信息栏目check
        rulesOne: {
          name: [{ required: true, message: '请输入员工姓名', trigger: 'change' }],

          id_card: [{ required: true, message: '请输入身份证号', trigger: 'change' }]

        },
        rulesTwo: {
          'user.login_name': [{ required: true, message: '请输入登录用户名', trigger: 'change' }]
        },
        rulesThree: {
          dept_id: [{ required: true, message: '请选择默认部门', trigger: 'change' }],
          company_name: [{ required: true, message: '请选择所属公司', trigger: 'change' }]
        },
        rulesFour: {
          mobile_phone: [{ required: true, message: '请输入手机号', trigger: 'change' }]
        },
        rules_disable: {
          // 默认可用
          end_date: false
        },
        // 错误数目
        badge: {
          countOne: 0,
          countTwo: 0,
          countThree: 0,
          countFour: 0
        },
        // 选中的标签页
        tabName: this.tabName
      },
      popSettings: {
        one: {
          visible: false,
          // 点击确定以后返回的值
          props: {
            id: undefined,
            data: {},
            model: ''
          }
        },
        // password
        two: {
          visible: false,
          // 点击确定以后返回的值
          props: {
            id: undefined,
            data: {},
            model: ''
          }
        }
      }
    }
  },
  computed: {
    listenVisible () {
      return this.visible
    },
    // 是否已经设置了密码
    isPsdSetUp () {
      if (this.dataJson.tempJson.user.pwd === '' || this.dataJson.tempJson.user.pwd === null || this.dataJson.tempJson.user.pwd === undefined) {
        return false
      } else {
        return true
      }
    },
    // 是否为更新模式
    isUpdateModel () {
      if (this.settings.dialogStatus === this.PARAMETERS.STATUS_INSERT || this.settings.dialogStatus === this.PARAMETERS.STATUS_COPY_INSERT) {
        return false
      } else {
        return true
      }
    },
    isAccountLoginType () {
      if (this.dataJson.tempJson.user.is_enable === {}) {
        return false
      } else {
        return this.dataJson.tempJson.user.is_enable
      }
    },
    isLoginEnabled () {
      if (this.dataJson.tempJson.user.is_enable === true) {
        return true
      } else {
        return false
      }
    },
    // 是否为查看模式
    isViewModel () {
      if (this.settings.dialogStatus === this.PARAMETERS.STATUS_VIEW) {
        return true
      } else {
        return false
      }
    }
  },
  // 监听器
  watch: {
  },
  created () {
    this.init()
  },
  mounted () {
  },
  destroyed () {
    this.unWatch()
  },
  methods: {
    // 初始化处理
    async init () {
      this.getWarehouseGroupData()

      this.initButtonShowStatus()
      this.initButtonDisabledStatus()
      switch (this.dialogStatus) {
        case this.PARAMETERS.STATUS_INSERT:
          this.initInsertModel()
          break
        case this.PARAMETERS.STATUS_UPDATE:
          await this.initUpdateModel()
          break
        case this.PARAMETERS.STATUS_COPY_INSERT:
          await this.initCopyInsertModel()
          break
        case this.PARAMETERS.STATUS_VIEW:
          await this.initViewModel()
          break
      }
      // 初始化watch
      this.setWatch()
      // 初始化tabs的rules
      this.settings.rules = this.settings.rulesOne
      this.settings.loading = false
    },
    initTempJsonOriginal () {
      // 单条数据 json的，初始化原始数据
      this.dataJson.tempJsonOriginal = this.$options.data.call(this).dataJson.tempJsonOriginal
    },
    initButtonShowStatus () {
      // 初始化按钮状态：默认都隐藏
      this.settings.btnShowStatus = this.$options.data.call(this).settings.btnShowStatus
    },
    initButtonDisabledStatus () {
      // 按钮状态初始化：默认不可用
      this.settings.btnDisabledStatus = this.$options.data.call(this).settings.btnDisabledStatus
    },
    // 新增时的初始化
    initInsertModel () {
      // 数据初始化
      this.initTempJsonOriginal()
      // this.dataJson.tempJson = deepCopy(this.dataJson.tempJsonOriginal)
      // 设置按钮
      this.settings.btnShowStatus.showInsert = true
      // 控件focus
      this.$nextTick(() => {
        this.$refs['refFocusOne'].focus()
      })
    },
    // 复制新增时的初始化
    async initCopyInsertModel () {
      // 数据初始化
      // this.dataJson.tempJson = deepCopy(this.data)
      this.dataJson.tempJson.code = ''
      this.dataJson.tempJsonOriginal = deepCopy(this.data)
      // var userData = await this.getUserBeanById()
      // this.dataJson.tempJson.user = Object.assign({}, userData)
      // 设置按钮
      this.settings.btnShowStatus.showCopyInsert = true
      // 控件focus
      this.$nextTick(() => {
        this.$refs['refFocusOne'].focus()
      })
    },
    // 修改时的初始化
    async initUpdateModel () {
      this.getData()
      // 数据初始化
      // this.dataJson.tempJson = deepCopy(this.data)
      // this.dataJson.tempJsonOriginal = deepCopy(this.data)
      // var userData = await this.getUserBeanById()
      // this.dataJson.tempJson.user = deepCopy(userData)
      // 设置按钮
      this.settings.btnShowStatus.showUpdate = true
      // 控件focus
      this.$nextTick(() => {
        this.$refs['refFocusOne'].focus()
      })
    },
    // 查看时的初始化
    async initViewModel () {
      // 数据初始化
      this.getData()
      this.settings.btnShowStatus.showUpdate = false
      // this.dataJson.tempJson = deepCopy(this.data)
      // var userData = await this.getUserBeanById()
      // this.dataJson.tempJson.user = Object.assign({}, userData)
    },
    // 设置监听器
    setWatch () {
      this.unWatch()
      // 监听页面上面是否有修改，有修改按钮高亮
      this.watch.unwatch_tempJson = this.$watch('dataJson.tempJson', (newVal, oldVal) => {
        this.settings.btnDisabledStatus.disabledReset = false
        this.settings.btnDisabledStatus.disabledInsert = false
        this.settings.btnDisabledStatus.disabledUpdate = false
        this.settings.btnDisabledStatus.disabledCopyInsert = false
      }, { deep: true }
      )
    },
    unWatch () {
      if (this.watch.unwatch_tempJson) {
        this.watch.unwatch_tempJson()
      }
    },
    // Placeholder设置
    isPlaceholderShow (val) {
      if (this.isViewModel) {
        return ''
      } else {
        return val
      }
    },
    // 取消按钮
    handleCancel () {
      this.$emit('closeMeCancel')
    },
    getData () {
      // 查询逻辑
      this.settings.loading = true
      getApi(this.data).then(response => {
        // 增加对象属性，columnTypeShowIcon，columnNameShowIcon
        this.dataJson.tempJson = response.data

        this.dataJson.tempJson.warehouseGroupIds = []
        this.dataJson.tempJson.warehouseGroupList.forEach((item) => {
          if (item != null) {
            this.dataJson.tempJson.warehouseGroupIds.push(item.id)
          }
        })

        this.dataJson.warehouseGroupListData.forEach(item1 => {
          this.dataJson.tempJson.warehouseGroupIds.forEach(item2 => {
            if (item1.id === item2) {
              item1.checked = true
            }
          })
        })

        if (this.dataJson.tempJson.warehouseGroupIds.length + 1 === this.dataJson.warehouseGroupListData.length) {
          this.dataJson.tempJson.warehouseGroupIds.push(0)
        }

        this.getWarehouseList()

        // 默认全部展开
        this.toggleExpand(this.dataJson.tempJson.permissionTreeData, true)

        // 默认全部展开
        this.toggleExpand2(this.dataJson.tempJson.permissionTreeData, true)
      }).finally(() => {
        this.settings.loading = false
      })
    },
    // 插入逻辑
    doInsert () {
      // 开始综合验证
      this.doValidateByTabs()
      this.$refs['dataSubmitForm'].validate((valid) => {
        if (valid) {
          // const tempData = Object.assign({}, this.dataJson.tempJson)
          const tempData = deepCopy(this.dataJson.tempJson)
          this.settings.loading = true

          tempData.warehouseGroupList = []
          tempData.warehouseStaffList = []
          // 员工仓库
          if (this.dataJson.tempJson.warehouseStaffList !== null && this.dataJson.tempJson.warehouseStaffList !== undefined) {
            this.dataJson.tempJson.warehouseStaffList.forEach((item) => {
              tempData.warehouseStaffList.push(item)
            })
          }

          // 员工仓库组
          if (this.dataJson.tempJson.warehouseGroupIds !== null && this.dataJson.tempJson.warehouseGroupIds !== undefined) {
            this.dataJson.tempJson.warehouseGroupIds.forEach((item) => {
              if (item !== null && item !== 0) {
                tempData.warehouseGroupList.push({ id: item })
              }
            })
          }

          insertApi(tempData).then((_data) => {
            this.$emit('closeMeOk', { return_flag: true, data: _data })
          }, (_error) => {
            this.$emit('closeMeOk', { return_flag: false, error: _error })
          }).finally(() => {
            this.settings.loading = false
          })
        }
      })
    },
    // 更新逻辑
    doUpdate () {
      // 开始综合验证
      this.doValidateByTabs()
      this.$refs['dataSubmitForm'].validate((valid) => {
        if (valid) {
          // const tempData = Object.assign({}, this.dataJson.tempJson)
          const tempData = deepCopy(this.dataJson.tempJson)
          this.settings.loading = true

          tempData.warehouseGroupList = []
          tempData.warehouseStaffList = []
          // 员工仓库
          if (this.dataJson.tempJson.warehouseStaffList !== null && this.dataJson.tempJson.warehouseStaffList !== undefined) {
            this.dataJson.tempJson.warehouseStaffList.forEach((item) => {
              tempData.warehouseStaffList.push(item)
            })
          }

          // 员工仓库组
          if (this.dataJson.tempJson.warehouseGroupIds !== null && this.dataJson.tempJson.warehouseGroupIds !== undefined) {
            this.dataJson.tempJson.warehouseGroupIds.forEach((item) => {
              if (item !== null && item !== 0) {
                tempData.warehouseGroupList.push({ id: item })
              }
            })
          }

          updateApi(tempData).then((_data) => {
            // this.dataJson.tempJson = Object.assign({}, _data.data)
            this.dataJson.tempJson = deepCopy(_data.data)
            this.$emit('closeMeOk', { return_flag: true, data: _data })
          }, (_error) => {
            this.$emit('closeMeOk', { return_flag: false, error: _error })
          }).finally(() => {
            this.settings.loading = false
          })
        }
      })
    },
    // 复制新增逻辑
    doCopyInsert () {
      this.$refs['dataSubmitForm'].validate((valid) => {
        if (valid) {
          // const tempData = Object.assign({}, this.dataJson.tempJson)
          const tempData = deepCopy(this.dataJson.tempJson)
          this.settings.loading = true
          insertApi(tempData).then((_data) => {
            // this.dataJson.tempJson = Object.assign({}, _data.data)
            this.dataJson.tempJson = deepCopy(_data.data)
            this.$emit('closeMeOk', { return_flag: true, data: _data })
          }, (_error) => {
            this.$emit('closeMeOk', { return_flag: false, error: _error })
          }).finally(() => {
            this.settings.loading = false
          })
        }
      })
    },
    // async getUserBeanById () {
    //   return await getUserBeanByIdApi({ id: this.dataJson.tempJson.user_id }).then(response => {
    //     // this.dataJson.tempJson.user = Object.assign({}, response.data)
    //     return response.data
    //   })
    // },
    // -------------------不同的页签，标签进行的验证 s------------------
    handleTabsClick (tab, event) {
      switch (tab.index) {
        case '0':
          // 基本信息
          this.settings.rules = this.settings.rulesOne
          break
        case '1':
          // 联系方式
          this.settings.rules = this.settings.rulesFour
          break
        case '2':
          // 登录账号信息
          this.settings.rules = this.settings.rulesTwo
          break
        case '3':
          // 所属信息
          this.settings.rules = this.settings.rulesThree
          break
        case '5':
          // 权限信息
          break
      }
    },
    handleSexDictChange (val) {
      this.dataJson.tempJson.sex = val
    },
    handleSysLoginTypeChange (val) {
      if (val === '10' && this.dataJson.tempJson.mobile_phone !== undefined) {
        this.dataJson.tempJson.user.login_name = this.dataJson.tempJson.mobile_phone
      } else {
        this.dataJson.tempJson.user.login_name = null
      }
      this.dataJson.tempJson.user.login_type = val
    },
    handleWedDictChange (val) {
      this.dataJson.tempJson.is_wed = val
    },
    handleSetPassword () {
      this.popSettings.two.visible = true
    },
    handlePsdDialogCloseOk (val) {
      this.dataJson.tempJson.user.pwd = val
      this.popSettings.two.visible = false
    },
    handlePsdDialogCloseCancel () {
      this.popSettings.two.visible = false
    },
    // -------------------不同的页签，标签进行的验证 e------------------
    // 弹出框关闭
    handleDialogClose () {
      this.settings.visible = false
      // 关闭页面
      this.handleCancel()
    },
    // 返回数据后，并关闭弹出页面，企业
    handleCompanyReturnData (val) {
      if ((this.data.company_id !== val.serial_id) && isNotEmpty(this.dataJson.tempJson.dept_id)) {
        this.settings.popover.visible = true
        this.dataJson.tempJson.dept_id = null
        this.dataJson.tempJson.dept_name = null
        this.dataJson.tempJson.dept_simple_name = null
      }
      this.dataJson.tempJson.company_id = val.serial_id
      this.dataJson.tempJson.company_name = val.name
      this.dataJson.tempJson.company_simple_name = val.simple_name
    },
    // 返回数据后，并关闭弹出页面，部门
    handleDeptReturnData (val) {
      this.dataJson.tempJson.dept_id = val.serial_id
      this.dataJson.tempJson.dept_name = val.name
      this.dataJson.tempJson.dept_simple_name = val.simple_name
    },
    handlePositionClick (val) {
      // 通知路由，打开岗位页面
      this.$router.push({
        name: this.PROGRAMS.P_POSITION, query: { name: val }
      })
      // 关闭页面
      this.handleCancel()
    },
    // 开始综合验证
    doValidateByTabs () {
      // 第一个tabs
      this.settings.rules = this.settings.rulesOne
      this.$refs['dataSubmitForm'].rules = this.settings.rules
      this.$refs['dataSubmitForm'].clearValidate()
      this.$refs['dataSubmitForm'].validate((valid, validateItems) => {
        if (valid === false) {
          this.settings.badge.countOne = Object.keys(validateItems).length
        } else {
          this.settings.badge.countOne = 0
        }
      })
      // 联系方式 tabs
      this.settings.rules = this.settings.rulesFour
      this.$refs['dataSubmitForm'].rules = this.settings.rules
      this.$refs['dataSubmitForm'].clearValidate()
      this.$refs['dataSubmitForm'].validate((valid, validateItems) => {
        if (valid === false) {
          this.settings.badge.countFour = Object.keys(validateItems).length
        } else {
          this.settings.badge.countFour = 0
        }
      })

      // 第二个tabs
      if (this.isLoginEnabled) {
        if (this.isAccountLoginType) {
          this.settings.rules = this.settings.rulesTwo
          this.$refs['dataSubmitForm'].rules = this.settings.rules
          this.$refs['dataSubmitForm'].clearValidate()
          this.$refs['dataSubmitForm'].validate((valid, validateItems) => {
            if (valid === false) {
              this.settings.badge.countTwo = Object.keys(validateItems).length
            } else {
              this.settings.badge.countTwo = 0
            }
          })
        }
      }
      // 所有的数据进行验证
      this.doValidateAllRules()
    },
    // 所有的数据开始validate
    doValidateAllRules () {
      if (this.isLoginEnabled) {
        this.settings.rules = { ...this.settings.rulesOne, ...this.settings.rulesTwo, ...this.settings.rulesFour }
      } else {
        this.settings.rules = { ...this.settings.rulesOne, ...this.settings.rulesFour }
      }

      this.$refs['dataSubmitForm'].rules = this.settings.rules
      this.$refs['dataSubmitForm'].clearValidate()
    },
    // 判断岗位信息是否已经设置
    positionIsShow () {
      return isNotEmpty(this.dataJson.tempJson.positions)
    },

    uploadSuccessOne (res) {
      this.dataJson.tempJson.one_fileVo = res.response.data
      this.dataJson.tempJson.one_fileVo.time = res.response.timestamp
    },
    uploadSuccessTwo (res) {
      this.dataJson.tempJson.two_fileVo = res.response.data
      this.dataJson.tempJson.two_fileVo.time = res.response.timestamp
    },

    // 获取所有仓库组数据
    getWarehouseGroupData () {
      getWarehouseGroupList().then(response => {
        this.dataJson.warehouseGroupListData = this.dataJson.warehouseGroupListData.concat(response.data)
        this.dataJson.warehouseGroupListData.forEach(item => {
          item.checked = false
        })
      }).finally(() => {
        this.settings.loading = false
      })
    },
    // 仓库组选中事件
    changeWarehouseGroup (val) {
      if (val.id === null) {
        if (val.checked === true) {
          this.dataJson.warehouseGroupListData.forEach(item => {
            item.checked = false
          })
        } else {
          this.dataJson.warehouseGroupListData.forEach(item => {
            item.checked = true
          })
        }
      } else {
        this.dataJson.warehouseGroupListData.forEach(item => {
          if (item.id === val.id) {
            if (item.checked === true) {
              item.checked = false
            } else {
              item.checked = true
            }
          }
        })
      }

      this.dataJson.tempJson.warehouseGroupIds = []
      this.dataJson.warehouseGroupListData.forEach(item => {
        if (item.checked === true && item.id !== 0 && item.id !== null) {
          this.dataJson.tempJson.warehouseGroupIds.push(item.id)
        }
      })

      if (this.dataJson.tempJson.warehouseGroupIds.length + 1 === this.dataJson.warehouseGroupListData.length) {
        this.dataJson.tempJson.warehouseGroupIds.push(0)
      }

      this.getWarehouseList()
    },
    getWarehouseList () {
      var codes = ['']
      this.checkboxGroup = []
      this.dataJson.warehouseGroupListData.forEach(item => {
        if (item.checked === true) {
          item.checked = true
          this.checkboxGroup.push(item.id)
          codes.push(item.code)
        }
      })

      getWarehouseListApi({ codes: codes }).then(response => {
        this.dataJson.warehouseListData1 = response.data
        this.concatWarehouseData()
      }).finally(() => {
        this.settings.loading = false
      })
    },

    handleEditWarehouseMember () {
      this.popSettings.one.props.id = this.dataJson.tempJson.id

      const tempWarehouses = []
      if (this.dataJson.tempJson.warehouseStaffList !== null && this.dataJson.tempJson.warehouseStaffList !== undefined) {
        this.dataJson.tempJson.warehouseStaffList.forEach(item => {
          tempWarehouses.push(item.id)
        })
      }

      this.dataJson.tempJson.warehouses = tempWarehouses
      this.popSettings.one.props.data = this.dataJson.tempJson
      this.popSettings.one.props.model = constants_para.MODEL_EDIT
      this.popSettings.one.visible = true
    },
    handleCloseDialogOneOk (val) {
      this.popSettings.one.visible = false
      this.dataJson.tempJson.warehouseStaffList = val

      this.concatWarehouseData()
    },
    handleCloseDialogOneCancel () {
      this.popSettings.one.visible = false
    },
    // 合并仓库信息并分类
    concatWarehouseData () {
      this.dataJson.warehouseListData = []
      this.dataJson.tempJson.warehouseIds = []
      this.dataJson.warehouseListData1.forEach(item => {
        item.type = 1
      })
      this.dataJson.tempJson.warehouseStaffList.forEach(item => {
        item.type = 2
        this.dataJson.tempJson.warehouseIds.push(item.id)
      })
      this.dataJson.warehouseListData = this.dataJson.warehouseListData1.concat(this.dataJson.tempJson.warehouseStaffList)

      this.dataJson.warehouseListData = Object.values(this.dataJson.warehouseListData.reduce((acc, curr) => {
        // console.log(JSON.stringify(acc))
        // console.log(JSON.stringify(curr))
        const { name, short_name, code, type } = curr

        const key = `${code}`
        if (!acc[key]) {
          acc[key] = { name, short_name, code, types: [type] }
        } else {
          acc[key].types.push(type)
        }
        return acc
      }, {}))
    },

    renderContent (h, data) {
      return data.label
    },
    onExpand (e, data) {
      // console.log('======================onExpand' + data.label)
      if ('expand' in data) {
        data.expand = !data.expand
        if (!data.expand && data.children) {
          this.collapse(data.children)
        }
      } else {
        this.$set(data, 'expand', true)
      }
    },
    onNodeClick (e, data) {
      let confirm_str = ''
      let path = ''
      let params = {}
      switch (data.serial_type) {
        case 'm_position':
          confirm_str = '查看该岗位详情，需要关闭当前页面，请注意保存！'
          path = '/position/position'
          params = { code: data.serial_code, fullpath: true }
          break
        case 's_role':
          confirm_str = '查看该角色详情，需要关闭当前页面，请注意保存！'
          path = '/role'
          params = { code: data.serial_code, fullpath: true }
          break
        case 'm_permission':
          confirm_str = '查看该权限详情，需要关闭当前页面，请注意保存！'
          path = '/permission'
          params = { name: data.label, fullpath: true }
          break
        default:
          confirm_str = ''
          path = ''
          params = {}
          break
      }

      if (confirm_str === '' || path === '') {
        return
      }
      this.$confirm(confirm_str, '确认信息', {
      }).then(() => {
        this.$router.push({
          path: path, query: params
        })
        this.handleCancel()
      }).catch(action => {
      })
    },
    collapse (list) {
      var _this = this
      list.forEach(function (child) {
        if (child.expand) {
          child.expand = false
        }
        child.children && _this.collapse(child.children)
      })
    },
    expandChange () {
      this.collapsable = true
      this.toggleExpand(this.dataJson.tempJson.permissionTreeData, this.expandAll)
    },
    toggleExpand (data, val) {
      var _this = this
      if (Array.isArray(data)) {
        data.forEach(function (item) {
          _this.$set(item, 'expand', val)
          if (item.children) {
            _this.toggleExpand(item.children, val)
          }
        })
      } else {
        this.$set(data, 'expand', val)
        if (data.children) {
          _this.toggleExpand(data.children, val)
        }
      }
    },

    // 仓库权限树
    renderContent2 (h, data) {
      return data.label
    },
    onExpand2 (e, data) {
      // console.log('======================onExpand' + data.label)
      if ('expand' in data) {
        data.expand = !data.expand
        if (!data.expand && data.children) {
          this.collapse(data.children)
        }
      } else {
        this.$set(data, 'expand', true)
      }
    },
    onNodeClick2 (e, data) {
      let confirm_str = ''
      let path = ''
      let params = {}
      switch (data.serial_type) {
        case 'm_warehouse':
          confirm_str = '查看该岗位详情，需要关闭当前页面，请注意保存！'
          path = '/position/position'
          params = { code: data.serial_code, fullpath: true }
          break
        case 'b_warehouse_group':
          confirm_str = '查看该角色详情，需要关闭当前页面，请注意保存！'
          path = '/role'
          params = { code: data.serial_code, fullpath: true }
          break
        default:
          confirm_str = ''
          path = ''
          params = {}
          break
      }

      if (confirm_str === '' || path === '') {
        return
      }
      this.$confirm(confirm_str, '确认信息', {
      }).then(() => {
        this.$router.push({
          path: path, query: params
        })
        this.handleCancel()
      }).catch(action => {
      })
    },
    collapse2 (list) {
      var _this = this
      list.forEach(function (child) {
        if (child.expand) {
          child.expand = false
        }
        child.children && _this.collapse(child.children)
      })
    },
    expandChange2 () {
      this.collapsable = true
      this.toggleExpand2(this.dataJson.tempJson.permissionTreeData, this.expandAll)
    },
    toggleExpand2 (data, val) {
      var _this = this
      if (Array.isArray(data)) {
        data.forEach(function (item) {
          _this.$set(item, 'expand', val)
          if (item.children) {
            _this.toggleExpand2(item.children, val)
          }
        })
      } else {
        this.$set(data, 'expand', val)
        if (data.children) {
          _this.toggleExpand2(data.children, val)
        }
      }
    },
    // 如果是默认手机号, 手机号修改后, 默认修改登录名称
    handleChangePhone () {
      // 如果是10, 登录名称默认为手机号
      if (this.dataJson.tempJson.user.login_type === '10') {
        this.dataJson.tempJson.user.login_name = this.dataJson.tempJson.mobile_phone
      }
    },
    // 如果默认手机号, 用户名修改后, 手机号改为用户名
    handleChangeLoginName () {
      // 如果是10, 手机号 默认是 登录名称
      if (this.dataJson.tempJson.user.login_type === '10') {
        this.dataJson.tempJson.mobile_phone = deepCopy(this.dataJson.tempJson.user.login_name)
      }
    }

  }

}
</script>
