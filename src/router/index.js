import { route } from 'quasar/wrappers'
import { createRouter, createMemoryHistory, createWebHistory, createWebHashHistory } from 'vue-router'
import routes from './routes'
import { auth } from 'src/boot/firebase'

/*
 * If not building with SSR mode, you can
 * directly export the Router instantiation;
 *
 * The function below can be async too; either use
 * async/await or return a Promise which resolves
 * with the Router instance.
 */

export default route(function  ({ store, ssrContext }) {
  const createHistory = process.env.SERVER
    ? createMemoryHistory
    : (process.env.VUE_ROUTER_MODE === 'history' ? createWebHistory : createWebHashHistory)

  const Router = createRouter({
    scrollBehavior: (to, from, savedPosition) => {
      if (to.hash) {
        return {
          el: to.hash,
        }
      } else if (savedPosition) {
        return savedPosition
      } else {
        return {left: 0, top: 0}
      }
    },
    routes,

    // Leave this as is and make changes in quasar.conf.js instead!
    // quasar.conf.js -> build -> vueRouterMode
    // quasar.conf.js -> build -> publicPath
    history: createHistory(process.env.MODE === 'ssr' ? void 0 : process.env.VUE_ROUTER_BASE)
  })

  Router.beforeResolve( async (to, from, next) => {
    const isAuth = store.getters['auth/getIsAuth']
    await store.dispatch('auth/checkUser')
    if (to.name === 'ProfileUser' || to.name === 'FeedUser' && !isAuth) {
      next({ name: 'LandingUser', params: to.params })
    } else if (to.name === 'ProfilePost' || to.name === 'FeedPost' && !isAuth) {
      next({ name: 'LandingPost', params: to.params })
    } else if (!to.fullPath.includes('landing') && !to.fullPath.includes('signup') && !isAuth) {
      next({ name: 'PageLanding', query:{ next: to.fullPath}})
    } else if (to.fullPath.includes('landing') && isAuth && to.query) {
      console.log('triggered block: ', to.query)
      next(to.query.next)
    } else if (to.fullPath.includes('landing') && isAuth) {
      console.log('also triggered')
      next({ name: 'PageHome'})
    } else {
      next()
    }
  })

  return Router
})
