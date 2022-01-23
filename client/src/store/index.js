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
    //console.log('index.js store -- user : ', user)
    //console.log('index.js store -- user firstNae : ', JSON.parse(user).firstName)
    try {
        user = JSON.parse(user)
        //instance.defaults.headers.common['Authorization'] = user.accessToken
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
            //instance.defaults.headers.common['Authorization'] = user.accessToken
            // console.log('index.js Store / Token : ', user.accessToken)
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
            let users = []
            let nbUsers = 0
            instance.get('users')
            .then((res) => {
                users = res.data
                if (users) { nbUsers = users.length }
                if (credentials.username && nbUsers > 0) {
                    // Recover the password for this user based on the username
                    for (let i=0; i<users.length; i++) {
                        if (credentials.username == users[i].username) {
                            credentials.user = users[i]
                            i = users.length
                        }
                    }
                } else {
                    commit('setStatus', 'error_login')
                    return null
                }
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
            })
            .catch((error) => {
                console.log('index.js Store -- catch login error : ', error)
                commit('setStatus', 'error_login')
                return null
            })
        },
        myInfos : (user) => {
            return new Promise( (resolve, reject) => {
                instance.post('/users/me', user).then(response => {
                    resolve(response.data)
                }, error => {
                    reject(error)
                })
            })
        },
        /* no reponse with this method...
        getUserInfos: (user) => {
            instance.post('/users/me', user)
            .then((res) => {
                console.log('index.js Store -- post me ok, res.data : ', res.data)
                resolve(res.data)
                return res.data
            })
            .catch((error) => {
                console.log('index.js Store -- post me error : ', error)
                return null
            })
        } */
    }
})