import axios, {AxiosResponse} from 'axios'
import { config } from '@/utils/config'
import { useUserStore } from '@/store/modules/user'
import router from '@/router'

const request = axios.create({
  baseURL: config.baseURL,
  timeout: 10000,
  headers: { 'Access-Control-Allow-Origin': '*' }
})
//清求列表（防重复龌交）
const requestList: Array<string> = []
// 请求的请求拦截器
request.interceptors.request.use(
  function (config) {
    const store = useUserStore()
    if (store.token) {
      // 接受JSON数据格式
      config.headers['Content-Type'] = 'application/json;charset=utf-8'
      // 设置请求头
      config.headers.Authorization = store.token
    }
    // 在 axios 中配置 防止重复提交
    const requestFlag: string =
      JSON.stringify(config.url) + JSON.stringify(config.data) + '&' + config.method
    if (config.method == 'post') {
      if (requestList.includes(requestFlag)) {
        //清求标记 已经存在，则取消本次清求，否刚在请求列表中加入清求标记
        // 暴力终止
        return Promise.reject(new Error('数据正在处理，请勿重复提交'))
        // return Promise.reject(new Error("数据正在处理，请勿重复提交"))
      } else {
        requestList.push(requestFlag)
      }
    }
    return config
  },
  function (error) {
    return Promise.reject(error)
  }
)
// 请求的响应拦截器
let toastNum = 0
request.interceptors.response.use(
  function (response) {
    //清求返回后，将清求标记从requestList中移際
    const requestFlag = JSON.stringify(response.config.url) + JSON.stringify(response.config.data)
    requestList.splice(requestList.findIndex((item) => item === requestFlag), 1)
    const store = useUserStore()
    switch (response.data.code) {
      case 99: //token 验证过期，或者token验证失败
        if (toastNum === 0) {
          store.$reset()
          router.replace({ path: '/login' })
        }
        toastNum = 1
        setTimeout(() => {
          toastNum = 0
        }, 1000)
        break
      case 404:
        break
      case 500:
        break
      case 15010:
        break
    }
    return response
  },
  function (error) {
    console.log(error)
    if (error.code == 'ERR_NETWORK') {
    }
    if (error.code == 'ECONNABORTED') {
    }
    return Promise.reject(error)
  }
)
export default request

/**
 * 自动拼接
 * @param url
 * @param data
 */
export const getJson = (url: string, data: object) => {
  let str = '?'
  Object.entries(data).forEach((item, index) => {
    str = str + (index == 0 ? '' : '&') + item[0] + '=' + item[1]
  })
  return request.get(url + str)
}

/**
 * 请求体携带翻页参数的 post 请求
 * @param {string} url
 * @param {object} pageData
 * @param {object} data
 */
export const pagePost = (url: string, pageData: object, data: object) => {
  let str = '?'
  Object.entries(pageData).forEach((item, index) => {
    str = str + (index == 0 ? '' : '&') + item[0] + '=' + item[1]
  })
  return request.post(url + str, data)
}


interface requestReturnType {
  data: requestReturnDataType
  status: number,
  statusText: string;
}
interface requestReturnDataType {
  code:number,
  message: string
}
/**
 * 不可重复提交 post
 * @param {string} url
 * @param {object} data
 * @returns {Promise<axios.AxiosResponse<any>> | requestReturnType}
 * @constructor
 */
export const Post = (url:string, data:object):Promise<AxiosResponse<any>> | requestReturnType =>  {
  if(requestList.length > 0 && requestList.includes(JSON.stringify(url) + JSON.stringify(data))) {
    return {
      status:0,
      statusText:'请求正在处理，请不要重复提交',
      data: {
        code:0,
        message:'请求正在处理，请不要重复提交'
      }
    }
  } else {
    requestList.push(JSON.stringify(url) + JSON.stringify(data))
    return request.post(url,data)
  }
}