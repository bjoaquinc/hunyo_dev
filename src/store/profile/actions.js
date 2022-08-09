import { auth, db, storage } from 'src/boot/firebase'
import { updateProfile } from 'firebase/auth'
import { doc, getDoc, getDocs, updateDoc, collection, query, where, orderBy, onSnapshot } from 'firebase/firestore'
import { ref, getDownloadURL, uploadBytes } from 'firebase/storage'
import amplitude from 'amplitude-js'

export async function setUserData ( { commit }, userId) {
  return await new Promise(( resolve, reject ) => {
    const unsubscribeUser = onSnapshot(doc(db, 'users', userId), (doc) => {
      const userData = {...doc.data(), id: doc.id}
      const userProperties = {
        'member profile info': {
          'profession': userData.profession,
          'is verified': userData.licenseNumber ? true : false,
          'years of experience': userData.experience,
          'employer': userData.employerName,
          'birthdate': userData.birthdate,
          'company size': userData.employerSize,
          'location': userData.location,
          'has website': userData.website ? true : false,
          'has bio': userData.bio ? true : false,
          'has profile picture': !userData.photoURL.includes('default') ? true : false,
          '# of years of experience': userData.experience,
        },
        'subscribers': userData.followers,
        'subscribed to': userData.following
      }
      amplitude.getInstance().setUserProperties(userProperties)
      commit('setUserData', { userData, unsubscribeUser})
      resolve(userData)
      // console.log('Successfully got User Data: ', userData)
    }, (error) => {
      // console.log('Could not subscribe to userdata')
      reject(error)
    })
  })
}

export async function setActivityFeed ( { commit }, userId ) {
  const feedList = []
  const colRef = collection(db, 'feedItems')
  const q = query(colRef, where('user.id', "==", userId), where('type', '==', 'post'), orderBy('createdAt', 'desc'))

  const docSnapshots = await getDocs(q).catch(error => {throw error})

  docSnapshots.forEach(doc => feedList.push({...doc.data(), id: doc.id}))
  commit('setActivityFeed', feedList)
  // console.log('Successfully set User Activity Feed: ', feedList)
}

export async function uploadAndUpdatePhotoURL ({ commit, rootGetters }, image) {
  const blob = dataURItoBlob(image);
  const imageId = rootGetters["auth/getUser"].uid;
  const storageRef = ref(storage, `profile_pics/${imageId}`);

  await uploadBytes(storageRef, blob).catch((error) => {
        throw error
      })
  const downloadURL = await getDownloadURL(storageRef)
  // console.log('Successfully uploaded image to storage: ', downloadURL)
  await updateProfile(auth.currentUser, {
    photoURL: downloadURL
  }).catch(error => {throw error})
  commit('updateEditedUserData', { key: 'photoURL', value: downloadURL})
  // console.log('Successfully updated auth photoURL')
}

export async function updateUserData ( { getters, rootGetters }, payload) {
  await updateDoc(doc(db, 'users', rootGetters["auth/getUser"].uid), {
    ...payload
  }).catch(error => {
    throw error
  })
  const userData = getters['getUserData']
  // console.log('Successfully updated User Data: ', userData)
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
