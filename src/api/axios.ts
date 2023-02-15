import axios, { AxiosResponse, AxiosRequestConfig } from 'axios'
import { ResultEnum } from "@/enums/httpEnum"
import { PageEnum, ErrorPageNameMap } from "@/enums/pageEnum"
import { StorageEnum } from '@/enums/storageEnum'
import { axiosPre } from '@/settings/httpSetting'
import { SystemStoreEnum, SystemStoreUserInfoEnum } from '@/store/modules/systemStore/systemStore.d'
import { redirectErrorPage, getLocalStorage, routerTurnByName, httpErrorHandle } from '@/utils'
import { fetchAllowList } from './axios.config'
import includes from 'lodash/includes'
import { qiankunWindow } from 'vite-plugin-qiankun/dist/helper'
import { baseUrl, baseUrlNoPort } from '@/env'

const axiosInstance = axios.create({
  baseURL: `${import.meta.env.PROD ? import.meta.env.VITE_DEV_PATH : baseUrl}${axiosPre}`,
  timeout: ResultEnum.TIMEOUT,
})

axiosInstance.interceptors.request.use(
  (config: AxiosRequestConfig) => {
    // 白名单校验
    if (includes(fetchAllowList, config.url)) return config
    // 获取 token
    const info = getLocalStorage(StorageEnum.GO_SYSTEM_STORE)
    // 重新登录
    if (!info) {
      routerTurnByName(PageEnum.BASE_LOGIN_NAME)
      return config
    }
    const userInfo = info[SystemStoreEnum.USER_INFO]
    // 防止 token 冲突
    if (!config.headers?.station) {
      config.headers = {
        ...config.headers,
        [userInfo[SystemStoreUserInfoEnum.TOKEN_NAME] || 'token']: userInfo[SystemStoreUserInfoEnum.USER_TOKEN] || ''
      }
    } else {

      // 如果在微前端环境下，获取父应用的存储信息到当前上下文， 使用真实的id替换掉测试id
      if (qiankunWindow.__POWERED_BY_QIANKUN__) {
        const local_env = window.localStorage.getItem("go-view-env")
        const { dept_id, year_id, station } = local_env ? JSON.parse(local_env) : { dept_id: '', year_id: '', station: '' }
        Object.keys(config.params).map((key) => {
          if (key == "dept_id") config.params[key] = dept_id
          if (key == "year_id") config.params[key] = year_id
        })
        config.headers.station = station
      }

      config.baseURL = baseUrlNoPort + "/"
      // "http://127.0.0.1/"
    }
    return config
  },
  (err: AxiosRequestConfig) => {
    Promise.reject(err)
  }
)

// 响应拦截器
axiosInstance.interceptors.response.use(
  (res: AxiosResponse) => {
    const { code } = res.data as { code: number }
    // 成功
    if (code === ResultEnum.SUCCESS) {
      return Promise.resolve(res.data)
    }

    // 登录过期
    if (code === ResultEnum.TOKEN_OVERDUE) {
      window['$message'].error(window['$t']('http.token_overdue_message'))
      routerTurnByName(PageEnum.BASE_LOGIN_NAME)
      return Promise.resolve(res.data)
    }

    // 固定错误码重定向
    if (ErrorPageNameMap.get(code)) {
      redirectErrorPage(code)
      return Promise.resolve(res.data)
    }

    if (code == 0) {
      return Promise.resolve(res.data)
    }
    // 提示错误
    window['$message'].error(window['$t']((res.data as any).msg))
    return Promise.resolve(res.data)
  },
  (err: AxiosResponse) => {
    Promise.reject(err)
  }
)

export default axiosInstance
