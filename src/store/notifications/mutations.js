export function setNotifications ( state, notifications ) {
  state.notifications = notifications
}

export function setCounter ( state, { newCount, unsubscribeCounter } ) {
  state.counter = newCount
  state.unsubscribeCounter = unsubscribeCounter
}