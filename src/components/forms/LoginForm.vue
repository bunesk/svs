<script setup lang="ts">
import {ref, Ref} from 'vue';
import sendRequest from '../../client/request';
import {validate} from './services/validation';

const form: Ref<HTMLFormElement | null> = ref(null);
const username = ref('');
const password = ref('');
const error: Ref<HTMLParagraphElement | null> = ref(null);

const submit = async () => {
  const params = {
    username: username.value,
    password: password.value,
  };
  const response = await sendRequest('user', 'login', params);
  const resData = await response.json();
  if (response.status === 200) {
    window.location.href = window.location.href.split('login')[0];
  } else {
    (error.value as HTMLParagraphElement).textContent = resData.message;
  }
};
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
    <p
      ref="error"
      class="invalid"
    ></p>
    <Button
      label="Anmelden"
      :disabled="!form?.checkValidity()"
      @click="submit"
    />
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

  p.invalid {
    margin-top: 0;
    text-align: left;
  }
}
</style>
