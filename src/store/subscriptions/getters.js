export function getFollowItem ( state ) {
  return state.followItem
}

export function getUnsubscribeFollowItem ( state ) {
  return state.unsubscribeFollowItem
}

export function getFollowersList ( state ) {
  return state.followersList
}

export function getUnsubscribeFollowers ( state ) {
  return state.unsubscribeFollowersList
}

export function getFollowingList ( state ) {
  const followingList = []
  if (state.followingList && state.followingList.length) {
    state.followingList.forEach((followingItem) => {
      followingList.push(followingItem.followedUser.id)
    })
  }
  return followingList
}

export function getUnsubscribeFollowing ( state ) {
  return state.unsubscribeFollowingList
}
