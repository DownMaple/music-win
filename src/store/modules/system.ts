import {defineStore} from "pinia";
import {ref} from "vue";

// 窗口信息
export const useWinStore = defineStore("useWinStore", () => {
  {
    const isWin = ref(false)
    const isMaxWin = ref(false)
    function setIsWin(val:boolean) {
      isWin.value = val
    }
    function setIsMaxWin(val:boolean) {
      isMaxWin.value = val
    }
    return {isWin,isMaxWin,setIsWin,setIsMaxWin}
  }
})