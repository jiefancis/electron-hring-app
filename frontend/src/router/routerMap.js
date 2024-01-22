/**
 * 基础路由
 * @type { *[] }
 */

const constantRouterMap = [
  {
    path: '/',
    redirect: {name: 'Login'}
  },
  {
    path: '/Login',
    name: 'Login',
    // redirect: { name: 'ExampleHelloIndex' },
    component: () => import('~/views/Login/index.vue')
  },
  {
    path: '/Home',
    name: 'Home',
    // redirect: { name: 'ExampleHelloIndex' },
    component: () => import('~/views/HomePage/index.vue')
  },
]

export default constantRouterMap