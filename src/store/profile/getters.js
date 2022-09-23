export function getUserId ( state ) {
  return state.userData.id
}

export function getUserData ( state ) {
  return state.userData
}

export function getEditedUserData ( state ) {
  return state.editedUserData
}

export function getActivityFeed ( state ) {
  return state.activityFeed
}

export function getUploadedImage ( state ) {
  return state.uploadedImage
}

export function getUnsubscribeUser ( state ) {
  return state.unsubscribeUser
}
