import { uid } from 'quasar'
import { storage, auth, db, functions } from 'src/boot/firebase'
import { ref, uploadBytes, getDownloadURL, deleteObject, listAll } from 'firebase/storage'
import { serverTimestamp, collection, doc, updateDoc, addDoc, onSnapshot, setDoc, arrayRemove, deleteDoc, query, getDocs, where, orderBy } from 'firebase/firestore'
import { httpsCallable } from 'firebase/functions'
import Autolinker from 'autolinker'
import amplitude from 'amplitude-js'

export async function createPostItem ({ dispatch, commit, rootGetters }, { postId, data }) {
  const { title, topics, isQuestion } = data;
  const postItemRef = doc(db, "posts", postId);
  await setDoc(postItemRef, {
    createdAt: serverTimestamp(),
    title,
    topics,
    isQuestion,
    isPublished: false,
    user: {
      id: rootGetters["auth/getUser"].uid,
      photo: rootGetters["profile/getUserData"].photoURL,
      name: rootGetters["profile/getUserData"].displayName,
    },
    editedAt: serverTimestamp()
  })
  dispatch("setPostItem", postId )
}

export async function setPostItem ({ commit }, postId) {
  const post = await new Promise((resolve, reject) => {
    const postItemRef = doc(db, "posts", postId);
    const unsubscribePostItem = onSnapshot(postItemRef, (doc) => {
      if (doc.exists()) {
        const postItem = {
          ...doc.data(),
          id: doc.id,
        }
        commit('setPostItem', {
          postItem,
          unsubscribePostItem
        })
        resolve(postItem);
      } else {
        unsubscribePostItem();
        reject(new Error("no post item"))
      }
    }, (error) => {
      console.log(error)
    })
  }).catch(error => {throw error})
  return post;
}

export async function updatePostItem ({ commit }, {postId, data}) {
  const postData = data
  if (data.content) {
    const linkedContent = Autolinker.link(data.content);
    postData.content = linkedContent;
  }
  const postRef = doc(db, "posts", postId);
  await updateDoc(postRef, {...postData, editedAt: serverTimestamp()}).catch(error => {throw error});
}

export async function deletePostItem ({ commit, state, dispatch }, {postId}) {
  const postRef = doc(db, "posts", postId);
  if (state.postItem.imagesList && state.postItem.imagesList.length) {
    await dispatch("removeAllImages");
  }
  await deleteDoc(postRef).catch(error => {throw error})
}

export async function toggleHasDrafts ({ commit, dispatch, rootGetters }) {
  const userId = rootGetters["auth/getUser"].uid;
  const postsRef = collection(db, "posts");
  const q = query(postsRef, where("user.id", "==", userId), where("isPublished", "==", false));
  const querySnapshot = await getDocs(q).catch(error => {throw error});
  if (querySnapshot.empty) {
    dispatch("profile/updateUserData", {
      hasDrafts: false,
    }, {root: true})
  }
}

// best practices dropdown
export function toggleIsMinimized ({ commit }, index) {
  commit('toggleIsMinimized', index)
}

// image cropper
export async function uploadAndCropImagesList ({ commit, state }, imagesListWithCropData) {
  const postId = state.postItem.id;
  const imagesListWithFilePath = [];
  // Upload images and add filepath to imagesList
  for (const image of imagesListWithCropData) {
    const filePath = `images/${postId}/${image.id}`
    const imageRef = ref(storage, filePath)
    const file = state.uploadedImagesList.find((uploadedImage) => {
      if (image.id === uploadedImage.id) {
        return true;
      }
    }).file;
    if (file) {
      await uploadBytes(imageRef, file).catch(error => {throw error})
    }
    imagesListWithFilePath.push({...image, filePath});
  }
  // Crop and resize images
  const crop = httpsCallable(functions, 'images-cropImages');
  await crop({
    imagesListWithFilePath
  }).catch(error => { throw error })
  // Upload images list to database
  const imageURLS = [];
  for (const image of imagesListWithFilePath) {
    const imageRef = ref(storage, image.filePath);
    const downloadURL = await getDownloadURL(imageRef);
    imageURLS.push(downloadURL);
  }
  const postRef = doc(db, "posts", postId);
  await updateDoc(postRef, {
    imagesList: imageURLS,
  })
  console.log("Successfully cropped images!")
}

export async function setUploadedImages ({ commit, state }, payload) {
  const selectedImages = []
  if (state.postItem && state.postItem.imagesList && state.postItem.imagesList.length > 0) {
    const imagesList = state.postItem.imagesList;
    imagesList.forEach(imageURL => {
      const imageRef = ref(storage, imageURL);
      const image = {
        id: imageRef.name,
        value: imageURL,
        file: null,
        order: null,
      }
      selectedImages.push(image);
    })
  }
  if (payload) {
    const promises = [];
    for (const file of payload.files) {
      const promise = await readUploadedFileAsDataURL(file)
      promises.push(promise);
    }
    const values = await Promise.all(promises);
    values.forEach((value, index) => {
      const file = payload.files[index];
      selectedImages.push({
        id: uid(),
        value,
        file,
        order: null,
      })
    })
  }
  commit('setUploadedImages', selectedImages)
}

