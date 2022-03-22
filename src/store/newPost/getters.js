export function getPostsList (state) {
  return state.postsList
}

export function getNewPost (state) {
  return state.post
}

export function getCroppedImagesList (state) {
  const croppedImagesList = []
  state.uploadedImagesList.forEach(image => croppedImagesList.push(image.croppedValue))
  return croppedImagesList
}

export function getUploadedImagesList (state) {
  if (state.uploadedImagesList && state.uploadedImagesList.length > 0) {
    return state.uploadedImagesList
  }
}

export function getTitle (state) {
  return state.post.title
}

export function getTopicsList (state) {
  return state.post.topics
}

export function getWithFeedback (state) {
  return state.post.withFeedback
}

export function getIsQuestion (state) {
  return state.post.isQuestion
}

export function getContent (state) {
  return state.post.content
}

export function getChosenBestPracticesList (state) {
  return state.chosenBestPracticesList
}

export function getHasDrafts (state) {
  return state.hasDrafts
}

export function getPostId (state) {
  return state.postId
}