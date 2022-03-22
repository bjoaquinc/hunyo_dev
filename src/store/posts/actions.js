import { updateDoc, arrayUnion, doc, getDoc } from "firebase/firestore"
import { db, auth } from "src/boot/firebase"

export async function readPost ( { commit }, postId ) {
  const postRef = doc(db, 'posts', postId)
  await updateDoc(postRef, {
    userReads: arrayUnion(auth.currentUser.uid),
  }).catch(error => {throw error})
  console.log('Successfully read document')
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
    console.log('Successfully set post: ', selectedPost)
  } else {
    throw new Error('Could not get post.')
  }
}