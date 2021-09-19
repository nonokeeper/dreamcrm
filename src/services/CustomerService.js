import axios from 'axios'

const url = process.env.VUE_APP_BASEURL + '/customers'
const urlMeta = process.env.VUE_APP_BASEURL + '/customers/meta'

console.log('CustomerService.js URL : ' + url)
console.log('CustomerService.js NODE_ENV : ' + process.env.NODE_ENV)

class CustomerService {
  // Get Customers Meta
  static async getCustomersMeta () {
    try {
      const res = await axios.get(urlMeta)
      // console.log('CustomerService res : ' + res.data)
      return res.data
    } catch (err) {
      console.log('CustomerService getCustomersMeta error : ' + err)
      return (err)
    }
  }

  // Get Customers
  static async getCustomers () {
    try {
      const res = await axios.get(url)
      return res.data
    } catch (err) {
      console.log('CustomerService getCustomers error : ' + err)
      return (err)
    }
  }

  // Get Customer by Id
  static async getCustomer (id) {
    try {
      const res = await axios.get(`${url}/${id}`)
      return res.data
    } catch (err) {
      console.log('CustomerService getCustomers error : ' + err)
      return (err)
    }
  }

  // Create a Customer
  static insertCustomer (body) {
    return axios.post(url, body)
  }

  // Update a Customer
  // Called from Customers.vue with parameters
  // Call then customersController.js to do a router.put
  static updateCustomer (id, body) {
    return axios.put(`${url}/${id}`, body)
  }

  // Delete a Customer
  static deleteCustomer (id) {
    return axios.delete(`${url}/${id}`)
  }
}

export default CustomerService
