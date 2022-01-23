import axios from 'axios'

const instance = axios.create({
    baseURL: 'http://localhost:5000/api/'
})

let refreshToken

class LoginService {
    /* Display User infos
    static loadUserInfos() {
        instance.get('me').then((response) => {
            console.log(response.data)
        }).catch((err) => {
            console.log(err.response.status)
        })
    } */
    // LOGIN
    static async login (body) {
      try {
        const res = await instance.post('login', body)
        instance.defaults.headers.common['authorization'] = `Bearer ${res.data.accessToken}`
        refreshToken = res.data.refreshToken
        this.loadUserInfos()
        return res.data
      } catch (err) {
        console.log('LoginService login error : ' + err)
        return (err)
      }
    }
}

instance.interceptors.response.use((response) => {
     return response
}, async (error) => {
    const baseRequest = error.config
    if (baseRequest.url !== '/refreshToken' && error.response.status === 401 && baseRequest._retry !== true) {
        baseRequest._retry = true
        if (refreshToken && refreshToken!== '') {
            instance.defaults.headers.common['authorization'] = `Bearer ${refreshToken}`
            await instance.post('refreshToken').then((res) => {
                console.log('Refresh Token needed')
                instance.defaults.headers.common['authorization'] = `Bearer ${res.data.accessToken}`
                baseRequest.headers.common['authorization'] = `Bearer ${res.data.accessToken}`
            }).catch((err) => {
                console.log(err.response.status)
                refreshToken = null
            })
            return instance(baseRequest)
        }
    }
})

export default LoginService
