const EVENTS = {
  CLICK: 'on-node-click',
  MOUSEOUT: 'on-node-mouseout',
  MOUSEOVER: 'on-node-mouseover',
  DRAGSTART: 'on-node-drag-start',
  DRAGOVER: 'on-node-drag-over',
  DROP: 'on-node-drop'
}

function createListener (handler, data) {
  const execute = (cb, e, ...args) => {
    if (typeof cb === 'function') {
      // fixed bug #48, #73
      const className = e.target && e.target.className
      if (typeof className === 'string' && className.indexOf('org-tree-node-btn') > -1) return

      // eslint-disable-next-line no-useless-call
      cb.apply(null, [e, ...args])
    }
  }

  return function (e) {
    if (Array.isArray(handler)) {
      for (const cb of handler) {
        execute(cb, e, data)
      }
    } else {
      execute(handler, e, data)
    }
  }
}

// 判断是否叶子节点
const isLeaf = (data, prop) => {
  return !(Array.isArray(data[prop]) && data[prop].length > 0)
}

// 创建 node 节点
export function renderNode (h, data, context) {
  const { props } = context
  const cls = ['org-tree-node']
  const childNodes = []
  const children = data[props.props.children]

  if (isLeaf(data, props.props.children)) {
    cls.push('is-leaf')
  } else if (props.collapsable && !data[props.props.expand]) {
    cls.push('collapsed')
  }

  childNodes.push(renderLabel(h, data, context))

  if (!props.collapsable || data[props.props.expand]) {
    childNodes.push(renderChildren(h, children, context))
  }

  return h('div', {
    domProps: {
      className: cls.join(' ')
    }
  }, childNodes)
}

// 创建展开折叠按钮
export function renderBtn (h, data, { props, listeners }) {
  const expandHandler = listeners['on-expand']

  const cls = ['org-tree-node-btn']

  if (data[props.props.expand]) {
    cls.push('expanded')
  }

  return h('span', {
    domProps: {
      className: cls.join(' ')
    },
    on: {
      click: (e) => expandHandler && expandHandler(e, data)
    }
  })
}

// 创建 label 节点
export function renderLabel (h, data, context) {
  const { props, listeners } = context
  const label = data[props.props.label]
  const renderContent = props.renderContent

  // event handlers
  const clickHandler = listeners[EVENTS.CLICK]
  const mouseOutHandler = listeners[EVENTS.MOUSEOUT]
  const mouseOverHandler = listeners[EVENTS.MOUSEOVER]
  const dragStartHandler = listeners[EVENTS.DRAGSTART]
  const dragOverHandler = listeners[EVENTS.DRAGOVER]
  const dropHander = listeners[EVENTS.DROP]

  const childNodes = []
  if (typeof renderContent === 'function') {
    const vnode = renderContent(h, data)

    vnode && childNodes.push(vnode)
  } else {
    childNodes.push(label)
  }

  if (props.collapsable && !isLeaf(data, props.props.children)) {
    childNodes.push(renderBtn(h, data, context))
  }

  const cls = ['org-tree-node-label-inner']
  var { labelWidth, labelClassName, selectedClassName, selectedKey } = props

  if (typeof labelWidth === 'number') {
    labelWidth += 'px'
  }

  if (typeof labelClassName === 'function') {
    labelClassName = labelClassName(data)
  }

  labelClassName && cls.push(labelClassName)

  // add selected class and key from props
  if (typeof selectedClassName === 'function') {
    selectedClassName = selectedClassName(data)
  }

  selectedClassName && selectedKey && data[selectedKey] && cls.push(selectedClassName)

  return h('div', {
    domProps: {
      className: 'org-tree-node-label',
      draggable: true
    },
    on: {
      'dragstart': createListener(dragStartHandler, data),
      'dragover': createListener(dragOverHandler, data),
      'drop': createListener(dropHander, data)
    }
  }, [h('div', {
    domProps: {
      className: cls.join(' ')
    },
    style: { width: labelWidth },
    on: {
      'click': createListener(clickHandler, data),
      'mouseout': createListener(mouseOutHandler, data),
      'mouseover': createListener(mouseOverHandler, data)
    }
  }, childNodes)])
}

// 创建 node 子节点
export function renderChildren (h, list, context) {
  if (Array.isArray(list) && list.length) {
    const children = list.map(item => {
      return renderNode(h, item, context)
    })

    return h('div', {
      domProps: {
        className: 'org-tree-node-children'
      }
    }, children)
  }
  return ''
}

export function render (h, context) {
  const { props } = context

  return renderNode(h, props.data, context)
}

export default render
