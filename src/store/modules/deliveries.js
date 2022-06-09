import Vue from 'vue-native-core'
import axios from 'axios'
import { platform } from 'react-native'
import axiosInstance from '@/services/axios'
// import { AsyncStorage } from 'react-native'
// import Base64 from 'Base64'



const tranformDeliveryState = (value) => {
}

const tranformSaleState = (value) => {
}

const buildRequest = (state,product) => {
}

const rollback = (state) => {

}

export default ({
    namespaced:true,
    state:{
        items:[],
    },
    actions:{

        async quit({commit,state},data) {
            let delivery_id = data[0].id
            return await axios.delete(`${BASE_URL}/deliveries/`+delivery_id).then(res=>{
                const resp = res.data
                return resp
            })
        },


        fetchDeliveries({commit,state},deliveryman_id) {
            return axios.get(`${BASE_URL}/deliveries`,{params:{param:deliveryman_id}}).then(res=>{
                const deliveries = res.data
                commit('setItems',deliveries)
                return state.items
            })
        },

        async fetchNumberOfDeliveries({commit,state},auth){
            let deliveryman_id = auth["organization"]["id"]
            return await axios.get(`${BASE_URL}/get_deliveries_lenght`,{params:{deliveryman_id:deliveryman_id}}).then(res => {
                 let deliveriesLength = res.data
                 return deliveriesLength
            })
        },


        async createDelivery({commit,state},data){
            let origin_id = 0
            let deliveryman_id = 0
            let result = {}
            let results =[]
            let orders = data[0]["orders"]
            for (let key in orders){
                 let order = orders[key]
                 result["order"] = order["id"]
                 results[key] = result["order"]
            }
            orders = results.toString()
            origin_id = data[0]["orders"][0]["organization_id"]
            deliveryman_id = data[1]["auth"]["organization"]["id"]
            return await axios.post(`${BASE_URL}/deliveries`,{"delivery":{orders,origin_id,deliveryman_id}}).then(
                res => {
                    return res
                }
            )
        },


    },
    mutations:{
        setItems(state,data){
            Vue.set(state,'items',data)
        },
    }
})
