import { doc, onSnapshot } from "firebase/firestore"
import { db } from "src/boot/firebase"

export async function setProduct ( { commit }, productId ) {
  const productRef = doc(db, 'products', productId)
  console.log("before snapshot", doc)
  console.log(productId)
  return await new Promise((resolve, reject) => {
    const unsubscribeProduct = onSnapshot(productRef, (productDoc) => {
      console.log("inside snapshot")
      if (productDoc.exists) {
        const product = {
          ...productDoc.data(),
          productId,
        }
        commit('setProduct', { product, unsubscribeProduct });
        // console.log('Successfully set post: ', selectedPost)
        resolve(product)
      } else {
        unsubscribeProduct();
        reject('Could not find product.')
      }
    })
  })
}

// export async function editProduct ( { commit }, { postId, title, content } ) {
//   const docRef = doc(db, 'posts', postId)
//   await updateDoc(docRef, {
//     title,
//     content
//   }).catch(error => {throw error})
//   // console.log('Successfully updated post.')
// }

// export async function setPosts ( { commit } ) {
//   const feedItemsRef = collection(db, 'feedItems')
//   const q = query(feedItemsRef, where('type', '==', 'post'), orderBy('createdAt', 'desc'));
//   const docsSnapshot = await getDocs(q)
//   if (docsSnapshot) {
//     const postItems = []
//     docsSnapshot.forEach(doc => {
//       postItems.push({
//         ...doc.data(), id: doc.id
//       })
//     })
//     commit('setLandingPosts', postItems)
//   } else {
//     throw new Error('Could not find posts')
//   }
// }