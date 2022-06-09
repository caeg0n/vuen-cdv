<template>
  <view>    
    <nb-separator :style="{marginLeft:-10,paddingLeft:0,width:'150%',height:55,backgroundColor:'#3F51B5',marginTop:10}" bordered >
    <nb-text :style="{fontWeight: 'bold',paddingLeft:10,fontSize:20,color:'white'}">#PEDIDO :{{order_id}}</nb-text>
    </nb-separator>

    <nb-list-item itemHeader first>
        <nb-text>{{getSalesNames()}}</nb-text>
    </nb-list-item>
    <nb-list-item :style="{marginTop:-50}" itemHeader>
        <nb-text>{{mixinCSText}}</nb-text>
    </nb-list-item>
    <nb-list-item :style="{marginTop:-50}" itemHeader>
        <nb-text>{{orderAdress}}</nb-text>
    </nb-list-item>

    <nb-spinner v-if="spinner1" color="blue" />
    
    <nb-list-item v-if="!spinner1" :style="{ marginTop:-10 }" icon>
      <nb-left>
        <nb-button :style="{ backgroundColor: mixinCSIconColor }">
          <nb-icon :name="mixinCSIcon" />
        </nb-button>
      </nb-left>
      <nb-body>
        <nb-text :style="{flex:1}">{{setDate()}}</nb-text>
        <nb-text note>R${{orderTotal | dinheiro}}</nb-text> 
      </nb-body>
    </nb-list-item>

    <nb-text v-if="!spinner1" v-for="(order,index) in orders" :style="{marginLeft:65}" note>{{getProductName(orders[index].product_id)}}</nb-text>


    <view>
    <nb-card-item :style="{marginLeft:-20}">
      <nb-button small :style="{width:'70%',backgroundColor:'#3F51B5', marginBottom: 0 }" 
                 :onPress="()=>controlDialog('open')">
        <nb-text :style="{fontWeight:'bold',fontSize:13,color:'white'}">Andamento da Entrega</nb-text>
      </nb-button>
      <nb-button :disabled="mixinBtnGiveupState" small 
                 :style="{marginLeft:20,width:'30%',
                          backgroundColor:mixinBtnGiveupStateColor,
                          marginBottom:0}" 
                 :onPress="()=>quitDelivery()">
        <nb-text :style="{fontWeight:'bold',fontSize:12,color:'black'}">Desistir</nb-text>
      </nb-button>
    </nb-card-item>
    </view>

    <dialog :dialogStyle="{marginLeft:-25,width:'120%'}" :visible="dialogAndamentoState" :title="'#Pedido: '+orders[0].id+' - '+orders[0].consumer_name" :animationType="'slide'">
      <view>
        <nb-card class="mb-15">
          <nb-card-item header>
            <nb-text>Como Está o Andamento da Entrega?</nb-text>
          </nb-card-item>
          <nb-spinner v-if="spinner2" color="blue"/>
          
          <view v-if="!spinner2">
          <nb-card-item :style="{ marginTop: -15 }">
            <nb-left>
              <nb-icon  v-if="!dialogs.disabled.camp_inprogress" active name="close" />
              <nb-radio v-if="dialogs.disabled.camp_inprogress" :selected="dialogs.delivery.camp_inprogress" 
                        :onPress="()=>changeState('camp_inprogress')"/>
              <nb-text :disabled="!dialogs.disabled.camp_inprogress" 
                       :onPress="()=>changeState('camp_inprogress')">Aguardando o Vendedor</nb-text>
            </nb-left>
          </nb-card-item>
          <nb-card-item :style="{ marginTop: -15 }">
            <nb-left>
              <nb-icon  v-if="!dialogs.disabled.camp_in_route" active name="close" />
              <nb-radio v-if="dialogs.disabled.camp_in_route" :selected="dialogs.delivery.camp_in_route" 
                        :onPress="()=>changeState('camp_in_route')"/>
              <nb-text :disabled="!dialogs.disabled.camp_in_route" 
                       :onPress="()=>changeState('camp_in_route')">Saiu para a Entrega</nb-text>
            </nb-left>
          </nb-card-item>
          <nb-card-item :style="{ marginTop: -15 }">
            <nb-left>
              <nb-icon  v-if="!dialogs.disabled.camp_fail" active name="close" />
              <nb-radio v-if="dialogs.disabled.camp_fail" :selected="dialogs.delivery.camp_fail" 
                        :onPress="()=>changeState('camp_fail')"/>
              <nb-text :disabled="!dialogs.disabled.camp_fail"  
                       :onPress="()=>changeState('camp_fail')">A Entrega Falhou</nb-text>
            </nb-left>
          </nb-card-item>
          <nb-card-item :style="{ marginTop: -15 }">
            <nb-left>
              <nb-icon  v-if="!dialogs.disabled.camp_canceled" active name="close" />
              <nb-radio v-if="dialogs.disabled.camp_canceled" :selected="dialogs.delivery.camp_canceled" 
                        :onPress="()=>changeState('camp_canceled')"/>
              <nb-text :disabled="!dialogs.disabled.camp_canceled"
                       :onPress="()=>changeState('camp_canceled')">Entrega Cancelada</nb-text>
            </nb-left>
          </nb-card-item>
          <nb-card-item :style="{ marginTop: -15 }">
            <nb-left>
              <nb-icon  v-if="!dialogs.disabled.camp_finished" active name="close" />
              <nb-radio v-if="dialogs.disabled.camp_finished" :selected="dialogs.delivery.camp_finished" 
                        :onPress="()=>changeState('camp_finished')"/>
              <nb-text :disabled="!dialogs.disabled.camp_finished"
                       :onPress="()=>changeState('camp_finished')">Pedido Entregue</nb-text>
            </nb-left>
          </nb-card-item>
          </view>
        </nb-card>
        <nb-button block primary rounded :style="{ marginTop: 20 }" 
                   :onPress="()=>controlDialog('close')">
        <nb-text>FECHAR</nb-text>
      </nb-button>
      </view>
    </dialog>
   </view>
