<script setup lang="ts">
import {Ref, ref} from 'vue';
import {useRoute} from 'vue-router';
import sendRequest from '../../client/request';
import {validate, formIsValid} from './services/validation';

const route = useRoute();
const form: Ref<HTMLFormElement | null> = ref(null);
const isValid = ref(true);
const pointsMax = ref('');
const status = ref(false);
const message: Ref<HTMLParagraphElement | null> = ref(null);

const createTask = async () => {
  const params = {
    id: route.params.testId,
    pointsMax: pointsMax.value,
  };
  const response = await sendRequest('test', 'create-task', params);
  const resData = await response.json();
  const paragraph = message.value as HTMLParagraphElement;
  status.value = response.status === 200;
  if (status.value && pointsMax.value) {
    pointsMax.value = '';
  }
  paragraph.textContent = resData.message;
};
</script>

<template>
  <h3>Aufgabe erstellen</h3>
  <form
    ref="form"
    @input="isValid = formIsValid(form)"
  >
    <div class="field">
      <label for="task_points">Maximale Punktzahl</label>
      <InputText
        id="task_points"
        v-model="pointsMax"
        type="number"
        min="0.5"
        step="0.5"
        required
        @blur="validate"
        @keyup="validate"
      />
      <Button
        @click="createTask"
        :disabled="!isValid"
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
