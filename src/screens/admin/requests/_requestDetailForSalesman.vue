<template>

  <view>

      <!-- <nb-thumbnail :style="{marginLeft:15,height:40,marginTop:-10}" :source="mixinCSGif"/> -->
      <nb-text :style="{marginLeft:15,marginTop:15,marginBottom:-10,fontWeight: 'bold',color:'black'}">#PEDIDO :{{order_id}} - {{listOrders[0].consumer_name | primeiro_nome}}</nb-text>
    
    <!-- <nb-list-item itemHeader first>
      <nb-text>{{getSalesNames() | nome_dos_vendedores}}</nb-text>
    </nb-list-item> -->
    <nb-list-item itemHeader>
      <nb-text>{{mixinCSText}}</nb-text>
    </nb-list-item>
    <nb-list-item :style="{marginTop:-50}" itemHeader>
      <nb-text>{{orderAdress}}</nb-text>
    </nb-list-item>


    <nb-list-item :style="{ marginTop:-20 }" icon>
      
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

    
    <nb-card-item>
      <nb-button :disabled="mixinBtnDeliveryState" small bordered 
                 :style="{backgroundColor:mixinBtnDeliveryStateColor,
                          marginBottom: 0 }" 
                 :onPress="()=>controlDialog('delivery','open')">
        <nb-text :style="{fontWeight:'bold',fontSize:12,color:mixinBtnDeliveryTextColor}">{{mixinBtnDeliveryText}}</nb-text>
      </nb-button>
      <nb-button  :disabled="mixinBtnAndamentoState" small 
                  :style="{backgroundColor:mixinBtnAndamentoStateColor,
                           marginLeft:10,
                           marginBottom: 0}"            
                  :onPress="()=>controlDialog('sale','open')" >
        <nb-text  :style="{fontWeight:'bold',fontSize:12,color:mixinBtnAndamentoTextColor}">Andamento</nb-text>
      </nb-button>
      <nb-button  :disabled="mixinBtnAndamentoState" small
                  :style="{backgroundColor:'blue',
                           marginLeft:10,
                           marginBottom: 0}"           
                  :onPress="()=>print()" >
                  <nb-icon name="print" />
      </nb-button>
    </nb-card-item>
    
    <dialog :visible="dialogDeliveryState" :title="'#Pedido: '+listOrders[0].id+' - '+listOrders[0].consumer_name" :animationType="'fade'">
      <view :style="{borderRadius:10}">
        <nb-card :style="{alignItems: 'center'}" class="mb-15">
          <nb-card-item header>
            <nb-text>Quem vai entregar?</nb-text>
          </nb-card-item>
          <nb-card-item>
            <nb-spinner v-if="spinner1" color="blue"/>
            <nb-left v-if="!spinner1">
              <nb-radio :selected="dialogs.delivery.accepted_to_salesman"
                        :onPress="()=>changeState('delivery','accepted_to_salesman')"/>
              <nb-text :onPress="()=>changeState('delivery','accepted_to_salesman')">Meu entregador</nb-text>
            </nb-left>
          </nb-card-item>
          <nb-card-item>
            <nb-left v-if="!spinner1">
              <nb-radio :selected="dialogs.delivery.accepted_to_camp"
                        :onPress="()=>changeState('delivery','accepted_to_camp')"/>
              <nb-text :onPress="()=>changeState('delivery','accepted_to_camp')">Camp entregas</nb-text>
            </nb-left>
          </nb-card-item>
        </nb-card>
        <nb-button block primary :style="{ marginTop: 20 }" 
                   :onPress="()=>controlDialog('delivery','close')">
        <nb-text>FECHAR</nb-text>
      </nb-button>
      </view>
    </dialog>

    <dialog :visible="dialogSaleState" :title="'#Pedido: '+listOrders[0].id+' - '+listOrders[0].consumer_name" :animationType="'fade'">
      <view>
        <nb-card :style="{alignItems: 'center'}" class="mb-15">
          <nb-card-item header>
            <nb-text>Como está o andamento do pedido?</nb-text>
          </nb-card-item>

          <nb-card-item :style="{ marginTop: -15 }">
            <nb-spinner v-if="spinner2" color="blue"/>
            <nb-left v-if="!spinner2">
              <nb-icon  v-if="!dialogs.disabled.processing" active name="close" />
              <nb-radio v-if="dialogs.disabled.processing" :selected="dialogs.sale.processing" 
                        :onPress="()=>changeState('sale','processing')" />
              <nb-text  :disabled="!dialogs.disabled.processing" 
                        :onPress="()=>changeState('sale','processing')">Em andamento</nb-text>
            </nb-left>
          </nb-card-item>
          <nb-card-item :style="{ marginTop: -15 }">
            <nb-left v-if="!spinner2">
              <nb-icon  v-if="!dialogs.disabled.inprogress" active name="close" />
              <nb-radio v-if="dialogs.disabled.inprogress" :selected="dialogs.sale.inprogress"
                        :onPress="()=>changeState('sale','inprogress')"/>
              <nb-text :disabled="!dialogs.disabled.inprogress" 
                       :onPress="()=>changeState('sale','inprogress')">Aguardando entregador</nb-text>
            </nb-left>
          </nb-card-item>
          <nb-card-item :style="{ marginTop: -15 }">
            <nb-left v-if="!spinner2">
              <nb-icon  v-if="!dialogs.disabled.delivering" active name="close" />
              <nb-radio v-if="dialogs.disabled.delivering" :selected="dialogs.sale.delivering"
                        :onPress="()=>changeState('sale','delivering')"/>
              <nb-text  :disabled="!dialogs.disabled.delivering" 
                        :onPress="()=>changeState('sale','delivering')">Saiu para a entrega</nb-text>
            </nb-left>
          </nb-card-item>
          <nb-card-item :style="{ marginTop: -15 }">
            <nb-left v-if="!spinner2">
              <nb-icon  v-if="!dialogs.disabled.fail" active name="close" />
              <nb-radio v-if="dialogs.disabled.fail" :selected="dialogs.sale.fail" 
                        :onPress="()=>changeState('sale','fail')"/>
              <nb-text  :disabled="!dialogs.disabled.fail" 
                        :onPress="()=>changeState('sale','fail')">Entrega falhou</nb-text>
            </nb-left>
          </nb-card-item>
          <nb-card-item :style="{ marginTop: -15 }">
            <nb-left v-if="!spinner2">
              <nb-icon  v-if="!dialogs.disabled.canceled" active name="close" />
              <nb-radio v-if="dialogs.disabled.canceled" :selected="dialogs.sale.canceled"
                        :onPress="()=>changeState('sale','canceled')"/>
              <nb-text :disabled="!dialogs.disabled.canceled"
                       :onPress="()=>changeState('sale','canceled')">Cancelada</nb-text>
            </nb-left>
          </nb-card-item>
          <nb-card-item :style="{ marginTop: -15 }">
            <nb-left v-if="!spinner2">
              <nb-icon  v-if="!dialogs.disabled.finished" active name="close" />
              <nb-radio v-if="dialogs.disabled.finished" :selected="dialogs.sale.finished"
                        :onPress="()=>changeState('sale','finished')"/>
              <nb-text  :disabled="!dialogs.disabled.finished" 
                        :onPress="()=>changeState('sale','finished')">Entregue</nb-text>
            </nb-left>
          </nb-card-item>
          
        </nb-card>
        <nb-button block primary :style="{ marginTop: 20 }" :onPress="()=>controlDialog('sale','close')">
        <nb-text>FECHAR</nb-text>
      </nb-button>
      </view>
    </dialog>

  </view>
  
