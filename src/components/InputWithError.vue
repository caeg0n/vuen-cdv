<template>
  <view>
    <nb-item >
       <slot/>
    </nb-item>
    <nb-text v-if="error" :style="{marginLeft:15,color:'red'}">{{msg}}</nb-text>
  </view>
</template>
<script>
  //import {required} from 'vuelidate/lib/validators'
  export default{
    props:['error','msg'],
  };
</script>

<style>
</style>