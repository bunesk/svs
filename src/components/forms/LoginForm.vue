<script setup lang="ts">
import {ref} from 'vue';
import {validate} from './validation';

const form = ref(null);
const username = ref('');
const password = ref('');
</script>

<template>
  <form
    ref="form"
    class="login-form"
  >
    <div class="p-inputgroup">
      <span class="p-inputgroup-addon">
        <i class="pi pi-user"></i>
      </span>
      <InputText
        v-model="username"
        placeholder="Benutzername"
        required
        @blur="validate"
        @keyup="validate"
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
        required
        @blur="validate"
        @keyup="validate"
      />
    </div>
    <Button
      label="Anmelden"
      type="submit"
      :disabled="!form?.checkValidity()"
    ></Button>
  </form>
</template>

<style lang="scss" scoped>
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
</style>
