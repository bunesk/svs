<script setup lang="ts">
import {onBeforeMount, Ref, ref} from 'vue';
import {useRoute} from 'vue-router';
import sendRequest from '../../../client/request';

const props = defineProps({
  readFunction: {type: Function, required: true},
  addMemberFunction: {type: Function, required: true},
});

const route = useRoute();
const user: Ref<any> = ref(null);
const users = ref([]);
const status = ref(false);
const message: Ref<HTMLParagraphElement | null> = ref(null);

const readUsers = async () => {
  const response = await props.readFunction();
  const resData = await response.json();
  const paragraph = message.value as HTMLParagraphElement;
  status.value = response.status === 200;
  if (status.value) {
    users.value = resData.result;
  } else {
    paragraph.textContent = resData.message;
  }
};

const addMember = async () => {
  const response = await props.addMemberFunction(user.value.id);
  const resData = await response.json();
  const paragraph = message.value as HTMLParagraphElement;
  status.value = response.status === 200;
  if (status.value && user.value) {
    user.value = null;
  }
  paragraph.textContent = resData.message;
};

onBeforeMount(async () => {
  await readUsers();
});
</script>

<template>
  <h3>Mitglied hinzufügen</h3>
  <form>
    <div class="field">
      <label for="member">Benutzer</label>
      <Dropdown
        id="member"
        v-model="user"
        :options="users"
        optionLabel="fullName"
        :editable="true"
      />
      <Button
        @click="addMember"
        :disabled="!user"
        label="Hinzufügen"
        class="p-button-success"
      />
    </div>
    <p
      ref="message"
      :class="{'valid': status, 'invalid': !status}"
    ></p>
  </form>
</template>

<style lang="scss" scoped>
label {
  margin-right: 0.5rem;
}
:deep(.p-dropdown-label) {
  min-width: 6rem;
}
.p-button {
  margin-left: 0.5rem;
}
</style>
