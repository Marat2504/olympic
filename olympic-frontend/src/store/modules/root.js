const state = {
  commonBooleanParam: false
};

const mutations = {
  setCommonBooleanParam(state, value) {
    state.commonBooleanParam = value;
  }
};

const actions = {
  updateCommonBooleanParam({ commit }, value) {
    commit('setCommonBooleanParam', value);
  }
};

const getters = {
  getCommonBooleanParam: state => state.commonBooleanParam
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
};