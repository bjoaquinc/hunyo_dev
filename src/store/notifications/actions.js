import { auth, db } from "src/boot/firebase";
import { addDoc, collection, onSnapshot, orderBy, serverTimestamp, query, updateDoc, setDoc, doc } from "firebase/firestore";

export async function createNotification( { commit, rootGetters }, { content, type, userId, route}) {
  const notificationData = {
    createdAt: serverTimestamp(),
    user: {
      name: rootGetters["profile/getUserData"].displayName,
      id: rootGetters["auth/getUser"].uid,
      photo: rootGetters["profile/getUserData"].photoURL,
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
    // console.log('Successfully added a notification: ', docRef)
  }
}

export async function setNotifications( { commit, rootGetters }) {
  const notificationsRef = collection(db, 'users', rootGetters['auth/getUser'].uid, 'notifications')
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
    // console.log('Successfully set notifications: ', notifications)
  })
}