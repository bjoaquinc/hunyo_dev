import { db } from "src/boot/firebase";
import { collection, getDocs, query, orderBy, getDoc, doc, where, limit, startAfter } from "firebase/firestore";

export async function setFeedItems ( { commit }, topic ) {
  const feedItemsList = []
  const feedItemsRef = collection(db, 'feedItems')
  console.log(topic)
  let q = query(feedItemsRef, where('type', '==', 'post'), orderBy("createdAt", "desc"), limit(9))
  if (topic && topic !== 'All Topics') {
    q = query(feedItemsRef, where('type', '==', 'post'), where('topics', 'array-contains', topic), orderBy("createdAt", "desc"), limit(9))
  } 
  const querySnapshot = await getDocs(q).catch(error => {throw error})
  querySnapshot.forEach(doc => {
    feedItemsList.push({
      ...doc.data(),
      id: doc.id
    })
  })
  const lastVisible = querySnapshot.docs[querySnapshot.docs.length - 1]
  console.log('last', lastVisible)
  commit('setFeedItems', {feedItemsList, lastVisible, topic})
  return lastVisible
}

export async function setNextFeedItems ( { commit, state }, lastVisible ) {
  const topic = state.topic
  const lastVisibleClone = JSON.parse(JSON.stringify(lastVisible))
  console.log('lastVisible: ', lastVisible)
  console.log('lastVisibleClone', lastVisibleClone)
  console.log('state-lastVisible: ', state.lastVisible)
  const colRef = collection(db, 'feedItems');
  let next = query(colRef, where('type', '==', 'post'), orderBy('createdAt', 'desc'), limit(9), startAfter(lastVisible));
  if (topic && topic !== 'All Topics') {
    next = query(colRef, where('type', '==', 'post'), where('topics', 'array-contains', topic), orderBy('createdAt', 'desc'), startAfter(lastVisible), limit(9));
  }
  console.log("next: ", next)
  const querySnapshot = await getDocs(next).catch(error => {throw error});
  if (!querySnapshot.empty) {
    const posts = []
    querySnapshot.forEach(postDoc => {
      console.log('postDoc', postDoc)
      const post = {
        id: postDoc.id,
        ...postDoc.data()
      }
      posts.push(post);
    })
    const updatedLastVisible = querySnapshot.docs[querySnapshot.docs.length -1]
    commit('setNextFeedItems', {
      feedItemsList: posts,
      lastVisible: updatedLastVisible
    })
    return updatedLastVisible
  } else {
    throw new Error('No posts available')
  }
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

