import axios from 'axios'

const url = '/api/users'
const urlMeta = '/api/users/meta'

class UserService {
  // Get Users Meta
  static async getUsersMeta () {
    try {
      const res = await axios.get(urlMeta)
      return res.data
    } catch (err) {
      console.log('UserService getUsersMeta error : ' + err)
      return (err)
    }
  }

  // Update Users Meta
  static async updateUsersMeta (body) {
    try {
      const res = await axios.put(urlMeta, body)
      return res.data
    } catch (err) {
      console.log('UserService getUsersMeta error : ' + err)
      return (err)
    }
  }

  // Insert One Field to Users Meta
  static async insertUsersMeta (body) {
    try {
      const res = await axios.post(urlMeta, body)
      return res.data
    } catch (err) {
      console.log('UserService getUsersMeta error : ' + err)
      return (err)
    }
  }

  // Get Users
  static async getUsers () {
    try {
      const res = await axios.get(url)
      return res.data
    } catch (err) {
      console.log('UserService getUsers error : ' + err)
      return (err)
    }
  }

  // Get User by Id
  static async getUser (id) {
    try {
      const res = await axios.get(`${url}/${id}`)
      return res.data
    } catch (err) {
      console.log('UserService getUsers error : ' + err)
      return (err)
    }
  }

  // Create a User
  static async insertUser (body) {
    return axios.post(url, body)
  }

  // Update a User
  // Called from Users.vue with parameters
  // Call then UsersController.js to do a router.put
  static async updateUser (id, body) {
    return axios.put(`${url}/${id}`, body)
  }

  // Delete a User
  static async deleteUser (id) {
    return axios.delete(`${url}/${id}`)
  }
}

export default UserService
