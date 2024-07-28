import apiVenues from '@/api/venues'
import store from "../index"

const state = {
    venues: {},
}

const mutationsTypes = {
    getAllVenuesListStart: "[venues] getAllVenuesListStart",
    getAllVenuesListSuccess: "[venues] getAllVenuesListSuccess",
    getAllVenuesListFailure: "[venues] getAllVenuesListFailure",

}

const mutations = {
    [mutationsTypes.getAllVenuesListStart]() {
        store.dispatch('root/updateCommonBooleanParam', true)
    },
    [mutationsTypes.getAllVenuesListSuccess](state, payload) {
        state.venues = null
        state.venues = {...payload}
        store.dispatch('root/updateCommonBooleanParam', false)


    },
    [mutationsTypes.getAllVenuesListFailure]() {
        store.dispatch('root/updateCommonBooleanParam', false)
    }
}

const actions = {
    getAllVenuesList(context, filter) {
        return new Promise(() => {
            context.commit(mutationsTypes.getAllVenuesListStart);
            setTimeout(() => {
                apiVenues.getAllVenuesList(filter)
                    .then(response => {
                        context.commit(mutationsTypes.getAllVenuesListSuccess, response.data);
                    })
                    .catch(error => {
                        console.error(error);
                        context.commit(mutationsTypes.getAllVenuesListFailure);
                    });
            }, 500);
        });
    }
}

export default {
    state, mutations, mutationsTypes, actions
}


