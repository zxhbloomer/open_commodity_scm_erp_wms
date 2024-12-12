/* Layout */
import Layout from '@/layout'

/**
 * 顶部导航栏
 */
export const topNav = [
  {
    nav_path: '01',
    index: '1',
    type: 'T',
    meta: {
      icon: 'chart',
      name: '工作台'
    }
  },
  {
    nav_path: '02',
    index: '2',
    type: 'T',
    meta: {
      icon: 'inandout',
      name: '入出库管理'
    }
  },
  {
    nav_path: '03',
    index: '3',
    type: 'T',
    meta: {
      icon: 'inventory',
      name: '库存管理'
    }
  },
  {
    nav_path: '04',
    index: '4',
    type: 'T',
    meta: {
      icon: 'getinventory',
      name: '库存查询'
    }
  },
  {
    nav_path: '05',
    index: '5',
    type: 'T',
    meta: {
      icon: '系统管理',
      name: '系统管理'
    }
  }
]

// 第一个导航栏菜单
export const router_one = [
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    name: 'P00000001', // 设定路由的名字，一定要填写不然使用<keep-alive>时会出现各种问题
    children: [
      {
        path: 'dashboard',
        component: () => import('@/views/01_dashboard/index'),
        name: 'Dashboard',
        meta: { title: '我是1', icon: 'dashboard', affix: true, fulltitle: ['我是11'] }
      }
    ]
  }
]

// 第二个导航栏菜单
export const router_two = [
  {
    path: '',
    // component: subMenu,
    redirect: 'noRedirect',
    // name: 'M00000040', // 设定路由的名字，一定要填写不然使用<keep-alive>时会出现各种问题
    alwaysShow: true,
    meta: {
      title: '入库管理',
      icon: 'in',
      noCache: true
    },
    children: [
      {
        path: '/wms/relation',
        component: () => import('@/views/20_master/relation/relation'),
        name: 'P10000210',
        meta: { title: '仓库分组', icon: 'inplan' }
      },
      {
        path: '/wms/group',
        component: () => import('@/views/40_business/warehousegroup'),
        name: 'P10000220',
        meta: { title: '分组', icon: 'inplan' }
      },
      {
        path: '/query/inventory',
        component: () => import('@/views/50_query/inventory_detail'),
        name: 'P10000110',
        meta: { title: '库存明细查询', icon: 'inplan' }
      },
      {
        path: '/query/inventory/owner_goods',
        component: () => import('@/views/50_query/inventory_owner_goods'),
        name: 'P10000210',
        meta: { title: '货主库存查询', icon: 'inplan' }
      },
      {
        path: '/sys/schedule',
        component: () => import('@/views/10_system/schedule/schedule'),
        name: 'P10000010',
        meta: { title: '定时任务', icon: 'inplan' }
      },
      {
        path: '/in/plan',
        component: () => import('@/views/40_business/inplan/index'),
        name: 'P00000010',
        meta: { title: '入库计划', icon: 'inplan' }
      },

      {
        path: '/in/bill',
        component: () => import('@/views/40_business/in/index'),
        name: 'P00000011',
        meta: { title: '入库单', icon: 'in' }
      },
      {
        path: '/inandout/inorder',
        component: () => import('@/views/40_business/inorder/inorder'),
        name: 'P00000051',
        meta: { title: '收货确认单', icon: 'in' }
      }
    ]
  },
  {
    path: '',
    // component: subMenu,
    redirect: 'noRedirect',
    // name: 'M00000050', // 设定路由的名字，一定要填写不然使用<keep-alive>时会出现各种问题
    alwaysShow: true,
    meta: {
      title: '出库管理',
      icon: 'out',
      noCache: true
    },
    children: [
      {
        path: '/out/plan',
        component: () => import('@/views/40_business/outplan/index'),
        name: 'P00000013',
        meta: { title: '出库计划', icon: 'outplan' }
      },
      {
        path: '/out/bill',
        component: () => import('@/views/40_business/out/index'),
        name: 'P00000014',
        meta: { title: '出库单', icon: 'warehoueout' }
      }
    ]
  },
  {
    path: '',
    // component: subMenu,
    redirect: 'noRedirect',
    // name: 'M00000050', // 设定路由的名字，一定要填写不然使用<keep-alive>时会出现各种问题
    alwaysShow: true,
    meta: {
      title: '订单管理',
      icon: 'order',
      noCache: true
    },
    children: [
      {
        path: '/in/order',
        component: () => import('@/views/40_business/inorder/inorder'),
        name: 'P00000012',
        meta: { title: '入库订单管理', icon: 'in' }
      }
    ]
  }

]

