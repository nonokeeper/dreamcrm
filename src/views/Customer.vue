<template>

  <div v-show="!edit && !create" class="relative mb-4">
    <span class="absolute inset-y-0 left-0 flex items-center pl-2">
        <svg fill="none" stroke="orange" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24" class="w-6 h-6"><path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
    </span>
    <input type="search" v-model="search" name="q" :class="focusMedium"
      class="py-2 text-sm rounded-md pl-10 text-gray-800 hover:border-yellow-600"
      placeholder="Search" autocomplete="off">
    <button @click="createCustomer" class="ml-2 mr-2 bg-yellow-600 text-white rounded-lg shadow-lg px-2 py-2 hover:bg-yellow-700"><i class="fas fa-plus-circle text-white mr-2"></i>Create a Customer
    </button>
    <span :class="{ invisible: !showMessage}" class="rounded border-l-4 bg-green-400 text-sm text-white px-2 py-3 border-green-800 shadow-xl items-center">
      {{ message }}<i @click="showMessage = false" class="ml-2 far fa-times-circle"></i>
    </span>
    <button v-show="!loaded" class="inline-flex ml-2 mr-2 bg-yellow-600 text-white rounded-lg shadow-lg px-2 py-2 hover:bg-yellow-700">
      <svg class="animate-spin mr-2 h-auto w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-100" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
      Loading...
    </button>
  </div>

  <div v-show="loaded && !edit && !create" class="rounded-t-md shadow-lg overflow-hidden">
    <table id="customers">
      <thead>
        <tr :class="dark" class="text-left text-white">
          <th :class="medium" class="px-3 py-2">
            <input type="checkbox" @click='checkAll()' v-model="isCheckAll">
          </th>
          <th class="px-3 py-2" v-for="(meta, index) in customersMeta" v-bind:key="index">{{ meta[1] }}</th>
          <th colspan=2 :class="medium" class="px-3 py-2">
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(cust, id) in filteredCustomers" v-bind:key="id">
          <td class="px-3 py-2">
            <input type="checkbox" v-bind:value='cust._id' v-model='checkedItems' @change='updateCheckAll()'>
          </td>
          <td class="px-3 py-2" v-for="(meta, index) in customersMeta" v-bind:key="index" :set="custData = getMeta(meta[0],cust)">{{ custData }}</td>
          <td :class="light" class="px-3 py-2">
            <i @click="editCustomer(cust)" class="fas fa-edit text-yellow-600" title="edit"></i>
          </td>
          <td :class="light" class="px-3 py-2">
            <i @click="showCustomerModal(cust)" class="fas fa-trash text-red-600" title="delete"></i>
          </td>
        </tr>
        <tr :class="dark" class="h-1">
            <td :colspan="customersMeta.length+3"></td>
        </tr>
      </tbody>
    </table>

  </div>

  <div class="text-red-600" v-if="updateErrorFlag && edit">{{ updateError }}</div>

  <!-- BEGIN Update Customer HERE -->
  <div v-show="edit" class="container">
    <div @click="cancelEdit" class="text-yellow-800 cursor-pointer hover:font-semibold w-1/3">Back to Customers List
      <span :class="{ invisible: !showMessage}" class="rounded border-l-4 bg-green-400 text-sm text-white px-2 py-3 border-green-800 shadow-xl items-center">
        {{ message }}<i @click="showMessage = false" class="ml-2 far fa-times-circle"></i>
      </span>
    </div>
    <form name="update" ref="updateForm" @submit.prevent="updateCust(true)">
      <div class="mt-8 mb-6 grid grid-cols-3 gap-8">
        <div class="" v-for="(meta, index) in customersMeta" v-bind:key="index" :set="custData = getMeta(meta[0],this.customer)">
          <label :for="`u_`+meta[0]" class="block left-1 -top-2 text-gray-500 text-sm">{{ meta[1] }}</label>
          <input :required="meta[2]" :id="`u_`+meta[0]" :class="focusMedium" class="py-2 text-sm rounded-md px-2 text-gray-800" :ref="`u_`+getLastMeta(meta[0])" :value="custData" />
        </div>
      </div>
      <div class="flex items-stretch">
        <button type="reset" class="rounded px-2 py-1 text-gray-100 bg-gray-500 hover:bg-gray-600" @click="cancelEdit">Cancel</button>
        <div class="cursor-pointer rounded ml-4 px-2 py-1 text-gray-100 bg-yellow-600 hover:bg-yellow-700" @click="updateCust(false)">Save</div>
        <button class="rounded ml-4 px-2 py-1 text-gray-100 bg-blue-600 hover:bg-blue-700" type="submit">Save and Quit</button>
      </div>
    </form>
  </div>
  <!-- END Update Customer HERE -->

  <div class="text-red-600" v-if="createErrorFlag && create">{{ createError }}</div>

  <!-- BEGIN Create Customer HERE -->
  <div v-show="create">
    <form name="create" ref="create" @submit.prevent="createCust">
      <h3 class="text-yellow-800">Create a new Customer</h3>
      <div class="mt-8 mb-6 grid grid-cols-3 gap-8">
        <div class="relative" v-for="(meta, index) in customersMeta" :key="index">
          <label :for="meta[0]" class="block left-1 -top-2 text-gray-500 text-sm">{{ meta[1] }}</label>
          <input :required="meta[2]" :id="meta[0]" :class="focusMedium" class="py-2 text-sm rounded-md px-2 text-gray-800" :ref="getLastMeta(meta[0])"/>
        </div>
      </div>
      <button type="reset" class="rounded px-2 py-1 text-gray-100 bg-gray-500 hover:bg-gray-600" @click="cancelCreate">Cancel</button>
      <button class="rounded ml-4 px-2 py-1 text-gray-100 bg-yellow-600 hover:bg-yellow-700" type="submit">Create</button>
    </form>
  </div>
  <!-- END Create Customer HERE -->

  <div v-if="showModal" class="fixed overflow-x-hidden overflow-y-auto inset-0 z-20 flex justify-center items-center">
      <div class="relative w-auto max-w-2xl">
        <div class="bg-white w-full rounded shadow-xl flex flex-col">
          <div :class="dark" class="text-right text-white px-1 py-1"><i class="far fa-times-circle" @click="cancel"></i></div>
          <div class="py-2 px-2 font-semibold">Are you sure to delete this customer?</div>
          <div class="py-2 px-2 flex flex-row">
            <button class="rounded bg-gray-400 text-white px-2 mt-1 py-2 w-1/3 m-auto mb-2" @click="cancel" type="button">
              Cancel
            </button>
            <button class="rounded bg-red-600 text-white px-2 mt-1 py-2 w-1/3 m-auto mb-2" @click="deleteCust(this.customer._id)" type="button">
              Delete
            </button>
          </div>
        </div>
      </div>
  </div>
  <div v-if="showModal" class="absolute inset-0 z-10 opacity-25 bg-black">
  </div>

