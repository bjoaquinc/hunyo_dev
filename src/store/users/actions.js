import { collection, doc, where, orderBy, query, getDocs, onSnapshot } from "firebase/firestore";
import { db } from "src/boot/firebase";


export async function setActivityFeed ( { commit }, userId ) {
  const feedList = []
  const colRef = collection(db, 'feedItems')
  const q = query(colRef, where('user.id', "==", userId), where('type', '==', 'post'), orderBy('createdAt', 'desc'))

  const docSnapshots = await getDocs(q).catch(error => {throw error})

  docSnapshots.forEach(doc => feedList.push({...doc.data(), id: doc.id}))
  commit('setActivityFeed', feedList)
  // console.log('Successfully set User Activity Feed: ', feedList)
}

export async function setUserData ( { commit }, userId) {
  const unsubscribeUser = onSnapshot(doc(db, 'users', userId), (doc) => {
    const userData = {...doc.data(), id: doc.id}
    commit('setUserData', { userData, unsubscribeUser})
    // console.log('Successfully got User Data: ', userData)
  }, (error) => {
    // console.log('Could not subscribe to userdata')
    throw error
  })
}
