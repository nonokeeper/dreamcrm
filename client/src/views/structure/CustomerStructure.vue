<template>
    <div>
        Edit Customer Structure {{ loaded }}

        <span :class="{ invisible: !showMessage}" class="rounded border-l-4 bg-green-400 text-sm text-white px-2 py-3 border-green-800 shadow-xl items-center">
        {{ message }}<i @click="showMessage = false" class="ml-2 far fa-times-circle"></i>
        </span>

    </div>

    <form @submit.prevent="updateCustStructure(true)">
    <div v-show="loaded">
        <table class="rounded-t-md shadow-lg overflow-hidden">
        <thead>
            <tr :class="dark" class="text-left text-white">
                <th class="px-3 py-2">Field</th>
                <th class="px-3 py-2">Type</th>
                <th class="px-3 py-2">Label</th>
                <th class="px-3 py-2">Level</th>
                <th class="px-3 py-2">Required?</th>
            </tr>
        </thead>
        <tbody>
            <tr v-for="(meta, index) in customersMeta" v-bind:key="index">
            <td class="px-3 py-2">
                {{ index }}
            </td>
            <td class="px-3 py-2">
                <select :ref="index+`_type`">
                    <option :selected="type == meta.type" v-for="type in types" :key="type">
                        {{ type }}
                    </option>
                </select>
            </td>
            <td class="px-3 py-2">
                <input required :class="focusMedium" class="py-2 text-sm rounded-md px-2 text-gray-800" :ref="index+`_label`" :value="meta.label" />
            </td>
            <td class="px-3 py-2">
                <input :class="focusMedium" class="py-2 text-sm rounded-md px-2 text-gray-800" :ref="index+`_levelup`" :value="meta.levelup" />
            </td>
            <td class="px-3 py-2">
                <div class="flex items-center bg-gray-300 rounded-full w-14 h-7 p-1 duration-300"
                    :class="{ 'bg-yellow-600': required[index] }"
                    @click="change(index)">
                    <div class="h-5 w-5 rounded-full shadow-md transform duration-300 bg-white"
                        :class="{ 'translate-x-7': required[index] }">
                    </div>
                </div>
            </td>
            </tr>
            <tr :class="dark" class="h-1">
                <td :colspan="5"></td>
            </tr>
        </tbody>
        </table>
    </div>
    <div v-if="createField">
        <table class="rounded-t-md shadow-lg overflow-hidden">
            <tbody>
                <tr>
                    <td class="px-3 py-2">
                        <input placeholder="Field" type="text" required :class="focusMedium" class="py-2 text-sm rounded-md px-2 text-gray-800" ref="field"/>
                    </td>
                    <td class="px-3 py-2">
                        <select ref="type" value="String">
                            <option v-for="type in types" :key="type">
                                {{ type }}
                            </option>
                        </select>
                    </td>
                    <td class="px-3 py-2">
                        <input placeholder="Label" type="text" :class="focusMedium" class="py-2 text-sm rounded-md px-2 text-gray-800" ref="label"/>
                    </td>
                    <td class="px-3 py-2">
                        <input placeholder="Level" type="text" :class="focusMedium" class="py-2 text-sm rounded-md px-2 text-gray-800" ref="levelup"/>
                    </td>
                    <td>
                        <div class="flex items-center bg-gray-300 rounded-full w-14 h-7 p-1 duration-300"
                            :class="{ 'bg-yellow-600': mandatory }"
                            :aria-checked="mandatory.toString()"
                            @click="changeMandatory">
                            <div class="h-5 w-5 rounded-full shadow-md transform duration-300 bg-white"
                                :class="{ 'translate-x-7': mandatory }">
                            </div>
                        </div>
                    </td>
                </tr>
            </tbody>
            
        </table>
    </div>
    <button v-if="!createField" class="rounded bg-yellow-600 text-white px-2 mt-1 py-2 mb-2" @click="toggleField" type="button">+Add</button>
    <div class="items-stretch flex">
        <button v-if="createField" class="rounded bg-gray-400 text-white px-2 mx-4 mt-1 py-2 mb-2" @click="toggleField" type="button">Cancel</button>
        <button v-if="createField" class="rounded bg-yellow-600 text-white px-2 mt-1 py-2 mb-2" @click="addField" type="button">Create</button>
    </div>
    
    <div v-if="!createField" class="items-stretch flex">
        <button class="rounded bg-gray-400 text-white px-2 mx-4 mt-1 py-2 mb-2" @click="cancel" type="button">
            Cancel
        </button>
        <button class="rounded bg-yellow-600 text-white px-2 mx-4 mt-1 py-2 mb-2" @click="updateCustStructure(false)" type="button">
            Save
        </button>
        <button class="rounded bg-red-600 text-white px-2 mx-4 mt-1 py-2 mb-2" type="submit">
            Save and Quit
        </button>
    </div>
    </form>

</template>
<script>
import CustomerService from '@/services/CustomerService'

export default {
    name: 'CustomerStructure',
    components: { },
    data () {
    return {
      loaded: false,
      required: {},
      mandatory: false,
      showMessage: false,
      createField: false,
      message: '',
      delay: 3000,
      medium: 'bg-yellow-400',
      dark: 'bg-yellow-600',
      focusMedium: 'focus:outline-none border border-gray-300 focus:border-yellow-600 focus:ring-0',
      customersMeta: [],
      types: ['Boolean', 'Decimal128', 'Double', 'Date', 'Int32', 'Int64', 'String', 'Timestamp']
    }
  },
  methods: {
      hideAfterDelay () {
        setTimeout(() => {
            this.showMessage = false
        }, this.delay)
      },
      cancel() {
          this.$router.push('/customer')
      },
      change(index) {
          this.required[index] = !this.required[index]
      },
      toggleField() {
          this.createField = !this.createField
      },
      changeMandatory() {
          this.mandatory = !this.mandatory
      },
      async addField () {
        var field = this.$refs.field.value
        var body = { [field] : {
            type: this.$refs.type.value,
            label: this.$refs.label.value,
            levelup: this.$refs.levelup.value,
            required: JSON.parse(this.mandatory)
        } }
        //console.log(body)
        await CustomerService.insertCustomersMeta(body)
        this.customersMeta = await CustomerService.getCustomersMeta()
        this.createField = false
        this.$refs.type.value = ''
        this.$refs.label.value = ''
        this.$refs.levelup.value = ''
        this.mandatory = false
      },
      async updateCustStructure (option) {
        var body = { fields: {}}
        var cMeta = this.customersMeta
        for (const index in cMeta) {
            body.fields[index] = {
                type: this.$refs[index+`_type`].value,
                label: this.$refs[index+`_label`].value,
                levelup: this.$refs[index+`_levelup`].value,
                required: JSON.parse(this.required[index])
            }
        }
        console.log(body)
        await CustomerService.updateCustomersMeta(body)
        this.message = 'Customer Structure updated successfully!'
        this.showMessage = true
        this.hideAfterDelay()
        if (option) {
            // Go back to customers list
            this.$router.push("/customer");
        }
      }
  },
  mounted () {
    try {
      this.customersMeta = CustomerService.getCustomersMeta()
      this.customersMeta.then((data) => {
        this.customersMeta = data
        this.loaded = true
        for (const index in data) {
            this.required[index] = data[index].required
        }
      })
    } catch (err) {
      this.error = err.message
      console.log('CustomerStructure.vue Error : ' + this.error)
    }
  }
}
</script>