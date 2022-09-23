import { collection, doc, where, orderBy, query, getDocs, onSnapshot, setDoc } from "firebase/firestore";
import { db } from "src/boot/firebase";


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
