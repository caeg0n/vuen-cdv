<template>
    <root>
        <app-navigation></app-navigation>
    </root>
</template>

<script>
import {
  createAppContainer,
  createStackNavigator,
  createDrawerNavigator
} from "vue-native-router"
import { Root } from "native-base"
import HomeScreen from "@/screens/home/index.vue"
//import BuyScreen from "@/screens/buy/index.vue"
import AdminScreen from "@/screens/admin/painel.vue"
//import CartScreen from "@/screens/cart/index.vue"
//import OrderScreen from "@/screens/order/index.vue"
import AddProdutoScreen from "@/screens/admin/addProduto.vue"
//import AdressScreen from "@/screens/adress/index.vue"
//import PaymentScreen from "@/screens/payment/index.vue"
//import ResumeScreen from "@/screens/resume/index.vue"
//import ClientOrderScreen from "@/screens/clientOrder/index.vue"
import CameraScreen from "./screens/admin/camera.vue"
import RequestsScreen from "./screens/admin/requests/requests.vue"
import LoginScreen from "./screens/login/index.vue"
import DeliveriesScreen from "./screens/admin/deliveries/deliveries.vue"
import EditProductScreen from "./screens/admin/editProduct.vue"
import ExcludeProductScreen from "./screens/admin/excludeProduct.vue"


const AppNavigation = createAppContainer(
    createStackNavigator(
    {
        Home: {screen: HomeScreen},
        //Buy:  {screen: BuyScreen},
        Admin:  {screen: AdminScreen},
        //Cart: {screen: CartScreen},
        //Order: {screen: OrderScreen},
        AddProduto: {screen: AddProdutoScreen},
        Camara: {screen:CameraScreen},
        //Adress: {screen:AdressScreen},
        //Payment: {screen:PaymentScreen},
        //Resume: {screen:ResumeScreen},
        Requests: {screen:RequestsScreen},
        Login: {screen:LoginScreen},
        Deliveries: {screen:DeliveriesScreen},
        EditProduct: {screen:EditProductScreen},
        ExcludeProduct: {screen:ExcludeProductScreen},
        //ClientOrder:{screen:ClientOrderScreen}
    },
    {
        initialRouteName: "Home",
        headerMode: "none"
    })
)
export default{
    components:{
        AppNavigation, Root
    },    
};
</script>

