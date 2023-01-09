<script setup lang="ts">
import {tableColumns} from '../../client/user';
</script>

<template>
  <AbstractList
    name="user"
    plural="Benutzer"
    removeMessage="Möchten Sie diesen Benutzer wirklich löschen?"
    :globalFilterFields="['username','firstName','lastName', 'genderLabel', 'matriculationNumber', 'email', 'role']"
    showCreate
  >
    <Column
      v-for="column of Object.keys(tableColumns)"
      :key="column"
      :field="column"
      :header="tableColumns[column]"
      :sortable="true"
    ></Column>
  </AbstractList>
</template>

<style lang="scss" scoped>
</style>
