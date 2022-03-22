export function getNewUser ( state ) {
  return state.newUser
}

export function getIsAuth ( state ) {
  return state.user ? true : false
}

export function getUser (state ) {
  return state.user
}