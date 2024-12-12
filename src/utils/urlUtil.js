/**
* 对Url的一些处理方法
*/
export const eval2 = fn => {
  var Fun = Function // 一个变量指向Function，防止有些前端编译工具报错
  return new Fun('return ' + fn)()
}

export default {
  /**
  * 获取一个 url 的基本部分，即不包括 hash
  * @param {String} url url
  * @returns {String}
  */
  getBaseUrl: function (url) {
    const hashIndex = url.indexOf('#')
    return hashIndex === -1 ? url.slice(0) : url.slice(0, hashIndex)
  },
  /**
  * 获取 url 的 fragment（即 hash 中去掉 # 的剩余部分）
  * @param {String} url url
  * @returns {String}
  */
  getHashFragment: function (url) {
    const hashIndex = url.indexOf('#')
    return hashIndex === -1 ? '' : url.slice(hashIndex + 1)
  },
  getSearchFragment: function (url) {
    const baseUrl = this.getBaseUrl(url)
    const searchIndex = baseUrl.indexOf('?')
    return searchIndex === -1 ? '' : baseUrl.slice(searchIndex + 1)
  },
  /**
  * 传入对象返回url参数
  * @param {Object} options {a:1}
  * @returns {string}
  */
  getParam (fragment = '', options) {
    for (const k in options) {
      const arg = k
      const val = options[k] !== undefined ? options[k] : ''

      const pattern = arg + '=([^&]*)'
      const replaceText = arg + '=' + val
      fragment = fragment.match(pattern)
        ? fragment.replace(eval2('/(' + arg + '=)([^&]*)/gi'), replaceText)
        : fragment.match('[?]')
          ? fragment + '&' + replaceText
          : fragment + '?' + replaceText
    }
    return fragment
  },
  /**
  * 删除URL参数
  * @param {*} url
  * @param {*} name
  */
  delParam (url, name) {
    let str = ''
    if (url.indexOf('?') !== -1) str = url.substr(url.indexOf('?') + 1)
    else return url
    let arr = ''
    let returnurl = ''
    if (str.indexOf('&') !== -1) {
      arr = str.split('&')
      for (const i in arr) {
        if (arr[i].split('=')[0] !== name) {
          returnurl = returnurl + arr[i].split('=')[0] + '=' + arr[i].split('=')[1] + '&'
        }
      }
      return url.substr(0, url.indexOf('?')) + '?' + returnurl.substr(0, returnurl.length - 1)
    } else {
      arr = str.split('=')
      if (arr[0] === name) return url.substr(0, url.indexOf('?'))
      else return url
    }
  },
  /**
  * 格式化拼装Url参数
  * @param {*} url
  * @param {*} options
  */
  format: function (url, options) {
    const hash = this.getHashFragment(url)
    const baseUrl = this.getBaseUrl(url)
    console.log(hash)
    return this.getParam(baseUrl, options) + (!hash ? '' : '#' + hash)
  },
  /**
  * 格式化拼装hash参数Url
  * @param {*} url
  * @param {*} options
  */
  formatHash: function (url, options) {
    const hash = this.getHashFragment(url)
    const baseUrl = this.getBaseUrl(url)
    const newHash = this.getParam(hash, options)
    return baseUrl + (newHash ? '' + newHash : '')
  },
  /**
  * 给url插入或者修改参数
  * @param {*} url
  * @param {*} name
  * @param {*} value
  */
  append (url, name, value) {
    const options = {}
    options[name] = value
    return this.format(url, options)
  },
  /**
  * 给url hash部分插入或者修改参数
  * @param {*} url
  * @param {*} name
  * @param {*} value
  */
  appendHash (url, name, value) {
    const options = {}
    options[name] = value
    // return this.formatHash(url, options)
    return this.formatHash(this.getHashFragment(url), options)
  },
  /**
  * 删除url参数
  * @param {*} url
  * @param {*} name
  */
  delete (url, name) {
    const hash = this.getHashFragment(url)
    const baseUrl = this.getBaseUrl(url)
    return this.delParam(baseUrl, name) + (!hash ? '' : '#' + hash)
  },
  /**
  * 删除url hash部分参数
  * @param {*} url
  * @param {*} name
  */
  deleteHash (url, name) {
    const hash = this.getHashFragment(url)
    // const baseUrl = this.getBaseUrl(url)
    const newHash = this.delParam(hash, name)
    // return baseUrl + (newHash ? '#' + newHash : '')
    return (newHash ? '#' + newHash : '')
  },
  /**
  * 获取url指定的参数
  * @param {*} url
  * @param {*} variable
  */
  getQueryVariable (url, variable) {
    var query = this.getSearchFragment(url)
    var vars = query.split('&')
    for (var i = 0; i < vars.length; i++) {
      var pair = vars[i].split('=')
      if (pair[0] === variable) {
        return pair[1]
      }
    }
    return false
  },
  /**
  * 获取url hash部分指定的参数
  * @param {*} url
  * @param {*} variable
  */
  getHashQueryVariable (url, variable) {
    var query = this.getHashFragment(url)
    query = query.substring(query.indexOf('?') + 1, query.length)
    var vars = query.split('&')
    for (var i = 0; i < vars.length; i++) {
      var pair = vars[i].split('=')
      if (pair[0] === variable) {
        return pair[1]
      }
    }
    return false
  },
  /**
  * 把一个字符串的 url 转为一个可获取其 base 和 fragment 等的对象
  *
  * @param {String} url url
  * @returns {UrlObject}
  */
  toUrlObject: function (url) {
    const baseUrl = this.getBaseUrl(url)
    const hash = this.getHashFragment(url)
    const search = this.getSearchFragment(url)
    return {
      base: baseUrl,
      original: url,
      search: search,
      hash: hash
    }
  }
}

