<template>
  
  <nb-container class="spinner-container" v-if="spinner && isSalesman" >
    <nb-spinner color="blue" />
  </nb-container>
   
  <nb-container v-else>

    <nb-header>
      <nb-thumbnail :style="{flex:1}" :source="logo"/>
    </nb-header>

    <nb-header>
      
      <nb-left>
        <nb-button transparent :onPress="() => this.props.navigation.navigate('Home')" v-if="isSalesman">
          <nb-icon name="arrow-back" />
        </nb-button>
      </nb-left>
      <nb-body>
        <nb-title :style="{textAlign:'center',width:200}">CADASTRO</nb-title>
      </nb-body>
      <nb-right />
    </nb-header>

    <nb-content padder>
      <nb-button :onPress="()=>tomarFoto()" iconLeft rounded large block>
        <nb-icon active name="camera" />
        <nb-text>TIRAR FOTO</nb-text>
      </nb-button>
      
      <nb-thumbnail v-if="foto_status"
        square
        large
        :source="{ uri: fotomeme }"
        :style="{marginLeft:-10,marginTop:15,width:thumb_1_w,height:thumb_1_h}"
      />

      <nb-thumbnail v-if="foto_status == false"
        square
        large
        :source="tempFotoMeme"
        :style="{marginLeft:-10,marginTop:15,width:thumb_2_w,height:thumb_2_h}"
      />

      <nb-form>

        <nb-item>
          <nb-label>EMPRESA:</nb-label>
          <nb-input v-model="form.organization_id" class="x" :placeholder="organization.name" disabled/>
        </nb-item>

        <nb-item v-bind:success="validationName.item_success_status"
                 v-bind:error="validationName.item_error_status">
          <nb-input v-model="form.name" :on-blur="validateName" placeholder='NOME DO PRODUTO' />
          <nb-icon v-if="validationName.icon_error_status" name="close-circle" />
          <nb-icon v-if="validationName.icon_success_status" name="checkmark-circle" />
        </nb-item>
          <nb-text v-if="validationName.icon_error_status" :style="{marginLeft:15,color:'red'}">cccccc</nb-text>

                    
        <nb-item v-bind:success="validationDescription.item_success_status"
                 v-bind:error="validationDescription.item_error_status">
          <nb-input v-model="form.description" :on-blur="validateDescription" placeholder='DETALHES DO PRODUTO' />
          <nb-icon v-if="validationDescription.icon_error_status" name="close-circle" />
          <nb-icon v-if="validationDescription.icon_success_status" name="checkmark-circle" />
        </nb-item>

        <nb-item v-bind:success="validationPrice.item_success_status"
                 v-bind:error="validationPrice.item_error_status">
          <nb-input v-model="form.price" :on-blur="validatePrice" keyboardType='numeric' placeholder='PREÇO' />
          <nb-icon v-if="validationPrice.icon_error_status" name="close-circle" />
          <nb-icon v-if="validationPrice.icon_success_status" name="checkmark-circle" />         
        </nb-item>

        <!-- <nb-item picker>
          <nb-picker
            mode="dropdown"
            :style="{ width: 300 }"
            :selectedValue="selected"
            :onValueChange="()=>onValueChange()"
          >
            <item label="VENDIDO POR UNIDADE" value="key0" />
            <item label="VENDIDO POR KILO" value="key1" />
            <item label="VENDIDO POR LITRO" value="key2" />
          </nb-picker>
        </nb-item> -->

      </nb-form>
      
      <nb-button :style="{ marginTop: 10 }" :onPress="()=>cadastrarProduto()" block>
        <nb-icon active name="paper" />
        <nb-text>Cadastrar produto</nb-text>
      </nb-button>

      <toast/>

    </nb-content>
  </nb-container>
 
</template>

<script>
import React, { Component } from 'react'
import { Video } from "expo-av"
import { Picker, Icon } from "native-base"
import { required } from 'vuelidate/lib/validators'
import { Text, Alert, TouchableOpacity } from 'react-native'
import Toast from 'react-native-root-toast'
import axios from 'axios'
import Tips from 'react-native-root-tips'
import { widthPercentageToDP as wp, 
         heightPercentageToDP as hp} from 'react-native-responsive-screen'

import tempFotoMeme from "../../../assets/images.png"
import logo from "../../../assets/logo-final.png"


