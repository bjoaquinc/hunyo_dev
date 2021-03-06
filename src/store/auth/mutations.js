export function setName ( state, name ) {
  state.newUser.name = name
}

export function setEmail ( state, email ) {
  state.newUser.email = email
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