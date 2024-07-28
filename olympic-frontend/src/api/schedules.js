import axios from "@/api/axios";

const getAllSchedulesList = (filter) => {
    return axios.get(`schedules/?ordering=${filter}`)
}


export default {
    getAllSchedulesList,
}