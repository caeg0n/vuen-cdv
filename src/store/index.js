import Vue from 'vue-native-core'
import Vuex from 'vuex'

Vue.use(Vuex)

import products from './modules/products'
import cart from './modules/cart'
import session from './modules/session'
import addresses from './modules/addresses'
import payment from './modules/payment'
import orders from './modules/orders'
import auth from './modules/auth'
import requests from './modules/requests'
import deliveries from './modules/deliveries'
import organizations from './modules/organizations'


export default new Vuex.Store({
  modules:{
    products,cart,session,
    addresses,payment,orders,
    auth,requests,deliveries,
    organizations
  },
  state:{
  },
  getters:{
  },
  actions:{
  },
  mutations:{
    setItems (state,{items,resource}){
      Vue.set(state[resource],'items',items)
    }
  }
})
