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

export function clearStateEditedData (state) {
  state.userId = ''
  state.editedUserData = null
  state.uploadedImage = null
  state.newProfilePicture = null
}

export function clearStateFeed (state) {
  state.activityFeed = null
}

export function setRecommendItem ( state, recommendItem ) {
  state.recommendItem = recommendItem
}

export function clearStateUserData ( state ) {
  state.userData.createdAt = null
  state.userData.email = ''
  state.userData.id = ''
  state.userData.displayName = ''
  state.userData.photoURL =
    "https://firebasestorage.googleapis.com/v0/b/hunyo-109e6.appspot.com/o/profile_pics%2Fdefault.png?alt=media&token=6311df79-fcb6-4245-8e84-c1afb9ed459f"
  state.userData.profession = ''
  state.userData.licenseNumber = ''
  state.userData.birthdate = ""
  state.userData.experience = null
  state.userData.employerName = ''
  state.userData.employerSize = ''
  state.userData.location = ''
  state.userData.website = ''
  state.userData.bio = ''
  state.userData.hasSignedGuidelines = true
  state.userData.counter = 0
  state.unsubscribeUser = null
}