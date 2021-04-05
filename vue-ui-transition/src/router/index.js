import { createRouter, createWebHistory } from "vue-router";
import TheHarvester from "@/views/TheHarvester.vue";
import TheManufacturer from "@/views/TheManufacturer.vue";
import TheRetailer from "@/views/TheRetailer.vue";
import NotFound from "@/views/NotFound.vue";

const routes = [
  {
    path: "/",
    redirect: "/harvest",
  },
  {
    path: "/harvest",
    name: "Harvest",
    component: TheHarvester,
  },
  {
    path: "/manufacture",
    name: "Manufacture",
    component: TheManufacturer,
  },
  {
    path: "/retail",
    name: "Retail",
    component: TheRetailer,
  },
  { path: "/:notFound(.*)", component: NotFound },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
