import Vue from 'vue-native-core'
import axios from 'axios'
import { platform } from 'react-native'
import axiosInstance from '@/services/axios'
import { AsyncStorage } from 'react-native'

// if (Platform.OS === 'android') {
//     BASE_URL = 'http://192.168.16.106:3000/'
// }else{
//     BASE_URL = 'http://192.168.16.106:3000/'
// }

export default ({
    namespaced:true,
    state:{
        item:""
    },
    getters: {
    },
    actions:{
        setPayment({commit,state},data){
            commit('setItem',data)
        },
        resetPayment({commit,state}){
            commit('setItem',"")    
        }
    },
    mutations:{
        setItem(state,data){
            Vue.set(state,'item',data)
        }
    }
})
