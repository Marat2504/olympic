import axios from "@/api/axios";

const getAllVenuesList = (filter) => {
    return axios.get(`venues/?ordering=${filter}`)
}


export default {
    getAllVenuesList,
}