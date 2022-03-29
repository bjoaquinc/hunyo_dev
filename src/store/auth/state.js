import { LocalStorage } from "quasar"

export default function () {
  return {
    newUser: {
      name: '',
      email: '',
      password: ''
    },
    user: null,
    isAuth: false
  }
}
