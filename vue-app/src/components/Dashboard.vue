<script setup>
import Card from "@/components/Card.vue";
import {computed, onMounted, ref, watch} from "vue";
import axios from "axios";

const props = defineProps(['dataSet'])
const data = ref([]);
const searchTerm = ref('');
const debouncedSearchTerm = ref('');

const filteredData = computed(() => {
  return data.value
    .filter((person) =>
      (person.first_name + person.last_name + person.email + person.gender + person.id)
        .toLowerCase()
        .includes(debouncedSearchTerm.value.toLowerCase().replaceAll(' ', ''))
    )
    .slice(0, 100);
});

watch(searchTerm, (newTerm) => {
  clearTimeout(debouncedSearchTerm.timeout);
  debouncedSearchTerm.timeout = setTimeout(() => {
    debouncedSearchTerm.value = newTerm;
  }, 300);
});

const fetchData = async (size) => {
  let result;
  if (size === 1000) result = await axios.get("/MOCK_DATA.json").then((res) => res.data);
  else if (size === 10_000) result = await axios.get("/MOCK_DATA_10_000.json").then((res) => res.data);
  else if (size === 100_000) result = await axios.get("/MOCK_DATA_100_000.json").then((res) => res.data);
  else if (size === 1_000_000) result = await axios.get("/MOCK_DATA_1_000_000.json").then((res) => res.data);  // Manuell JSON parsen
  data.value = result;
};

onMounted(() => fetchData(props.dataSet))
</script>

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
        <Card :person="person" />
      </li>
    </ul>
  </div>
</template>

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
