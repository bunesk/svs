<script setup lang="ts">
import {Ref, ref} from 'vue';
import {validate, registerFormIsValid} from './services/validation';

const form: Ref<HTMLFormElement | null> = ref(null);
const formIsValid = ref(false);

const username = ref('');
const firstName = ref('');
const lastName = ref('');
const matriculationNumber = ref();
const email = ref('');
const password = ref('');
const passwordRepeat = ref('');
</script>

<template>
  <form
    ref="form"
    class="register-form"
    @input="formIsValid = registerFormIsValid(form)"
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
        v-model="password"
        id="reg_password"
      />
      <div class="field">
        <label for="reg_passwordRepeat">Passwort wiederholen</label>
        <Password
          inputId="reg_passwordRepeat"
          v-model="passwordRepeat"
          :feedback="false"
          toggleMask
          required
          @blur="validate"
          @keyup="validate"
        />
        <small id="reg_passwordRepeat_help"></small>
      </div>
    </div>
    <p>Verwenden Sie wenn möglich Ihre E-Mail-Adresse der Hochschule. Neben Datenschutzgründen kann auch eine Zustellung an andere Provider nicht garantiert werden.</p>
    <Button
      label="Registrieren"
      type="submit"
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
