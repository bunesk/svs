<script setup lang="ts">
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
</script>

<template>
  <div class="field">
    <label :for="id">Passwort</label>
    <Password
      :id="id"
      v-model="value"
      toggleMask
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
