<script setup lang="ts">
import Aside from '../components/aside.vue'
import Header from '../components/header.vue'
import Main from '../components/main.vue'
</script>

<template>
  <Aside />
  <el-container class="flex-col!">
    <Header />
    <Main />
  </el-container>
</template>
