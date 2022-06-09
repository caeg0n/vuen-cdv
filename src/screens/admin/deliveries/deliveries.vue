<template>
  <nb-container :style="{ backgroundColor: '#fff' }">
    <nb-header>
      <nb-thumbnail :style="{flex:1}" :source="logo2"/>
    </nb-header>
    <nb-header>
      <nb-left>
        <nb-button transparent :onPress="() => this.props.navigation.goBack()">
          <nb-icon name="arrow-back" />
        </nb-button>
      </nb-left>
      <nb-body >
        <nb-title :style="{textAlign:'center',width:200}">MINHAS ENTREGAS</nb-title>
      </nb-body>
      <nb-right />
    </nb-header>
    
    <nb-content padder >

      <nb-spinner v-if="!isAnyDeliveryRegistered && spinner" color="blue" :style="{marginTop:130}" />
         
      <view v-if="!spinner" :style="{ marginTop:130,alignItems: 'center',fontWight:'bold'}">
        <nb-thumbnail large :source="ec" />
        <text class="x">NENHUMA ENTREGA ENCONTRADA</text>
      </view>

      <nb-spinner v-if="!deliveryControl && isAnyDeliveryRegistered" color="blue" :style="{marginTop:130}" /> 
      <view :key="key">
      <delivery v-if="deliveryControl" 
                v-for="delivery in deliveries"
                :delivery="delivery"
                :navigation="navigation"
                :organizations="organizations"
                :products="products"
                :updateFather="update"
                :auth="auth"
                :style="{marginTop:-18,paddingBottom:5}"
                :updateFromChild="updateFromChild"
      />
      </view>
    </nb-content>

  </nb-container>
</template>

<script>
import { widthPercentageToDP as wp, 
         heightPercentageToDP as hp} from 'react-native-responsive-screen'
import Modal from 'react-native-modal'
import Delivery from './_delivery'
import logo2 from "../../../../assets/logo-final.png"
import ec from "../../../../assets/error.png"

import ControlComputedMixins from "@/mixins/controlComputedMixins"

export default {
  components:{ Delivery },
  mixins: [ControlComputedMixins],
  data() {
    return {
      connection:null,
      timer:null,
      updateControl:false,
      key:0,
      deliveryControl:false,
      spinner:true,
      logo2,
      ec,
      stylesObj: {
        top:hp('20%')
      },     
    }
  },

  async created(){
    let id = this.auth["organization"].id
    await this.$store.dispatch('requests/fetchOrders',this.auth)
    await this.$store.dispatch('deliveries/fetchDeliveries',id)
    this.deliveryControl = Object.keys(this.deliveries).length > 0
    this.ws()


    //atualiza a tela mediande a mudanças remotas 
    // this.$nextTick(function () {
    //   this.timer = window.setInterval(() => {
    //     let id = this.auth["organization"].id
    //     this.$store.dispatch('requests/fetchOrders',this.auth)
    //     this.$store.dispatch('deliveries/fetchDeliveries',id)
    //     if (this.updateControl == false){
    //       this.key = Math.random()
    //     }
    //   },5000)
    // })

  },

  // beforeDestroy(){
  //   this.$nextTick(clearInterval(this.timer))
  // },

  
  computed:{
    
    deliveries(){
      return this.$store.state.deliveries.items
    },

    isAnyDeliveryRegistered(){
      this.isNoOneDelivery()
      return Object.keys(this.deliveries).length > 0
    },

  },
  validations:{
    form:{
    }
  },
  props: {
    navigation: {
      type: Object
    }
  },
  methods: {

    ws(){
      this.connection = new WebSocket(WS_URL)
      var t = this
      var conn = this.connection
      this.connection.onmessage = async function(event) {
        var data = JSON.parse(event.data)
        let identifier = data.identifier
        if (identifier){
          let channel = JSON.parse(identifier).channel
          if (channel == 'DeliverymanChannel'){
            let message = data.message 
            if (message){
              let resp = message.data
              if(resp == 'update'){
                let id = t.auth["organization"].id
                await t.$store.dispatch('requests/fetchOrders',t.auth)
                await t.$store.dispatch('deliveries/fetchDeliveries',id)
                t.key = Math.random()
              }
            }
          }
        }
      }
      this.connection.onopen = function(event) {
        console.log("conectado ao rails websocket")
        let message = {"command": "subscribe","identifier": "{\"channel\":\"DeliverymanChannel\"}"}
        conn.send(JSON.stringify(message))
      }
    },

    updateFromChild(state){
      this.updateControl = state
    },

   
    async isNoOneDelivery(){
      let l = await this.$store.dispatch('deliveries/fetchNumberOfDeliveries',this.auth)
      if (l == 0){
        this.spinner = false

      }
      else{
        this.spinner = true
      }
      return
    },

    async update(){
      let id = this.auth["organization"].id
      await this.$store.dispatch('requests/fetchOrders',this.auth)
      await this.$store.dispatch('requests/fetchSalesStates')
      await this.$store.dispatch('requests/fetchDeliveryStates')
      await this.$store.dispatch('deliveries/fetchDeliveries',id)
      await this.$store.dispatch('auth/fetchSalesmanList')
    },

  }
};
</script>

<style>
.spinner-container{
  display: flex;
  justify-content: center;
}
</style>