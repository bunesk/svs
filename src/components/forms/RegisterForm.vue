<script setup lang="ts">
import {Ref, ref} from 'vue';
import sendRequest from '../../client/request';
import {validate, registerFormIsValid} from './services/validation';
import cookies from '../../client/cookies';

const form: Ref<HTMLFormElement | null> = ref(null);
const formIsValid = ref(false);

const username = ref('');
const firstName = ref('');
const lastName = ref('');
const gender: Ref<{name: string; code: string} | null> = ref(null);
const matriculationNumber = ref();
const email = ref('');
const password = ref('');
const passwordRepeat = ref('');
const error: Ref<HTMLParagraphElement | null> = ref(null);

const genderOptions = ref([
  {name: 'Männlich', code: 'male'},
  {name: 'Weiblich', code: 'female'},
  {name: 'Divers', code: 'diverse'},
]);

const submit = async () => {
  const params = {
    username: username.value,
    firstName: firstName.value,
    lastName: lastName.value,
    gender: gender.value?.code,
    matriculationNumber: matriculationNumber.value,
    email: email.value,
    password: password.value,
  };
  const response = await sendRequest('user', 'register', params);
  const resData = await response.json();
  if (response.status === 200) {
    cookies.set('auth', resData.result.jwtToken);
    window.location.href = window.location.href.split('register')[0];
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
    @input="formIsValid = registerFormIsValid(form) && gender"
  >
    <div class="p-fluid">
      <div class="field">
        <label for="reg_username">Benutzername</label>
        <InputText
          id="reg_username"
          v-model="username"
          required
          @blur="validate"
          @keyup="validate"
        />
        <small id="reg_username_help"></small>
      </div>
      <div class="field">
        <label for="reg_firstName">Vorname</label>
        <InputText
          id="reg_firstName"
          v-model="firstName"
          required
          @blur="validate"
          @keyup="validate"
        />
        <small id="reg_firstName_help"></small>
      </div>
      <div class="field">
        <label for="reg_lastName">Nachname</label>
        <InputText
          id="reg_lastName"
          v-model="lastName"
          required
          @blur="validate"
          @keyup="validate"
        />
        <small id="reg_lastName_help"></small>
      </div>
      <div class="field">
        <label for="reg_lastName">Geschlecht</label>
        <Dropdown
          id="reg_gender"
          v-model="gender"
          :options="genderOptions"
          optionLabel="name"
        />
      </div>
      <div class="field">
        <label for="reg_matriculationNumber">Matrikelnummer</label>
        <InputText
          id="reg_matriculationNumber"
          v-model="matriculationNumber"
          required
          @blur="validate"
          @keyup="validate"
        />
        <small id="reg_matriculationNumber_help"></small>
      </div>
      <div class="field">
        <label for="reg_email">E-Mail-Adresse</label>
        <InputText
          type="email"
          id="reg_email"
          v-model="email"
          required
          @blur="validate"
          @keyup="validate"
        />
        <small id="reg_email_help"></small>
      </div>
      <PasswordSecure
        :value="password"
        @input="handlePasswordInput"
        id="reg_password"
      />
      <div class="field">
        <label for="reg_passwordRepeat">Passwort wiederholen</label>
        <Password
          inputId="reg_passwordRepeat"
          :feedback="false"
          v-model="passwordRepeat"
          toggleMask
          required
          @blur="validate"
          @keyup="validate"
        />
        <small id="reg_passwordRepeat_help"></small>
      </div>
    </div>
    <p>Verwenden Sie wenn möglich Ihre E-Mail-Adresse der Hochschule. Neben Datenschutzgründen kann auch eine Zustellung an andere Provider nicht garantiert werden.</p>
    <p
      ref="error"
      class="invalid"
    ></p>
    <Button
      label="Registrieren"
      @click="submit"
      :disabled="!formIsValid"
    />
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

  .p-button {
    width: 100%;
  }
}
</style>
