import constData from "@/data/const"

// получить текущую дата в секундах
function currentTimestamp() {
    return new Date().getTime()
}

// получить дату в секундах от значения timestamp
function formatDate(date) {
    return new Date(date).getTime()
}

// привести timestamp в читаемый формат
const formattedDate = (value) => {
    const date = new Date(value)
    return `${date.getDate().toString().padStart(2, '0')}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getFullYear()} ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}:${date.getSeconds().toString().padStart(2, '0')}`
}

const editPhotoLink = (link) => {
    if (link.includes(constData.domainName)) {
        return link
    } else {
        return constData.domainName + link
    }
}

const fullYear = (dateOfBirth) => {
    const birthDate = new Date(dateOfBirth)
    const currentDate = new Date()
    const msDiff = currentDate - birthDate;
    const age = Math.floor(msDiff / (1000 * 60 * 60 * 24 * 365))
    return age
}

const nullDate = (value) => {
     if (String(value).length === 1) {
        return `0${value}`
    }
    return value
}

const currentDateNow = () => {
    let currentDate = new Date()
    let year = currentDate.getFullYear();
    let month = currentDate.getMonth() + 1;
    let date = currentDate.getDate();
    let hours = currentDate.getHours();
    let minutes = currentDate.getMinutes();
    let seconds = currentDate.getSeconds();

    return `${nullDate(date)}-${nullDate(month)}-${year} | ${nullDate(hours)}:${nullDate(minutes)}:${nullDate(seconds)}`
}


export default {
    currentTimestamp, formatDate, formattedDate, editPhotoLink, fullYear, currentDateNow, nullDate
}