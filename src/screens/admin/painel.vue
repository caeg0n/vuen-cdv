<template>
    <nb-container :style="{ backgroundColor: '#fff' }" v-if="getOrganization">
      <nb-header>
        <nb-thumbnail :style="{flex:1}" :source="logo"/>
      </nb-header>
    <nb-header>
      <nb-left>
        <nb-button transparent :onPress="() => this.props.navigation.navigate('Home')">
          <nb-icon name="arrow-back" />
        </nb-button>
      </nb-left>
      <nb-body>
        <nb-title :style="{textAlign:'center',width:200}">ADMINISTRAÇÃO</nb-title>
      </nb-body>
      <nb-right />
    </nb-header>

    <nb-content padder class="content-wrapper">

      <view class="view-wrapper-2" v-if="isSalesman">
        <nb-button :onPress="()=>changeOpenStatus()" :dark="!status" rounded block :style="{ marginBottom: 20 }">
          <nb-text :style="{ fontSize: 18 }" v-if="status">ABERTO</nb-text>
          <nb-text :style="{ fontSize: 18 }" v-if="!status">FECHADO</nb-text >
        </nb-button>
      </view>
      
      <view v-if="isSalesman" class="view-wrapper-2">
        <nb-button iconLeft success large block :style="{ marginBottom: 20 }" :onPress="goToPedidos">
          <nb-icon active name="paper" />
          <nb-text>PEDIDOS</nb-text>
          <!-- <nb-badge info class="mb-10">
            <nb-text>2 novos</nb-text>
          </nb-badge> -->
        </nb-button>
      </view>

      <view class="view-wrapper-2" v-if="isSalesman">
        <nb-button iconLeft large block :style="{ marginBottom: 20 }" :onPress="goToAddProduto">
          <nb-icon active name="camera" />
          <nb-text>ADICIONAR PRODUTO</nb-text>
        </nb-button>
      </view>
      <view class="view-wrapper-2" v-if="isSalesman">
        <nb-button :onPress="goToEditProduct" info iconLeft large block :style="{ marginBottom: 20 }">
          <nb-icon active name="bookmarks" />
          <nb-text>ALTERAR PRODUTO</nb-text>
        </nb-button>
      </view>
      <view class="view-wrapper-2" v-if="isSalesman">
        <nb-button :onPress="goToExcludAndPauseProduct" danger iconLeft large block :style="{ marginBottom: 20 }">
          <nb-icon active name="trash" />
          <nb-text :style="{ fontSize: 18 }">EXCLUIR/PAUSAR PRODUTO</nb-text>
        </nb-button>
      </view>

      <view class="view-wrapper-2">
        <nb-button :onPress="updateToken" dark iconLeft large block :style="{ marginBottom: 20 }">
          <nb-icon active name="cog" />
          <nb-text>CONFIGURAR NOTIFICAÇÕES</nb-text>
        </nb-button>
      </view>
      
      <view class="view-wrapper-2">
        <nb-button iconLeft disabled large block :style="{ marginBottom: 20 }">
          <nb-icon active name="paper" />
          <nb-text>RELATORIO</nb-text>
        </nb-button>
      </view>
    </nb-content>
  </nb-container>
</template>

<script>
import logo from "../../../assets/logo-final.png"
import ControlComputedMixins from "@/mixins/controlComputedMixins"

export default {
  mixins: [ControlComputedMixins],
  components:{
  },
  data() {
    return {
      logo
    }
  },

  async created() {
    await this.$store.dispatch('products/fetchProductsById',this.organization.id)
  },
  
  props: {
    navigation: {
      type: Object
    }
  },
  computed: {

    status(){
      return this.$store.state.auth.organization.open
    },

    organization(){
      return this.$store.state.auth.organization
    },

    isSalesman(){
      return this.$store.state.auth.isSalesman
    },

  },
  
  methods:{

    openStatus(){
      let organizations = this.allOrganizations
      let organization = organizations.find(x => x.id === this.organization.id)
      return organization.open
    },

    async changeOpenStatus(){
      if (this.openStatus()){
        await this.$store.dispatch('organizations/closeOrganization',this.organization.id)  
      }else{
        await this.$store.dispatch('organizations/openOrganization',this.organization.id)
      }
      await this.$store.dispatch('auth/fetchOrganization',this.organization.id)
      await this.$store.dispatch('organizations/fetchOrganizations')
      await this.$store.dispatch('auth/fetchSalesmanList')
    },

    updateToken(){
      this.$store.dispatch('session/updateOrganizationToken',this.organization.id)
    },

    goToExcludAndPauseProduct(){
      this.navigation.navigate('ExcludeProduct')
    },
    
    goToEditProduct(){
      this.navigation.navigate('EditProduct')
    },

    goToAddProduto(){
      this.navigation.navigate('AddProduto')
    },
    goToPedidos(){
      this.navigation.navigate('Requests')
    },
    goToDeliveries(){
      this.navigation.navigate('Deliveries')
    },
    getOrganization(){
      return this.organization
    }
  }
};
</script>