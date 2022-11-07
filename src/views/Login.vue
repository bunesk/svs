<script setup lang="ts">
import {ref} from 'vue';

const username = ref('');
const password = ref('');
</script>

<template>
  <div id="login">
    <h1>Anmelden</h1>
    <div class="login-form">
      <div class="p-inputgroup">
        <span class="p-inputgroup-addon">
          <i class="pi pi-user"></i>
        </span>
        <InputText
          v-model="username"
          placeholder="Benutzername"
        />
      </div>
      <div class="p-inputgroup">
        <span class="p-inputgroup-addon">
          <i class="pi pi-key"></i>
        </span>
        <Password
          v-model="password"
          placeholder="Passwort"
          :feedback="false"
          toggleMask
        />
      </div>
      <Button label="Anmelden"></Button>
    </div>
    <p>
      Noch kein Account?
      <RouterLink to="/register">Registrieren</RouterLink>
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
    max-width: 500px;
    margin: 0 auto;

    > .p-inputgroup {
      padding: 0 0 0.75em 0;
    }

    .p-button {
      width: 100%;
    }
  }
}
</style>
