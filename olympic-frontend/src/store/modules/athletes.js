import apiAthletes from '@/api/athletes'
import store from "../index"

const state = {
    athletes: [],
    searchAthletes: [],
    athleteProfile: {}
}

const mutationsTypes = {
    getAllAthletesListStart: "[athletes] getAllAthletesListStart",
    getAllAthletesListSuccess: "[athletes] getAllAthletesListSuccess",
    getAllAthletesListFailure: "[athletes] getAllAthletesListFailure",

    getAthleteProfileStart: "[athletes] getAthleteProfileStart",
    getAthleteProfileSuccess: "[athletes] getAthleteProfileSuccess",
    getAthleteProfileFailure: "[athletes] getAthleteProfileFailure",

    changeAthletesListStart: "[athletes] changeAthletesListStart",
    changeAthletesListSuccess: "[athletes] changeAthletesListSuccess",
    changeAthletesListFailure: "[athletes] changeAthletesListFailure",

    createNewAthleteStart: "[athletes] createNewAthleteStart",
    createNewAthleteSuccess: "[athletes] createNewAthleteSuccess",
    createNewAthleteFailure: "[athletes] createNewAthleteFailure",

    deleteAthleteStart: "[athletes] deleteAthleteStart",
    deleteAthleteSuccess: "[athletes] deleteAthleteSuccess",
    deleteAthleteFailure: "[athletes] deleteAthleteFailure",

    editAthleteStart: "[athletes] editAthleteStart",
    editAthleteSuccess: "[athletes] editAthleteSuccess",
    editAthleteFailure: "[athletes] editAthleteFailure",

    getSearchAthleteStart: "[athletes] getSearchAthleteStart",
    getSearchAthleteSuccess: "[athletes] getSearchAthleteSuccess",
    getSearchAthleteFailure: "[athletes] getSearchAthleteFailure",

    getCleanSearchAthleteStart: "[athletes] getCleanSearchAthleteStart",
    getCleanSearchAthleteSuccess: "[athletes] getCleanSearchAthleteSuccess",
    getCleanSearchAthleteFailure: "[athletes] getCleanSearchAthleteFailure",

    getFiltersAthleteStart: "[athletes] getFiltersAthleteStart",
    getFiltersAthleteSuccess: "[athletes] getFiltersAthleteSuccess",
    getFiltersAthleteFailure: "[athletes] getFiltersAthleteFailure",

}

