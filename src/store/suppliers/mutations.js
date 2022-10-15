export function setSupplier ( state, {supplier, unsubscribeSupplier}) {
  state.supplier = supplier;
  state.unsubscribeSupplier = unsubscribeSupplier;
}

export function updateEditedSupplier (state, { field, value }) {
  state.editedSupplier[field] = value
}

export function setSuppliers ( state, suppliers ) {
  state.suppliers = suppliers;
}

export function setProductGroup (state, productGroup) {
  state.productGroup = productGroup
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

export function setSocialMedia (state, socialMedia) {
  state.socialMedia = socialMedia
}


export function setWebsite (state, website) {
  state.website = website
}

export function setContact (state, contact) {
  state.contact = contact
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
  state.contact = '';
  state.socialMedia = {
    link: '',
    type: '',
  }
}

export function clearSupplierData (state) {
  state.updatedSupplierData = null;
}

export function clearEditedSupplier (state) {
  state.editedSupplier = {
    name: '',
      description: '',
      contact: '',
      socialMedia: {
        type: '',
        link: '',
      },
      website: '',
      productGroup: '',
      categories: [],
      emails: [],
  }
}
