<template>
  <nb-card>
    <nb-card-item button>
      <nb-left>
        <image-modal :style="{imageBackgroundColor:'#000', width: 90, height: 90, borderRadius: 30/2}" :source="{uri: sourceImg}"
        />
        <nb-body>
          <nb-text class="y">{{product.name}}</nb-text>
          <nb-text note class="x">{{product.description}}</nb-text>
        </nb-body>
      </nb-left>
      <nb-right>
        <nb-text :style="{fontWeight: 'bold'}">R${{parseFloat(product.price) | dinheiro}}</nb-text>
      </nb-right>
    </nb-card-item> 
    <product-detail :product="product"/>
  </nb-card>
</template>
<script>
  import ImageModal from 'react-native-image-modal'
  import ProductDetail from '@/components/ProductDetail'
  

  export default {
    data: function() {
      return {
        sourceImg:this.getImg(),
        stylesObj: {
          cardItemImage: {
            resizeMode: "cover",
            width:'100%'
          }
        }
      }
    },
    props:{
      product:{
        type: Object,
        required: true
      }
    },
    components:{
      ImageModal,ProductDetail
    },

    beforeMount() {
    },

    methods:{
      getImg(){
        return this.product.img
      }
  
    }
  };


</script>
<style>
.x{
  display: flex;
  width: 200%;
}
.y{
  display: flex;
  width: 200%;
}
  .card-item-image {
    flex: 1;
    height: 200;
  }
</style>