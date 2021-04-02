import { createRouter, createWebHistory } from "vue-router";
import TheHarvester from "../components/TheHarvester.vue";
import TheManufacturer from "../components/TheManufacturer.vue";
import TheRetailer from "../components/TheRetailer.vue";
import NotFound from "../components/NotFound.vue";

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
