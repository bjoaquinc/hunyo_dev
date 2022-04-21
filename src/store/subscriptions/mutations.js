export function setFollowItem ( state, {followItem, unsubscribeFollowItem}) {
  state.followItem = followItem
  state.unsubscribeFollowItem = unsubscribeFollowItem
}

export function clearState ( state ) {
  state.followItem = null
  state.unsubscribeFollowItem = null
}

export function clearStateFollowingFollowers ( state ) {
  state.followersList = []
  state.unsubscribeFollowersList = null
  state.followingList = []
  state.unsubscribeFollowingList = null
}

export function setFollowersList ( state, { followersList, unsubscribeFollowersList}) {
  state.followersList = followersList
  state.unsubscribeFollowersList = unsubscribeFollowersList
}

export function setFollowingList ( state, { followingList, unsubscribeFollowingList}) {
  state.followingList = followingList
  state.unsubscribeFollowingList = unsubscribeFollowingList
}

export function setActivityFeed ( state, feedList ) {
  state.activityFeed = feedList
}

export function setUserData ( state, {userData, unsubscribeUser}) {
  state.userData = userData
  state.unsubscribeUser = unsubscribeUser
}