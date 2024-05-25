<script setup lang="ts">
import { router } from '../router'
import { setPermission } from '../utils/permission';
import { setToken } from '../utils/token'
import github from './svg/github.vue'
import user from './svg/user.vue'

function on_exit() {
  setToken('')
  setPermission('')
  router.push({ path: '/login' })
}
</script>

<template>
  <el-header class="bg-#fff border-b-1px border-b-solid border-b-#dcdfe6 flex flex-justify-center">
    <div class="flex-1 flex flex-items-center flex-justify-start">
      <!--  -->
    </div>
    <div class="flex-1 flex flex-items-center flex-justify-end">
      <a href="https://github.com/Lete114/Visit-Stat" target="_blank" class="w-32px h-32px text-#000 flex flex-justify-center flex-items-center"><github /></a>
      <el-dropdown trigger="click" class="w-32px h-32px  flex flex-justify-center flex-items-center">
        <user class="text-#000" />
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item @click="on_exit">
              退出
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </el-header>
</template>
