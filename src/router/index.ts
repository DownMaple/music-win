import {createRouter, createWebHistory} from 'vue-router'
import { menus } from "@/router/modules/menus.ts";

const router = createRouter({
  history: createWebHistory(),
  routes: menus,
})



export default router
