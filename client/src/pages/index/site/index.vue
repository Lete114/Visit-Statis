<script setup lang="ts">
import { CircleCheck, CircleClose, Plus, Search } from '@element-plus/icons-vue'
import { onMounted, reactive } from 'vue'
import { request } from '../../../utils/request'
import { router } from '../../../router'

interface ISite {
  domain: string
  valid: boolean
}

const states = reactive({
  search: {
    text: '',
    loading: true,
  },
})

const sites_raw: ISite[] = []

const sites = reactive([...sites_raw])

let search_timer: number
function onSearch() {
  clearTimeout(search_timer)

  function delay_exec(cb: () => void) {
    search_timer = setTimeout(() => {
      cb()
      states.search.loading = false
    }, 300)
  }

  states.search.loading = true
  if (!states.search.text) {
    delay_exec(() => {
      sites.splice(0, sites.length, ...sites_raw)
    })
    return
  }

  const searchLowerCase = states.search.text.toLowerCase()
  const filteredSites = sites_raw.filter(site => site.domain.includes(searchLowerCase))

  delay_exec(() => {
    sites.splice(0, sites.length, ...filteredSites)
  })
}

function highlight_text(text: string, query: string) {
  const index = text.toLowerCase().indexOf(query.toLowerCase())
  if (index !== -1) {
    const highlighted = `<span class="text-red">${text.substring(index, index + query.length)}</span>`
    return text.substring(0, index) + highlighted + text.substring(index + query.length)
  }
  return text
}

function getValid(valid: boolean) {
  return valid ? '有效' : '无效'
}

function onDomain(domain: string) {
  router.push({ path: `/site/${domain}` })
}

async function get_list() {
  try {
    const { list } = await request('/site/list')

    list.forEach((item: any) => {
      sites_raw.push({ domain: item.domain, valid: item.valid })
    })
    sites.splice(0, sites.length, ...sites_raw)
    states.search.loading = false
  }
  catch (error) {
    console.error('获取网站列表失败')
    console.error('获取网站列表失败', error)
  }
}

onMounted(() => {
  get_list()
})
</script>

<template>
  <div class="flex flex-col">
    <div class="flex flex-justify-between">
      <el-input
        v-model="states.search.text"
        style="width: 240px"
        placeholder="搜索"
        :prefix-icon="Search"
        @input="onSearch"
      />
      <el-button type="primary" :icon="Plus">
        添加站点
      </el-button>
    </div>
    <div v-loading="states.search.loading" class="mt-20px grid grid-cols-2 grid-rows-2 gap-10px">
      <div
        v-for="site in sites" :key="site.domain"
        class="p-10px cursor-pointer border-rd-6px border-1px border-solid border-#999 flex flex-col"
        @click="onDomain(site.domain)"
      >
        <div class="" v-html="highlight_text(site.domain, states.search.text)" />
        <div class="flex flex-items-center">
          <el-icon class="mr-6px w-20px! h-20px!">
            <CircleCheck v-if="site.valid" class="w-20px! h-20px! text-#2db35e" />
            <CircleClose v-else class="w-20px! h-20px! text-#e81403" />
          </el-icon>
          <div class="" v-text="getValid(site.valid)" />
        </div>
      </div>
    </div>
  </div>
</template>
