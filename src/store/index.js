import Vue from "vue";
import Vuex from "vuex";
import common from "./modules/common";
Vue.use(Vuex);

import app from "./modules/app";
import config from "./modules/config";
export default new Vuex.Store({
  modules: {
    app,
    config,
    common
  }
});
