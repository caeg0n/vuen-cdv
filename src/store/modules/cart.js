import Vue from 'vue-native-core'
import axios from 'axios'
import { platform } from 'react-native'
import axiosInstance from '@/services/axios'
import { AsyncStorage } from 'react-native'

export default ({
    namespaced:true,
    state:{
        items:[],
        total:0.0
    },
    getters: {
        getQuantidadeById: (state) => (id) => {
            let product = state.items.find(item => item.id === id)
            if (product){
                return product.quantidade
            }else{
                return 0
            }
        },
        getValorTotalById: (state) => (id) => {
            let product = state.items.find(item => item.id === id)
            if (product){
                return product.quantidade*product.product.price
            }else{
                return 0
            }
        }
    },
    actions:{
        updateCart({commit,state},data){
            let id = data['id']
            let quantidade = data['quantidade']
            let tempState = JSON.parse(JSON.stringify(state.items))
            let product = tempState.find(product => product.id === id)
            if (product != undefined){
                product['quantidade'] = quantidade
                tempState.forEach(p => {
                    if (p.id === id){ p = product }
                })
                commit('addItem',tempState)              
            }else{
                if (state.items.length == 0){
                    commit('addItem',[data])
                }else{
                    tempState.push(data)
                    commit('addItem',tempState)
                }
            }
        },
        deleteFromCart({commit,state},data){
            let item = data["item"]
            let tempState = JSON.parse(JSON.stringify(state.items))
            Vue.lodash.remove(tempState, {
                id: item.id
            })
            commit('addItem',tempState)
        },

        calculaTotal({commit,state}){
            let cart = JSON.parse(JSON.stringify(state.items))
            let total = 0.0
            cart.forEach(e => {
                total = total + e.product.price * e.quantidade
            })
            commit('setTotal',total)
        },
        resetCart({commit,state}){
          commit('addItem',[])
          commit('setTotal',0.0)           
        }
    },
    mutations:{
        addItem(state,newState){
            Vue.set(state,'items',newState)
        },
        setProduct(state,product){
            Vue.set(state,'product',product)
        },
        setTotal(state,newTotal){
            Vue.set(state,'total',newTotal)
        }
    }
})
