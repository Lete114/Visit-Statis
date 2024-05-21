<script setup lang="ts">
import { useRouter } from 'vue-router'
import { onMounted, reactive } from 'vue'
import { ElMessage } from 'element-plus'
import { setToken } from '../utils/token'
import { request } from '../utils/request'
import { is_mail } from '../utils/public'

const router = useRouter()

const captcha_length = 4

const states = reactive({
  disabled: true,
  mail: '',
  password: '',
  captcha: {
    text: '',
    loading: true,
    img: '',
  },
})

function on_to_register() {
  router.push('/register')
}

async function get_captcha() {
  try {
    states.captcha.loading = true
    const { svg } = await request('/captcha')
    const blob = new Blob([svg], { type: 'image/svg+xml' })
    const url = URL.createObjectURL(blob)
    // 提升用户体验
    setTimeout(() => {
      states.captcha.img = url
    }, 1000)
  }
  catch (error) {
    const message = '获取验证码失败'
    console.error(`${message}：`, error)
    ElMessage({ type: 'warning', message })
  }
  finally {
    // 提升用户体验
    setTimeout(() => {
      states.captcha.loading = false
    }, 1000)
  }
}

function on_change_captcha() {
  get_captcha()
}

function on_input() {
  if (is_mail(states.mail) && states.password.length >= 8 && states.captcha.text.length === captcha_length) {
    states.disabled = false

    return
  }
  states.disabled = true
}

function reset() {
  states.mail = ''
  states.password = ''
  states.captcha.text = ''
}

async function on_login() {
  try {
    states.disabled = true
    const data = await request('/login', {
      method: 'POST',
      params: {
        mail: states.mail,
        password: states.password,
        captcha: states.captcha.text,
      },
    })
    data.token && setToken(data.token)
    ElMessage({ type: 'success', message: '登录成功，欢迎您的使用 :)' })
    router.push({ path: '/' })
  }
  catch (error) {
    const msg = '登录失败'
    console.error(`${msg}:`, error)
    ElMessage({ type: 'error', message: msg })
  }
  finally {
    states.disabled = false
    reset()
  }
}
onMounted(() => {
  get_captcha()
})
</script>

<template>
  <div class="select-none flex flex-justify-center flex-items-center text-#fff">
    <div class="w-600px h-400px overflow-hidden border-rd-10px shadow-[10px_10px_10px_8px_rgba(0,0,0,0.09)] flex flex-justify-center flex-items-center">
      <div class="w-full h-full bg-#fff py-40px px-30px flex flex-col flex-items-center flex-justify-center">
        <div class="text-28px text-#000 font-bold">
          登录
        </div>
        <div class="w-full text-14px my-20px">
          <input v-model="states.mail" type="email" placeholder="电子邮件" class="mb-20px" @keyup.enter="on_login" @input="on_input">
          <input v-model="states.password" type="password" placeholder="密码" class="mb-20px" @keyup.enter="on_login" @input="on_input">

          <!-- 移动端优化：focus 时将 type 改成 text，主要是为了弹出安全键盘（方便输入字母和数字） -->
          <div class="flex">
            <input
              v-model="states.captcha.text"
              type="password"
              placeholder="验证码"
              class="mr-6px"
              :maxlength="captcha_length"
              @keyup.enter="on_login"
              @focus="(e: any) => e.target.type = 'text'"
              @input="on_input"
            >
            <div class="w-102px h-40px">
              <div v-loading="states.captcha.loading" class="w-102px h-40px border-1px border-solid border-#dcdfe6 rd-6px overflow-hidden">
                <img
                  v-show="states.captcha.img"
                  :src="states.captcha.img" title="看不清？换一张验证码！" alt="验证码" class="w-100px h-full rd-6px cursor-pointer"
                  @click="on_change_captcha()"
                >
              </div>
            </div>
          </div>
        </div>

        <div class="cursor-pointer text-#000">
          忘记密码？
        </div>
        <div
          :class="{ 'cursor-not-allowed': states.disabled }"
          class="mt-20px px-60px py-10px cursor-pointer bg-#01b6d3 font-bold border-rd-24px"
          @click="on_login"
        >
          登录
        </div>
      </div>
      <div class="register w-full h-full py-40px px-30px flex flex-col flex-items-center flex-justify-center">
        <div class="text-28px font-bold">
          没有账号？
        </div>
        <div class="my-20px text-12px">
          立即注册加入我们，和我们一起开始统计吧
        </div>
        <div
          class="px-60px py-10px cursor-pointer bg-transparent font-bold border-rd-24px border-1px border-solid border-#fff"
          @click="on_to_register"
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

.register {
  background: linear-gradient(to right, #295bd7, #580ac1);
}
</style>
