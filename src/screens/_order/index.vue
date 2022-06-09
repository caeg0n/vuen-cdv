<template>
  <nb-container :style="{ backgroundColor: '#fff' }">
    <nb-header>
      <nb-thumbnail :style="{flex:1}" :source="logo2"/>
    </nb-header>
    <nb-header>
      <nb-body>
        <nb-title :style="{ marginLeft: 25 }">PEDIDO #{{pedido_id}}</nb-title>
      </nb-body>
      <nb-right />
    </nb-header>

    <nb-content padder>
      <nb-card :style="{ marginBottom: 15,color:'#000' }" >
        <nb-card-item header bordered>
          <nb-card-item>
          <nb-left>
          <nb-button :style="{ backgroundColor: iconStatusColor }">
            <nb-icon :name="iconStatus" />
          </nb-button>
            <nb-text>
              {{statusText}}
            </nb-text>
          </nb-left>
        </nb-card-item>
        </nb-card-item>

        <nb-card-item v-for="(order,index) in listOrders">
          <nb-left>
            <nb-thumbnail :source="{uri: getProduct(order.product_id).img}"></nb-thumbnail>
          </nb-left>
          <nb-body :style="{marginLeft:-40}">
              <nb-text>{{getProduct(order.product_id).name}}</nb-text>
              <nb-text note>{{order.amount | unidades}}</nb-text>
            </nb-body>
          <nb-right>
            <nb-text>R${{parseFloat(order.total) | dinheiro}}</nb-text>
          </nb-right>
        </nb-card-item>
        
        <nb-card-item>
          <nb-left>
            <nb-text :style="{fontWeight: 'bold'}">DATA</nb-text>
          </nb-left>
          <nb-text :style="{fontWeight: 'bold'}">{{setDate(listOrders[0].created_at)}}</nb-text>
         </nb-card-item>
        <nb-card-item>
          <nb-left>
            <nb-text :style="{fontWeight: 'bold'}">TOTAL</nb-text>
          </nb-left>
          <nb-right>
            <nb-text :style="{fontWeight: 'bold'}">R${{orderTotal | dinheiro}}</nb-text>
          </nb-right>
          
        </nb-card-item>
      </nb-card>
    </nb-content>

    <nb-footer>
      <nb-footer-tab>
        <nb-button :onPress="() => goBack()" active full>
          <nb-text>SAIR</nb-text>
        </nb-button>
      </nb-footer-tab>
    </nb-footer>
  </nb-container>
</template>

<script>
import { Dimensions, Platform } from "react-native"
import logo from "@/../assets/skol.png"
import moment from 'moment'
import logo2 from "../../../assets/logo-final.png"
import { BackHandler } from 'react-native'

export default {
  data() {
    return {
      logo,logo2,
      stylesObj: {
        btnContainer: {
          backgroundColor: "#6faf98",
          alignSelf: "center"
        }
      },
      iconStatus:'alarm',
      iconStatusColor:'grey',
      statusText:'Aguardando Atendimento'
    }
  },

  props: {

    navigation: {
      type: Object
    },

  },

  created(){
    this.getSaleState()
  },

  computed:{
    saleState(){
      return this.$store.state.requests.salesStates[this.pedido_id]
    },
    pedido_id(){
      return this.navigation.state.params.pedido_id
    },
    orderTotal(){
      let total = 0
      let orders = this.listOrders
      for (let i=0;i<orders.length;i++){
        let order = orders[i]
        total += parseFloat(order.total)
      }
      return total
    },
    products(){
        return this.$store.state.products.items
    },
    listOrders(){
      return this.navigation.state.params.listOrders
    }
  },
  methods: {

    goBack(){
      this.navigation.goBack()
    },

    setDate(created_at){
        let data = moment(created_at).format('DD/MM/YYYY')
        let hora = moment(created_at).format('hh:mm')
        return data+"-"+hora
    },

    getProduct(id){
      return this.products.find(x => x.id === id)
    },

    goToHome() {
      this.navigation.navigate('Home')
    },
    
    getSaleState(){
      let state = this.saleState
      if (state == 'processing'){
        this.iconStatus = 'alarm'
        this.iconStatusColor = '#FF9501'
        this.statusText = "Em Andamento"
      }
      if (state == 'inprogress'){
        this.iconStatus = 'alarm'
        this.iconStatusColor = 'blue'
        this.statusText = "Aguardando Entregador"
      }
      if (state == 'delivering'){
        this.iconStatus = 'bicycle'
        this.iconStatusColor = 'green'
        this.statusText = "Saiu Para Entrega"
      }
      if (state == 'fail'){
        this.iconStatus = 'bicycle'
        this.iconStatusColor = 'red'
        this.statusText = "A Entrega Falhou"
              }
      if (state == 'canceled'){
        this.iconStatus = 'close'
        this.iconStatusColor = 'red'
        this.statusText = "Entrega Cancelada"
      }
      if (state == 'finished'){
        this.iconStatus = 'star'
        this.iconStatusColor = 'green'
        this.statusText = "Entregue"
      }
    },
  }
};
</script>

<style>
</style>
