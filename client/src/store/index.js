import { createStore } from 'vuex'
import customersModule from './modules/customersMeta'
import router from '../router'

const axios = require('axios')

const instance = axios.create({
    baseURL: 'http://localhost:5000/api/'
})

let status = localStorage.getItem('status')
let user = localStorage.getItem('user')

if (!user) {
 user = {
    _id: -1,
    accessToken: '',
  };
} else {
    try {
        user = JSON.parse(user)
    } catch (ex) {
        user = {
        _id: -1,
        accessToken: '',
        };
    }
}

export default createStore({
    modules: {
        customersMeta:customersModule
    },
    state: {
        status: status,
        user: user,
    },
    mutations: {
        setStatus: (state, status) => {
            state.status = status
            localStorage.setItem('status', status)
        },
        logUser: (state, user) => {
            state.user = user
            localStorage.setItem('user', JSON.stringify(user))
        },
        logout: (state) => {
            state.user = {
              _id: -1,
              token: '',
            }
            localStorage.removeItem('user')
            localStorage.setItem('status', '')
            state.status = ''
        }
    },
    actions: {
        login: ({commit}, credentials) => {
            commit('setStatus', 'loading')

            return new Promise((resolve, reject) => {
                instance.post('/login', credentials) // here credentials contains given values (username & password + the corresponding user in mongoDb)
                .then((response) => {
                    commit('setStatus', 'loggedIn')
                    commit('logUser', response.data)
                    resolve(response)
                    router.push('/')
                })
                .catch((error) => {
                    console.log('index.js Store -- catch Promise')
                    commit('setStatus', 'error_login')
                    reject(error)
                })
            })
        },
    }
})