<template>
    <div class="welBox">
        <img src="../assets/zhengzhouHospital.svg" alt="" />
    </div>
</template>
  
<script lang="ts" setup>
import { ref, reactive } from 'vue'
</script>
  
<style lang="less" scoped>
.welBox {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;

    img {
        width: 80%;
    }
}
</style>
  