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
        <nb-title :style="{textAlign:'center',width:200}">ALTERAR</nb-title>
      </nb-body>
      <nb-right />
    </nb-header>

    <nb-content padder>
      
      <edit-product v-if="editMode" :product="productToEdit"></edit-product>
    
      <nb-content v-if="!editMode">
        
        <nb-card v-for="product in products">
          <nb-card-item button>
            <nb-left>
              <!-- <image-modal :style="{imageBackgroundColor:'#000', width: 90, height: 90, borderRadius: 30/2}" :source="{uri: sourceImg}"
              /> -->
              <nb-body>
                <nb-text class="y">{{product.name}}</nb-text>
                <nb-text note class="x">{{product.description}}</nb-text>
              </nb-body>
            </nb-left>
            <nb-right>
              <!-- <nb-text :style="{fontWeight: 'bold'}">R${{parseFloat(product.price) | dinheiro}}</nb-text> -->
            </nb-right>
          </nb-card-item> 
          
          
            <nb-button block light iconLeft :style="{ marginBottom: 0 }" :onPress="(prod) => changeEditMode(product)" >
              <nb-icon active name="paper" />
              <nb-text>ALTERAR</nb-text>
            </nb-button>
          
        </nb-card>

      </nb-content>
    
    </nb-content>

  </nb-container>

</template>

<script>
import logo from "../../../assets/logo-final.png"
import ImageModal from 'react-native-image-modal'
import EditProduct from './_editProduct'

export default {
  components: { ImageModal,EditProduct },
  data() {
    return {
      productToEdit:{},
      editMode:false,
      qSize:125,
      pL:0,
      text: "Quantidade",
      quantidade : 0,
      logo,
      selected:'',
      searchText:'',
    }
  },

  async created() {
    let organization_id = this.$store.state.auth["organization"]["id"]
    await this.$store.dispatch('products/fetchProducts')
    await this.$store.dispatch('products/fetchProductsById',organization_id)
  },

  validations:{

    form:{
    }

  }, 
  
  computed:{

    products(){
      return this.$store.state.products.searchedProducts
    },

    isBuyLoaded(){
      return true
    },

    organizations(){
    },

    organization(){
    },
    isSalesman(){
    },
    isDeliveryman(){
    },
    
  },
  
  props: {

    navigation: {
      type: Object
    }

  },

  methods: {
    
    goBack(){
      this.navigation.goBack()
    },

    changeEditMode(product){
      this.productToEdit = product
      this.editMode =!this.editMode
    },

    refresh(){
    },

    filterProducts(){
    },


    changeOrganization(value) {
    },

    validateName(){
    },

    validateDescription(){
    },

    validatePrice(){
    },

    getIosIcon: function() {
    },

    onValueChange: function(value) {
    },

  },

};

</script>

<style>

</style>