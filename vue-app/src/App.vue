<script setup>
import Header from "@/components/Header.vue";
</script>

<template>
  <Header></Header>
  <main>
    <router-view :key="$route.fullPath"/>
  </main>
</template>

<style scoped>
main {
  flex-grow: 1;
  padding: 2em;
}

</style>
