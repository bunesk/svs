<script setup lang="ts">
</script>

<template>
  <div id="user-create">
    <h1>Benutzer erstellen</h1>
    <UserCreateForm />
    <RouterLink :to="`/admin/users`">
      <Button
        class="p-button-danger submit-button"
        label="Abbrechen"
      />
    </RouterLink>
  </div>
</template>

<style lang="scss" scoped>
#user-create {
  text-align: center;
}
.p-button {
  width: 100%;
  max-width: 500px;
  margin-top: 0.5rem;
}
</style>
