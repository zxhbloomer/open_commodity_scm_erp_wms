/**
 * created by shawn 08/09/2018
 * @desc 列表种若没有需要的正则校验则按规范自行在后面添加
 */
import moment from 'moment'
import {
  // 11位手机号
  validateMobile,
  // 邮箱
  validateEmail,
  // 身份证
  validateIDCard,
  // url
  validateURL,
  // 中英文字符
  validateCharacters,
  // 正整数
  validateInteger,
  // 是否为整数(包括正负)
  validateInt,
  // 是否是数字
  validateNumber,
  // 匹配由数字和26个英文字母组成的字符串
  validateUpperCaseNumber,
  // 验证金额
  validateMoney,
  // 验证折扣
  validateSales,
  // 验证最多保留两位小数的正数
  validateDecimal,
  // 验证最多保留两位小数的正数或负数
  validateDecimals
} from './validate'

export const validatorCode = {
  // 非空校验
  checkNotNull (rule, value, callback) {
    if (
      String(value).replace(/^\s+|\s+$/gm, '') === '' ||
      (value instanceof Array && value[0] === '') ||
      value === null ||
      value === undefined
    ) {
      callback(new Error(this.message || '内容不能为空!'))
    } else {
      callback()
    }
  },
  // 11位手机号
  checkMobile (rule, value, callback) {
    if (value !== null && value !== '') {
      if (!validateMobile(value).status) {
        callback(new Error('您输入的手机号不正确!'))
      } else {
        callback()
      }
    } else {
      callback()
    }
  },
  // 邮箱
  checkEmail (rule, value, callback) {
    if (value !== null && value !== '') {
      if (!validateEmail(value).status) {
        callback(new Error('请输入有效的邮箱!'))
      } else {
        callback()
      }
    } else {
      callback()
    }
  },
  // 身份证号
  checkIdCard (rule, value, callback) {
    if (value !== null && value !== '') {
      if (!validateIDCard(value).status) {
        callback(new Error('身份证号码不合规!'))
      } else {
        callback()
      }
    } else {
      callback()
    }
  },
  // url
  checkUrl (rule, value, callback) {
    if (value !== null && value !== '') {
      if (!validateURL(value).status) {
        callback(new Error('URL不合规!'))
      } else {
        callback()
      }
    } else {
      callback()
    }
  },
  // 中英文字符串或者下划线!
  checkCharacters (rule, value, callback) {
    if (value !== null && value !== '') {
      if (!validateCharacters(value).status) {
        callback(new Error('中英文字符串或者下划线!'))
      } else {
        callback()
      }
    } else {
      callback()
    }
  },
  // 正整数!
  checkInteger (rule, value, callback) {
    if (value !== null && value !== '') {
      if (!validateInteger(value).status) {
        callback(new Error('必须为正整数!'))
      } else {
        callback()
      }
    } else {
      callback()
    }
  },
  // 整数(包括正负)
  checkInt (rule, value, callback) {
    if (value !== null && value !== '') {
      if (!validateInt(value).status) {
        callback(new Error('必须为整数!'))
      } else {
        callback()
      }
    } else {
      callback()
    }
  },
  // 是否是数字!
  checkNumber (rule, value, callback) {
    if (value !== null && value !== '') {
      if (!validateNumber(value).status) {
        callback(new Error('必须为数字!'))
      } else {
        callback()
      }
    } else {
      callback()
    }
  },
  // 匹配由数字和26个英文字母组成的字符串!
  checkUpperCaseNumber (rule, value, callback) {
    if (value !== null && value !== '') {
      if (!validateUpperCaseNumber(value).status) {
        callback(new Error('必须为数字和26个英文字母组成的字符串!'))
      } else {
        callback()
      }
    } else {
      callback()
    }
  },
  // 验证金额!
  checkMoney (rule, value, callback) {
    if (value !== null && value !== '') {
      if (!validateMoney(value).status) {
        callback(new Error('金额不合规!'))
      } else {
        callback()
      }
    } else {
      callback()
    }
  },
  // 验证折扣!
  checkSales (rule, value, callback) {
    if (value !== null && value !== '') {
      if (!validateSales(value).status) {
        callback(new Error('金额不合规!'))
      } else {
        callback()
      }
    } else {
      callback()
    }
  },
  // 验证最多保留两位小数的正数!
  checkDecimal (rule, value, callback) {
    if (value !== null && value !== '') {
      if (!validateDecimal(value).status) {
        callback(new Error('最多保留两位正小数!'))
      } else {
        callback()
      }
    } else {
      callback()
    }
  },
  // 验证最多保留两位小数的正数或负数!
  checkDecimals (rule, value, callback) {
    if (value !== null && value !== '') {
      if (!validateDecimals(value).status) {
        callback(new Error('最多保留两位小数!'))
      } else {
        callback()
      }
    } else {
      callback()
    }
  },
  // 验证介于最小值和最大值直接的数字
  checkMinMaxNumber (rule, value, callback) {
    if (value !== null && value !== '') {
      if (!validateNumber(value).status) {
        callback(
          new Error(
            '输入数值介于' + this.minNum + '和' + this.maxNum + '之间！'
          )
        )
      } else {
        if (this.minNum > value || this.maxNum < value) {
          callback(
            new Error(
              '输入数值介于' + this.minNum + '和' + this.maxNum + '之间！'
            )
          )
        } else {
          callback()
        }
      }
    } else {
      callback()
    }
  },
  // 验证不能小于最小值数字
  checkMinNumber (rule, value, callback) {
    if (value !== null && value !== '') {
      if (!validateNumber(value).status) {
        callback(new Error('输入数值不能小于' + this.minNum))
      } else {
        if (this.minNum > value) {
          callback(new Error('输入数值不能小于' + this.minNum))
        } else {
          callback()
        }
      }
    } else {
      callback()
    }
  },
  // 验证不能大于最大值数字
  checkMaxNumber (rule, value, callback) {
    if (value !== null && value !== '') {
      if (!validateNumber(value).status) {
        callback(new Error('输入数值不能大于' + this.maxNum))
      } else {
        if (this.maxNum < value) {
          callback(new Error('输入数值不能大于' + this.maxNum))
        } else {
          callback()
        }
      }
    } else {
      callback()
    }
  },
  // 验证不能早于当前时间
  checkNotEarlier (rule, value, callback) {
    var dd = moment(new Date()).format('YYYY-MM-DD')
    if (value !== null && value !== '') {
      if (new Date(dd) - new Date(value[0]) > 0) {
        callback(new Error('不能早于当前时间'))
      } else {
        callback()
      }
    } else {
      callback()
    }
  },
  // 验证结束日期不能早于当前时间
  checkEndDateNotEarlier (rule, value, callback) {
    var dd = moment(new Date()).format('YYYY-MM-DD')
    if (value !== null && value !== '') {
      if (new Date(dd) - new Date(value[1]) + 1 > 0) {
        callback(new Error('结束日期不能早于等于当前时间'))
      } else if (new Date(value[0]) - new Date(value[1]) === 0) {
        callback(new Error('开始结束日期不能为同一天'))
      } else {
        callback()
      }
    } else {
      callback()
    }
  },
  // 验证不能为未来时间
  checkNotFutureTime (rule, value, callback) {
    if (value !== null && value !== '') {
      if (new Date() - new Date(value) < 0) {
        callback(new Error('不能为未来时间'))
      } else {
        callback()
      }
    } else {
      callback()
    }
  },
  // 校验联动日期，后面的不能早于前面的日期
  checkLinkageDate (rule, value, callback) {
    if (value !== null && value !== '' && this.beginDate !== '') {
      let _msg
      let _beginDate = this.beginDate
      if (this.isTime) {
        _msg = this.beginDate
        _beginDate = '1980/01/01 ' + this.beginDate
        value = '1980/01/01 ' + value
      } else {
        _msg = moment(this.beginDate).format('YYYY-MM-DD')
      }
      if (this.notFuture) {
        if (new Date(value) > new Date()) {
          callback(new Error('不能为未来时间'))
        }
      }
      if (new Date(_beginDate) - new Date(value) > 0) {
        callback(new Error('不能早于时间' + _msg))
      } else {
        callback()
      }
    } else {
      callback()
    }
  },
  // 大于前面的值
  checkBiggerThanFrontNumber (rule, value, callback) {
    if (!validateInteger(value).status) {
      callback(new Error('必须为正整数!'))
    } else if (Number(value) <= Number(this.data)) {
      callback(new Error('结束值必须大于起始值!'))
    } else {
      callback()
    }
  }
}
