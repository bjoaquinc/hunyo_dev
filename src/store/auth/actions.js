import { auth, db } from "src/boot/firebase";
import { createUserWithEmailAndPassword, updateProfile, signOut, sendEmailVerification,
signInWithEmailAndPassword, onAuthStateChanged, sendPasswordResetEmail, updatePassword, reauthenticateWithCredential } from "firebase/auth";
import { setDoc, doc, updateDoc, serverTimestamp} from 'firebase/firestore'
import { LocalStorage } from "quasar";

export function setUser ( { commit } ) {
  onAuthStateChanged(auth, (user) => {
    if (user) {
      // User is signed in, see docs for a list of available properties
      // https://firebase.google.com/docs/reference/js/firebase.User
      console.log('Auth state triggered')
      LocalStorage.set('userData', user)
      commit('setUser', {
        user: user,
        isAuth: true
      })
      // ...
    } else {
      LocalStorage.remove('userData')
      console.log('This user is signed out.')
    }
  });
}

export async function checkUser ( { commit } ) {
  const localUserData = LocalStorage.getItem('userData')
  if (localUserData === null) {
    commit('setUser', { 
      user: localUserData,
      isAuth: false
    })
  } else {
    commit('setUser', {
      user: localUserData,
      isAuth: true
    })
  }
  
}

export async function createUser ( { commit }, { email, password }) {
  if ( email, password ) {
    const response = await createUserWithEmailAndPassword(auth, email, password)
    if (response) {
      const user = response.user
      console.log('Successfully created User: ', user, user.uid)
      await setDoc(doc(db, 'users', user.uid), {
        createdAt: serverTimestamp(),
        email: email,
        id: user.uid
      })
    } else {
      throw new Error('Could not complete signup')
    }
  }
}

export async function updateUser ( { commit }, name) {
  await updateProfile(auth.currentUser, {
    displayName: name,
    photoURL:
      "https://firebasestorage.googleapis.com/v0/b/hunyo-109e6.appspot.com/o/profile_pics%2Fdefault.png?alt=media&token=6311df79-fcb6-4245-8e84-c1afb9ed459f",
    hasSignedGuidelines: false  
  }).then(() => {console.log('Successfully updated User: ', auth.currentUser)}).catch( error => {
    throw error
  })
  await updateDoc(doc(db, 'users', auth.currentUser.uid), {
    displayName: name,
    photoURL:
      "https://firebasestorage.googleapis.com/v0/b/hunyo-109e6.appspot.com/o/profile_pics%2Fdefault.png?alt=media&token=6311df79-fcb6-4245-8e84-c1afb9ed459f",
  }).catch(error => {
    throw error
  })

}

export async function verifyEmail ( { commit }) {
  const user = auth.currentUser

  if (user && !user.emailVerified) {
    await sendEmailVerification(user, {
      url: 'http://localhost:8080/',
    }).then(() => console.log('Successfully sent email')).catch(error => {
      throw error
    })
  } else {
    throw new Error('Could not send verification email.')
  }
}

export async function signIn ( { commit }, { email, password}) {
  const response = await signInWithEmailAndPassword(auth, email, password)
  if (response) {
    const user = response.user
    commit('setUser', {
      user,
      isAuth: true
    })
    console.log('Successfully signed in: ', user)
  } else {
    throw new Error('Could not complete sign in.')
  }
}



export async function signout ( { commit } ) {
  await signOut(auth).catch(error => {
    throw error
  })
  commit('removeUser')
  console.log('Successfully signed out.')
}


export async function resetPasswordEmail ( { commit }, email ) {
  await sendPasswordResetEmail(auth, email).catch(error => {throw error})
}


export async function changePassword ( { commit }, newPassword ) {
  const user = auth.currentUser
  await updatePassword(user, newPassword).catch(error => {throw error})
}

export async function reauthenticateUser ( { commit }, { email, password }) {
  reauthenticateWithCredential(auth.currentUser, )
}