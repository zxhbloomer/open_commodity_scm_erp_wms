<template>
  <div
    v-loading="settings.loading"
    class="app-container"
  >
    <div class="edit-container">
      <el-alert
        title="基本信息"
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
        <el-descriptions-item label="计划单号">{{ dataJson.tempJson.plan_code }}</el-descriptions-item>
        <el-descriptions-item label="入库单号">
          {{ dataJson.tempJson.code == null || dataJson.tempJson.code == ''?'系统自动生成':dataJson.tempJson.code }}
        </el-descriptions-item>
        <el-descriptions-item label="序号">{{ dataJson.tempJson.idx }}</el-descriptions-item>
        <el-descriptions-item label="入库类型">{{ dataJson.tempJson.type_name }}</el-descriptions-item>
        <el-descriptions-item label="货主">{{ dataJson.tempJson.owner_name }}</el-descriptions-item>
        <el-descriptions-item label="委托方">{{ dataJson.tempJson.consignor_name }}</el-descriptions-item>
        <el-descriptions-item label="物料编码">{{ dataJson.tempJson.sku_code }}</el-descriptions-item>
        <el-descriptions-item label="物料名称">{{ dataJson.tempJson.goods_name }}</el-descriptions-item>
        <el-descriptions-item label="品名">{{ dataJson.tempJson.pm }}</el-descriptions-item>
        <el-descriptions-item label="规格">{{ dataJson.tempJson.spec }}</el-descriptions-item>
        <el-descriptions-item label="计划入库数量">{{ dataJson.tempJson.plan_weight }}</el-descriptions-item>
        <el-descriptions-item label="单位">{{ dataJson.tempJson.unit_name }}</el-descriptions-item>
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
        <el-descriptions-item
          label-class-name=""
          label="合同编号"
        >
          {{ dataJson.tempJson.contract_no == null?'-':dataJson.tempJson.contract_no }}
        </el-descriptions-item>
        <el-descriptions-item label="单据类型">
          {{ dataJson.tempJson.bill_type_name == null?'-':dataJson.tempJson.bill_type_name }}
        </el-descriptions-item>
        <el-descriptions-item label="合同日期">
          {{ dataJson.tempJson.contract_dt == null?'':formatDate(dataJson.tempJson.contract_dt) }}
        </el-descriptions-item>
        <el-descriptions-item label="船名">
          {{ dataJson.tempJson.ship_name == null?'':dataJson.tempJson.ship_name }}
        </el-descriptions-item>
        <el-descriptions-item label="供应商">
          {{ dataJson.tempJson.supplier_name == null?'':dataJson.tempJson.supplier_name }}
        </el-descriptions-item>
        <el-descriptions-item label="合同量">
          {{ dataJson.tempJson.contract_num == null?'':formatNumber(dataJson.tempJson.contract_num,true,4) }}
        </el-descriptions-item>
        <el-descriptions-item
          v-if="dataJson.tempJson.waybill_code"
          label="物流合同"
        >
          {{ dataJson.tempJson.waybill_code }}
        </el-descriptions-item>
        <el-descriptions-item v-if="dataJson.tempJson.waybill_code" />
        <el-descriptions-item v-if="dataJson.tempJson.waybill_code" />
      </el-descriptions>
      <br>
      <el-alert
        title="入库单信息"
        type="info"
        :closable="false"
      />
      <br>
      <el-form
        ref="dataSubmitForm"
        :rules="settings.rules"
        :model="dataJson.tempJson"
        label-position="right"
        label-width="150px"
        status-icon
      >
        <el-descriptions
          title=""
          :column="3"
          :label-style="labelStyle"
          :content-style="contentStyle"
          direction="horizontal"
          border
          style="padding-right: 10px;padding-left: 10px;"
        >
          <el-descriptions-item label="入库仓库">{{ dataJson.tempJson.warehouse_name }}</el-descriptions-item>
          <el-descriptions-item>
            <div slot="label">
              库区 / 库位
            </div>
            {{ dataJson.tempJson.location_name }}/{{ dataJson.tempJson.bin_name }}
          </el-descriptions-item>

          <el-descriptions-item>
            <div slot="label">
              原发数量
            </div>
            <el-form-item
              prop="primary_quantity"
              label-width="0"
            >
              {{ dataJson.tempJson.primary_quantity }}
            </el-form-item>
          </el-descriptions-item>
          <el-descriptions-item>
            <div slot="label">
              实收车数
            </div>
            <el-form-item label-width="0">
              {{ dataJson.tempJson.car_count }}
            </el-form-item>
          </el-descriptions-item>
          <!-- <el-descriptions-item label="轨道衡数量" /> -->

          <el-descriptions-item>
            <div slot="label">
              入库时间
            </div>
            <el-form-item
              prop="inbound_time"
              label-width="0"
            >
              {{ dataJson.tempJson.inbound_time == null?'-':formatDateTime(dataJson.tempJson.inbound_time) }}
            </el-form-item>
          </el-descriptions-item>
          <el-descriptions-item>
            <div slot="label">
              入库数量
            </div>
            <el-form-item
              prop="actual_count"
              label-width="0"
            >
              {{ dataJson.tempJson.actual_count }}
              <span class="floatRight">{{ dataJson.tempJson.unit_name }}</span>

            </el-form-item>
          </el-descriptions-item>
          <el-descriptions-item label="库存计量单位">
            <span>吨</span>
            <span
              v-if="settings.showUnitRelation"
              class="floatRight"
              style="padding-left: 5px;"
            >注：单位转换，{{ dataJson.tempJson.jl_unit_name }}->{{ dataJson.tempJson.hs_unit_name }}[1:{{ dataJson.tempJson.hs_gx }}]
            </span>
          </el-descriptions-item>
          <el-descriptions-item label="换算后数量">
            {{ dataJson.tempJson.actual_weight==null?'':formatNumber(dataJson.tempJson.actual_weight,true,4) }}
          </el-descriptions-item>
          <el-descriptions-item label="物料单价">
            {{ dataJson.tempJson.price == null?'':formatCurrency(dataJson.tempJson.price, true) }}
          </el-descriptions-item>
          <el-descriptions-item label="物料总价">
            {{ dataJson.tempJson.total_price == null? '':formatCurrency(dataJson.tempJson.total_price, true) }}
          </el-descriptions-item>
          <el-descriptions-item label="单据状态">
            {{ dataJson.tempJson.status_name == null? '':dataJson.tempJson.status_name }}
          </el-descriptions-item>
          <el-descriptions-item v-if="dataJson.tempJson.status !='4'" />
          <el-descriptions-item
            v-if="dataJson.tempJson.status =='4'"
            label="作废理由"
          >
            {{ dataJson.tempJson.cancel_remark }}
          </el-descriptions-item>

        </el-descriptions>
        <br>
        <el-alert
          title="附件信息"
          type="info"
          :closable="false"
        />
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
          <el-descriptions-item label="入库明细附件">
            <el-row style="display: flex;flex-wrap: wrap;">
              <el-col
                v-for="(item, i) in dataJson.goods"
                :key="i"
                :offset="1"
                :span="4"
              >
                <previewCard
                  :file-name="item.fileName"
                  :url="item.url"
                  :time="item.timestamp"
                  @removeFile="removeGoodsFile"
                />
              </el-col>
            </el-row>
          </el-descriptions-item>

          <el-descriptions-item label="检验单">
            <el-row style="display: flex;flex-wrap: wrap;">
              <el-col
                v-for="(item, i) in dataJson.inspections"
                :key="i"
                :offset="1"
                :span="4"
              >
                <previewCard
                  :file-name="item.fileName"
                  :url="item.url"
                  :time="item.timestamp"
                  @removeFile="removeInspectionFile"
                />
              </el-col>
            </el-row>
          </el-descriptions-item>
          <el-descriptions-item label="货物照片">
            <el-row style="display: flex;flex-wrap: wrap;">
              <el-col
                v-for="(item, i) in dataJson.photos"
                :key="i"
                :offset="1"
                :span="4"
              >
                <previewCard
                  :file-name="item.fileName"
                  :url="item.url"
                  :time="item.timestamp"
                  @removeFile="removePhotoFile"
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
.el-form-item--mini.el-form-item {
  margin-bottom: 0px;
}
.required-mark::before {
  content: '*';
  color: #ff4949;
  margin-right: 4px;
}
.link {
  color: #2a6496;
}
br {
  display: block;
  margin: 10px;
  content: ' ';
}
</style>

