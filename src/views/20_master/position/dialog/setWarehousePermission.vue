<template>
  <div>
    <el-dialog
      v-if="listenVisible"
      v-el-drag-dialog
      :title="settings.title"
      :visible="visible"
      :close-on-click-modal="PARAMETERS.DIALOG_CLOSE_BY_CLICK"
      :close-on-press-escape="PARAMETERS.DIALOG_CLOSE_BY_ESC"
      :show-close="false"
      :append-to-body="true"
      :modal-append-to-body="true"
      width="1300px"
    >
      <el-form
        ref="dataSubmitForm"
        :model="dataJson.tempJson"
        label-position="rigth"
        label-width="120px"
        status-icon
      >
        <el-tabs
          tab-position="right"
          style="height: 600px"
        >

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
              height="400px"
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
                    {{ scope.row.types.length == (index+1)? item == 1 ? '按岗位仓库组授权':'按岗位仓库授权':item == 1 ? '按岗位仓库组授权，':'按岗位仓库授权，' }}
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
                    v-model="settings.horizontal"
                    :width="50"
                    active-text="横排"
                    inactive-text="竖排"
                    style="margin-top:8px;"
                  />
                </el-col>
                <el-col :span="5">
                  <el-switch
                    v-model="settings.expandAll"
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
                :style="settings.scrollTreeStyle"
                class="el-org-tree"
              >
                <org-tree
                  v-if="dataJson.tempJson.warehouseTreeData"
                  name="permission-tree"
                  :props="{label: 'label', children: 'children', expand: 'expand'}"
                  :data="dataJson.tempJson.warehouseTreeData"
                  :horizontal="settings.horizontal"
                  :collapsable="settings.collapsable"
                  :render-content="settings.renderContent"
                  @on-expand="onExpand"
                  @on-node-click="onNodeClick"
                />
              </el-scrollbar>
            </div>
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
          @click="handleCancel()"
        >取消</el-button>
        <el-button
          v-show="settings.btnShowStatus.showInsert && !isViewModel"
          plain
          type="primary"
          :disabled="settings.loading || settings.btnDisabledStatus.disabledInsert "
          @click="doInsert()"
        >确定</el-button>
      </div>
    </el-dialog>
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
.floatRight {
  float: right;
}
.floatLeft {
  float: left;
}
.el-form-item .el-select {
  width: 100%;
}
.el-transfer {
  width: 100%;
}
</style>

<script>

// import { getWarehouseTransferListApi, setWarehousesTransferApi } from '@/api/30_wms/warehouseposition/warehouseposition'
import { getDetailApi, updateWarehousePermissionApi } from '@/api/20_master/position/position'
import constants_para from '@/common/constants/constants_para'
import deepCopy from 'deep-copy'
import elDragDialog from '@/directive/el-drag-dialog'
import { getListApi as getWarehouseGroupList } from '@/api/40_business/warehouse/warehousegroup'
import OrgTree from '@/components/OrgTree/index.js'
import { getWarehouseAllListApi as getWarehouseListApi } from '@/api/20_master/relation/relation'
import setWarehouseDialog from '@/views/20_master/position/dialog/setWarehouse'

