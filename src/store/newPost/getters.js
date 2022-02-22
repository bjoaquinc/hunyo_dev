export function getPostsList (state) {
  return state.postsList
}

export function getNewPost (state) {
  return state.post
}

export function getCroppedImagesList (state) {
  return state.croppedImagesList
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

export function getPreviousRouteName (state) {
  return state.previousRouteName
}