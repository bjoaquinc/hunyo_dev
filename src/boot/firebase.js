import { initializeApp } from 'firebase/app'
import { getAnalytics } from 'firebase/analytics'
import { getFirestore, collection } from 'firebase/firestore'
import { getStorage, ref } from 'firebase/storage'
import { getAuth } from 'firebase/auth'
import { boot } from 'quasar/wrappers'


const firebaseConfig = {
  apiKey: process.env.API_KEY,
  authDomain: "hunyo-109e6.firebaseapp.com",
  projectId: "hunyo-109e6",
  storageBucket: "hunyo-109e6.appspot.com",
  messagingSenderId: "358811507704",
  appId: "1:358811507704:web:63db252696fee349fc140d",
  measurementId: "G-RRT8VZ821M",
};

// init Firebase and Analytics
const firebaseApp = initializeApp(firebaseConfig);
const analytics = getAnalytics(firebaseApp);

// init services
const db = getFirestore()
const storage = getStorage(firebaseApp)
const auth = getAuth()

// collection ref
const postsRef = collection(db, 'posts')

// storage ref
const storageRef = ref(storage)
const imagesRef = ref(storage, 'images')

// get collection data

export default boot( ({ app }) => {

  app.config.globalProperties.$db = db
  app.config.globalProperties.$postsRef = postsRef
  app.config.globalProperties.auth = auth
  
})

export { postsRef, storageRef, imagesRef, db, auth, storage }
