import { auth, db, functions, storage } from "src/boot/firebase";
import { addDoc, collection, serverTimestamp, orderBy, 
  query, onSnapshot, deleteDoc, doc, updateDoc } from "firebase/firestore";
import amplitude from "amplitude-js"
import { uid } from "quasar";
import { httpsCallable } from "firebase/functions";
import { ref, uploadBytes, getDownloadURL, deleteObject, listAll } from 'firebase/storage'
import AutoLinker from "autolinker";

export async function createComment ( { commit, rootGetters }, { postId, comment, selectedType, userId} ) {
  const processedComment = linkify(comment);
  const commentsRef = collection(db, 'posts', postId, 'comments')
  const docRef = await addDoc(commentsRef, {
    comment: processedComment,
    selectedType,
    user: {
      name: rootGetters["profile/getUserData"].displayName,
      id: rootGetters["auth/getUser"].uid,
      photo: rootGetters["profile/getUserData"].photoURL,
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
  // console.log('Successfully created comment: ', docRef)
  return docRef.id
}

export async function editComment ( { commit }, { postId, commentId, comment }) {
  const processedComment = linkify(comment)
  const commentRef = doc(db, 'posts', postId, 'comments', commentId)
  await updateDoc(commentRef, {
    comment: processedComment
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

export async function createReply ( { commit, rootGetters }, { postId, postUser, commentId, newReply, replyId, replyUser } ) {
  const processedReply = linkify(newReply)
  const repliesRef = collection(db, 'posts', postId, 'comments', commentId, 'replies')
  const replyData = {
    reply: processedReply,
    user: {
      name: rootGetters["profile/getUserData"].displayName,
      id: rootGetters["auth/getUser"].uid,
      photo: rootGetters["profile/getUserData"].photoURL,
    },
    createdAt: serverTimestamp()
  }
  if (replyId) {
    replyData.replyId = replyId
  }
  const docRef = await addDoc(repliesRef, replyData).catch(error => {throw error})
  // Send make comment to Amplitude and increment num total create comment
  amplitude.getInstance().logEventWithTimestamp("create comment", {
    "post author id": postUser.id,
    "type": "reply",
    "reply member id": replyUser.id
  })
  const identify = new amplitude.Identify().add('num total create comment', 1)
  amplitude.getInstance().identify(identify)
  // console.log('Successfully created reply: ', docRef)
  return docRef.id;
}

export async function editReply ( { commit }, { postId, commentId, reply, replyId }) {
  const processedReply = linkify(reply);
  const replyRef = doc(db, 'posts', postId, 'comments', commentId, 'replies', replyId)
  await updateDoc(replyRef, {
    reply: processedReply
  }).catch(error => {throw error})
  // console.log('Successfully edited reply');
}

function linkify(text) {
  const linkedText = AutoLinker.link(text);
  return linkedText;
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

export async function deleteComment ( { commit }, { postId, commentId, imagesList }) {
  // delete images
  if (imagesList && imagesList.length > 0) {
    const listRef = ref(storage, `comments/${commentId}`);
    const list = await listAll(listRef)
    const imageRefs = list.items;
    const promises = [];
    imageRefs.forEach(imageRef => {
      const promise = deleteObject(imageRef)
      promises.push(promise);
    });
    await Promise.all(promises);
  }
  // delete comment document
  const commentRef = doc(db, 'posts', postId, 'comments', commentId)
  await deleteDoc(commentRef).catch(error => {throw error})
  const identify = new amplitude.Identify().add('num total create comment', -1)
  amplitude.getInstance().identify(identify);
}

export async function deleteReply ( { commit }, { postId, commentId, replyId, imagesList }) {
  console.log('Reply id ', replyId)
  // delete images
  if (imagesList && imagesList.length > 0) {
    const listRef = ref(storage, `comments/${replyId}`);
    const list = await listAll(listRef)
    const imageRefs = list.items;
    const promises = [];
    imageRefs.forEach(imageRef => {
      const promise = deleteObject(imageRef)
      promises.push(promise);
    });
    await Promise.all(promises);
  }
  // delete reply document
  const replyRef = doc(db, 'posts', postId, 'comments', commentId, 'replies', replyId);
  await deleteDoc(replyRef).catch(error => {throw error})
  const identify = new amplitude.Identify().add('num total create comment', -1)
  amplitude.getInstance().identify(identify);
}

// images

export async function setUploadedImages ( { commit }, files) {
  const promises = [];
  Array.from(files).forEach(file => {
    const promise = readUploadedFileAsDataURL(file);
    promises.push(promise);
  })
  const images = await Promise.all(promises).catch(error => {throw error});
  commit("setUploadedImages", images);
}

function readUploadedFileAsDataURL (file) {
  const reader = new FileReader

  return new Promise((resolve, reject) => {
    reader.onerror = () => {
      reader.abort()
      reject(new DOMException("Problem parsing input file."))
    }

    reader.onload = async () => {
      var image = new Image();
      image.src = reader.result;
      const dimensions = await new Promise((resolve, reject) => {
        var image = new Image();
        image.src = reader.result;
        image.onload = function() {
          resolve({width: this.width, height: this.height})
        }
        image.onerror = (error) => {
          image.abort();
          reject(new DOMException("Problem parsing image."))
        }
      })
      const imageData = {
        ...dimensions,
        id: uid(),
        value: reader.result,
        file,
      }
      resolve(imageData)
    }
    reader.readAsDataURL(file)
  })
}

export async function resizeAndUploadImages ({ state }, { commentId, postId, replyId}) {
  // Upload images to storage simultaneously and create image list with filepath
  const promises = [];
  const images = state.images;
  const imagesWithFilePath = [];
  let docId = ""
  if (replyId) {
    docId = replyId;
  } else {
    docId = commentId;
  }
  images.forEach(image => {
    const filePath = `comments/${docId}/${image.id}`
    const storageRef = ref(storage, filePath)
    const promise = uploadBytes(storageRef, image.file);
    promises.push(promise);
    const imageWithFilePath = {
      id: image.id,
      filePath,
      width: image.width,
      height: image.height,
    }
    imagesWithFilePath.push(imageWithFilePath)
  });
  await Promise.all(promises);
  // Call an https cloud function to resize images and create thumbnails
  const resizeAndThumbnailImages = httpsCallable(functions, 'images-resizeAndThumbnailImages');
  await resizeAndThumbnailImages({
    imagesWithFilePath,
  });
  // Get imageURLs and thumbnailURLs
  const imageURLPromises = [];
  const thumbnailURLPromises = [];
  imagesWithFilePath.forEach(image => {
    const imageRef = ref(storage, image.filePath);
    const imagePromise = getDownloadURL(imageRef);
    imageURLPromises.push(imagePromise);
    const thumbnailFilepath = `comments/${docId}/thumb_${image.id}`
    const thumbnailRef = ref(storage, thumbnailFilepath);
    const thumbnailPromise = getDownloadURL(thumbnailRef);
    thumbnailURLPromises.push(thumbnailPromise);
  })
  const imageURLs = await Promise.all(imageURLPromises);
  const thumbnailURLs = await Promise.all(thumbnailURLPromises);
  // Upload imagesList and thumbnailList to firestore
  let docRef = ""
  if (replyId) {
    docRef = doc(db, "posts", postId, "comments", commentId, "replies", replyId);
  } else {
    docRef = doc(db, "posts", postId, "comments", commentId);
  }
  await updateDoc(docRef, {
    imagesList: imageURLs,
    thumbnailList: thumbnailURLs,
  })
}
