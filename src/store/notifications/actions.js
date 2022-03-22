import { auth, db } from "src/boot/firebase";
import { addDoc, collection, onSnapshot, orderBy, serverTimestamp, query } from "firebase/firestore";

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
    route
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
      notifications.push({
        ...doc.data(),
        id: doc.id
      })
    })
    commit('setNotifications', notifications)
    console.log('Successfully set notifications: ', notifications)
  })
}