</template>

<script>
import React from "react"
import moment from 'moment'
import ButtonSpinner from 'react-native-button-spinner'
import Icon2 from 'react-native-vector-icons/FontAwesome'
import Icon3 from 'react-native-vector-icons/MaterialCommunityIcons'
import { Dimensions, Platform } from "react-native"
import { Icon } from "native-base"
import { Dialog } from 'react-native-simple-dialogs'

import ControlStateMixins from "@/mixins/controlStateMixins"

import WhiteLoader from "../../../../assets/white-loader.gif"
import BlueLoader from "../../../../assets/blue-loader.gif"
import OrangeLoader from "../../../../assets/orange-loader.gif"
import GreenLoader2 from "../../../../assets/green2-loader.gif"
import GreenLoader from "../../../../assets/green-loader.gif"
import RedLoader2 from "../../../../assets/red-loader2.gif"
import RedLoader from "../../../../assets/red-loader.gif"

export default {
  components:{ Dialog,ButtonSpinner,Icon2,Icon3 },
  mixins: [ControlStateMixins],
  data() {
    return {

      dialogs:{
        delivery:{
          camp_inprogress:null,
          camp_in_route:null,
          camp_fail:null,
          camp_canceled:null,
          camp_finished:null
        },
        sale:{
          waiting:null,
          processing:null,
          inprogress:null,
          delivering:null,
          fail:null,
          canceled:null,
          finished:null,
        },
        disabled:{
          camp_inprogress:true,
          camp_in_route:true,
          camp_fail:true,
          camp_canceled:true,
          camp_finished:true
        },
      },

      spinner1:false,
      spinner2:false,
      positionSpinner:'centered-without-text',
      dialogAndamentoState:false,
      WhiteLoader,
      BlueLoader,
      OrangeLoader,
      GreenLoader2,
      GreenLoader,
      RedLoader2,
      RedLoader
    }
  },
  
  created(){
    this.setMixin(this.saleState,this.deliveryState)
    this.setDialogState()
  },

  props: {

    updateFromChild:{
      type:Function
    },

    products:{
      type:Array
    },

    updateFather:{
      type:Function,
      require:true
    },
    navigation: {
      type: Object
    },
    delivery:{
      type: Object,
      required: true
    },
    organizations:{
      type: Array
    },
    auth:{
      type: Object,
      required: false 
    },

  },
  computed:{

    order_id(){
      let delivery = this.delivery
      return delivery["orders"][0].id
    },

    deliveryState(){
      return this.orders[0].delivery_state
    },

    saleState(){
      return this.orders[0].salesman_state
    },

    orders(){
      return this.delivery["orders"]
    },
    
    order_reference(){
      return this.orders[0].reference
    },

    orderTotal(){
      let total = 0
      let orders = this.orders
      for (let i=0;i<orders.length;i++){
        let order = orders[i]
        total += parseFloat(order.total)
      }
      return total
    },
    
    orderAdress(){
      return this.orders[0].address
    }

  },

  methods: {

    setBtn(btn,disabledState,color,fontColor,text){
      if (btn=='delivery'){
        this.mixinBtnDeliveryState = disabledState
        this.mixinBtnDeliveryStateColor = color
        this.mixinBtnDeliveryTextColor = fontColor
        this.mixinBtnDeliveryText = text
      }
      if (btn=='giveup'){
        this.mixinBtnGiveupState = disabledState
        this.mixinBtnGiveupStateColor = color
        this.mixinBtnGiveupStateTextColor = fontColor
        this.mixinBtnGiveupStateText = text
      }
    },

    setRadio(obj,prop,action){
      let aux = eval(obj)
      aux[prop] = action
    },

    setMixin(saleState,deliveryState){
      this.setMixinState(saleState,'waiting','alarm','grey',"aguardando atendimento",this.WhiteLoader)
      this.setMixinState(saleState,'processing','alarm','#FF9501',"Em Andamento",this.OrangeLoader)
      this.setMixinState(saleState,'inprogress','alarm','blue',"Aguardando Entregador",this.BlueLoader)
      this.setMixinState(saleState,'delivering','bicycle','green',"Saiu Para Entrega",this.GreenLoader2)
      this.setMixinState(saleState,'fail','bicycle','red',"A Entrega Falhou",this.RedLoader)
      this.setMixinState(saleState,'canceled','close','red',"Entrega Cancelada",this.RedLoader2)
      this.setMixinState(saleState,'finished','star','green',"Entregue",this.GreenLoader)

      this.setMixinState2(saleState,'waiting',deliveryState,'camp_in_route',
                                                               'bicycle','green',"Saiu Para Entrega",this.GreenLoader)
      this.setMixinState2(saleState,'inprogress',deliveryState,'camp_in_route',
                                                               'bicycle','green',"Saiu Para Entrega",this.GreenLoader)
      this.setMixinState2(saleState,'processing',deliveryState,'camp_in_route',
                                                               'bicycle','green',"Saiu Para Entrega",this.GreenLoader)
      this.setMixinState2(saleState,'processing',deliveryState,'camp_fail',
                                                               'bicycle','red',"A Entrega Falhou",this.RedLoader)
      this.setMixinState2(saleState,'processing',deliveryState,'camp_canceled',
                                                               'close','red',"Entrega Cancelada",this.RedLoader2)
      this.setMixinState2(saleState,'processing',deliveryState,'camp_finished',
                                                               'star','green',"Entregue",this.GreenLoader)
      this.setMixinState2(saleState,'delivering',deliveryState,'camp_fail',
                                                               'bicycle','red',"A Entrega Falhou",this.RedLoader)
      this.setMixinState2(saleState,'delivering',deliveryState,'camp_canceled',
                                                               'close','red',"Entrega Cancelada",this.RedLoader2)
      this.setMixinState2(saleState,'delivering',deliveryState,'camp_finished',
                                                               'star','green',"Entregue",this.GreenLoader)


      this.setStateCallback3(deliveryState,'camp_in_route',()=>this.setBtn('giveup',true,'grey',null,'grey'))
      this.setStateCallback3(deliveryState,'camp_fail',()=>this.setBtn('giveup',false,'transparent',null,null))
      this.setStateCallback3(deliveryState,'camp_canceled',()=>this.setBtn('giveup',true,'grey',null,'grey'))
      this.setStateCallback3(deliveryState,'camp_finished',()=>this.setBtn('giveup',true,'grey',null,'grey'))
      this.setStateCallback3(saleState,'delivering',()=>this.setBtn('giveup',true,'grey',null,'grey'))
      this.setStateCallback3(saleState,'canceled',()=>this.setBtn('giveup',true,'grey',null,'grey'))
      this.setStateCallback3(saleState,'finished',()=>this.setBtn('giveup',true,'grey',null,'grey'))

    },


    setDialogState(){

      let sS = this.saleState
      let dS = this.deliveryState
      
      let delivery_camp_inprogress = ['inprogress','finished','delivering','fail','canceled']
      let delivery_camp_finished = ['fail','canceled']

      this.dialogs.delivery.camp_inprogress = false
      this.dialogs.delivery.camp_in_route = false
      this.dialogs.delivery.camp_fail = false
      this.dialogs.delivery.camp_canceled = false
      this.dialogs.delivery.camp_finished = false

      this.dialogState('this.dialogs.delivery','camp_inprogress',dS,'camp_inprogress',true)
      this.dialogState('this.dialogs.delivery','camp_inprogress',sS,'inprogress',false)
      this.dialogState('this.dialogs.delivery','camp_in_route',dS,'camp_in_route',true)
      this.dialogState('this.dialogs.delivery','camp_fail',dS,'camp_fail',true)
      this.dialogState('this.dialogs.delivery','camp_canceled',dS,'camp_canceled',true)
      this.dialogState('this.dialogs.delivery','camp_finished',dS,'camp_finished',true)
      
      this.dialogStateDisable('this.dialogs.delivery','camp_inprogress',sS,delivery_camp_inprogress,
          ()=>this.setRadio('this.dialogs.disabled','camp_inprogress',false))


      this.dialogStateDisable('this.dialogs.delivery','camp_finished',sS,delivery_camp_finished,
          ()=>this.setRadio('this.dialogs.disabled','camp_finished',false))
      
      this.dialogStateDisable('this.dialogs.delivery','camp_in_route',sS,'finished',
          ()=>this.setRadio('this.dialogs.disabled','camp_in_route',false))

      this.dialogStateDisable('this.dialogs.delivery','camp_fail',sS,'finished',
          ()=>this.setRadio('this.dialogs.disabled','camp_fail',false))
      this.dialogStateDisable('this.dialogs.delivery','camp_fail',sS,'processing',
          ()=>this.setRadio('this.dialogs.disabled','camp_fail',false))
      this.dialogStateDisable('this.dialogs.delivery','camp_fail',sS,'waiting',
          ()=>this.setRadio('this.dialogs.disabled','camp_fail',false))
      this.dialogStateDisable('this.dialogs.delivery','camp_fail',sS,'inprogress',
          ()=>this.setRadio('this.dialogs.disabled','camp_fail',false))
      
      this.dialogStateDisable('this.dialogs.delivery','camp_canceled',sS,'finished',
          ()=>this.setRadio('this.dialogs.disabled','camp_canceled',false))
      this.dialogStateDisable('this.dialogs.delivery','camp_canceled',sS,'processing',
          ()=>this.setRadio('this.dialogs.disabled','camp_canceled',false))
      this.dialogStateDisable('this.dialogs.delivery','camp_canceled',sS,'waiting',
          ()=>this.setRadio('this.dialogs.disabled','camp_canceled',false))
      this.dialogStateDisable('this.dialogs.delivery','camp_canceled',sS,'inprogress',
          ()=>this.setRadio('this.dialogs.disabled','camp_canceled',false))


      this.dialogStateDisable('this.dialogs.delivery','camp_finished',sS,'processing',
          ()=>this.setRadio('this.dialogs.disabled','camp_finished',false))
      this.dialogStateDisable('this.dialogs.delivery','camp_finished',sS,'waiting',
          ()=>this.setRadio('this.dialogs.disabled','camp_finished',false))
      this.dialogStateDisable('this.dialogs.delivery','camp_finished',sS,'inprogress',
          ()=>this.setRadio('this.dialogs.disabled','camp_finished',false))

    },

    getSalesNames(){
      let names = []
      for (let i=0;i<this.orders.length;i++){
        let name = this.getSalerName(this.orders[i].product_id)
        names.push(name)
      }
      let unique = [...new Set(names)]   
       return JSON.stringify(unique).replace('[','')
                                     .replace(']','')
                                     .replace('"','')
                                     .replace('"','')
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

    getSalerID(product_id){
      let id = product_id
      try {
        let a = this.products.find(x => x.id === id).organization_id
        let b = this.organizations.find(x => x.id === a).id
        return b
      }catch (e) {
        return ''  
      }
    },

    setDate(){
      let created_at = this.orders[0].created_at
      let data = moment(created_at).format('DD/MM/YYYY')
      let hora = moment(created_at).format('HH:mm')
      return data+" - "+ hora
    },

    getProductName(id){
      try {
        return this.products.find(x => x.id === id).name
      }catch (e) {
        return ''  
      }
    },

    controlDialog(action){
      if (action == 'open'){
        this.dialogAndamentoState = true
        this.updateFromChild(true)
      }
      if (action == 'close'){
        this.dialogAndamentoState = false
        this.updateFromChild(false)
      }
      
    },

    async changeState(data){
      let obj = {}
      this.spinner2 = true
      obj["reference"] = this.order_reference 
      obj["data"] = data
      obj["organization"] = this.getSalerID(this.orders[0]['product_id'])
      await this.$store.dispatch('requests/updateOrderDeliveryState',obj)
      await this.$store.dispatch('requests/fetchOrders',this.auth)
      await this.$store.dispatch('requests/fetchDeliveryStates')
      await this.updateFather()
      this.setMixin(this.saleState,this.deliveryState)
      this.setDialogState()
      this.spinner2 = false      
    },

    async quitDelivery(){
      let delivery = this.delivery["delivery"]
      this.spinner1 = true
      await this.$store.dispatch('deliveries/quit',delivery)
      await this.updateFather()
      this.spinner1 = false
    },
  }
};
</script>

<style>
</style>

