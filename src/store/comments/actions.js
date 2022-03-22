import { auth, db } from "src/boot/firebase";
import { addDoc, collection, serverTimestamp, orderBy, query, onSnapshot } from "firebase/firestore";

export async function createComment ( { commit }, { postId, comment, selectedType} ) {

  const commentsRef = collection(db, 'posts', postId, 'comments')

  const docRef = await addDoc(commentsRef, {
    comment,
    selectedType,
    user: {
      name: auth.currentUser.displayName,
      id: auth.currentUser.uid,
      photo: auth.currentUser.photoURL
    },
    createdAt: serverTimestamp()
  }).catch(error => {throw error})
  commit('setCommentId', docRef.id)
  console.log('Successfully created comment: ', docRef)
}

export function setCommentsList ( { commit }, postId) {
  const commentsRef = collection(db, 'posts', postId, 'comments')
  const q = query(commentsRef, orderBy('createdAt', 'desc'))

  const unsubscribeComments = onSnapshot(q, (querySnapshot) => {
    const commentsList = []
    querySnapshot.forEach((doc) => {
      const comment = {
        ...doc.data(),
        id: doc.id,
      }
      commentsList.push(comment)
    })
    commit('setCommentsList', {commentsList, unsubscribeComments})
    console.log('Successfully set comments list: ', commentsList)
  }, (error) => {
    throw error
  })
}

export async function createReply ( { commit }, { postId, commentId, reply } ) {

  const repliesRef = collection(db, 'posts', postId, 'comments', commentId, 'replies')

  const docRef = await addDoc(repliesRef, {
    reply,
    user: {
      name: auth.currentUser.displayName,
      id: auth.currentUser.uid,
      photo: auth.currentUser.photoURL,
    },
    createdAt: serverTimestamp()
  }).catch(error => {throw error})
  commit('setReplyId', docRef.id)
  console.log('Successfully created reply: ', docRef)
}

export async function setRepliesList ( { commit }, { postId, commentId }) {
  const repliesRef = collection(db, 'posts', postId, 'comments', commentId, 'replies')
  const q = query(repliesRef, orderBy('createdAt', 'desc'))

  const unsubscribeReplies = onSnapshot(q, (querySnapshot) => {
    const repliesList = []
    querySnapshot.forEach((doc) => {
      repliesList.push({...doc.data(), id: doc.id})
    })
    commit('setRepliesList', {commentId, repliesList, unsubscribeReplies})
    console.log('Successfully set replies list: ', repliesList)
  }, (error) => {
    throw error
  })
}