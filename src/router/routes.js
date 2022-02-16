import MainLayout from 'src/layouts/MainLayout.vue'
import PageHome from 'src/pages/PageHome.vue'
import PageSearch from 'src/pages/PageSearch.vue'
import PageActivity from 'src/pages/PageActivity.vue'
import PageProfile from 'src/pages/PageProfile.vue'
import PageProfileEdit from 'src/pages/PageProfileEdit.vue'
import PageError404 from 'src/pages/PageError404.vue'
import PagePost from 'src/pages/PagePost.vue'
import PagePostNewTitle from 'src/pages/PagePostNewTitle.vue'
import PagePostNewContent from 'src/pages/PagePostNewContent.vue'
import PagePostDrafts from 'src/pages/PagePostDrafts.vue'
import ImageCropper from 'src/components/ImageCropper.vue'

import HeaderHomeSmall from 'src/components/HeaderHomeSmall.vue'
import HeaderPost from 'src/components/HeaderPost.vue'
import HeaderActivity from 'src/components/HeaderActivity.vue'
import HeaderProfile from 'src/components/HeaderProfile.vue'
import HeaderProfileEdit from 'src/components/HeaderProfileEdit.vue'
import HeaderPostNewTitle from 'src/components/HeaderPostNewTitle.vue'
import HeaderPostNewContent from 'src/components/HeaderPostNewContent.vue'
import HeaderPostDrafts from 'src/components/HeaderPostDrafts.vue'

// Delete after test

const routes = [
  {
    path: '/',
    component: MainLayout,
    children: [
      { path: '', components: {default: PageHome, header: HeaderHomeSmall}, name: 'PageHome' },
      { path: '/search', component: PageSearch, name: 'PageSearch' },
      { path: '/new-post/drafts', components: { default: PagePostDrafts, header: HeaderPostDrafts }, name: 'PagePostDrafts' },
      { path: '/new-post/title', components: {default: PagePostNewTitle, header: HeaderPostNewTitle}, name: 'PagePostNewTitle',  },
      { path: '/new-post/content', components: {default: PagePostNewContent, header: HeaderPostNewContent}, name: 'PagePostNewContent', children: [
        { path: '/new-post/content/cropper', component: ImageCropper, name: 'ImageCropper' }
      ] },
      { path: '/activity', components: {default: PageActivity, header: HeaderActivity}, name: 'PageActivity' },
      { path: '/profile', components: {default: PageProfile, header: HeaderProfile}, name: 'PageProfile' },
      { path: '/profile/edit', components: {default: PageProfileEdit, header: HeaderProfileEdit}, name: 'PageProfileEdit' },
      { path: '/post', components: {default: PagePost, header: HeaderPost}, name: 'Post' }
    ]
  },

  {
    path: '/drafts',
    component: () => import('pages/PagePostDrafts.vue')
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: PageError404
  }
]

export default routes
