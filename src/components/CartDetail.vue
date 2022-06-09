<template>
    <nb-list-item>
        <nb-left>
            <image-modal :style="{width: 45, height: 45, borderRadius: 30/2}"
                        :source="{uri: productImg(item.id)}"
            />
            <nb-text :style="{paddingLeft:15,fontSize:20,color:'#000'}">{{item.quantidade | unidades}}</nb-text>
        
            <nb-body>
                <nb-text class="x">{{item["product"].name}}</nb-text>
                <nb-text :numberOfLines="1" note class="y">{{item["product"].description}}</nb-text>
                <nb-text note :style="{paddingRight:10}">R${{parseFloat(item["product"].price) | dinheiro}}
                </nb-text>
                <nb-text :style="{paddingRight:10,fontWeight: 'bold',color:'#000'}">R${{parseFloat(item["product"].price)*item.quantidade | dinheiro}}
                </nb-text>
            </nb-body>

        </nb-left>
        <nb-right>
            <nb-list-item icon>
                <nb-left>
                    <nb-button :style="{ backgroundColor: '#FD3C2D' }" :onPress="() => deleteFromCart(item)">
                        <nb-icon active name="trash" />
                    </nb-button>
                </nb-left>
            </nb-list-item>
        </nb-right>
    </nb-list-item>
</template>

<script>
import ImageModal from 'react-native-image-modal'
import { Toast } from 'native-base'
import { Text, Alert, TouchableOpacity } from 'react-native'

export default {
    data() {
        return {
            stylesObj: {
                btnContainer: {
                    backgroundColor: "#6faf98",
                    alignSelf: "center"
                }
            },
        }
    },
    components:{
        ImageModal
    },
    props: {
        navigation: {
            type: Object
        },
        item:{
            type: Object,
            required: true
        },
        productImg:{
            type: Function,
            required: true
        }
    },
    computed: {
        cart(){
            return this.$store.state.cart.items
        },
    },
    methods:{
        deleteFromCart(item) {
            Alert.alert('REMOVER DO CARRINHO','DESEJA REMOVER O PRODUTO DO CARRINHO?',
            [
                {text: 'NÃO', onPress: () => console.warn('NO Pressed'), style: 'cancel'},
                {text: 'SIM', onPress: () => this.updateCart(item)}
            ])
        },

        updateCart(item){
            this.$store.dispatch('cart/deleteFromCart',{item})
            this.$store.dispatch('cart/calculaTotal')
        }
    }
};
</script>


<style>
.x{
    display: flex;
    width: 100%;
}
.y{
    display: flex;
    width: 100%;
}
.card-item-image {
    flex: 1;
    height: 200;
}
</style>