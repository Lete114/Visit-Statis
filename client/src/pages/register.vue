<script setup lang="ts">
import { useRouter } from 'vue-router'
import { computed, reactive } from 'vue'
import workerTick from 'worker-tick'
import { ElMessage } from 'element-plus'
import { setToken } from '../utils/token'
import { is_mail } from '../utils/public'
import { request } from '../utils/request'

const router = useRouter()

let timer = ''

const states = reactive({
  disabled: true,
  mail: '',
  code: '',
  password: '',
  captcha: {
    disabled: true,
    text: '获取验证码',
    s: 60,
  },
})

const captcha = computed(() => {
  if (states.captcha.s === 0 || states.captcha.s === 60) {
    if (timer) {
      workerTick.clearInterval(timer)
    }
    init_captcha()
    return states.captcha.text
  }
  return `剩余 ${states.captcha.s} 秒`
})

function on_input() {
  if (is_mail(states.mail) && states.code.length === 6 && states.password.length >= 8) {
    states.disabled = false
    return
  }
  states.disabled = true
}

function init_captcha() {
  timer = ''
  states.captcha.disabled = true
  states.captcha.text = '获取验证码'
  states.captcha.s = 60
  states.captcha.disabled = !is_mail(states.mail)
}

function on_to_login() {
  router.push('/login')
}

function reset() {
  states.mail = ''
  states.code = ''
  states.password = ''
  states.captcha.s = 60
}

async function get_captcha() {
  if (states.captcha.disabled) {
    return
  }
  states.captcha.disabled = true

  states.captcha.s--
  timer = workerTick.setInterval(() => {
    states.captcha.s--
  }, 1000)

  request('/send_mail', {
    method: 'POST',
    params: { mail: states.mail },
  }).catch((error) => {
    // 恢复获取验证码按钮
    states.captcha.s = 60

    const msg = '获取验证码失败'
    console.error(`${msg}:`, error)
    ElMessage({ type: 'error', message: msg })
  })
}

async function on_register() {
  try {
    const data = await request('/register', {
      method: 'POST',
      params: {
        mail: states.mail,
        code: states.code,
        password: states.password,
      },
    })
    data.token && setToken(data.token)
    ElMessage({ type: 'success', message: '注册成功，欢迎您的加入 :)' })
    router.push({ path: '/' })
  }
  catch (error) {
    const msg = '注册失败'
    console.error(`${msg}:`, error)
    ElMessage({ type: 'error', message: msg })
  }
  finally {
    reset()
  }
}
</script>

<template>
  <div class="select-none flex flex-justify-center flex-items-center text-#fff">
    <div class="w-600px h-400px overflow-hidden border-rd-10px shadow-[10px_10px_10px_8px_rgba(0,0,0,0.09)] flex flex-justify-center flex-items-center">
      <div class="logn w-full h-full py-40px px-30px flex flex-col flex-items-center flex-justify-center">
        <div class="text-28px font-bold">
          已有账号？
        </div>
        <div class="my-20px text-12px">
          请使用您的账号进行登录
        </div>
        <div
          class="px-60px py-10px cursor-pointer bg-transparent font-bold border-rd-24px border-1px border-solid border-#fff"
          @click="on_to_login"
        >
          登录
        </div>
      </div>
      <!--  -->
      <div class="w-full h-full bg-#fff py-40px px-30px flex flex-col flex-items-center flex-justify-center">
        <div class="text-28px text-#000 font-bold">
          注册
        </div>
        <div class="w-full text-14px my-20px">
          <input v-model="states.mail" type="email" placeholder="电子邮件" class="mb-20px" @input="on_input">
          <div class="flex mb-20px p-10px border-1px border-solid border-[#ccc] border-rd-5px bg-[#eeeeee] text-[#333]">
            <input v-model="states.code" oninput="this.value = this.value.replace(/[^0-9]/g, '')" maxlength="6" placeholder="验证码" class="" style="all:unset" @input="on_input">
            <div
              class="w-full text-14px flex flex-justify-center flex-items-center"
              :class="states.captcha.disabled ? 'cursor-not-allowed' : 'cursor-pointer'"
              @click="get_captcha"
              v-text="captcha"
            />
          </div>
          <input v-model="states.password" type="password" placeholder="密码" class="mb-20px" @input="on_input">
        </div>
        <div
          class="px-60px py-10px cursor-pointer bg-#01b6d3 font-bold border-rd-24px"
          :class="{ 'cursor-not-allowed': states.disabled }"
          @click="on_register"
        >
          注册
        </div>
      </div>
    </div>
  </div>
</template>

<style>
input {
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  background-color: #eeeeee;
  color: #333; /* 输入框文字颜色 */
  font-size: 16px;
  outline: none;
}

input::placeholder {
  color: #a1a1a1; /* 占位符文字颜色 */
}

.logn {
  background: linear-gradient(to right, #14afc8, #385cce);
}
</style>
