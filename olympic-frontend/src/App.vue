<script setup>
import {useStore} from "vuex";
import {computed, onMounted, reactive, ref, watch} from "vue";
import constData from "@/data/const"
import funcs from "@/data/func"

const store = useStore();
const currentTime = ref(funcs.currentDateNow());
onMounted(() => {
  const intervalId = setInterval(() => {
    currentTime.value = funcs.currentDateNow()
  }, 1000)
  return () => clearInterval(intervalId)
})

let button = ref('countries')
let spinner = computed(() => {
  return store.state.root.commonBooleanParam
})
let modal = reactive({
  modalSearchEmpty: false,
  openModalProfile: false,
  modalResults: false,
  modalDeleteAthlete: false
})

let searchAthletes = computed(() => {
  return store.state.athletes.searchAthletes
})

onMounted(() => {
  store.dispatch('getAllCountriesList', filterCountry.value)
  store.dispatch('getAllSportsList')

})

// Сортировка таблицы Participant
const athletes = computed(() => store.state.athletes)
let filterAthlete = ref('full_name')
let activeAthlete = reactive({participant_code: ''})

const delAthlete = () => {
  const participant_code = activeAthlete['participant_code']
  store.dispatch('deleteAthlete', participant_code)
  closeModalDelete();
}
const openModalDelete = (athlete) => {
  activeAthlete = {...athlete}
  modal.modalDeleteAthlete = true
}
const closeModalDelete = () => {
  activeAthlete = {participant_code: ''}
  modal.modalDeleteAthlete = false
}
// Фильтры атлетов
let filterAthletes = reactive(
    {
      gender: {
        male: true,
        female: true
      },
      countries: {
        country: 'allCountries'
      },
      sports: {
        sport: 'allSports'
      }
    }
)

watch(filterAthletes, (newValue) => {
  store.dispatch('getFiltersAthletesList', newValue)
})

// Редактирование данных атлета
let editAthlete = ref(false)

const openEditAthlete = (athlete) => {
  activeAthlete = {...athlete}
  store.dispatch('getAllSportsList')
  editAthlete.value = true
}
const closeEditAthlete = () => {
  editAthlete.value = false
  activeAthlete = {participant_code: ''}
}
const handleFileChangeEditProfile = (event) => {
  activeAthlete.photo = event.target.files[0]
}
const EditDataSend = () => {
  store.dispatch('editAthlete', activeAthlete)
  closeEditAthlete()
}

// Поиск атлетов
let searchBlock = ref('')
const handleSearchAthlete = () => {
  if (searchBlock.value !== '') {
    store.dispatch('searchAthletes', searchBlock.value)
        .then(() => {
          if (searchAthletes.value.length === 0) {
            console.log('null')
            modal.modalSearchEmpty = true
          }
        })
    searchBlock.value = ''
  }
}
const handleClearSearchAthlete = () => {
  store.dispatch('clearSearch')
}

// Модальное окно профиля атлета
const athleteProfile = computed(() => store.state.athletes.athleteProfile)

const openAthleteProfile = (participant_code) => {
  store.dispatch('getAthleteProfile', participant_code).then(() => modal.openModalProfile = true)
}
watch(filterAthlete, (newValue) => {
  store.dispatch('changeAthletesList', newValue)
})

// Сортировка таблицы Country
const countries = computed(() => store.state.countries)
let filterCountry = ref('medal')
const handleSortMedal = () => {
  store.dispatch('filterMedals')
}

watch(filterCountry, (newValue) => {
  store.dispatch('getAllCountriesList', newValue)
})

// Сортировка таблицы Sport
let sports = reactive(store.state.sports)
let filterSport = ref('sport_code')
watch(filterSport, (newValue) => {
  store.dispatch('getAllSportsList', newValue)
})
const showResult = (disciplineId, scheduleId) => {
  const data = {
    disciplineId: disciplineId,
    scheduleId: scheduleId
  }
  store.dispatch('getResultsOfSchedule', data)
      .then(() => modal.modalResults = true)
}

const closeResultModal = () => {
  modal.modalResults = false
  store.dispatch('clearResultList')
}


// Сортировка таблицы Schedules
let schedules = reactive(store.state.schedules)
let filterSchedules = ref('-timestamp')

watch(filterSchedules, (newValue) => {
  store.dispatch('getAllSchedulesList', newValue)
})

// Сортировка таблицы Venues
let venues = reactive(store.state.venues)
let filterVenue = ref('venue_name')
watch(filterVenue, (newValue) => {
  store.dispatch('getAllVenuesList', newValue)
})

// Сортировка таблицы Results
const results = computed(() => store.state.results)

