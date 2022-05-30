import state from "./state"

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

export function getPostItem (state) {
  return state.postItem;
}

export function getUnsubscribePostItem (state) {
  return state.unsubscribePostItem;
}

export function getTitle (state) {
  return state.post.title
}

export function getTopicsList (state) {
  return state.post.topics
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

export function getDrafts (state) {
  return state.drafts;
}

export function getUnsubscribeDrafts (state) {
  return state.unsubscribeDrafts;
}
