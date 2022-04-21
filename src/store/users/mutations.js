export function clearState ( state ) {
  state.userData = null
  state.activityFeed = null
  state.unsubscribeUser = null
}

export function setActivityFeed ( state, feedList ) {
  state.activityFeed = feedList
}

export function setUserData ( state, {userData, unsubscribeUser}) {
  state.userData = userData
  state.unsubscribeUser = unsubscribeUser
}