import axios from "@/api/axios";
const getAllAthletesList = () => {
    return axios.get(`athletes/all/`)
}

const getProfileAthlete = (participantCode) => {
    return axios.get(`athletes/athlete/${participantCode}/`)
}

const createNewAthlete = (data) => {
    const config = {
        headers: {
            'content-type': 'multipart/form-data'
        }
    };
    return axios.post(`athletes/`, data, config)
}

const deleteAthlete = (participantCode) => {
    return axios.delete(`athletes/del/${participantCode}/`)
}

const editAthlete = (data) => {
    const config = {
        headers: {
            'content-type': 'multipart/form-data'
        }
    }
        return axios.post(`athletes/edit/${data['participant_code']}/`, data, config)
    }

const search_athletes = (searchText) => {
    return axios.get(`athletes/search/${searchText}/`)
}

const getFiltersAthletes = (filters) => {
    return axios.post(`athletes/filters/`, filters)
}

    export default {
        getAllAthletesList,
        createNewAthlete,
        deleteAthlete,
        editAthlete,
        search_athletes,
        getFiltersAthletes,
        getProfileAthlete
    }