import { collection, doc, addDoc, where, getDoc, updateDoc, query, getDocs, onSnapshot } from "firebase/firestore";
import { db, auth } from "src/boot/firebase";

export async function followUser ( { commit }, {name, id, photo}) {
  console.log(name, id, photo)
  const followItemsRef = collection(db, 'followItems')
  const docRef = await addDoc(followItemsRef, {
    followedUser: {
      name,
      id,
      photo
    },
    followingUser: {
      name: auth.currentUser.displayName,
      id: auth.currentUser.uid,
      photo: auth.currentUser.photoURL
    },
    isFollowing: true
  }).catch(error => {throw error})

  console.log('Successfully created the follow item: ', docRef)
}

export async function toggleIsFollowing ( { commit }, {followItemId, isFollowing}) {
  const followItemRef = doc(db, 'followItems', followItemId)
  await updateDoc(followItemRef, {
    isFollowing: !isFollowing
  }).catch(error => {throw error})
  console.log('Successfully toggled is following')
}

export async function setFollowItem ( { commit }, id) {
  console.log('function worked')
  const followItemsRef = collection(db, 'followItems')
  const q = query(followItemsRef, where('followedUser.id', '==', id), where('followingUser.id', '==', auth.currentUser.uid))
  console.log(q)

  const unsubscribeFollowItem = onSnapshot(q, (querySnapshot) => {
    console.log('query snapshot: ', querySnapshot)
    querySnapshot.forEach(doc => {
      console.log('doc: ', doc)
      if (doc) {
        commit('setFollowItem', { followItem: {...doc.data(), id: doc.id}, unsubscribeFollowItem})
        console.log('Successfully set the follow item: ', doc.data())
      }
      
    })
  }, (error) => {
    throw error
  })
}

export async function setFollowersList( { commit } ) {
  const q = query(collection(db, 'followItems'), where('followedUser.id', '==', auth.currentUser.uid))
  const docSnapshot = await getDocs(q).catch(error => {throw error})

  if (docSnapshot && docSnapshot.size) {
    const followersList = []
    docSnapshot.forEach(doc => {
      followersList.push({
        ...doc.data(),
        id: doc.id
      })
    })
    commit('setFollowersList', followersList)
    console.log('Successfully set followersList: ', followersList)
  }
}