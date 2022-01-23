import axios from 'axios'

const url = '/api/customers'
const urlMeta = '/api/customers/meta'

//console.log('CustomerService.js NODE_ENV : ' + process.env.NODE_ENV)

class CustomerService {
  // Get Customers Meta
  static async getCustomersMeta () {
    try {
      const res = await axios.get(urlMeta)
      return res.data
    } catch (err) {
      console.log('CustomerService getCustomersMeta error : ' + err)
      return (err)
    }
  }

  // Update Customers Meta
  static async updateCustomersMeta (body) {
    try {
      const res = await axios.put(urlMeta, body)
      return res.data
    } catch (err) {
      console.log('CustomerService getCustomersMeta error : ' + err)
      return (err)
    }
  }

  // Insert One Field to Customers Meta
  static async insertCustomersMeta (body) {
    try {
      const res = await axios.post(urlMeta, body)
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
  static async insertCustomer (body) {
    return axios.post(url, body)
  }

  // Update a Customer
  // Called from Customers.vue with parameters
  // Call then customersController.js to do a router.put
  static async updateCustomer (id, body) {
    return axios.put(`${url}/${id}`, body)
  }

  // Delete a Customer
  static async deleteCustomer (id) {
    return axios.delete(`${url}/${id}`)
  }
}

export default CustomerService
