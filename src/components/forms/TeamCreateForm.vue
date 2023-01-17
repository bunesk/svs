<script setup lang="ts">
import {Ref, ref} from 'vue';
import {useRoute} from 'vue-router';
import sendRequest from '../../client/request';

const route = useRoute();
const user: Ref<any> = ref(null);
const users = ref([]);
const status = ref(false);
const message: Ref<HTMLParagraphElement | null> = ref(null);

const addMember = async () => {
  const params = {
    eventId: route.params.id,
    userId: user.value?.id,
  };
  const response = await sendRequest('event', 'add-member', params);
  const resData = await response.json();
  const paragraph = message.value as HTMLParagraphElement;
  status.value = response.status === 200;
  if (status.value && user.value) {
    user.value = null;
  }
  paragraph.textContent = resData.message;
};
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
      />
      <Button
        @click="addMember"
        :disabled="!user"
        label="Hinzufügen"
        class="p-button-success"
      >Hinzufügen</Button>
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
