import { createStore } from 'vuex'

import countries from "@/store/modules/countries";
import athletes from "@/store/modules/athletes";
import sports from "@/store/modules/sports";
import schedules from "@/store/modules/schedules";
import venues from "@/store/modules/venues";
import results from "@/store/modules/results";
import root from "@/store/modules/root"
export default createStore({
  state: {
  },

  getters: {

  },

  mutations: {
  },
  actions: {
  },
  modules: {
    countries,
    athletes,
    sports,
    schedules,
    venues,
    results,
    root
  }
})
