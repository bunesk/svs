<script setup lang="ts">
</script>

<template>
  <p
    ref="message"
    :class="{'valid': status, 'invalid': !status}"
  ></p>
  <AbstractList
    name="user"
    plural="Benutzer"
    removeMessage="Möchten Sie diese Veranstaltung wirklich löschen?"
    :globalFilterFields="['username','firstName','lastName', 'genderLabel', 'matriculationNumber', 'email', 'role']"
  >
    <Column
      field="username"
      header="Benutzername"
      :sortable="true"
    ></Column>
    <Column
      field="firstName"
      header="Vorname"
      :sortable="true"
    ></Column>
    <Column
      field="lastName"
      header="Nachname"
      :sortable="true"
    ></Column>
    <Column
      field="genderLabel"
      header="Geschlecht"
      :sortable="true"
    ></Column>
    <Column
      field="matriculationNumber"
      header="Matrikelnummer"
      :sortable="true"
    ></Column>
    <Column
      field="email"
      header="E-Mail"
      :sortable="true"
    ></Column>
    <Column
      field="role"
      header="Rolle"
      :sortable="true"
    ></Column>
  </AbstractList>
</template>

<style lang="scss" scoped>
</style>
