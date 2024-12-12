<template>
  <el-dialog
    v-if="visible"
    v-el-drag-dialog
    v-loading="settings.loading"
    title="监管任务导出"
    element-loading-text="拼命加载中，请稍后..."
    element-loading-background="rgba(255, 255, 255, 0.7)"
    :visible="visible"
    :close-on-click-modal="PARAMETERS.DIALOG_CLOSE_BY_CLICK"
    :close-on-press-escape="PARAMETERS.DIALOG_CLOSE_BY_ESC"
    :show-close="PARAMETERS.DIALOG_SHOW_CLOSE"
    custom-class="configDialog"
    :append-to-body="true"
    :modal-append-to-body="true"
    width="600px"
    height="300px"
    destroy-on-close
  >
    <div style="padding-bottom: 10px">
      <el-checkbox
        v-model="checkAll"
        style="width: 3%; padding-left: 0.5%"
        @change="handleCheckAllChange"
      /> 全部
      <span style="float: right">{{ checkCount }}/18</span>
    </div>
    <div>出库信息</div>
    <el-divider />
    <div class="formData">
      <div>
        <div class="font">1、空车过磅</div>
        <el-row style="padding-top: 10px;">
          <el-col :span="5"><el-checkbox v-model="dataJson.formData.file_1.value" /> <span>{{ dataJson.formData.file_1.name }}</span></el-col>
          <el-col :span="5"><el-checkbox v-model="dataJson.formData.file_2.value" /> <span>{{ dataJson.formData.file_2.name }}</span></el-col>
          <el-col :span="5"><el-checkbox v-model="dataJson.formData.file_40.value" /> <span>{{ dataJson.formData.file_40.name }}</span></el-col>
          <el-col :span="5"><el-checkbox v-model="dataJson.formData.file_3.value" /> <span>{{ dataJson.formData.file_3.name }}</span></el-col>
          <el-col :span="4" />
        </el-row>
        <el-row style="padding-top: 10px; padding-bottom: 10px">
          <el-col :span="5"><el-checkbox v-model="dataJson.formData.file_4.value" /> <span>{{ dataJson.formData.file_4.name }}</span></el-col>
          <el-col :span="5"><el-checkbox v-model="dataJson.formData.file_38.value" /> <span>{{ dataJson.formData.file_38.name }}</span></el-col>
          <el-col :span="5"><el-checkbox v-model="dataJson.formData.file_39.value" /> <span>{{ dataJson.formData.file_39.name }}</span></el-col>
          <el-col :span="14" />
        </el-row>
        <div class="font">2、正在装货</div>
        <el-row style="padding-top: 10px; padding-bottom: 10px">
          <el-col :span="5"><el-checkbox v-model="dataJson.formData.file_8.value" /> <span>{{ dataJson.formData.file_8.name }}</span></el-col>
          <el-col :span="19" />
        </el-row>
        <div class="font">3、重车出库</div>
        <el-row style="padding-top: 10px; padding-bottom: 15px">
          <el-col :span="5"><el-checkbox v-model="dataJson.formData.file_17.value" /> <span>{{ dataJson.formData.file_17.name }}</span></el-col>
          <el-col :span="5"><el-checkbox v-model="dataJson.formData.file_18.value" /> <span>{{ dataJson.formData.file_18.name }}</span></el-col>
          <el-col :span="5"><el-checkbox v-model="dataJson.formData.file_19.value" /> <span>{{ dataJson.formData.file_19.name }}</span></el-col>
          <el-col :span="9" />
        </el-row>
      </div>
      <div>入库信息</div>
      <el-divider />
      <div>
        <div class="font">1、重车过磅</div>
        <el-row style="padding-top: 10px; padding-bottom: 10px">
          <el-col :span="5"><el-checkbox v-model="dataJson.formData.file_20.value" /> <span>{{ dataJson.formData.file_20.name }}</span></el-col>
          <el-col :span="5"><el-checkbox v-model="dataJson.formData.file_21.value" /> <span>{{ dataJson.formData.file_21.name }}</span></el-col>
          <el-col :span="5"><el-checkbox v-model="dataJson.formData.file_22.value" /> <span>{{ dataJson.formData.file_22.name }}</span></el-col>
          <el-col :span="9" />
        </el-row>
        <div class="font">2、重车卸货</div>
        <el-row style="padding-top: 10px; padding-bottom: 10px">
          <el-col :span="5"><el-checkbox v-model="dataJson.formData.file_26.value" /> <span>{{ dataJson.formData.file_26.name }}</span></el-col>
          <el-col :span="19" />
        </el-row>
        <div class="font">3、空车出库</div>
        <el-row style="padding-top: 10px; padding-bottom: 10px">
          <el-col :span="5"><el-checkbox v-model="dataJson.formData.file_35.value" /> <span>{{ dataJson.formData.file_35.name }}</span></el-col>
          <el-col :span="5"><el-checkbox v-model="dataJson.formData.file_36.value" /> <span>{{ dataJson.formData.file_36.name }}</span></el-col>
          <el-col :span="5"><el-checkbox v-model="dataJson.formData.file_37.value" /> <span>{{ dataJson.formData.file_37.name }}</span></el-col>
          <el-col :span="9" />
        </el-row>
      </div>
      <el-divider />
      <div style="width: 25%; margin-left: auto;">
        <el-button
          :disabled="settings.loading"
          @click="handleCancel"
        >取消</el-button>
        <el-button
          plain
          type="primary"
          :disabled="settings.loading"
          @click="handleOk"
        >确定</el-button>
      </div>
    </div>

  </el-dialog>
