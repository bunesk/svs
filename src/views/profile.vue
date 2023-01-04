<script setup lang="ts">
import user from '../client/user';
</script>

<template>
  <div v-if="user">
    <h1>Profil</h1>
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
