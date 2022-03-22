export function getUserId ( state ) {
  return state.userId
}

export function getUserData ( state ) {
  if (state.userData) {
    return state.userData
  } else {
    return {displayName: '', photoURL : '', bio: '', work: '', location: '', website: ''}
  }
}

export function getActivityFeed ( state ) {
  return state.activityFeed
}

export function getUploadedImage ( state ) {
  return state.uploadedImage
}

export function newProfilePicture ( state ) {
  return state.newProfilePicture
}

export function getUnsubscribeUser ( state ) {
  return state.unsubscribeUser
}

export function getRecommendItem ( state ) {
  return state.recommendItem
}