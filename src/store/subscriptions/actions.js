import { collection, doc, addDoc, where, orderBy, updateDoc, query, getDocs, onSnapshot, getDoc } from "firebase/firestore";
import { db, auth } from "src/boot/firebase";

export async function subscribe ( { commit, rootGetters }, {name, id, photo}) {
  const followItemsRef = collection(db, 'followItems')
  const docRef = await addDoc(followItemsRef, {
    followedUser: {
      name,
      id,
      photo
    },
    followingUser: {
      name: rootGetters["profile/getUserData"].displayName,
      id: rootGetters["auth/getUser"].uid,
      photo: rootGetters["profile/getUserData"].photoURL,
    },
    isFollowing: true
  }).catch(error => {throw error})

  // console.log('Successfully created the follow item: ', docRef)
}

export async function toggleIsFollowing ( { commit }, {followItemId, isFollowing}) {
  const followItemRef = doc(db, 'followItems', followItemId)
  await updateDoc(followItemRef, {
    isFollowing: !isFollowing
  }).catch(error => {throw error})
  // console.log('Successfully toggled is following')
}

export async function setFollowItem ( { commit, rootGetters }, id) {
  const followItemsRef = collection(db, 'followItems')
  const q = query(followItemsRef, where('followedUser.id', '==', id), where('followingUser.id', '==', rootGetters['auth/getUser'].uid))

  const unsubscribeFollowItem = onSnapshot(q, (querySnapshot) => {
    querySnapshot.forEach(doc => {
      // console.log('doc: ', doc)
      if (doc) {
        commit('setFollowItem', { followItem: {...doc.data(), id: doc.id}, unsubscribeFollowItem})
        // console.log('Successfully set the follow item: ', doc.data())
      }
      
    })
  }, (error) => {
    throw error
  })
}

export async function setFollowersList( { commit, rootGetters } ) {
  const q = query(collection(db, 'followItems'), where('followedUser.id', '==', rootGetters['auth/getUser'].uid), where('isFollowing', '==', true))
  const unsubscribeFollowersList = onSnapshot(q, (followersSnapshot) => {
    if (followersSnapshot && followersSnapshot.size) {
      const followersList = []
      followersSnapshot.forEach((doc) => {
        followersList.push({
          ...doc.data(),
          id: doc.id
        })
      })
      // console.log("Successfully set followers list: ", { followersList, unsubscribeFollowersList })
      commit('setFollowersList', {followersList, unsubscribeFollowersList})
    } else {
      commit('setFollowersList', {followersList: [], unsubscribeFollowersList: null})
      // console.log("No follower items")
    }
  })
}

export async function setFollowingList( { commit, rootGetters } ) {
  const q = query(collection(db, 'followItems'), where('followingUser.id', '==', rootGetters['auth/getUser'].uid), where('isFollowing', '==', true))
  const unsubscribeFollowingList = onSnapshot(q, (followingSnapshot) => {
    if (followingSnapshot && followingSnapshot.size) {
      const followingList = []
      followingSnapshot.forEach((doc) => {
        followingList.push({
          ...doc.data(),
          id: doc.id
        })
      })
      // console.log("Successfully set following list: ", { followingList, unsubscribeFollowingList })
      commit('setFollowingList', {followingList, unsubscribeFollowingList})
    } else {
      commit('setFollowingList', {followingList: [], unsubscribeFollowingList: null})
      // console.log("No following items")
    }
  })
}
