<template>
  <div class="appBox">

    <router-view></router-view>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive } from 'vue'

</script>

<style lang="less" >

.appBox {
  width: 100%;
  height: 100vh;
  // background-color: #7d3c3c;
}
</style>