export function setSelectedPost ( state, { selectedPost, unsubscribeSelectedPost } ) {
  state.selectedPost = selectedPost
  state.unsubscribeSelectedPost = unsubscribeSelectedPost
}

export function setLandingPosts ( state, postItems ) {
  state.postItems = postItems
}

export function clearStatePost ( state ) {
  state.selectedPost = null
}

export function clearStatePosts ( state ) {
  state.postItems = []
}