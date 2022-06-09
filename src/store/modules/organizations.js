import Vue from 'vue-native-core'
import axios from 'axios'
import { platform } from 'react-native'
import axiosInstance from '@/services/axios'

export default ({
  namespaced:true,
  state:{
    items:[],
  },
  actions:{
  
    async fetchOrganizations({commit,state}){
      await axios.get(`${BASE_URL}/organizations`).then(res => {
        const organizations = res.data
        commit('setItems',{items:organizations,resource:'organizations'},{root:true})
      })
    },


    async closeOrganization({commit,state},data){
      return await axios.get(`${BASE_URL}/organizations/close/`+data)
      .then(res => {
        return res.data
      })
    },


    async openOrganization({commit,state},data){
      return await axios.get(`${BASE_URL}/organizations/open/`+data)
      .then(res => {
        return res.data
      })
    },
  
  },

  mutations:{
  }

})