/**
 * 参数
 */
// var url = 'https://www.dingsky.com/index.html?version=development&templateId=1#/order/2020101523114698396940?shareCode=2020101523160272892';

// // 获取url基本部分，即不包括 hash
// UrlUtil.getBaseUrl(url)  // https://www.dingsky.com/index.html?version=development&templateId=1

// // 获取 url 的基本参数部分
// UrlUtil.getSearchFragment(url)  // version=development&templateId=1

// // 获取 url 的hash部分
// UrlUtil.getHashFragment(url)  // shareCode=2020101523160272892

// // 获取url指定的参数
// UrlUtil.getQueryVariable(url, 'version') // development

// // 获取url hash部分指定的参数
// UrlUtil.getHashQueryVariable(url, 'shareCode') // 2020101523160272892

// // 格式化拼装Url参数
// UrlUtil.format(url, {templateId: 2, a:3, b:4 })  // https://www.dingsky.com/index.html?version=development&templateId=2&a=3&b=4#/order/2020101523114698396940?shareCode=2020101523160272892

// // 格式化拼装hash参数Url
// UrlUtil.formatHash(url, {templateId: 2, a:3, b:4 })  // https://www.dingsky.com/index.html?version=development&templateId=1#/order/2020101523114698396940?shareCode=2020101523160272892&templateId=2&a=3&b=4

// // 给url插入或者修改参数
// UrlUtil.append(url, 'name', 'huihui')  // https://www.dingsky.com/index.html?version=development&templateId=1&name=huihui#/order/2020101523114698396940?shareCode=2020101523160272892

// // 给url hash部分插入或者修改参数
// UrlUtil.appendHash(url, 'name', 'huihui')  // https://www.dingsky.com/index.html?version=development&templateId=1#/order/2020101523114698396940?shareCode=2020101523160272892&name=huihui

// // 删除url参数
// UrlUtil.delete(url, 'templateId')  // https://www.dingsky.com/index.html?version=development#/order/2020101523114698396940?shareCode=2020101523160272892

// // 删除url hash部分参数
// UrlUtil.deleteHash(url, 'shareCode')  // https://www.dingsky.com/index.html?version=development&templateId=1#/order/2020101523114698396940

