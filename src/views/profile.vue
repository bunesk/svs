<script setup lang="ts">
import user from '../client/user';
</script>

<template>
  <div v-if="user">
    <RouterLink :to="`/`">
      <Button
        class="navigation-button"
        icon="pi pi-home"
        label="Zurück zur Startseite"
      ></Button>
    </RouterLink>
    <h1>Mein Profil</h1>
    <UserTable :user="user" />
    <ChangeGenderForm />
    <ChangePasswordForm />
  </div>
</template>

<style lang="scss" scoped>
.table {
  display: grid;
  grid-template-columns: 8rem auto;
}
</style>
