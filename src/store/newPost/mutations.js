// firestore posts collection
export function getPostsCollection (state, posts) {
  state.postsList = posts;
}

// new post form items
export function updateTitle (state, payload) {
  state.post.title = payload
}

export function updateWithFeedback (state, payload) {
  state.post.withFeedback = payload
}

export function updateIsQuestion (state, payload) {
  state.post.isQuestion = payload
}

export function updateContent (state, payload) {
  state.post.content = payload
}

export function updateTopics (state, payload) {
  state.post.topics = payload
  const chosenBestPracticesList = state.bestPracticesList.filter( bestPractice => payload.includes(bestPractice.topic))
  
  state.chosenBestPracticesList = chosenBestPracticesList
}

// best practices dropdown
export function toggleIsMinimized (state, index) {
  state.chosenBestPracticesList[index].isMinimized = !state.chosenBestPracticesList[index].isMinimized
}

// image cropper
export function pushUploadedImages (state, payload) {
  payload.forEach(image => state.uploadedImagesList.push(image))
}

export function generateImageOrder (state) {
  for (let index = 0; index < state.uploadedImagesList.length; index++) {
    state.uploadedImagesList[index].order = index + 1
  }
}

export function addImageOrder (state, payload) {
  let highestOrderNumber = findHighestOrderNumber(state.uploadedImagesList)
  
  state.uploadedImagesList.forEach(image => {
    if (image.id === payload.id) {
      image.order = highestOrderNumber + 1
      return
    }
  } )
}

export function removeImageOrder (state, payload) {
  state.uploadedImagesList.forEach(image => {

    if (image.id !== payload.id && image.order > payload.order) {
      image.order -= 1
    } else if (image.id === payload.id) {
      image.order = null
    } else {
      return
    }
  })
}

export function findHighestOrderNumber (imageList) {
  let highestOrderNumber = 0
  imageList.forEach(image => {
    if (image.order && image.order > highestOrderNumber) {
      highestOrderNumber = image.order
    }
  })
  return highestOrderNumber
}


export function removeUnsavedImages (state) {
  const filteredList = state.uploadedImagesList.filter(imageObject => imageObject.croppedValue)
  state.uploadedImagesList = filteredList
}

export function storeCroppedImages (state, payload) {
  let index = 0
  let convertedImagesList = []

  payload.forEach(imageObject => {
    convertedImagesList.push(imageObject.value)
    state.uploadedImagesList[index].croppedValue = imageObject.value
    state.uploadedImagesList[index].canvasData = imageObject.canvasData
    index++
  })

  state.croppedImagesList = convertedImagesList
  index = 0
}

function moveImage(arr, old_index, new_index) {
  while (old_index < 0) {
    old_index += arr.length;
  }
  while (new_index < 0) {
    new_index += arr.length;
  }
  if (new_index >= arr.length) {
    var k = new_index - arr.length + 1;
    while (k--) {
      arr.push(undefined);
    }
  }
  arr.splice(new_index, 0, arr.splice(old_index, 1)[0]);
  return arr; // for testing purposes
}

export function reorderImages (state) {
  const imagesList = state.uploadedImagesList
  const croppedImagesList = state.croppedImagesList
  for (let index = 0; index < imagesList.length; index++) {
    if (imagesList[index].order) {
      moveImage(imagesList, index, imagesList[index].order - 1)
    }
  }
}

export function removeUploadedImage (state, payload) {
  const imageIndex = state.uploadedImagesList.findIndex(image => {
    return image.id === payload
  })

  state.uploadedImagesList.splice(imageIndex, 1)
}

export function removeAllImages (state) {
  state.uploadedImagesList = []
  state.croppedImagesList = []
}

// PostNewTitlePage route back
export function setPreviousRouteName (state, previousRouteName) {
  state.previousRouteName = previousRouteName
}