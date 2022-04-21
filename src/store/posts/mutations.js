export function setSelectedPost ( state, selectedPost ) {
  state.selectedPost = selectedPost
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