</template>

<script>
import CustomerService from '@/services/CustomerService'

export default {
  name: 'Customer',
  components: { },
  data () {
    return {
      loaded: false,
      promise: [],
      customers: [],
      customer: [],
      checkedItems: [],
      isCheckAll: false,
      light: 'bg-yellow-50',
      focusMedium: 'focus:outline-none border border-gray-300 focus:border-yellow-600 focus:ring-0',
      exemple: 'border border-gray-300 bg-white text-gray-900 appearance-none block w-full rounded-md py-3 px-4 focus:border-gray-900 focus:outline-none',
      medium: 'bg-yellow-400',
      dark: 'bg-yellow-600',
      customersMeta: [],
      error: '',
      message: '',
      createError: '',
      createErrorFlag: false,
      updateError: '',
      updateErrorFlag: false,
      edit: false,
      create: false,
      search: '',
      title: 'Customers',
      showModal: false,
      showMessage: false,
      delay: 3000
    }
  },
  computed: {
    filteredCustomers () {
      return this.customers.filter(cust => this.testCustomer(cust))
    }
  },
  methods: {
    async createCust () { // Create customer operations
      /* Reset all */
      var body = {}
      this.createErrorFlag = false
      this.createError = ''
      /* Reset all */
      for (var i = 0; i < this.customersMeta.length; i++) {
        var data = this.customersMeta[i][0]
        var endData = this.getLastMeta(data)
        body[data] = this.$refs[endData].value
        if (data === 'email' && !body[data].includes('@')) {
          this.createErrorFlag = true
          this.createError = 'E-mail should contain "@" character !'
        }
      }
      if (!this.createErrorFlag) {
        this.$refs.create.reset()
        this.create = false
        await CustomerService.insertCustomer(body)
        this.message = 'Customer created successfully!'
        this.showMessage = true
        this.customers = await CustomerService.getCustomers()
        this.hideAfterDelay()
      }
    },
    async updateCust (option) { // Update customer operations
      /* Reset all */
      var body = {}
      this.updateErrorFlag = false
      this.updateError = ''
      console.log('updateCust (' + option + ')')
      /* Reset all */
      for (var i = 0; i < this.customersMeta.length; i++) {
        var data = this.customersMeta[i][0]
        var endData = 'u_' + this.getLastMeta(data)
        body[data] = this.$refs[endData].value
        if (data === 'email' && !body[data].includes('@')) {
          this.updateErrorFlag = true
          this.updateError = 'E-mail should contain "@" character !'
        }
      }
      if (!this.updateErrorFlag) {
        const customerId = this.customer._id
        await CustomerService.updateCustomer(customerId, body)
        if (option) {
          this.customers = await CustomerService.getCustomers()
          this.edit = false
        } else {
          this.customer = await CustomerService.getCustomer(customerId)
        }
        this.message = 'Customer updated successfully!'
        this.showMessage = true
        this.hideAfterDelay()
      }
    },
    hideAfterDelay () {
      setTimeout(() => {
        this.hideMessage()
      }, this.delay)
    },
    getLastMeta (meta) { // Get only the last parameter name after dot separator
      if (meta.includes('.')) {
        var nb = meta.split('.').length
        return meta.split('.')[nb - 1]
      } else return meta
    },
    getMeta (meta, data) {
      if (meta.includes('.') && meta.split('.')) {
        if (data[meta.split('.')[0]]) {
          return data[meta.split('.')[0]][meta.split('.')[1]]
        } else return ''
      } else {
        return data[meta]
      }
    },
    hideMessage () {
      this.showMessage = false
    },
    editCustomer (cust) {
      if (!this.edit) {
        this.edit = true
        this.customer = cust
      }
    },
    createCustomer () {
      this.edit = false
      this.create = true
    },
    showCustomerModal (cust) {
      this.customer = cust
      this.showModal = true
    },
    cancel () {
      this.showModal = false
    },
    cancelEdit () {
      this.showMessage = false
      this.message = ''
      this.edit = false
    },
    cancelCreate () {
      this.$refs.create.reset()
      this.createErrorFlag = false
      this.createError = ''
      this.create = false
    },
    async deleteCust (id) {
      await CustomerService.deleteCustomer(id)
      this.showModal = false
      this.customers = await CustomerService.getCustomers()
    },
    checkAll: function () {
      // console.log('checkAll')
      this.isCheckAll = !this.isCheckAll
      this.checkedItems = [] // Reset selection
      if (this.isCheckAll) { // If select all is checked
        for (var cust in this.customers) {
          this.checkedItems.push(this.customers[cust]._id)
        }
      }
    },
    updateCheckAll: function () {
      // console.log('updateCheckAll')
      if (this.checkedItems.length === this.customers.length) {
        this.isCheckAll = true
      } else {
        this.isCheckAll = false
      }
    },
    testCustomer (customer) { // Search and filter customers
      var i = 0
      var data = ''
      var dataafter = ''
      var databefore = ''
      var test = false
      for (i = 0; i < this.customersMeta.length; i++) {
        data = this.customersMeta[i][0]
        if (data.includes('.') && customer[data]) {
          databefore = data.split('.')[0]
          dataafter = data.split('.')[1]
          if (customer[databefore][dataafter] && customer[databefore][dataafter].toLowerCase().includes(this.search.toLowerCase())) {
            test = true
          }
        } else {
          if (customer[data]) {
            if (customer[data].toLowerCase().includes(this.search.toLowerCase())) {
              test = true
            }
          }
        }
      }
      return test
    }
  },
  mounted () {
    try {
      this.promise = CustomerService.getCustomers()
      this.customersMeta = CustomerService.getCustomersMeta()
      this.promise.then((value) => {
        this.customers = value
      })
      this.customersMeta.then((data) => {
        this.customersMeta = data
        // console.log('Customer.vue Meta : ' + data)
        this.loaded = true
      })
    } catch (err) {
      this.error = err.message
      console.log('Customer.vue Error : ' + this.error)
    }
  }
}
</script>
