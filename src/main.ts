import { createApp } from 'vue'
import App from './App.vue'
import router, { setupRouter } from '@/router'
import i18n from '@/i18n/index'
import { setupStore } from '@/store'
import { renderWithQiankun, qiankunWindow } from 'vite-plugin-qiankun/dist/helper';
import { setupNaive, setupDirectives, setupCustomComponents } from '@/plugins'
import { GoAppProvider } from '@/components/GoAppProvider/index'
import { getLocalStorage, setHtmlTheme, setLocalStorage } from '@/utils'
// 引入全局样式
import '@/styles/pages/index.scss'
// 引入动画
import 'animate.css/animate.min.css'
// 引入标尺
import 'vue3-sketch-ruler/lib/style.css'
import { Json } from '@vicons/carbon'

let app: any = null

async function appInit(props: any) {
  const goAppProvider = createApp(GoAppProvider)

  app = createApp(App)

  // 注册全局常用的 naive-ui 组件
  setupNaive(app)

  // 注册全局自定义指令
  setupDirectives(app)

  // 注册全局自定义组件
  setupCustomComponents(app)

  // 挂载状态管理
  setupStore(app)

  // 解决路由守卫，Axios中可使用，Dialog，Message 等全局组件
  goAppProvider.mount('#appProvider', true)

  // 挂载路由
  setupRouter(app, props)

  // 路由准备就绪后挂载APP实例
  await router.isReady()

  // Store 准备就绪后处理主题色
  setHtmlTheme()

  // 语言注册
  app.use(i18n)

  // 挂载到页面
  app.mount('#app', true)

  // 挂载到 window
  window['$vue'] = app

  return Promise.resolve();
}

// some code
renderWithQiankun({
  mount(props: any) {
    console.log('mount', props);
    appInit(props);
  },
  bootstrap() {
    console.log('bootstrap');
  },
  update(...status: any) {
    console.log(status, "update - status")
  },
  unmount(props: any) {
    console.log('unmount', props, app);
    // 清理定时器
    const ids = window.localStorage.getItem("go-view-recycle") ? Json.parse(window.localStorage.getItem("go-view-recycle") || "") : []
    console.log('timeout - ycle', ids)
    if (ids) {
      ids.map((id: any) => {
        clearInterval(id)
      })
    }
    app.unmount()
  },
} as any);

if (!qiankunWindow.__POWERED_BY_QIANKUN__) {
  appInit({});
}