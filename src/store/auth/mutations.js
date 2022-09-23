export function setName ( state, name ) {
  state.newUser.name = name
}

export function setEmail ( state, email ) {
  state.newUser.email = email
}

export function setProfession (state, profession) {
  state.newUser.profession = profession;
}

export function setOtherProfession (state, otherProfession) {
  state.otherProfession = otherProfession
}

export function setPassword ( state, password ) {
  state.newUser.password = password
}

export function setUser ( state, { user, isAuth} ) {
  state.user = user
  state.isAuth = isAuth
}

export function removeUser ( state ) {
  state.user = null
  state.isAuth = false
}

export function logOut ( state ) {
  state.isAuth = !state.isAuth
}

export function setErrorMessage ( state, payload ) {
  state.error = payload.message
}

export function setDesigner( state, {name, email, professionIndex}) {
  const professions = [
    { label: "I am a licensed architect", value: "architect" },
    { label: "I am a licensed interior designer", value: "interiorDesigner" },
    { label: "I work at a design studio", value: "studioEmployee" },
  ]
  state.newUser.name = name;
  state.newUser.profession = professions[professionIndex];
  state.newUser.email = email
}

export function setSupplier ( state, supplier ) {
  state.supplier = supplier
}

export function clearState (state) {
  state.newUser = {
    name: '',
    email: '',
    password: '',
    profession: null
  }
  state.otherProfession = ''
  state.user = null
}