// Форма добавления атлета
let addAthlete = reactive({
  country: '',
  sport: '',
  full_name: '',
  date_of_birth: '',
  gender: '',
  photo: null
})
let handleFileChange = (event) => {
  addAthlete.photo = event.target.files[0]
}
const addNewAthlete = () => {
  button.value = 'addAthlete'
  store.dispatch('getAllCountriesList')
  store.dispatch('getAllSportsList')
}
const sendDataNewAthlete = () => {
  console.log('send data', addAthlete)
  store.dispatch('createNewAthlete', addAthlete)
      .then(response => {
        console.log(response)
        button.value = 'athletes'
      })
      .catch(e => console.log(e))
  addAthlete = {
    country: '',
    sport: '',
    full_name: '',
    date_of_birth: '',
    gender: '',
    photo: null
  }
}
watch(button, (newValue) => {
  store.dispatch(constData.listButton[newValue].action, constData.listButton[newValue].filter)
})

</script>

<template>
  <router-view/>
  <div>Current time: {{ currentTime }}</div>
  <h1 class="text-5xl mt-2">Data Base</h1>

  <!--  Кнопки-->
  <div class="m-2 flex flex-wrap justify-center">
    <button
        class="flex-1 m-1 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded
        disabled:bg-blue-200 disabled:text-gray-500"
        @click="button = 'countries'"
        :disabled="button === 'countries'"
    >Все страны
    </button>
    <button
        class="flex-1 m-1 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded
        disabled:bg-blue-200 disabled:text-gray-500"
        @click="button = 'athletes'"
        :disabled="button === 'athletes'"
    >Все спортсмены
    </button>
    <button
        class="flex-1 m-1 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded
        disabled:bg-blue-200 disabled:text-gray-500"
        @click="button = 'sports'"
        :disabled="button === 'sports'"
    >Виды спорта
    </button>
    <button
        class="flex-1 m-1 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded
        disabled:bg-blue-200 disabled:text-gray-500"
        @click="button = 'schedules'"
        :disabled="button === 'schedules'"
    >Расписание стратов
    </button>
    <button
        class="flex-1 m-1 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded
        disabled:bg-blue-200 disabled:text-gray-500"
        @click="button = 'venues'"
        :disabled="button === 'venues'"
    >Список спортивных объектов
    </button>
    <button
        class="flex-1 m-1 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded
        disabled:bg-blue-200 disabled:text-gray-500"
        @click="addNewAthlete()"
        :disabled="button === 'addAthlete'"
    >Добавить спортсмена
    </button>
  </div>

  <!--  Таблицы-->
  <div v-if="button === 'countries'">
    <table class="min-w-full divide-y divide-gray-200">
      <thead class="bg-gray-50">
      <tr>
        <th scope="col"
            class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200">
          Count
        </th>
        <th scope="col"
            class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200">
          Flag
        </th>
        <th scope="col"
            @click="filterCountry === 'country_code' ? filterCountry = '-country_code' : filterCountry = 'country_code'"
            class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200 relative cursor-pointer hover:bg-gray-200">
          Code
          <img class="w-5 h-5 inline-block" src="./assets/sort-svgrepo-com.svg" alt="треугольник"/>
        </th>
        <th scope="col"
            @click="filterCountry === 'country_name' ? filterCountry = '-country_name' : filterCountry = 'country_name'"
            class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200 relative cursor-pointer hover:bg-gray-200">
          Country
          <img class="w-5 h-5 inline-block" src="./assets/sort-svgrepo-com.svg" alt="треугольник"/>
        </th>
        <th scope="col"
            class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200">
          <img src="./assets/olympic_medal_bronze_icon-icons.com_67222.svg" alt="gold" class="w-10">
        </th>
        <th scope="col"
            class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200 justify-center">
          <img src="./assets/olympic_medal_silver_icon-icons.com_67220.svg" alt="gold" class="w-10">
        </th>
        <th scope="col"
            class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200 flex justify-center">
          <img src="./assets/olympic_medal_gold_icon-icons.com_67221.svg" alt="gold" class=" w-10">
        </th>
        <th scope="col"
            @click="handleSortMedal"
            class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200 relative cursor-pointer hover:bg-gray-200">
          All medals
          <img class="w-5 h-5 inline-block" src="./assets/sort-svgrepo-com.svg" alt="треугольник"/>
        </th>
      </tr>
      </thead>
      <tbody class="bg-white divide-y divide-gray-200">
      <tr v-for="(country, index) in countries.countries" :key="country.country_code">
        <td class="px-6 py-4 text-left whitespace-nowrap">{{ +index + 1 }}</td>
        <td class="px-6 py-4 text-left whitespace-nowrap">
          <img :src="country.photo" alt="Flag" class="h-8 w-12 object-contain">
        </td>
        <td class="px-6 py-4 text-left whitespace-nowrap">{{ country.country_code }}</td>
        <td class="px-6 py-4 text-left whitespace-nowrap">{{ country.country_name }}</td>
        <td class="px-6 py-4 text-center whitespace-nowrap">{{ country.bronze_count }}</td>
        <td class="px-6 py-4 text-center whitespace-nowrap">{{ country.silver_count }}</td>
        <td class="px-6 py-4 text-center whitespace-nowrap">{{ country.gold_count }}</td>
        <td class="px-6 py-4 text-center whitespace-nowrap">{{ country.total_medals }}</td>
      </tr>
      </tbody>
    </table>
  </div>

  <div v-if="button === 'athletes'">
    <div class="m-2 flex align-center justify-center gap-2">
      <h1 class="content-center text-2xl font-bold">Search for an athlete</h1>
      <input v-model="searchBlock"
             class="border-blue-300 border-2 p-2 rounded text-xl"
             type="text">
      <button @click="handleSearchAthlete"
              class="bg-blue-500 hover:bg-blue-700 text-white font-bold px-4 py-2 rounded
        disabled:bg-blue-200 disabled:text-gray-500"
      >Search
      </button>
      <button @click="handleClearSearchAthlete"
              v-if="searchAthletes.length > 0"
              class="bg-red-500 hover:bg-red-700 text-white font-bold px-4 py-2 rounded
        disabled:bg-blue-200 disabled:text-gray-500"
      >Clear
      </button>
    </div>
    <!--    Таблица с выдачей с поиска атлетов-->
    <div v-if="searchAthletes.length > 0">
      <h1 class="m-2 text-2xl font-bold">Search result</h1>
      <table
          class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
        <tr>
          <th scope="col"
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200">
            Count
          </th>
          <th scope="col"
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200">
            Photo
          </th>
          <th scope="col"
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200 relative cursor-pointer hover:bg-gray-200">
            Name
          </th>
          <th scope="col"
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200 relative cursor-pointer hover:bg-gray-200">
            Sport
          </th>
          <th scope="col"
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200 relative cursor-pointer hover:bg-gray-200">
            Date of Birth
          </th>
          <th scope="col"
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200 relative cursor-pointer hover:bg-gray-200">
            Gender
          </th>
          <th scope="col"
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200 relative cursor-pointer hover:bg-gray-200">
            Country
          </th>
          <th scope="col"
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200 relative cursor-pointer hover:bg-gray-200">
            Action
          </th>
        </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
        <tr v-for="(athlete, index) in athletes.searchAthletes" :key="athlete.id">
          <td class="px-6 py-4 text-left whitespace-nowrap">{{ +index + 1 }}</td>
          <td class="px-6 py-4 text-left whitespace-nowrap">
            <img :src="funcs.editPhotoLink(athlete.photo)" alt="Flag"
                 class="h-12 w-18 object-contain cursor-pointer image-hover">
          </td>
          <td class="px-6 py-4 text-left whitespace-nowrap cursor-pointer font-bold"
              @click="openAthleteProfile(athlete.participant_code)">
            {{ athlete.full_name }}
          </td>
          <td class="px-6 py-4 text-left whitespace-nowrap">{{ athlete.sport.sport_name }}</td>
          <td class="px-6 py-4 text-left whitespace-nowrap">{{ athlete.date_of_birth }}</td>
          <td class="px-6 py-4 text-left whitespace-nowrap">{{ athlete.gender }}</td>
          <td class="px-6 py-4 text-left whitespace-nowrap">{{ athlete.country.country_name }}</td>
          <td class="px-6 py-4 text-left whitespace-nowrap">
          <span
              @click="openEditAthlete(athlete)"
              class="text-blue-300 hover:text-blue-200 cursor-pointer">Edit</span> /
            <span
                @click="openModalDelete(athlete)"
                class="text-red-300 hover:text-red-200 cursor-pointer">Delete</span></td>
        </tr>
        </tbody>
      </table>
    </div>
    <!--    Таблица всех атлетов-->
    <h1 class="m-2 text-2xl font-bold">All athletes</h1>
    <div class="flex flex-wrap justify-center gap-10">
      <h1 class="text-xl font-bold">Filters:</h1>
      <div>
        <input type="checkbox" name="gender" id="male" value="male" :checked="filterAthletes.gender.male"
               v-model="filterAthletes.gender.male"
        >
        <label for="male">Male</label>
      </div>
      <div>
        <input type="checkbox" name="gender" id="female" value="female" :checked="filterAthletes.gender.female"
               v-model="filterAthletes.gender.female"
        >
        <label for="female">Female</label>
      </div>
      <select v-model="filterAthletes.countries.country" name="country" id="country">
        <option v-for="country in countries.countries" :key="country.country_code"
                :selected="filterAthletes.countries.country"
                :value="country.country_code">
          {{ country.country_name }}
        </option>
        <option value="allCountries" :selected="filterAthletes.countries.country==='allCountries'">
          All countries
        </option>
      </select>
      <select v-model="filterAthletes.sports.sport" name="sport" id="sport">
        <option v-for="sport in sports.sports" :key="sport"
                :selected="filterAthletes.sports.sport"
                :value="sport.sport_code">
          {{ sport.sport_name }}
        </option>
        <option value="allSports" :selected="filterAthletes.sports.sport==='allSports'">
          All sports
        </option>
      </select>
      <h1 class="text-xl font-bold">{{ athletes.athletes.length }} athletes found</h1>
    </div>
    <table class="min-w-full divide-y divide-gray-200">
      <thead class="bg-gray-50">
      <tr>
        <th scope="col"
            class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200">
          Count
        </th>
        <th scope="col"
            class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200">
          Photo
        </th>
        <th scope="col"
            @click="filterAthlete === 'full_name' ? filterAthlete = '-full_name' : filterAthlete = 'full_name'"
            class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200 relative cursor-pointer hover:bg-gray-200">
          Name
          <img class="w-5 h-5 inline-block" src="./assets/sort-svgrepo-com.svg" alt="треугольник"/>
        </th>
        <th scope="col"
            @click="filterAthlete === 'sport' ? filterAthlete = '-sport' : filterAthlete = 'sport'"
            class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200 relative cursor-pointer hover:bg-gray-200">
          Sport
          <img class="w-5 h-5 inline-block" src="./assets/sort-svgrepo-com.svg" alt="треугольник"/>
        </th>
        <th scope="col"
            @click="filterAthlete === 'date_of_birth' ? filterAthlete = '-date_of_birth' : filterAthlete = 'date_of_birth'"
            class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200 relative cursor-pointer hover:bg-gray-200">
          Date of Birth
          <img class="w-5 h-5 inline-block" src="./assets/sort-svgrepo-com.svg" alt="треугольник"/>
        </th>
        <th scope="col"
            @click="filterAthlete === 'gender' ? filterAthlete = '-gender' : filterAthlete = 'gender'"
            class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200 relative cursor-pointer hover:bg-gray-200">
          Gender
          <img class="w-5 h-5 inline-block" src="./assets/sort-svgrepo-com.svg" alt="треугольник"/>
        </th>
        <th scope="col"
            @click="filterAthlete === 'country' ? filterAthlete = '-country' : filterAthlete = 'country'"
            class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200 relative cursor-pointer hover:bg-gray-200">
          Country
          <img class="w-5 h-5 inline-block" src="./assets/sort-svgrepo-com.svg" alt="треугольник"/>
        </th>
        <th scope="col"
            class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200 relative cursor-pointer hover:bg-gray-200">
          Action
        </th>
      </tr>
      </thead>
      <tbody class="bg-white divide-y divide-gray-200">
      <tr v-for="(athlete, index) in athletes.athletes" :key="athlete.id"
      >
        <td class="px-6 py-4 text-left whitespace-nowrap">{{ +index + 1 }}</td>
        <td class="px-6 py-4 text-left whitespace-nowrap">
          <img :src="funcs.editPhotoLink(athlete.photo)" alt="Flag"
               class="h-12 w-18 object-contain cursor-pointer image-hover">
        </td>
        <td class="px-6 py-4 text-left whitespace-nowrap cursor-pointer font-bold"
            @click="openAthleteProfile(athlete.participant_code)">
          {{ athlete.full_name }}
        </td>
        <td class="px-6 py-4 text-left whitespace-nowrap">{{ athlete.sport.sport_name }}</td>
        <td class="px-6 py-4 text-left whitespace-nowrap">{{ athlete.date_of_birth }}</td>
        <td class="px-6 py-4 text-left whitespace-nowrap">{{ athlete.gender }}</td>
        <td class="px-6 py-4 text-left whitespace-nowrap">{{ athlete.country.country_name }}</td>
        <td class="px-6 py-4 text-left whitespace-nowrap">
          <span
              @click="openEditAthlete(athlete)"
              class="text-blue-300 hover:text-blue-200 cursor-pointer">Edit</span> /
          <span
              @click="openModalDelete(athlete)"
              class="text-red-300 hover:text-red-200 cursor-pointer">Delete</span></td>
      </tr>
      </tbody>
    </table>
  </div>

  <div v-if="button === 'sports'">
    <table class="min-w-full divide-y divide-gray-200">
      <thead class="bg-gray-50">
      <tr>
        <th scope="col"
            class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200">
          Count
        </th>
        <th scope="col"
            @click="filterSport === 'sport_name' ? filterSport = '-sport_name' : filterSport = 'sport_name'"
            class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200 relative cursor-pointer hover:bg-gray-200">
          Discipline
          <img class="w-5 h-5 inline-block" src="./assets/sort-svgrepo-com.svg" alt="треугольник"/>
        </th>
      </tr>
      </thead>
      <tbody class="bg-white divide-y divide-gray-200">
      <tr v-for="(sport, index) in sports.sports" :key="sport.sport_code">
        <td class="px-6 py-4 text-left whitespace-nowrap">{{ +index + 1 }}</td>
        <td class="px-6 py-4 text-left whitespace-nowrap">{{ sport.sport_name }}</td>
      </tr>
      </tbody>
    </table>
  </div>

  <div v-if="button === 'schedules'">
    <table class="min-w-full divide-y divide-gray-200">
      <thead class="bg-gray-50">
      <tr>
        <th scope="col"
            class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200">
          Count
        </th>
        <th scope="col"
            @click="filterSchedules === 'sport' ? filterSchedules = '-sport' : filterSchedules = 'sport'"
            class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200 relative cursor-pointer hover:bg-gray-200">
          Sport
          <img class="w-5 h-5 inline-block" src="./assets/sort-svgrepo-com.svg" alt="треугольник"/>
        </th>
        <th scope="col"
            @click="filterSchedules === 'discipline' ? filterSchedules = '-discipline' : filterSchedules = 'discipline'"
            class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200 relative cursor-pointer hover:bg-gray-200">
          Discipline
          <img class="w-5 h-5 inline-block" src="./assets/sort-svgrepo-com.svg" alt="треугольник"/>
        </th>
        <th scope="col"
            @click="filterSchedules === 'timestamp' ? filterSchedules = '-timestamp' : filterSchedules = 'timestamp'"
            class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200 relative cursor-pointer hover:bg-gray-200">
          Start time
          <img class="w-5 h-5 inline-block" src="./assets/sort-svgrepo-com.svg" alt="треугольник"/>
        </th>
        <th scope="col"
            @click="filterSchedules === 'venue' ? filterSchedules = '-venue' : filterSchedules = 'venue'"
            class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200 relative cursor-pointer hover:bg-gray-200">
          Venue
          <img class="w-5 h-5 inline-block" src="./assets/sort-svgrepo-com.svg" alt="треугольник"/>
        </th>
        <th scope="col"
            class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200 relative cursor-pointer hover:bg-gray-200">
          Rusult
        </th>
      </tr>
      </thead>
      <tbody class="bg-white divide-y divide-gray-200">
      <tr
          :class="funcs.formatDate(schedule.timestamp) > funcs.currentTimestamp() ? 'bg-green-100' : 'bg-red-100'"
          v-for="(schedule, index) in schedules.schedules" :key="schedule.id">
        <td class="px-6 py-4 text-left whitespace-nowrap">{{ +index + 1 }}</td>
        <td class="px-6 py-4 text-left whitespace-nowrap">{{ schedule.sport.sport_name }}</td>
        <td class="px-6 py-4 text-left whitespace-nowrap">{{ schedule.discipline.discipline_name }}</td>
        <td class="px-6 py-4 text-left whitespace-nowrap">{{ funcs.formattedDate(schedule.timestamp) }}</td>
        <td class="px-6 py-4 text-left whitespace-nowrap">{{ schedule.venue.venue_name }}</td>
        <td v-if="funcs.formatDate(schedule.timestamp) < funcs.currentTimestamp()"
            class="px-6 py-4 text-left whitespace-nowrap">
          <span
              @click="showResult(schedule.discipline.id, schedule.id)"
              class="cursor-pointer py-2 px-8 bg-green-300 hover:bg-green-500 transition-all rounded">
            Open
          </span>
        </td>
        <td v-else
            class="px-6 py-4 text-left whitespace-nowrap">
        </td>
      </tr>
      </tbody>
    </table>
  </div>

  <div v-if="button === 'venues'">
    <table class="min-w-full divide-y divide-gray-200">
      <thead class="bg-gray-50">
      <tr>
        <th scope="col"
            class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200">
          Count
        </th>
        <th scope="col"
            @click="filterVenue === 'venue_name' ? filterVenue = '-venue_name' : filterVenue = 'venue_name'"
            class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200 relative cursor-pointer hover:bg-gray-200">
          Name object
          <img class="w-5 h-5 inline-block" src="./assets/sort-svgrepo-com.svg" alt="треугольник"/>
        </th>
        <th scope="col"
            @click="filterVenue === 'location' ? filterVenue = '-location' : filterVenue = 'location'"
            class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200 relative cursor-pointer hover:bg-gray-200">
          Location
          <img class="w-5 h-5 inline-block" src="./assets/sort-svgrepo-com.svg" alt="треугольник"/>
        </th>
        <th scope="col"
            @click="filterVenue === 'address' ? filterVenue = '-address' : filterVenue = 'address'"
            class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200 relative cursor-pointer hover:bg-gray-200">
          Address
          <img class="w-5 h-5 inline-block" src="./assets/sort-svgrepo-com.svg" alt="треугольник"/>
        </th>
      </tr>
      </thead>
      <tbody class="bg-white divide-y divide-gray-200">
      <tr v-for="(venue, index) in venues.venues" :key="venue.venue_code">
        <td class="px-6 py-4 text-left whitespace-nowrap">{{ +index + 1 }}</td>
        <td class="px-6 py-4 text-left whitespace-nowrap">{{ venue.venue_name }}</td>
        <td class="px-6 py-4 text-left whitespace-nowrap">{{ venue.location }}</td>
        <td class="px-6 py-4 text-left whitespace-nowrap">{{ venue.address }}</td>
      </tr>
      </tbody>
    </table>
  </div>


  <!--Спиннер загрузки-->
  <div v-if="spinner" id="spinner-overlay">
    <div class="spinner"></div>
  </div>


  <!--  Модальное окно результатов-->
  <div
      v-if="modal.modalResults"
      class="fixed z-10 inset-0 overflow-y-auto"
      @click="closeResultModal"
  >
    <div class="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">

      <!-- Фоновое затемнение -->
      <div class="fixed inset-0 transition-opacity">
        <div class="absolute inset-0 bg-gray-500 opacity-75"></div>
      </div>

      <!-- Окно модального окна -->
      <div
          class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all w-3/4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-headline"
          @click.prevent.stop
      >

        <!-- Шапка модального окна -->
        <div class="bg-gray-200 px-4 py-3 border-b border-gray-300">
          <h2 class="font-semibold text-2xl text-gray-800" id="modal-headline">
            Results <span
              class="text-lg block">{{
              results.results[0].discipline.sport
            }}: {{ results.results[0].discipline.sport_type }} competition</span>
          </h2>
        </div>

        <!-- Тело модального окна -->
        <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">

          <!-- Таблица с тремя столбцами -->
          <table class="table-auto w-full">
            <thead>
            <tr>
              <th class="px-4 py-2">Place</th>
              <th class="px-4 py-2">Name</th>
              <th class="px-4 py-2">Gender</th>
              <th class="px-4 py-2">Country</th>
              <th class="px-4 py-2">Result</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="result in results.results" :key="result"
                :class="result.place % 2 === 0 ? 'bg-amber-200':'bg-pink-200'">
              <td class="border px-4 py-2">{{ result.place }}</td>
              <td class="border px-4 py-2">{{ result.participant.full_name }}</td>
              <td class="border px-4 py-2">{{ result.participant.gender }}</td>
              <td class="border px-4 py-2">{{ result.participant.country.country_name }}</td>
              <td class="border px-4 py-2">{{ result.result }}</td>
            </tr>

            <!-- Здесь могут быть другие строки таблицы -->
            </tbody>
          </table>

        </div>

        <!-- Нижняя панель модального окна -->
        <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
          <button
              @click="closeResultModal"
              type="button"
              class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-green-600 text-base font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:ml-3 sm:w-auto sm:text-sm"
          >
            Закрыть
          </button>
        </div>

      </div>

    </div>
  </div>


  <!--  Окно добавления атлета-->
  <div v-if="button === 'addAthlete'"
       class="max-w-md mx-auto bg-white p-8 rounded shadow-md">
    <h2 class="text-2xl font-bold mb-6">Data entry form</h2>
    <form @submit.prevent="sendDataNewAthlete">
      <div class="mb-4">
        <label for="sport" class="block text-gray-700 text-sm font-bold mb-2">Sport</label>
        <select
            v-model="addAthlete.sport"
            id="sport" name="sport" class="w-full px-3 py-2 border rounded-lg outline-none">
          <option
              v-for="sport in sports.sports" :key="sport.sport_code"
              :value="sport.sport_code">{{ sport.sport_name }}
          </option>
        </select>
      </div>
      <div class="mb-4">
        <label for="country" class="block text-gray-700 text-sm font-bold mb-2">Country</label>
        <select
            v-model="addAthlete.country"
            id="country" name="country" class="w-full px-3 py-2 border rounded-lg outline-none">
          <option
              v-for="country in countries.countries" :key="country.country_code"
              :value="country.country_code">{{ country.country_name }}
            <img :src="country.photo" alt="Flag of {{ country.country_name }}">
          </option>
        </select>
      </div>
      <div class="mb-4">
        <label for="name" class="block text-gray-700 text-sm font-bold mb-2">Name</label>
        <input
            v-model="addAthlete.full_name"
            type="text" id="name" name="name" class="w-full px-3 py-2 border rounded-lg outline-none">
      </div>
      <div class="mb-4">
        <label for="dob" class="block text-gray-700 text-sm font-bold mb-2">Date of birth</label>
        <input
            v-model="addAthlete.date_of_birth"
            type="date" id="dob" name="dob" class="w-full px-3 py-2 border rounded-lg outline-none">
      </div>
      <div class="mb-4">
        <label for="gender" class="block text-gray-700 text-sm font-bold mb-2">Gender</label>
        <select
            v-model="addAthlete.gender"
            id="gender" name="gender" class="w-full px-3 py-2 border rounded-lg outline-none">
          <option value="M">Male</option>
          <option value="F">Female</option>
        </select>
      </div>
      <div class="mb-4">
        <label for="photo" class="block text-gray-700 text-sm font-bold mb-2">Photo</label>
        <input
            @change="handleFileChange"
            type="file" id="photo" name="photo" class="w-full px-3 py-2 border rounded-lg outline-none">
      </div>
      <button type="submit" class="bg-blue-500 w-full hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
        Send
      </button>
    </form>
  </div>

  <!--  Окно редактирования атлета-->
  <div v-if="editAthlete"
       class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-10">
    <div class="modal max-w-md mx-auto bg-white p-8 rounded shadow-md">
      <h2 class="text-2xl font-bold mb-6">Edit Profile</h2>
      <form @submit.prevent="EditDataSend">
        <div class="mb-4">
          <label for="sport" class="block text-gray-700 text-sm font-bold mb-2">Sport</label>
          <select
              v-model="activeAthlete.sport"
              id="sport" name="sport" class="w-full px-3 py-2 border rounded-lg outline-none">
            <option
                v-for="sport in sports.sports" :key="sport.sport_code"
                :selected="sport.sport_code === activeAthlete.sport.sport_code"
                :value="sport">{{ sport.sport_name }}
            </option>
          </select>
        </div>
        <div class="mb-4">
          <label for="country" class="block text-gray-700 text-sm font-bold mb-2">Country</label>
          <select
              v-model="activeAthlete.country"
              id="country" name="country" class="w-full px-3 py-2 border rounded-lg outline-none">
            <option
                v-for="country in countries.countries" :key="country.country_code"
                :selected="country.country_code === activeAthlete.sport.country_code"
                :value="country"
            >{{ country.country_name }}
            </option>
          </select>
        </div>
        <div class="mb-4">
          <label for="name" class="block text-gray-700 text-sm font-bold mb-2">Name</label>
          <input
              v-model="activeAthlete.full_name"
              type="text" id="name" name="name" class="w-full px-3 py-2 border rounded-lg outline-none">
        </div>
        <div class="mb-4">
          <label for="dob" class="block text-gray-700 text-sm font-bold mb-2">Date of birth</label>
          <input
              v-model="activeAthlete.date_of_birth"
              type="date" id="dob" name="dob" class="w-full px-3 py-2 border rounded-lg outline-none">
        </div>
        <div class="mb-4">
          <label for="gender" class="block text-gray-700 text-sm font-bold mb-2">Gender</label>
          <select
              v-model="activeAthlete.gender"
              id="gender" name="gender" class="w-full px-3 py-2 border rounded-lg outline-none">
            <option value="M">Male</option>
            <option value="F">Female</option>
          </select>
        </div>
        <div class="mb-4">
          <label for="photo" class="block text-gray-700 text-sm font-bold mb-2">Photo</label>
          <input
              @change="handleFileChangeEditProfile"
              type="file" id="photo" name="photo" class="w-full px-3 py-2 border rounded-lg outline-none">
        </div>
        <button type="submit" class="bg-blue-500 w-full mb-2 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          Send
        </button>
        <button @click="closeEditAthlete"
                class="bg-red-500 w-full hover:bg-red-700 text-white font-bold py-2 px-4 rounded">
          Cancel
        </button>
      </form>
    </div>
  </div>

  <!--  Модальное окно подтверждения удаления-->
  <div v-if="modal.modalDeleteAthlete"
       class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
    <div class="bg-white p-6 rounded-lg shadow-md">
      <p class="text-lg mb-4">Are you sure?</p>
      <div class="flex justify-center">
        <button
            @click="delAthlete"
            id="confirmYes" class="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded mr-2">Да
        </button>
        <button
            @click="closeModalDelete"
            id="confirmNo" class="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded">Нет
        </button>
      </div>
    </div>
  </div>

  <!--  Модальное окно о пустом результате поиска атлетов-->
  <div v-if="modal.modalSearchEmpty"
       class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
    <div class="bg-white p-6 rounded-lg shadow-md">
      <p class="text-lg mb-4">The search has not given any results</p>
      <div class="flex justify-center">
        <button
            @click="modal.modalSearchEmpty = false"
            id="confirmNo" class="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded">Close
        </button>
      </div>
    </div>
  </div>

  <!--  Модальное окно профиля атлета-->
  <div v-if="modal.openModalProfile"
       class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
       @click="modal.openModalProfile = false"
  >
    <div class="bg-white p-6 rounded-lg shadow-md"
         @click.prevent.stop>
      <div class="flex justify-center align-center gap-5">
        <h1 class="text-2xl self-center font-bold">{{ athleteProfile.athlete.full_name }}</h1>
        <img :src="constData.domainName + athleteProfile.athlete.country.photo" alt="flag" class="w-10">
        <h1 class="self-center text-2xl font-bold">{{ athleteProfile.athlete.country.country_name }}</h1>
      </div>

      <div class="flex justify-between align-top mt-2">
        <div class="flex-1">
          <img :src="constData.domainName + athleteProfile.athlete.photo" alt="photo" class="h-full max-h-80">
        </div>
        <div class="flex flex-col flex-1 pl-5 gap-4">
          <h1 class="text-left text-xl"><span class="font-bold">Sport:</span> {{
              athleteProfile.athlete.sport.sport_name
            }}</h1>
          <h1 class="text-left text-xl"><span class="font-bold">Athlete code:</span>
            {{ athleteProfile.athlete.participant_code }}</h1>
          <h1 class="text-left text-xl"><span class="font-bold">Gender:</span> {{ athleteProfile.athlete.gender }}</h1>
          <h1 class="text-left text-xl"><span class="font-bold">Date of birth:</span>
            {{ athleteProfile.athlete.date_of_birth }}</h1>
          <h1 class="text-left text-xl"><span class="font-bold">Full years:</span>
            {{ funcs.fullYear(athleteProfile.athlete.date_of_birth) }}</h1>
        </div>
      </div>
      <h1 class="text-2xl mt-2 font-bold">Results</h1>
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
        <tr>
          <th scope="col"
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200">
            Count
          </th>
          <th scope="col"
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200">
            Discipline
          </th>
          <th scope="col"
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200 relative cursor-pointer hover:bg-gray-200">
            Sport type
          </th>
          <th scope="col"
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200">
            Venue
          </th>
          <th scope="col"
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200 relative cursor-pointer hover:bg-gray-200">
            Start date and time
          </th>
          <th scope="col"
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200 justify-center">
            Result
          </th>
          <th scope="col"
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200 flex justify-center">
            Place
          </th>
        </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
        <tr v-for="(result, index) in athleteProfile.results" :key="result.id">
          <td class="px-6 py-4 text-left whitespace-nowrap">{{ +index + 1 }}</td>
          <td class="px-6 py-4 text-left whitespace-nowrap">
            {{ result.discipline.discipline_name }}
          </td>
          <td class="px-6 py-4 text-left whitespace-nowrap">{{ result.discipline.sport_type }}</td>
          <td class="px-6 py-4 text-left whitespace-nowrap">{{ result.Schedule.venue.venue_name }}</td>
          <td class="px-6 py-4 text-center whitespace-nowrap">{{ funcs.formattedDate(result.Schedule.timestamp) }}</td>
          <td class="px-6 py-4 text-center whitespace-nowrap">{{ result.result }}</td>
          <td class="px-6 py-4 text-center whitespace-nowrap"><span
              :class="result.place <= 3 ? 'text-green-400' : 'text-gray-800'">{{ result.place }}</span></td>
        </tr>
        </tbody>
      </table>

      <button
          @click="modal.openModalProfile = false"
          id="confirmNo" class="bg-gray-500 w-52 hover:bg-gray-600 text-white font-bold py-2 px-4 mt-4 rounded">Close
      </button>

    </div>
  </div>

</template>


<style>
@import 'hover.css';

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

nav {
  padding: 30px;
}

nav a {
  font-weight: bold;
  color: #2c3e50;
}

nav a.router-link-exact-active {
  color: #42b983;
}

.image-hover {
  transition: transform 0.3s ease;
}

.image-hover:hover {
  transform: scale(5) translateX(40%);
}

#spinner-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0); /* Полупрозрачный фон */
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999; /* Очень высокий z-index, чтобы спиннер был поверх всего */
}

.spinner {
  border: 8px solid rgba(214, 51, 135, 0.8); /* Цвет и толщина кружка спиннера */
  border-top: 4px solid #fff; /* Цвет верхней части */
  border-radius: 50%; /* Круглая форма */
  width: 100px; /* Размер спиннера */
  height: 100px; /* Размер спиннера */
  animation: spin 0.8s linear infinite; /* Анимация вращения */
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>

