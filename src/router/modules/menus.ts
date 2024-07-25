const Layout = () => import('@/layout/index.vue')
export const menus = [
  {
    path: '/',
    name: 'Home',
    component: Layout,
    redirect: '/index',
    children: [
      {
        path: '/index',
        name: 'Index',
        component: () => import('@/views/system/index.vue')
      },
      {
        path: '/songList/:id',
        name: 'SongList',
        component: () => import('@/views/system/songList.vue')
      }
      // {
      //   path: '/:pathMatch(.*)*',
      //   name: '404',
      //   // component: () => import('@/views/system/404.vue')
      // }
    ]
  },
  // {
  //   path: '/login',
  //   name: '登录',
  //   // component: () => import('@/views/system/login.vue')
  // }
  // {
  //   path: '/:pathMatch(.*)*',
  //   name: '404',
  //   component: () => import('@/views/system/404.vue')
  // },
]
