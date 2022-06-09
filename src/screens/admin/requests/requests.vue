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
      <nb-body>
        <nb-title :style="{textAlign:'center',width:200}">PEDIDOS</nb-title>
      </nb-body>
      <nb-right />
    </nb-header>
    

    <nb-content padder>
      
      <nb-spinner v-if="spinner" color="blue" :style="{marginTop:130}" />
      
      <view v-if="message" :style="{ marginTop:130,alignItems: 'center',fontWight:'bold'}">
        <nb-thumbnail large :source="ec" />
        <text class="x">NENHUM PEDIDO ENCONTRADO</text>
      </view>

      <view :key="key" v-if="auth.isSalesman && !spinner && !message">
      <request-detail-for-salesman 
                                   v-if="Object.keys(orders).length > 0" 
                                   v-for="listOrders,index in orders"
                                   :key="index"
                                   :style="{marginTop:-18,paddingBottom:5}"
                                   :listOrders="listOrders"
                                   :navigation="navigation"
                                   :products="products"
                                   :auth="auth"
                                   :organizations="organizations"
                                   :salesStates="salesStates"
                                   :deliveryStates="deliveryStates"
                                   :updateFromChild="updateFromChild"
      />
      </view>

      <view :key="key" v-if="auth.isDeliveryman && !spinner && !message">
      <request-detail-for-deliveryman 
                                      v-if="Object.keys(validOrders).length > 0"
                                      v-for="listOrders,index in validOrders"
                                      :key="index"
                                      :style="{marginTop:-18,paddingBottom:5}"
                                      :listOrders="listOrders" 
                                      :navigation="navigation"
                                      :update="isNoOneRequestOrder"
                                      :products="products"
                                      :auth="auth"
                                      :organizations="organizations"
                                      :updateFromChild="updateFromChild"

      />
      </view>


    </nb-content>

  </nb-container>
</template>

<script>
//import { Dimensions, Platform } from "react-native"
//import logo from "@/../assets/skol.png"
import RequestDetailForSalesman from './_requestDetailForSalesman'
import RequestDetailForDeliveryman from './_requestDetailForDeliveryman'
import logo2 from "../../../../assets/logo-final.png"
import ec from "../../../../assets/error.png"

import ControlComputedMixins from "@/mixins/controlComputedMixins"


export default {
  components:{ RequestDetailForSalesman,RequestDetailForDeliveryman },
  mixins: [ControlComputedMixins],
  data() {
    return {
      connection: null,
      timer:null,
      updateControl:false,
      key:0,
      ec,
      spinner:true,
      message:false,
      logo2,
    }
  },

  async created(){
    let auth = this.$store.state.auth
    await this.$store.dispatch('requests/fetchOrders',auth)
    if (this.auth.isDeliveryman)
      this.isNoOneRequestOrder('deliveryman')
    if (this.auth.isSalesman){
      this.isNoOneRequestOrder('salesman')
    }
    this.ws()
    //atualiza a tela mediande a mudanças remotas 
    // this.$nextTick(function () {
    //   this.timer = window.setInterval(() => {
    //     let auth = this.$store.state.auth
    //     this.$store.dispatch('requests/fetchOrders',auth)
    //     if (this.updateControl == false){
    //       this.key = Math.random()
    //     }
    //   },30000)
    // })
  },

  // beforeDestroy(){
  //   this.$nextTick(clearInterval(this.timer))
  // },


  computed:{

    orders(){
      return this.$store.state.requests.orders
    },

    validOrders(){
      let resp = []
      let o = this.orders
      for (var i in o) {
        let saleState = o[i][0].salesman_state
        let deliveryState = o[i][0].delivery_state
        if (saleState != 'canceled' && saleState != 'fail' && saleState != 'finished')
          resp.push(o[i])
      }
      return resp
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
      var t = this
      this.connection = new WebSocket(WS_URL)
      var conn = this.connection
      this.connection.onmessage = async function(event) {
        var data = JSON.parse(event.data)
        let identifier = data.identifier
        if (identifier){
          let channel = JSON.parse(identifier).channel
          if (channel == 'SalesmanChannel'){
            let message = data.message 
            if (message){
              let resp = message.data
              if(resp == 'update'){
                let auth = t.$store.state.auth
                await t.$store.dispatch('requests/fetchOrders',auth)
                t.key = Math.random()
              }
            }
          }
        }
      }
      this.connection.onopen = function(event) {
        console.log("conectado ao rails websocket from request")
        let message = {"command": "subscribe","identifier": "{\"channel\":\"SalesmanChannel\"}"}
        conn.send(JSON.stringify(message))
        // message = {"command": "message","identifier": "{\"channel\":\"SalesmanChannel\"}",
        //"data": "{\"action\":\"send_message\"}"}
        //conn.send(JSON.stringify(message))
      }
    },

    updateFromChild(state){
      this.updateControl = state
    },

    goToOrder() {
      this.navigation.navigate('Order')
    },

    goTo(where){
      this.navigation.navigate(where)
    },

    async isNoOneRequestOrder(organization){
      let l = 'undefined'
      if (organization == 'salesman')
        l = await this.$store.dispatch('requests/fetchNumberOfOrdersBySalesman',this.auth)
      if (organization == 'deliveryman'){
        l = await this.$store.dispatch('requests/fetchNumberOfOrders',this.auth)
        l = this.validOrders.length
      }
      this.spinner = !(l > 0)
      this.message = l == 0
      if (l==0)
        this.spinner = false
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