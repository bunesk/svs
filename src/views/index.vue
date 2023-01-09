<script setup lang="ts">
import user from '../client/user';
</script>

<template>
  <div>
    <h1>Startseite</h1>
    <p>Willkommen im SVS.</p>
    <RouterLink to="/events">
      <Button label="Veranstaltungen" />
    </RouterLink>&nbsp;
    <RouterLink to="/profile">
      <Button label="Mein Profil" />
    </RouterLink>&nbsp;
    <RouterLink
      v-if="user && user.isAdmin"
      to="/admin"
    >
      <Button label="Admin" />
    </RouterLink>&nbsp;
  </div>
</template>

<style lang="scss" scoped>
</style>
