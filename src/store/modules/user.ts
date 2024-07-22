import {defineStore} from "pinia";


export const useUserStore = defineStore("reloadState", {
  state:():{uid:string, token:string, resetToken:string, userMsg:any} => ({
    uid: '',
    token:'',
    resetToken: '',
    userMsg:{},
  }),
  actions: {
    setUserStore(data:{uid:string,token:string,resetToken:string,userMsg:any}) {
      this.uid = data.uid
      this.token = data.token
      this.resetToken = data.resetToken
      this.userMsg = data.userMsg
    }
  },
  persist: true,
})