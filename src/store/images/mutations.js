export function convertUploadedImage ( state, payload ) {
  state.uploadedImage = payload
}

export function setCropData ( state, cropData) {
  state.uploadedImage.cropData = cropData
}

export function clearUploadedImage (state) {
  state.uploadedImage= null
}

export function setUploadedImages (state, selectedImages) {
  state.uploadedImages = selectedImages
}

export function generateImageOrder (state) {
  for (let index = 0; index < state.uploadedImages.length; index++) {
    state.uploadedImages[index].order = index + 1
  }
}

export function removeUploadedImage (state, payload) {
  const imageIndex = state.uploadedImages.findIndex(image => {
    return image.id === payload
  })
  state.uploadedImages.splice(imageIndex, 1)
}

export function addOrder (state, { id }) {
  let highestOrderNumber = findHighestOrderNumber(state.uploadedImages)
  
  state.uploadedImages.forEach(image => {
    if (image.id === id) {
      image.order = highestOrderNumber + 1
      console.log(state.uploadedImages)
      return
    }
  })
}

export function removeOrder (state, payload) {
  state.uploadedImages.forEach(image => {

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

export function clearUploadedImages (state) {
  state.uploadedImages = [];
}
