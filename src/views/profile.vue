<script setup lang="ts">
import user from '../client/user';
</script>

<template>
  <div v-if="user">
    <h1>Profil</h1>
    <div class="table">
      <span class="row-title">Benutzername:</span>
      <span class="row-value">{{user.username}}</span>
      <span class="row-title">Vorname:</span>
      <span class="row-value">{{user.firstName}}</span>
      <span class="row-title">Nachname:</span>
      <span class="row-value">{{user.lastName}}</span>
      <span class="row-title">Geschlecht:</span>
      <span class="row-value">{{user.genderLabel}}</span>
      <span class="row-title">Matrikelnummer:</span>
      <span class="row-value">{{user.matriculationNumber}}</span>
      <span class="row-title">E-Mail:</span>
      <span class="row-value">{{user.email}}</span>
      <span class="row-title">Rolle:</span>
      <span class="row-value">{{user.role}}</span>
    </div>
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
