import { db } from "src/boot/firebase";
import { doc, setDoc } from "firebase/firestore";

export async function editContent ( { commit }, { postId, content }) {
  const docRef = doc(db, 'posts', postId);
  await setDoc(docRef, {
    content
  }, {merge: true}).catch(error => {throw error})
  // console.log("Successfully edited doc: ")
}