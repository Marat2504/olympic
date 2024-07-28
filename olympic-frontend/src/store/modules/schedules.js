import apiSchedules from '@/api/schedules'
import store from "../index"

const state = {
    schedules: {},

}

const mutationsTypes = {
    getAllSchedulesListStart: "[schedules] getAllSchedulesListStart",
    getAllSchedulesListSuccess: "[schedules] getAllSchedulesListSuccess",
    getAllSchedulesListFailure: "[schedules] getAllSchedulesListFailure",

}

const mutations = {
    [mutationsTypes.getAllSchedulesListStart]() {
store.dispatch('root/updateCommonBooleanParam', true)
    },
    [mutationsTypes.getAllSchedulesListSuccess](state, payload) {
        state.schedules = null
        state.schedules = {...payload}
store.dispatch('root/updateCommonBooleanParam', false)
    },
    [mutationsTypes.getAllSchedulesListFailure]() {
store.dispatch('root/updateCommonBooleanParam', false)
    }
}

const actions = {
    getAllSchedulesList(context, filter) {
        return new Promise(() => {
            context.commit(mutationsTypes.getAllSchedulesListStart)
            setTimeout(() => {
                apiSchedules.getAllSchedulesList(filter)
                .then(response => {
                    context.commit(mutationsTypes.getAllSchedulesListSuccess, response.data)
                })
                .catch(er => {
                    console.log(er)
                    context.commit(mutationsTypes.getAllSchedulesListFailure)
                })
            }, 500)
        })
    }
}

export default {
    state, mutations, mutationsTypes, actions
}