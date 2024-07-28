import apiSports from '@/api/sports'
import store from "../index"

const state = {
    sports: {}
}

const mutationsTypes = {
    getAllSportsListStart: "[sports] getAllSportsListStart",
    getAllSportsListSuccess: "[sports] getAllSportsListSuccess",
    getAllSportsListFailure: "[sports] getAllSportsListFailure",

}

const mutations = {
    [mutationsTypes.getAllSportsListStart]() {
store.dispatch('root/updateCommonBooleanParam', true)
    },
    [mutationsTypes.getAllSportsListSuccess](state, payload) {
        state.sports = null
        state.sports = {...payload}
store.dispatch('root/updateCommonBooleanParam', false)
    },
    [mutationsTypes.getAllSportsListFailure]() {
store.dispatch('root/updateCommonBooleanParam', false)
    }
}

const actions = {
    getAllSportsList(context, filter) {
        return new Promise(() => {
            context.commit(mutationsTypes.getAllSportsListStart)
            setTimeout(() => {
                apiSports.getAllSports(filter)
                .then(response => {
                    context.commit(mutationsTypes.getAllSportsListSuccess, response.data)
                })
                .catch(er => {
                    console.log(er)
                    context.commit(mutationsTypes.getAllSportsListFailure)
                })
            }, 500)
        })
    }
}

export default {
    state, mutations, mutationsTypes, actions
}