<script setup lang="ts">
import {onBeforeMount, Ref, ref} from 'vue';
import {useRoute, useRouter} from 'vue-router';
import sendRequest from '../../client/request';
import {FilterMatchMode} from 'primevue/api';

const props = defineProps({
  /**
   * Item name to use for requests, i.e. user
   */
  name: {type: String, required: true},
  /**
   * Plural item name label
   */
  plural: {type: String, required: true},
  /**
   * Message for removing an item
   */
  removeMessage: {type: String, required: true},
  /**
   * Function to execute to request items
   * (default: get all on item name)
   */
  readFunction: {type: Function, default: null},
  /**
   * Function to execute to send delete request for item
   * (default: remove on item name)
   */
  removeFunction: {type: Function, default: null},
  /**
   * Custom item name for item to view on view/edit button
   */
  viewItemName: {type: String, default: ''},
  /**
   * Fields for global search to filter on
   */
  globalFilterFields: {type: Array, default: []},
  showCreate: {type: Boolean, default: false},
  showRefresh: {type: Boolean, default: false},
  showViewPoints: {type: Boolean, default: false},
});

const route = useRoute();
const router = useRouter();
const status = ref(false);
const message: Ref<HTMLParagraphElement | null> = ref(null);
const items: Ref<any> = ref([]);
const selectedItem: Ref<any> = ref(null);
const filters = ref({global: {value: null, matchMode: FilterMatchMode.CONTAINS}});
const filterFields = ref(props.globalFilterFields as string[]);
const loading = ref(true);

const readItems = async () => {
  const readFunction = props.readFunction ?? (async () => await sendRequest(props.name, 'get-all'));
  const response = await readFunction();
  const resData = await response.json();
  if (response.status === 200) {
    items.value = resData.result;
    loading.value = false;
  } else {
    (message.value as HTMLParagraphElement).textContent = resData.message;
  }
};

const viewItem = async () => {
  if (selectedItem.value) {
    router.push(`/admin/${props.viewItemName || props.name}s/${selectedItem.value.id}`);
  }
};

const viewPoints = async () => {
  if (selectedItem.value) {
    router.push(`/admin/events/${route.params.id}/users/${selectedItem.value.id}`);
  }
};

const removeItem = async () => {
  if (!selectedItem.value) {
    return;
  }
  if (confirm(props.removeMessage)) {
    const removeFunction =
      props.removeFunction ?? (async () => await sendRequest(props.name, 'remove', {id: selectedItem.value.id}));
    const response = await removeFunction(selectedItem.value.id);
    const resData = await response.json();
    if (response.status === 200) {
      items.value = items.value.filter((item: any) => item.id !== selectedItem.value.id);
      selectedItem.value = null;
      status.value = true;
    } else {
      status.value = false;
    }
    (message.value as HTMLParagraphElement).textContent = resData.message;
  }
};

onBeforeMount(async () => {
  await readItems();
});
</script>

<template>
  <p
    ref="message"
    :class="{'valid': status, 'invalid': !status}"
  ></p>
  <DataTable
    :value="items"
    :paginator="true"
    :rows="10"
    dataKey="id"
    :rowHover="true"
    v-model:selection="selectedItem"
    v-model:filters="filters"
    filterDisplay="menu"
    selectionMode="single"
    :loading="loading"
    paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
    :rowsPerPageOptions="[10,25,50]"
    currentPageReportTemplate="Zeige {first} bis {last} von {totalRecords} Einträgen"
    :globalFilterFields="filterFields"
    responsiveLayout="scroll"
  >
    <template #header>
      <div class="flex-container">
        <div class="flex-resize">
          <RouterLink
            v-if="showCreate"
            :to="`/admin/${props.name}s/create`"
            class="create-button"
          >
            <Button
              label="Neu"
              icon="pi pi-plus"
              class="p-button-success"
            ></Button>
          </RouterLink>
          <Button
            v-if="showRefresh"
            label="Aktualisieren"
            icon="pi pi-refresh"
            @click="readItems"
          ></Button>
          <Button
            label="Anzeigen / Bearbeiten"
            icon="pi pi-eye"
            @click="viewItem"
            :disabled="!selectedItem"
          ></Button>
          <Button
            v-if="showViewPoints"
            label="Punkte anzeigen"
            icon="pi pi-eye"
            @click="viewPoints"
            :disabled="!selectedItem"
          ></Button>
          <Button
            label="Löschen"
            icon="pi pi-trash"
            class="p-button-danger"
            @click="removeItem"
            :disabled="!selectedItem"
          />
        </div>
        <span class="p-input-icon-left">
          <i class="pi pi-search" />
          <InputText
            v-model="filters['global'].value"
            placeholder="Suchen..."
          />
        </span>
      </div>
    </template>
    <template #empty>
      Keine {{props.plural}} gefunden.
    </template>
    <template #loading>
      {{props.plural}} werden geladen...
    </template>
    <slot></slot>
  </DataTable>
</template>

<style lang="scss" scoped>
.p-button:not(.p-button-danger) {
  margin-right: 0.5rem;
}
</style>
