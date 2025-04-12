<template>
  <div class="card">
    <img
      :src="getImageSrc()"
      :alt="`${person.first_name} ${person.last_name} Avatar`"
      width="256"
      height="256"
      loading="lazy"
    />
    <div :id="`person_${person.id}`" class="person-info">
      <p><strong>{{ person.id }}: {{ person.first_name }} {{ person.last_name }}</strong></p>
      <p>{{ person.email }}</p>
      <p>{{ person.gender }}</p>
      <p class="balance">{{ person.balance }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
export interface Person {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  gender: "Male" | "Female" | "Genderqueer";
  avatar: string;
  balance: string;
}

const props = defineProps<{
  person: Person;
}>()

const getImageSrc = () => {
  switch (props.person.gender) {
    case "Male":
      return `profileIconMale.png?name=${props.person.id}`
    case "Female":
      return `profileIconFemale.png?name=${props.person.id}`
    default:
      return `profileIconDefault.png?name=${props.person.id}`
  }
}
</script>

<style scoped>
.card {
  margin-bottom: 1em;
  height: 6em;
  box-shadow: 1px 3px 3px rgba(0, 10, 20, 0.06);
  background-color: white;
  display: flex;
  padding: 1em;
  gap: 1em;
  border-radius: 0.25em;
}

img {
  max-width: 3em;
  height: fit-content;
}
.person-info {
  flex-grow: 1;

  p {
    margin: 0 0 0.5em 0;

    &.balance {
      font-size: 1.5em;
      font-weight: bold;
      text-align: end;
    }
  }

}
</style>