// 第三个导航栏菜单
export const router_three = [
  {
    path: '',
    // component: subMenu,
    redirect: 'noRedirect',
    // name: 'M00000060', // 设定路由的名字，一定要填写不然使用<keep-alive>时会出现各种问题
    alwaysShow: true,
    meta: {
      title: '库存管理',
      icon: 'inventory',
      noCache: true
    },
    children: [
      {
        path: '/inventory/inventory',
        component: () => import('@/views/40_business/inventory/inventory'),
        name: 'P00000016',
        meta: { title: '库存管理', icon: 'inventory2' }
      }
    ]
  }
]

// 第四个导航栏菜单
export const router_four = [
  {
    path: '',
    // component: subMenu,
    redirect: 'noRedirect',
    // name: 'M00000060', // 设定路由的名字，一定要填写不然使用<keep-alive>时会出现各种问题
    alwaysShow: true,
    meta: {
      title: '库存查询',
      icon: 'getinventory',
      noCache: true
    },
    children: [
      {
        path: '/inventory/inventory',
        component: () => import('@/views/40_business/inventory/inventory'),
        name: 'P00000017',
        meta: { title: '库存查询', icon: 'inventory2' }
      }
    ]
  }
]

// 第五个导航栏菜单
export const router_five = [
  {
    path: '',
    component: Layout,
    redirect: 'noRedirect',
    alwaysShow: true,
    meta: {
      title: '组织机构管理',
      icon: 'tree',
      noCache: true
    },
    children: [
      {
        path: '/org/orginfo',
        component: () => import('@/views/20_master/org/org'),
        name: 'P00000018', // 设定路由的名字，一定要填写不然使用<keep-alive>时会出现各种问题
        meta: { title: '组织机构维护', icon: 'orginfo' }
      },
      {
        path: '/org/group',
        component: () => import('@/views/20_master/group/group'),
        name: 'P00000019', // 设定路由的名字，一定要填写不然使用<keep-alive>时会出现各种问题
        meta: { title: '集团信息维护', icon: 'group' }
      },
      {
        path: '/org/company',
        component: () => import('@/views/20_master/company/company'),
        name: 'P00000020', // 设定路由的名字，一定要填写不然使用<keep-alive>时会出现各种问题
        meta: { title: '企业信息维护', icon: 'company' }
      },
      {
        path: '/org/dept',
        component: () => import('@/views/20_master/dept/dept'),
        name: 'P00000021', // 设定路由的名字，一定要填写不然使用<keep-alive>时会出现各种问题
        meta: { title: '部门信息维护', icon: 'dept' }
      },
      {
        path: '/org/position',
        component: () => import('@/views/20_master/position/position'),
        name: 'P00000022', // 设定路由的名字，一定要填写不然使用<keep-alive>时会出现各种问题
        meta: { title: '岗位信息维护', icon: 'position' }
      },
      {
        path: '/org/staff',
        component: () => import('@/views/20_master/staff/staff'),
        name: 'P00000023', // 设定路由的名字，一定要填写不然使用<keep-alive>时会出现各种问题
        meta: { title: '员工管理维护', icon: 'staff' }
      }
    ]
  },
  {
    path: '',
    component: Layout,
    redirect: 'noRedirect',
    alwaysShow: true,
    meta: {
      title: '基础数据管理',
      icon: 'tree',
      noCache: true
    },
    children: [
      {
        path: '',
        component: Layout,
        redirect: 'noRedirect',
        alwaysShow: true,
        meta: {
          title: '仓库数据维护',
          icon: 'warehouse',
          noCache: true
        },
        children: [
          {
            path: '/master/warehouse',
            component: () => import('@/views/30_wms/warehouse/warehouse'),
            name: 'P00000025', // 设定路由的名字，一定要填写不然使用<keep-alive>时会出现各种问题
            meta: { title: '仓库管理', icon: 'warehouse' }
          },
          {
            path: '/master/location',
            component: () => import('@/views/30_wms/location/location'),
            name: 'P00000026', // 设定路由的名字，一定要填写不然使用<keep-alive>时会出现各种问题
            meta: { title: '库区管理', icon: 'location' }
          },
          {
            path: '/master/bin',
            component: () => import('@/views/30_wms/bin/bin'),
            name: 'P00000027', // 设定路由的名字，一定要填写不然使用<keep-alive>时会出现各种问题
            meta: { title: '库位管理', icon: 'bin' }
          }
        ]
      },
      {
        path: '',
        // component: subMenu,
        redirect: 'noRedirect',
        name: 'M00000020', // 设定路由的名字，一定要填写不然使用<keep-alive>时会出现各种问题
        alwaysShow: true,
        meta: {
          title: '物料数据维护',
          icon: 'goods',
          noCache: true
        },
        children: [
          {
            path: '/master/businesstype',
            component: () => import('@/views/30_wms/businesstype/businesstype'),
            name: 'P00000028',
            meta: { title: '板块管理', icon: 'businesstype' }
          },
          {
            path: '/master/industry',
            component: () => import('@/views/30_wms/industry/industry'),
            name: 'P00000029',
            meta: { title: '行业管理', icon: 'industry' }
          },
          {
            path: '/master/category',
            component: () => import('@/views/30_wms/category/category'),
            name: 'P00000030',
            meta: { title: '类别管理', icon: 'category' }
          },
          {
            path: '/master/goods',
            component: () => import('@/views/30_wms/goods/goods'),
            name: 'P00000031',
            meta: { title: '物料管理', icon: 'goods' }
          },
          {
            path: '/master/spec',
            component: () => import('@/views/30_wms/spec/spec'),
            name: 'P00000032',
            meta: { title: '规格管理', icon: 'spec' }
          }
        ]
      },
      {
        path: '',
        // component: subMenu,
        redirect: 'customer',
        name: 'M00000003', // 设定路由的名字，一定要填写不然使用<keep-alive>时会出现各种问题
        alwaysShow: true,
        meta: {
          title: '客户数据维护',
          icon: 'customer',
          noCache: true
        },
        children: [
          {
            path: '/master/customer',
            component: () => import('@/views/30_wms/customer/customer'),
            name: 'P00000033',
            meta: { title: '客户管理', icon: 'customer' }
          },
          {
            path: '/master/owner',
            component: () => import('@/views/30_wms/owner/owner'),
            name: 'P00000053',
            meta: { title: '货主管理', icon: 'customer' }
          }
        ]
      },
      {
        path: '/master/customer',
        component: () => import('@/views/30_wms/customer/customer'),
        name: 'P00000034',
        meta: { title: '板块数据维护', icon: 'customer' }
      }
    ]
  },
  {
    path: '',
    // component: subMenu,
    redirect: 'noRedirect',
    // name: 'M00000020', // 设定路由的名字，一定要填写不然使用<keep-alive>时会出现各种问题
    alwaysShow: true,
    meta: {
      title: '字典数据管理',
      icon: '字典数据管理',
      noCache: true
    },
    children: [
      {
        path: '/dic/dicttype',
        component: () => import('@/views/10_system/dicttype/dicttype'),
        name: 'P00000035',
        meta: { title: '字典类型维护', closable: false }
      },
      {
        path: '/dic/dictdata',
        component: () => import('@/views/10_system/dictdata/dictdata'),
        name: 'P00000036',
        meta: { title: '字典数据维护', closable: true }
      }
    ]
  },
  {
    path: '',
    // component: subMenu,
    redirect: 'noRedirect',
    // name: 'M00000020', // 设定路由的名字，一定要填写不然使用<keep-alive>时会出现各种问题
    alwaysShow: true,
    meta: {
      title: '系统参数管理',
      icon: '系统参数管理',
      noCache: true
    },
    children: [
      {
        path: '/config',
        component: () => import('@/views/10_system/config/config'),
        name: 'P00000037',
        meta: { title: '系统参数', icon: 'config' }
      },
      {
        path: '/syscode',
        component: () => import('@/views/00_platform/syscode/syscode'),
        name: 'P00000038',
        meta: { title: '系统编码管理', icon: 'syscode' }
      }
    ]
  },
  {
    path: '',
    component: Layout,
    redirect: 'noRedirect',
    alwaysShow: true,
    meta: {
      title: '权限管理',
      icon: '权限管理',
      noCache: true
    },
    children: [
      {
        path: 'dept',
        component: () => import('@/views/20_master/permission/dept/permission_dept'),
        name: 'P00000039',
        meta: { title: '部门权限维护', icon: 'permission' }
      },
      {
        path: 'authorize',
        component: () => import('@/views/20_master/authorize/authorize'),
        name: 'P00000254',
        meta: { title: '岗位角色', icon: 'permission' }
      },
      {
        path: 'fun',
        // component: subMenu,
        redirect: 'noRedirect',
        alwaysShow: true,
        meta: { title: '基础数据', icon: 'setting', noCache: true },
        children: [
          {
            path: '/funs',
            component: () => import('@/views/10_system/pages/function/function'),
            name: 'P00000040',
            meta: { title: '按钮维护' }
          },
          {
            path: '/pages',
            component: () => import('@/views/10_system/pages/page/page'),
            name: 'P00000041',
            meta: { title: '页面维护' }
          },
          {
            path: '/page_fun',
            component: () => import('@/views/10_system/pages/page_function/page_function'),
            name: 'P00000042',
            meta: { title: '页面按钮维护' }
          },
          {
            path: '/menus',
            component: () => import('@/views/20_master/menus/menu'),
            name: 'P00000043',
            meta: { title: '菜单维护' }
          }
        ]
      },
      {
        path: '/permission',
        component: () => import('@/views/20_master/permission/role/permission_role'),
        name: 'P00000044',
        meta: { title: '权限设置', icon: 'permission' }
      },
      {
        path: '/role',
        component: () => import('@/views/10_system/role/role'),
        name: 'P00000045',
        meta: { title: '角色管理', icon: 'permission' }
      },
      {
        path: '/dept',
        component: () => import('@/views/20_master/permission/dept/permission_dept'),
        name: 'P00000046',
        meta: { title: '授权管理', icon: 'permission' }
      }

    ]
  },
  {
    path: '',
    // component: subMenu,
    redirect: 'noRedirect',
    // name: 'M00000020', // 设定路由的名字，一定要填写不然使用<keep-alive>时会出现各种问题
    alwaysShow: true,
    meta: {
      title: '日志管理',
      icon: '日志管理',
      noCache: true
    },
    children: [
      {
        path: '/config',
        component: () => import('@/views/10_system/config/config'),
        name: 'P00000047',
        meta: { title: '操作日志查询', icon: '操作日志查询' }
      },
      {
        path: '/syscode',
        component: () => import('@/views/00_platform/syscode/syscode'),
        name: 'P00000048',
        meta: { title: 'api接口日志查询', icon: 'api接口日志查询' }
      },
      {
        path: '/syscode',
        component: () => import('@/views/00_platform/syscode/syscode'),
        name: 'P00000049',
        meta: { title: '系统日志查询', icon: '系统日志查询' }
      }
    ]
  },
  {
    path: '',
    // component: subMenu,
    redirect: 'noRedirect',
    // name: 'M00000020', // 设定路由的名字，一定要填写不然使用<keep-alive>时会出现各种问题
    alwaysShow: true,
    meta: {
      title: '其他管理',
      icon: '其他管理',
      noCache: true
    },
    children: [
      {
        path: '',
        component: () => import('@/views/00_platform/syscode/syscode'),
        name: 'P00000050',
        meta: { title: '系统图标', icon: '系统图标' }
      }
    ]
  }
]

/**
 * 每个导航栏中的数据
 */
export const asyncRoutesArray = [[...router_one], [...router_two], [...router_three], [...router_four], [...router_five]]
export const asyncRoutesAll = [...router_one, ...router_two, ...router_three, ...router_four, ...router_five]

