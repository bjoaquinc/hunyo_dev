export function setProduct ( state, { product, unsubscribeProduct } ) {
  state.product = product
  state.unsubscribeProduct = unsubscribeProduct
}

export function setProductData ( state, { categories, name, overview, moreInformation, website } ) {
  state.categories = categories;
  state.name = name;
  state.overview = overview;
  state.moreInformation = moreInformation;
  state.website = website;
}

export function setCategories ( state, categories ) {
  state.categories = categories;
}

export function setName ( state, name ) {
  state.name = name;
}

export function setOverview ( state, overview ) {
  state.overview = {...overview}
}

export function removeOverview ( state, key ) {
  const overview = {...state.overview}
  delete overview[key]
  state.overview = overview
}

export function setMoreInformation ( state, moreInformation ) {
  state.moreInformation = moreInformation;
}

export function setWebsite ( state, website ) {
  state.website = website
}

export function setProductsInCatalogue ( state, products) {
  state.productsInCatalogue = products
}

export function setNextProductsInCatalogue (state, products) {
  products.forEach(product => {
    state.productsInCatalogue.push(product)
  })
}

export function setProductItems ( state, {productItemsList, lastVisible, category}) {
  state.products = [productItemsList]
  state.lastVisible = lastVisible
  state.category = category
}
export function setNextProductItems ( state, {productItemsList, lastVisible}) {
  state.products.push(productItemsList)
  state.lastVisible = lastVisible
}

export function updateEditedProduct ( state, { field, value } ) {
  state.editedProduct[field] = value
} 

export function clearState (state) {
  state.product = null;
  state.unsubscribeProduct = null;
  state.name = '';
  state.categories = [];
  state.overview = null;
  state.moreInformation = '';
  state.website = '';
  console.log('Cleared products state')
}

export function clearProducts (state) {
  state.products = null
}

export function clearProductsInCatalogue (state) {
  state.productsInCatalogue = []
}

export function clearEditProduct (state) {
  state.editedProduct = {
    name: '',
    overview: null,
    moreInformation: '',
  }
}
