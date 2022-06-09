<template>
  <nb-card v-if="product.status != 'excluded'">
    <nb-card-item button>
      <nb-left>
        <nb-body>
          <nb-text :style="{textDecorationLine:textDecoration,
                            textDecorationStyle:'solid'}">{{product.name}}
          </nb-text>
          <nb-text note :style="{textDecorationLine:textDecoration,
                                 textDecorationStyle:'solid'}">{{product.description}}
          </nb-text>
          <nb-text note :style="{textDecorationLine:textDecoration,
                                 textDecorationStyle:'solid'}">R${{product.price}}
          </nb-text>
        </nb-body>
      </nb-left>
      <nb-right>
        <nb-spinner v-if="spinner" color="blue"/>
        <nb-button v-if="!spinner" small :warning="pauseBtnWarning" :success="pauseBtnSuccess" :onPress="()=> runPause(product)" >
          <nb-icon active type="Ionicons"  name="pause" />
        </nb-button>
      </nb-right>
    </nb-card-item>

    <nb-button v-if="product.status != 'excluded'" block danger iconLeft :style="{ marginBottom: 0 }" :onPress="()=>runDestroy(product)" >
      <nb-icon active name="trash" />
      <nb-text>EXCLUIR</nb-text>
    </nb-button>
  </nb-card>
</template>


<script>


export default {
  components: { },
  data() {
    return {
      spinner:true,
      textDecoration:null,
      pauseBtnWarning:null,
      pauseBtnSuccess:null,
      qSize:125,
      pL:0,
    }
  },

  async beforeCreate() {
    let organization_id = this.$store.state.auth["organization"]["id"]
    await this.$store.dispatch('products/fetchProducts')
    await this.$store.dispatch('products/fetchProductsById',organization_id)
    await this.updateState()
    this.spinner = false
  },

  props: {

    navigation: {
      type: Object
    },
    product:{
      type: Object
    },
    pause:{
      type: Function
    },
    destroy:{
      type: Function
    },
  },

  methods: {

    updateState(){
      if (this.product["status"] == 'active'){
        this.pauseBtnSuccess = true
        this.pauseBtnWarning = false
        this.textDecoration = null
      }else{
        if (this.product["status"] == 'paused'){
          this.pauseBtnSuccess = false
          this.pauseBtnWarning = true
          this.textDecoration = 'line-through'
        }
      }
    },

    runPause(product){
      this.pause(product,this)
    },

    runDestroy(product){
      this.destroy(product,this)
    },
    
    goBack(){
      this.navigation.goBack()
    },

  },

};

</script>

<style>

</style>