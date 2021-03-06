
export function setCommentsList ( state, { commentsList, unsubscribeComments } ) {
  state.commentsList = commentsList
  state.unsubscribeComments = unsubscribeComments
}

export function setRepliesList ( state, { commentId, repliesList, unsubscribeReplies} ) {
  state.replies[commentId] = repliesList
  const repliesLength = Object.keys(state.replies).length
  if (state.unsubscribeRepliesList.length < repliesLength) {
    state.unsubscribeRepliesList.push(unsubscribeReplies)
  }
}

export function setUploadedImages ( state, images) {
  state.images = images;
}

export function clearStateImages ( state) {
  state.images = [];
}

export function clearState ( state ) {
  state.commentsList = null,
  state.replies = {},
  state.unsubscribeComments = null,
  state.unsubscribeRepliesList = []
}