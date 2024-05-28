<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps({
  small: {
    type: Boolean,
    default: true,
  },
  total: {
    required: true,
    type: Number,
  },
  page: {
    type: Number,
    default: 1,
  },
  limit: {
    type: Number,
    default: 10,
  },
  pageSizes: {
    default: [10, 20, 30, 50],
  },
  // 移动端页码按钮的数量端默认值5
  pagerCount: {
    type: Number,
    default: document.body.clientWidth < 992 ? 5 : 7,
  },
  layout: {
    type: String,
    default: 'total, sizes, prev, pager, next, jumper',
  },
  background: {
    type: Boolean,
    default: true,
  },
  hidden: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['update:page', 'update:limit', 'pagination'])
const currentPage = computed({
  get() {
    return props.page
  },
  set(val) {
    emit('update:page', val)
  },
})
const page_size = computed({
  get() {
    return props.limit
  },
  set(val) {
    emit('update:limit', val)
  },
})
function handleSizeChange(val: number) {
  if (currentPage.value * val > props.total) {
    currentPage.value = 1
  }
  emit('pagination', { page: currentPage.value, limit: val })
}
function handleCurrentChange(val: number) {
  emit('pagination', { page: val, limit: page_size.value })
}
</script>

<template>
  <div :class="{ hidden }" class="px-16px py-32px">
    <el-pagination
      v-model:current-page="currentPage"
      v-model:page-size="page_size"
      :small="small"
      :background="background"
      :layout="layout"
      :page-sizes="pageSizes"
      :pager-count="pagerCount"
      :total="total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
  </div>
</template>
