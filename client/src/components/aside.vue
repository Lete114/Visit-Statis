<script setup lang="ts">
import { reactive } from 'vue'
import { getPermission } from '../utils/permission'

const permissions = getPermission()

interface IMenu {
  index: string
  title: string
  sub?: IMenu[]
}

interface IStates {
  isCollapse: boolean
  menu: IMenu[]
}

const states = reactive<IStates>({
  isCollapse: false,
  menu: [],
})

states.menu.push({
  index: '/',
  title: '首页',
})

permissions?.forEach((permission) => {
  states.menu.push({
    index: permission.url,
    title: permission.name,
  })
})
</script>

<template>
  <el-aside width="200px" class="">
    <el-menu
      default-active="2"
      class="h-full"
      :collapse="states.isCollapse"
      router
    >
      <template v-for="item in states.menu" :key="item.index">
        <!-- if  有子菜单 -->
        <template v-if="item.sub">
          <el-sub-menu :index="item.index">
            <template #title>
              <!-- <el-icon>
                <component :is="item.icon" />
              </el-icon> -->
              <span v-text="item.title" />
            </template>
            <!-- for -->
            <template v-for="sub in item.sub" :key="sub.index">
              <el-menu-item :index="sub.index">
                {{ sub.title }}
              </el-menu-item>
            </template>
          </el-sub-menu>
        </template>
        <!-- else 没有子菜单 -->
        <template v-else>
          <el-menu-item :index="item.index">
            <!-- <el-icon>
              <component :is="item.icon" />
            </el-icon> -->
            <template #title>
              {{ item.title }}
            </template>
          </el-menu-item>
        </template>
      </template>
    </el-menu>
  </el-aside>
</template>
