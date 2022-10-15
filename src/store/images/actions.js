import { auth, db, storage, functions } from 'src/boot/firebase'
import { updateProfile } from 'firebase/auth'
import { ref, getDownloadURL, uploadBytes, deleteObject, listAll } from 'firebase/storage'
import { httpsCallable } from 'firebase/functions'
import { uid } from 'quasar'
import { doc, updateDoc, arrayRemove } from 'firebase/firestore'

export async function setUploadedImages ({ commit, rootGetters }, payload) {
  const selectedImages = []
  const product = rootGetters['products/getProduct']
  if (product && product.imagesList && product.imagesList.length > 0) {
    const imagesList = rootGetters['products/getProduct'].imagesList;
    console.log('images list: ', imagesList);
    imagesList.forEach(imageURL => {
      const imageRef = ref(storage, imageURL);
      const image = {
        id: imageRef.name,
        value: imageURL,
        file: null,
        order: null,
      }
      selectedImages.push(image);
    })
  }
  console.log(selectedImages)
  if (payload) {
    const promises = [];
    for (const file of payload.files) {
      const promise = await readUploadedFileAsDataURL(file)
      promises.push(promise);
    }
    const values = await Promise.all(promises);
    values.forEach((value, index) => {
      const file = payload.files[index];
      selectedImages.push({
        id: uid(),
        value,
        file,
        order: null,
      })
    })
  }
  commit('setUploadedImages', selectedImages)
}

export function readUploadedFileAsDataURL (file) {
  const reader = new FileReader

  return new Promise((resolve, reject) => {
    reader.onerror = () => {
      reader.abort()
      reject(new DOMException("Problem parsing input file."))
    }

    reader.onload = () => {
      var image = new Image();
      image.src = reader.result;
      image.onload = function() {
      }
      resolve(reader.result)
    }

    reader.readAsDataURL(file)
  })
}

export async function cropAndUpdatePhotoURL ( { commit, rootGetters }, {storageFolder, id} ) {
  const {file, cropData} = rootGetters['images/getUploadedImage']
  if (file) {
    const filePath = `${storageFolder}/${id}`
    console.log("filepath: ", filePath)
    const storageRef = ref(storage, filePath)
    await uploadBytes(storageRef, file).catch(error => {throw error})
    console.log("Uploaded Image Successfully", cropData);
    const crop = httpsCallable(functions, 'images-cropProfileImage')
    await crop({
      id,
      cropData,
      filePath
    }).catch(error => {throw error})
    console.log("Cropped image in cloud functions")
    const downloadURL = await getDownloadURL(storageRef);
    return downloadURL;
  }
}

export async function convertUploadedImage ({ commit }, file) {
  const result = await readUploadedFileAsDataURL(file).catch(error => {
    throw error
  })

  commit('convertUploadedImage', {
    value: result,
    file
  })
  
}

export async function removeUploadedImage({ commit, state, rootGetters }, imageId) {
  const productId = rootGetters["products/getProduct"].id;
  const image = state.uploadedImages.find(image => image.id === imageId);
  if (!image.file) {
    const imageURL = image.value;
    // Remove file from storage
    const imageRef = ref(storage, imageURL);
    await deleteObject(imageRef).catch(error => {throw error});
    // Remove URL from array in firestore
    const postRef = doc(db, "products", productId);
    await updateDoc(postRef, {
      imagesList: arrayRemove(imageURL)
    }).catch(error => {throw error});
  }
  commit("removeUploadedImage", imageId);
}

export async function removeImages({ commit, state, rootGetters }) {
  const supplierId = rootGetters["products/getProduct"].supplier.id
  const productId = rootGetters["products/getProduct"].id;
  // Delete all images in storage
  const listRef = ref(storage, `product_images/${supplierId}/${productId}`);
  const list = await listAll(listRef)
  const imageRefs = list.items;
  const promises = [];
  imageRefs.forEach(imageRef => {
    const promise = deleteObject(imageRef)
    promises.push(promise);
  });
  await Promise.all(promises);
  // Remove imagesList from product doc
  const productRef = doc(db, "products", productId);
  await updateDoc(productRef, {
    imagesList: [],
  })
}

export async function uploadAndCropImagesList ({ commit, state }, { imagesListWithCropData, supplierId, productId }) {
  const imagesListWithFilePath = [];
  // Upload images and add filepath to imagesList
  for (const image of imagesListWithCropData) {
    const filePath = `product_images/${supplierId}/${productId}/${image.id}`
    const imageRef = ref(storage, filePath)
    const file = state.uploadedImages.find((uploadedImage) => {
      if (image.id === uploadedImage.id) {
        return true;
      }
    }).file;
    if (file) {
      await uploadBytes(imageRef, file).catch(error => {throw error})
    }
    imagesListWithFilePath.push({...image, filePath});
  }
  // Crop and resize images
  console.log(imagesListWithFilePath)
  const crop = httpsCallable(functions, 'images-cropImages');
  await crop({
    imagesListWithFilePath
  }).catch(error => { throw error })
  // Upload images list to database
  const imageURLS = [];
  for (const image of imagesListWithFilePath) {
    const imageRef = ref(storage, image.filePath);
    const downloadURL = await getDownloadURL(imageRef);
    imageURLS.push(downloadURL);
  }
  const productsRef = doc(db, "products", productId);
  await updateDoc(productsRef, {
    imagesList: imageURLS,
  })
  console.log("Successfully cropped images!")
}
