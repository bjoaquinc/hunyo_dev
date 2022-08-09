export function setProduct ( state, { product, unsubscribeProduct } ) {
  state.product = product
  state.unsubscribeProduct = unsubscribeProduct
}