const mutations = {
    [mutationsTypes.changeAthletesListStart]() {
        store.dispatch('root/updateCommonBooleanParam', true)
    },
    [mutationsTypes.changeAthletesListSuccess](state, filter) {
        if (filter === 'full_name') {
            state.athletes.sort((a, b) => a.full_name.localeCompare(b.full_name))
        } else if (filter === '-full_name') {
            state.athletes.sort((a, b) => b.full_name.localeCompare(a.full_name))
        } else if (filter === 'date_of_birth') {
            state.athletes.sort((a, b) => new Date(a.date_of_birth) - new Date(b.date_of_birth))
        } else if (filter === '-date_of_birth') {
            state.athletes.sort((a, b) => new Date(b.date_of_birth) - new Date(a.date_of_birth))
        } else if (filter === 'country') {
            state.athletes.sort((a, b) => a.country['country_name'].localeCompare(b.country['country_name']))
        } else if (filter === '-country') {
            state.athletes.sort((a, b) => b.country['country_name'].localeCompare(a.country['country_name']))
        } else if (filter === 'sport') {
            state.athletes.sort((a, b) => a.sport['sport_name'].localeCompare(b.country['sport_name']))
        } else if (filter === '-sport') {
            state.athletes.sort((a, b) => b.sport['sport_name'].localeCompare(a.sport['sport_name']))
        } else if (filter === 'gender') {
            state.athletes.sort((a, b) => a.gender.localeCompare(b.gender))
        } else if (filter === '-gender') {
            state.athletes.sort((a, b) => b.gender.localeCompare(a.gender))
        }
        store.dispatch('root/updateCommonBooleanParam', false)
    },
    [mutationsTypes.changeAthletesListFailure]() {
        store.dispatch('root/updateCommonBooleanParam', false)
    },

    [mutationsTypes.getAllAthletesListStart]() {
        store.dispatch('root/updateCommonBooleanParam', true)
    },
    [mutationsTypes.getAllAthletesListSuccess](state, payload) {
        state.athletes = null
        state.athletes = [...payload]
        store.dispatch('root/updateCommonBooleanParam', false)

    },
    [mutationsTypes.getAllAthletesListFailure]() {
        store.dispatch('root/updateCommonBooleanParam', false)
    },

    [mutationsTypes.getAthleteProfileStart](state) {
        state.athleteProfile = {}
        store.dispatch('root/updateCommonBooleanParam', true)
    },
    [mutationsTypes.getAthleteProfileSuccess](state, payload) {
        state.athleteProfile = {...payload}
        store.dispatch('root/updateCommonBooleanParam', false)
    },
    [mutationsTypes.getAthleteProfileFailure]() {
        store.dispatch('root/updateCommonBooleanParam', false)
    },

    [mutationsTypes.createNewAthleteStart]() {
        store.dispatch('root/updateCommonBooleanParam', true)
    },
    [mutationsTypes.createNewAthleteSuccess]() {
        store.dispatch('root/updateCommonBooleanParam', false)
    },
    [mutationsTypes.createNewAthleteFailure]() {
        store.dispatch('root/updateCommonBooleanParam', false)
    },

    [mutationsTypes.deleteAthleteStart]() {
        store.dispatch('root/updateCommonBooleanParam', true)
    },
    [mutationsTypes.deleteAthleteSuccess](state, participantCode) {
        state.athletes = state.athletes.filter(athlete => athlete['participant_code'] !== participantCode)
        state.searchAthletes = state.searchAthletes.filter(athlete => athlete['participant_code'] !== participantCode)
        store.dispatch('root/updateCommonBooleanParam', false)
    },
    [mutationsTypes.deleteAthleteFailure]() {
        store.dispatch('root/updateCommonBooleanParam', false)
    },

    [mutationsTypes.editAthleteStart]() {
        store.dispatch('root/updateCommonBooleanParam', true)
    },
    [mutationsTypes.editAthleteSuccess](state, payload) {
        const index = state.athletes.findIndex(a => a.participant_code === payload.participant_code)
        state.athletes[index] = {}
        state.athletes[index] = {...payload}
        const indexSearch = state.searchAthletes.findIndex(a => a.participant_code === payload.participant_code)
        state.searchAthletes[indexSearch] = {}
        state.searchAthletes[indexSearch] = {...payload}

        store.dispatch('root/updateCommonBooleanParam', false)
    },
    [mutationsTypes.editAthleteFailure]() {
        store.dispatch('root/updateCommonBooleanParam', false)
    },

    [mutationsTypes.getSearchAthleteStart](state) {
        state.searchAthletes = []
        store.dispatch('root/updateCommonBooleanParam', true)
    },
    [mutationsTypes.getSearchAthleteSuccess](state, payload) {
        state.searchAthletes = [...payload]
        console.log('searchAthletes', state.searchAthletes)
        store.dispatch('root/updateCommonBooleanParam', false)
    },
    [mutationsTypes.getSearchAthleteFailure]() {
        store.dispatch('root/updateCommonBooleanParam', false)
    },

    [mutationsTypes.getCleanSearchAthleteStart]() {
        store.dispatch('root/updateCommonBooleanParam', true)
    },
    [mutationsTypes.getCleanSearchAthleteSuccess](state) {
        state.searchAthletes = []
        store.dispatch('root/updateCommonBooleanParam', false)
    },
    [mutationsTypes.getCleanSearchAthleteFailure]() {
        store.dispatch('root/updateCommonBooleanParam', false)
    },

    [mutationsTypes.getFiltersAthleteStart]() {
        store.dispatch('root/updateCommonBooleanParam', true)
    },
    [mutationsTypes.getFiltersAthleteSuccess](state, payload) {
        state.athletes = null
        state.athletes = [...payload]
        store.dispatch('root/updateCommonBooleanParam', false)
    },
    [mutationsTypes.getFiltersAthleteFailure]() {
        store.dispatch('root/updateCommonBooleanParam', false)
    }

}

