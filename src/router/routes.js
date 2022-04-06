import MainLayout from 'src/layouts/MainLayout.vue'
import PageHome from 'src/pages/PageHome.vue'
import PageActivity from 'src/pages/PageActivity.vue'
import PageProfile from 'src/pages/PageProfile.vue'
import PageError404 from 'src/pages/PageError404.vue'
import PagePost from 'src/pages/PagePost.vue'
import PagePostNewTitle from 'src/pages/PagePostNewTitle.vue'
import PagePostNewContent from 'src/pages/PagePostNewContent.vue'
import PagePostDrafts from 'src/pages/PagePostDrafts.vue'
import PageSignUp from 'src/pages/PageSignUp.vue'
import PageLanding from 'src/pages/PageLanding.vue'
import PageSettings from 'src/pages/PageSettings.vue'


import ImageCropper from 'src/components/ImageCropper.vue'
import FeedList from 'src/components/FeedList.vue'
import SignUpNameAndEmail from 'src/components/SignUpNameAndEmail.vue'
import SignUpPassword from 'src/components/SignUpPassword.vue'
import SignUpEmailVerification from 'src/components/SignUpEmailVerification.vue'
import ProfileDetail from 'src/components/ProfileDetail.vue'
import ProfileEdit from 'src/components/ProfileEdit.vue'
import ProfileFolder from 'src/components/ProfileFolder.vue'
import LandingJoin from 'src/components/LandingJoin.vue'
import LandingHome from 'src/components/LandingHome.vue'
import LandingPosts from 'src/components/LandingPosts.vue'
import LandingUser from 'src/components/LandingUser.vue'
import LandingPasswordReset from 'src/components/LandingPasswordReset.vue'
import SettingsList from 'src/components/SettingsList.vue'
import SettingsEmail from 'src/components/SettingsEmail.vue'
import SettingsPassword from 'src/components/SettingsPassword.vue'
import SettingsTerms from 'src/components/SettingsTerms.vue'
import SettingsPrivacy from 'src/components/SettingsPrivacy.vue'
import UserDetail from 'src/components/UserDetail.vue'
import FolderDetail from 'src/components/FolderDetail.vue'
import ProfileRecommendDetail from 'src/components/ProfileRecommendDetail.vue'
import DialogProfileImageCropper from 'src/components/DialogProfileImageCropper.vue'



const routes = [
  {
    path: '/',
    component: MainLayout,
    children: [
      { path: '/landing', component: PageLanding,  meta: { header: 'HeaderPageLanding'}, children: [
        { path: '', component: LandingHome, name: 'PageLanding' },
        { path: 'join', component: LandingJoin, name: 'LandingJoin' },
        { path: 'password-reset', component: LandingPasswordReset, name: 'LandingPasswordReset'},
        { path: 'posts', component: LandingPosts, name: 'LandingPosts' },
        { path: ':postId', component: PagePost, name: 'LandingPost', props: true, meta: { header: 'HeaderPagePost' } },
        { path: 'members/:userId', component: LandingUser, name: 'LandingUser', props: true, meta: { header: 'HeaderPageUser' }},
      ] },
      { path: '/', component: PageHome, meta: { location: 'feed' }, children: [
        { path: '', component: FeedList, name: 'PageHome', meta: { header: 'HeaderPageHome' } },
        { path: 'posts/:postId', component: PagePost, name: 'FeedPost', props: true,  meta: { header: 'HeaderPagePost' } },
        { path: 'members/:userId', component: UserDetail, name: 'FeedUser', props: true,  meta: { header: 'HeaderPageUser' } }
      ] },
      { path: '/new-post/drafts', component: PagePostDrafts, name: 'PagePostDrafts', meta: { header: 'HeaderPagePostDrafts' } },
      { path: '/new-post/title', component: PagePostNewTitle, name: 'PagePostNewTitle',  meta: { header: 'HeaderPagePostNewTitle', withoutDesktopHeader: true }  },
      { path: '/new-post/content', component: PagePostNewContent, name: 'PagePostNewContent', meta: { header: 'HeaderPagePostNewContent', withoutDesktopHeader: true } , children: [
        { path: 'cropper', component: ImageCropper, name: 'ImageCropper' }
      ] },
      { path: '/activity', component: PageActivity, name: 'PageActivity',  meta: { header: 'HeaderPageActivity' } },
      { path: '/profile', component: PageProfile, meta: { location: 'profile' }, children: [
        { path: '', component: ProfileDetail, name: 'PageProfile', meta: { header: 'HeaderPageProfile' } },
        { path: 'edit', component: ProfileEdit, name: 'ProfileEdit', meta: { header: 'HeaderProfileEdit' }, children: [
          { path: 'cropper', component: DialogProfileImageCropper, name: 'ProfileImageCropper'}
        ] },
        { path: 'folder', component: ProfileFolder, name: 'ProfileFolder', meta: { header: 'HeaderProfileFolder' } },
        { path: 'folder/:folderId', component: FolderDetail, name: 'FolderDetail', props: true, meta: { header: 'HeaderFolderDetail' } },
        { path: 'posts/:postId', component: PagePost, name: 'ProfilePost', props: true, meta: { header: 'HeaderPagePost' } },
        { path: 'members/:userId', component: UserDetail, name: 'ProfileUser', props: true, meta: { header: 'HeaderPageUser' }},
        { path: 'recommendations/:recommendId', component: ProfileRecommendDetail, name: 'ProfileRecommendDetail', props: true, meta: { header: 'HeaderProfileRecommendDetail' }}
      ] },
      { path: 'signup', component: PageSignUp, meta: { withoutDesktopHeader: true }, children: [
        { path: '', component: SignUpNameAndEmail },
        { path: 'new-password', component: SignUpPassword },
        { path: 'email-verification', component: SignUpEmailVerification }
      ] },
      { path: 'settings', component: PageSettings, meta: { withoutDesktopHeader: true }, children: [
        { path: '', component: SettingsList, },
        { path: 'email', component: SettingsEmail },
        { path: 'password', component: SettingsPassword },
        { path: 'terms', component: SettingsTerms },
        { path: 'privacy', component: SettingsPrivacy }
      ]}
    ]
  },

  {
    path: '/emailtemplate',
    component: () => import('src/components/BaseEmailTemplate.vue')
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: PageError404
  }
]

export default routes
