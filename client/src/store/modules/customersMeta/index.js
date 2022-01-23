import CustomerService from '@/services/CustomerService'

const getters = {
    displayCustomers:(state) => state.customersMeta
}

const actions = {}

const mutations = {}

export default {
    namespaced: true,
    state () {
        var result = []
        async function getMeta() {
            var tmp = await CustomerService.getCustomersMeta()
            return tmp
        }
        //console.log('result : ' + result)
        return {
            customersMeta: getMeta()
        }
    },
    getters,
    actions,
    mutations
}