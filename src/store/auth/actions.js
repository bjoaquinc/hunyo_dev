import { auth, db } from "src/boot/firebase";
import { createUserWithEmailAndPassword, updateProfile, signOut, sendEmailVerification,
signInWithEmailAndPassword, onAuthStateChanged, sendPasswordResetEmail, updatePassword, 
updateEmail, getAuth, reauthenticateWithCredential } from "firebase/auth";
import { setDoc, doc, serverTimestamp, getDoc} from 'firebase/firestore'
import { LocalStorage } from "quasar";
import amplitude from "amplitude-js";

export function setUser ( { commit, dispatch, rootGetters } ) {
  onAuthStateChanged(auth, async (user) => {
    if (user) {
      // console.log('Auth state triggered')
      LocalStorage.set('user', user)
      amplitude.getInstance().setUserId(user.uid)
      await dispatch('profile/setUserData', user.uid, { root: true })
      if (LocalStorage.getItem('sessionId') !== amplitude.getInstance().getSessionId()) {
        // console.log("New Session")
        LocalStorage.set('sessionId', amplitude.getInstance().getSessionId())
        // increment num total sessions
        var identify = new amplitude.Identify().add('num total sessions', 1)
        amplitude.getInstance().identify(identify)
      } else {
        // console.log("Same Session")
      }
      commit('setUser', {
        user: user,
        isAuth: true
      })
      await dispatch('folder/setFolders', null, { root: true})
      await dispatch('subscriptions/setFollowersList', null, { root: true })
      await dispatch('subscriptions/setFollowingList', null, { root: true })
      // ...
    } else {
      LocalStorage.remove('user')
      // console.log('This user is signed out.')
    }
  });
}

export function updateUser ( { commit }) {
  const auth = getAuth();
  const user = auth.currentUser;
  if (user) {
    LocalStorage.set('user', user)
    commit('setUser', {
      user: user,
      isAuth: true
    })
  } else {
    return console.log("No user")
  }
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

export async function createUser ( { commit }, { email, password, name, profession }) {
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
        profession: profession.value,
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
      // console.log('Successfully created User: ', user, user.uid)
      // Set Amplitude User Properties
      const userProperties = {
        'member profile info': {
          'profession': null,
          'is verified': false,
          'years of experience': null,
          'employer': null,
          'birthdate': null,
          'company size': null,
          'location': null,
          'has website': false,
          'has bio': false,
          'has profile picture': false,
          '# of years of experience': null,
        },
        'subscribers': 0,
        'subscribed to': 0,
        'num total sessions': 0,
        'num total create comment': 0,
        'num total create post': 0,
        'num total view post': 0,
        'num total create folder': 0,
        'num total save post': 0,
        'num total receive comment': 0,
        'num total receive views': 0,
        'num total receive save': 0,
        'num total unorganized posts': 0,
      }
      amplitude.getInstance().setUserProperties(userProperties)
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

export async function verifyEmail ( { commit } ) {
  const auth = getAuth();
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

export async function changeEmail ( { commit, state, dispatch }, email) {
  const auth = getAuth();
  await updateEmail(auth.currentUser, email).catch(error => {throw error});
  await setDoc(doc(db, 'registrations', state.user.uid), {
    emailAddress: email
  }, {merge: true});
  await dispatch('profile/updateUserData', {email}, {root: true}).catch(error => {throw error});
}

export async function signIn ( { commit }, { email, password}) {
  const response = await signInWithEmailAndPassword(auth, email, password).catch(error => {throw error})
  if (response) {
    // console.log('response: ', response)
    const user = response.user
    if (user.emailVerified) {
      // console.log('verified', user.emailVerified)
      commit('setUser', {
        user,
        isAuth: true
      })
      // console.log('Successfully signed in: ', user)
    } else {
      throw new Error('User not verified')
    }
  } else {
    throw new Error('Could not complete sign in.')
  }
}

export async function signout ( { commit, rootGetters } ) {
  const unsubscribeFolders = rootGetters['folder/getUnsubscribeFolders'];
  const unsubscribeUser = rootGetters['profile/getUnsubscribeUser']
  const unsubscribeFollowers = rootGetters['subscriptions/getUnsubscribeFollowers'] 
  const unsubscribeFollowing = rootGetters['subscriptions/getUnsubscribeFollowing']
  await signOut(auth).catch(error => {
    throw error
  })
  if (unsubscribeUser) unsubscribeUser();
  // console.log('Unsubscribed from user')
  if (unsubscribeFolders) unsubscribeFolders();
  // console.log('Unsubscribed from folders')
  if (unsubscribeFollowers) unsubscribeFollowers();
  // console.log('Unsubscribed from followers')
  if (unsubscribeFollowing) unsubscribeFollowing();
  // console.log('Unsubscribed from folders')
  commit('profile/clearStateUserData', null, { root: true })
  commit('folder/clearStateFolders', null, { root: true })
  commit('subscriptions/clearStateFollowingFollowers', null, { root: true })
  commit('removeUser')
  // console.log('Successfully signed out.')
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

export async function setDesigner ( { commit }, designerId) {
  const docRef = doc(db, 'invitedDesigners', designerId);
  const designerDoc = await getDoc(docRef);
  if (designerDoc.exists()) {
    const designer = {...designerDoc.data(), id: designerDoc.id};
    commit('setDesigner', designer)
    return designer
  } else {
    throw new Error('Could not find designer')
  }
}

export async function setSupplier ( { commit }, supplierId) {
  const docRef = doc(db, 'supplierInvites', supplierId);
  const supplierDoc = await getDoc(docRef);
  if (supplierDoc.exists()) {
    const supplier = {...supplierDoc.data(), id: supplierDoc.id};
    commit('setSupplier', supplier)
  } else {
    throw new Error('Could not find supplier.')
  }
}
