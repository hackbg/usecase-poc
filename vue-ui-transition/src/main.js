import { createApp } from "vue";
import App from "./App.vue";
import HelperMixin from "./libs/HelperMixin.js";

import router from "./router";

const app = createApp(App);
app.mixin(HelperMixin);
app.use(router);

app.mount("#app");
