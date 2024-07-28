let listButton = {
    countries: {
        action: 'getAllCountriesList',
        filter: 'medal'
    },
    athletes: {
        action: 'getAllAthletesList',
        filter: 'full_name'
    },
    schedules: {
        action: 'getAllSchedulesList',
        filter: '-timestamp'
    },
    sports: {
        action: 'getAllSportsList',
        filter: 'sport_code'
    },
    venues: {
        action: 'getAllVenuesList',
        filter: 'venue_name'
    },
    addAthlete: {
        action: 'getAllCountriesList',
        filter: 'country_name'
    }
}

const athlete = {
    country: {
        country_code: "NOR",
        country_name: "Norway"
    },
    date_of_birth: "1986-01-06",
    full_name: "Petter Northug",
    gender: "M",
    sport: {
        sport_code: "cross-country skiing",
        sport_name: "Лыжные гонки"
    }
}



const domainName = "http://localhost:8000"
export default {
    listButton, domainName, athlete
}