<script setup lang="ts">
import user from '../../client/user';
console.log(user);
</script>

<template>
  <div>
    <h1>Profil</h1>
    <div class="table">
      <span class="row-title">Benutzername:</span>
      <span class="row-value">{{user?.username}}</span>
      <span class="row-title">Vorname:</span>
      <span class="row-value">{{user?.firstName}}</span>
      <span class="row-title">Nachname:</span>
      <span class="row-value">{{user?.lastName}}</span>
      <span class="row-title">Geschlecht:</span>
      <span class="row-value">{{user?.gender}}</span>
      <span class="row-title">Matrikelnummer:</span>
      <span class="row-value">{{user?.matriculationNumber}}</span>
      <span class="row-title">E-Mail:</span>
      <span class="row-value">{{user?.email}}</span>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.table {
  display: grid;
  grid-template-columns: 8rem auto;
}
</style>
