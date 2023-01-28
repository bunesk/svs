<script setup lang="ts">
import user from '../client/user';
</script>

<template>
  <div>
    <h1>Startseite</h1>
    <p>Willkommen im SVS.</p>
    <div v-if="user">
      <RouterLink
        v-show="!user.isAdmin && !user.isTutor"
        to="/events"
      >
        <Button
          icon="pi pi-list"
          label="Veranstaltungen"
        />
      </RouterLink>
      <RouterLink to="/profile">
        <Button
          icon="pi pi-user"
          label="Mein Profil"
        />
      </RouterLink>
      <RouterLink
        v-show="user.isAdmin"
        to="/admin"
      >
        <Button label="Admin" />
      </RouterLink>
      <RouterLink
        v-show="user.isTutor || user.isAdmin"
        :to="`/rate`"
      >
        <Button label="Test oder Blatt bewerten" />
      </RouterLink>
    </div>
    <div v-else>
      Bitte warten...
    </div>
  </div>
</template>

<style lang="scss" scoped>
.p-button {
  margin-right: 0.5rem;
}
</style>
