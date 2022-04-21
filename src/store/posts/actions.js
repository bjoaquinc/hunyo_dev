import { updateDoc, arrayUnion, doc, getDoc, collection, getDocs, query, orderBy, where } from "firebase/firestore"
import { db, auth } from "src/boot/firebase"

export async function readPost ( { commit }, postId ) {
  const postRef = doc(db, 'posts', postId)
  await updateDoc(postRef, {
    userReads: arrayUnion(auth.currentUser.uid),
  }).catch(error => {throw error})
  // console.log('Successfully read document')
}

export async function setSelectedPost ( { commit }, postId ) {
  const docRef = doc(db, 'posts', postId)
  const docSnapshot = await getDoc(docRef).catch(error => {throw error})
  if (docSnapshot) {
    const selectedPost = {
      ...docSnapshot.data(),
      postId
    }
    commit('setSelectedPost', selectedPost )
    // console.log('Successfully set post: ', selectedPost)
  } else {
    throw new Error('Could not get post.')
  }
}

export async function removePost ( { commit }, postId ) {
  const postRef = doc(db, 'posts', postId)
}

export async function setLandingPosts ( { commit } ) {
  const feedItemsRef = collection(db, 'feedItems')
  const q = query(feedItemsRef, where('type', '==', 'post'), orderBy('createdAt', 'desc'));
  const docsSnapshot = await getDocs(q)
  if (docsSnapshot) {
    const postItems = []
    docsSnapshot.forEach(doc => {
      postItems.push({
        ...doc.data(), id: doc.id
      })
    })
    commit('setLandingPosts', postItems)
  } else {
    throw new Error('Could not find posts')
  }
}