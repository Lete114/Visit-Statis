<script setup lang="ts">
const props = defineProps({
  domain: String,
})
</script>

<template>
  <div class="flex">
    domain: {{ props.domain }}
  </div>
</template>
