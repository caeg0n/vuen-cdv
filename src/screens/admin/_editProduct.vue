<template>

  <nb-container>

    <nb-container class="spinner-container" v-if="spinner" >
      <nb-spinner color="blue" />
    </nb-container>

    <nb-form v-if="!spinner">

        <nb-item>
          <nb-label>EMPRESA:</nb-label>
          <nb-input v-model="form.organization_id" :placeholder="organization.name" disabled/>
        </nb-item>

        <InputWithError :error="$v.form.name.$dirty && !$v.form.name.required"
                        msg="Nome do produto">
          <nb-input v-model="form.name"
                    placeholder="produto"
                    auto-capitalize="none"
                    :on-blur="() => $v.form.name.$touch()"
                    />
        </InputWithError>

        <InputWithError :error="$v.form.description.$dirty && !$v.form.description.required"
                        msg="Descrição do produto">
          <nb-input v-model="form.description"
                    placeholder="descrição"
                    auto-capitalize="none"
                    :on-blur="() => $v.form.description.$touch()"
                    />
        </InputWithError>

        <InputWithError :error="$v.form.price.$dirty && !$v.form.price.required"
                        msg="preço">
          <nb-input v-model="form.price"
                    placeholder="preço"
                    auto-capitalize="none"
                    keyboardType='numeric'
                    :on-blur="() => $v.form.price.$touch()"
                    />
        </InputWithError>

        <nb-item picker>
          <nb-picker
            mode="list"
            :style="{ width: 300 }"
            :selectedValue="selected"
            :onValueChange="onValueChange"
          >
            <item label="VENDIDO POR UNIDADE" value="key0" />
            <item label="VENDIDO POR KILO" value="key1" />
            <item label="VENDIDO POR LITRO" value="key2" />
          </nb-picker>
        </nb-item>

      </nb-form> 

      <nb-button block light iconLeft :style="{ marginTop: 20 }" :onPress="() => saveChanges()" >
        <nb-icon active name="paper" />
        <nb-text>SALVAR</nb-text>
      </nb-button>

    </nb-container>
  
 
</template>

<script>
import React, { Component } from 'react'
import { Picker, Icon } from 'native-base'
import { Alert } from 'react-native'
import Toast from 'react-native-root-toast'
import { required } from 'vuelidate/lib/validators'
import { widthPercentageToDP as wp, 
         heightPercentageToDP as hp} from 'react-native-responsive-screen'

import logo from "../../../assets/logo-final.png"
import tempFotoMeme from "../../../assets/images.png"


export default {
  components: { Toast },
  data() {
    return {
      logo,
      form:{
        id:'',
        name:'',
        description:'',
        price:'',
        img:'',
        organization_id:''
      },
      tempFotoMeme,
      foto_status:false,
      selected: "",
      fotomeme: "",
      spinner:false,
      thumb_1_w:wp('100%'),
      thumb_1_h:hp('50%'),
      thumb_2_w:wp('100%'),
      thumb_2_h:hp('50%')
    }
  },

  created(){
    this.form.id = this.product.id
    this.form.name = this.product.name
    this.form.description = this.product.description
    this.form.price = this.product.price
  },

  validations:{

    form:{
      id:{ required },
      organization_id: { required },
      name:{ required },
      description: { required },
      price:{ required }
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
    isDeliveryman(){
      return this.$store.state.auth.isDeliveryman
    },
    
  },
  
  props: {

    navigation: {
      type: Object
    },
    product:{
      type: Object,
      required:true
    }

  },

  methods: {

    saveChanges(){
      this.$v.form.$touch()
      if (this.$v.form.$invalid){
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
        Alert.alert('ATUALIZAR','DESEJA ATUALIZA ESSE PRODUTO?',
          [
            {text: 'NÃO', onPress: () => null, style: 'cancel'},
            {text: 'SIM', onPress: () => this.updateProduct(this)},
          ]
        )
      }
    },

    updateProduct(context){
      let dataTemp = new FormData()
      context.spinner = true
      context.$store.dispatch('products/updateProduct',context.form).then(() => {
        context.spinner = false  
        this.showSuccess()      
      }).catch(err =>{
        null
      })

    },

    showSuccess(){
      Toast.show('PRODUTO ATUALIZADO COM SUCESSO!', {
          duration: Toast.durations.SHORT,
          position: Toast.positions.CENTER,
          shadow: false,
          backgroundColor: 'blue',
          animation: true,
          hideOnPress: true,
          delay: 0
        })
    },

    onValueChange: function(value) {
      this.selected = value
    },

  },

};

</script>

<style>
.spinner-container{
  margin-top: 100px;
  display: flex;
}
.efe {
  align-items: center;
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