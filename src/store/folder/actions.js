import { db, auth } from "src/boot/firebase";
import { addDoc, collection, serverTimestamp, query, getDocs, where, updateDoc, onSnapshot, doc, orderBy, deleteDoc } from "firebase/firestore";
import folder from ".";

const folderItemsRef = collection(db, 'folderItems')

export async function savePost ( { commit }, { postData, folder}) {
  const folderItem = {
    createdAt: serverTimestamp(),
    postData,
    userId: auth.currentUser.uid,
    isOrganized: false
  }
  if (folder) {
    folderItem.folder = folder
    folderItem.isOrganized = true
  }
  const folderItemsRef = collection(db, 'folderItems')
  const docRef = await addDoc(folderItemsRef, folderItem ).catch(error => {throw error})
  console.log('Successfully saved post: ', docRef)
}

export async function createFolder ( { commit }, { newFolderName}) {
  const foldersRef = collection (db, 'users', auth.currentUser.uid, 'folders')
  const docRef = await addDoc(foldersRef, {
    createdAt: serverTimestamp(),
    name: newFolderName,
  }).catch(error => {throw error})
  commit('createFolder', {name: newFolderName, id: docRef.id})
  commit('clearState')
  console.log('Successfully created folder: ', docRef)
}

export async function renameFolder ( { commit }, { newFolderName, folderId } ) {
  const folderRef = doc(db, 'users', auth.currentUser.uid, 'folders', folderId)
  await updateDoc(folderRef, {
    name: newFolderName
  }).catch(error => {throw error})
  commit('clearState')
  console.log('Successfully updated folder name')
}

export async function setFolders ( { commit } ) {
  const foldersRef = collection (db, 'users', auth.currentUser.uid, 'folders')
  const q = query(foldersRef, orderBy('createdAt', 'desc'))
  const unsubscribeFolders = onSnapshot(q, (querySnapshot) => {
    const folders = []
    querySnapshot.forEach(doc => {
      folders.push({ name: doc.data().name, id: doc.id})
    })
    commit('setFolders', {folders, unsubscribeFolders})
    console.log('Successfully set folders: ', folders)
  }, (error) => {
    console.log('Could not subscribe to folders')
    throw error
  })
  // const docsSnapshot = await getDocs(foldersRef).catch(error => {throw error})
  // if (docsSnapshot) {
  //   docsSnapshot.forEach(doc => folders.push({ name: doc.data().name, id: doc.id}))
  // }
  // commit('setFolders', folders)
  // console.log('Successfully set folders: ', folders)
}

export async function setUnorganizedPosts ( { commit } ) {
  const q = query(folderItemsRef, where('isOrganized', '==', false), where('userId', '==', auth.currentUser.uid), orderBy('createdAt', 'desc'))
  const unsubscribeUnorganizedPosts = onSnapshot(q, (querySnapshot) => {
    const unorganizedPosts = []
    querySnapshot.forEach(doc => {
      unorganizedPosts.push({...doc.data(), id: doc.id})
    })
    commit('setUnorganizedPosts', {unorganizedPosts, unsubscribeUnorganizedPosts})
    console.log('Successfully set unorganized posts: ', unorganizedPosts)
  }, (error) => {
    console.log('Could not subscribe to unorganized posts')
    throw error
  })
  // const docsSnapshot = await getDocs(q).catch(error => {throw error})
  // if (docsSnapshot) {
  //   docsSnapshot.forEach(doc => unorganizedPosts.push({...doc.data(), id: doc.id}))
  // }
  // commit('setUnorganizedPosts', unorganizedPosts)
  // console.log('Successfully set unorganized posts: ', unorganizedPosts)
}

export async function setPosts ( { commit }, folderId ) {
  const q = query(folderItemsRef, where('folder.id', '==', folderId), where('userId', '==', auth.currentUser.uid), orderBy('createdAt', 'desc'))
  const unsubscribePosts = onSnapshot(q, (querySnapshot) => {
    const posts = []
    querySnapshot.forEach(doc => {
      posts.push({...doc.data(), id: doc.id})
    })
    commit('setPosts', {posts, unsubscribePosts})
    console.log('Successfully set posts: ', posts)
  }, (error) => {
    console.log('Could not subscribe to posts')
    throw error
  })
  // const docsSnapshot = await getDocs(q).catch(error => {throw error})
  // if (docsSnapshot) {
  //   docsSnapshot.forEach(doc => posts.push({...doc.data(), id: doc.id}))
  //   commit('setPosts', posts)
  //   console.log('Successfully set posts: ', posts)
  // } else {
  //   throw new Error('Could not find posts.')
  // }
}

export async function movePosts ( { commit }, { selectedPostsList, folder } ) {
  for (let index = 0; index < selectedPostsList.length; index++) {
    const feedItemDocRef = doc(db, 'folderItems', selectedPostsList[index])
    await updateDoc(feedItemDocRef, {
      folder: folder,
      isOrganized: true
    }).catch(error => {throw error})
    commit('clearState')
    console.log('Successfully update unorganized posts')
  }
}

export async function setFolder ( { commit }, folderId ) {
  const folderRef = doc(db, 'users', auth.currentUser.uid, 'folders', folderId);
  const unsubscribeFolder = onSnapshot(folderRef, (doc) => {
    const folder = { name: doc.data().name, id: folderId}
    commit('setFolder', { folder, unsubscribeFolder})
    console.log('Successfully set folder: ', folder)
  }, (error) => {
    console.log('Could not subscribe to folder')
    throw error
  })
}

export async function removePosts ( { commit }, removeList) {
  if (removeList && removeList.length > 0) {
    for (let index = 0; index < removeList.length; index++) {
      const docRef = doc(db, 'folderItems', removeList[index])
      await deleteDoc(docRef).catch(error => {throw error})
    }
  }
}