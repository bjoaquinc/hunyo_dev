import { auth, db } from "src/boot/firebase";
import { addDoc, collection, serverTimestamp, orderBy, 
  query, onSnapshot, deleteDoc, doc, updateDoc } from "firebase/firestore";
import amplitude from "amplitude-js"

export async function createComment ( { commit }, { postId, comment, selectedType, userId} ) {

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
  // Send make comment to Amplitude and increment num total create comment
  amplitude.getInstance().logEventWithTimestamp("create comment", {
    "post author id": userId,
    "type": selectedType.toLowerCase(),
  })
  const identify = new amplitude.Identify().add('num total create comment', 1)
  amplitude.getInstance().identify(identify)
  commit('setCommentId', docRef.id)
  // console.log('Successfully created comment: ', docRef)
}

export async function editComment ( { commit }, { postId, commentId, comment }) {
  const commentRef = doc(db, 'posts', postId, 'comments', commentId)
  await updateDoc(commentRef, {
    comment
  }).catch(error => {throw error})
  // console.log('Successfully edited comment');
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
    // console.log('Successfully set comments list: ', commentsList)
  }, (error) => {
    throw error
  })
}

export async function createReply ( { commit }, { postId, postUser, commentId, reply, replyId, replyUser } ) {

  const repliesRef = collection(db, 'posts', postId, 'comments', commentId, 'replies')

  const replyObject = {
    reply,
    user: {
      name: auth.currentUser.displayName,
      id: auth.currentUser.uid,
      photo: auth.currentUser.photoURL,
    },
    createdAt: serverTimestamp()
  }
  if (replyId) {
    replyObject.replyId = replyId
  }
  const docRef = await addDoc(repliesRef, replyObject).catch(error => {throw error})
  commit('setReplyId', docRef.id)
  // Send make comment to Amplitude and increment num total create comment
  amplitude.getInstance().logEventWithTimestamp("create comment", {
    "post author id": postUser.id,
    "type": "reply",
    "reply member id": replyUser.id
  })
  const identify = new amplitude.Identify().add('num total create comment', 1)
  amplitude.getInstance().identify(identify)
  // console.log('Successfully created reply: ', docRef)
}

export async function editReply ( { commit }, { postId, commentId, reply, replyId }) {
  const replyRef = doc(db, 'posts', postId, 'comments', commentId, 'replies', replyId)
  await updateDoc(replyRef, {
    reply
  }).catch(error => {throw error})
  // console.log('Successfully edited reply');
}

export async function setRepliesList ( { commit }, { postId, commentId }) {
  const repliesRef = collection(db, 'posts', postId, 'comments', commentId, 'replies')

  const q = query(repliesRef, orderBy('createdAt'));

  const unsubscribeReplies = onSnapshot(q, (querySnapshot) => {
    const repliesList = []
    querySnapshot.forEach((doc) => {
      repliesList.push({...doc.data(), id: doc.id})
    })
    commit('setRepliesList', {commentId, repliesList, unsubscribeReplies})
    // console.log('Successfully set replies list: ', repliesList)
  }, (error) => {
    throw error
  })
}

export async function deleteComment ( { commit }, { postId, commentId }) {
  const commentRef = doc(db, 'posts', postId, 'comments', commentId)
  await deleteDoc(commentRef).catch(error => {throw error})
  const identify = new amplitude.Identify().add('num total create comment', -1)
  amplitude.getInstance().identify(identify);
}

export async function deleteReply ( { commit }, { postId, commentId, replyId }) {
  const replyRef = doc(db, 'posts', postId, 'comments', commentId, 'replies', replyId);
  await deleteDoc(replyRef).catch(error => {throw error})
  const identify = new amplitude.Identify().add('num total create comment', -1)
  amplitude.getInstance().identify(identify);
}