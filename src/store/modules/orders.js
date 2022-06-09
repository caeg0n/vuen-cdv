import Vue from 'vue-native-core'
import axios from 'axios'
import { platform } from 'react-native'
import axiosInstance from '@/services/axios'
import { AsyncStorage } from 'react-native'
import Base64 from 'Base64'


const generateReference = (state) => {
    let payload = { 'device_id': state['session'],
                    'data':state['data'],
                    'valor':state['total'] }

    const encoded = Base64.btoa(JSON.stringify(payload))
    // decode
    //const decoded = Base64.atob(encoded)
    return encoded
}

const tranformPayment = (value) => {
    if (value == "CC") return 0
    if (value == "CD") return 1
    if (value == "D") return 2
    if (value == "AC") return 3
}

const buildRequest = (state,product) => {
    let device_id = state['session']
    let reference = generateReference(state)
    let product_id = product['id']
    let address = state['address'].address
    let payment = tranformPayment(state['payment'])
    let total = product['product'].price * product['quantidade']
    let amount = product['quantidade']
    let consumer_name = state['address'].name
    let salesman_state = 0
    let delivery_state = 0
    return {
        "order":{
            "device_id": device_id,
            "reference": reference,
            "product_id": product_id,
            "address": address,
            "payment": payment,
            "total": total,
            "amount": amount,
            "consumer_name": consumer_name,
            "salesman_state": salesman_state,
            "delivery_state": delivery_state
        }
    }
}

const rollback = (state) => {

}

export default ({
    namespaced:true,
    state:{
        orders:[],
        products:[],
        address:{},
        payment:'',
        session:'',
        total:0.0,
        data:'',
        status:false,
        erro:false,
        numberOfOrders:0
    },
    actions:{

        fetchNumberOfOrders({commit,state},device_id){
            return axios.get(`${BASE_URL}/get_orders_lenght`,{params:{device_id:device_id}}).then(res => {
                 let ordersLength = res.data
                 return ordersLength
            })
        },

        fetchOrders({commit,state},device_id) {
            return axios.get(`${BASE_URL}/orders`,{params:{device_id:device_id}}).then(res=>{
                const orders = res.data
                commit('setOrders',orders)
                return state.orders
            })
        },

        setOrder({commit,state},data){
            commit('setProducts',data["cart"])
            commit('setAddress',data["address"])
            commit('setPayment',data["payment"])
            commit('setTotal',data["total"])
            commit('setSession',data["session"])
            commit('setData',data["data"])
        },

        async newOrder({commit,state}){
            let ok = ""
            let status = 0
            let promises = []
            let gatilho = false
            state['products'].forEach(function (e) {
                let data = buildRequest(state,e)
                promises.push(axios.post(`${BASE_URL}/orders`,data))
            })
            await Promise.all(promises).then(function (results) {
                results.forEach(function (response) {
                    ok = response.data
                    status = response.status
                    if ( ok != 'ok' || status != 201 ){
                        gatilho = true
                    }
                })
            }).then(success=>{
                if (gatilho === true){
                    rollback(state)
                    commit('setStatus',true)
                    commit('setErro',true)
                }else{
                    //tudo certo aqui
                    commit('setStatus',true)
                    commit('setErro',false)
                } 
            }).catch(error=>{
                rollback(state)
                commit('setStatus',true)
                commit('setErro',true)
            })
        },

        resetOrder({commit,state}){
            commit('setProducts',[])
            commit('setAddress',{})
            commit('setPayment','')
            commit('setTotal',0.0)
            commit('setSession','')
            commit('setData','')
            commit('setStatus',false)
            commit('setDStatus',false)
            commit('setErro',false)
        },

        resetStatus({commit,state},data){
            commit('setStatus',data)
        }
    },
    mutations:{
        setTotal(state,data){
            Vue.set(state,'total',data)
        },
        setPayment(state,data){
            Vue.set(state,'payment',data)
        },
        setAddress(state,data){
            Vue.set(state,'address',data)
        },
        setProducts(state,data){
            Vue.set(state,'products',data)
        },
        setSession(state,data){
            Vue.set(state,'session',data)
        },
        setData(state,data){
            Vue.set(state,'data',data)
        },
        setStatus(state,data){
            Vue.set(state,'status',data)
        },
        setDStatus(state,data){
            Vue.set(state,'dstatus',data)
        },
        setErro(state,data){
            Vue.set(state,'erro',data)
        },
        setOrders(state,data){
            Vue.set(state,'orders',data)
        },
    }
})