<script>
import constants_para from '@/common/constants/constants_para'
import elDragDialog from '@/directive/el-drag-dialog'
import deepCopy from 'deep-copy'
import { getApi } from '@/api/40_business/in/in'
import previewCard from '@/components/50_preview_card/preview_card'
import locationDialog from '@/views/30_wms/location/dialog/dialog'
import binDialog from '@/views/30_wms/bin/dialog/dialog'

// import InputSearch from '@/components/40_input/inputSearch'

export default {
  components: { previewCard, locationDialog, binDialog },
  directives: { elDragDialog },
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
    editStatus: {
      type: String,
      default: constants_para.STATUS_INSERT
    }
  },
  data () {
    return {
      contentStyle: {
        width: '15%'
      },
      labelStyle: {
        width: '10%',
        'text-align': 'right'
      },
      fileLabelStyle: {
        width: '2.3%',
        'text-align': 'right'
      },
      // 监听器
      watch: {
        unwatch_tempJson: null
      },
      // 上传文件窗口的状态
      popSettingsUpload: {
        // 弹出窗口会否显示
        dialogFormVisible: false,
        // 错误数据文件
        errorFileUrl: ''
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
        // 弹出的库区查询框参数设置
        searchDialogDataTwo: {
          // 弹出框显示参数
          visible: false,
          data: null,
          // 点击确定以后返回的值
          selectedDataJson: {
            id: null
          }
        },
        // 弹出的库位查询框参数设置
        searchDialogDataThree: {
          // 弹出框显示参数
          visible: false,
          data: null,
          // 点击确定以后返回的值
          selectedDataJson: {
            id: null
          }
        },
        // 弹出商品换算关系新增页面
        convertDialog: {
          // 弹出框显示参数
          visible: false,
          data: null,
          // 点击确定以后返回的值
          selectedDataJson: {
            id: null
          }
        },
        // 弹出商品换算关系列表查询页面
        goodsConvertDialog: {
          // 弹出框显示参数
          visible: false,
          data: null,
          // 点击确定以后返回的值
          selectedDataJson: {
            id: null
          },
          dialogStatus: this.PARAMETERS.STATUS_UPDATE
        }

      },
      dataJson: {
        unitConvertList: [],
        // 磅单文件
        pounds: [],
        pound_file: [],
        // 入库明细
        photos: [],
        photo_file: [],
        // 检验单
        inspections: [],
        inspection_file: [],
        // 货物照片
        goods: [],
        goods_file: [],

        searchForm: {},

        // 单条数据 json的，初始化原始数据
        tempJsonOriginal: {

          inbound_time: '',
          actual_count: '',
          primary_quantity: '',
          car_count: '',
          bin_name: '',
          bin_id: '',
          location_name: '',
          location_id: ''
        },
        // 单条数据 json
        tempJson: {

        },
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
        // 显示换算关系
        showUnitRelation: false,
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
          inbound_time: [
            { required: true, message: '请输入入库时间', trigger: 'change' }
          ],
          actual_count: [
            { required: true, message: '请输入入库数量', trigger: 'change' }
          ],
          primary_quantity: [
            { required: true, message: '请输入原发数量', trigger: 'change' }
          ],
          car_count: [
            { required: true, message: '请输入实收车数', trigger: 'change' }
          ],
          location_name: [
            { required: true, message: '请选择库区 / 库位', trigger: 'change' }
          ]
        },
        rules: {

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
      this.settings.rules = this.settings.rulesOne
      this.initButtonShowStatus()
      this.initButtonDisabledStatus()

      switch (this.editStatus) {
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
      this.initTempJsonOriginal()
      this.dataJson.tempJson = deepCopy(this.dataJson.tempJsonOriginal)
      this.dataJson.tempJson.unit = '吨'
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
      this.getData()
      // this.dataJson.tempJson = deepCopy(this.data)
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
      this.$emit('emitReturn')
    },

    handleTabsClick (tab, event) { },

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
    // 单位改变
    unitChange (val) {
      let obj = {}
      obj = this.dataJson.unitConvertList.find((item) => {
        return item.id === val
      })
      this.dataJson.tempJson.hs_gx = obj.hs_gx
      this.dataJson.tempJson.actual_weight = this.dataJson.tempJson.actual_count * obj.hs_gx
    },
    // 数量改变
    countChange (val) {
      this.dataJson.tempJson.actual_weight = val * this.dataJson.tempJson.hs_gx
      this.dataJson.tempJson.total_price = this.dataJson.tempJson.actual_weight * this.dataJson.tempJson.price
    },
    // 价格改变
    priceChange (val) {
      this.dataJson.tempJson.total_price = val * this.dataJson.tempJson.actual_weight
    },
    getData () {
      // 查询逻辑
      this.settings.loading = true
      getApi(this.data).then(response => {
        this.dataJson.tempJson = deepCopy(response.data)
        this.dataJson.tempJsonOriginal = deepCopy(response.data)
        this.dataJson.tempJson.idx = this.data.idx

        this.dataJson.pounds = this.dataJson.tempJson.pound_files
        this.dataJson.photos = this.dataJson.tempJson.photo_files
        this.dataJson.goods = this.dataJson.tempJson.goods_files
        this.dataJson.inspections = this.dataJson.tempJson.inspection_files
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

    // 货物照片上传成功
    handlePhotoUploadFileSuccess (res) {
      res.response.data.timestamp = res.response.timestamp
      this.dataJson.photos.push(res.response.data)
      this.dataJson.photo_file.push(res.response.data.url)
      this.dataJson.tempJson.photo_files = this.dataJson.photos
    },
    // 货物照片上传失败
    handlePhotoUploadFileError () {
      console.debug('文件上传失败')
      this.$notify({
        title: '上传错误',
        message: '文件上传发生错误！',
        type: 'error',
        duration: 0
      })
    },
    // 删除货物照片附件文件
    removePhotoFile (val) {
      // 获取下标
      const _index = this.dataJson.photo_file.lastIndexOf(val)
      // 从数组中移除
      this.dataJson.photos.splice(_index, 1)
      this.dataJson.photo_file.splice(_index, 1)
      this.dataJson.photo_files.splice(_index, 1)
    },

    // 检验单上传成功
    handleInspectionUploadFileSuccess (res) {
      res.response.data.timestamp = res.response.timestamp
      this.dataJson.inspections.push(res.response.data)
      this.dataJson.inspection_file.push(res.response.data.url)
      this.dataJson.tempJson.inspection_files = this.dataJson.inspections
    },
    // 检验单上传失败
    handleInspectionUploadFileError () {
      console.debug('文件上传失败')
      this.$notify({
        title: '上传错误',
        message: '文件上传发生错误！',
        type: 'error',
        duration: 0
      })
    },
    // 删除检验单文件
    removeInspectionFile (val) {
      // 获取下标
      const _index = this.dataJson.inspection_file.lastIndexOf(val)
      // 从数组中移除
      this.dataJson.inspections.splice(_index, 1)
      this.dataJson.inspection_file.splice(_index, 1)
      this.dataJson.inspection_files.splice(_index, 1)
    },

    // 入库明细附件上传成功
    handleGoodsUploadFileSuccess (res) {
      res.response.data.timestamp = res.response.timestamp
      this.dataJson.goods.push(res.response.data)
      this.dataJson.goods_file.push(res.response.data.url)
      this.dataJson.tempJson.goods_files = this.dataJson.goods
    },
    // 入库明细附件上传失败
    handleGoodsUploadFileError () {
      console.debug('文件上传失败')
      this.$notify({
        title: '上传错误',
        message: '文件上传发生错误！',
        type: 'error',
        duration: 0
      })
    },
    // 删除入库明细附件
    removeGoodsFile (val) {
      // 获取下标
      const _index = this.dataJson.goods_file.lastIndexOf(val)
      // 从数组中移除
      this.dataJson.goods.splice(_index, 1)
      this.dataJson.goods_file.splice(_index, 1)
      this.dataJson.goods_files.splice(_index, 1)
    },
    // 库区
    handleLocationDialog () {
      this.popSettingsData.searchDialogDataTwo.visible = true
    },
    // 库区：关闭对话框：确定
    handleLocationCloseOk (val) {
      this.popSettingsData.searchDialogDataTwo.selectedDataJson = val
      this.popSettingsData.searchDialogDataTwo.visible = false
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
      this.dataJson.tempJson.bin_name = val.name
      this.dataJson.tempJson.bin_id = val.id
    },
    // 库位：关闭对话框：取消
    handleBinCloseCancel () {
      this.popSettingsData.searchDialogDataThree.visible = false
    },
    handleLocationReturnData (val) {
      if (val === null) {
        // 库区
        this.dataJson.tempJson.location_id = null
        this.dataJson.tempJson.location_name = null

        // 库位
        this.dataJson.tempJson.bin_id = null
        this.dataJson.tempJson.bin_name = null
      } else {
        // 库区
        this.dataJson.tempJson.location_id = val.location_id
        this.dataJson.tempJson.location_name = val.location_name

        // 库位
        this.dataJson.tempJson.bin_id = val.id
        this.dataJson.tempJson.bin_name = val.name
      }
    },
    // 弹出框关闭
    handleDialogClose () {
      this.settings.visible = false
    },
    handleCloseDialogConvertCancel () {
      this.popSettingsData.convertDialog.visible = false
    },
    handleCloseDialogConvertOk (val) {
      this.popSettingsData.convertDialog.visible = false
    },
    handleCloseDialogGoodsConvertCancel () {
      this.popSettingsData.goodsConvertDialog.visible = false
    },
    handleCloseDialogGoodsConvertOk (val) {
      this.popSettingsData.goodsConvertDialog.visible = false
      this.getData()
    }

  }

}
</script>
