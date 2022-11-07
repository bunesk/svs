<script setup lang="ts">
import {ref} from 'vue';

const username = ref('');
const firstName = ref('');
const lastName = ref('');
const matricleNumber = ref();
const email = ref('');
const password = ref('');
const passwordRepeat = ref('');
</script>

<template>
  <div class="register-form">
    <div class="p-fluid">
      <div class="field">
        <label for="reg_username">Benutzername</label>
        <InputText
          id="reg_username"
          v-model="username"
        />
      </div>
      <div class="field">
        <label for="reg_firstName">Vorname</label>
        <InputText
          id="reg_firstName"
          v-model="firstName"
        />
      </div>
      <div class="field">
        <label for="reg_lastName">Nachname</label>
        <InputText
          id="reg_lastName"
          v-model="lastName"
        />
      </div>
      <div class="field">
        <label for="reg_matricleNumber">Matrikelnummer</label>
        <InputNumber
          inputId="reg_matricleNumber"
          v-model="matricleNumber"
        />
      </div>
      <div class="field">
        <label for="reg_email">E-Mail-Adresse</label>
        <InputText
          type="email"
          id="reg_email"
          v-model="email"
        />
      </div>
      <PasswordSecure
        v-model="password"
        id="reg_password"
      />
      <div class="field">
        <label for="reg_password_repeat">Passwort wiederholen</label>
        <Password
          id="reg_password_repeat"
          v-model="passwordRepeat"
          :feedback="false"
          toggleMask
        />
      </div>
    </div>
    <p>Verwenden Sie wenn möglich Ihre E-Mail-Adresse der Hochschule. Neben Datenschutzgründen kann auch eine Zustellung an andere Provider nicht garantiert werden.</p>
    <Button label="Registrieren"></Button>
  </div>
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
