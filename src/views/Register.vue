<script setup lang="ts">
import {ref} from 'vue';

const username = ref('');
const firstName = ref('');
const lastName = ref('');
const password = ref('');
</script>

<template>
  <div id="login">
    <h1>Registrieren</h1>
    <div class="login-form">
      <div class="p-fluid">
        <div class="field">
          <label for="reg_username">Benutzername</label>
          <InputText
            id="reg_username"
            v-model="value1"
          />
        </div>
        <div class="field">
          <label for="reg_firstName">Vorname</label>
          <InputText
            id="reg_firstName"
            v-model="value1"
          />
        </div>
        <div class="field">
          <label for="reg_lastName">Nachname</label>
          <InputText
            id="reg_lastName"
            v-model="value1"
          />
        </div>
        <div class="field">
          <label for="reg_matricleNumber">Matrikelnummer</label>
          <InputNumber
            inputId="reg_matricleNumber"
            v-model="value1"
          />
        </div>
        <div class="field">
          <label for="reg_email">E-Mail-Adresse</label>
          <InputText
            type="email"
            id="reg_email"
            v-model="value1"
          />
          <small>Verwenden Sie wenn möglich Ihre E-Mail-Adresse der Hochschule. Neben Datenschutzgründen kann auch eine Zustellung an andere Provider nicht garantiert werden.</small>
        </div>
        <PasswordSecure id="reg_password" />
        <div class="field">
          <label for="reg_password_repeat">Passwort wiederholen</label>
          <Password
            id="reg_password_repeat"
            v-model="password"
            :feedback="false"
            toggleMask
          />
        </div>
      </div>
      <Button label="Registrieren"></Button>
    </div>
    <p>
      Sie haben bereits ein Account?
      <RouterLink to="/login">Anmelden</RouterLink>
    </p>
  </div>
</template>

<style lang="scss" scoped>
#login {
  text-align: center;

  h1 {
    padding-bottom: 0.25em;
  }
  .login-form {
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
}
</style>
