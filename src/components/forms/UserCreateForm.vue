<script setup lang="ts">
import {Ref, ref} from 'vue';
import {useRouter} from 'vue-router';
import sendRequest from '../../client/request';
import {validate, formIsValid, handlePasswordInput} from './services/validation';
import cookies from '../../client/cookies';
import {genderOptions} from '../../client/user';

const router = useRouter();
const form: Ref<HTMLFormElement | null> = ref(null);
const isValid = ref(false);

const username = ref('');
const firstName = ref('');
const lastName = ref('');
const gender: Ref<{name: string; code: string} | null> = ref(null);
const matriculationNumber = ref();
const email = ref('');
const password = ref('');
const passwordRepeat = ref('');
const isAdmin = ref(false);
const isTutor = ref(false);
const error: Ref<HTMLParagraphElement | null> = ref(null);

const submit = async () => {
  const params = {
    username: username.value,
    firstName: firstName.value,
    lastName: lastName.value,
    gender: gender.value?.code,
    matriculationNumber: matriculationNumber.value,
    email: email.value,
    password: password.value,
    isAdmin: isAdmin.value,
    isTutor: isTutor.value,
  };
  const response = await sendRequest('user', 'create', params);
  const resData = await response.json();
  if (response.status === 200) {
    router.push('/admin/users');
  } else {
    (error.value as HTMLParagraphElement).textContent = resData.message;
  }
};

const handleInput = () => {
  isValid.value = (formIsValid(form.value) && gender) as boolean;
};
</script>

<template>
  <form
    ref="form"
    class="register-form"
    @input="handleInput"
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
        <label for="reg_gender">Geschlecht</label>
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
        @input="password = handlePasswordInput($event, password)"
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
      <div class="field-checkbox">
        <Checkbox
          class="check"
          v-model="isAdmin"
          :binary="true"
        />
        <label for="reg_isAdmin">Admin</label>
      </div>
      <div class="field-checkbox">
        <Checkbox
          class="check"
          v-model="isTutor"
          :binary="true"
        />
        <label for="reg_isTutor">Tutor</label>
      </div>
    </div>
    <p
      ref="error"
      class="invalid"
    ></p>
    <Button
      label="Registrieren"
      @click="submit"
      :disabled="!isValid"
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
  .field-checkbox {
    & + .field-checkbox {
      margin-top: 0.5rem;
    }
    .check {
      margin-right: 0.5rem;
    }
  }

  .p-button {
    width: 100%;
  }
}
</style>
