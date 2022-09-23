export function setSupplier ( state, {supplier, unsubscribeSupplier}) {
  state.supplier = supplier;
  state.unsubscribeSupplier = unsubscribeSupplier;
}

export function setSuppliers ( state, suppliers ) {
  state.suppliers = suppliers;
}

export function addCategory ( state, category) {
  state.categories.push(category);
}

export function removeCategory (state, index) {
  state.categories.splice(index, 1);
}

export function addEmail (state, email) {
  console.log("action triggered")
  state.emails.push(email);
}

export function removeEmail (state, index) {
  state.emails.splice(index, 1);
}

export function setName (state, name) {
  state.name = name;
}

export function setDescription (state, description) {
  state.description = description
}

export function setWebsite (state, website) {
  state.website = website
}

export function setLogo (state, logo) {
  state.logo = logo
}

export function updateSupplierData (state, updatedProperties) {
  let supplierProperties = {};
  if (state.updatedSupplierData) {
    supplierProperties = {...state.updatedSupplierData};
  }
  const keysList = Object.keys(updatedProperties)
  keysList.forEach(key => {
    supplierProperties[key] = updatedProperties[key]
  })
  state.updatedSupplierData = supplierProperties;
}

export function clearSupplier (state) {
  state.supplier = null;
  state.unsubscribeSupplier = null;
}

export function clearCreateSupplier (state) {
  state.name = '';
  state.description = '';
  state.categories = [];
  state.emails = [];
  state.logo = '';
  state.website = '';
}

export function clearSupplierData (state) {
  state.updatedSupplierData = null;
}
