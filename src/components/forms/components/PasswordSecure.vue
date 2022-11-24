<script setup lang="ts">
import {validate} from '../services/validation';

const props = defineProps({
  id: {type: String, required: true},
  value: {type: String, default: ''},
});
const pwLength = 8;

const requirements = [
  {
    text: `Mindestens ${pwLength} Zeichen`,
    valid: () => props.value.length >= pwLength,
    afterText: () => `[${props.value.length}/${pwLength}]`,
  },
  {
    text: 'Mindestens ein Kleinbuchstabe (a-z)',
    valid: () => /[a-z]/.test(props.value),
  },
  {
    text: 'Mindestens ein Großbuchstabe (A-Z)',
    valid: () => /[A-Z]/.test(props.value),
  },
  {
    text: 'Mindestens eine Ziffer (0-9)',
    valid: () => /\d/.test(props.value),
  },
  {
    text: 'Mindestens ein Symbol',
    valid: () => /[^\da-zA-Z]/.test(props.value),
  },
];

const valid = () => {
  for (const requirement of requirements) {
    if (!requirement.valid()) {
      return false;
    }
  }
  return true;
};
</script>

<template>
  <div class="field">
    <label :for="id">Passwort</label>
    <Password
      :class="{'invalid-border': !valid()}"
      :inputId="id"
      v-model="value"
      toggleMask
      @blur="validate"
      @keyup="validate"
      @input="$emit('input')"
    >
      <template #content>Wähle ein Passwort.</template>
      <template #footer>
        <Divider />
        <p class="mt-2">Vorgaben:</p>
        <ul>
          <li
            v-for="requirement of requirements"
            :key="requirement.text"
          >
            <i
              class="pi"
              :class="{
              'pi-check-circle': requirement.valid(),
              'pi-times-circle': !requirement.valid(),
              'valid': requirement.valid(),
              'invalid': !requirement.valid(),
            }"
            ></i>
            {{ requirement.text }} {{ requirement.afterText ? requirement.afterText() : '' }}
          </li>
        </ul>
      </template>
    </Password>
    <small id="reg_password_help"></small>
  </div>
</template>

<style lang="scss" scoped>
ul {
  list-style-type: none;
  line-height: 1.5;
  margin-left: -2.4em;
}
.pi {
  font-size: 0.8em;
}
</style>
