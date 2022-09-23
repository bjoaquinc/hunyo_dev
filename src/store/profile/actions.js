import { db } from 'src/boot/firebase'
import { doc, getDocs, updateDoc, collection, query, where, orderBy, onSnapshot } from 'firebase/firestore'
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
export async function updateUserData ( { getters, rootGetters }, payload) {
  await updateDoc(doc(db, 'users', rootGetters["auth/getUser"].uid), {
    ...payload
  }).catch(error => {
    throw error
  })
  const userData = getters['getUserData']
  // console.log('Successfully updated User Data: ', userData)
}
