import axios from "@/api/axios";

const getAllCountriesList = (filter) => {
    return axios.get(`countries/?ordering=${filter}`)
}


export default {
    getAllCountriesList,
}