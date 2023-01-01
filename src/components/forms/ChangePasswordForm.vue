<script setup lang="ts">
import {Ref, ref} from 'vue';
import sendRequest from '../../client/request';
import user from '../../client/user';
import {validate, formIsValid, handlePasswordInput} from './services/validation';

console.log(user);

const form: Ref<HTMLFormElement | null> = ref(null);
const isValid = ref(false);
const status = ref(false);
const message: Ref<HTMLParagraphElement | null> = ref(null);
const passwordOld = ref('');
const passwordNew = ref('');
const passwordRepeat = ref('');

const changePassword = async () => {
  const params = {
    passwordOld: passwordOld.value,
    passwordNew: passwordNew.value,
  };
  const response = await sendRequest('user', 'change-password', params);
  const resData = await response.json();
  const paragraph = message.value as HTMLParagraphElement;
  status.value = response.status === 200;
  if (status.value) {
    form.value?.reset();
  }
  paragraph.textContent = resData.message;
};
</script>

<template>
  <h2>Passwort ändern</h2>
  <form
    ref="form"
    class="change-password-form"
    @input="isValid = formIsValid(form)"
  >
    <div class="p-fluid">
      <div class="field">
        <label for="profile_passwordOld">Altes Passwort</label>
        <Password
          inputId="profile_passwordOld"
          :feedback="false"
          v-model="passwordOld"
          toggleMask
          required
          @blur="validate"
          @keyup="validate"
        />
        <small id="profile_passwordOld_help"></small>
      </div>
      <PasswordSecure
        :value="passwordNew"
        @input="passwordNew = handlePasswordInput($event, passwordNew)"
        id="profile_passwordNew"
        label="Neues Passwort"
      />
      <div class="field">
        <label for="profile_passwordRepeat">Neues Passwort wiederholen</label>
        <Password
          inputId="profile_passwordRepeat"
          :feedback="false"
          v-model="passwordRepeat"
          toggleMask
          required
          @blur="validate"
          @keyup="validate"
        />
        <small id="profile_passwordRepeat_help"></small>
      </div>
    </div>
    <Button
      label="Passwort aktualisieren"
      @click="changePassword"
      :disabled="!isValid"
    />
    <p
      ref="message"
      :class="{'valid': status, 'invalid': !status}"
    ></p>
  </form>
</template>

<style lang="scss" scoped>
.change-password-form {
  .field {
    padding-bottom: 0.75rem;
    max-width: 25rem;
  }
  .p-button {
    width: 100%;
    max-width: 25rem;
    margin-top: 0.25rem;
  }
}
</style>
