<script setup lang="ts">
import {onBeforeMount, Ref, ref} from 'vue';
import {useRouter} from 'vue-router';
import sendRequest from '../../client/request';
import {validate, formIsValid} from './services/validation';

const props = defineProps({
  id: {type: String, default: '-1'},
});

const router = useRouter();
const form: Ref<HTMLFormElement | null> = ref(null);
const isValid = ref(false);

const name = ref('');
const password = ref('');
const amountTests = ref();
const amountSheets = ref();
const pointsMax = ref();
const pointsPassed = ref();
const visible = ref(false);
const error: Ref<HTMLParagraphElement | null> = ref(null);

const submit = async () => {
  const params: any = {
    name: name.value,
    amountTests: amountTests.value,
    amountSheets: amountSheets.value,
    pointsMax: pointsMax.value,
    pointsPassed: pointsPassed.value,
    visible: visible.value,
  };
  const functionName = props.id === '-1' ? 'create' : 'update';
  if (props.id === '-1') {
    params.password = password.value;
  } else {
    params.id = props.id;
  }
  const response = await sendRequest('event', functionName, params);
  const resData = await response.json();
  if (response.status === 200) {
    router.back();
  } else {
    (error.value as HTMLParagraphElement).textContent = resData.message;
  }
};

const handlePasswordInput = (event: InputEvent) => {
  const input = event?.target as HTMLInputElement;
  if (input) {
    password.value = input.value;
  }
};

const readData = async () => {
  const response = await sendRequest('event', 'get-data', {id: props.id});
  const resData = await response.json();
  if (response.status === 200) {
    name.value = resData.result.name;
    amountTests.value = resData.result.amountTests;
    amountSheets.value = resData.result.amountSheets;
    pointsMax.value = resData.result.pointsMax;
    pointsPassed.value = resData.result.pointsPassed;
    visible.value = resData.result.visible;
    isValid.value = true;
  } else {
    (error.value as HTMLParagraphElement).textContent = resData.message;
  }
};

onBeforeMount(async () => {
  if (props.id !== '-1') {
    await readData();
  }
});
</script>

<template>
  <form
    ref="form"
    class="event-form"
    @input="isValid = formIsValid(form)"
    @keyup.enter="isValid && submit()"
    @submit.prevent
  >
    <div class="p-fluid">
      <div class="field">
        <label for="reg_name">Name</label>
        <InputText
          id="reg_name"
          v-model="name"
          required
          @blur="validate"
          @keyup="validate"
        />
        <small id="reg_name_help"></small>
      </div>
      <PasswordSecure
        v-if="id === '-1'"
        :value="password"
        @input="handlePasswordInput"
        id="reg_password"
      />
      <div class="field">
        <label for="reg_amountTests">Anzahl Tests</label>
        <InputText
          id="reg_amountTests"
          type="number"
          v-model="amountTests"
          min="0"
          required
          @blur="validate"
          @keyup="validate"
        />
        <small id="reg_amountTests_help"></small>
      </div>
      <div class="field">
        <label for="reg_amountSheets">Anzahl Blätter</label>
        <InputText
          id="reg_amountSheets"
          type="number"
          v-model="amountSheets"
          min="0"
          required
          @blur="validate"
          @keyup="validate"
        />
        <small id="reg_amountSheets_help"></small>
      </div>
      <div class="field">
        <label for="reg_pointsMax">Maximale Punktzahl</label>
        <InputText
          id="reg_pointsMax"
          type="number"
          v-model="pointsMax"
          min="0"
          step="0.5"
          required
          @blur="validate"
          @keyup="validate"
        />
        <small id="reg_pointsMax_help"></small>
      </div>
      <div class="field">
        <label for="reg_pointsPassed">Punktzahl zum Bestehen</label>
        <InputText
          id="reg_pointsPassed"
          type="number"
          v-model="pointsPassed"
          min="0"
          step="0.5"
          required
          @blur="validate"
          @keyup="validate"
        />
        <small id="reg_pointsPassed_help"></small>
      </div>
      <div class="field-checkbox">
        <Checkbox
          class="check"
          v-model="visible"
          :binary="true"
        />
        <label for="reg_visible">Sichtbar</label>
      </div>
      <p
        ref="error"
        class="invalid"
      ></p>
      <Button
        :label="id === '-1' ? 'Anlegen' : 'Aktualisieren'"
        @click="submit"
        :disabled="!isValid"
      />
      <Button
        class="p-button-danger submit-button"
        label="Abbrechen"
        @click="router.back()"
      />
    </div>
  </form>
</template>

<style lang="scss" scoped>
.event-form {
  text-align: left;
  max-width: 500px;
  margin: 0 auto;

  .field {
    padding: 0 0 0.75em 0;
  }
  .field-checkbox {
    .check {
      margin-right: 0.5rem;
    }
  }

  .p-button {
    width: 100%;
    &.p-button-danger {
      max-width: 500px;
      margin-top: 0.5rem;
    }
  }
}
</style>
