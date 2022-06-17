import { db } from "src/boot/firebase";
import { collection, getDocs, query, orderBy, getDoc, doc, where } from "firebase/firestore";

export async function setFeedItems ( { commit } ) {
  const feedItemsList = []
  const feedItemsRef = collection(db, 'feedItems')
  const q = query(feedItemsRef, where('type', '==', 'post'), orderBy("createdAt", "desc"))
  const querySnapshot = await getDocs(q).catch(error => {throw error})
  querySnapshot.forEach(doc => {
    feedItemsList.push({
      ...doc.data(),
      id: doc.id
    })
  })
  commit('setFeedItems', feedItemsList)
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

