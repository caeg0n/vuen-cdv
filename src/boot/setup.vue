<template>
    <view class="container">
        <app-loading v-if="!isAppReady"> </app-loading>
        <app v-if="isAppReady"></app>
    </view>
</template>

<script>
import App from "../"
import Vue from "vue-native-core"
import Vuelidate from 'vuelidate'
import store from '../store'
import { VueNativeBase } from "native-base"
import VueLodash from 'vue-lodash'
import lodash from 'lodash'
import moment from 'moment'
import InputWithError from '@/components/InputWithError'
import { BackHandler } from 'react-native'

import Constants from 'expo-constants'
import AppLoading from 'expo-app-loading'
import * as Font from "expo-font"
import * as Notifications from "expo-notifications";
import * as Device from 'expo-device';

import { YellowBox } from 'react-native'

//import * as Permissions from 'expo-permissions'
//import { AppLoading } from "expo"
//import { Notifications } from 'expo'

Vue.use(VueNativeBase)
Vue.use(Vuelidate)
Vue.use(VueLodash, { name: 'custom' , lodash: lodash })
Vue.component('InputWithError',InputWithError)

Vue.use({
    install: function(Vue, options){
        Vue.prototype.$jQuery = require('jquery')
    }
})

Vue.filter('uppercase',function(value){
    if (!value) return ''
    return value.toUpperCase()
})
Vue.filter('formatDate',function(value,formatType='LT'){
    if (!value) return ''
    return moment(value).format(formatType)
})
Vue.filter('fromNow',function(value){
    if (!value) return ''
    return moment(value).fromNow()
})
Vue.filter('dinheiro',function(value){
    if (!value) return ''
    return (value).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')
})
Vue.filter('unidades',function(value){
    if (!value) return ''
        if (value < 10){
            return "0"+value        
        }
    return value
})
Vue.filter('pagamento',function(value){
    if (!value) return ''
        if (value == 'CC'){
            return 'Cartão de Crédito'        
        }
        if (value == 'CD'){
            return 'Cartão de Débito'
        }
        if (value == 'D'){
            return 'Dinheiro'
        }
        if (value == 'AC'){
            return 'Anatar na Conta'
        }
    return null
})
Vue.filter('nome_e_sobrenome',function(value){
    if (!value) return ''
    return (value).split(' ').slice(0, -1).join(' ')
})

Vue.filter('primeiro_nome',function(value){
    if (!value) return ''
    return value.split(' ').slice(0,1).join(' ')
})

Vue.filter('nome_dos_vendedores',function(value){
    let val = JSON.stringify(value)
    let resp = ''
    if (!value){
        return ''
    }else{
        resp = val.replace('[','').replace(']','')
        for (var j=0;j<100;j++){
            resp = Vue._.replace(resp, '"', '')
        }
    }
    return resp
})


//EVIROMENT SETUP
if (__DEV__) {
    //alert('Development')
    YellowBox.ignoreWarnings(['Remote debugger'])
    console.disableYellowBox = true
    console.clear()
    if (Platform.OS === 'android') {
        BASE_URL = 'http://192.168.7.12:3000/'
        WS_URL = 'ws://192.168.7.12:3000/cable'
    }else{
        BASE_URL = 'http://192.168.7.12:3000/'
        WS_URL = 'ws://192.168.7.12:3000/cable'
    }
} else {
    //alert('Production')
    if (Platform.OS === 'android') {
        BASE_URL = 'https://camp-entregas.herokuapp.com/'
        WS_URL = 'wss://camp-entregas.herokuapp.com/cable'
    }else{
        BASE_URL = 'https://camp-entregas.herokuapp.com/'
        WS_URL = 'wss://camp-entregas.herokuapp.com/cable'
    }
}

BASE_URL = 'https://camp-entregas.herokuapp.com/'
WS_URL = 'wss://camp-entregas.herokuapp.com/cable'


Vue.prototype.$store = store

Vue.prototype.$goBack = function(func){
    BackHandler.addEventListener('hardwareBackPress',func)
}

export default {
    components: { App, AppLoading },
    //components: { App },
    data() {
        return {
            isAppReady: false
        }
    },

    async created() {
        let token,uuid;
        if (Device.isDevice) {
            const { status: existingStatus } = await Notifications.getPermissionsAsync();
            let finalStatus = existingStatus;
            if (existingStatus !== 'granted') {
                const { status } = await Notifications.requestPermissionsAsync();
                finalStatus = status;
            }
            if (finalStatus !== 'granted') {
                alert('Failed to get push token for push notification!');
            }
            uuid = Constants.installationId
            this.$store.dispatch('session/addExpoId',uuid)
            //token = (await Notifications.getExpoPushTokenAsync()).data;
            this.$store.dispatch('session/addExpoNotificationToken',(await Notifications.getExpoPushTokenAsync()).data)
            await this.$store.dispatch('session/saveToken')      
        }else{
            alert('Must use physical device for Push Notifications');
        }
        if (Platform.OS === 'android') {
            Notifications.setNotificationChannelAsync('default', {
                name: 'default',
                importance: Notifications.AndroidImportance.MAX,
                vibrationPattern: [0, 250, 250, 250],
                lightColor: '#FF231F7C',
            });
        }
        await this.loadFonts()
    },

    methods: {
       
        async loadFonts() {
            try {
                this.isAppReady = false
                await Font.loadAsync({
                    Roboto: require("../../node_modules/native-base/Fonts/Roboto.ttf"),
                    Roboto_medium: require("../../node_modules/native-base/Fonts/Roboto_medium.ttf"),
                    Ionicons: require("../../node_modules/@expo/vector-icons/build/vendor/react-native-vector-icons/Fonts/Ionicons.ttf")
                })
                this.isAppReady = true
            } catch (error) {
                console.log("some error occured", error)
                this.isAppReady = true
            }
        },
    }
};
</script>

<style>
.container {
    flex: 1;
}
</style>
