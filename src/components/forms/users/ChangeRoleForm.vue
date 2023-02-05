<script setup lang="ts">
import {Ref, ref} from 'vue';
import sendRequest from '../../../client/request';
import {roleOptions} from '../../../client/user';

const props = defineProps({
  user: {type: Object, required: true},
});

const role: Ref<{name: string; code: string} | null> = ref(null);
const status = ref(false);
const message: Ref<HTMLParagraphElement | null> = ref(null);

const changeRole = async () => {
  const params = {
    id: props.user.id,
    role: role.value,
  };
  const response = await sendRequest('user', 'change-role', params);
  const resData = await response.json();
  const paragraph = message.value as HTMLParagraphElement;
  status.value = response.status === 200;
  if (status.value) {
    props.user.role = role.value;
    role.value = null;
  }
  paragraph.textContent = resData.message;
};
</script>

<template>
  <h2>Rolle ändern</h2>
  <form @keyup.enter="role && changeRole()">
    <div class="field">
      <label for="profile_role">Rolle</label>
      <Dropdown
        id="profile_role"
        v-model="role"
        :options="roleOptions"
      />
      <Button
        @click="changeRole"
        :disabled="!role"
      >Aktualisieren</Button>
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
