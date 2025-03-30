<template>
  <header>
    <nav>
      <router-link to="/" exact>Vue Dashboard</router-link>
      <div class="spacer"></div>
      <router-link to="/1k" exact>Dashboard 1k</router-link>
      <router-link to="/10k" exact>Dashboard 10k</router-link>
      <router-link to="/100k">Dashboard 100k</router-link>
      <router-link to="/1M">Dashboard 1M</router-link>
    </nav>
  </header>
</template>

<script setup>
</script>

<style scoped>
header {
  background: mediumseagreen;
  padding: 1em 2em;

  nav {
    max-width: 80em;
    margin: auto;
    display: flex;
    gap: 1em;
    align-items: center;

    .active {
      text-decoration: underline;
    }

    a {
      color: white;
      text-decoration: none;

      &:hover {
        text-decoration: underline;
      }
    }

    .spacer {
      flex-grow: 1;
    }
  }
}

</style>
