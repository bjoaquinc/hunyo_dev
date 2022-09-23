import { doc, onSnapshot, serverTimestamp, setDoc, updateDoc, arrayUnion, arrayRemove, collection, getDoc, query, where, getDocs, addDoc, deleteDoc, limit } from "firebase/firestore"
import { deleteObject, getDownloadURL, ref, uploadBytes } from "firebase/storage"
import { db, storage } from "src/boot/firebase"

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

export async function createProduct ( { commit, state, rootGetters }, { productId, supplierId }) {
  const product = {
    createdAt: serverTimestamp(),
    name: state.name,
    categories: state.categories,
    overview: state.overview,
    moreInformation: state.moreInformation,
    website: state.website,
    supplier: {
      name: rootGetters["suppliers/getSupplier"].name,
      id: rootGetters["suppliers/getSupplier"].id,
      logo: rootGetters["suppliers/getSupplier"].logo,
    },
    published: false,
  }
  const docRef = doc(db, "products", productId);
  await setDoc(docRef, product);
}

export async function createProductItem ( { commit, state } ) {
  const colRef = collection(db, 'productItems')
  const data = {
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

export async function uploadFile ( { commit }, { newFiles, supplierId, productId } ) {
  console.log("Uploading files: ", newFiles)
  const data = [];
  // Loop through file list
  for (const newFile of newFiles) {
    console.log(newFile);
    const { name, file } = newFile
    const metadata = {
      contentType: file.type,
    }
    // Upload File
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
  // Remove file from storage
  const storageRef = ref(storage, file.file);
  await deleteObject(storageRef).catch(error => {throw error});
  console.log(`Deleted ${file.name} from storage.`)
  // Remove uploadedFile from firestore doc
  // const uploadedFiles = [...state.product.uploadedFiles];
  // uploadedFiles.splice(index, 1);
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

export async function setProductsInCatalogue ( { commit }, supplierId) {
  const colRef = collection(db, 'productItems')
  const q = query(colRef, where("supplier.id", "==", supplierId), limit(8))
  const docsSnapshot = await getDocs(q).catch(error => {throw error})
  if (!docsSnapshot.empty) {
    const products = [];
    docsSnapshot.forEach(doc => {
      products.push({
        id: doc.id,
        ...doc.data(),
      })
    })
    commit('setProducts', products);
  } else {
    throw new Error('No productItems for this supplier')
  }
}

export async function setSelectedProducts ( { commit }, {supplierId, category} ) {
  const productsRef = collection(db, "productItems");
  const q = query(productsRef, where("supplier.id", "==", supplierId,), where("categories", "array-contains", category));
  const docsSnapshot = await getDocs(q).catch(error => {throw error})
  if (!docsSnapshot.empty) {
    const products = [];
    docsSnapshot.forEach(doc => {
      const product = {id: doc.id, ...doc.data()}
      products.push(product);
    })
    commit('setProducts', products)
  } else {
    commit('setProducts', [])
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
  const productItemsList = []
  const productItemsRef = collection(db, 'productItems')
  console.log(category)
  let q = query(productItemsRef, where('type', '==', 'post'), orderBy("createdAt", "desc"), limit(9))
  if (category && category !== 'All Topics') {
    q = query(productItemsRef, where('type', '==', 'post'), where('categories', 'array-contains', category), orderBy("createdAt", "desc"), limit(9))
  } 
  const querySnapshot = await getDocs(q).catch(error => {throw error})
  querySnapshot.forEach(doc => {
    productItemsList.push({
      ...doc.data(),
      id: doc.id
    })
  })
  const lastVisible = querySnapshot.docs[productItemsList.length - 1]
  console.log('last', lastVisible)
  commit('setFeedItems', {productItemsList, lastVisible, category})
}
