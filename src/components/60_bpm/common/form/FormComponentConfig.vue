<template>
  <div>
    <el-form v-if="form.name !== 'SpanLayout'" label-width="90px">
      <el-form-item label="表单id">
        <el-input v-model="form.id" size="small" readonly="true" />
      </el-form-item>
      <el-form-item label="表单名称">
        <el-input v-model="form.title" size="small" clearable />
      </el-form-item>
      <component :is="form.name" v-model="form.props" />
      <el-form-item label="必填项">
        <el-switch v-model="form.props.required" />
      </el-form-item>
      <el-form-item label="可打印">
        <el-switch v-model="form.props.enablePrint" />
      </el-form-item>
    </el-form>
    <el-empty v-else description="当前组件不支持配置" />
  </div>

</template>

<script>
import TextInput from './config/TextInputConfig.vue'
import NumberInput from './config/NumberInputConfig.vue'
import AmountInput from './config/AmountInputConfig.vue'
import TextareaInput from './config/TextareaInputConfig.vue'
import MultipleSelect from './config/SelectInputConfig.vue'
import SelectInput from './config/SelectInputConfig.vue'
import DateTime from './config/DateTimeConfig.vue'
import DateTimeRange from './config/DateTimeRangeConfig.vue'
import ImageUpload from './config/ImageUploadConfig.vue'
import FileUpload from './config/FileUploadConfig.vue'
import Description from './config/DescriptionConfig.vue'
import MoneyInput from './config/MoneyInputConfig.vue'
import DeptPicker from './config/OrgPickerConfig.vue'
import UserPicker from './config/OrgPickerConfig.vue'
import TableList from './config/TableListConfig.vue'

export default {
  name: 'FormComponentConfig',
  components: {
    TextInput,
    NumberInput,
    AmountInput,
    TextareaInput,
    SelectInput,
    MultipleSelect,
    DateTime,
    DateTimeRange,
    ImageUpload,
    FileUpload,
    Description,
    MoneyInput,
    DeptPicker,
    UserPicker,
    TableList
  },
  props: {},
  data () {
    return {}
  },
  computed: {
    form () {
      return this.$store.getters.bpm_selectFormItem
    }
  },
  methods: {}
}
</script>

<style scoped>

</style>

