<script setup lang="ts">
</script>

<template>
  <AbstractList
    name="event"
    plural="Veranstaltungen"
    removeMessage="Möchten Sie diese Veranstaltung wirklich löschen?"
    :globalFilterFields="['name']"
    showCreate
  >
    <Column
      field="name"
      header="Name"
      :sortable="true"
    ></Column>
    <Column
      field="amountTests"
      header="Anzahl Tests"
      :sortable="true"
    ></Column>
    <Column
      field="amountSheets"
      header="Anzahl Blätter"
      :sortable="true"
    ></Column>
    <Column
      field="pointsMax"
      header="Maximale Punkte"
      :sortable="true"
    ></Column>
    <Column
      field="pointsPassed"
      header="Punkte zum Bestehen"
      :sortable="true"
    ></Column>
    <Column
      field="visibleLabel"
      header="Sichtbar"
      :sortable="true"
    ></Column>
  </AbstractList>
</template>

<style lang="scss" scoped>
</style>