const actions = {
    changeAthletesList(context, filter) {
        context.commit(mutationsTypes.changeAthletesListStart);
        setTimeout(() => {
            context.commit(mutationsTypes.changeAthletesListSuccess, filter)
            context.commit(mutationsTypes.changeAthletesListFailure)
        }, 500);
    },

    getAllAthletesList(context) {
        return new Promise(() => {
            context.commit(mutationsTypes.getAllAthletesListStart);

            setTimeout(() => {
                apiAthletes.getAllAthletesList()
                    .then(response => {
                        context.commit(mutationsTypes.getAllAthletesListSuccess, response.data);
                    })
                    .catch(error => {
                        console.error(error);
                        context.commit(mutationsTypes.getAllAthletesListFailure);

                    });
            }, 500);
        });
    },

    getAthleteProfile(context, participantCode) {
        return new Promise((resolve) => {
            context.commit(mutationsTypes.getAthleteProfileStart);
            setTimeout(() => {
                apiAthletes.getProfileAthlete(participantCode)
                    .then(response => {
                        context.commit(mutationsTypes.getAthleteProfileSuccess, response.data)
                        resolve()
                    })
                    .catch(() => {
                     console.log('error get athlete data')
                     context.commit(mutationsTypes.getAthleteProfileFailure)
                    })
            }, 500)
        })
    },

    getFiltersAthletesList(context, filters) {
        return new Promise(() => {
            context.commit(mutationsTypes.getFiltersAthleteStart);
            setTimeout(() => {
                apiAthletes.getFiltersAthletes(filters)
                    .then(response => {
                        context.commit(mutationsTypes.getFiltersAthleteSuccess, response.data);
                    })
                    .catch(error => {
                        console.error(error);
                        context.commit(mutationsTypes.getFiltersAthleteFailure);
                    });
            }, 500);
        });
    },

    createNewAthlete(context, data) {
        return new Promise((resolve, reject) => {
            context.commit(mutationsTypes.createNewAthleteStart);
            setTimeout(() => {
                apiAthletes.createNewAthlete(data)
                    .then(() => {
                        context.commit(mutationsTypes.createNewAthleteSuccess)
                        resolve('Спортсмен добавлен')
                    })
                    .catch(error => {
                        console.error(error);
                        context.commit(mutationsTypes.createNewAthleteFailure)
                        reject('Ошибка, попробуйте позже')
                    })
            }, 500)
        })
    },

    deleteAthlete(context, participantCode) {
        return new Promise(() => {
            context.commit(mutationsTypes.deleteAthleteStart);
            setTimeout(() => {
                apiAthletes.deleteAthlete(participantCode)
                    .then(() => {
                        context.commit(mutationsTypes.deleteAthleteSuccess, participantCode)
                    })
                    .catch(e => {
                        console.log('ошибка при удалении спортсмена', e)
                    })
            }, 500)
        })
    },

    editAthlete(context, data) {
        return new Promise(() => {
            context.commit(mutationsTypes.editAthleteStart);
            setTimeout(() => {
                apiAthletes.editAthlete(data)
                    .then((response) => {
                        context.commit(mutationsTypes.editAthleteSuccess, response.data)
                    })
                    .catch(() => {
                        context.commit(mutationsTypes.editAthleteFailure)
                    })
            }, 500)
        })
    },

    searchAthletes(context, data) {
        return new Promise((resolve) => {
            context.commit(mutationsTypes.getSearchAthleteStart)
            setTimeout(() => {
                apiAthletes.search_athletes(data)
                    .then(response => {
                        context.commit(mutationsTypes.getSearchAthleteSuccess, response.data)
                        resolve()
                    })
                    .catch(() => {
                        console.log('Ошибка получения списка атлетов')
                    })
            }, 500)
        })
    },

    clearSearch(context) {
        context.commit(mutationsTypes.getCleanSearchAthleteStart)
        context.commit(mutationsTypes.getCleanSearchAthleteSuccess)
        context.commit(mutationsTypes.getCleanSearchAthleteFailure)
    }

}

export default {
    state, mutations, mutationsTypes, actions
}

