import Vue from 'vue-native-core'
import axios from 'axios'
import { platform } from 'react-native'
import axiosInstance from '@/services/axios'
import { AsyncStorage } from 'react-native'

export default ({
    namespaced:true,
    state:{
        items:[],
        current_item:{}
    },
    getters: {
        
    },

    actions:{

        async fetchAddresses({commit,state}){
            return await axios.get(`${BASE_URL}/addresses`).then(res => {
                const addresses = res.data
                commit('setItems',{items:addresses,resource:'addresses'},{root:true})
                return state.items
            })
        },

        async getAddressesLength({commit,state},device_id){
            return await axios.get(`${BASE_URL}/addresses`,{params:{device_id:device_id,
                                                                    get_length:true}}).then(res => {
                const addressesLength = res.data
                return addressesLength
            })
        },

        async fetchAddressesById({commit,state},device_id){
            return await axios.get(`${BASE_URL}/addresses`,{params:{device_id:device_id}}).then(res => {
                const addresses = res.data
                commit('setItems',{items:addresses,resource:'addresses'},{root:true})
                return state.items
            })
        },

        async newAddress({commit,state},data){
            return await axios.post(`${BASE_URL}/addresses`,data).then(res => {
                return "ok"
            })
        },

        setCurrentAddress({commit,state},data){
            commit('setAddressItem',data)
        },

        resetCurrentAddress({commit,state}){
          commit('setAddressItem',{})  
        }
    },

    mutations:{
        
        setAddressItem(state,address){
            Vue.set(state,'current_item',address)
        },
    }
})
