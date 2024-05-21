<script setup lang="ts">
import { markRaw, reactive } from 'vue'
import {
  DataLine,
  Document,
  HomeFilled,
  Menu as IconMenu,
  Setting,
} from '@element-plus/icons-vue'

const states = reactive({
  isCollapse: false,
  menu: [
    {
      index: '1',
      icon: markRaw(HomeFilled),
      title: '首页',
    },
    {
      index: '2',
      icon: markRaw(DataLine),
      title: '数据管理',
      sub: [
        {
          index: '2-1',
          title: '基础数据',
        },
        {
          index: '2-2',
          title: '图标呈现',
        },
      ],
    },
    {
      index: '3',
      icon: markRaw(IconMenu),
      title: 'Navigator Two',
    },
    {
      index: '4',
      icon: markRaw(Document),
      title: 'Navigator Three',
    },
    {
      index: '5',
      icon: markRaw(Setting),
      title: 'Navigator Four',
    },
  ],
})

function handleOpen(key: string, keyPath: string[]) {
  console.log(key, keyPath)
}
function handleClose(key: string, keyPath: string[]) {
  console.log(key, keyPath)
}
</script>

<template>
  <el-aside width="200px" class="bg-gray-100">
    <el-menu
      default-active="2"
      class="el-menu-vertical-demo"
      :collapse="states.isCollapse"
      @open="handleOpen"
      @close="handleClose"
    >
      <template v-for="item in states.menu" :key="item.index">
        <!-- if  有子菜单 -->
        <template v-if="item.sub">
          <el-sub-menu :index="item.index">
            <template #title>
              <el-icon>
                <component :is="item.icon" />
              </el-icon>
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
            <el-icon>
              <component :is="item.icon" />
            </el-icon>
            <template #title>
              {{ item.title }}
            </template>
          </el-menu-item>
        </template>
      </template>
    </el-menu>
  </el-aside>
</template>
