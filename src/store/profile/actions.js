import { auth, db, storage } from 'src/boot/firebase'
import { updateProfile } from 'firebase/auth'
import { doc, getDoc, getDocs, updateDoc, collection, query, where, orderBy, onSnapshot } from 'firebase/firestore'
import { ref, getDownloadURL, uploadBytes } from 'firebase/storage'

export async function setUserData ( { commit }, userId) {
  const unsubscribeUser = onSnapshot(doc(db, 'users', userId), (doc) => {
    const userData = {...doc.data(), userId: doc.id}
    commit('setUserData', { userData, unsubscribeUser})
    console.log('Successfully got User Data: ', userData)
  }, (error) => {
    console.log('Could not subscribe to userdata')
    throw error
  })
}

export async function setActivityFeed ( { commit }, userId ) {
  const feedList = []
  const colRef = collection(db, 'feedItems')
  const q = query(colRef, where('user.id', "==", userId), orderBy('createdAt', 'desc'))

  const docSnapshots = await getDocs(q).catch(error => {throw error})

  docSnapshots.forEach(doc => feedList.push({...doc.data(), id: doc.id}))
  commit('setActivityFeed', feedList)
  console.log('Successfully set User Activity Feed: ', feedList)
}

export async function updateUserData ( {commit }, payload) {
  await updateDoc(doc(db, 'users', auth.currentUser.uid), {
    ...payload
  }).catch(error => {
    throw error
  })
  console.log('Successfully updated User Data: ', auth.currentUser)
}

export async function convertUploadedImage ({ commit }, file) {
  const fileType = file.type
  const result = await readUploadedFileAsDataURL(file).catch(error => {
    throw error
  })

  commit('convertUploadedImage', {
    value: result,
    fileType
  })
  
}

export async function uploadAndUpdatePhotoURL ({ commit }, image) {
  const blob = dataURItoBlob(image);
  const imageId = auth.currentUser.uid
  const storageRef = ref(storage, `profile_pics/${imageId}`)

  await uploadBytes(storageRef, blob).catch((error) => {
        throw error
      })
  const downloadURL = await getDownloadURL(storageRef)
  console.log('Successfully uploaded image to storage: ', downloadURL)
  await updateProfile(auth.currentUser, {
    photoURL: downloadURL
  }).catch(error => {throw error})
  await updateDoc(doc(db, 'users', auth.currentUser.uid), {
    photoURL: downloadURL
  }).catch(error => {throw error})
  console.log('Successfully updated auth and database')

}

function readUploadedFileAsDataURL (file) {
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


export async function setRecommendItem ( { commit }, recommendId) {
  const feedItemRef = doc(db, 'feedItems', recommendId)
  console.log('Recommend action triggered')

  const docSnapshot = await getDoc(feedItemRef).catch(error => {throw error})

  console.log(docSnapshot)
  if (docSnapshot) {
    commit('setRecommendItem', {...docSnapshot.data(), id: docSnapshot.id})
    console.log('Successfully set Recommend Item: ', docSnapshot)
  } else {
    throw new Error('Could not find Recommendation')
  }
}