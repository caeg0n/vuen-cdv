<template>
    <nb-footer>
      <nb-footer-tab>
        <nb-button :active="tab1" :onPress="toggleTab1">
          <nb-icon name="beer" :active="tab1" />
          <nb-text>Produtos</nb-text>
        </nb-button>

        <nb-button :active="tab2" :onPress="toggleTab2">
          <nb-icon name="cart" :active="tab2" />
          <nb-text>Carrinho</nb-text>
        </nb-button>

        <nb-button :active="tab3" :onPress="toggleTab3">
          <nb-icon name="paper" :active="tab3" />
          <nb-text>Pedidos</nb-text>
        </nb-button>
        <!-- <nb-button :active="tab4" :onPress="toggleTab4">
          <nb-icon name="contact" :active="tab4" />
          <nb-text>Chat</nb-text>
        </nb-button> -->
      </nb-footer-tab>
    </nb-footer>
</template>

<script>
export default {
  props: {
    navigation: {
      type: Object
    },
    refresh: {
      type: Function
    }
  },
  data() {
    return {
      tab1: true,
      tab2: false,
      tab3: false,
      tab4: false
    }
  },
  methods: {
    toggleTab1() {
      this.navigation.navigate('Buy')
    },
    toggleTab2() {
      this.navigation.navigate('Cart',{onGoBack: this.refresh})
    },
    toggleTab3() {
      this.navigation.navigate('ClientOrder')
    },
    toggleTab4() {
    }
  }
};
</script>

<style>
</style>