export function readUploadedFileAsDataURL (file) {
  const reader = new FileReader

  return new Promise((resolve, reject) => {
    reader.onerror = () => {
      reader.abort()
      reject(new DOMException("Problem parsing input file."))
    }

    reader.onload = () => {
      var image = new Image();
      image.src = reader.result;
      image.onload = function() {
      }
      resolve(reader.result)
    }

    reader.readAsDataURL(file)
  })
}

export async function removeUploadedImage({ commit, state }, imageId) {
  const postId = state.postItem.id;
  const image = state.uploadedImagesList.find(image => image.id === imageId);
  if (!image.file) {
    const imageURL = image.value;
    // Remove file from storage
    const imageRef = ref(storage, imageURL);
    await deleteObject(imageRef).catch(error => {throw error});
    // Remove URL from array in firestore
    const postRef = doc(db, "posts", postId);
    await updateDoc(postRef, {
      imagesList: arrayRemove(imageURL)
    }).catch(error => {throw error});
  }
  commit("removeUploadedImage", imageId);
}

export async function removeAllImages({ commit, state }) {
  const postId = state.postItem.id;
  // Delete all images in storage
  const listRef = ref(storage, `images/${postId}`);
  const list = await listAll(listRef)
  const imageRefs = list.items;
  const promises = [];
  imageRefs.forEach(imageRef => {
    const promise = deleteObject(imageRef)
    promises.push(promise);
  });
  await Promise.all(promises);
  // Remove imagesList from post doc
  const postRef = doc(db, "posts", postId);
  await updateDoc(postRef, {
    imagesList: [],
  })
  commit("clearStateSelectedImages");
}

// create post
export async function publishPost ( { commit, state, dispatch, rootGetters } ) {
  const postId = state.postItem.id;
  const postRef = doc(db,"posts", postId);
  // Update isPublished property on post item
  await updateDoc(postRef, {
    isPublished: true
  }).catch(error => {throw error});
  // Create feed item
  const feedItemsRef = collection(db, 'feedItems');
  const feedItemData = {
    createdAt: serverTimestamp(),
    user: {
      id: rootGetters["auth/getUser"].uid,
      photo: rootGetters["profile/getUserData"].photoURL,
      name: rootGetters["profile/getUserData"].displayName,
    },
    postId,
    title: state.postItem.title,
    isQuestion: state.postItem.isQuestion,
    topics: state.postItem.topics,
    type: "post",
  }
  if (state.postItem.imagesList && state.postItem.imagesList.length > 0) {
    feedItemData.imagesList = [state.postItem.imagesList[0]];
  }
  await addDoc(feedItemsRef, feedItemData).catch(error => {throw error})
  // Send notification and email to all subscribed users
  const followersList = rootGetters["subscriptions/getFollowersList"]
  for (const followingItem of followersList) {
    const followingUser = followingItem.followingUser;
    await dispatch("notifications/createNotification", {
      type: "followPost",
      content: state.postItem.title,
      userId: followingUser.id,
      route: {
        name: "FeedPost",
        params: {
          postId,
        },
      },
    }, {root: true})
  }
  // Send amplitude create post event
  const createId = rootGetters["amplitude/getCreateId"];
  const firstTimestamp = rootGetters["amplitude/getFirstTimestamp"];
  const lastTimestamp = Date.now();
  const duration = Math.round((lastTimestamp - firstTimestamp)/1000);
  amplitude.getInstance().logEventWithTimestamp("create - create post", {
    "create id": createId,
    duration
  })
  // console.log("Successfully sent create post event");
}

export async function setDrafts( { commit, rootGetters } ) {
  const currentUserId = rootGetters["auth/getUser"].uid
  const postsRef = collection(db, "posts");
  const q = query(postsRef, where("user.id", "==", currentUserId), where("isPublished", "==", false), orderBy("editedAt", "desc"))
  const message = await new Promise((resolve, reject) => {
    const unsubscribeDrafts = onSnapshot(q, (draftsSnapshot) => {
      if (draftsSnapshot.empty) reject("No drafts for this current user");
      const drafts = [];
      draftsSnapshot.forEach(doc => {
        const draft = {...doc.data(), id: doc.id};
        drafts.push(draft);
      })
      commit("setDrafts", {drafts, unsubscribeDrafts})
      resolve("Drafts set!")
    })
  })
  return console.log(message);
}