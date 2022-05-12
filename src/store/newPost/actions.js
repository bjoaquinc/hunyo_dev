import { uid } from 'quasar'
import { storage, auth, db, functions } from 'src/boot/firebase'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { serverTimestamp, collection, doc, updateDoc, addDoc } from 'firebase/firestore'
import { httpsCallable } from 'firebase/functions'
import amplitude from 'amplitude-js'

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
        file: payload.files[index],
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

// create post
export async function createPost ( { commit, rootGetters }, { newPost, imagesList } ) {
  let imageURLList = [];
  const docRef = await addDoc(collection(db, 'posts'), {
    ...newPost,
    createdAt: serverTimestamp(),
    user: {
      name: rootGetters["profile/getUserData"].displayName,
      id: rootGetters["auth/getUser"].uid,
      photo: rootGetters["auth/getUser"].photoURL,
    },
  }).catch(error => {throw error})

  // console.log('Successfully added document: ', docRef)

  
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
    // console.log('Successfully uploaded images to storage: ', imageURLList)
    const postRef = doc(db, "posts", docRef.id);
    await updateDoc(postRef, {
      imagesList: imageURLList,
    }).catch(error => {throw error})
    // console.log('Successfully updated document')
  }

  const { topics, title, isQuestion } = newPost

  const feedItemData = {
    topics,
    title,
    isQuestion,
    createdAt: serverTimestamp(),
    user: {
      name: rootGetters["profile/getUserData"].displayName,
      id: rootGetters["auth/getUser"].uid,
      photo: rootGetters["auth/getUser"].photoURL,
    },
    type: 'post',
    postId: docRef.id
  }

  if (imageURLList && imageURLList.length > 0) {
    feedItemData.imagesList = imageURLList
  }
  
  const feedItemDocRef = await addDoc(collection(db, 'feedItems'), {...feedItemData})
    .catch(error => {throw error})
  // console.log('Successfully added feed item: ', feedItemDocRef)

  var identify = new amplitude.Identify().add('num total create post', 1)
  amplitude.getInstance().identify(identify)

  commit('setPostId', docRef.id)
  return;

}

// export async function cropImage ( { commit }, { file, id, cropData, contentType}) {
//   const filePath = `images/${id}`
//   const imageRef = ref(storage, filePath)
//   await uploadBytes(imageRef, file).catch(error => {throw error})
//   const crop = httpsCallable(functions, 'images-cropImage');
//   const croppedImageRef = await crop({
//     filePath,
//     cropData,
//     fileName: id,
//     contentType
//   }).catch(error => { throw error })
//   // // return croppedImageRef;
// }

// export async function testImageMagick () {
//   const test = httpsCallable(functions, 'images-testImageMagick');
//   const response = await test().catch(error => console.log(error));
//   console.log(response);
// }

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