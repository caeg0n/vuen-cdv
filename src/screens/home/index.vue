<template>
    <nb-container>
        <status-bar :barStyle="'light-content'"></status-bar>
        <image-background :source="launchScreenBg" class="imageContainer">
            <view class="logoContainer" :style="stylesObj.logoContainerStyle">
                <image-background
                    :source="launchscreenLogo"
                    class="logo"
                    :style="stylesObj.logoStyle"
                />
            </view>
            <view class="text-container">
                <nb-h3 :style="{ marginTop: 10,fontSize:20  }" class="text-color-white">Agilidade e Comodidade</nb-h3>
                <nb-h3 :style="{ marginTop: 5,fontSize:20 }" class="text-color-white">para Suas Entregas</nb-h3>
                <!-- <nb-h3 class="text-color-white">Nos Seus Pedidos</nb-h3> -->
            </view>
            <!-- <view :style="{ marginBottom: 15 }">
                <nb-button :style="stylesObj.btnContainer" rounded large primary block :onPress="goToBuy">
                    <nb-text>SOU CLIENTE</nb-text>
                </nb-button>
            </view>
 -->
            <view :style="{ marginBottom: 10 }">
                <nb-button :style="stylesObj.btnContainer" rounded block :onPress="goToAdmin">
                    <nb-text>ENTRAR</nb-text>
                </nb-button>
            </view>

            <!-- <view :style="{ marginBottom: 10 }">
                <nb-button :style="stylesObj.btnContainer" rounded block :onPress="goToAdmin">
                    <nb-text>SOU ENTREGADOR</nb-text>
                </nb-button>
            </view> -->
        </image-background>
    </nb-container>
</template>

<script>
import { Dimensions, Platform } from "react-native"
import launchScreenBg from "../../../assets/ls-bg.png"
import launchscreenLogo from "../../../assets/logo-1.png"
import { BackHandler } from "react-native"
import ControlComputedMixins from "@/mixins/controlComputedMixins"
import Constants from 'expo-constants'
//import { Notifications } from 'expo'
import * as Notifications from 'expo-notifications'

export default {
    mixins: [ControlComputedMixins],
    props: {
        navigation: {
            type: Object
        }
    },
    data() {
        return {
            launchScreenBg,
            launchscreenLogo,
            stylesObj: {
                logoContainerStyle: {
                    marginTop: Dimensions.get("window").height / 8
                },
                logoStyle: {
                    left: Platform.OS === "android" ? 0 : 0,
                    top: Platform.OS === "android" ? 0 : 0
                },
                btnContainer: {
                    fontWeight :'bold',
                    marginLeft: 10,
                    marginRight: 10,
                    backgroundColor: "blue",
                    alignSelf: "center"
                }
            },
            btn:''
        }
    },

    async created(){
        let token = null
        if (Constants.isDevice){
            token = await Notifications.getExpoPushTokenAsync()
            this.$store.dispatch('session/addExpoNotificationToken',token)
            await this.$store.dispatch('session/saveToken')       
        }
    },

    methods: {

        goToBuy() {
            this.navigation.navigate('Buy')
        },
        goToAdmin() {
            this.navigation.navigate('Login')
        },        

    }
};
</script>

<style>
.imageContainer {
  flex: 1;
}
.text-color-primary {
  color: blue;
  font-family: Roboto;
}
.logoContainer {
  flex: 1;
  margin-bottom: 0;
}
.logo {
  position: absolute;
  width: 100%;
  height: 100%;
}
.text-container {
  align-items: center;
  margin-bottom: 50;
  background-color: transparent;
}
.text-color-white {
  color: white;
}
.button-container {
  background-color: #6faf98;
  align-self: center;
}
</style>