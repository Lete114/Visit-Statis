<script setup lang="ts">
</script>

<template>
  <div class="w-full h-full">
    <el-container class="w-full h-full flex-justify-center">
      <router-view />
    </el-container>
  </div>
</template>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html,
body,
#app {
  height: 100%;
  width: 100%;
}
</style>
