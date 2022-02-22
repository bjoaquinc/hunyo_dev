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
import PostsList from 'src/components/PostsList.vue'


const routes = [
  {
    path: '/',
    component: MainLayout,
    children: [
      { path: '/', component: PageHome, children: [
        { path: '', component: PostsList, name: 'PageHome' },
        { path: '/posts/:postId', component: PagePost, name: 'PagePost', props: true }
      ] },
      { path: '/search', component: PageSearch, name: 'PageSearch' },
      { path: '/new-post/drafts', component: PagePostDrafts, name: 'PagePostDrafts' },
      { path: '/new-post/title', component: PagePostNewTitle, name: 'PagePostNewTitle',  },
      { path: '/new-post/content', component: PagePostNewContent, name: 'PagePostNewContent', children: [
        { path: '/new-post/content/cropper', component: ImageCropper, name: 'ImageCropper' }
      ] },
      { path: '/activity', component: PageActivity, name: 'PageActivity' },
      { path: '/profile', component: PageProfile, name: 'PageProfile' },
      { path: '/profile/edit', component: PageProfileEdit, name: 'PageProfileEdit' },
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
