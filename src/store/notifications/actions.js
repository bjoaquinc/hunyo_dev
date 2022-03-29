import { auth, db } from "src/boot/firebase";
import { addDoc, collection, onSnapshot, orderBy, serverTimestamp, query, updateDoc, setDoc, doc } from "firebase/firestore";

export async function createNotification( { commit }, { content, type, userId, route}) {
  const notificationData = {
    createdAt: serverTimestamp(),
    user: {
      id: auth.currentUser.uid,
      name: auth.currentUser.displayName,
      photo: auth.currentUser.photoURL
    },
    type,
    content: null,
    route,
    userId
  }

  if (content) {
    notificationData.content = content
  }

  const notificationsRef = collection(db, 'users', userId, 'notifications');
  const docRef = await addDoc(notificationsRef, notificationData).catch(error => {throw error})
  if (docRef) {
    console.log('Successfully added a notification: ', docRef)
  }
}

export async function setNotifications( { commit }) {
  const notificationsRef = collection(db, 'users', auth.currentUser.uid, 'notifications')
  const q = query(notificationsRef, orderBy('createdAt', 'desc'))

  onSnapshot(q, (querySnapshot) => {
    const notifications = []
    querySnapshot.forEach(doc => {
      if (doc.id !== 'counter') {
          notifications.push({
          ...doc.data(),
          id: doc.id
        })
      }
    })
    commit('setNotifications', notifications)
    console.log('Successfully set notifications: ', notifications)
  })
}

export function setCounter ( { commit }, userId ) {
  const counterRef = doc(db, 'users', userId, 'notifications', 'counter')
  const unsubscribeCounter = onSnapshot(counterRef, (docSnapshot) => {
    if (docSnapshot.data()) {
      const newCount = docSnapshot.data().value
      commit('setCounter', { newCount, unsubscribeCounter })
    } else {
      throw new Error('Could not find counter')
    } 
  }, (error) => {
    throw error
  })
}

export async function resetCounter ( { commit } ) {
  const counterRef = doc(db, 'users', auth.currentUser.uid, 'notifications', 'counter')
  await updateDoc(counterRef, {
    value: 0
  }).catch(error => {throw error})
  console.log('Successfully reset counter')
}