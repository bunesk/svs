<script setup lang="ts">
import {Ref, ref} from 'vue';
import {useRouter} from 'vue-router';
import sendRequest from '../../client/request';
import {validate, formIsValid} from './services/validation';

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
  const params = {
    name: name.value,
    password: password.value,
    amountTests: amountTests.value,
    amountSheets: amountSheets.value,
    pointsMax: pointsMax.value,
    pointsPassed: pointsPassed.value,
    visible: visible.value,
  };
  const response = await sendRequest('event', 'create', params);
  const resData = await response.json();
  if (response.status === 200) {
    router.push('/admin/events');
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
</script>

<template>
  <form
    ref="form"
    class="register-form"
    @input="isValid = formIsValid(form)"
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
        label="Anlegen"
        @blur="submit"
        :disabled="!isValid"
      />
    </div>
  </form>
</template>

<style lang="scss" scoped>
.register-form {
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
  }
}
</style>
