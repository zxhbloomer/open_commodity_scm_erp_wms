'use strict'

import { Loading } from 'element-ui'
import { isNotEmpty } from '@/utils/index.js'
import store from '@/store'

// exports.install = function(Vue, options) {

export default {
  install (Vue, options) {
    /** 获取页面的size */
    Vue.prototype.getSize = function () {
      return this.$store.getters.size
    }
    /** 对齐 */
    Vue.prototype.getLabelPosition = function () {
      return 'right'
    }
    /** 弹出错误框
   *
   * element-ui定义
   *
  Vue.prototype.$loading = Loading.service;
  Vue.prototype.$msgbox = MessageBox;
  Vue.prototype.$alert = MessageBox.alert;
  Vue.prototype.$confirm = MessageBox.confirm;
  Vue.prototype.$prompt = MessageBox.prompt;
  Vue.prototype.$notify = Notification;
  Vue.prototype.$message = Message;

   *
   *
   */
    /**
   * 显示错误的信息
   */
    Vue.prototype.showErrorMsg = function (message, error) {
      let showMsg = message
      if (isNotEmpty(error)) {
        showMsg = showMsg + ' : ' + error
      }
      new Vue().$msgbox({
        title: '错误',
        message: showMsg,
        showCancelButton: false,
        confirmButtonText: '确定',
        type: 'error'
      }).then(function () {
        return
      }).catch(function () {
        return
      })
    }
    /** 弹出Alert 警告 */
    Vue.prototype.showErrorMsgAlert = function (message) {
      new Vue().$message({
        message: message,
        type: 'error',
        duration: 8 * 1000
      })
    }

    /** 截取字符串 */
    Vue.prototype.truncateString = function (str, num) {
      return str.length > num ? str.slice(0, num > 3 ? num - 3 : num) + '...' : str
    }

    /** loading打开 */
    Vue.prototype.showLoading = function (msg) {
      Loading.service({ fullscreen: true, text: msg, lock: true, background: 'rgba(255, 255, 255, 0.7)' })
    }

    /** loading关闭 */
    Vue.prototype.closeLoading = function () {
      Loading.service().close()
    }

    /** format currency：货币格式化----https://www.icode9.com/content-4-187747.html */
    Vue.prototype.formatCurrency = function (data, decimal = false, decimalDigits = 2, currency = 'CNY') {
      if (data === null) {
        return null
      } else {
        return data.toLocaleString('zh-CN', {
          style: 'currency',
          currency,
          minimumFractionDigits: decimal ? decimalDigits : 0
        })
      }
    }

    /** 数字格式化 */
    Vue.prototype.formatNumber = function (data, decimal = false, decimalDigits = 2) {
      if (data === null) {
        return null
      } else {
        return data.toLocaleString('zh-CN', {
          style: 'decimal',
          minimumFractionDigits: decimal ? decimalDigits : 0,
          maximumFractionDigits: 4
        })
      }
    }
    /** 数字格式化 */
    Vue.prototype.formatNumberTwo = function (data, decimal = false, decimalDigits = 2) {
      if (data === null) {
        return null
      } else {
        return data.toLocaleString('zh-CN', {
          style: 'decimal',
          minimumFractionDigits: decimal ? decimalDigits : 0,
          maximumFractionDigits: 2
        })
      }
    }
    /** 数字格式化 */
    Vue.prototype.formatNumber3 = function (data) {
      if (data === null) {
        return null
      } else {
        return data.toLocaleString('zh-CN', {
          style: 'decimal',
          minimumFractionDigits: 3,
          maximumFractionDigits: 3
        })
      }
    }

    /** 百分比格式化 */
    Vue.prototype.formatPercent = function (data, decimal = false, decimalDigits = 2) {
      if (data === null) {
        return null
      } else {
        return data.toLocaleString('zh-CN', {
          style: 'percent',
          minimumFractionDigits: decimal ? decimalDigits : 0
        })
      }
    }
    /** 日期格式化----https://github.com/tolking/blog/blob/cd9e1dd3024f19529434a6e1f59a2192d5020119/blog/posts/toLocaleString.md
   * date.toLocaleString('zh-CN', { dateStyle: 'long' })  // "2019年12月6日"
   * date.toLocaleString('zh-CN', { hour12: false }) // "2019/12/6 11:35:00"
   */
    Vue.prototype.formatDate = function (data, type = 1) {
      if (data === null) {
        return null
      } else {
        let rtn
        const _date = new Date(Date.parse(data))
        switch (type) {
          case 1:
            var _year = _date.toLocaleString('zh-CN', { year: 'numeric' })
            var _month = _date.toLocaleString('zh-CN', { month: '2-digit' })
            var _day = _date.toLocaleString('zh-CN', { day: '2-digit' })
            rtn = _year + _month + _day
            break
          case 2:
            var options = { year: 'numeric', month: '2-digit', day: '2-digit' }
            rtn = _date.toLocaleString('zh-CN', options)
            break
          case 3:
            var options1 = { year: 'numeric', month: '2-digit', day: '2-digit' }
            rtn = _date.toLocaleString('zh-CN', options1).replace(/\//g, '-')
            break
          default:
            rtn = _date.toLocaleString('zh-CN', { dateStyle: 'long' })
            break
        }
        return rtn
      }
    }
    Vue.prototype.formatTime = function (data) {
      if (data === null) {
        return null
      } else {
        const _date = new Date(Date.parse(data))
        return _date.toLocaleTimeString()
      }
    }
    Vue.prototype.formatDateTime = function (data, type = 1) {
      if (data === null) {
        return null
      } else {
        return this.formatDate(data, type) + ' ' + this.formatTime(data)
      }
    }

    /**
     * 递归查找json中的值
     * @param {*} obj json对象
     * @param {*} key json中的field
     * @param {*} val json中的value
     * @param {*} ignoreSubObject 忽略json中子对象object，暂且支持子对象忽略
     */
    Vue.prototype.getJsonObjects = function (obj, key, val, ignoreSubObject) {
      var objects = []
      for (var i in obj) {
        if (!obj.hasOwnProperty(i)) {
          continue
        }
        if (typeof obj[i] === 'object') {
          if (i === ignoreSubObject && obj[i] && obj[i].length > 0) {
            // 忽略子对象
            continue
          } else {
            if (i === key && obj[i].length > 0) {
              objects = [...obj[i]]
            }
            objects = objects.concat(Vue.prototype.getJsonObjects(obj[i], key, val, ignoreSubObject))
          }
        } else {
          // if key matches and value matches or if key matches and value is not passed (eliminating the case where key matches but passed value does not)
          if (i === key && obj[i] === val || i === key && val === '') { //
            objects.push(obj)
          } else if (obj[i] === val && key === '') {
            // only add if the object is not already in the array
            if (objects.lastIndexOf(obj) === -1) {
              objects.push(obj)
            }
          }
        }
      }
      return objects
    }

    /**
     * https://gist.github.com/YagoLopez/1c2fe87d255fc64d5f1bf6a920b67484
     *
     * 递归查找json中的值
     * @param {*} obj json对象
     * @param {*} keyField key field
     * @param {*} valueField 查询的ValueField
     * @param {*} ignoreSubObject 忽略json中子对象object，暂且支持子对象忽略
     */
    Vue.prototype.getJsonObjectsKeyFiledAndValueField = function (obj, keyField, valueField, ignoreSubObject) {
      var objects = []
      for (var i in obj) {
        if (!obj.hasOwnProperty(i)) {
          continue
        }
        if (typeof obj[i] === 'object') {
          if (i === ignoreSubObject && obj[i] && obj[i].length > 0) {
            // 忽略子对象
            continue
          } else {
            objects = objects.concat(Vue.prototype.getJsonObjectsKeyFiledAndValueField(obj[i], keyField, valueField, ignoreSubObject))
          }
        } else {
          // if key matches and value matches or if key matches and value is not passed (eliminating the case where key matches but passed value does not)
          if (i === valueField) {
            const _data = { id: obj[keyField] }
            _data[valueField] = obj[valueField]
            objects.push(_data)
          }
        }
      }
      return objects
    }

    /**
     * 递归设置json中的值
     * @param {*} obj json对象
     * @param {*} key json中的field
     * @param {*} val json中的value
     * @param {*} ignoreSubObject 忽略json中子对象object，暂且支持子对象忽略
     */
    Vue.prototype.setFieldValue2JsonObjects = function (obj, key, val, ignoreSubObject) {
      for (var i in obj) {
        if (!obj.hasOwnProperty(i)) {
          continue
        }
        if (typeof obj[i] === 'object') {
          if (i === ignoreSubObject && obj[i] && obj[i].length > 0) {
            continue
          } else {
            Vue.prototype.setFieldValue2JsonObjects(obj[i], key, val, ignoreSubObject)
          }
        } else {
          // 递归找到元素后设置值
          if (i === key) {
            obj[i] = val
          }
        }
      }
    }

    /**
     * 查找所有父节点数据，并返回
     *
     * @param {*} idField         id 属性字段名称
     * @param {*} parentIdField   parent_id 属性字段名称
     * @param {*} node            结点数据
     * @param {*} tree            父节点数据
     * @param {*} parentNodes
     * @param {*} index
     */
    Vue.prototype.findAllParent = function (idField, parentIdField, node, tree, parentNodes = [], index = 0) {
      if (!node || node.parent_id === 0) {
        return
      }
      Vue.prototype.findParent(idField, parentIdField, node, parentNodes, tree)
      const parntNode = parentNodes[index]
      Vue.prototype.findAllParent(idField, parentIdField, parntNode, tree, parentNodes, ++index)
      return parentNodes
    }

    /**
     * 查找父节点数据，并返回
     *
     * @param {*} idField        id 属性字段名称
     * @param {*} parentIdField  parent_id 属性字段名称
     * @param {*} node           结点数据
     * @param {*} parentNodes    父节点数据
     * @param {*} tree           树数据
     */
    Vue.prototype.findParent = function (idField, parentIdField, node, parentNodes, tree) {
      for (let i = 0; i < tree.length; i++) {
        const item = tree[i]
        if (item[idField] === node[parentIdField]) {
          parentNodes.push(item)
          return
        }
        if (item.children && item.children.length > 0) {
          Vue.prototype.findParent(idField, parentIdField, node, parentNodes, item.children)
        }
      }
    }

    /**
     *
     * 树中，点击某一节点
     *  true（选中）：找到父节点、祖父节点设置相应的true
     *  false（未选中）：找到父节点，循环子节点，查看是否有选中的数据，如果有，父节点为true，如果没有，父节点false
     *
     * @param {*} checked_value    是否选中的值：true（选中），false（未选中）
     * @param {*} idField          主键字段
     * @param {*} parentIdField    父亲节点主键字段
     * @param {*} isEnableField    选中字段
     * @param {*} node             当前结点
     * @param {*} jsonData         整体结点数据
     * @param {*} ignoreSubObject  忽略的对象
     */
    Vue.prototype.setParentNodeIsEnable = function (checked_value, idField, parentIdField, isEnableField, node, jsonData, ignoreSubObject) {
      // 如果选中状态为true，查找所有父节点数据，设置为true
      if (checked_value) {
        this.findAllParentAndSetData(idField, parentIdField, isEnableField, checked_value, node, jsonData)
      } else {
        // 获取所有的父节点和祖父节点
        const parentNodes = this.findAllParent(idField, parentIdField, node, jsonData)
        for (let i = 0; i < parentNodes.length; i++) {
          const items = parentNodes[i]
          if (items.children.length > 0) {
            const bro = this.getJsonObjects(items.children, isEnableField, true, ignoreSubObject)
            if (bro.length === 0) {
              items.is_enable = false
            }
          } else {
            continue
          }
        }
      }
    }

    /**
     * 查找所有父节点数据，设置data
     * 例如：this.findAllParentAndSetData('menu_id', 'parent_id', 'is_enable', val, row, this.dataJson.listData)
     *
     * @param {*} idField         id 属性字段名称
     * @param {*} parentIdField   parent_id 属性字段名称
     * @param {*} setDataField    需要设置值的field 属性
     * @param {*} setDataValue    值
     * @param {*} node            结点数据
     * @param {*} tree            父节点数据
     * @param {*} parentNodes
     * @param {*} index
     */
    Vue.prototype.findAllParentAndSetData = function (idField, parentIdField, setDataField, setDataValue, node, tree, parentNodes = [], index = 0) {
      if (!node || node.parent_id === 0) {
        return
      }
      Vue.prototype.findParentAndSetData(idField, parentIdField, setDataField, setDataValue, node, parentNodes, tree)
      const parntNode = parentNodes[index]
      Vue.prototype.findAllParentAndSetData(idField, parentIdField, setDataField, setDataValue, parntNode, tree, parentNodes, ++index)
      return parentNodes
    }

    /**
     * 查找父节点数据，设置data
     *
     * @param {*} idField        id 属性字段名称
     * @param {*} parentIdField  parent_id 属性字段名称
     * @param {*} node           结点数据
     * @param {*} parentNodes    父节点数据
     * @param {*} tree           树数据
     */
    Vue.prototype.findParentAndSetData = function (idField, parentIdField, setDataField, setDataValue, node, parentNodes, tree) {
      for (let i = 0; i < tree.length; i++) {
        const item = tree[i]
        if (item[idField] === node[parentIdField]) {
          parentNodes.push(item)
          // 找到了数据，开始设置值
          item[setDataField] = setDataValue
          return
        }
        if (item.children && item.children.length > 0) {
          Vue.prototype.findParentAndSetData(idField, parentIdField, setDataField, setDataValue, node, parentNodes, item.children)
        }
      }
    }

    /**
     * 查找权限是否存在
     * @param {*} operation_perm
     * @returns
     */
    Vue.prototype.getOperaPerm = function (operation_perm) {
      const userPermissionDataOperations = store.getters && store.getters.userPermissionData.permission_operation
      const hasPermission = userPermissionDataOperations.find(item => item.operation_perms === operation_perm)
      // 查找权限是否在操作数据中存在
      if (!hasPermission) {
        return false
      } else {
        return true
      }
    }

    /**
     * 触发resize
     * @returns
     */
    Vue.prototype.$triggerResize = function () {
      this.$nextTick(() => {
        var resizeEvent = window.document.createEvent('UIEvents')
        resizeEvent.initUIEvent('resize', true, false, window, 0)
        window.dispatchEvent(resizeEvent)
      })
    }
  }
}
