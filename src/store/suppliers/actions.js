import { collection, doc, where, orderBy, query, getDocs, onSnapshot, setDoc, updateDoc, arrayUnion, arrayRemove } from "firebase/firestore";
import { deleteObject, getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { db, storage } from "src/boot/firebase";


export async function setSupplier ( { commit }, supplierId ) {
  return await new Promise(( resolve, reject ) => {
    const unsubscribeSupplier = onSnapshot(doc(db, 'suppliers', supplierId), (doc) => {
      if (doc.exists()) {
        const supplier = {...doc.data(), id: doc.id}
        resolve(supplier)
        commit("setSupplier", {supplier, unsubscribeSupplier})
      } else {
        console.log(`Could not find supplier with id ${supplierId}`);
        unsubscribeSupplier();
      }
      // console.log('Successfully set Supplier: ', supplier)
    }, (error) => {
      // console.log('Could not subscribe to supplier')
      reject(error)
    })
  })
}

export async function setSuppliers ({ commit }) {
  const suppliersRef = collection(db, 'suppliers');
  const supplierDocs = await getDocs(suppliersRef).catch(error => {throw error})
  if (!supplierDocs.empty) {
    const suppliers = []
    supplierDocs.forEach(supplierDoc => {
      const {name, logo} = supplierDoc.data();
      const id = supplierDoc.id
      const supplier = {name, logo, id}
      suppliers.push(supplier)
    })
    commit('setSuppliers', suppliers);
  }

}

export async function updateSupplierDoc ( {commit, state}, supplierId) {
  const updatedSupplierData = state.updatedSupplierData;
  const docRef = doc(db, 'suppliers', supplierId);
  await setDoc(docRef, updatedSupplierData, {merge: true});
}

export async function uploadFiles ({ commit, state }, {files}) {
  const supplierId = state.supplier.id
  const uploadedFiles = [];
  for (let file of files) {
    const metadata = {
      contentType: file.type,
    }
    const filePath = `supplier_downloadables/${supplierId}/${file.name}`
    const storageRef = ref(storage, filePath)
    await uploadBytes(storageRef, file.file, metadata)
    const downloadURL = await getDownloadURL(storageRef);
    uploadedFiles.push({
      file: downloadURL,
      name: file.name,
      type: file.type,
      size: file.size,
      cascading: true,
    });
  }
  const docRef = doc(db, 'suppliers', supplierId);
  await updateDoc(docRef, {
    uploadedFiles: arrayUnion(...uploadedFiles),
  }).catch(error => {throw error});
  commit('updateEditedSupplier', {
    field: 'uploadedFiles',
    value: [...state.supplier.uploadedFiles]
  })
}

export async function removeFile ({ commit, state }, file) {
  // Remove from storage
  const storageRef = ref(storage, file.file)
  await deleteObject(storageRef).catch(error => {throw error});
  // Remove from Firestore database
  const supplierId = state.supplier.id
  const docRef = doc(db, 'suppliers', supplierId);
  await updateDoc(docRef, {
    uploadedFiles: arrayRemove(file),
  }).catch(error => {throw error});
  // Update edited supplier data
  commit("updateEditedSupplier", {
    field: 'uploadedFiles',
    value: [...state.supplier.uploadedFiles],
  })
}
