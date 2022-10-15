export default function () {
  return {
    supplier: null,
    editedSupplier: {
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
    },
    suppliers: [],
    unsubscribeSupplier: null,
    name: "",
    description: "",
    socialMedia: {
      type: '',
      link: '',
    },
    website: "",
    contact: "",
    productGroup: "",
    categories: [],
    emails: [],
    logo: "",
    updatedSupplierData: null,
  }
}
