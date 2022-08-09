import { store } from 'quasar/wrappers'
import { createStore } from 'vuex'
import global from 'src/store/global/index.js'
import newPost from 'src/store/newPost/index.js'
import auth from 'src/store/auth/index.js'
import folder from 'src/store/folder/index.js'
import profile from 'src/store/profile/index.js'
import comments from 'src/store/comments/index.js'
import feed from 'src/store/feed/index.js'
import notifications from 'src/store/notifications/index.js'
import users from 'src/store/users/index.js'
import posts from 'src/store/posts/index.js'
import products from 'src/store/products/index.js'
import subscriptions from 'src/store/subscriptions/index.js'
import admin from 'src/store/admin/index.js'
import amplitude from 'src/store/amplitude/index.js'

// import example from './module-example'
/*
 * If not building with SSR mode, you can
 * directly export the Store instantiation;
 *
 * The function below can be async too; either use
 * async/await or return a Promise which resolves
 * with the Store instance.
 */

export default store(function (/* { ssrContext } */) {
  const Store = createStore({
    modules: {
      // example
      global,
      newPost,
      auth,
      folder,
      profile,
      comments,
      feed,
      notifications,
      users,
      posts,
      products,
      subscriptions,
      admin,
      amplitude
    },
    // enable strict mode (adds overhead!)
    // for dev mode and --debug builds only
    strict: process.env.DEBUGGING
  })

  return Store
})
