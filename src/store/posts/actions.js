import { uid } from 'quasar'

export function toggleIsMinimized ({ commit }, index) {
  commit('toggleIsMinimized', index)
}

export async function pushUploadedImages ({ commit }, payload) {
  const selectedImages = []

  for (let index = 0; index < payload.files.length; index++) {
    try {
      const fileContents = await readUploadedFileAsDataURL (payload.files[index])
      const fileType = payload.files[index].type
      selectedImages.push({
        id: uid(),
        value: fileContents,
        order: null,
        type: fileType,
        croppedValue: null,
        canvasData: null,
      })
    } catch (error) {
      console.warn(error.message)
    }
    
  }
  commit('pushUploadedImages', selectedImages)
}

export function readUploadedFileAsDataURL (file) {
  const reader = new FileReader

  return new Promise((resolve, reject) => {
    reader.onerror = () => {
      reader.abort()
      reject(new DOMException("Problem parsing input file."))
    }

    reader.onload = () => {
      resolve(reader.result)
    }

    reader.readAsDataURL(file)
  })
}

export function generateImageOrder ({ commit }) {
  commit('generateImageOrder')
}

export function removeImageOrder ({ commit }, payload) {
  commit('removeImageOrder', payload)
}

export function addImageOrder ({ commit }, payload) {
  commit('addImageOrder', payload)
}

export function removeUnsavedImages ({ commit }) {
  commit('removeUnsavedImages')
}

export async function storeCroppedImages ({ commit }, payload) {
  commit('storeCroppedImages', await payload)
}

export function reorderImages ({ commit }) {
  commit('reorderImages')
}

export function removeUploadedImage ({ commit }, payload) {
  commit('removeUploadedImage', payload)
}

export function removeAllImages ({ commit }) {
  commit('removeAllImages')
}

export function setPreviousRouteName ({ commit }, previousRouteName) {
  commit('setPreviousRouteName', previousRouteName)
}