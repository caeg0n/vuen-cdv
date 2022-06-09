const controlComputedMixins = {
    
    async created(){
      await this.$store.dispatch('products/fetchProducts')
      await this.$store.dispatch('requests/fetchDeliveryStates')
      await this.$store.dispatch('requests/fetchSalesStates')
      await this.$store.dispatch('auth/fetchSalesmanList')
      await this.$store.dispatch('organizations/fetchOrganizations')
    },

    computed: {
        
        auth(){
          return this.$store.state.auth
        },

        products(){
           return this.$store.state.products.items
        },

        allOrganizations(){
          return this.$store.state.organizations.items
        },

        organizations(){
          return this.$store.state.auth.salesmanList
        },

        salesStates(){
          return this.$store.state.requests.salesStates
        },
    
        deliveryStates(){
          return this.$store.state.requests.deliveryStates
        },

    },

}
export default controlComputedMixins
