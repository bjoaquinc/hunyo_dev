import { updateDoc, arrayUnion, doc, getDoc, collection, getDocs, query, orderBy, where, onSnapshot } from "firebase/firestore"
import { db, auth } from "src/boot/firebase"

export async function readPost ( { commit, rootGetters }, postId ) {
  const postRef = doc(db, 'posts', postId)
  await updateDoc(postRef, {
    userReads: arrayUnion(rootGetters["auth/getUser"].uid),
  }).catch(error => {throw error})
  // console.log('Successfully read document')
}

export async function setSelectedPost ( { commit }, postId ) {
  const docRef = doc(db, 'posts', postId)
  return await new Promise((resolve, reject) => {
    const unsubscribeSelectedPost = onSnapshot(docRef, (postDoc) => {
      if (postDoc.exists) {
        const selectedPost = {
          ...postDoc.data(),
          postId,
        }
        commit('setSelectedPost', { selectedPost, unsubscribeSelectedPost });
        // console.log('Successfully set post: ', selectedPost)
        resolve(selectedPost)
      } else {
        throw new Error ('Could not find selected post.')
      }
    })
  })
}

export async function editPost ( { commit }, { postId, title, content } ) {
  const docRef = doc(db, 'posts', postId)
  await updateDoc(docRef, {
    title,
    content
  }).catch(error => {throw error})
  // console.log('Successfully updated post.')
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