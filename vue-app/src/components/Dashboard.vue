<template>
  <div class="dashboard">
    <input
      type="text"
      class="searchTerm"
      placeholder="search..."
      v-model="searchTerm"
    />
    <ul>
      <li v-for="person in filteredData" :key="person.id">
<!--        <Card :person="person" />-->
        {{person.id}}
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import axios from 'axios'
// import Card from '../card/Card.vue'

// Definiere den Prop "dataSet" mit Default-Wert und Validator
const props = defineProps({
  dataSet: {
    type: Number,
    default: 1000,
    validator: (value) => [1000, 10000, 100000, 1000000].includes(value)
  }
})

const data = ref([])
const filteredData = ref([])
const searchTerm = ref('')
const debouncedSearchTerm = ref('')

// Daten basierend auf der dataSet-Größe laden
const fetchData = async (size) => {
  let url = ''
  if (size === 1000) url = '/MOCK_DATA.json'
  else if (size === 10000) url = '/MOCK_DATA_10_000.json'
  else if (size === 100000) url = '/MOCK_DATA_100_000.json'
  else if (size === 1000000) url = '/MOCK_DATA_1_000_000.json'

  try {
    const response = await axios.get(url)
    data.value = response.data
  } catch (error) {
    console.error(error)
  }
}

// Beobachte den dataSet-Prop und lade beim Ändern die Daten neu
watch(
  () => props.dataSet,
  (newSize) => {
    fetchData(newSize)
  },
  { immediate: true }
)

// Debounce-Logik für die Suche
watch(
  searchTerm,
  (newTerm, _, onCleanup) => {
    const handler = setTimeout(() => {
      debouncedSearchTerm.value = newTerm
    }, 300)
    onCleanup(() => clearTimeout(handler))
  }
)

// Filtere die Daten, sobald sich die geladenen Daten oder der debouncedSearchTerm ändern
watch(
  [data, debouncedSearchTerm],
  () => {
    const search = debouncedSearchTerm.value.toLowerCase().replace(/\s/g, '')
    const filtered = data.value.filter((person) => {
      const combined =
        `${person.first_name}${person.last_name}${person.email}${person.gender}${person.id}`.toLowerCase()
      return combined.includes(search)
    })
    filteredData.value = filtered.slice(0, 100)
  },
  { immediate: true }
)
</script>

<style scoped>
/* Hier kannst du deinen CSS-Code aus dashboard.css einfügen */
.dashboard {
  /* Beispiel: */
  padding: 1rem;
}

.searchTerm {
  width: 100%;
  padding: 0.5rem;
  margin-bottom: 1rem;
}
</style>
