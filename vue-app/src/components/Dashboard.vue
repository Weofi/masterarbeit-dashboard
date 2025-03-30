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
        <Card :person="person"/>
      </li>
    </ul>
  </div>
</template>

<script setup>
import {ref, watch} from 'vue'
import {useRoute} from 'vue-router'
import axios from 'axios'
import Card from "./Card.vue";

// Props definieren
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

const route = useRoute()

// Daten basierend auf dataSet laden
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

// Lade Daten, wenn sich dataSet ändert
watch(
  () => props.dataSet,
  (newSize) => {
    fetchData(newSize)
  },
  {immediate: true}
)

// Debounce für searchTerm
watch(
  searchTerm,
  (newTerm, _, onCleanup) => {
    const handler = setTimeout(() => {
      debouncedSearchTerm.value = newTerm
    }, 300)
    onCleanup(() => clearTimeout(handler))
  }
)

// Filtere die Daten bei Änderung der Daten oder des debouncedSearchTerm
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
  {immediate: true}
)

</script>

<style scoped>
.dashboard {
  display: block;
  max-width: 80em;
  margin: auto;
}

ul {
  list-style-type: none;
  padding: 0;
}
</style>
