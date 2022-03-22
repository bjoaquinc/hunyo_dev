

export function updateSelectedPostsList ( state, id ) {
  if (state.selectedPostsList.includes(id)) {
    state.selectedPostsList.splice(state.selectedPostsList.indexOf(id), 1);
  } else {
    state.selectedPostsList.push(id);
  }
}

export function updateSelectedFolder ( state, id ) {
  state.selectedFolder = id
}

export function setNewFolderName ( state, value ) {
  state.newFolderName = value
}

export function createFolder ( state, folder ) {
  state.newFolder = folder
}

export function setPostData ( state, postData) {
  state.postData = postData
}

export function setFolders ( state, { folders, unsubscribeFolders} ) {
  state.folders = folders
  state.unsubscribeFolders = unsubscribeFolders
}

export function setUnorganizedPosts ( state, { unorganizedPosts, unsubscribeUnorganizedPosts } ) {
  state.unorganizedPosts = unorganizedPosts
  state.unsubscribeUnorganizedPosts = unsubscribeUnorganizedPosts
}

export function setFolder ( state, { folder, unsubscribeFolder} ) {
  state.folder = folder
  state.unsubscribeFolder = unsubscribeFolder
}

export function setPosts ( state, {posts, unsubscribePosts}) {
  state.posts = posts
  state.unsubscribePosts = unsubscribePosts
}

export function clearState ( state ) {
  state.selectedFolder = ''
  state.selectedPostsList = []
  state.newFolderName = ''
}