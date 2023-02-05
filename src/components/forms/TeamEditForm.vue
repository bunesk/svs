<script setup lang="ts">
import {Ref, ref} from 'vue';
import {useRoute} from 'vue-router';
import sendRequest from '../../client/request';
import {validate, formIsValid} from './services/validation';

const props = defineProps({
  team: {type: Object, required: true},
});

const route = useRoute();
const form: Ref<HTMLFormElement | null> = ref(null);
const isValid = ref(true);
const status = ref(false);
const message: Ref<HTMLParagraphElement | null> = ref(null);
const block = ref(props.team.block);
const number = ref(props.team.number);

const editTeam = async () => {
  const params = {
    id: route.params.teamId,
    block: block.value,
    number: number.value,
  };
  const response = await sendRequest('team', 'update', params);
  const resData = await response.json();
  const paragraph = message.value as HTMLParagraphElement;
  status.value = response.status === 200;
  if (status.value) {
    props.team.name = `Team ${block.value}-${number.value}`;
  }
  paragraph.textContent = resData.message;
};
</script>

<template>
  <h3>Team bearbeiten</h3>
  <form
    ref="form"
    @input="isValid = formIsValid(form)"
    @keyup.enter="isValid && editTeam()"
    @submit.prevent
  >
    <div class="p-fluid">
      <div class="field">
        <label for="team_block">Block</label>
        <InputText
          id="team_block"
          v-model="block"
          required
          @blur="validate"
          @keyup="validate"
        />
      </div>
      <div class="field">
        <label for="team_block">Nummer</label>
        <InputText
          id="team_number"
          type="number"
          v-model="number"
          min="1"
          required
          @blur="validate"
          @keyup="validate"
        />
      </div>
    </div>
    <Button
      @click="editTeam"
      :disabled="!isValid"
      label="Änderungen speichern"
    />
    <p
      ref="message"
      :class="{'valid': status, 'invalid': !status}"
    ></p>
  </form>
</template>

<style lang="scss" scoped>
.field {
  padding: 0 0 0.75em 0;
  max-width: 25rem;

  label {
    margin-right: 0.5rem;
  }
}
.p-button {
  width: 100%;
  max-width: 25rem;
  margin-top: 0.25rem;
}
</style>
