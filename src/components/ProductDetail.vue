<template>
  <nb-card-item :style="{marginTop:itemMT}">
    <nb-button iconLeft :style="{ marginBottom: 20 }" :onPress="addToCart" small>
      <nb-icon active name="cart" />
      <nb-text>Adicionar</nb-text>
    </nb-button>
    <nb-button :onPress="() => updateQuantidade()" iconLeft bordered :style="{width: qSize,marginBottom: 20, marginLeft: 5,paddingLeft: pL }" small>
      <!-- <nb-icon active name="beer" /> -->
      <nb-text>{{text}}</nb-text>
    </nb-button>
    <nb-button v-if="quantidade > 0" iconCenter :onPress="() => updateCart('del')" :style="{ marginLeft: 10,backgroundColor: '#FD3C2D' }" small>
      <nb-icon active name="trash" />
    </nb-button>
  </nb-card-item>
</template>

<script>
import { Text, Alert, TouchableOpacity } from 'react-native'
import Toast from 'react-native-root-toast'
import { widthPercentageToDP as wp, 
         heightPercentageToDP as hp} from 'react-native-responsive-screen'


export default {
  data: function() {
    return {
      stylesObj: {
      },
      text: "Quantidade",
      quantidade : 0,
      qSize:125,
      pL:0,
      itemMT:hp('-4%')
    }
  },
  props:{
    product:{
      type: Object,
      required: true
    },
  },
  computed: {
    cart(){
      return this.$store.state.cart.items
    },
    products(){
      return this.$store.state.products.items
    },
    productQuantidade(){
      return this.$store.getters['cart/getQuantidadeById'](this.product.id)            
    }
  },
  watch:{
    productQuantidade:function() {
      this.quantidade = this.productQuantidade
      if (this.quantidade == 0){
        this.text = "Quantidade"
        this.qSize = 125
        this.pL = 0
      }
    },
  },
  mounted(){
    if (this.productQuantidade > 0){
      this.text = this.productQuantidade
      this.quantidade = this.productQuantidade
      this.qSize = 70
      this.pL = 10
    }else{
      this.text = "Quantidade"
      this.qSize = 125
      this.pL = 0
    }
  },
  methods:{
    updateQuantidade(){
      this.quantidade++
      this.text = this.quantidade
      if (this.quantidade > 0){
        this.qSize = 70
        this.pL = 10
      }
    },
    addToCart(){
      if (this.quantidade > 0){
        Alert.alert('ADICIONAR AO CARRINHO','DESEJA ADICIONAR '+this.text+ ' UNIDADES DO PRODUTO NO CARRINHO?',
        [
          {text: 'NÃO', onPress: () => console.warn('NO Pressed'), style: 'cancel'},
          {text: 'SIM', onPress: () => this.updateCart()},
        ])
      }else{
        Toast.show('ESCOLHA A QUANTIDADE', {
          duration: Toast.durations.SHORT,
          position: Toast.positions.CENTER,
          shadow: false,
          backgroundColor: 'blue',
          animation: true,
          hideOnPress: true,
          delay: 0
        })
      } 
    },
    updateCart(func){
      let id = this.product.id
      let product = this.product
      let quantidade = this.quantidade
      if (func != 'del'){
        this.$store.dispatch('cart/updateCart',{id,quantidade,product})
      }else{
        if (this.productQuantidade > 0){
          Alert.alert('REMOVER','DESEJA RETIRAR ESSE PRODUTO DO SEU CARRINHO?',
          [
            //{text: 'NÃO', onPress: () => this.resetQuantidade()},
            {text: 'REMOVER DO CARRINHO',onPress: () => this.deleteFromCart(this.product)}
          ])
        }else{
          this.quantidade = 0
          this.text = "Quantidade"
          this.qSize = 125
          this.pL = 0
        }
      }      
    },
    deleteFromCart(item){
      let id = item.id
      let productsList = this.products
      let product = productsList.find(product => product.id === id) 
      this.$store.dispatch('cart/deleteFromCart',{item})
      this.quantidade = 0
      this.text = "Quantidade"
      this.qSize = 125
      this.pL = 0
    }
  }
};
</script>

<style>
</style>  
    