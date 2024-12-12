/**
 * Created by shawn on 08/10/2018.
 * new validate
 */
/* 至少一位的中英文字符串或者下划线 */
export function validateCharacters (str) {
  if (/[a-zA-Z0-9_\u4e00-\u9fa5]+/.test(str)) {
    return { status: true }
  } else {
    return { status: false }
  }
}
/* 合法uri */
export function validateURL (textval) {
  const urlregex = /^(https?|ftp):\/\/([a-zA-Z0-9.-]+(:[a-zA-Z0-9.&%$-]+)*@)*((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]?)(\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])){3}|([a-zA-Z0-9-]+\.)*[a-zA-Z0-9-]+\.(com|edu|gov|int|mil|net|org|biz|arpa|info|name|pro|aero|coop|museum|[a-zA-Z]{2}))(:[0-9]+)*(\/($|[a-zA-Z0-9.,?'\\+&%$#=~_-]+))*$/
  if (urlregex.test(textval)) {
    return { status: true }
  } else {
    return { status: false }
  }
}
/* 小写字母 */
export function validateLowerCase (str) {
  const reg = /^[a-z]+$/
  if (reg.test(str)) {
    return { status: true }
  } else {
    return { status: false }
  }
}
/* 大写字母 */
export function validateUpperCase (str) {
  const reg = /^[A-Z]+$/
  if (reg.test(str)) {
    return { status: true }
  } else {
    return { status: true }
  }
}
/* 大小写字母 */
export function validatAlphabets (str) {
  const reg = /^[A-Za-z]+$/
  if (reg.test(str)) {
    return { status: true }
  } else {
    return { status: false }
  }
}
/* 邮箱 */
export function validateEmail (email) {
  const re = /^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$/
  if (email.length === 0) {
    return { status: false, msg: '邮箱不能为空！' }
  }
  if (!re.test(email)) {
    return { status: false, msg: '请输入有效的邮箱！' }
  }
  return { status: true }
}
// 验证手机号
export function validateMobile (mobile) {
  if (mobile.length === 0) {
    return { status: false, msg: '手机号码不能为空！' }
  }
  if (mobile.length !== 11) {
    return { status: false, msg: '请输入有效的手机号码，需是11位！' }
  }

  // var myreg = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1}))+\d{8}|(19[0-9]{1}))+\d{8})$/
  var myreg = /^(1[0-9]{10})$/
  if (!myreg.test(mobile)) {
    return { status: false, msg: '请输入有效的手机号码！' }
  }
  return { status: true }
}
// 验证身份证
export function validateIDCard (id) {
  // 1 "验证通过!", 0 //校验不通过
  var format = /^(([1][1-5])|([2][1-3])|([3][1-7])|([4][1-6])|([5][0-4])|([6][1-5])|([7][1])|([8][1-2]))\d{4}(([1][9]\d{2})|([2]\d{3}))(([0][1-9])|([1][0-2]))(([0][1-9])|([1-2][0-9])|([3][0-1]))\d{3}[0-9xX]$/
  // 号码规则校验
  if (!format.test(id)) {
    return { status: false, msg: '身份证号码不合规' }
  }
  // 区位码校验
  // 出生年月日校验   前正则限制起始年份为1900;
  var year = id.substr(6, 4) // 身份证年
  var month = id.substr(10, 2) // 身份证月
  var date = id.substr(12, 2) // 身份证日
  var time = Date.parse(month + '-' + date + '-' + year) // 身份证日期时间戳date
  var nowTime = Date.parse(new Date()) // 当前时间戳
  var dates = new Date(year, month, 0).getDate() // 身份证当月天数
  if (time > nowTime || date > dates) {
    return { status: false, msg: '出生日期不合规' }
  }
  // 校验码判断
  var c = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2] // 系数
  var b = ['1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2'] // 校验码对照表
  var idArray = id.split('')
  var sum = 0
  for (var k = 0; k < 17; k++) {
    sum += parseInt(idArray[k]) * parseInt(c[k])
  }
  if (idArray[17].toUpperCase() !== b[sum % 11].toUpperCase()) {
    return { status: false, msg: '身份证校验码不合规' }
  }
  return { status: true, msg: '校验通过' }
}
// 是否为正整数
export function validateInteger (val) {
  var regNum = /^[1-9]\d*$/ // 正整数
  if (regNum.test(val)) {
    return { status: true }
  } else {
    return { status: false, msg: '必须为正整数' }
  }
}
// 是否为整数(包括正负)
export function validateInt (val) {
  var regNum = /^(0|[1-9][0-9]*|-[1-9][0-9]*)$/ // 整数包括正负
  if (regNum.test(val)) {
    return { status: true }
  } else {
    return { status: false, msg: '必须为整数' }
  }
}
// 是否为数字
export function validateNumber (val) {
  var n = Number(val)
  if (!isNaN(n)) {
    return { status: true }
  } else {
    return { status: false, msg: '必须为数字' }
  }
}
// 匹配由数字和26个英文字母组成的字符串
export function validateUpperCaseNumber (str) {
  if (str.length === 0) {
    return { status: false, msg: '不能为空！' }
  }
  var myreg = /[A-Za-z0-9]+$/
  if (!myreg.test(str)) {
    return { status: false, msg: '请输入正确的格式！' }
  }
  return { status: true }
}
// 验证金额
export function validateMoney (obj) {
  var reg = /(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/
  if (!reg.test(obj)) {
    return { status: false, msg: '请输入有效的金额！' }
  }
  return { status: true }
}
// 折扣
export function validateSales (obj) {
  var reg = /^((0\.[1-9]{1})|(([1-9]{1})(\.\d{1,2})?))$/
  if (!reg.test(obj)) {
    return { status: false, msg: '请输入有效的折扣！' }
  }
  return { status: true }
}
// 验证最多保留两位小数的正数
export function validateDecimal (obj) {
  var reg = /^\d+(?:\.\d{1,2})?$/
  if (!reg.test(obj)) {
    return { status: false, msg: '请输入有效的数字！' }
  }
  return { status: true }
}
// 验证最多保留两位小数的正数或负数
export function validateDecimals (obj) {
  var reg = /^([+ -]?(([1-9]\d*)|(0)))([.]\d{0,2})?$/
  if (!reg.test(obj)) {
    return { status: false, msg: '请输入有效的数字！' }
  }
  return { status: true }
}
