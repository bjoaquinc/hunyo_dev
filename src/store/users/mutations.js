export function setFollowItem ( state, {followItem, unsubscribeFollowItem}) {
  state.followItem = followItem
  state.unsubscribeFollowItem = unsubscribeFollowItem
}

export function clearState ( state ) {
  state.followItem = null
  state.unsubscribeFollowItem = null
}

export function setFollowersList ( state, followersList) {
  state.followersList = followersList
}

export function setActivityFeed ( state, feedList ) {
  state.activityFeed = feedList
}

export function setUserData ( state, {userData, unsubscribeUser}) {
  state.userData = userData
  state.unsubscribeUser = unsubscribeUser
}