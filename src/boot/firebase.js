import { initializeApp, getApp } from 'firebase/app'
import { getAnalytics } from 'firebase/analytics'
import { getFirestore, collection, enableIndexedDbPersistence, connectFirestoreEmulator } from 'firebase/firestore'
import { connectStorageEmulator, getStorage, ref } from 'firebase/storage'
import { connectAuthEmulator, getAuth } from 'firebase/auth'
import { connectFunctionsEmulator, getFunctions } from 'firebase/functions'
import { boot } from 'quasar/wrappers'


let firebaseConfig = {
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
const storage = getStorage(firebaseApp)
const auth = getAuth()
const db = getFirestore()
const functions = getFunctions(getApp());

// collection ref
const postsRef = collection(db, 'posts')

// storage ref
const storageRef = ref(storage)
const imagesRef = ref(storage, 'images')

// Connecting to emulators

if (location.hostname === 'localhost') {
  connectFirestoreEmulator(db, 'localhost', 9000);
  connectAuthEmulator(auth, 'http://localhost:9099', { disableWarnings: true });
  connectStorageEmulator(storage, 'localhost', 9199);
  connectFunctionsEmulator(functions, 'localhost', 5001)
} else {
  // Setting offline persistence
  enableIndexedDbPersistence(db, {
    forceOwnership: true
  })
    .catch((err) => {
      if (err.code == 'failed-precondition') {
        // Multiple tabs open, persistence can only be enabled
        // in one tab at a a time.
        // ...
        console.log(err.message)
      } else if (err.code == 'unimplemented') {
        // The current browser does not support all of the
        // features required to enable persistence
        // ...
        console.log(err.message)
      }
      console.log(err.message)
    });
}





// get collection data

export default boot( ({ app }) => {

  app.config.globalProperties.$db = db
  app.config.globalProperties.$postsRef = postsRef
  app.config.globalProperties.auth = auth
  
})

export { postsRef, storageRef, imagesRef, db, auth, storage, functions }

