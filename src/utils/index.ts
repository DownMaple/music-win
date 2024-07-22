import { useUserStore } from '@/store/modules/user'
import router from '@/router'
import { useRouter } from 'vue-router'
import { config } from '@/utils/config.ts'

/**
 * 清除登录信息
 */
export function clearLoginInfo() {
  const store = useUserStore()
  store.$reset()
}

/**
 * 退出登录
 */
export function exitLogin() {
  console.log(useRouter())
  useUserStore().$reset()
  router.push('/login')
}

/**
 * 重置 reactive 对象
 * @param info  对象
 */
export function clearObject(info: any) {
  const keys = Object.keys(info)
  const obj: any = {}
  keys.forEach((item) => {
    switch (typeof info[item]) {
      case 'string':
        obj[item] = ''
        break
      case 'number':
        obj[item] = 0
        break
      case 'boolean':
        obj[item] = true
        break
      case 'object':
        if (Array.isArray(info[item])) {
          obj[item] = []
        } else {
          obj[item] = {}
        }
        break
    }
  })
  Object.assign(info, obj)
}

/**
 * 清除空对象
 * @param info  对象
 */
export function clearObjectEmpty(info: any) {
  const keys = Object.keys(info)
  const obj: any = {}
  keys.forEach((item) => {
    obj[item] = ''
  })
  Object.assign(info, obj)
}

/**
 * 转为树形结构
 * @param data
 */
export function toTreeList(data: Array<any>) {
  const newData: any = []
  const map: any = {}
  if (data?.length !== 0) {
    data.forEach((item) => {
      map[item.id] = item
    })
    data.forEach((item) => {
      const parent = map[item.parentId]
      if (item.parentId === '0') {
        newData.push(item)
      } else {
        (parent.children || (parent.children = [])).push(item)
      }
    })
  }
  return newData
}

/**
 * blob 文件流的方式下载文件
 * @param {string} url    下载文件的路径
 * @param {object} data    下载文件需要的参数
 * @param fileName         文件名称
 */
export async function printTable(data: any, url: string, fileName: string) {
  const xhr = new XMLHttpRequest()
  xhr.open('POST', config.baseURL + url, true)
  xhr.setRequestHeader('Authorization', useUserStore().token)
  xhr.responseType = 'blob'
  xhr.onload = () => {
    const blob = xhr.response
    // const blobUrl = URL.createObjectURL(blob)
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = fileName
    a.style.display = 'none'
    a.click()
  }
  xhr.send(JSON.stringify(data))
}

/**
 * 表格中通过文件流的方式下载文件
 * @param {string} name   需要下载的文件名称
 * @param {string} url    下载文件的路径
 * @param {object} data    下载文件需要的参数
 */
export function tableDownFile(name:string,url:string,data:object = {}) {
  const xhr = new XMLHttpRequest()
  xhr.open('GET', config.baseURL + url, true)
  xhr.setRequestHeader('Authorization', useUserStore().token)
  xhr.responseType = 'blob'
  xhr.onload = () => {
    const blob = xhr.response
    // const blobUrl = URL.createObjectURL(blob)
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = name
    a.style.display = 'none'
    a.click()
  }
  xhr.send(JSON.stringify(data))
}

/**
 * 通过文件流的方式下载文件
 * @param {string} url    下载文件的路径
 * @param {object} data    下载文件需要的参数
 */
export function blobDownFile(url:string,data:object = {}): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest()
    xhr.open('GET', config.baseURL + url, true)
    xhr.setRequestHeader('Authorization', useUserStore().token)
    xhr.responseType = 'blob'
    xhr.onload = () => {
      const blob = xhr.response
      resolve(blob)
    }
    xhr.onerror = () => {
      reject(new Error('下载失败'))
    }
    xhr.send(JSON.stringify(data))
  })
}

/**
 * 格式化 时间格式
 * @param {string} date    时间字符串
 * @param {string} format   需要转变的格式
 * @param {string} joiner   格式分割字符
 * @returns {string}
 */
export function DateTimeFormat(date:string,format:string = '', joiner = '-') {
  const dateStr = date === '' ? new Date() : new Date(Date.parse(date))
  let result = ''
  const ymd = dateStr.getFullYear() + joiner + ((dateStr.getMonth() + 1) >= 10 ? dateStr.getMonth() + 1 : ('0' + (dateStr.getMonth() + 1).toString())) + joiner + (dateStr.getDate() >= 10 ? dateStr.getDate() : ('0' + dateStr.getDate().toString()))
  switch (format) {
    case 'YYYY':
      result = dateStr.getFullYear().toString();
      break
    case 'YYYY' + joiner + 'MM' :
      result = dateStr.getFullYear() + joiner + ((dateStr.getMonth() + 1) >= 10 ? dateStr.getMonth() + 1 : ('0' + (dateStr.getMonth() + 1).toString()));
      break;
    case 'YYYY' + joiner + 'MM' + joiner + 'DD' :
      result = ymd;
      break;
    case 'YYYY' + joiner + 'MM' + joiner + 'DD ' + 'HH':
      result = ymd + ' ' + (dateStr.getHours() >= 10 ? dateStr.getHours() : ('0' + dateStr.getHours().toString()));
      break;
    case 'YYYY' + joiner + 'MM' + joiner + 'DD ' + 'HH:MM':
      result = ymd + ' ' + (dateStr.getHours() >= 10 ? dateStr.getHours() : ('0' + dateStr.getHours().toString())) + ':' + (dateStr.getMinutes() >= 10 ? dateStr.getMinutes() : ('0' + dateStr.getMinutes().toString()));
      break;
    default:
      result = ymd + ' ' + (dateStr.getHours() >= 10 ? dateStr.getHours() : ('0' + dateStr.getHours().toString())) + ':' + (dateStr.getMinutes() >= 10 ? dateStr.getMinutes() : ('0' + dateStr.getMinutes().toString())) + ':' + (dateStr.getSeconds() >= 10 ? dateStr.getSeconds() : ('0' + dateStr.getSeconds().toString()));
      break;
  }
  return result;
}

/**
 * 数字转中文单位
 * @param num
 */
export function numberToChineseUnit(num:number) : string {
  let chineseNum = '';
  // 处理亿以上的数值，四舍五入到小数点后一位
  if (num >= 100000000) {
    let billionPart = Math.round((num / 100000000) * 10) / 10;
    chineseNum = billionPart + '亿';
  } else if (num >= 10000 && num < 100000000) {
    let billionPart = Math.round((num / 10000) * 10) / 10;
    chineseNum = billionPart + '万';
  } else {
    chineseNum = num.toString();
  }
  return chineseNum.trim();
}


/**
 * 将秒数转换为 00:00 格式的时间
 * @param seconds - 要转换的秒数
 * @returns 格式化后的时间字符串
 */
export function formatTime(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  const paddedMinutes = minutes.toString().padStart(2, '0');
  const paddedSeconds = remainingSeconds.toString().padStart(2, '0');
  return `${paddedMinutes}:${paddedSeconds}`;
}