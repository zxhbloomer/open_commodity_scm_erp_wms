<template>
  <div class="app-container">
    <div class="edit-container">
      <el-form
        ref="dataSubmitForm"
        :rules="settings.rules"
        :model="dataJson.tempJson"
        label-position="right"
        label-width="150px"
        status-icon
      >
        <el-alert
          title="出库计划单基本信息"
          type="info"
          :closable="false"
        />
        <br>
        <el-descriptions
          title=""
          :column="3"
          :label-style="labelStyle"
          :content-style="contentStyle"
          direction="horizontal"
          border
          style="padding-right: 10px;padding-left: 10px;"
        >
          <!-- <el-descriptions-item label="计划单号">{{ dataJson.tempJson.plan_code }}</el-descriptions-item> -->
          <el-descriptions-item label="序号">{{ dataJson.tempJson.idx }}</el-descriptions-item>
          <el-descriptions-item label="出库类型">{{ dataJson.tempJson.type_name }}</el-descriptions-item>
          <el-descriptions-item label="货主">{{ dataJson.tempJson.owner_name }}</el-descriptions-item>
          <el-descriptions-item label="委托方">{{ dataJson.tempJson.consignor_name }}</el-descriptions-item>
          <el-descriptions-item label="物料编码">{{ dataJson.tempJson.sku_code }}</el-descriptions-item>
          <el-descriptions-item label="" />
          <el-descriptions-item label="创建人">{{ dataJson.tempJson.c_name }}</el-descriptions-item>
          <el-descriptions-item label="创建时间">{{ formatDateTime(dataJson.tempJson.c_time) }}</el-descriptions-item>
          <el-descriptions-item label="更新人">{{ dataJson.tempJson.u_name }}</el-descriptions-item>
          <el-descriptions-item label="更新时间">{{ formatDateTime(dataJson.tempJson.u_time) }}</el-descriptions-item>
          <el-descriptions-item label="审核人">{{ dataJson.tempJson.e_name }}</el-descriptions-item>
          <el-descriptions-item label="审核时间">{{ dataJson.tempJson.e_dt == null ? '-':formatDateTime(dataJson.tempJson.e_dt) }}</el-descriptions-item>
        </el-descriptions>
        <br>
        <el-alert
          title="合同信息"
          type="info"
          :closable="false"
        />
        <br>
        <el-descriptions
          title=""
          :column="3"
          :label-style="labelStyle"
          :content-style="contentStyle"
          direction="horizontal"
          border
          style="padding-right: 10px;padding-left: 10px;"
        >
          <el-descriptions-item label="合同编号">{{ dataJson.tempJson.contract_no }}</el-descriptions-item>
          <el-descriptions-item label="单据类型">{{ dataJson.tempJson.bill_type_name }}</el-descriptions-item>
          <el-descriptions-item label="合同日期">
            {{ dataJson.tempJson.contract_dt == null?'':formatDate(dataJson.tempJson.contract_dt) }}
          </el-descriptions-item>
          <el-descriptions-item label="客户">{{ dataJson.tempJson.client_name }}</el-descriptions-item>
          <el-descriptions-item label="合同量">{{ dataJson.tempJson.contract_num == null?'':formatNumber(dataJson.tempJson.contract_num,true,4) }}</el-descriptions-item>
          <el-descriptions-item label="" />
        </el-descriptions>
        <br>
        <el-alert
          title="出库物料明细"
          type="info"
          :closable="false"
        />
        <br>
        <!--
      <el-divider content-position="left">计划出库信息</el-divider> -->
        <el-descriptions
          title=""
          :column="3"
          :label-style="labelStyle"
          :content-style="contentStyle"
          direction="horizontal"
          border
          style="padding-right: 10px;padding-left: 10px;"
        >
          <el-descriptions-item label="物料编码">{{ dataJson.tempJson.sku_code }}</el-descriptions-item>
          <el-descriptions-item label="物料名称">{{ dataJson.tempJson.goods_name }}</el-descriptions-item>
          <el-descriptions-item label="品名">{{ dataJson.tempJson.goods_name }}</el-descriptions-item>
          <el-descriptions-item label="规格">{{ dataJson.tempJson.spec }}</el-descriptions-item>
          <el-descriptions-item label="换算后数量">{{ dataJson.tempJson.plan_weight }}</el-descriptions-item>
          <el-descriptions-item label="出货仓库">{{ dataJson.tempJson.warehouse_name }}</el-descriptions-item>
          <el-descriptions-item label="库区">
            <el-form-item
              prop="location_name"
              label-width="0"
            >
              <input-search
                v-model.trim="dataJson.tempJson.location_name"
                :disabled="isUpdateModel && isViewModel"
                @onInputSearch="handleLocationDialog"
              />
            </el-form-item>
          </el-descriptions-item>
          <el-descriptions-item label="库位">
            <el-form-item
              prop="bin_name"
              label-width="0"
            >
              <input-search
                v-model.trim="dataJson.tempJson.bin_name"
                :disabled="isUpdateModel && isViewModel"
                @onInputSearch="handleBinDialog"
              />
            </el-form-item>
          </el-descriptions-item>
          <el-descriptions-item label="可用库存">{{ dataJson.tempJson.qty_avaible }}</el-descriptions-item>
        </el-descriptions>
        <br>
        <!--
      <el-divider content-position="left">实际出库信息</el-divider>
      <br> -->

        <el-descriptions
          title=""
          :column="3"
          :label-style="labelStyle"
          :content-style="contentStyle"
          direction="horizontal"
          border
          style="padding-right: 10px;padding-left: 10px;"
        >
          <el-descriptions-item>
            <div
              slot="label"
              class="required-mark"
            >
              出库时间
            </div>
            <el-form-item
              label-width="0"
              prop="outbound_time"
            >
              {{ dataJson.tempJson.outbound_time }}
            </el-form-item>
          </el-descriptions-item>
          <el-descriptions-item>
            <div
              slot="label"
              class="required-mark"
            >
              出库数量
            </div>
            <el-form-item
              label-width="0"
              prop="actual_count"
            >
              {{ dataJson.tempJson.actual_count }}
            </el-form-item>
          </el-descriptions-item>
          <el-descriptions-item>
            <div
              slot="label"
              class="required-mark"
            >
              出库单位
            </div>
            <el-form-item
              label-width="0"
              prop="unit_convert_id"
            >
              <el-select
                v-model.trim="dataJson.tempJson.unit_convert_id"
                placeholder="请选择出库单位"
                :loading="settings.loading"
                loading-text="拼命加载..."
                clearable
                :disabled="isViewModel"
                @change="unitChange"
              >
                <el-option
                  v-for="item in dataJson.unitConvertList"
                  :key="item.jl_unit"
                  :label="item.jl_unit"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
          </el-descriptions-item>

          <el-descriptions-item>
            <div slot="label">
              出库重量
            </div>
            {{ dataJson.tempJson.actual_weight }}

          </el-descriptions-item>
          <el-descriptions-item>
            <div slot="label">
              库存单位
            </div>
            <el-form-item>
              <span>吨</span>
            </el-form-item>
          </el-descriptions-item>
        </el-descriptions>

        <br>

        <el-descriptions
          title=""
          :column="1"
          :label-style="fileLabelStyle"
          :content-style="contentStyle"
          direction="horizontal"
          border
          style="padding-right: 10px;padding-left: 10px;"
        >
          <el-descriptions-item label="磅单文件">
            <el-row style="display: flex;flex-wrap: wrap;">
              <el-col>
                <Simple-upload-mutil-file
                  :accept="'*'"
                  @upload-success="handlePoundUploadFileSuccess"
                  @upload-error="handlePoundUploadFileError"
                />
              </el-col>
              <el-col
                v-for="(item, i) in dataJson.pounds"
                :key="i"
                :offset="1"
                :span="4"
              >
                <previewCard
                  :file-name="item.fileName"
                  :url="item.url"
                  :time="item.timestamp"
                  @removeFile="removePoundFile"
                />
              </el-col>
            </el-row>
          </el-descriptions-item>
          <el-descriptions-item label="出库照片">
            <el-row style="display: flex;flex-wrap: wrap;">
              <el-col>
                <Simple-upload-mutil-file
                  :accept="'*'"
                  @upload-success="handleOutPhotoUploadFileSuccess"
                  @upload-error="handleOutPhotoUploadFileError"
                />
              </el-col>
              <el-col
                v-for="(item, i) in dataJson.out_photos"
                :key="i"
                :offset="1"
                :span="4"
              >
                <previewCard
                  :file-name="item.fileName"
                  :url="item.url"
                  :time="item.timestamp"
                  @removeFile="removeOutPhotoFile"
                />
              </el-col>
            </el-row>
          </el-descriptions-item>
        </el-descriptions>
        <br>

      </el-form>
    </div>
    <div
      slot="footer"
      class="dialog-footer"
    >
      <el-divider />
      <el-button
        v-show="settings.btnShowStatus.showInsert"
        type="primary"
        :disabled="settings.loading || settings.btnDisabledStatus.disabledInsert"
        size="medium"
        @click="doInsert()"
      >保存</el-button>
      <el-button
        v-show="settings.btnShowStatus.showUpdate && !isViewModel"
        type="primary"
        :disabled="settings.loading || settings.btnDisabledStatus.disabledUpdate"
        size="medium"
        @click="doUpdate()"
      >保存</el-button>
      <el-button
        size="medium"
        @click="handleCancel()"
      >返回</el-button>
    </div>

    <location-dialog
      v-if="popSettingsData.searchDialogDataTwo.visible"
      :visible="popSettingsData.searchDialogDataTwo.visible"
      @closeMeOk="handleLocationCloseOk"
      @closeMeCancel="handleLocationCloseCancel"
    />
    <bin-dialog
      v-if="popSettingsData.searchDialogDataThree.visible"
      :visible="popSettingsData.searchDialogDataThree.visible"
      @closeMeOk="handleBinCloseOk"
      @closeMeCancel="handleBinCloseCancel"
    />
  </div>
