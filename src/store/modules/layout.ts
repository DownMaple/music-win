import {defineStore} from "pinia";


export const useLayoutStore = defineStore("layoutStore", {
  state:() => ({
    theme: 'default',
    darkMode:false,
    sidebarStatus:false,
    EpThemeColor:'#5a9cf8',
    drawerState:false,
  }),
  actions: {
    setTheme(val:string) {
      this.theme = val
    },
    setDrawerState(val:boolean) {
      this.drawerState = val
    },
    setDarkMode(val:boolean) {
      this.darkMode = val
    },
    setEpThemeColor(val:string) {
      this.EpThemeColor = val
    }
  },
  persist: true,
})