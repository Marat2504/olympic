import apiCountries from '@/api/countries'
import store from "../index"

const state = {
    countries: [],
    sortMedal: true
}

const mutationsTypes = {
    getAllCountriesListStart: "[countries] getAllCountriesListStart",
    getAllCountriesListSuccess: "[countries] getAllCountriesListSuccess",
    getAllCountriesListFailure: "[countries] getAllCountriesListFailure",

    filterMedalsStart: "[countries] filterMedalsStart",
    filterMedalsSuccess: "[countries] filterMedalsSuccess",
    filterMedalsFailure: "[countries] filterMedalsFailure",

}


const mutations = {
    [mutationsTypes.getAllCountriesListStart]() {
        store.dispatch('root/updateCommonBooleanParam', true)
    },
    [mutationsTypes.getAllCountriesListSuccess](state, payload) {
        console.log('filter', payload.filter)
        state.countries = null
        state.countries = [...payload.data]
        if (payload.filter === 'medal') {
            state.countries.sort((a, b) => b.total_medals - a.total_medals)
        }
        store.dispatch('root/updateCommonBooleanParam', false)
    },
    [mutationsTypes.getAllCountriesListFailure]() {
        store.dispatch('root/updateCommonBooleanParam', false)
    },

    [mutationsTypes.filterMedalsStart]() {
        store.dispatch('root/updateCommonBooleanParam', true)
    },
    [mutationsTypes.filterMedalsSuccess](state) {
        if (state.sortMedal) {
            state.countries.sort((a, b) => a.total_medals - b.total_medals)
        } else state.countries.sort((a, b) => b.total_medals - a.total_medals)
        state.sortMedal = !state.sortMedal
        store.dispatch('root/updateCommonBooleanParam', false)
    },
    [mutationsTypes.filterMedalsFailure]() {
        store.dispatch('root/updateCommonBooleanParam', false)
    }

}

const actions = {
    getAllCountriesList(context, filter) {
        return new Promise(() => {
            context.commit(mutationsTypes.getAllCountriesListStart)
            setTimeout(() => {
                apiCountries.getAllCountriesList(filter)
                    .then(response => {
                        context.commit(mutationsTypes.getAllCountriesListSuccess, {data: response.data, filter: filter})
                    })
                    .catch(er => {
                        console.log(er)
                        context.commit(mutationsTypes.getAllCountriesListFailure)
                    })
            }, 500)
        })
    },

    filterMedals(context) {
        context.commit(mutationsTypes.filterMedalsStart)
        context.commit(mutationsTypes.filterMedalsSuccess)
        context.commit(mutationsTypes.filterMedalsFailure)
    }
}

export default {
    state, mutations, mutationsTypes, actions
}
