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