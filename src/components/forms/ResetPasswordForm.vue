<script setup lang="ts">
import {Ref, ref} from 'vue';
import sendRequest from '../../client/request';
import {validate, formIsValid, handlePasswordInput} from './services/validation';

const props = defineProps({
  id: {type: String, required: true},
  item: {type: String, required: true},
});

const form: Ref<HTMLFormElement | null> = ref(null);
const isValid = ref(false);
const status = ref(false);
const message: Ref<HTMLParagraphElement | null> = ref(null);
const passwordNew = ref('');
const passwordRepeat = ref('');

const changePassword = async () => {
  const params = {
    id: props.id,
    passwordNew: passwordNew.value,
  };
  const response = await sendRequest(props.item, 'reset-password', params);
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
  <h2>Passwort zurücksetzen</h2>
  <form
    ref="form"
    class="reset-password-form"
    @input="isValid = formIsValid(form)"
  >
    <div class="p-fluid">
      <PasswordSecure
        :value="passwordNew"
        @input="passwordNew = handlePasswordInput($event, passwordNew)"
        id="profile_passwordNew"
        label="Passwort"
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
.reset-password-form {
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
