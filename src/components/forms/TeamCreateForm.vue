<script setup lang="ts">
import {Ref, ref} from 'vue';
import {useRoute} from 'vue-router';
import sendRequest from '../../client/request';

const route = useRoute();
const block = ref('');
const status = ref(false);
const message: Ref<HTMLParagraphElement | null> = ref(null);

const createTeam = async () => {
  const params = {
    EventId: route.params.id,
    block: block.value,
  };
  const response = await sendRequest('team', 'create', params);
  const resData = await response.json();
  const paragraph = message.value as HTMLParagraphElement;
  status.value = response.status === 200;
  if (status.value && block.value) {
    block.value = '';
  }
  paragraph.textContent = resData.message;
};
</script>

<template>
  <h3>Team erstellen</h3>
  <form>
    <div class="field">
      <label for="team_block">Block</label>
      <InputText
        id="team_block"
        v-model="block"
      />
      <Button
        @click="createTeam"
        :disabled="!block"
        label="Erstellen"
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