export default {
  components: {Toast},
  data() {
    return {
      logo,
      form:{
        name:'',
        description:'',
        price:'',
        img:'',
        organization_id:''
      },
      tempFotoMeme,
      validationName:{
        item_success_status:'',
        item_error_status:'',
        icon_error_status:'',
        icon_success_status:''
      },
      validationDescription:{
        item_success_status:'',
        item_error_status:'',
        icon_error_status:'',
        icon_success_status:''
      },
      validationPrice:{
        item_success_status:'',
        item_error_status:'',
        icon_error_status:'',
        icon_success_status:''
      },
      foto_status:false,
      fotomeme: "",
      spinner:false,
      thumb_1_w:wp('100%'),
      thumb_1_h:hp('50%'),
      thumb_2_w:wp('100%'),
      thumb_2_h:hp('50%')
    }
  },

  computed:{
    
    organization(){
      this.form.organization_id = this.$store.state.auth.organization.id 
      return this.$store.state.auth.organization
    },

    isSalesman(){
      return this.$store.state.auth.isSalesman
    },
    // isDeliveryman(){
    //   return this.$store.state.auth.isDeliveryman
    // },
  },

  validations:{
    form:{
      organization_id: { required },
      name:{ required },
      description: { required },
      price:{ required }
    }
  },

  props: {
    navigation: {
      type: Object
    }
  },

  methods: {

    mostraSpinner(s){
      this.spinner = s
    },
  
    validateName(){
      var result = undefined
      if (!this.$v.form.name.required){
        this.validationName.icon_error_status = true
        this.validationName.item_error_status = true
        this.validationName.item_success_status = false
        this.validationName.icon_success_status = false
        result = true
      }else{
        this.validationName.icon_error_status = false
        this.validationName.item_error_status = false
        this.validationName.item_success_status = true
        this.validationName.icon_success_status = true
        result = false
      }
      return result
    },

    validateDescription(){
      var result = undefined
      if (!this.$v.form.description.required){
        this.validationDescription.icon_error_status = true
        this.validationDescription.item_error_status = true
        this.validationDescription.item_success_status = false
        this.validationDescription.icon_success_status = false
        result = true
      }else{
        this.validationDescription.icon_error_status = false
        this.validationDescription.item_error_status = false
        this.validationDescription.item_success_status = true
        this.validationDescription.icon_success_status = true
        result = false
      }
      return result
    },

    validatePrice(){
      var result = undefined
      if (!this.$v.form.price.required){
        this.validationPrice.icon_error_status = true
        this.validationPrice.item_error_status = true
        this.validationPrice.item_success_status = false
        this.validationPrice.icon_success_status = false
        result = true
      }else{
        this.validationPrice.icon_error_status = false
        this.validationPrice.item_error_status = false
        this.validationPrice.item_success_status = true
        this.validationPrice.icon_success_status = true
        result = false
      }
      return result
    },
    
    getIosIcon: function() {
      return <Icon name="ios-arrow-down-outline" />
    },
    
    tomarFoto() {
      this.navigation.navigate("Camara", {
        onGoBack: this.refresh,
        tipo: "Foto"
      })
      this.foto_status = true
    },
    refresh(data, tipo) {
      tipo == "Foto" ? (this.fotomeme = data) : (this.videomeme = data)
    },
    resetForm(){
      this.form.name = ''
      this.form.description = ''
      this.form.price = ''
      this.fotomeme = ''
      this.foto_status = false
      this.validationName.icon_success_status = false
      this.validationName.item_success_status = false
      this.validationPrice.icon_success_status = false
      this.validationPrice.item_success_status = false
      this.validationDescription.icon_success_status = false
      this.validationDescription.item_success_status = false
      Toast.show('PRODUTO CADASTRADO COM SUCESSO!', {
          duration: Toast.durations.LONG,
          position: Toast.positions.CENTER,
          shadow: false,
          backgroundColor: 'blue',
          animation: true,
          hideOnPress: true,
          delay: 0
        })
    },
    cadastrarProduto(){
      this.$v.form.$touch()
      if (this.$v.form.$invalid){
        this.validateName()
        this.validateDescription()
        this.validatePrice()
        Toast.show('ERRO! VERIFIQUE OS CAMPOS', {
          duration: Toast.durations.LONG,
          position: Toast.positions.CENTER,
          shadow: false,
          backgroundColor: 'red',
          animation: true,
          hideOnPress: true,
          delay: 0
        })
      }else{
        Alert.alert('CADASTRAR PRODUTO','DESEJA CADASTRAR ESSE PRODUTO?',
          [
            {text: 'NÃO', onPress: () => null, style: 'cancel'},
            {text: 'SIM', onPress: () => this.cadastraProduto()},
          ]
        )
      }
    },

    async cadastraProduto(){
      await this.mostraSpinner(true)
      await this.uploadFoto(this)
      this.resetForm()
    },

    async uploadFoto(context){
      let cloud = 'campinapolis-com'
      let upload_url = 'https://api.cloudinary.com/v1_1/campinapolis-com/image/upload'
      let formdata = new FormData()
      let uri = this.fotomeme
      formdata.append('file', {uri: uri, type: 'image/png', name: 'upload.png'})
      formdata.append('upload_preset','camp-delivery')
      await axios({
        method: 'post',
        url: upload_url,
        data: formdata
      }).then(function (response) {
        if (!context.$v.form.$invalid){
          let dataTemp = new FormData()
          let dataFinal = new FormData()
          let data = response.data
          let url = data["url"]
          context.form.img = url
          context.form.category = "generico"
          context.$store.dispatch('products/newProduct',context.form).then(() => {
            context.mostraSpinner(false)          
          }
          ).catch(err =>{
            null
          })
        }
      }).catch(function (response) {
        null
      })
    }
  },
};
</script>

<style>
.spinner-container{
  display: flex;
  justify-content: center;
}
.efe {
  /*padding-top: 10px;*/
  /*height:45%;*/
  align-items: center;
  /* align:center; */
}
.test {
  margin-top: 20px;
  width: 10%;
  height: 10%;
}
.test1 {
  width: 300px;
  height: 80%;
}
.x{
  font-size:14px;
   color: grey;
}
</style>