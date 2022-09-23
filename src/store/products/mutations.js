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

export function setOverview ( state, {key, value} ) {
  const overview = { ...state.overview }
  overview[key] = value
  state.overview = overview
}

export function removeOverview ( state, key ) {
  const overview = {...state.overview}
  delete overview[key]
  console.log(overview)
  state.overview = overview
}

export function setMoreInformation ( state, moreInformation ) {
  state.moreInformation = moreInformation;
}

export function setWebsite ( state, website ) {
  state.website = website
}

export function setProducts ( state, products) {
  state.products = products
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
