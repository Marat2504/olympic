import apiResults from '@/api/results'
import store from "../index"

const state = {
    results: [],

}

const mutationsTypes = {
    getResultsListOfScheduleStart: "[results] getResultsListOfScheduleStart",
    getResultsListOfScheduleSuccess: "[results] getResultsListOfScheduleSuccess",
    getResultsListOfScheduleFailure: "[results] getResultsListOfScheduleFailure",

    clearResultsListStart: "[results] clearResultsListStart",
    clearResultsListSuccess: "[results] clearResultsListSuccess",
    clearResultsListFailure: "[results] clearResultsListFailure",

}

const mutations = {
    [mutationsTypes.getResultsListOfScheduleStart]() {
        store.dispatch('root/updateCommonBooleanParam', true)
    },
    [mutationsTypes.getResultsListOfScheduleSuccess](state, payload) {
        state.results = null
        state.results = [...payload]
        store.dispatch('root/updateCommonBooleanParam', false)
        console.log('results', state.results)
    },
    [mutationsTypes.getResultsListOfScheduleFailure]() {
        store.dispatch('root/updateCommonBooleanParam', false)
    },

    [mutationsTypes.clearResultsListStart](state) {
        state.results = null
    },
    [mutationsTypes.clearResultsListSuccess]() {},
    [mutationsTypes.clearResultsListFailure]() {},
}

const actions = {
    getResultsOfSchedule(context, data) {
        return new Promise((resolve) => {
            context.commit(mutationsTypes.getResultsListOfScheduleStart)
            setTimeout(() => {
                apiResults.getResultsOfSchedule(data)
                    .then(response => {
                        context.commit(mutationsTypes.getResultsListOfScheduleSuccess, response.data)
                        resolve()
                    })
                    .catch(er => {
                        console.log(er)
                        context.commit(mutationsTypes.getResultsListOfScheduleFailure)
                    })
            }, 500)
        })
    },

    clearResultList(context) {
        context.commit(mutationsTypes.clearResultsListStart)
        context.commit(mutationsTypes.clearResultsListSuccess)
        context.commit(mutationsTypes.clearResultsListFailure)
    }
}

export default {
    state, mutations, mutationsTypes, actions
}