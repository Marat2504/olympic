import axios from "@/api/axios";

const getAllSports = (filter) => {
    return axios.get(`sports/?ordering=${filter}`)
}

export default {
    getAllSports,
}