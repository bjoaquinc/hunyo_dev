import { db, auth } from "src/boot/firebase";
import { addDoc, collection, serverTimestamp, query, getDocs, where, updateDoc, onSnapshot, doc, orderBy, deleteDoc } from "firebase/firestore";
import amplitude from 'amplitude-js'

const folderItemsRef = collection(db, 'folderItems')

export async function savePost ( { commit, rootGetters }, { postData, folder, isNew }) {
  if (!postData) {
    throw new Error ("No post data available");
  }
  const folderItem = {
    createdAt: serverTimestamp(),
    postData,
    userId: rootGetters["auth/getUser"].uid,
    isOrganized: false,
  }
  if (folder) {
    folderItem.folder = folder
    folderItem.isOrganized = true
    if (isNew) {
      // Send save add to profile event for new folder to Amplitude
      amplitude.getInstance().logEventWithTimestamp("save - add to folder", {
        "post id": postData.id,
        type: "new folder",
      })
      // console.log("Successfully sent save add to new folder event")
    } else {
      // Send save add to profile event for pre-existing folder to Amplitude
      amplitude.getInstance().logEventWithTimestamp("save - add to folder", {
        "post id": postData.id,
        type: "pre-existing folder",
      })
      // console.log("Successfully sent save add to pre-existing folder event")
    }
  } else {
    // Send save add to profile event for quicksave to Amplitude
    amplitude.getInstance().logEventWithTimestamp("save - add to folder", {
      "post id": postData.id,
      type: "quicksave",
    })
    // console.log("Successfully sent save add to folder quicksave event")
  }
  const folderItemsRef = collection(db, 'folderItems')
  const docRef = await addDoc(folderItemsRef, folderItem ).catch(error => {throw error})
  const identify = new amplitude.Identify().add('num total save post', 1)
  amplitude.getInstance().identify(identify)
  // console.log('Successfully saved post: ', docRef)

  // Send save complete event to Amplitude
  const firstTimestamp = rootGetters["amplitude/getFirstTimestamp"];
  const lastTimestamp = Date.now();
  const duration = Math.round((lastTimestamp - firstTimestamp) / 1000);
  amplitude.getInstance().logEventWithTimestamp("save - complete", {
    "postId": postData.id,
    duration
  })
  // console.log("Successfully sent save complete event")
  commit("amplitude/clearState", null, {root: true})
}

export async function createFolder ( { commit, rootGetters }, { newFolderName}) {
  const foldersRef = collection (db, 'users', rootGetters["auth/getUser"].uid, 'folders')
  const docRef = await addDoc(foldersRef, {
    createdAt: serverTimestamp(),
    name: newFolderName,
  }).catch(error => {throw error})
  const identify = new amplitude.Identify().add('num total create folder', 1)
  amplitude.getInstance().identify(identify)
  commit('createFolder', {name: newFolderName, id: docRef.id})
  // console.log('Successfully created folder: ', docRef)
}

export async function renameFolder ( { commit, rootGetters }, { newFolderName, folderId } ) {
  const folderRef = doc(db, 'users', rootGetters["auth/getUser"].uid, 'folders', folderId)
  await updateDoc(folderRef, {
    name: newFolderName
  }).catch(error => {throw error})
  // console.log('Successfully updated folder name')
}

export async function setFolders ( { commit, rootGetters } ) {
  const foldersRef = collection (db, 'users', rootGetters["auth/getUser"].uid, 'folders')
  const q = query(foldersRef, orderBy('createdAt', 'desc'))
  const unsubscribeFolders = onSnapshot(q, (querySnapshot) => {
    const folders = []
    querySnapshot.forEach(doc => {
      folders.push({ name: doc.data().name, id: doc.id})
    })
    commit('setFolders', {folders, unsubscribeFolders})
    // console.log('Successfully set folders: ', folders)
  }, (error) => {
    // console.log('Could not subscribe to folders')
    throw error
  })
}

export async function setUnorganizedPosts ( { commit, rootGetters } ) {
  const q = query(folderItemsRef, where('isOrganized', '==', false), where('userId', '==', rootGetters['auth/getUser'].uid), orderBy('createdAt', 'desc'))
  const unsubscribeUnorganizedPosts = onSnapshot(q, (querySnapshot) => {
    const unorganizedPosts = []
    querySnapshot.forEach(doc => {
      unorganizedPosts.push({...doc.data(), id: doc.id})
    })
    commit('setUnorganizedPosts', {unorganizedPosts, unsubscribeUnorganizedPosts})
    // console.log('Successfully set unorganized posts: ', unorganizedPosts)
  }, (error) => {
    // console.log('Could not subscribe to unorganized posts')
    throw error
  })
}

export async function setPosts ( { commit, rootGetters }, folderId ) {
  const q = query(folderItemsRef, where('folder.id', '==', folderId), where('userId', '==', rootGetters["auth/getUser"].uid), orderBy('createdAt', 'desc'))
  const unsubscribePosts = onSnapshot(q, (querySnapshot) => {
    const posts = []
    querySnapshot.forEach(doc => {
      posts.push({...doc.data(), id: doc.id})
    })
    commit('setPosts', {posts, unsubscribePosts})
    // console.log('Successfully set posts: ', posts)
  }, (error) => {
    // console.log('Could not subscribe to posts')
    throw error
  })
}

export async function movePosts ( { commit }, { selectedPostsList, folder } ) {
  for (let index = 0; index < selectedPostsList.length; index++) {
    const feedItemDocRef = doc(db, 'folderItems', selectedPostsList[index])
    await updateDoc(feedItemDocRef, {
      folder: folder,
      isOrganized: true
    }).catch(error => {throw error})
    // console.log('Successfully update unorganized posts')
  }
}

export async function setFolder ( { commit, rootGetters }, folderId ) {
  const folderRef = doc(db, 'users', rootGetters["auth/getUser"].uid, 'folders', folderId);
  const unsubscribeFolder = onSnapshot(folderRef, (doc) => {
    const folder = { name: doc.data().name, id: folderId}
    commit('setFolder', { folder, unsubscribeFolder})
    // console.log('Successfully set folder: ', folder)
  }, (error) => {
    // console.log('Could not subscribe to folder')
    throw error
  })
}

export async function removePosts ( { commit }, removeList) {
  if (removeList && removeList.length > 0) {
    for (let index = 0; index < removeList.length; index++) {
      const docRef = doc(db, 'folderItems', removeList[index])
      await deleteDoc(docRef).catch(error => {throw error})
      const identify = new amplitude.Identify().add('num total save post', -1)
      amplitude.getInstance().identify(identify)
    }
  }
}