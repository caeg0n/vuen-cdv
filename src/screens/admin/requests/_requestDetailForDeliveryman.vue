<template>

	<view>

    <nb-separator :style="{marginLeft:-10,paddingLeft:0,width:'150%',height:55,backgroundColor:'#3F51B5',marginTop:10}" bordered >
      <nb-thumbnail :style="{marginLeft:15,height:40,marginTop:-10}" :source="mixinCSGif"/>
      <nb-text v-if="this.props.navigation.state.routeName == 'Requests'" :style="{marginTop:-31,fontWeight: 'bold',paddingLeft:65,fontSize:20,color:'white'}">#PEDIDO :{{order_id}} - {{listOrders[0].consumer_name | primeiro_nome}}</nb-text>
    </nb-separator>

    <nb-list-item itemHeader first>
      <nb-text>{{getSalesNames() | nome_dos_vendedores}}</nb-text>
    </nb-list-item>
    <nb-list-item :style="{marginTop:-50}" itemHeader>
      <nb-text>{{mixinCSText}}</nb-text>
    </nb-list-item>
    <nb-list-item :style="{marginTop:-50}" itemHeader>
      <nb-text>{{orderAdress}}</nb-text>
    </nb-list-item>


    <nb-list-item :style="{ marginTop:-10 }" icon>
      
      <nb-left>
        <nb-button :style="{ backgroundColor: mixinCSIconColor }">
          <nb-icon :name="mixinCSIcon" />
        </nb-button>
      </nb-left>

      <nb-body>
        <nb-text :style="{flex:1}">{{setDate(listOrders[0].created_at)}}</nb-text>
        <nb-text note>R${{orderTotal | dinheiro}}</nb-text> 
      </nb-body>

    </nb-list-item>

    <nb-text v-for="(order,index) in listOrders" :style="{marginLeft:65}" note>{{getProductName(listOrders[index].product_id)}}</nb-text>

    
    <nb-card-item :style="{marginTop:0}">
    	<button-spinner :positionSpinner="positionSpinner" :onPress="processDelivery">
       	<icon3 name="bike" :size="20" :color="'black'" />
       	<text :style="{fontWeight: 'bold',paddingLeft:10}">PEGAR A ENTREGA</text>
     	</button-spinner>
    </nb-card-item>   

  </view>

</template>

<script>
import moment from 'moment'
import ButtonSpinner from 'react-native-button-spinner'
import Icon2 from 'react-native-vector-icons/FontAwesome'
import Icon3 from 'react-native-vector-icons/MaterialCommunityIcons'

import WhiteLoader from "../../../../assets/white-loader.gif"
import BlueLoader from "../../../../assets/blue-loader.gif"
import OrangeLoader from "../../../../assets/orange-loader.gif"
import GreenLoader2 from "../../../../assets/green2-loader.gif"
import GreenLoader from "../../../../assets/green-loader.gif"
import RedLoader2 from "../../../../assets/red-loader2.gif"
import RedLoader from "../../../../assets/red-loader.gif"

import ControlStateMixins from "@/mixins/controlStateMixins"

export default {
	components:{ ButtonSpinner,Icon2,Icon3 },
  mixins: [ControlStateMixins],
 	data() {
   	return {
  		positionSpinner:'centered-without-text',
   		WhiteLoader,
   		BlueLoader,
   		OrangeLoader,
   		GreenLoader2,
   		GreenLoader,
   		RedLoader2,
   		RedLoader
 		}
 	},

 	props: {

    updateFromChild:{
      type:Function
    },

    products:{
      type:Array
    },

    auth:{
      type: Object,
      required: false 
    },

    organizations:{
      type: Array
    },

    update:{
      type:Function
    },

   	navigation: {
   		type: Object
   	},

   	listOrders:{
   		type: Array,
   		required: false
   	},

 	},

 	created(){
   	this.setMixin(this.saleState,this.deliveryState)
 	},


  computed:{

    orderAdress(){
      return this.listOrders[0].address
    },

    order_id(){
      return this.listOrders[0].id
    },

    saleState(){
      return this.$store.state.requests.salesStates[this.listOrders[0].id]
    },
    
    deliveryState(){
      return this.$store.state.requests.deliveryStates[this.listOrders[0].id]
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

  },

	methods: {
    
    setMixin(saleState,deliveryState){
      this.setMixinState(saleState,'waiting','alarm','grey',"aguardando atendimento",this.WhiteLoader)
      this.setMixinState(saleState,'processing','alarm','#FF9501',"Em Andamento",this.OrangeLoader)
      this.setMixinState(saleState,'inprogress','alarm','blue',"Aguardando Entregador",this.BlueLoader)
      this.setMixinState(saleState,'delivering','bicycle','green',"Saiu Para Entrega",this.GreenLoader2)
      this.setMixinState(saleState,'fail','bicycle','red',"A Entrega Falhou",this.RedLoader)
      this.setMixinState(saleState,'canceled','close','red',"Entrega Cancelada",this.RedLoader2)
      this.setMixinState(saleState,'finished','star','green',"Entregue",this.GreenLoader) 
    },

	  async createDelivery(){
      let data = []
      let orders = this.listOrders 
      let auth = this.$store.state.auth
      data[0] = {orders}
      data[1] = {auth} 
      return await this.$store.dispatch('deliveries/createDelivery',data)
    },

    processDelivery(){
   	  return new Promise(async (resolve, reject) => {
   	    let obj = []
   	    let orders = this.listOrders 
   	    let auth = this.$store.state.auth
   	    obj[0] = {orders}
   	    obj[1] = {"state":"CI"}  
   	    await this.$store.dispatch('requests/updateOrderDeliverymanState',obj)
   	    await this.createDelivery()
   	    await this.$store.dispatch('requests/fetchOrders',auth)
        await this.update('deliveryman')
        this.setMixin(this.saleState,this.deliveryState)
   	    resolve("ok")
      })
    },

    getProductName(id){
      try {
    	  return this.products.find(x => x.id === id).name
      }catch (e) {
     	  return ''  
      }
    },

    setDate(created_at){
      let data = moment(created_at).format('DD/MM/YYYY')
      let hora = moment(created_at).format('HH:mm')
      return data+" - "+ hora
    },

    getSalerName(id){
      try {
        let a = this.products.find(x => x.id === id).organization_id 
        let b = this.organizations.find(x => x.id === a).name
        return b
      }catch (e) {
        return ''  
      }
    },

    getSalesNames(){
      let names = []
      let resutl = ''
      for (let i=0;i<this.listOrders.length;i++){
        let name = this.getSalerName(this.listOrders[i].product_id)
        names.push(name)
      }
      let unique = [...new Set(names)]   
      return unique
    },
  }

};

</script>

<style>
</style>