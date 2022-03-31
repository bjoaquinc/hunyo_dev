export function setUserId ( state, userId) {
  state.userId = userId
}

export function setUserData ( state, {userData, unsubscribeUser}) {
  state.userData = userData
  state.unsubscribeUser = unsubscribeUser
}

export function setEditedUserData ( state, userData ) {
  state.editedUserData = {...userData}
}

export function updateEditedUserData (state, { key, value }) {
  state.editedUserData[key] = value
}

export function setActivityFeed ( state, feedList ) {
  state.activityFeed = feedList
}

export function convertUploadedImage ( state, payload ) {
  state.uploadedImage = payload
}

export function setNewProfilePicture ( state, payload ) {
  state.editedUserData['photoURL'] = payload
}

export function clearImages (state) {
  state.uploadedImage= null
  state.newProfilePicture= null
}

export function clearState (state) {
  state.userId = ''
  state.userData = null
  state.uploadedImage = null
  state.newProfilePicture = null
}

export function setRecommendItem ( state, recommendItem ) {
  state.recommendItem = recommendItem
}