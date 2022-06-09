import Vue from 'vue-native-core'
import axios from 'axios'
import { platform } from 'react-native'
import axiosInstance from '@/services/axios'
import { AsyncStorage } from 'react-native'
import Base64 from 'Base64'


const tranformDeliveryState = (value) => {
    if (value == "waiting") return 0
    if (value == "accepted_to_salesman") return 1
    if (value == "accepted_to_camp") return 2
    if (value == "camp_inprogress") return 3
    if (value == "camp_in_route") return 4
    if (value == "camp_fail") return 5
    if (value == "camp_canceled") return 6
    if (value == "camp_finished") return 7
    if (value == "salesman_inprogress") return 8
    if (value == "salesman_fail") return 9
    if (value == "salesman_caceled") return 10
    if (value == "salesman_finished") return 11
}

const tranformSaleState = (value) => {
    if (value == "waiting") return 0
    if (value == "processing") return 1    
    if (value == "inprogress") return 2  
    if (value == "delivering") return 3
    if (value == "fail") return 4
    if (value == "canceled") return 5
    if (value == "finished") return 6

}

const rollback = (state) => {

}

export default ({
    namespaced:true,
    state:{
        orders:[],
        deliveryStates:{},
        salesStates:{}
    },
    actions:{

        resetThis({commit,state}){
            commit('reset',null)
        },

        fetchSalesStates({commit,state}){
            let result = {}
            for (let reference in state.orders) {
                let orders = state.orders[reference]
                for(let order in orders){
                    result[orders[order].id] = orders[order].salesman_state
                }
            }
            commit('setSalesStates',{})
            commit('setSalesStates',result)
        },

        fetchDeliveryStates({commit,state}){
            let result = {}
            for (let reference in state.orders) {
                let orders = state.orders[reference]
                for(let order in orders){
                    result[orders[order].id] = orders[order].delivery_state
                }
            }
            commit('setDeliveryStates',{})
            commit('setDeliveryStates',result)
        },

        fetchOrders({commit,state,dispatch},auth) {
            let organization_id = auth["organization"].id
            return axios.get(`${BASE_URL}/orders`,{params:{organization_id:organization_id}}).then(res=>{
                const orders = res.data
                commit('setOrders',[])
                commit('setOrders',orders)
                dispatch('fetchSalesStates')
                dispatch('fetchDeliveryStates')
                return state.orders
            })
        },

        fetchOrders2({commit,state},context) {
            let orders = context.$store.state.orders.orders
            commit('setOrders',orders)
            return orders
        },


        fetchNumberOfOrders({commit,state},auth){
            let organization_id = auth["organization"]["id"]
            return axios.get(`${BASE_URL}/get_orders_lenght_for_deliveryman`,{params:{organization_id:organization_id}}).then(res => {
                let ordersLength = res.data
                return ordersLength
            })
        },

        fetchNumberOfOrdersBySalesman({commit,state},auth){
            let organization_id = auth["organization"]["id"]
            return axios.get(`${BASE_URL}/get_orders_lenght_for_salesman`,{params:{organization_id:organization_id}}).then(res => {
                let ordersLength = res.data
                return ordersLength
            })
        },

        async updateOrderDeliveryState({commit,state},data){
            let organization_id = data["organization"]
            let reference = data['reference']
            let delivery_state = tranformDeliveryState(data["data"])
            await axios.put(`${BASE_URL}/update_delivery_state/`,{order:{delivery_state,organization_id,reference}}).then(response => {
            }).catch(error => {
                return null
            })
        },

        async updateOrderDeliverymanState({commit,state},data){
            let orders = data[0]["orders"]
            let status = data[1]["state"]
            let promises = []
            let falha = false
            orders.forEach(function (e) {
                let params = {order:e["id"],data:status}
                promises.push(axios.put(`${BASE_URL}/update_deliveryman_state`,params))
            })
            await Promise.all(promises).then(function (results) {
                results.forEach(function (response) {
                    let ok = response.data
                    let resp_status = response.status
                    if ( ok != 'ok' || resp_status != 200 ){
                        falha = true
                    }
                })
            }).then(()=>{
                if (falha === true){
                    return false
                }else{
                    return true
                } 
            }).catch(error=>{
                return error
            })
        },

        async updateOrderSaleState({commit,state},data){
            let organization_id = data["organization"]
            let reference = data['reference']
            let sale_state = tranformSaleState(data["data"])
            await axios.put(`${BASE_URL}/update_sale_state`,{order:{sale_state,organization_id,reference}}).then(response => {
            }).catch(error => {
                 return null
            })
        },

    },
    mutations:{
        setOrders(state,data){
            Vue.set(state,'orders',data)
        },
        setDeliveryStates(state,data){
            Vue.set(state,'deliveryStates',data)
        },
        setSalesStates(state,data){
            Vue.set(state,'salesStates',data)
        },

        reset(state){
            Vue.set(state,'orders',[])
            Vue.set(state,'deliveryStates',{})
            Vue.set(state,'salesStates',{})
        }
    }
})
