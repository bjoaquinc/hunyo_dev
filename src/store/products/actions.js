import { doc, onSnapshot, serverTimestamp, setDoc, updateDoc, arrayUnion, arrayRemove, collection, getDoc,
  startAfter, query, where, getDocs, addDoc, deleteDoc, limit, orderBy } from "firebase/firestore"
import { deleteObject, getDownloadURL, ref, uploadBytes } from "firebase/storage"
import { db, storage } from "src/boot/firebase"
import { Platform } from 'quasar'

export async function setProduct ( { commit }, productId ) {
  const productRef = doc(db, 'products', productId)
  console.log(productId)
  return await new Promise((resolve, reject) => {
    const unsubscribeProduct = onSnapshot(productRef, (productDoc) => {
      if (productDoc.exists()) {
        const product = {
          ...productDoc.data(),
          id: productDoc.id,
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

export async function createProduct ( { commit, state, rootGetters }, { productId }) {
  const supplier = rootGetters["suppliers/getSupplier"];
  const product = {
    createdAt: serverTimestamp(),
    name: state.name,
    categories: state.categories,
    overview: state.overview,
    moreInformation: state.moreInformation,
    website: state.website,
    supplier: {
      name: supplier.name,
      id: supplier.id,
      logo: supplier.logo,
      productGroup: supplier.productGroup,
      overviewKeys: supplier.overviewKeys
    },
    published: false,
  }
  const docRef = doc(db, "products", productId);
  await setDoc(docRef, product);
}

export async function editProduct ( { commit, state }) {
  const productRef = doc(db, 'products', state.product.id);
  await updateDoc(productRef, {...state.editedProduct});
  console.log("Successfully edited Product");
}

export async function createProductItem ( { commit, state } ) {
  const colRef = collection(db, 'productItems')
  const data = {
    createdAt: serverTimestamp(),
    supplier: {...state.product.supplier},
    photo: state.product.imagesList[0],
    name: state.product.name,
    categories: state.product.categories,
    productId: state.product.id,
  }
  await addDoc(colRef, data).catch(error => {throw error})
  console.log('Successfully created product item')
}

export async function updateProduct ( _, { productId, data }) {
  const docRef = doc(db, 'products', productId);
  await updateDoc(docRef, data).catch(error => {throw error})
}

export async function uploadFiles ( { commit }, { newFiles, supplierId, productId } ) {
  console.log("Uploading files: ", newFiles)
  const data = [];
  // Loop through file list
  for (let newFile of newFiles) {
    console.log(newFile);
    const { name, file } = newFile
    const metadata = {
      contentType: file.type,
    }
    // Upload File
    if (!newFile.cascading) {
      const filePath = `product_downloadables/${supplierId}/${productId}/${name}`
      const storageRef = ref(storage, filePath)
      await uploadBytes(storageRef, file, metadata);
      const downloadURL = await getDownloadURL(ref(storage, filePath));
      data.push({
        name,
        type: file.type,
        size: file.size,
        file: downloadURL
      })
    } else {
      data.push(newFile)
    }
  }
  // Update Firestore doc data
  console.log('Uploading data to firestore doc: ', data)
  const docRef = doc(db, 'products', productId);
  for (const dataObject of data) {
    await updateDoc(docRef, {
      uploadedFiles: arrayUnion(dataObject)
    }).catch(error => {throw error})
  }
  console.log('Successfully uploaded data');
}

export async function removeUploadedFile({ commit, state }, { productId, file, index }) {
  if (!file.cascading) {
    // Remove file from storage
    const storageRef = ref(storage, file.file);
    await deleteObject(storageRef).catch(error => {throw error});
    console.log(`Deleted ${file.name} from storage.`)
  };
  // Remove file from database
  const docRef = doc(db, 'products', productId);
  await updateDoc(docRef, {
    uploadedFiles: arrayRemove(file),
  })
  console.log(`Removed ${file.name} from database`)
}

export async function deleteProduct ( _, productId) {
  const docRef = doc(db, 'products', productId);
  await deleteDoc(docRef).catch(error => {throw error});
  console.log("Deleted product successfully")
}

export async function setProductsInCatalogue ( { commit }, {supplierId, category}) {
  const colRef = collection(db, 'productItems')
  console.log(supplierId)
  let q = query(colRef, where("supplier.id", "==", supplierId), orderBy("createdAt"), limit(8))
  if (category) {
    q = query(colRef, where("supplier.id", "==", supplierId,), where("categories", "array-contains", category), orderBy("createdAt"), limit(8));
  }
  const docsSnapshot = await getDocs(q).catch(error => {throw error})
  if (!docsSnapshot.empty) {
    const products = [];
    docsSnapshot.forEach(doc => {
      products.push({
        id: doc.id,
        ...doc.data(),
      })
    })
    commit('setProductsInCatalogue', products);
    const lastVisible = docsSnapshot.docs[docsSnapshot.docs.length - 1]
    console.log(lastVisible);
    return lastVisible
  } else {
    commit('setProductsInCatalogue', [])
    throw new Error("Could not find products")
  }
}

export async function setNextProductsInCatalogue ( { commit }, {supplierId, category, lastVisible}) {
  const colRef = collection(db, 'productItems')
  let next = query(colRef, where("supplier.id", "==", supplierId), orderBy("createdAt"), startAfter(lastVisible), limit(8))
  if (category) {
    next = query(colRef, where("supplier.id", "==", supplierId,), where("categories", "array-contains", category), orderBy("createdAt"), startAfter(lastVisible), limit(8));
  }
  const docsSnapshot = await getDocs(next).catch(error => {throw error})
  if (!docsSnapshot.empty) {
    const products = [];
    docsSnapshot.forEach(doc => {
      products.push({
        id: doc.id,
        ...doc.data(),
      })
    })
    commit('setNextProductsInCatalogue', products);
    lastVisible = docsSnapshot.docs[docsSnapshot.docs.length - 1];
    console.log("newLast", lastVisible)
    return lastVisible;
  } else {
    throw new Error("Could not find products")
  }
}

export async function updateHighlightedProducts ( {commit }, { products, supplierId }) {
  console.log(products, supplierId)
  const highlightedProducts = []
  for (const {productId, index} of products) {
    const docRef = doc(db, 'products', productId);
    const docSnapshot = await getDoc(docRef).catch(error => {throw error})
    if (docSnapshot.exists()) {
      const { imagesList } = docSnapshot.data();
      const id = docSnapshot.id
      highlightedProducts.push({
        id,
        image: imagesList[index],
        index,
      })
    } else {
      throw new Error(`Could not find document with id ${productId}`)
    }
  }
  const supplierRef = doc(db, 'suppliers', supplierId);
  await updateDoc(supplierRef, {
    highlightedProducts
  }).catch(error => {throw error})
  console.log("Successfully updated highlighted products")
}

export async function setProductItems ({ commit }, category ) {
  const productItemsRef = collection(db, 'productItems')
  console.log(category)
  let productItemsQuantity = 10
  if (Platform.is.desktop) {
    productItemsQuantity = 9
  }
  let q = query(productItemsRef, orderBy("createdAt", "desc"), limit(productItemsQuantity))
  if (category && category !== 'All Categories') {
    q = query(productItemsRef, where('supplier.productGroup', '==', category), orderBy("createdAt", "desc"), limit(productItemsQuantity))
  } 
  const querySnapshot = await getDocs(q).catch(error => {throw error})
  if (!querySnapshot.empty) {
    const productItemsList = []
    querySnapshot.forEach(doc => {
      productItemsList.push({
        ...doc.data(),
        id: doc.id
      })
    })
    const lastVisible = querySnapshot.docs[querySnapshot.docs.length - 1]
    console.log('last', lastVisible)
    commit('setProductItems', {productItemsList, lastVisible, category})
    return lastVisible
  } else {
    throw new Error('Could not find any products');
  }
}

export async function setNextProductItems( { commit, state }, lastVisible) {
  const category = state.category
  const colRef = collection(db, 'productItems');
  let docLimit = 10
  if (Platform.is.desktop) {
    docLimit = 9
  }
  let next = query(colRef, orderBy('createdAt', 'desc'), limit(docLimit), startAfter(lastVisible));
  if (category && category !== 'All Categories') {
    next = query(colRef, where('supplier.productGroup', '==', category), orderBy('createdAt', 'desc'), startAfter(lastVisible), limit(docLimit));
  }
  const querySnapshot = await getDocs(next).catch(error => {throw error});
  if (!querySnapshot.empty) {
    const products = []
    querySnapshot.forEach(productDoc => {
      console.log('productDoc', productDoc)
      const product = {
        id: productDoc.id,
        ...productDoc.data()
      }
      products.push(product);
    })
    const updatedLastVisible = querySnapshot.docs[querySnapshot.docs.length -1]
    commit('setNextProductItems', {
      productItemsList: products,
      lastVisible: updatedLastVisible
    })
    return updatedLastVisible
  } else {
    throw new Error('No products available')
  }
}