</template>

<style scoped>
.edit-container {
  height: calc(100vh - 160px);
  overflow-x: auto;
}
.el-form-item--mini.el-form-item {
  margin-bottom: 0px;
}
.dialog-footer {
  text-align: center;
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
.el-input-group__append_select,
.el-input-group__append {
  color: #ffffff;
  background-color: #1890ff;
  border-color: #1890ff;
}
.required-mark::before {
  content: '*';
  color: #ff4949;
  margin-right: 4px;
}
</style>

<script>
import { getUnitConvertComboListApi } from '@/api/30_wms/goodsunitconvert/goodsunitconvert'
import constants_para from '@/common/constants/constants_para'
import elDragDialog from '@/directive/el-drag-dialog'
import deepCopy from 'deep-copy'
import { getPlanDetailApi, operateApi } from '@/api/40_business/outplan/outplan'
import previewCard from '@/components/50_preview_card/preview_card'
import SimpleUploadMutilFile from '@/components/10_file/SimpleUploadMutilFile'
import locationDialog from '@/views/30_wms/location/dialog/dialog'
import binDialog from '@/views/30_wms/bin/dialog/dialog'
import InputSearch from '@/components/40_input/inputSearch'
// import mixin from './mixin/operateResizeHandlerMixin'

export default {
  directives: { elDragDialog },
  components: { SimpleUploadMutilFile, previewCard, locationDialog, binDialog, InputSearch },
  // mixins: [mixin],
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
      default: constants_para.STATUS_INSERT
    }
  },
  data () {
    return {
      contentStyle: {
        width: '16%'
      },
      labelStyle: {
        width: '9%',
        'text-align': 'right'
      },
      fileLabelStyle: {
        width: '2.3%',
        'text-align': 'right'
      },
      // 上传文件窗口的状态
      popSettingsUpload: {
        // 弹出窗口会否显示
        dialogFormVisible: false,
        // 错误数据文件
        errorFileUrl: ''
      },
      // 监听器
      watch: {
        unwatch_tempJson: null
      },
      popSettingsData: {
        // 弹出窗口状态名称
        dialogStatus: '',
        dialogFormVisible: false,
        btnDisabledStatus: {
          disabledOK: false
        },
        // 弹出的查询框参数设置
        searchDialogDataOne: {
          // 弹出框显示参数
          visible: false,
          // 点击确定以后返回的值
          selectedDataJson: {
            id: null
          }
        },
        // 弹出的行业查询框参数设置
        searchDialogDataTwo: {
          // 弹出框显示参数
          visible: false,
          data: null,
          // 点击确定以后返回的值
          selectedDataJson: {
            id: null
          }
        },
        // 弹出的查询框参数设置
        searchDialogDataThree: {
          // 弹出框显示参数
          visible: false,
          // 点击确定以后返回的值
          selectedDataJson: {
            id: null
          }
        },
        // 弹出的行业查询框参数设置
        searchDialogDataFour: {
          // 弹出框显示参数
          visible: false,
          data: null,
          // 点击确定以后返回的值
          selectedDataJson: {
            id: null
          }
        },
        // 弹出的行业查询框参数设置
        searchDialogDataFive: {
          // 弹出框显示参数
          visible: false,
          data: null,
          // 点击确定以后返回的值
          selectedDataJson: {
            id: null
          }
        },
        // 弹出的行业查询框参数设置
        searchDialogDataSix: {
          // 弹出框显示参数
          visible: false,
          data: null,
          // 点击确定以后返回的值
          selectedDataJson: {
            id: null
          }
        },
        // 弹出的行业查询框参数设置
        searchDialogDataSeven: {
          // 弹出框显示参数
          visible: false,
          data: null,
          // 点击确定以后返回的值
          selectedDataJson: {
            id: null
          }
        }
      },
      dataJson: {
        unitConvertList: [],
        // 单条数据 json的，初始化原始数据
        // 磅单文件
        pounds: [],
        pound_file: [],
        // 出库明细
        out_photos: [],
        out_photo_file: [],
        tempJsonOriginal: {
          unit_id: '',
          plan_code: '',
          outbound_time: '',
          actual_count: ''
        },
        // 单条数据 json
        tempJson: { unit: '吨', plan_code: '' },
        inputSettings: {
          maxLength: {
            contract_num: 20,
            ship_name: 20,
            contract_no: 20,
            primary_quantity: 10,
            car_count: 20,
            actual_count: 20,
            price: 10
          }
        }
      },
      // 页面设置json
      settings: {
        // tableHeight: this.setUIheight(),
        // loading 状态
        loading: true,
        // 按钮是否显示，默认不显示，false：不显示，true：显示
        btnShowStatus: {
          showInsert: false,
          showUpdate: false
        },
        // 按钮状态：是否可用，false:可用，true不可用
        btnDisabledStatus: {
          disabledInsert: true,
          disabledUpdate: true
        },
        // 以下为pop的内容：数据弹出框
        selection: [],
        dialogStatus: this.dialogStatus,
        // pop的check内容
        rulesOne: {
          unit_id: [
            { required: true, message: '请选择库位', trigger: 'change' }
          ],
          outbound_time: [
            { required: true, message: '请输入出库时间', trigger: 'change' }
          ],
          actual_count: [
            { required: true, message: '请输入出库数量', trigger: 'change' }
          ]
        },
        rules: {

        },
        // 错误数目
        badge: {
          countOne: 0,
          countTwo: 0
        }
      }
    }
  },
  computed: {
    // 是否为更新模式
    isUpdateModel () {
      if (
        this.settings.dialogStatus === this.PARAMETERS.STATUS_INSERT ||
        this.settings.dialogStatus === this.PARAMETERS.STATUS_COPY_INSERT
      ) {
        return false
      } else {
        return true
      }
    },
    listenVisible () {
      return this.visible
    },
    isViewModel () {
      if (this.settings.dialogStatus === this.PARAMETERS.STATUS_VIEW) {
        return true
      } else {
        return false
      }
    }
  },
  // 监听器
  watch: {},
  created () {
    this.init()
  },
  mounted () {
    // 描绘完成
  },
  destroyed () {
    this.unWatch()
  },
  methods: {
    // 初始化处理
    init () {
      this.dataJson.tempJson = this.data
      // this.dataJson.tempJson = this.$route.params.routeParams

      // this.dataJson.tempJson.unit_id = null
      this.settings.rules = this.settings.rulesOne

      this.initButtonShowStatus()
      this.initButtonDisabledStatus()
      switch (this.dialogStatus) {
        case this.PARAMETERS.STATUS_INSERT:
          this.initInsertModel()
          break
        case this.PARAMETERS.STATUS_UPDATE:
          this.initUpdateModel()
          break
        case this.PARAMETERS.STATUS_VIEW:
          this.initViewModel()
          break
      }

      this.settings.loading = false
    },
    initTempJsonOriginal () {
      // 单条数据 json的，初始化原始数据
      this.dataJson.tempJsonOriginal = this.$options.data.call(
        this
      ).dataJson.tempJsonOriginal
    },
    initButtonShowStatus () {
      // 初始化按钮状态：默认都隐藏
      this.settings.btnShowStatus = this.$options.data.call(
        this
      ).settings.btnShowStatus
    },
    initButtonDisabledStatus () {
      // 按钮状态初始化：默认不可用
      this.settings.btnDisabledStatus = this.$options.data.call(
        this
      ).settings.btnDisabledStatus
    },
    // 新增时的初始化
    initInsertModel () {
      // 数据初始化
      this.getData()
      // 设置按钮
      this.settings.btnShowStatus.showInsert = true
      // 控件focus
      this.$nextTick(() => {
        // this.$refs['refFocusOne'].focus()
      })
    },
    // Placeholder设置
    isPlaceholderShow (val) {
      if (this.isViewModel) {
        return ''
      } else {
        return val
      }
    },
    // 修改时的初始化
    initUpdateModel () {
      // 数据初始化

      this.getData()
      // 设置按钮
      this.settings.btnShowStatus.showUpdate = true
      // 控件focus
      this.$nextTick(() => {
        // this.$refs['refFocusOne'].focus()
      })
    },
    // 查看时的初始化
    initViewModel () {
      // 数据初始化
      // this.getData()
      this.dataJson.tempJson = deepCopy(this.data)

      this.dataJson.pounds = this.dataJson.tempJson.pound_files
      this.dataJson.out_photos = this.dataJson.tempJson.out_photo_files
    },
    // 设置监听器
    setWatch () {
      this.unWatch()
      // 监听页面上面是否有修改，有修改按钮高亮
      this.watch.unwatch_tempJson = this.$watch(
        'dataJson.tempJson',
        (newVal, oldVal) => {
          this.settings.btnDisabledStatus.disabledInsert = false
          this.settings.btnDisabledStatus.disabledUpdate = false
          this.unitChange(this.dataJson.tempJson.unit_convert_id)
        },
        { deep: true }
      )
    },
    unWatch () {
      if (this.watch.unwatch_tempJson) {
        this.watch.unwatch_tempJson()
      }
    },

    // 取消按钮
    handleCancel () {
      // this.$emit('closeMeCancel')
      // this.$router.go(-1)
      this.$emit('emitReturn')
    },
    // 出库操作
    doInsert () {
      // 开始综合验证
      this.doValidateByTabs()
      this.$refs['dataSubmitForm'].validate(valid => {
        if (valid) {
          const tempData = deepCopy(this.dataJson.tempJson)
          this.settings.loading = true
          operateApi(tempData)
            .then(
              _data => {
                // this.$emit('closeMeOk', { return_flag: true, data: _data })
                this.$notify({
                  title: '出库操作成功',
                  message: _data.data.message,
                  type: 'success',
                  duration: this.settings.duration
                })
              },
              _error => {
                // this.$emit('closeMeOk', { return_flag: false, error: _error })
                this.$notify({
                  title: '出库操作失败',
                  message: _error.error.message,
                  type: 'error',
                  duration: this.settings.duration
                })
              }
            )
            .finally(() => {
              // this.settings.loading = false
              // this.$router.push({
              //   path: '/inandout/outplan', query: {}
              // })

              this.$emit('emitReturn')
            })
        }
      })
    },
    // 更新逻辑
    doUpdate () {
      // 开始综合验证
      this.doValidateByTabs()
      this.$refs['dataSubmitForm'].validate(valid => {
        if (valid) {
          const tempData = deepCopy(this.dataJson.tempJson)
          this.settings.loading = true
          operateApi(tempData)
            .then(
              _data => {
                this.dataJson.tempJson = deepCopy(_data.data)
                this.$emit('closeMeOk', { return_flag: true, data: _data })
              },
              _error => {
                this.$emit('closeMeOk', { return_flag: false, error: _error })
              }
            )
            .finally(() => {
              this.settings.loading = false
            })
        }
      })
    },
    handleTabsClick (tab, event) { },

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
      // 所有的数据进行验证
      this.doValidateAllRules()
    },
    // 所有的数据开始validate
    doValidateAllRules () {
      if (this.isLoginEnabled) {
        this.settings.rules = { ...this.settings.rulesOne, ...this.settings.rulesTwo }
      } else {
        this.settings.rules = { ...this.settings.rulesOne }
      }

      this.$refs['dataSubmitForm'].rules = this.settings.rules
      this.$refs['dataSubmitForm'].clearValidate()
    },
    getUnitConvertComboData () {
      const param = {}
      param.sku_id = this.dataJson.tempJson.sku_id
      getUnitConvertComboListApi(param).then((_data) => {
        this.dataJson.unitConvertList = _data.data
        this.settings.loading = false

        // let obj = {}
        // obj = this.dataJson.unitConvertList.find((item) => {
        // console.log('--------' + item.id)
        // console.log('--------' + this.dataJson.tempJson.unit_id)
        // return item.id === this.dataJson.tempJson.unit_id
        // })
        // console.log(obj)
        // this.dataJson.tempJson.hs_gx = obj.hs_gx

        // 初始化watch
        this.setWatch()
      }, (_error) => {
      })
    },
    unitChange (val) {
      let obj = {}
      obj = this.dataJson.unitConvertList.find((item) => {
        return item.id === val
      })
      this.dataJson.tempJson.hs_gx = obj.hs_gx
      this.dataJson.tempJson.actual_weight = this.dataJson.tempJson.actual_count * obj.hs_gx
    },
    countChange (val) {
      this.dataJson.tempJson.actual_weight = val * this.dataJson.tempJson.hs_gx
    },
    getData () {
      // 查询逻辑
      this.settings.loading = true
      getPlanDetailApi(this.data).then(response => {
        this.dataJson.tempJson = deepCopy(response.data)
        this.dataJson.tempJsonOriginal = deepCopy(response.data)
        this.dataJson.tempJson.idx = this.data.idx
        this.getUnitConvertComboData()
      }).finally(() => {
        this.settings.loading = false
      })
    },

    // 磅单上传成功
    handlePoundUploadFileSuccess (res) {
      res.response.data.timestamp = res.response.timestamp
      this.dataJson.pounds.push(res.response.data)
      this.dataJson.pound_file.push(res.response.data.url)
      this.dataJson.tempJson.pound_files = this.dataJson.pounds
    },
    // 磅单上传失败
    handlePoundUploadFileError () {
      console.debug('文件上传失败')
      this.$notify({
        title: '上传错误',
        message: '文件上传发生错误！',
        type: 'error',
        duration: 0
      })
    },
    // 删除磅单文件
    removePoundFile (val) {
      // 获取下标
      const _index = this.dataJson.pound_file.lastIndexOf(val)
      // 从数组中移除
      this.dataJson.pounds.splice(_index, 1)
      this.dataJson.pound_file.splice(_index, 1)
      this.dataJson.tempJson.splice(_index, 1)
    },

    // 出库照片上传成功
    handleOutPhotoUploadFileSuccess (res) {
      res.response.data.timestamp = res.response.timestamp
      this.dataJson.out_photos.push(res.response.data)
      this.dataJson.out_photo_file.push(res.response.data.url)
      this.dataJson.tempJson.out_photo_files = this.dataJson.out_photos
    },
    // 出库照片附件上传失败
    handleOutPhotoUploadFileError () {
      console.debug('文件上传失败')
      this.$notify({
        title: '上传错误',
        message: '文件上传发生错误！',
        type: 'error',
        duration: 0
      })
    },
    // 删除出库照片
    removeOutPhotoFile (val) {
      // 获取下标
      const _index = this.dataJson.goods_file.lastIndexOf(val)
      // 从数组中移除
      this.dataJson.out_photos.splice(_index, 1)
      this.dataJson.out_photo_file.splice(_index, 1)
      this.dataJson.out_photo_files.splice(_index, 1)
    },
    // 库区
    handleLocationDialog () {
      this.popSettingsData.searchDialogDataTwo.visible = true
    },
    // 库区：关闭对话框：确定
    handleLocationCloseOk (val) {
      this.popSettingsData.searchDialogDataTwo.selectedDataJson = val
      this.popSettingsData.searchDialogDataTwo.visible = false
      this.settings.btnDisabledStatus.disabledUpdate = false
      this.dataJson.tempJson.location_name = val.name
      this.dataJson.tempJson.location_id = val.id
    },
    // 库区：关闭对话框：取消
    handleLocationCloseCancel () {
      this.popSettingsData.searchDialogDataTwo.visible = false
    },
    // 库位
    handleBinDialog () {
      this.popSettingsData.searchDialogDataThree.visible = true
    },
    // 库位：关闭对话框：确定
    handleBinCloseOk (val) {
      this.popSettingsData.searchDialogDataThree.selectedDataJson = val
      this.popSettingsData.searchDialogDataThree.visible = false
      this.settings.btnDisabledStatus.disabledUpdate = false
      this.dataJson.tempJson.bin_name = val.name
      this.dataJson.tempJson.bin_id = val.id
    },
    // 库位：关闭对话框：取消
    handleBinCloseCancel () {
      this.popSettingsData.searchDialogDataThree.visible = false
    }
  }

}
</script>
