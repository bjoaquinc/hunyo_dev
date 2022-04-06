import { auth, db } from "src/boot/firebase";
import { createUserWithEmailAndPassword, updateProfile, signOut, sendEmailVerification,
signInWithEmailAndPassword, onAuthStateChanged, sendPasswordResetEmail, updatePassword, reauthenticateWithCredential } from "firebase/auth";
import { setDoc, doc, serverTimestamp} from 'firebase/firestore'
import { LocalStorage } from "quasar";
import amplitude from "amplitude-js";

export function setUser ( { commit, dispatch, rootGetters } ) {
  onAuthStateChanged(auth, async (user) => {
    if (user) {
      // User is signed in, see docs for a list of available properties
      // https://firebase.google.com/docs/reference/js/firebase.User
      console.log('Auth state triggered')
      LocalStorage.set('user', user)
      amplitude.getInstance().setUserId(user.uid)
      await dispatch('profile/setUserData', user.uid, { root: true })
      commit('setUser', {
        user: user,
        isAuth: true
      })
      // ...
    } else {
      LocalStorage.remove('user')
      console.log('This user is signed out.')
    }
  });
}

export async function checkUser ( { commit } ) {
  const localUserData = LocalStorage.getItem('user')
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

export async function createUser ( { commit }, { email, password, name }) {
  if ( email && password && name ) {
    const nameList = name.split(" ")
    const firstName = nameList[0]
    const lastName = nameList.at(-1)
    const response = await createUserWithEmailAndPassword(auth, email, password).catch(error => {throw error})
    if (response) {
      const user = response.user
      await updateProfile(user, {
        displayName: name,
        photoURL:
          "https://firebasestorage.googleapis.com/v0/b/hunyo-109e6.appspot.com/o/profile_pics%2Fdefault.png?alt=media&token=6311df79-fcb6-4245-8e84-c1afb9ed459f",
      }).catch(error => {throw error})
      await setDoc(doc(db, 'users', user.uid), {
        createdAt: serverTimestamp(),
        email: email,
        id: user.uid,
        displayName: name,
        photoURL:
          "https://firebasestorage.googleapis.com/v0/b/hunyo-109e6.appspot.com/o/profile_pics%2Fdefault.png?alt=media&token=6311df79-fcb6-4245-8e84-c1afb9ed459f",
        profession: '',
        licenseNumber: '',
        birthdate: null,
        experience: null,
        employerName: '',
        employerSize: '',
        location: '',
        website: '',
        bio: '',
        hasSignedGuidelines: false,
        following: 0,
        followers: 0,
      }).catch(error => {throw error})
      await setDoc(doc(db, 'registrations', user.uid), {
        firstName,
        lastName,
        emailAddress: email
      })
      console.log('Successfully created User: ', user, user.uid)
    } else {
      throw new Error('Could not complete signup')
    }
  }
}

export async function updateUserName ( { commit }, name ) {
  await updateProfile(auth.currentUser, {
      displayName: name,
    }).catch(error => {throw error})
}


export async function verifyEmail ( { commit }) {
  const user = auth.currentUser

  if (user && !user.emailVerified) {
    await sendEmailVerification(user, {
      url: 'https://hunyo.com/#/',
    }).then(() => console.log('Successfully sent email')).catch(error => {
      throw error
    })
  } else {
    throw new Error('Could not send verification email.')
  }
}

export async function signIn ( { commit }, { email, password}) {
  const response = await signInWithEmailAndPassword(auth, email, password).catch(error => {throw error})
  if (response) {
    console.log('response: ', response)
    const user = response.user
    if (user.emailVerified) {
      console.log('verified', user.emailVerified)
      commit('setUser', {
        user,
        isAuth: true
      })
      console.log('Successfully signed in: ', user)
    } else {
      throw new Error('User not verified')
    }
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
  await sendPasswordResetEmail(auth, email, {
      url: 'https://hunyo.com/#/',
    }).catch(error => {throw error})
}


export async function changePassword ( { commit }, newPassword ) {
  const user = auth.currentUser
  await updatePassword(user, newPassword).catch(error => {throw error})
}

export async function reauthenticateUser ( { commit }, { email, password }) {
  reauthenticateWithCredential(auth.currentUser, )
}