</template>

<script>
import { getExportFileSettingsApi, saveExportFileSettingsApi } from '@/api/40_business/monitor/monitor'
import elDragDialog from '@/directive/el-drag-dialog'

export default {
  directives: { elDragDialog },
  props: {
    visible: {
      type: Boolean,
      default: true
    }
  },
  data () {
    return {
      dataJson: {
        formData: {
          file_1: { },
          file_2: { },
          file_40: { },
          file_3: { },
          file_4: { },
          file_38: { },
          file_39: { },
          file_8: { },
          file_17: { },
          file_18: { },
          file_19: { },
          file_20: { },
          file_21: { },
          file_22: { },
          file_26: { },
          file_35: { },
          file_36: { },
          file_37: { }
        }
      },
      settings: {
        // loading 状态
        loading: true
      }

    }
  },
  computed: {
    checkAll () {
      return this.dataJson.formData.file_1.value && this.dataJson.formData.file_2.value && this.dataJson.formData.file_3.value &&
        this.dataJson.formData.file_4.value && this.dataJson.formData.file_38.value && this.dataJson.formData.file_39.value &&
        this.dataJson.formData.file_40.value && this.dataJson.formData.file_8.value && this.dataJson.formData.file_17.value &&
        this.dataJson.formData.file_18.value && this.dataJson.formData.file_19.value && this.dataJson.formData.file_20.value &&
        this.dataJson.formData.file_21.value && this.dataJson.formData.file_22.value && this.dataJson.formData.file_26.value &&
        this.dataJson.formData.file_35.value && this.dataJson.formData.file_36.value && this.dataJson.formData.file_37.value
    },
    checkCount () {
      let count = 0
      if (this.dataJson.formData.file_1.value) { count += 1 }
      if (this.dataJson.formData.file_2.value) { count += 1 }
      if (this.dataJson.formData.file_40.value) { count += 1 }
      if (this.dataJson.formData.file_3.value) { count += 1 }
      if (this.dataJson.formData.file_4.value) { count += 1 }
      if (this.dataJson.formData.file_38.value) { count += 1 }
      if (this.dataJson.formData.file_39.value) { count += 1 }
      if (this.dataJson.formData.file_8.value) { count += 1 }
      if (this.dataJson.formData.file_17.value) { count += 1 }
      if (this.dataJson.formData.file_18.value) { count += 1 }
      if (this.dataJson.formData.file_19.value) { count += 1 }
      if (this.dataJson.formData.file_20.value) { count += 1 }
      if (this.dataJson.formData.file_21.value) { count += 1 }
      if (this.dataJson.formData.file_22.value) { count += 1 }
      if (this.dataJson.formData.file_26.value) { count += 1 }
      if (this.dataJson.formData.file_35.value) { count += 1 }
      if (this.dataJson.formData.file_36.value) { count += 1 }
      if (this.dataJson.formData.file_37.value) { count += 1 }
      return count
    }
  },
  created () {
    this.getFormData()
  },
  methods: {
    // 全选框
    handleCheckAllChange (val) {
      this.dataJson.formData.file_1.value = val
      this.dataJson.formData.file_2.value = val
      this.dataJson.formData.file_40.value = val
      this.dataJson.formData.file_3.value = val
      this.dataJson.formData.file_4.value = val
      this.dataJson.formData.file_38.value = val
      this.dataJson.formData.file_39.value = val
      this.dataJson.formData.file_8.value = val
      this.dataJson.formData.file_17.value = val
      this.dataJson.formData.file_18.value = val
      this.dataJson.formData.file_19.value = val
      this.dataJson.formData.file_20.value = val
      this.dataJson.formData.file_21.value = val
      this.dataJson.formData.file_22.value = val
      this.dataJson.formData.file_26.value = val
      this.dataJson.formData.file_35.value = val
      this.dataJson.formData.file_36.value = val
      this.dataJson.formData.file_37.value = val
    },
    getFormData () {
      getExportFileSettingsApi().then(response => {
        this.settings.loading = true
        this.dataJson.formData = response.data
      }, (_error) => {
        console.log('发生了异常，请联系管理员！:' + JSON.stringify(_error))
      }).finally(() => {
        this.settings.loading = false
      })
    },
    handleCancel () {
      this.$emit('closeMeCancel')
    },
    async handleOk () {
      this.settings.loading = true
      saveExportFileSettingsApi(this.dataJson.formData)
        .then(
          _data => {
            this.$emit('closeMeOk')
          },
          _error => {
            this.settings.loading = false
          }
        )
        .finally(() => {
          this.settings.loading = false
        })
    }
  }
}
</script>

<style scoped>
.el-divider--horizontal {
  margin: 10px 0 15px 0;
}
span {
  padding-left: 12px;
}
.formData {
  .el-checkbox {
    width: 3%;
    padding-left: 10px;
  }
  .font {
    color: #115aa5;
  }
}
</style>
