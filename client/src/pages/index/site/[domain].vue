<script setup lang="ts">
import { onMounted, reactive } from 'vue'
import { Back, Delete, Search } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { request } from '../../../utils/request'
import pagination from '../../../components/pagination.vue'
import { router } from '../../../router'

const props = defineProps({
  domain: String,
})
const domain = props.domain

interface IStates {
  select: string[]
  visible: boolean
  delete_all: string
  search: {
    loading: boolean
  }
}

interface Stats {
  id: string
  total_visitors: number
  total_visits: number
  create_time: string
  update_time: string
}

interface IQueryParams {
  keyword: string
  total: number
  page_num: number
  page_size: number
}

interface IList {
  id: string
  total_visitors: number
  total_visits: number
}

interface ITable {
  query_params: IQueryParams
  list: IList[]
}

const states = reactive<IStates>({
  select: [],
  visible: false,
  delete_all: '',
  search: {
    loading: true,
  },
})

const table = reactive<ITable>({
  query_params: {
    keyword: '',
    total: 0,
    page_num: 1,
    page_size: 10,
  },
  list: [],
})

async function get_list() {
  const keyword = table.query_params.keyword
  const page_num = table.query_params.page_num
  const page_size = table.query_params.page_size

  const params = {
    keyword,
    page_num,
    page_size,
    domain,
  }
  await request('/stats/list', { params })
    .then((data: { list: Stats[], total: number }) => {
      table.query_params.total = data.total
      const list = data.list.map(item => ({
        id: item.id,
        total_visitors: item.total_visitors,
        total_visits: item.total_visits,
      }))
      table.list.length = 0
      table.list.push(...list)
    })
  states.search.loading = false
}

async function on_search() {
  states.search.loading = true
  await get_list()
}

async function remove(ids: string[], all: boolean = false) {
  ElMessageBox.confirm(
    '确定要删除吗？',
    '提示',
  )
    .then(async () => {
      try {
        await request('/stats/remove', { method: 'POST', params: { all, domain, ids } })
        ElMessage({
          type: 'success',
          message: '删除成功',
        })
        await get_list()
      }
      catch (error) {
        console.error('删除全部失败：', error)
      }
      finally {
        states.visible = false
      }
    })
    .catch(() => {
      ElMessage({
        type: 'info',
        message: '取消删除',
      })
    })
}

async function on_remove(id: string) {
  await remove([id])
}

async function on_remove_select() {
  await remove(states.select)
}

async function on_remove_all() {
  try {
    await remove([], true)
    await get_list()
  }
  catch (error) {
    console.error('删除全部失败：', error)
  }
  finally {
    states.visible = false
  }
}

function on_select(list: IList[]) {
  const ids = list.map(i => i.id)
  states.select.length = 0
  states.select.push(...ids)
}

function on_back() {
  router.back()
}

onMounted(() => {
  get_list()
})
</script>

<template>
  <div class="w-full h-full flex flex-col">
    <div class="mb-20px flex flex-justify-between">
      <div class="flex">
        <el-button class="ml-10px " type="danger" :icon="Delete" @click="() => states.visible = true">
          删除所有
        </el-button>
        <el-button class="ml-10px " type="danger" :disabled="!states.select.length" :icon="Delete" @click="on_remove_select">
          删除选中
        </el-button>
        <el-button class="ml-10px " :icon="Back" type="primary" plain @click="on_back">
          返回
        </el-button>
      </div>
      <div class="flex">
        <el-input
          v-model="table.query_params.keyword"
          style="width: 240px"
          placeholder="请输入唯一标识"
          :prefix-icon="Search"
        />
        <el-button class="ml-10px " type="primary" :icon="Search" @click="on_search">
          搜索
        </el-button>
      </div>
    </div>
    <div class="flex-1">
      <el-table
        v-loading="states.search.loading"
        border
        :data="table.list"
        style="width: 100%" :header-cell-style="{ background: '#f5f7fa' }"
        @selection-change="on_select"
      >
        <el-table-column fixed type="selection" width="60" align="center" />
        <el-table-column prop="id" label="唯一标识" align="center" />
        <el-table-column prop="total_visitors" label="访客量" align="center" />
        <el-table-column prop="total_visits" label="访问量" align="center" />
        <el-table-column label="操作" align="center">
          <template #default="scope">
            <div class="flex flex-items-center flex-justify-center">
              <el-button type="danger" :icon="Delete" circle @click="on_remove(scope.row.id)" />
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- 分页 -->
    <div class="">
      <pagination
        v-model:page="table.query_params.page_num"
        v-model:limit="table.query_params.page_size"
        :hide-on-single-page="table.query_params.total > 0"
        class="flex flex-justify-end flex-items-center"
        :total="table.query_params.total" @pagination="get_list"
      />
    </div>
  </div>

  <el-dialog v-model="states.visible" title="确定要删除所有统计吗？" center>
    <div class="">
      如果你绝对真多要删除所有统计，请输入域名
      <div class="inline px-10px py-2px border-rd-6px font-bold text-#e81403 bg-[rgba(232,20,3,.1)]" v-text="domain" />
    </div>
    <div class="mt-10px flex flex-justify-center">
      <el-input
        v-model="states.delete_all"
        placeholder="请输入域名"
      />
    </div>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="states.visible = false">
          取消
        </el-button>
        <el-button type="primary" :disabled="states.delete_all !== domain" @click="on_remove_all">
          确定
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>
