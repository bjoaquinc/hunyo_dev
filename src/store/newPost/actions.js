import { uid } from 'quasar'
import { storage, auth, db } from 'src/boot/firebase'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { serverTimestamp, collection, doc, updateDoc, addDoc } from 'firebase/firestore'

// firestore collection data
export function getPostsCollection ({ commit }, postsCol) {
  let posts = []
  postsCol.docs.forEach(
    doc => posts.push({...doc.data(), id: doc.id})
  )
  commit('getPostsCollection', posts)
}

// best practices dropdown
export function toggleIsMinimized ({ commit }, index) {
  commit('toggleIsMinimized', index)
}

// image cropper
export async function setUploadedImages ({ commit }, payload) {
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
      resolve(reader.result)
    }

    reader.readAsDataURL(file)
  })
}

export async function createPost ( { commit }, { newPost, imagesList} ) {
  let imageURLList = [];
  const docRef = await addDoc(collection(db, 'posts'), {
    ...newPost,
    createdAt: serverTimestamp(),
    user: {
      id: auth.currentUser.uid,
      name: auth.currentUser.displayName,
      photo: auth.currentUser.photoURL
    }
  }).catch(error => {throw error})

  console.log('Successfully added document: ', docRef)

  
  if (imagesList && imagesList.length > 0) {

    for (const image of imagesList) {
      const blob = dataURItoBlob(image);
      const fileName = uid();
      const storageRef = ref(storage, `images/${fileName}`);
      await uploadBytes(storageRef, blob).catch(error => {throw error})
      const downloadURL = await getDownloadURL(storageRef).catch(error => {throw error})
      if (downloadURL) {
        imageURLList.push(downloadURL)
      }
    }
    console.log('Successfully uploaded images to storage: ', imageURLList)
    const postRef = doc(db, "posts", docRef.id);
    await updateDoc(postRef, {
      imagesList: imageURLList,
    }).catch(error => {throw error})
    console.log('Successfully updated document')
  }

  const { topics, title, isQuestion } = newPost

  const feedItemData = {
    topics,
    title,
    isQuestion,
    createdAt: serverTimestamp(),
    user: {
      id: auth.currentUser.uid,
      name: auth.currentUser.displayName,
      photo: auth.currentUser.photoURL
    },
    type: 'post',
    postId: docRef.id
  }

  if (imageURLList && imageURLList.length > 0) {
    feedItemData.imagesList = imageURLList
  }
  
  const feedItemDocRef = await addDoc(collection(db, 'feedItems'), {...feedItemData})
    .catch(error => {throw error})

  console.log('Successfully added feed item: ', feedItemDocRef)

  commit('setPostId', docRef.id)

}

function dataURItoBlob(dataURI) {
  // convert base64 to raw binary data held in a string
  // doesn't handle URLEncoded DataURIs - see SO answer #6850276 for code that does this
  var byteString = atob(dataURI.split(",")[1]);

  // separate out the mime component
  var mimeString = dataURI.split(",")[0].split(":")[1].split(";")[0];

  // write the bytes of the string to an ArrayBuffer
  var ab = new ArrayBuffer(byteString.length);

  // create a view into the buffer
  var ia = new Uint8Array(ab);

  // set the bytes of the buffer to the correct values
  for (var i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
  }

  // write the ArrayBuffer to a blob, and you're done
  var blob = new Blob([ab], { type: mimeString });
  return blob;
}