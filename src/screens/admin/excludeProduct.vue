<template>

  <nb-container>
    
    <nb-header>
      <nb-thumbnail :style="{marginLeft:25,flex:1}" :source="logo"/>
    </nb-header>
    
    <nb-header hasTabs>
      <nb-left>
        <nb-button transparent :onPress="() => goBack()">
          <nb-icon name="arrow-back" />
        </nb-button>
      </nb-left>
      <nb-body>
        <nb-title :style="{textAlign:'center',width:200}">EXCLUIR/PAUSAR</nb-title>
      </nb-body>
      <nb-right />
    </nb-header>

      <nb-content padder>
        <nb-spinner v-if="spinner" color="blue" :style="{marginTop:130}" />
        <pause-and-exclude-Item v-if="!spinner" v-for="product in searchedProducts" 
                                :product="product"
                                :pause="pause"
                                :destroy="destroy"
                                :update="update"> 
        </pause-and-exclude-Item>
      </nb-content>

  </nb-container>
</template>

<script>
import logo from "../../../assets/logo-final.png"
import PauseAndExcludeItem from "@/components/PauseAndExcludeItem"
import ControlComputedMixins from "@/mixins/controlComputedMixins"

export default {
  components: { PauseAndExcludeItem },
  data() {
    return {
      spinner:true,
      qSize:125,
      pL:0,
      logo,
    }
  },

  mounted(){
    this.spinner = false
  },

  async beforeCreated() {
    this.update()
  },

  computed:{

    searchedProducts(){
      return this.$store.state.products.searchedProducts
    },

    isBuyLoaded(){
      return true
    },
    
  },
  
  props: {

    navigation: {
      type: Object
    },

  },

  methods: {

    async update(){
      let organization_id = context.$store.state.auth["organization"]["id"]
      await context.$store.dispatch('products/fetchProducts')
      await context.$store.dispatch('products/fetchProductsById',organization_id)
    },
    
    async pause(product,context){
      let result = await this.$store.dispatch('products/pauseProduct',product["id"])
      if (result["status"] == 'active'){
        context.pauseBtnSuccess = true
        context.pauseBtnWarning = false
        context.textDecoration = null
      }else{
        if (result["status"] == 'paused'){
          context.pauseBtnSuccess = false
          context.pauseBtnWarning = true
          context.textDecoration = 'line-through'
        }
      }
    },


    async destroy(product,context){
      let result = await this.$store.dispatch('products/destroyProduct',product["id"])
      if (result["status"] == 'active'){
        
      }else{
        if (result["status"] == 'paused'){
          context.pauseBtnSuccess = false
          context.pauseBtnWarning = true
          context.textDecoration = 'line-through'
        }
      }
      let organization_id = this.$store.state.auth["organization"]["id"]
      await this.$store.dispatch('products/fetchProducts')
      await this.$store.dispatch('products/fetchProductsById',organization_id)
    },
    
    goBack(){
      this.navigation.goBack()
    },

  },

};

</script>

<style>

</style>