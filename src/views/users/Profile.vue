<script setup lang="ts">
import {genderOptions, default as user} from '../../client/user';

const getGenderLabel = (code: string): string => {
  for (const option of genderOptions) {
    if (option.code === code) {
      return option.name;
    }
  }
  return '';
};
</script>

<template>
  <div>
    <h1>Profil</h1>
    <div
      v-if="user"
      class="table"
    >
      <span class="row-title">Benutzername:</span>
      <span class="row-value">{{user.username}}</span>
      <span class="row-title">Vorname:</span>
      <span class="row-value">{{user.firstName}}</span>
      <span class="row-title">Nachname:</span>
      <span class="row-value">{{user.lastName}}</span>
      <span class="row-title">Geschlecht:</span>
      <span class="row-value">{{getGenderLabel(user.gender)}}</span>
      <span class="row-title">Matrikelnummer:</span>
      <span class="row-value">{{user.matriculationNumber}}</span>
      <span class="row-title">E-Mail:</span>
      <span class="row-value">{{user.email}}</span>
    </div>
  </div>
  <ChangeGenderForm />
  <ChangePasswordForm />
</template>

<style lang="scss" scoped>
.table {
  display: grid;
  grid-template-columns: 8rem auto;
}
</style>
