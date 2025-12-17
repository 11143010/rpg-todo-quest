// src/router/index.ts
import { createRouter, createWebHistory } from "vue-router";
import DashboardView from "@/views/DashboardView.vue";
import ShopView from "@/views/ShopView.vue";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/",
      name: "home",
      component: DashboardView,
    },
    {
      path: "/shop",
      name: "shop",
      component: ShopView,
    },
  ],
});

export default router;