export default {
  components: { OrgTree, setWarehouseDialog },
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
    name: {
      type: String,
      default: null
    },
    data: {
      type: Object,
      default: null
    },
    model: {
      type: String,
      default: constants_para.MODEL_VIEW
    }
  },
  data () {
    return {
      dataJson: {
        warehouseGroupListData: [],
        warehouseListData: [],
        warehouseListData1: [],
        tempJson: {
          warehouseGroupIds: [],
          warehouseTreeData: {},
          warehousePositionList: []
        }
      },
      // 页面设置json
      settings: {
        treeData: {
          // 仓库授权信息
          scrollTreeStyle: 'width:100%;height:500px',
          horizontal: false,
          collapsable: true,
          expandAll: true
        },
        // loading 状态
        loading: true,
        duration: 4000,

        // 按钮状态
        btnShowStatus: {
          showInsert: false,
          showUpdate: false,
          showCopyInsert: false
        },
        // 按钮状态：是否可用
        btnDisabledStatus: {
          disabledReset: false,
          disabledInsert: false,
          disabledUpdate: false,
          disabledCopyInsert: false
        },
        // 重置按钮点击后
        btnResetStatus: false,
        // 以下为pop的内容：数据弹出框
        selection: [],
        dialogStatus: '',
        // 穿梭框
        transfer: {
          position_id: null,
          // 所有Warehouses
          warehouse_all: [],
          warehouses: [],
          old_warehouses: [],
          current_row: null
        },
        // 弹出框title，仓库名称
        title: ''
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
    isViewModel () {
      if (this.model === constants_para.MODEL_VIEW) {
        return true
      } else {
        return false
      }
    }
  },
  // 监听器
  watch: {
    // 穿梭框的数据变动，设置重置和确定
    'settings.transfer.warehouses': {
      handler (newVal, oldVal) {
        const listA = newVal
        const listB = this.settings.transfer.old_warehouses
        // 如果新值，旧值为undefined 则return
        if (listA === undefined || listB === undefined) {
          this.settings.btnDisabledStatus.disabledReset = true
          return
        }
        const result = listA.length === listB.length && listA.every(a => listB.some(b => a === b)) && listB.every(_b => listA.some(_a => _a === _b))
        if (result) {
          // 未改变值
          this.settings.btnDisabledStatus.disabledReset = true
          this.settings.btnDisabledStatus.disabledInsert = true
        } else {
          // 有改变值
          this.settings.btnDisabledStatus.disabledReset = false
          this.settings.btnDisabledStatus.disabledInsert = false
        }
      },
      deep: true
    }
  },
  created () {
    this.init()
  },
  mounted () { },
  methods: {
    init () {
      this.getWarehouseGroupData()
      if (this.isViewModel) {
        this.initView()
      } else {
        this.initEdit()
      }
    },
    // 初始化
    initEdit () {
      var _this = this
      _this.settings.title = '授权'
      _this.settings.btnShowStatus.showInsert = true
      getDetailApi(_this.data).then(response => {
        _this.dataJson.tempJson = deepCopy(response.data)

        _this.dataJson.tempJson.warehouseGroupIds = []
        _this.dataJson.tempJson.warehouseGroupList.forEach((item) => {
          if (item != null) {
            _this.dataJson.tempJson.warehouseGroupIds.push(item.id)
          }
        })

        _this.dataJson.warehouseGroupListData.forEach(item1 => {
          _this.dataJson.tempJson.warehouseGroupIds.forEach(item2 => {
            if (item1.id === item2) {
              item1.checked = true
            }
          })
        })

        if (_this.dataJson.tempJson.warehouseGroupIds.length + 1 === _this.dataJson.warehouseGroupListData.length) {
          _this.dataJson.tempJson.warehouseGroupIds.push(0)
        }

        _this.getWarehouseList()
      }).finally(() => {
        _this.settings.loading = false
      })
      _this.settings.btnDisabledStatus.disabledReset = true
    },
    // 查看仓库成员
    initView () {
      this.settings.title = '授权'

      this.settings.btnShowStatus.showInsert = true
      getDetailApi(this.data).then(response => {
        this.dataJson.tempJson = deepCopy(response.data)
      }).finally(() => {
        this.settings.loading = false
      })
      this.settings.btnDisabledStatus.disabledReset = true
    },
    // 穿梭框的过滤方法
    transferFilterMethod (query, item) {
      return item.label.indexOf(query) > -1
    },
    handleCancel () {
      this.$emit('closeMeCancel')
    },

    // 插入逻辑：仓库成员维护，点击确定按钮
    doInsert () {
      this.settings.loading = true
      const tempData = { id: this.data.id }
      tempData.warehouseGroupList = []
      tempData.warehousePositionList = []

      // 岗位仓库
      this.dataJson.tempJson.warehousePositionList.forEach((item) => {
        tempData.warehousePositionList.push(item)
      })

      // 岗位仓库组
      this.dataJson.tempJson.warehouseGroupIds.forEach((item) => {
        if (item !== null && item !== 0) {
          tempData.warehouseGroupList.push({ id: item })
        }
      })

      updateWarehousePermissionApi(tempData).then((_data) => {
        this.$emit('closeMeOk', { return_flag: true, data: _data })
      }, (_error) => {
        this.$emit('closeMeOk', { return_flag: false, error: _error })
      }).finally(() => {
        this.settings.loading = false
      })
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
    // 获取所有仓库组数据
    getWarehouseGroupData () {
      var _this = this
      getWarehouseGroupList().then(response => {
        _this.dataJson.warehouseGroupListData = _this.dataJson.warehouseGroupListData.concat(response.data)
        _this.dataJson.warehouseGroupListData.forEach(item => {
          item.checked = false
        })
      }).finally(() => {
        _this.settings.loading = false
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
      var _this = this
      var codes = ['']
      _this.checkboxGroup = []
      _this.dataJson.warehouseGroupListData.forEach(item => {
        if (item.checked === true) {
          item.checked = true
          _this.checkboxGroup.push(item.id)
          codes.push(item.code)
        }
      })

      getWarehouseListApi({ codes: codes }).then(response => {
        _this.dataJson.warehouseListData1 = response.data
        _this.concatWarehouseData()
      }).finally(() => {
        _this.settings.loading = false
      })
    },
    // 合并仓库信息并分类
    concatWarehouseData () {
      this.dataJson.warehouseListData = []
      this.dataJson.tempJson.warehouseIds = []
      this.dataJson.warehouseListData1.forEach(item => {
        item.type = 1
      })
      this.dataJson.tempJson.warehousePositionList.forEach(item => {
        item.type = 2
        this.dataJson.tempJson.warehouseIds.push(item.id)
      })
      this.dataJson.warehouseListData = this.dataJson.warehouseListData1.concat(this.dataJson.tempJson.warehousePositionList)

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
    handleEditWarehouseMember () {
      this.popSettings.one.props.id = this.dataJson.tempJson.id

      var tempWarehouses = []
      this.dataJson.tempJson.warehousePositionList.forEach(item => {
        tempWarehouses.push(item.id)
      })
      this.dataJson.tempJson.warehouses = tempWarehouses
      this.popSettings.one.props.data = this.dataJson.tempJson
      this.popSettings.one.props.model = constants_para.MODEL_EDIT
      this.popSettings.one.visible = true
    },
    handleCloseDialogOneOk (val) {
      this.popSettings.one.visible = false
      this.dataJson.tempJson.warehousePositionList = val

      this.concatWarehouseData()
    },
    handleCloseDialogOneCancel () {
      this.popSettings.one.visible = false
    }
  }
}
</script>
