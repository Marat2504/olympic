import axios from "@/api/axios";

const getResultsOfSchedule = (data) => {
    return axios.get(`results/?discipline=${data.disciplineId}&schedule=${data.scheduleId}`)
}

export default {
    getResultsOfSchedule,
}