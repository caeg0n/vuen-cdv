<template>
  <root>
    <nb-header :style="{height:60}">
      <nb-body :style="{alignItems:'center'}">
        <nb-thumbnail :style="{marginLeft:24,flex:1,width:300}" :source="logo"/>
      </nb-body>
    </nb-header>
  <nb-container >
    <nb-header >
      <nb-body :style="{alignItems:'center'}">
        <nb-title>
          ENTRAR
        </nb-title>
      </nb-body>
    </nb-header>
    <nb-content padder>
      <nb-form>

        <nb-item v-bind:success="validationName.item_success_status" 
                 v-bind:error="validationName.item_error_status">
          <nb-input v-model="form.name" :on-blur="validateName" placeholder='USUÁRIO' />
          <nb-icon v-if="validationName.icon_error_status" name="close-circle" />
          <nb-icon v-if="validationName.icon_success_status" name="checkmark-circle" />
        </nb-item>
        <nb-text v-if="validationName.icon_error_status" :style="{marginLeft:15,color:'red'}">Não pode ficar em branco</nb-text>

        <nb-item v-bind:success="validationPass.item_success_status"
                 v-bind:error="validationPass.item_error_status">
          <nb-input v-model="form.pass" :on-blur="validatePass" placeholder='SENHA' secure-text-entry />
          <nb-icon v-if="validationPass.icon_error_status" name="close-circle" />
          <nb-icon v-if="validationPass.icon_success_status" name="checkmark-circle" />
        </nb-item>
        <nb-text v-if="validationName.icon_error_status" :style="{marginLeft:15,color:'red'}">Digite sua senha de 4 digitos</nb-text>

        
        <!--
        <InputWithError :error="$v.form.username.$dirty && !$v.form.username.required"
                        msg="Digite o Nome do Usuário">
          <nb-input v-model="form.username"
                    placeholder="Usuário"
                    :on-blur="() => $v.form.username.$touch()"
                    />
        </InputWithError>
        -->
        <!-- <InputWithError :error="$v.form.senha.$dirty && !$v.form.senha.required"
                        msg="Digite a Senha">
          <nb-input v-model="form.senha"
                    placeholder="Senha"
                    secure-text-entry
                    :on-blur="() => $v.form.senha.$touch()"
                    />
        </InputWithError>
        -->
      </nb-form>

      <view :style="{marginTop:10}">
        <nb-button :on-press="login" block>
          <nb-text>Entrar </nb-text>
        </nb-button>
      </view>
      <!-- <nb-button transparent :on-press="goToRegister" block>
        <nb-text>register </nb-text>
      </nb-button> -->
    </nb-content>
  </nb-container>
  </root>
</template>
<script>
  //import { Alert } from 'react-native'
  //import { AsyncStorage } from 'react-native'
  //import { Root, Container, Content } from 'native-base'
  import {required} from 'vuelidate/lib/validators'
  import { Toast } from 'native-base'
  import { Root } from 'native-base'
  import logo from "../../../assets/logo-final.png"
  export default{
    components:{ Root },
    data(){
      return{
        logo,
        form:{
          name:'',
          pass:''
        },
        validationName:{
          item_success_status:'',
          item_error_status:'',
          icon_error_status:'',
          icon_success_status:''
        },
        validationPass:{
          item_success_status:'',
          item_error_status:'',
          icon_error_status:'',
          icon_success_status:''
        },
      }
    },
    
    validations:{

      form:{
        name: { required },
        pass: { required }
      }

    },

    props:{
      
      navigation:{
        type: Object
      }

    },

    
    computed: {
      
      organization(){
        return this.$store.state.auth.organization
      }

    },

    methods:{
      
      login(){
        this.$v.form.$touch()
        if (this.$v.form.$invalid){
          this.validateName()
          this.validatePass()
        }else{
          this.$store.dispatch('auth/login',this.form).then(()=>{
            this.navigation.navigate('Admin')
          }).catch(err =>{
            Toast.show({
              text: "Usuário ou Senha Errados!",
              buttonText: "Ok",
              type: "danger",
              duration: 1500
            })
          })
        }
        // this.$v.form.$touch()
        // if (!this.$v.form.$invalid){
        //   this.$store.dispatch('auth/login',this.form).then(()=>{
        //     this.navigation.navigate('Admin')
        //   }).catch(err =>{
        //   })
        // }else{
        //   Toast.show({
        //     text: "Usuário ou Senha Errados!",
        //     buttonText: "Ok",
        //     type: "danger",
        //     duration: 1500
        //   })
        // }
      },

      goToRegister(){
        // this.navigation.navigate('Register')
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

      validatePass(){
        var result = undefined
        if (!this.$v.form.pass.required){
          this.validationPass.icon_error_status = true
          this.validationPass.item_error_status = true
          this.validationPass.item_success_status = false
          this.validationPass.icon_success_status = false
          result = true
        }else{
          this.validationPass.icon_error_status = false
          this.validationPass.item_error_status = false
          this.validationPass.item_success_status = true
          this.validationPass.icon_success_status = true
          result = false
        }
        return result
      },

    }
  };
</script>

<style>
</style>
