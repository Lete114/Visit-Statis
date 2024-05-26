<script setup lang="ts">
import { CircleCheck, CircleClose, Plus, Search } from '@element-plus/icons-vue'
import { computed, onMounted, reactive } from 'vue'
import { request } from '../../../utils/request'
import { router } from '../../../router'
import { is_url } from '../../../utils/public'
import { session_getAll, session_remove, session_set } from '../../../utils/storage'

interface ISite {
  id: string
  domain: string
  valid?: boolean
  create_time?: string
}

const states = reactive({
  search: {
    text: '',
    loading: true,
  },
})

const sites_raw: ISite[] = []

const sites = reactive([...sites_raw])
const add = reactive({
  visible: false,
  loading: false,
  site: '',
  uuid: '',
  steps: {
    active: 1,
    list: [
      {
        step: 1,
        title: '添加网站',
        desc: '',
      },
      {
        step: 2,
        title: '添加HTML标签验证',
        desc: '',
      },
    ],
  },
})

function to_sort_site() {
  const site_valid = sites.filter(site => site.valid)
  const site_no_valid = sites.filter(site => !site.valid)
  function to_sort(sites: (typeof site_valid)) {
    sites.sort((a, b) => {
      if (a.create_time && b.create_time) {
        return new Date(a.create_time).getTime() - new Date(b.create_time).getTime()
      }
      return 0 // 如果没有 create_time，则不进行排序
    })
  }
  to_sort(site_valid)
  to_sort(site_no_valid)

  sites.splice(0, sites.length, ...site_valid, ...site_no_valid)
}

function get_session_site() {
  for (const [key, value] of Object.entries(session_getAll())) {
    if (is_url(key)) {
      const obj = JSON.parse(value) as never as { id: string, domain: string, create_time: string }
      sites_raw.push({
        ...obj,
        valid: false,
      })
    }
  }
}

let search_timer: number
function on_search() {
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
    const highlighted = `<span class="text-#e81403">${text.substring(index, index + query.length)}</span>`
    return text.substring(0, index) + highlighted + text.substring(index + query.length)
  }
  return text
}

function get_valid(valid: boolean | undefined) {
  return valid ? '有效' : '无效'
}

function on_domain(domain: string) {
  const site = sites.find(site => site.domain === domain)
  if (!site) {
    return
  }
  if (site.valid) {
    router.push({ path: `/site/${domain}` })
  }
  else {
    add.steps.active = 2
    add.visible = true
    add.uuid = site.id
    add.site = `https://${domain}`
  }
}

async function get_list() {
  try {
    const { list } = await request('/site/list')
    sites_raw.length = 0
    get_session_site()

    list.forEach((item: any) => {
      sites_raw.push({ id: item.id, domain: item.domain, valid: item.valid, create_time: item.create_time })
    })
    sites.splice(0, sites.length, ...sites_raw)
    states.search.loading = false
    to_sort_site()
  }
  catch (error) {
    console.error('获取网站列表失败')
    console.error('获取网站列表失败', error)
  }
}

const is_site = computed(() => !is_url(add.site))

function on_dialog_closed() {
  add.steps.active = 1
  add.site = ''
}

async function on_add_site() {
  try {
    add.loading = true
    const { uuid } = await request('/site/add', {
      method: 'POST',
      params: { url: add.site },
    })
    add.uuid = uuid
    add.steps.active = 2
    const { host } = new URL(add.site)
    const value = {
      id: uuid,
      domain: host,
      create_time: `${Date.now()}`,
    }
    sites.push({
      ...value,
      valid: false,
    })
    session_set(add.site, JSON.stringify(value))
    to_sort_site()
  }
  catch (error) {
    console.error('onAddSite error', error)
  }
  finally {
    add.loading = false
  }
}

async function on_verify() {
  try {
    await request('/site/verify', {
      method: 'POST',
      params: {
        url: add.site,
      },
    })
    session_remove(add.site)
    add.steps.active = 1
    add.site = ''
    await get_list()
  }
  catch (error) {
    console.error('onVerify error', error)
  }
  finally {
    add.visible = false
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
        @input="on_search"
      />
      <el-button type="primary" :icon="Plus" @click="() => add.visible = true">
        添加站点
      </el-button>
    </div>
    <div v-loading="states.search.loading" class="mt-20px grid grid-cols-2 grid-rows-2 gap-10px">
      <div
        v-for="site in sites" :key="site.domain"
        class="p-10px cursor-pointer border-rd-6px border-1px border-solid border-#999 flex flex-col"
        @click="on_domain(site.domain)"
      >
        <div class="" v-html="highlight_text(site.domain, states.search.text)" />
        <div class="flex flex-items-center">
          <el-icon class="mr-6px w-20px! h-20px!">
            <CircleCheck v-if="site.valid" class="w-20px! h-20px! text-#2db35e" />
            <CircleClose v-else class="w-20px! h-20px! text-#e81403" />
          </el-icon>
          <div class="" v-text="get_valid(site.valid)" />
        </div>
      </div>
    </div>
  </div>

  <el-dialog
    v-model="add.visible"
    title="添加站点"
    center
    align-center
    @closed="on_dialog_closed"
  >
    <div class="w-full h-full flex flex-col flex-justify-center flex-items-center">
      <el-steps class="w-full" :active="add.steps.active" align-center>
        <el-step v-for="step in add.steps.list" :key="step.title" :title="step.title" :description="step.desc" />
      </el-steps>
      <div class="w-full h-full text-12px p-20px px-40px! flex">
        <div v-show="add.steps.active === 1" class="w-full h-full flex flex-col">
          <div class="w-full flex flex-col">
            <label>请输入网站地址</label>
            <el-input
              v-model="add.site"
              class="w-full mt-10px"
              placeholder="http(s)://"
            />
          </div>

          <div class="mt-40px flex flex-justify-center">
            <el-button :loading="add.loading" type="primary" :disabled="is_site" @click="on_add_site">
              添加
            </el-button>
          </div>
        </div>
        <div v-show="add.steps.active === 2" class="w-full h-full flex flex-col">
          <p class="my-10px">
            将以下代码添加到您的网站首页HTML代码的&lt;head&gt;标签与&lt;/head&gt;标签之间，完成操作后请点击“验证”按钮。
          </p>
          <p class="my-10px">
            &lt;meta name="visit-stat-site-verify" content="{{ add.uuid }}" /&gt;
          </p>

          <p class="my-10px">
            示例如下
          </p>
          <div class="w-full h-full bg-#f5f5f5 overflow-auto">
            <pre class="p-10px ">
&lt;html&gt;
  &lt;head&gt;
    &lt;meta name="visit-stat-site-verify" content="{{ add.uuid }}" /&gt;
    &lt;title&gt;My title&lt;/title&gt;
  &lt;/head&gt;
  &lt;body&gt;
    page contents
  &lt;/body&gt;
&lt;/html&gt;</pre>
          </div>
          <p class="my-10px text-#e81403">
            验证完成后可删除
          </p>
          <div class="mt-40px flex flex-justify-center">
            <el-button @click="() => add.steps.active = 1">
              上一步
            </el-button>
            <el-button type="primary" @click="on_verify">
              完成验证
            </el-button>
          </div>
          <div v-show="add.steps.active === 3" class="flex flex-col">
            <!--  -->
          </div>
        </div>
      </div>
    </div>
  </el-dialog>
</template>
