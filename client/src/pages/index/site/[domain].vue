<script setup lang="ts">
import { request } from '../../../utils/request';

const props = defineProps({
  domain: String,
})

request('/stats/list',{params:{domain:props.domain}})
</script>

<template>
  <div class="flex">
    domain: {{ props.domain }}
  </div>
</template>