</template>

<script>
import * as WebBrowser from 'expo-web-browser'
import { Dialog } from 'react-native-simple-dialogs'
import moment from 'moment'
// import WhiteLoader from "../../../../assets/white-loader.gif"
// import BlueLoader from "../../../../assets/blue-loader.gif"
// import OrangeLoader from "../../../../assets/orange-loader.gif"
// import GreenLoader2 from "../../../../assets/green2-loader.gif"
// import GreenLoader from "../../../../assets/green-loader.gif"
// import RedLoader2 from "../../../../assets/red-loader2.gif"
// import RedLoader from "../../../../assets/red-loader.gif"

import ControlStateMixins from "@/mixins/controlStateMixins"

export default {
  components:{ Dialog },
  mixins: [ControlStateMixins],
  data() {
    return {
      dialogs:{
        delivery:{
          accepted_to_salesman:null,
          accepted_to_camp:null,
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
          waiting:true,
          processing:true,
          inprogress:true,
          delivering:true,
          fail:true,
          canceled:true,
          finished:true,
        },
      },
 
      spinner1:false,
      spinner2:false,
      dialogDeliveryState:false,
      dialogSaleState:false,
      // WhiteLoader,
      // BlueLoader,
      // OrangeLoader,
      // GreenLoader2,
      // GreenLoader,
      // RedLoader2,
      // RedLoader
    }
  },

  props: {

    updateFromChild:{
      type:Function
    },

    products:{
      type:Array
    },

    organizations:{
      type:Array
    },

    auth:{
      type: Object,
      required: false 
    },

    navigation: {
      type: Object
    },

    listOrders:{
      type: Array,
      required: false
    },
    salesStates:{
      type: Object,
    },
    deliveryStates:{
      type: Object
    }

  },

  created(){
    
    let sS = this.salesStates[this.listOrders[0].id]
    let dS = this.deliveryStates[this.listOrders[0].id]
    this.setMixin(sS,dS)
    this.setDialogState()
  },

  computed:{

    orderTotal(){
      let total = 0
      let orders = this.listOrders
      for (let i=0;i<orders.length;i++){
        let order = orders[i]
        total += parseFloat(order.total)
      }
      return total
    },

    orderAdress(){
      return this.listOrders[0].address
    },

    order_id(){
      return this.listOrders[0].id
    },

    order_reference(){
      return this.listOrders[0].reference
    },
  
  },

  methods: {

    print(){
      let url = "print://escpos.org/escpos/bt/print?srcTp=uri&srcObj=html&numCopies=1&src='https://loopedlabs.com/web-print/bill.html'"
      WebBrowser.openBrowserAsync(url)
    },

    setBtn(btn,disabledState,color,fontColor,text){
      if (btn=='sale'){
        this.mixinBtnAndamentoState = disabledState
        this.mixinBtnAndamentoStateColor = color
        this.mixinBtnAndamentoTextColor = fontColor
        this.mixinBtnAndamentoText = text
      }
      if (btn=='delivery'){
        this.mixinBtnDeliveryState = disabledState
        this.mixinBtnDeliveryStateColor = color
        this.mixinBtnDeliveryTextColor = fontColor
        this.mixinBtnDeliveryText = text
      }
    },

    setRadio(obj,prop,action){
      let aux = eval(obj)
      aux[prop] = action
    },

    setMixin(saleState,deliveryState){
      let arr1 = ['accepted_to_camp','camp_inprogress','camp_in_route','camp_fail','camp_canceled',
                                 'camp_finished','accepted_to_salesman','salesman_inprogress','salesman_fail',
                                 'salesman_canceled','salesman_finished']


      let arr2 = ['camp_inprogress','camp_in_route','camp_fail','camp_canceled','camp_finished',
                   'salesman_inprogress','salesman_fail','salesman_canceled','salesman_finished']

      this.setStateCallback1(deliveryState,'waiting',()=>this.setBtn('sale',true,'grey'))
      this.setStateCallback4(deliveryState,'waiting',()=>this.setBtn('sale',false,'transparent'))
      
      this.setStateCallback3(deliveryState,arr1,()=>this.setBtn('delivery',false,'#3F51B5','white','ENTREGADOR'))
      this.setStateCallback3(deliveryState,arr2,()=>this.setBtn('delivery',true,'green','white','OK'))
      this.setStateCallback3(deliveryState,'waiting',()=>this.setBtn('delivery',false,'#3F51B5','white','ENTREGADOR'))

      this.setStateCallback5("this.deliveryState=='waiting' && this.saleState=='waiting'",
        ()=>this.setBtn('delivery',false,'transparent','black','ENTREGADOR'))
      
      this.setMixinState(saleState,'waiting','alarm','grey',"aguardando atendimento",this.WhiteLoader)
      this.setMixinState(saleState,'processing','alarm','#FF9501',"Em Andamento",this.OrangeLoader)
      this.setMixinState(saleState,'inprogress','alarm','blue',"Aguardando Entregador",this.BlueLoader)
      this.setMixinState(saleState,'delivering','bicycle','green',"Saiu Para Entrega",this.GreenLoader2)
      this.setMixinState(saleState,'fail','bicycle','red',"A Entrega Falhou",this.RedLoader)
      this.setMixinState(saleState,'canceled','close','red',"Entrega Cancelada",this.RedLoader2)
      this.setMixinState(saleState,'finished','star','green',"Entregue",this.GreenLoader)

      this.setMixinState2(saleState,'waiting',deliveryState,'camp_in_route',
                          'bicycle','green',"Saiu Para Entrega",this.GreenLoader)
     
    },


    setDialogState(){
      let sS = this.salesStates[this.listOrders[0].id]
      let dS = this.deliveryStates[this.listOrders[0].id]
      this.dialogs.delivery.accepted_to_salesman = false
      this.dialogs.delivery.accepted_to_camp = false
      this.dialogs.sale.processing = false
      this.dialogs.sale.inprogress = false
      this.dialogs.sale.delivering = false
      this.dialogs.sale.fail = false
      this.dialogs.sale.canceled = false
      this.dialogs.sale.finished = false
      this.dialogs.disabled.inprogress = true
      this.dialogs.disabled.delivering = true
      this.dialogs.disabled.fail = true
      this.dialogs.disabled.finished = true

      let aux_1 = ['accepted_to_salesman','salesman_inprogress','salesman_fail',
                   'salesman_canceled','salesman_finished']

      let aux_2 = ['accepted_to_camp','camp_inprogress','camp_in_route',
                   'camp_fail','camp_canceled','camp_finished']

      let sale_inprogress = ['camp_fail','camp_canceled','camp_finished',
                             'camp_in_route','accepted_to_salesman','salesman_inprogress',
                             'salesman_fail','salesman_canceled','salesman_finished']

      let sale_processing = ['camp_in_route','camp_fail','camp_canceled','camp_finished']

      let sale_finished = ['waiting','accepted_to_camp','camp_inprogress','camp_in_route',
                           'camp_fail','camp_canceled','camp_finished']

      let sale_fail = ['accepted_to_camp','camp_inprogress','camp_in_route','camp_finished']

      let sale_delivering = ['accepted_to_camp','camp_finished']

      this.dialogState('this.dialogs.delivery','accepted_to_salesman',dS,aux_1,true)
      this.dialogState('this.dialogs.delivery','accepted_to_camp',dS,aux_2,true)
      
      this.dialogState('this.dialogs.sale','processing',sS,'processing',true)
      this.dialogState('this.dialogs.sale','inprogress',sS,'inprogress',true)
      this.dialogState('this.dialogs.sale','delivering',sS,'delivering',true)
      this.dialogState('this.dialogs.sale','fail',sS,'fail',true)
      this.dialogState('this.dialogs.sale','canceled',sS,'canceled',true)
      this.dialogState('this.dialogs.sale','finished',sS,'finished',true)

      this.dialogStateDisable('this.dialogs.sale','inprogress',dS,sale_inprogress,
      ()=>this.setRadio('this.dialogs.disabled','inprogress',false))

      this.dialogStateDisable('this.dialogs.sale','processing',dS,sale_processing,
          ()=>this.setRadio('this.dialogs.disabled','processing',false))
      
      this.dialogStateDisable('this.dialogs.sale','delivering',dS,sale_delivering,
          ()=>this.setRadio('this.dialogs.disabled','delivering',false))
      
      this.dialogStateDisable('this.dialogs.sale','finished',dS,sale_finished,
          ()=>this.setRadio('this.dialogs.disabled','finished',false))
      this.dialogStateDisable('this.dialogs.sale','finished',dS,'camp_finished',
          ()=>this.setRadio('this.dialogs.disabled','finished',true))
      
      this.dialogStateDisable('this.dialogs.sale','canceled',dS,'camp_finished',
          ()=>this.setRadio('this.dialogs.disabled','canceled',false))

      this.dialogStateDisable('this.dialogs.sale','fail',dS,sale_fail,
          ()=>this.setRadio('this.dialogs.disabled','fail',false))
      
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

    async changeState(dialog,state){
      let obj = {}
      obj["reference"] = this.order_reference
      obj["data"] = state
      if (dialog == 'delivery'){
        this.spinner1 = true
        obj["organization"] = this.auth["organization"].id
        await this.$store.dispatch('requests/updateOrderDeliveryState',obj)
        await this.$store.dispatch('requests/fetchOrders',this.auth)
        await this.$store.dispatch('requests/fetchDeliveryStates')
        this.spinner1 = false  
      }
      if (dialog == 'sale'){
        this.spinner2 = true
        obj["organization"] = this.auth["organization"].id
        await this.$store.dispatch('requests/updateOrderSaleState',obj)
        await this.$store.dispatch('requests/fetchOrders',this.auth)
        await this.$store.dispatch('requests/fetchSalesStates')
        this.spinner2 = false
      }
      let sS = this.salesStates[this.listOrders[0].id]
      let dS = this.deliveryStates[this.listOrders[0].id]
      this.setDialogState()
      this.setMixin(sS,dS)
    },

    controlDialog(dialog,action){
      if (dialog == 'delivery' && action == 'open'){
        this.dialogDeliveryState = true
        this.updateFromChild(true)
      }
      if (dialog == 'delivery' && action == 'close'){
        this.dialogDeliveryState = false
        this.updateFromChild(false)
      }
      if (dialog == 'sale' && action == 'open'){
        this.dialogSaleState = true
        this.updateFromChild(true)
      }
      if (dialog == 'sale' && action == 'close'){
        this.dialogSaleState = false
        this.updateFromChild(false)
      }
        
    },   
  
  }

};
</script>

<style>
</style>