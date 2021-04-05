import { createApp } from "vue";
import App from "@/App.vue";
import HelperMixin from "@/libs/HelperMixin.js";
import AddressTitle from "@/components/AddressTitle.vue";

import router from "./router";

const app = createApp(App);
app.component("address-title", AddressTitle);
app.mixin(HelperMixin);
app.use(router);

app.mount("#app");
