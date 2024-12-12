import { validatorCode } from './regCheck.js'
import { isNotEmpty } from '@/utils/index.js'
export default function install(Vue) {
  /**
   * @desc () => {
   * 全局正则校验封装
   * 列表种若没有需要的校验则需要在下面按规范自行添加并写上使用方法
   * }
   * @param {Object} item
   * @return {Array} rules
   * @desc  required 必填项
   * @desc maxLength 字符串的最大长度
   * @desc min&max 必须同时给 min < max type = number
   * @desc minNum&maxNum 必须同时给 minNum < maxNum type = number
   * @desc type 手机号 mobile
   * @desc type 邮箱 email
   * @desc type 网址 url
   * @desc 用法 = > {
   * <el-form-item label="手机号:" prop="mobile"
   *  :rules="regCheck({required:true,type:'mobile'})">
   *  <el-input v-model="dynamicValidateForm.mobile"></el-input>
   * </el-form-item>
   * }
   */
  Vue.prototype.regCheck = function(item) {
    const rules = []
    const _trigger = item.trigger || 'blur'
    // required
    if (item.required) {
      rules.push({
        required: true,
        validator: validatorCode.checkNotNull.bind(item),
        trigger: _trigger
      })
    }
    // maxLength => 最大字符串
    if (isNotEmpty(item.maxLength)) {
      rules.push({
        required: true,
        min: 1,
        max: item.maxLength,
        message: '最多输入' + item.maxLength + '个字符!',
        trigger: _trigger
      })
    }
    // min&&max => 字符串介于最小值和最大值之间
    if (isNotEmpty(item.min) && isNotEmpty(item.max)) {
      rules.push({
        required: true,
        min: item.min,
        max: item.max,
        message: '字符长度在' + item.min + '至' + item.max + '之间!',
        trigger: _trigger
      })
    }
    if (item.type) {
      const type = item.type
      switch (type) {
        // 大于前面的值
        case 'biggerThanFrontNumber':
          rules.push({
            validator: validatorCode.checkBiggerThanFrontNumber.bind(item),
            trigger: _trigger
          })
          break
        // 校验联动日期，后面的不能早于前面的日期
        case 'linkageDate':
          rules.push({
            validator: validatorCode.checkLinkageDate.bind(item),
            trigger: _trigger
          })
          break
        // 不能早于当前时间
        case 'notEarlier':
          rules.push({
            required: true,
            validator: validatorCode.checkNotEarlier
          })
          break
        // 结束日期不能早于当前日期
        case 'endDateNotEarlier':
          rules.push({
            required: true,
            validator: validatorCode.checkEndDateNotEarlier
          })
          break
        // 不能为未来时间
        case 'notFutureTime':
          rules.push({
            required: true,
            validator: validatorCode.checkNotFutureTime
          })
          break
        // 是否数字
        case 'number':
          rules.push({
            validator: validatorCode.checkNumber,
            trigger: _trigger
          })
          break
        // 是否日期时间
        case 'date':
          rules.push({
            type: 'date',
            message: '必须为日期时间格式!',
            trigger: 'change'
          })
          break
        // 手机校验
        case 'mobile':
          rules.push({
            required: true,
            validator: validatorCode.checkMobile,
            trigger: _trigger
          })
          break
        // 邮箱校验
        case 'email':
          rules.push({
            required: true,
            validator: validatorCode.checkEmail,
            trigger: _trigger
          })
          break
        // 身份证校验
        case 'idCard':
          rules.push({
            required: true,
            validator: validatorCode.checkIdCard,
            trigger: _trigger
          })
          break
        // url校验
        case 'url':
          rules.push({
            required: true,
            validator: validatorCode.checkUrl,
            trigger: _trigger
          })
          break
        // 中英文字符串或者下划线
        case 'characters':
          rules.push({
            required: true,
            validator: validatorCode.checkCharacters,
            trigger: _trigger
          })
          break
        // 正整数
        case 'integer':
          rules.push({
            required: true,
            validator: validatorCode.checkInteger,
            trigger: _trigger
          })
          break
        // 整数(包括正负)
        case 'int':
          rules.push({
            required: true,
            validator: validatorCode.checkInt,
            trigger: _trigger
          })
          break
        // 匹配由数字和26个英文字母组成的字符串
        case 'upperCaseNumber':
          rules.push({
            required: true,
            validator: validatorCode.checkUpperCaseNumber,
            trigger: _trigger
          })
          break
        // 验证金额
        case 'money':
          rules.push({
            required: true,
            validator: validatorCode.checkMoney,
            trigger: _trigger
          })
          break
        // 验证折扣
        case 'sales':
          rules.push({
            required: true,
            validator: validatorCode.checkSales,
            trigger: _trigger
          })
          break
        // 验证最多保留两位小数的正数
        case 'decimal':
          rules.push({
            required: true,
            validator: validatorCode.checkDecimal,
            trigger: _trigger
          })
          break
        // 最多保留两位小数的正数或负数
        case 'decimals':
          rules.push({
            required: true,
            validator: validatorCode.checkDecimals,
            trigger: _trigger
          })
          break
        default:
          rules.push({})
          break
      }
    }
    // minNum&&maxNum => 校验 介于最小值与最大值的数字
    if (isNotEmpty(item.minNum) && isNotEmpty(item.maxNum)) {
      rules.push({
        required: true,
        validator: validatorCode.checkMinMaxNumber.bind(item),
        trigger: _trigger
      })
    }
    // minNum => 校验 不能小于最小值
    if (isNotEmpty(item.minNum)) {
      rules.push({
        required: true,
        validator: validatorCode.checkMinNumber.bind(item),
        trigger: _trigger
      })
    }
    // maxNum => 校验 不能大于最大值
    if (isNotEmpty(item.maxNum)) {
      rules.push({
        required: true,
        validator: validatorCode.checkMaxNumber.bind(item),
        trigger: _trigger
      })
    }
    return rules
  }
}
